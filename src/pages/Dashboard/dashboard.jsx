 import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlinePlus,
} from "react-icons/ai";
import { FiRefreshCw } from "react-icons/fi";

const DashBoard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAllTransactions = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const [clientTransactionsRes, transactionsRes] = await Promise.all([
        fetch(
          `${process.env.REACT_APP_URL}/api/collab-transactions/client-transactions`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        fetch(
          `${process.env.REACT_APP_URL}/api/collab-transactions/transactions`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
      ]);

      const clientTransactions = await clientTransactionsRes.json();
      const transactions = await transactionsRes.json();

      const clientTransactionsWithSource = (
        clientTransactions.transactions || []
      ).map((transaction) => {
        const confirmedYouWillGet = transaction.transactionHistory
          .filter(
            (t) =>
              t.transactionType === "you will get" &&
              t.confirmationStatus === "confirmed"
          )
          .reduce((acc, curr) => acc + curr.amount, 0);

        const confirmedYouWillGive = transaction.transactionHistory
          .filter(
            (t) =>
              t.transactionType === "you will give" &&
              t.confirmationStatus === "confirmed"
          )
          .reduce((acc, curr) => acc + curr.amount, 0);

        const unconfirmedYouWillGet = transaction.transactionHistory
          .filter(
            (t) =>
              t.transactionType === "you will get" &&
              t.confirmationStatus !== "confirmed"
          )
          .reduce((acc, curr) => acc + curr.amount, 0);

        const unconfirmedYouWillGive = transaction.transactionHistory
          .filter(
            (t) =>
              t.transactionType === "you will give" &&
              t.confirmationStatus !== "confirmed"
          )
          .reduce((acc, curr) => acc + curr.amount, 0);

        return {
          ...transaction,
          confirmedYouWillGet,
          confirmedYouWillGive,
          unconfirmedYouWillGet,
          unconfirmedYouWillGive,
          source: "client",
          transactionId: transaction._id,
        };
      });

      const transactionsWithSource = (transactions.transactions || []).map(
        (transaction) => {
          const confirmedYouWillGet = transaction.transactionHistory
            .filter(
              (t) =>
                t.transactionType === "you will get" &&
                t.confirmationStatus === "confirmed"
            )
            .reduce((acc, curr) => acc + curr.amount, 0);

          const confirmedYouWillGive = transaction.transactionHistory
            .filter(
              (t) =>
                t.transactionType === "you will give" &&
                t.confirmationStatus === "confirmed"
            )
            .reduce((acc, curr) => acc + curr.amount, 0);

          const unconfirmedYouWillGet = transaction.transactionHistory
            .filter(
              (t) =>
                t.transactionType === "you will get" &&
                t.confirmationStatus !== "confirmed"
            )
            .reduce((acc, curr) => acc + curr.amount, 0);

          const unconfirmedYouWillGive = transaction.transactionHistory
            .filter(
              (t) =>
                t.transactionType === "you will give" &&
                t.confirmationStatus !== "confirmed"
            )
            .reduce((acc, curr) => acc + curr.amount, 0);

          return {
            ...transaction,
            confirmedYouWillGet,
            confirmedYouWillGive,
            unconfirmedYouWillGet,
            unconfirmedYouWillGive,
            source: "transaction",
            transactionId: transaction._id,
          };
        }
      );

      setTransactions([
        ...clientTransactionsWithSource,
        ...transactionsWithSource,
      ]);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  const viewTransactionDetails = (transactionId, source) => {
    if (source === "client") {
      navigate(`/transaction-details/${transactionId}`);
    } else {
      navigate(`/history/${transactionId}`);
    }
  };

  const addTransaction = () => {
    navigate("/addtransaction");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <div className="text-lg font-medium text-gray-700">Loading transactions...</div>
        </div>
      </div>
    );
  }

  const transactionsFromSource = transactions.filter(
    (transaction) => transaction.source === "transaction"
  );
  const clientsFromSource = transactions.filter(
    (transaction) => transaction.source === "client"
  );

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Transactions Overview
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={fetchAllTransactions}
            className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200"
          >
            <FiRefreshCw className="text-lg" />
            <span>Refresh</span>
          </button>
          <button
            onClick={addTransaction}
            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
          >
            <AiOutlinePlus className="text-xl" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {transactionsFromSource.length === 0 && clientsFromSource.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm">
          <div className="text-lg text-gray-600 mb-6">No transactions found</div>
          <button
            onClick={addTransaction}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
          >
            <AiOutlinePlus className="text-xl" />
            <span>Add Your First Transaction</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-600">
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Book Name</th>
                  <th className="px-6 py-4 font-medium">You Will Get</th>
                  <th className="px-6 py-4 font-medium">You Will Give</th>
                  <th className="px-6 py-4 font-medium">Outstanding Balance</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((transaction, index) => (
                  <tr
                    key={index}
                    className="hover:bg-blue-50/50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-700">
                          {transaction.source === "client"
                            ? transaction.userId?.name || "N/A"
                            : transaction.clientUserId?.name || "N/A"}
                        </span>
                        {transaction.source === "client" ? (
                          <AiOutlineArrowLeft
                            className="text-blue-500 text-lg"
                            title="Client Transaction"
                          />
                        ) : (
                          <AiOutlineArrowRight
                            className="text-orange-500 text-lg"
                            title="Transaction"
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize text-gray-700">
                      {transaction.bookId?.bookname || "Could Not Find Book Name"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-green-600 font-medium">
                        {transaction.confirmedYouWillGet || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-red-600 font-medium">
                        {transaction.confirmedYouWillGive || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${
                        transaction.outstandingBalance > 0
                          ? 'text-green-600'
                          : transaction.outstandingBalance < 0
                          ? 'text-red-600'
                          : 'text-gray-600'
                      }`}>
                        {transaction.outstandingBalance === 0
                          ? 0
                          : transaction.outstandingBalance || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          viewTransactionDetails(
                            transaction.transactionId,
                            transaction.source
                          )
                        }
                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-150"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashBoard;