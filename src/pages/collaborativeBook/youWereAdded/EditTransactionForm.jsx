import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaFileUpload } from "react-icons/fa";

const EditTransactionForm = ({ editData, onSubmit, onChange, onCancel, isOpen }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onCancel}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-[95%] max-w-sm"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-4 rounded-t-3xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Edit Transaction</h3>
              <button
                onClick={onCancel}
                className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-4">
            <form onSubmit={onSubmit} className="space-y-3">
              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={editData.amount}
                  onChange={(e) => onChange({ ...editData, amount: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'e' || e.key === 'E') {
                      e.preventDefault();
                    }
                  }}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 
                  focus:ring-violet-500 focus:border-transparent transition-all duration-200
                  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Enter amount"
                  required
                />
              </div>

              {/* Transaction Type Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Type
                </label>
                <select
                  value={editData.transactionType}
                  onChange={(e) => onChange({ ...editData, transactionType: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 
                  focus:ring-violet-500 focus:border-transparent transition-all duration-200 
                  appearance-none bg-white"
                  required
                >
                  <option value="" disabled>Select Transaction Type</option>
                  <option value="you will get">You Will Give</option>
                  <option value="you will give">You Will Get</option>
                </select>
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Enter transaction description"
                  value={editData.description}
                  onChange={(e) => onChange({ ...editData, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 
                  focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Update Attachment
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={(e) => onChange({ ...editData, file: e.target.files[0] })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 
                    focus:ring-violet-500 focus:border-transparent transition-all duration-200
                    file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0
                    file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700
                    hover:file:bg-violet-100"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <FaFileUpload className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 rounded-b-3xl">
            <div className="flex gap-3">
              <button
                type="submit"
                onClick={onSubmit}
                className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-4 py-2 rounded-xl 
                font-semibold hover:from-violet-600 hover:to-purple-700 transform hover:scale-[1.02] 
                transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] text-sm"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-semibold
                hover:bg-gray-200 transform hover:scale-[1.02] transition-all duration-200 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditTransactionForm;
