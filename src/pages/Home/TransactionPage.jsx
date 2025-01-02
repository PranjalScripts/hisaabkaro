import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

// Register necessary components for Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

const TransactionPage = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/api/v4/transaction/get-transactions/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Process the transaction data for charting
        const transactions = response.data.data;
        const labels = [];
        const amounts = [];

        transactions.forEach((transaction) => {
          transaction.transactionHistory.forEach((history) => {
            labels.push(new Date(history.transactionDate).toLocaleDateString()); // Date as label
            amounts.push(history.amount || 0); // Amount to plot (use 0 if no amount)
          });
        });

        // Prepare chart data
        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Transaction Amount",
              data: amounts,
              borderColor: "rgba(75,192,192,1)", // Line color
              borderWidth: 1,
              fill: false,
              pointRadius: 5, // Make sure points are visible
              pointBackgroundColor: "rgba(75,192,192,1)", // Color of points
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [userId]);

  const config = {
    type: "line",
    data: chartData,
    options: {
      animations: {
        tension: {
          duration: 1000,
          easing: "linear",
          from: 1,
          to: 0,
          loop: true,
        },
      },
      scales: {
        y: {
          min: Math.min(...(chartData.datasets?.[0]?.data || [0])),
          max: Math.max(...(chartData.datasets?.[0]?.data || [100])),
        },
      },
    },
  };

  return (
    <div className="d-flex" style={{ "padding-left": "8rem" }}>
      <h1 style={{ "padding-left": "10rem" }}>Transaction Details</h1>
      <div style={{ width: "600px", height: "400px" }}>
        {chartData.labels.length > 0 ? (
          <Line data={chartData} options={config.options} />
        ) : (
          <p>Loading data...</p>
        )}
      </div>
    </div>
  );
};

export default TransactionPage;
