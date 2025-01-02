
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {
  const data = {
    labels: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Credit",
        data: [300, 400, 500, 200, 100, 300, 400],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Debit",
        data: [200, 300, 100, 400, 500, 100, 200],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Prevent chart distortion
  };

  return (
    <div style={{ height: "300px" }}> {/* Fixed height container */}
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
