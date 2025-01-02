import React, { useState, useEffect, useRef } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { toast } from "react-toastify";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const [data, setData] = useState({
    labels: ["Books", "Clients"],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: [
          "rgba(54, 162, 235, 0.8)",  // Bright blue for Books
          "rgba(75, 192, 192, 0.8)",  // Teal for Clients
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  });
  const [loading, setLoading] = useState(true);
  const isFetched = useRef(false);

  const fetchData = async () => {
    if (isFetched.current) return;
    isFetched.current = true;
    
    try {
      const [booksResponse, clientsResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_URL}/api/v2/transactionBooks/getAll-books`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        axios.get(`${process.env.REACT_APP_URL}/api/v3/client/getAll-clients`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);

      const booksCount = booksResponse.data?.books?.length || 0;
      const clientsCount = clientsResponse.data?.data?.length || 0;

      setData(prevState => ({
        ...prevState,
        datasets: [
          {
            ...prevState.datasets[0],
            data: [booksCount, clientsCount],
          },
        ],
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          font: {
            size: 14,
            family: "'Inter', sans-serif",
          },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#333",
        bodyColor: "#333",
        padding: 12,
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 14,
        },
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.raw || 0;
            return `${label}: ${value}`;
          },
        },
      },
    },
    layout: {
      padding: {
        top: 20,
        bottom: 20,
      },
    },
    elements: {
      arc: {
        borderWidth: 2,
      },
    },
  };

  return (
    <div className="flex flex-col items-center">
      {loading ? (
        <div className="flex justify-center items-center h-[300px]">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className="w-full max-w-[400px] h-[300px] relative">
            <Pie data={data} options={chartOptions} />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6 w-full max-w-[400px]">
            {data.labels.map((label, index) => (
              <div
                key={label}
                className="flex flex-col items-center p-4 rounded-lg bg-white shadow-sm transition-all duration-200 hover:shadow-md"
                style={{
                  borderLeft: `4px solid ${data.datasets[0].backgroundColor[index]}`,
                }}
              >
                <span className="text-2xl font-bold text-gray-800">
                  {data.datasets[0].data[index]}
                </span>
                <span className="text-sm text-gray-600 mt-1">{label}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PieChart;
