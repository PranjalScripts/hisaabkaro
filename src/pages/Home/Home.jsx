 import React, { useEffect, useState } from "react";
import SummaryCard from "./SummaryCard";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import TransactionList from "./TransactionList";
import TransactionDetails from "./TransactionDetails";
import PhoneUpdateModal from "../../components/auth/PhoneUpdate/PhoneUpdateModal";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Home = () => {
  const [data, setData] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [totalDebit, setTotalDebit] = useState(0);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const userId = localStorage.getItem("userId");

  // Handle Google Auth token
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (token) {
      // Store token and update auth context
      localStorage.setItem('token', token);
      
      // Decode token to get user info
      const user = JSON.parse(atob(token.split('.')[1]));
      localStorage.setItem('userId', user.id);
      
      // Check if phone number needs to be updated
      if (!user.hasPhone) {
        setShowPhoneModal(true);
      }
      
      // Update auth context
      login({ token, ...user });
      
      // Remove token from URL
      navigate('/home', { replace: true });
    }
  }, [location, login, navigate]);

  // Fetch transaction data on component mount
  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/api/v4/transaction/get-transactions/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const transactions = response.data; // Assuming response.data contains the transaction array

        // Calculate total balance, credit, and debit
        const totalBalance = transactions.reduce(
          (acc, transaction) => acc + transaction.amount,
          0
        );
        const totalCredit = transactions
          .filter((transaction) => transaction.transactionType === "credit")
          .reduce((acc, transaction) => acc + transaction.amount, 0);
        const totalDebit = transactions
          .filter((transaction) => transaction.transactionType === "debit")
          .reduce((acc, transaction) => acc + transaction.amount, 0);

        // Set the state with calculated values
        setTotalBalance(totalBalance);
        setTotalCredit(totalCredit);
        setTotalDebit(totalDebit);
        setData(transactions); // Store the transaction data if needed for other components
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      }
    };

    fetchTransactionData();
  }, [userId]);

  const handleDashboardClick = () => { 
    navigate("/dashboard");
  }
  
  return (
    <div>
      {showPhoneModal && (
        <PhoneUpdateModal onClose={() => setShowPhoneModal(false)} />
      )}
      <div className="p-6 bg-gray-100 min-h-screen w-full">
        {/* Top Summary Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SummaryCard
            title="Total Balance"
            value={`${totalBalance.toFixed(2)}`}
            color="bg-yellow-100"
          />
          <SummaryCard
            title="Credit"
            value={`${totalCredit.toFixed(2)}`}
            color="bg-blue-100"
          />
          <SummaryCard
            title="Debit"
            value={`${totalDebit.toFixed(2)}`}
            color="bg-red-100"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Weekly Activity</h3>
            <BarChart />
          </div>
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              Books/Clients Statistics
            </h3>
            <PieChart />
          </div>
        </div>

        {/* Transaction Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <TransactionList />
          <TransactionDetails />
        </div>
      </div>
      <div className="flex justify-center p-3 mb-16">
        <button
          className="border border-black rounded-3xl px-4 py-2 hover:text-white hover:bg-blue-900"
          onClick={handleDashboardClick}
        >
          Go to DashBoard
        </button>
      </div>
    </div>
  );
};

export default Home;
