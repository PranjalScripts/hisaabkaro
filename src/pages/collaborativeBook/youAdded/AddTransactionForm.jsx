import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const AddTransactionForm = ({
  showForm,
  selectedTransactionType,
  newTransaction,
  setNewTransaction,
  handleAddTransaction,
  setShowForm,
  adding,
  setSelectedTransactionType,
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleAddTransaction();
  };

  const resetForm = () => {
    setNewTransaction({ amount: "", description: "", file: null });
    setSelectedTransactionType("");
    setShowForm(false);
  };

  return (
    <>
      <div className="relative z-5 flex gap-4 mb-6 mt-6">
        <button
          type="button"
          onClick={() => {
            resetForm();
            setSelectedTransactionType("you will get");
            setShowForm(true);
          }}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl 
          hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          You Will Get
        </button>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setSelectedTransactionType("you will give");
            setShowForm(true);
          }}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-xl 
          hover:from-red-600 hover:to-rose-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20 12H4"
            />
          </svg>
          You Will Give
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[9999] px-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className={`p-6 ${
                  selectedTransactionType === "you will get"
                    ? "bg-gradient-to-r from-green-500 to-emerald-600"
                    : "bg-gradient-to-r from-red-500 to-rose-600"
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-white">
                    {selectedTransactionType === "you will get"
                      ? "You Will Get"
                      : "You Will Give"}
                  </h3>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Form */}
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount
                    </label>
                    <div className="relative">
                       
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Enter amount"
                        value={newTransaction.amount}
                        onChange={(e) =>
                          setNewTransaction({
                            ...newTransaction,
                            amount: e.target.value,
                          })
                        }
                        className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-3 focus:ring-2 
                        focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      placeholder="Enter description"
                      value={newTransaction.description}
                      onChange={(e) =>
                        setNewTransaction({
                          ...newTransaction,
                          description: e.target.value,
                        })
                      }
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 
                      focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Attachment
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setNewTransaction((prev) => ({
                            ...prev,
                            file: e.target.files[0],
                          }))
                        }
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 
                        focus:ring-blue-500 focus:border-transparent transition-all duration-200
                        file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                        file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={adding || !newTransaction.amount}
                      className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white shadow-md
                      transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                      ${
                        selectedTransactionType === "you will get"
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                          : "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
                      }`}
                    >
                      {adding ? (
                        <div className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Adding...
                        </div>
                      ) : (
                        "Submit"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold
                      hover:bg-gray-200 transform hover:scale-105 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AddTransactionForm;
