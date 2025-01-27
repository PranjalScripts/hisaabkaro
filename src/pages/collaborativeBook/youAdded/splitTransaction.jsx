import React, { useState, useEffect } from "react";
import { fetchClients, createTransaction } from "./api";

const SplitTransaction = ({
  onClose,
  originalTransaction,
  bookId,
  onSuccess,
}) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [transactionType, setTransactionType] = useState(
    originalTransaction?.transactionType || "you will get"
  );

  useEffect(() => {
    loadClients();
    if (originalTransaction) {
      setRemainingAmount(originalTransaction.amount);
      setTransactionType(originalTransaction.transactionType);
    }
  }, [originalTransaction]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const clientsData = await fetchClients();
      setClients(clientsData);
    } catch (error) {
      setError("Failed to load clients");
      console.error("Error loading clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size <= 5 * 1024 * 1024) { // 5MB limit
      setFile(selectedFile);
      setError("");
    } else {
      setError("File size should be less than 5MB");
      e.target.value = null;
    }
  };

  const handleSplit = async () => {
    try {
      if (!selectedClient) {
        setError("Please select a client");
        return;
      }

      const splitAmount = parseFloat(amount);
      if (
        isNaN(splitAmount) ||
        splitAmount <= 0 ||
        splitAmount >= originalTransaction.amount
      ) {
        setError(
          "Please enter a valid amount less than the original transaction amount"
        );
        return;
      }

      setLoading(true);
      const token = localStorage.getItem("token");

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("clientUserId", selectedClient);
      formData.append("bookId", bookId);
      formData.append("transactionType", transactionType);
      formData.append("amount", splitAmount);
      formData.append("description", description || originalTransaction.description || "");
      formData.append("transactionId", originalTransaction.transactionId || originalTransaction._id);
      formData.append("parentTransactionId", originalTransaction._id);
      if (file) {
        formData.append("file", file);
      }

      // Create new split transaction with file
      const createResponse = await fetch(`${process.env.REACT_APP_URL}/api/collab-transactions/create-transactions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData
      });

      if (!createResponse.ok) {
        throw new Error("Failed to create split transaction");
      }

      const splitTransactionData = await createResponse.json();

      // Update the original transaction with remaining amount
      const remainingAmount = originalTransaction.amount - splitAmount;
      const updateOriginalResponse = await fetch(
        `${process.env.REACT_APP_URL}/api/collab-transactions/transactions/${originalTransaction.transactionId}/entries/${originalTransaction._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: remainingAmount,
            description: originalTransaction.description || ""
          }),
        }
      );

      if (!updateOriginalResponse.ok) {
        const errorData = await updateOriginalResponse.json();
        console.error("Update Error Response:", errorData);
        throw new Error(
          errorData.error || "Failed to update original transaction"
        );
      }

      setLoading(false);
      // Call onSuccess with updated data
      if (onSuccess) {
        onSuccess({
          originalTransaction: {
            ...originalTransaction,
            amount: remainingAmount,
          },
          splitTransaction: splitTransactionData?.transaction?.transactionHistory?.[0] || {
            ...formData,
            _id: splitTransactionData?._id,
            transactionDate: new Date().toISOString(),
            confirmationStatus: "pending",
            initiatedBy: localStorage.getItem("userName") || "You",
            initiaterId: localStorage.getItem("userId"),
          }
        });
      }
      onClose();
    } catch (error) {
      setLoading(false);
      setError(error.message || "Failed to split transaction");
      console.error("Split Transaction Error:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-[9999]">
      <div className="relative bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full m-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Split Transaction</h2>
            <p className="text-gray-600 mt-1">Original Amount: ₹{originalTransaction?.amount.toLocaleString('en-IN')}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Client Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Client
              </label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount to Split
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    const newAmount = parseFloat(e.target.value) || 0;
                    setAmount(e.target.value);
                    setRemainingAmount(originalTransaction.amount - newAmount);
                  }}
                  placeholder="Enter amount"
                  className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-gray-600">Remaining Amount:</span>
                <span className={`font-medium ${remainingAmount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ₹{remainingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setTransactionType("you will get")}
                  className={`px-4 py-2.5 rounded-lg border transition-all ${
                    transactionType === "you will get"
                      ? "bg-green-50 border-green-500 text-green-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  You Will Get
                </button>
                <button
                  type="button"
                  onClick={() => setTransactionType("you will give")}
                  className={`px-4 py-2.5 rounded-lg border transition-all ${
                    transactionType === "you will give"
                      ? "bg-red-50 border-red-500 text-red-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  You Will Give
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description for the split transaction"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[120px] resize-none"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload File (Optional)
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Max file size: 5MB. Supported formats: PDF, DOC, DOCX, PNG, JPG</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSplit}
            disabled={loading}
            className={`px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Splitting...
              </span>
            ) : (
              "Split Transaction"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SplitTransaction;
