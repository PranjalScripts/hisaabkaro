import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { saveAs } from "file-saver";
import TransactionHeader from "./TransactionHeader";
import AddTransactionForm from "./AddTransactionForm";
import TransactionTable from "./TransactionTable";
import EditTransactionForm from "./EditTransactionForm";
import FileModal from "./FileModal";
import SuccessModal from "./SuccessModal";
import ErrorModal from "./ErrorModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const History = () => {
  const { transactionId } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [successModal, setSuccessModal] = useState({ isOpen: false, message: "" });
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: "" });
  const [selectedTransactionType, setSelectedTransactionType] = useState("");
  const [editData, setEditData] = useState({
    id: null,
    amount: "",
    description: "",
    transactionType: "",
  });
  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    description: "",
  });
  const userId = localStorage.getItem("userId");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, transaction: null });
  const transactionTableRef = useRef(null);

  //fetch transaction
  useEffect(() => {
    const fetchTransaction = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `${process.env.REACT_APP_URL}/api/collab-transactions/single-transaction/${transactionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        if (data.success) {
          setTransaction(data.data);
        } else {
          console.error("Transaction not found");
        }
      } catch (error) {
        console.error("Error fetching transaction:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [transactionId]);

  //fetch transaction data
  const fetchTransactionData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/api/collab-transactions/single-transaction/${transactionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (data.success) {
        setTransaction(data.data);
      }
    } catch (error) {
      console.error("Error fetching updated transaction:", error);
    }
  };

  //update transaction
  const updateTransactionStatus = async (entryId) => {
    setUpdating(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/api/collab-transactions/transactions/${transactionId}/entries/${entryId}/confirm`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await response.json();
      console.log("Confirmation response:", result); // Debug log

      if (response.ok) {
        // First update the confirmation status
        setTransaction((prev) => ({
          ...prev,
          transactionHistory: prev.transactionHistory.map((entry) =>
            entry._id === entryId
              ? { ...entry, confirmationStatus: "confirmed" }
              : entry
          ),
        }));

        // Then fetch the latest transaction data to get the updated balance
        const updatedDataResponse = await fetch(
          `${process.env.REACT_APP_URL}/api/collab-transactions/single-transaction/${transactionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        const updatedData = await updatedDataResponse.json();
        if (updatedData.success) {
          setTransaction(prev => ({
            ...prev,
            outstandingBalance: updatedData.data.outstandingBalance
          }));
        }

        setSuccessModal({
          isOpen: true,
          message: "Transaction status updated successfully!"
        });
      } else {
        console.error("Failed to update transaction status.");
        setErrorModal({
          isOpen: true,
          message: result.message || "Failed to update status. Please try again."
        });
      }
    } catch (error) {
      console.error("Error updating transaction status:", error);
      setErrorModal({
        isOpen: true,
        message: "An error occurred while updating the status."
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleAddTransaction = async () => {
    if (!transaction) return;
  
    setAdding(true);
    const token = localStorage.getItem("token");
    const parsedAmount = parseFloat(newTransaction.amount);
  
    setErrorModal({ isOpen: false, message: "" });
  
    if (isNaN(parsedAmount)) {
      setErrorModal({
        isOpen: true,
        message: "Please enter a valid amount"
      });
      setAdding(false);
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("clientUserId", transaction.clientUserId._id);
      formData.append("bookId", transaction.bookId._id);
      formData.append("transactionType", selectedTransactionType);
      formData.append("amount", parsedAmount);
      formData.append("description", newTransaction.description);
      formData.append("transactionId", transactionId);
  
      if (newTransaction.file) {
        formData.append("file", newTransaction.file);
      }
  
      const response = await fetch(
        `${process.env.REACT_APP_URL}/api/collab-transactions/create-transactions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
  
      const result = await response.json();
      console.log("Add transaction response:", result);
  
      if (response.ok && result.transaction) {
        // First update with the initial response
        const newTransactionData = {
          ...result.transaction,
          initiatedBy: result.transaction.initiatedBy,
          file: result.transaction.file,
          confirmationStatus: "pending",
          transactionDate: new Date().toISOString(),
        };

        setTransaction(prevState => ({
          ...prevState,
          transactionHistory: [newTransactionData, ...(prevState?.transactionHistory || [])],
        }));

        // Then fetch complete data to ensure everything is up to date
        const updatedDataResponse = await fetch(
          `${process.env.REACT_APP_URL}/api/collab-transactions/single-transaction/${transactionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        const updatedData = await updatedDataResponse.json();
        console.log("Updated transaction data:", updatedData);
        
        if (updatedData.success) {
          setTransaction(prevState => ({
            ...updatedData.data,
            transactionHistory: updatedData.data.transactionHistory.map(entry => ({
              ...entry,
              initiatedBy: entry.initiatedBy,
              file: entry.file
            }))
          }));
        }

        // Reset form
        setNewTransaction({ amount: "", description: "", file: null });
        setSelectedTransactionType("");
        setShowForm(false);

        setSuccessModal({
          isOpen: true,
          message: result.message || "Transaction added successfully!",
        });
      } else {
        console.error("Transaction failed:", result);
        setErrorModal({
          isOpen: true,
          message: result.message || "Failed to add transaction"
        });
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      setErrorModal({
        isOpen: true,
        message: error.message || "An error occurred while adding the transaction.",
      });
    } finally {
      setAdding(false);
    }
  };
  
  

  //download file
  const handleDownload = async () => {
    try {
      // Extract the file name from the URL
      const urlParts = modalImage.split("/");
      const fileName = urlParts[urlParts.length - 1]; // Get the last part of the URL as the file name

      // Fetch the file
      const response = await fetch(modalImage);
      if (!response.ok) {
        throw new Error("Failed to fetch the file");
      }

      // Convert the response to a Blob
      const blob = await response.blob();

      // Save the file with its original name and format
      saveAs(blob, fileName);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleDelete = async (entryId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/api/collab-transactions/transactions/${transactionId}/entries/${entryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        // Get the updated transaction data with new balance
        const updatedDataResponse = await fetch(
          `${process.env.REACT_APP_URL}/api/collab-transactions/single-transaction/${transactionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        const updatedData = await updatedDataResponse.json();
        
        if (updatedData.success) {
          setTransaction(prev => ({
            ...prev,
            outstandingBalance: updatedData.data.outstandingBalance,
            transactionHistory: prev.transactionHistory.filter(t => t._id !== entryId)
          }));
        }

        setSuccessModal({
          isOpen: true,
          message: "Transaction deleted successfully",
        });
      } else {
        setErrorModal({
          isOpen: true,
          message: result.message || "Failed to delete transaction",
        });
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      setErrorModal({
        isOpen: true,
        message: "An error occurred while deleting the transaction",
      });
    } finally {
      setDeleteModal({ isOpen: false, transaction: null });
    }
  };

  const handleDeleteClick = (transaction) => {
    setDeleteModal({ isOpen: true, transaction });
  };

  //edit transaction
  const openEditForm = (entry) => {
    setEditData({
      id: entry._id,
      amount: entry.amount,
      description: entry.description || "",
      transactionType: entry.transactionType,
    });
    setIsEditing(true);
  };

  //close edit form
  const closeEditForm = () => {
    setIsEditing(false);
    setEditData({
      id: null,
      amount: "",
      description: "",
      transactionType: "",
    });
  };

  //edit transaction submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const { id, amount, transactionType, description, file } = editData;

    const token = localStorage.getItem("token");

    // Create FormData object for file upload and other data
    const formData = new FormData();
    formData.append("amount", parseFloat(amount));
    formData.append("transactionType", transactionType.toLowerCase());
    formData.append("description", description);

    // Add the file if it exists
    if (file) {
      formData.append("file", file); // The key 'file' must match the backend field
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/api/collab-transactions/transactions/${transactionId}/entries/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`, // Note: 'Content-Type' is automatically set for FormData
          },
          body: formData,
        }
      );

      if (response.ok) {
        const updatedEntry = await response.json();
        console.log("Edit response:", updatedEntry); // Debug log

        // Fetch latest transaction data to get updated balance
        const updatedDataResponse = await fetch(
          `${process.env.REACT_APP_URL}/api/collab-transactions/single-transaction/${transactionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        const updatedData = await updatedDataResponse.json();
        
        if (updatedData.success) {
          setTransaction((prev) => ({
            ...prev,
            outstandingBalance: updatedData.data.outstandingBalance,
            transactionHistory: prev.transactionHistory.map((history) =>
              history._id === id ? {
                ...history,
                ...updatedEntry.data,
                confirmationStatus: "pending",
                transactionDate: new Date().toISOString()
              } : history
            ),
          }));
        }

        setSuccessModal({
          isOpen: true,
          message: "Transaction updated successfully!"
        });

        closeEditForm();
        
      } else {
        const errorData = await response.json();
        setErrorModal({
          isOpen: true,
          message: errorData.message || "Failed to update the transaction. Please try again."
        });
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
      setErrorModal({
        isOpen: true,
        message: "An error occurred while updating the transaction."
      });
    }
  };

  //handle image click
  const handleImageClick = (fileUrl) => {
    setModalImage(fileUrl);
    setIsModalOpen(true);
  };

  //close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-bold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <TransactionHeader transaction={transaction} />

      {/* Action Buttons */}
      <div className="relative z-5 flex gap-4 mb-6 mt-6">
        <button
          type="button"
          onClick={() => {
            setNewTransaction({ amount: "", description: "", file: null });
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
            setNewTransaction({ amount: "", description: "", file: null });
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
        {/* Export PDF Button */}
        <button
          type="button"
          onClick={() => {
            if (transaction && transactionTableRef.current) {
              transactionTableRef.current.exportToPDF();
            }
          }}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl 
          hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586L7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
          </svg>
          Export PDF
        </button>
      </div>

      <TransactionTable
        ref={transactionTableRef}
        transaction={transaction}
        openEditForm={openEditForm}
        handleDeleteClick={handleDeleteClick}
        handleImageClick={handleImageClick}
        userId={userId}
        updating={updating}
        updateTransactionStatus={updateTransactionStatus}
      />

      {showForm && (
        <AddTransactionForm
          showForm={showForm}
          selectedTransactionType={selectedTransactionType}
          newTransaction={newTransaction}
          setNewTransaction={setNewTransaction}
          handleAddTransaction={handleAddTransaction}
          setShowForm={setShowForm}
          adding={adding}
          setSelectedTransactionType={setSelectedTransactionType}
        />
      )}

      <EditTransactionForm
        isEditing={isEditing}
        editData={editData}
        setEditData={setEditData}
        handleEditSubmit={handleEditSubmit}
        closeEditForm={closeEditForm}
      />

      <FileModal
        isOpen={isModalOpen}
        fileUrl={modalImage}
        onClose={closeModal}
        onDownload={handleDownload}
      />

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, transaction: null })}
        onConfirm={() => deleteModal.transaction && handleDelete(deleteModal.transaction._id)}
        transactionDetails={deleteModal.transaction}
      />

      <SuccessModal
        isOpen={successModal.isOpen}
        message={successModal.message}
        onClose={() => setSuccessModal({ ...successModal, isOpen: false })}
      />

      <ErrorModal
        isOpen={errorModal.isOpen}
        message={errorModal.message}
        onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
      />
    </div>
  );
};

export default History;