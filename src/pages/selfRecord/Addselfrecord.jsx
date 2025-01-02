import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

const AddTransactions = ({ onClose, onTransactionAdded, onStatus }) => {
  const { bookId } = useParams();
  const initialState = {
    userId: "",
    clientUserId: "",
    transactionType: "you will get",
    amount: "",
    description: "",
  };

  const [clients, setClients] = useState([]);
  const [transactionData, setTransactionData] = useState(initialState);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("token");

  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    // Fetch clients
    axiosInstance
      .get(`${process.env.REACT_APP_URL}/api/v3/client/getAll-clients`)
      .then((response) => {
        if (response.data?.success && Array.isArray(response.data.data)) {
          setClients(response.data.data);
        }
      })
      .catch((error) => console.error("Error fetching clients:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "amount") {
      // Prevent starting with 0
      if (value === "0") return;
      
      // Allow empty value for clearing the input
      if (value === "") {
        setTransactionData({
          ...transactionData,
          [name]: value
        });
        return;
      }

      // Convert to number and validate
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        setTransactionData({
          ...transactionData,
          [name]: numValue
        });
      }
    } else {
      setTransactionData({
        ...transactionData,
        [name]: value
      });
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    // Reset the file input value
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const resetForm = () => {
    setTransactionData(initialState);
    setFile(null);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      // Append transaction data
      Object.keys(transactionData).forEach(key => {
        if (transactionData[key] !== null && transactionData[key] !== undefined) {
          formData.append(key, transactionData[key]);
        }
      });
      formData.append('bookId', bookId);
      
      // Append file if exists
      if (file) {
        formData.append('file', file);
      }

      const response = await axiosInstance.post(
        `${process.env.REACT_APP_URL}/api/v4/transaction/create-transaction`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        resetForm(); // Reset form state before closing
        onClose(); // Close the form
        
        // Update the parent component
        if (onTransactionAdded) {
          onTransactionAdded();
        }
        // Show success modal
        onStatus('success', response.data.message || 'Transaction added successfully!');
      } else {
        throw new Error(response.data.message || 'Failed to add transaction');
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      onStatus('error', error.message || 'Failed to add transaction');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[60vh] flex items-center justify-center p-2 sm:p-3"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-2xl rounded-xl shadow-lg p-6 relative transition-colors duration-300 ${
          transactionData.transactionType === "you will get"
            ? "bg-green-50 border border-green-200"
            : transactionData.transactionType === "you will give"
            ? "bg-red-50 border border-red-200"
            : "bg-white"
        }`}
      >
        <button
          onClick={handleClose}
          className={`absolute right-4 top-4 p-2 rounded-full transition-colors duration-200 ${
            transactionData.transactionType === "you will get"
              ? "hover:bg-green-100 text-green-700"
              : transactionData.transactionType === "you will give"
              ? "hover:bg-red-100 text-red-700"
              : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="mb-6 text-center">
          <h2 className={`text-2xl font-bold mb-2 ${
            transactionData.transactionType === "you will get"
              ? "text-green-800"
              : transactionData.transactionType === "you will give"
              ? "text-red-800"
              : "text-gray-800"
          }`}>Add Transaction</h2>
          <p className={
            transactionData.transactionType === "you will get"
              ? "text-green-600"
              : transactionData.transactionType === "you will give"
              ? "text-red-600"
              : "text-gray-600"
          }>Record a new transaction with details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="clientUserId"
                className={`block text-sm font-medium ${
                  transactionData.transactionType === "you will get"
                    ? "text-green-700"
                    : transactionData.transactionType === "you will give"
                    ? "text-red-700"
                    : "text-gray-700"
                }`}
              >
                Select Client <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="clientUserId"
                  name="clientUserId"
                  value={transactionData.clientUserId}
                  onChange={handleChange}
                  required
                  className={`w-full p-2.5 pl-4 pr-10 bg-white border text-sm rounded-lg focus:ring-2 transition-colors duration-200 appearance-none cursor-pointer ${
                    transactionData.transactionType === "you will get"
                      ? "border-green-300 focus:ring-green-500 focus:border-green-500 hover:border-green-400"
                      : transactionData.transactionType === "you will give"
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500 hover:border-red-400"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                  }`}
                >
                  <option value="" className="text-gray-500">Choose a client</option>
                  {clients.map((client) => (
                    <option 
                      key={client._id} 
                      value={client._id}
                      className={`py-2 ${
                        transactionData.transactionType === "you will get"
                          ? "text-green-700"
                          : transactionData.transactionType === "you will give"
                          ? "text-red-700"
                          : "text-gray-700"
                      }`}
                    >
                      {client.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                  <svg 
                    className={`h-5 w-5 transition-colors duration-200 ${
                      transactionData.transactionType === "you will get"
                        ? "text-green-500"
                        : transactionData.transactionType === "you will give"
                        ? "text-red-500"
                        : "text-gray-500"
                    }`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor" 
                    aria-hidden="true"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className={`block text-sm font-medium ${
                transactionData.transactionType === "you will get"
                  ? "text-green-700"
                  : transactionData.transactionType === "you will give"
                  ? "text-red-700"
                  : "text-gray-700"
              }`}>
                Transaction Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className={`flex items-center justify-center p-2.5 border rounded-lg cursor-pointer transition-all duration-200 ${
                  transactionData.transactionType === "you will get"
                    ? "bg-green-100 border-green-300 text-green-700 hover:bg-green-200 shadow-sm"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}>
                  <input
                    type="radio"
                    name="transactionType"
                    value="you will get"
                    checked={transactionData.transactionType === "you will get"}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-600 border-green-300 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm font-medium">You will get</span>
                </label>
                <label className={`flex items-center justify-center p-2.5 border rounded-lg cursor-pointer transition-all duration-200 ${
                  transactionData.transactionType === "you will give"
                    ? "bg-red-100 border-red-300 text-red-700 hover:bg-red-200 shadow-sm"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}>
                  <input
                    type="radio"
                    name="transactionType"
                    value="you will give"
                    checked={transactionData.transactionType === "you will give"}
                    onChange={handleChange}
                    className="w-4 h-4 text-red-600 border-red-300 focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm font-medium">You will give</span>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="amount" className={`block text-sm font-medium ${
                transactionData.transactionType === "you will get"
                  ? "text-green-700"
                  : transactionData.transactionType === "you will give"
                  ? "text-red-700"
                  : "text-gray-700"
              }`}>
                Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 font-medium ${
                  transactionData.transactionType === "you will get"
                    ? "text-green-600"
                    : transactionData.transactionType === "you will give"
                    ? "text-red-600"
                    : "text-gray-500"
                }`}>₹</span>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={transactionData.amount}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (e.key === 'e' || e.key === 'E' || e.key === '-' || e.key === '+') {
                      e.preventDefault();
                    }
                    if (e.key === '0' && e.target.value === '') {
                      e.preventDefault();
                    }
                  }}
                  min="1"
                  step="any"
                  required
                  placeholder="Enter amount"
                  className={`w-full pl-7 pr-3 py-2.5 bg-white border text-sm rounded-lg focus:ring-2 transition-colors duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    transactionData.transactionType === "you will get"
                      ? "border-green-300 focus:ring-green-500 focus:border-green-500 hover:border-green-400"
                      : transactionData.transactionType === "you will give"
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500 hover:border-red-400"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
                  }`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={`block text-sm font-medium ${
                transactionData.transactionType === "you will get"
                  ? "text-green-700"
                  : transactionData.transactionType === "you will give"
                  ? "text-red-700"
                  : "text-gray-700"
              }`}>
                Attachment
              </label>
              <div className="relative flex items-center">
                <label className={`flex items-center justify-center p-2.5 border rounded-lg cursor-pointer transition-all duration-200 ${
                  transactionData.transactionType === "you will get"
                    ? "bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
                    : transactionData.transactionType === "you will give"
                    ? "bg-red-50 border-red-300 text-red-700 hover:bg-red-100"
                    : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  />
                </label>
                <span className={`ml-3 text-sm flex-1 truncate ${file ? 'text-gray-900' : 'text-gray-500'}`}>
                  {file ? file.name : 'No file selected'}
                </span>
                {file && (
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className={`p-1.5 rounded-full transition-colors duration-200 ${
                      transactionData.transactionType === "you will get"
                        ? "text-green-700 hover:bg-green-100"
                        : transactionData.transactionType === "you will give"
                        ? "text-red-700 hover:bg-red-100"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <p className={`mt-1 text-xs ${
                transactionData.transactionType === "you will get"
                  ? "text-green-600"
                  : transactionData.transactionType === "you will give"
                  ? "text-red-600"
                  : "text-gray-500"
              }`}>
                Supported: PDF, DOC, DOCX, PNG, JPG, JPEG
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className={`block text-sm font-medium ${
              transactionData.transactionType === "you will get"
                ? "text-green-700"
                : transactionData.transactionType === "you will give"
                ? "text-red-700"
                : "text-gray-700"
            }`}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={transactionData.description}
              onChange={handleChange}
              placeholder="Add transaction details..."
              className={`w-full p-2.5 bg-white border text-sm rounded-lg focus:ring-2 transition-colors duration-200 min-h-[60px] resize-none ${
                transactionData.transactionType === "you will get"
                  ? "border-green-300 focus:ring-green-500 focus:border-green-500 hover:border-green-400"
                  : transactionData.transactionType === "you will give"
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500 hover:border-red-400"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"
              }`}
            ></textarea>
          </div>

          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className={`w-full mt-4 text-white py-2.5 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center space-x-2 ${
                transactionData.transactionType === "you will get"
                  ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                  : transactionData.transactionType === "you will give"
                  ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Transaction</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddTransactions;
