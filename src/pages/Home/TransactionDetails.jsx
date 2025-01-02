import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register the required elements for the Line chart
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

const TransactionDetails = () => {
  const data = {
    labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"],
    datasets: [
      {
        label: "Transactions",
        data: [200, 400, 300, 500, 600, 400, 800],
        borderColor: "#36a2eb",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.3, // Smooth lines
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Important for allowing container control
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Transaction Details</h3>
      <div style={{ height: "300px", overflow: "hidden" }}>
        {" "}
        {/* Set fixed height */}
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default TransactionDetails;
