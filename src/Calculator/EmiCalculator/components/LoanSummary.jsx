import React from 'react';
import { Pie } from "react-chartjs-2";
import { formatNumber } from '../utils/formatters';

const LoanSummary = ({ emi, totalInterest, totalAmount, principal, processingFee }) => {
  const pieData = {
    labels: ["Principal", "Total Interest", "Processing Fee"],
    datasets: [
      {
        data: [
          parseFloat(principal),
          parseFloat(totalInterest),
          parseFloat(processingFee),
        ],
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-100 card-hover">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          Loan Summary
        </h3>
        <div className="space-y-6">
          <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm text-gray-500">Monthly EMI</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatNumber(emi)}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-500">Total Interest</p>
              <p className="text-xl font-semibold text-blue-600">
                {formatNumber(totalInterest)}
              </p>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-xl font-semibold text-blue-600">
                {formatNumber(totalAmount)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow card-hover">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
            />
          </svg>
          Payment Breakdown
        </h3>
        <Pie
          data={pieData}
          options={{
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  padding: 20,
                  font: {
                    size: 12,
                    weight: 500,
                  },
                  usePointStyle: true,
                },
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    let label = context.label || "";
                    if (label) {
                      label += ": ";
                    }
                    label += context.raw.toLocaleString();
                    return label;
                  },
                },
              },
            },
            animation: {
              duration: 2000,
            },
            maintainAspectRatio: true,
          }}
        />
      </div>
    </div>
  );
};

export default LoanSummary;
