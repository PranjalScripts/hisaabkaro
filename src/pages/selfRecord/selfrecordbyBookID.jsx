import React, { useState, useEffect } from "react";
import AddTransactions from "./Addselfrecord";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SelfRecordByBookID = () => {
  const { bookId } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [bookName, setBookName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusModal, setStatusModal] = useState({ show: false, type: '', message: '' });
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'grid'
  const navigate = useNavigate();

  const fetchTransactions = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/api/v4/transaction/getbook-transactions/${bookId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setTransactions(data.transactions);

        // Set bookname from the first transaction (assuming all transactions are for the same book)
        if (data.transactions.length > 0 && data.transactions[0].bookId?.bookname) {
          setBookName(data.transactions[0].bookId.bookname);
        }
      } else {
        throw new Error("Failed to fetch transactions");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [bookId]);

  const handleTransactionHistory = (transactionId) => {
    navigate(`/transaction-history/${transactionId}`);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (!searchTerm) return true;

    const name = transaction?.clientUserId?.name?.toLowerCase() || '';
    const email = transaction?.clientUserId?.email?.toLowerCase() || '';
    const mobile = transaction?.clientUserId?.mobile?.toString() || '';
    const bookname = transaction?.bookId?.bookname?.toLowerCase() || '';

    const searchLower = searchTerm.toLowerCase();

    return (
      name.includes(searchLower) ||
      email.includes(searchLower) ||
      mobile.includes(searchLower) ||
      bookname.includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section with Two Cards */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Book Name Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm p-4 border border-blue-100">
              <div className="flex items-center justify-center h-full">
                <h1 className="text-xl font-bold">
                  <span className="text-gray-600">Book Name: </span>
                  <span className="text-indigo-700">{bookName || "N/A"}</span>
                </h1>
              </div>
            </div>

            {/* Add New Record Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm p-4 border border-green-100">
              <div className="flex justify-center items-center h-full">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add New Record</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search and View Toggle Section */}
        <div className="flex justify-between items-center mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 w-[30%]">
            <div className="relative max-w-xs">
              <input
                type="text"
                placeholder="Search by name, email, or mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* View Toggle Buttons */}
          <div className="bg-white rounded-xl shadow-sm p-2 flex gap-2">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg flex items-center gap-2 ${
                viewMode === "list"
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span className="text-sm font-medium">List</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg flex items-center gap-2 ${
                viewMode === "grid"
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span className="text-sm font-medium">Grid</span>
            </button>
          </div>
        </div>

        {/* Transactions Display */}
        {filteredTransactions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? "Try adjusting your search term" : "Start by adding a new transaction"}
            </p>
          </div>
        ) : viewMode === "list" ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Mobile
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.outstandingBalance === 0
                            ? 'bg-gray-100 text-gray-800'
                            : transaction.outstandingBalance > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.outstandingBalance === 0
                            ? 'Settled'
                            : transaction.outstandingBalance > 0
                            ? 'You will get'
                            : 'You will give'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {transaction.clientUserId?.name || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${
                          transaction.outstandingBalance === 0
                            ? 'bg-gray-100 text-gray-800'
                            : transaction.outstandingBalance > 0
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}>
                           {Math.abs(transaction.outstandingBalance).toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {transaction.clientUserId?.mobile || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {transaction.clientUserId?.email || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleTransactionHistory(transaction._id)}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          View History
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction._id}
                className={`relative overflow-hidden p-5 rounded-xl border ${
                  transaction.isFaded
                    ? 'bg-yellow-50/70 border-yellow-200'
                    : 'bg-white border-gray-200'
                } shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
              >
                {/* Top Section with Type Badge */}
                <div className={`absolute top-0 right-0 w-24 h-24 ${
                  transaction.outstandingBalance === 0
                    ? 'bg-gray-500/10'
                    : transaction.outstandingBalance > 0
                    ? 'bg-green-500/10'
                    : 'bg-red-500/10'
                } rounded-bl-full -mr-12 -mt-12`} />
                
                <div className="relative">
                  {/* Type Badge */}
                  <div className={`absolute top-0 right-0 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                    transaction.outstandingBalance === 0
                      ? 'bg-gray-100 text-gray-800'
                      : transaction.outstandingBalance > 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {transaction.outstandingBalance === 0
                      ? 'Settled'
                      : transaction.outstandingBalance > 0
                      ? 'You will get'
                      : 'You will give'}
                  </div>

                  {/* Contact Info */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 break-words">
                      {transaction.clientUserId?.name || "N/A"}
                    </h3>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7 7-7 7" />
                        </svg>
                        <span className="truncate">
                          {transaction.clientUserId?.email || "No email"}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="truncate">
                          {transaction.clientUserId?.mobile || "No mobile"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Balance and Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 mb-1">Balance</span>
                      <span className={`text-lg font-bold ${
                        transaction.isFaded 
                          ? 'text-yellow-600'
                          : transaction.outstandingBalance > 0
                          ? 'text-green-600'
                          : transaction.outstandingBalance < 0
                          ? 'text-red-600'
                          : 'text-gray-600'
                      }`}>
                         {Math.abs(transaction.outstandingBalance).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <button
                      onClick={() => handleTransactionHistory(transaction._id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                        transaction.outstandingBalance > 0
                          ? "text-green-700 hover:bg-green-50"
                          : transaction.outstandingBalance < 0
                          ? "text-red-700 hover:bg-red-50"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-sm font-medium">History</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Modal */}
      {statusModal.show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="min-h-screen px-4 text-center flex items-center justify-center">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm transition-opacity" />
            
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative inline-block w-full max-w-md p-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl"
            >
              {/* Close button */}
              <button
                onClick={() => setStatusModal({ show: false, type: '', message: '' })}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex flex-col items-center">
                {/* Icon */}
                <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                  statusModal.type === 'success' ? 'bg-green-100' : 'bg-red-100'
                } mb-6`}>
                  {statusModal.type === 'success' ? (
                    <motion.svg 
                      className="h-8 w-8 text-green-600" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth="2.5" 
                      stroke="currentColor"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      <motion.path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </motion.svg>
                  ) : (
                    <motion.svg 
                      className="h-8 w-8 text-red-600" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth="2.5" 
                      stroke="currentColor"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 20 
                      }}
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M6 18L18 6M6 6l12 12" 
                      />
                    </motion.svg>
                  )}
                </div>

                {/* Title */}
                <h3 className={`text-2xl font-bold mb-2 ${
                  statusModal.type === 'success' ? 'text-green-900' : 'text-red-900'
                }`}>
                  {statusModal.type === 'success' ? 'Success!' : 'Error'}
                </h3>

                {/* Message */}
                <p className="text-base text-center text-gray-600 mb-8">
                  {statusModal.message}
                </p>

                {/* Action Button */}
                <button
                  type="button"
                  className={`w-full px-6 py-3 text-base font-medium text-white rounded-lg shadow-sm transition-colors duration-200 ${
                    statusModal.type === 'success'
                      ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                      : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                  onClick={() => setStatusModal({ show: false, type: '', message: '' })}
                >
                  {statusModal.type === 'success' ? 'Continue' : 'Try Again'}
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
      {/* Add Transaction Modal */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="min-h-screen px-4 text-center">
            <div
              className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity"
              onClick={() => setIsModalOpen(false)}
            ></div>
            
            <span className="inline-block h-screen align-middle">&#8203;</span>
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="inline-block w-full max-w-3xl align-middle my-4"
            >
              <AddTransactions
                onClose={() => setIsModalOpen(false)}
                onTransactionAdded={fetchTransactions}
                onStatus={(type, message) => {
                  setStatusModal({ show: true, type, message });
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
export default SelfRecordByBookID;