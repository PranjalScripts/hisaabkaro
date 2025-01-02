 
import React, { useState, useEffect } from "react";

import axios from "axios";
import AddTransactions from "./Addselfrecord";
import { useNavigate } from "react-router-dom";

const SelfRecord = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTransaction, setShowAddTransaction] = useState(false); // New state to control modal visibility
  const userId = localStorage.getItem("userId");

  const navigate = useNavigate();

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

        if (response.data.success) {
          const transactionData = await Promise.all(
            response.data.data.map(async (transaction) => {
              const bookResponse = await axios.get(
                `${process.env.REACT_APP_URL}/api/v2/transactionBooks/get-book/${transaction.bookId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              const clientResponse = await axios.get(
                `${process.env.REACT_APP_URL}/api/v3/client/get-client/${transaction.clientUserId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              const lastTransaction = transaction.outstandingBalance;

              return {
                transactionId: transaction._id,
                bookName: bookResponse.data.book.bookname,
                clientName: clientResponse.data.data.name,
                clientMobile: clientResponse.data.data.mobile,
                clientEmail: clientResponse.data.data.email,
                outstandingBalance: lastTransaction,
              };
            })
          );

          setTransactions(transactionData);
        } else {
          console.error("Error: Data fetch unsuccessful", response.data);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setLoading(false);
      }
    };

      fetchTransactions();
      //eslint-disable-next-line
  }, []);

  const handleAddTransactionClick = () => {
    setShowAddTransaction(true);
  };

  const closeAddTransactionModal = () => {
    setShowAddTransaction(false);
  };

  const formatAmount = (amount) => {
    const absoluteAmount = Math.abs(amount);
    const color = amount < 0 ? "text-red-500" : "text-green-500";
    return <span className={color}>{absoluteAmount}</span>;
  };

  const handleSeeDetails = (transactionId) => {
    // Redirect to Transaction History page with transaction ID
    navigate(`/transaction-history/${transactionId}`);
  };

  return (
    <div className="flex">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Transactions Record Page</h1>
        <button
          onClick={handleAddTransactionClick}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
        >
          Add Transaction
        </button>
        {loading ? (
          <p className="text-gray-500">Loading transactions...</p>
        ) : (
          <table className="min-w-full table-auto bg-white rounded-lg overflow-hidden shadow-md">
            <thead>
              <tr className="bg-gray-100 text-left text-sm text-gray-600">
                <th className="px-4 py-2 ">Book Name</th>
                <th className="px-4 py-2 ">Client Name</th>
                <th className="px-4 py-2 ">Client Mobile</th>
                <th className="px-4 py-2 ">Client Email</th>
                <th className="px-4 py-2 ">Outstanding Balance</th>
                <th className="px-4 py-2 ">Reminder</th>
                <th className="px-4 py-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{transaction.bookName}</td>
                    <td className="px-4 py-2">{transaction.clientName}</td>
                    <td className="px-4 py-2">{transaction.clientMobile}</td>
                    <td className="px-4 py-2">{transaction.clientEmail}</td>
                    <td className="px-4 py-2">
                      {formatAmount(transaction.outstandingBalance)}
                    </td>
                    <td className="px-4 py-2">
                      <a
                        href={`https://api.whatsapp.com/send/?phone=%2B91${transaction.clientMobile}&text=Hello%20${transaction.clientName}%2C%20we%20hope%20you%20are%20doing%20well.%20This%20is%20a%20friendly%20reminder%20that%20you%20have%20an%20outstanding%20balance%20of%20${transaction.outstandingBalance}.%20Please%20let%20us%20know%20if%20you%20have%20any%20questions.&type=phone_number&app_absent=0`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/5/5e/WhatsApp_icon.png"
                          alt="WhatsApp"
                          className="w-6 h-6 inline"
                        />
                      </a>
                    </td>
                    <td>
                      <button
                        className="bg-blue-500 text-white px-2 py-2 rounded hover:bg-blue-600"
                        onClick={() =>
                          handleSeeDetails(transaction.transactionId)
                        }
                      >
                        See Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* AddTransactions Modal */}
        {showAddTransaction && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
              <AddTransactions />
              <button
                onClick={closeAddTransactionModal}
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default SelfRecord;
