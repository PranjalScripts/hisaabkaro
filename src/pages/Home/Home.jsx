import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import SummaryCard from "./SummaryCard";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import TransactionList from "./TransactionList";
import TransactionDetails from "./TransactionDetails";

const Home = () => {
  const navigate = useNavigate();
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [totalDebit, setTotalDebit] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/api/v4/transaction/get-transactions/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        let creditSum = 0;
        let debitSum = 0;

        response.data.forEach((transaction) => {
          if (transaction.transactionType === "credit") {
            creditSum += transaction.amount;
          } else {
            debitSum += transaction.amount;
          }
        });

        setTotalCredit(creditSum);
        setTotalDebit(Math.abs(debitSum));
        setTotalBalance(creditSum - Math.abs(debitSum));
      } catch (error) {
        console.error("Error fetching totals:", error);
        toast.error("Failed to load financial summary");
      } finally {
        setLoading(false);
      }
    };

    fetchTotals();
  }, []);

  const handleDashboardClick = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Financial Dashboard
          </h1>
          <p className="text-gray-600">
            Track your transactions and financial activities
          </p>
        </div>

        {/* Top Summary Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {loading ? (
            Array(3)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl shadow-sm animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))
          ) : (
            <>
              <SummaryCard
                title="Total Balance"
                value={`₹${totalBalance.toFixed(2)}`}
                color="bg-gradient-to-br from-yellow-50 to-yellow-100 hover:shadow-lg transition-shadow duration-300"
              />
              <SummaryCard
                title="Credit"
                value={`₹${totalCredit.toFixed(2)}`}
                color="bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-shadow duration-300"
              />
              <SummaryCard
                title="Debit"
                value={`₹${totalDebit.toFixed(2)}`}
                color="bg-gradient-to-br from-red-50 to-red-100 hover:shadow-lg transition-shadow duration-300"
              />
            </>
          )}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-800 mb-1">
              Weekly Activity
            </h3>
            <p className="text-sm text-gray-500">
              Credit and debit transactions for the week
            </p>

            <div className="p-4">
              <BarChart />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Books/Clients Statistics
            </h3>
            <div className="p-4">
              <PieChart />
            </div>
          </div>
        </div>

        {/* Transaction Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <TransactionList />
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <TransactionDetails />
          </div>
        </div>

        {/* Dashboard Button */}
        <div className="flex justify-center py-6">
          <button
            onClick={handleDashboardClick}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            View Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
