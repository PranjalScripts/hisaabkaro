import React, { useState } from "react";
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
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = () => {
  const [hoveredBar, setHoveredBar] = useState(null);

  const data = {
    labels: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Credit",
        data: [300, 400, 500, 200, 100, 300, 400],
        backgroundColor: "rgba(16, 185, 129, 0.7)", // Emerald
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 2,
        borderRadius: 6,
        hoverBackgroundColor: "rgba(16, 185, 129, 0.85)",
        hoverBorderColor: "rgba(16, 185, 129, 1)",
        hoverBorderWidth: 3,
      },
      {
        label: "Debit",
        data: [200, 300, 100, 400, 500, 100, 200],
        backgroundColor: "rgba(239, 68, 68, 0.7)", // Red
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 2,
        borderRadius: 6,
        hoverBackgroundColor: "rgba(239, 68, 68, 0.85)",
        hoverBorderColor: "rgba(239, 68, 68, 1)",
        hoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          boxWidth: 15,
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          font: {
            size: 12,
            family: "'Inter', sans-serif",
            weight: 500,
          },
        },
        onClick: null, // Disable legend click
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#1f2937",
        bodyColor: "#1f2937",
        padding: 12,
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        titleFont: {
          size: 14,
          weight: "bold",
          family: "'Inter', sans-serif",
        },
        bodyFont: {
          size: 13,
          family: "'Inter', sans-serif",
        },
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ':  ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-IN').format(context.parsed.y);
            }
            return label;
          },
        },
        animation: {
          duration: 150,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          color: "#6b7280",
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.06)",
          drawBorder: false,
        },
        border: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          color: "#6b7280",
          callback: function(value) {
            return ' ' + new Intl.NumberFormat('en-IN').format(value);
          },
        },
      },
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart',
    },
    onHover: (event, elements) => {
      setHoveredBar(elements.length > 0 ? elements[0].index : null);
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="mb-4">
      </div>
      <div className="h-[300px]">
        <Bar 
          data={{
            ...data,
            datasets: data.datasets.map(dataset => ({
              ...dataset,
              data: dataset.data.map((value, index) => 
                hoveredBar === null || hoveredBar === index ? value : value * 0.85
              ),
            })),
          }} 
          options={options} 
        />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-center p-3 rounded-md bg-emerald-50">
          <p className="text-sm font-medium text-emerald-600">Total Credit</p>
          <p className="text-lg font-semibold text-emerald-700">
             {new Intl.NumberFormat('en-IN').format(data.datasets[0].data.reduce((a, b) => a + b, 0))}
          </p>
        </div>
        <div className="text-center p-3 rounded-md bg-red-50">
          <p className="text-sm font-medium text-red-600">Total Debit</p>
          <p className="text-lg font-semibold text-red-700">
             {new Intl.NumberFormat('en-IN').format(data.datasets[1].data.reduce((a, b) => a + b, 0))}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BarChart;
