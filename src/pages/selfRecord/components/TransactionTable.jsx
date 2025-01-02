import React from 'react';
import { motion } from 'framer-motion';
import { getFileUrl, getFileName } from '../../../utils/fileUtils';
import Pagination from './Pagination';

const TransactionTable = ({ 
  transactions = [], 
  onEdit, 
  onDelete, 
  onViewFiles,
  currentPage = 1,
  entriesPerPage = 25,
  onPageChange = () => {},
  onEntriesPerPageChange = () => {}
}) => {
  // Ensure transactions is always an array and items are valid
  const safeTransactions = Array.isArray(transactions) 
    ? transactions.filter(t => t && typeof t === 'object')
    : [];
  
  const totalPages = Math.ceil(safeTransactions.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentTransactions = safeTransactions.slice(startIndex, endIndex);

  // Ensure we stay within valid page bounds
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      onPageChange(totalPages);
    }
  }, [currentPage, totalPages, onPageChange]);

  const handleDelete = React.useCallback((entry) => {
    if (entry && typeof entry === 'object' && entry._id) {
      onDelete(entry);
    }
  }, [onDelete]);

  const handleEdit = React.useCallback((entry) => {
    if (entry && typeof entry === 'object' && entry._id) {
      onEdit(entry);
    }
  }, [onEdit]);

  const handleViewFiles = React.useCallback((entry) => {
    if (entry && typeof entry === 'object' && entry._id) {
      onViewFiles(entry);
    }
  }, [onViewFiles]);

  if (!Array.isArray(transactions)) {
    console.error('TransactionTable: transactions prop is not an array:', transactions);
  }

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sr No
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    You Will Give
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    You Will Get
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Files
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentTransactions.map((entry, index) => (
                  <motion.tr
                    key={entry?._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry?.transactionDate ? new Date(entry.transactionDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {entry?.transactionType === "you will give" ? (
                        <span className="text-red-600">₹{(entry?.amount || 0).toLocaleString()}</span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {entry?.transactionType === "you will get" ? (
                        <span className="text-green-600">₹{(entry?.amount || 0).toLocaleString()}</span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {entry?.description || "-"}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                      (entry?.outstandingBalance || 0) < 0 ? "text-red-600" : "text-green-600"
                    }`}>
                      ₹{Math.abs(entry?.outstandingBalance || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      {entry?.file ? (
                        <div 
                          className="w-16 h-16 mx-auto relative group cursor-pointer"
                          onClick={() => handleViewFiles(entry)}
                        >
                          {/\.(jpg|jpeg|png|gif|webp)$/i.test(getFileName(entry.file)) ? (
                            <img
                              src={getFileUrl(entry.file)}
                              alt="File"
                              className="w-full h-full object-cover rounded-lg border border-gray-200 transform group-hover:scale-105 transition-all duration-200"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200 transform group-hover:scale-105 transition-all duration-200">
                              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEdit(entry)}
                          className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-50 text-xl"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(entry)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 text-xl"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          entriesPerPage={entriesPerPage}
          onEntriesPerPageChange={onEntriesPerPageChange}
        />
      </div>
    </div>
  );
};

export default TransactionTable;
