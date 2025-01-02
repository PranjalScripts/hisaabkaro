import React from 'react';
import { MdEdit, MdDelete } from "react-icons/md";

const TransactionTable = ({
  transaction, 
  userId, 
  updating, 
  updateTransactionStatus, 
  openEditForm, 
  handleDeleteClick, 
  handleImageClick 
}) => {
  if (!transaction?.transactionHistory) {
    return null;
  }

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('en-IN');
    } catch (error) {
      return 'N/A';
    }
  };

  const formatAmount = (amount) => {
    try {
      return Number(amount).toLocaleString('en-IN');
    } catch (error) {
      return '0';
    }
  };

  // Utility function to determine row color based on transaction type and status
  const getRowClass = (transactionType, status) => {
    if (status === 'pending') {
      return 'bg-opacity-50 bg-gray-50';
    }
    return transactionType === 'you will get' ? 'hover:bg-green-50' : 'hover:bg-red-50';
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
          Transaction History
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Initiated By</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Files</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transaction.transactionHistory && transaction.transactionHistory.length > 0 ? (
                transaction.transactionHistory.map((history) => (
                  <tr
                    key={history._id}
                    className={`transition-all duration-200 ${getRowClass(history?.transactionType, history?.confirmationStatus)}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(history.transactionDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                      <br />
                      <span className="text-gray-400">
                        {new Date(history.transactionDate).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {history?.initiatedBy || 'N/A'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium capitalize
                      ${history?.transactionType === 'you will give' ? 'text-red-600' : 'text-green-600'}`}>
                      {history?.transactionType || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                      <span className={`${history?.transactionType === 'you will give' ? 'text-red-600' : 'text-green-600'}`}>
                      {formatAmount(history?.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {history?.description || 'No description'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {history?.confirmationStatus === "confirmed" ? (
                        <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Confirmed
                        </span>
                      ) : userId === history?.initiaterId ? (
                        <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      ) : (
                        <button
                          onClick={() => updateTransactionStatus(history._id)}
                          disabled={updating}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg 
                          hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {updating ? "Updating..." : "Confirm"}
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {typeof history?.file === "string" && history.file.trim() !== "" ? (
                        <div className="relative group">
                          <img
                            src={`${process.env.REACT_APP_URL}/${history.file.replace(/\\/g, "/")}`}
                            alt="Transaction File"
                            className="max-w-[100px] max-h-[100px] object-cover rounded-lg cursor-pointer 
                            transition-transform duration-200 transform group-hover:scale-105"
                            onClick={() => handleImageClick(history.file)}
                          />
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No file</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {userId === history?.initiaterId ? (
                        <div className="flex gap-3">
                          <button
                            onClick={() => openEditForm(history)}
                            className="text-yellow-500 hover:text-yellow-600 transition-colors duration-200"
                            title="Edit"
                          >
                            <MdEdit className="text-xl" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(history)}
                            className="text-red-500 hover:text-red-600 transition-colors duration-200"
                            title="Delete"
                          >
                            <MdDelete className="text-xl" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 italic">
                          Not initiated by you
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-10 text-center">
                    <p className="text-gray-500 text-lg">No transaction history available</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
