 

import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

// Register components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const data = {
    labels: ["Entertainment", "Bill Expense", "Investment", "Others"],
    datasets: [
      {
        data: [30, 15, 20, 35],
        backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Prevent chart distortion
  };

  return (
    <div style={{ height: "300px" }}> {/* Fixed height container */}
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
