import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { saveAs } from "file-saver";
import TransactionHeader from "./TransactionHeader";
import AddTransactionForm from "./AddTransactionForm";
import TransactionTable from "./TransactionTable";
import EditTransactionForm from "./EditTransactionForm";
import ImageModal from "./ImageModal";
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

      if (response.ok) {
        setTransaction((prev) => ({
          ...prev,
          transactionHistory: prev.transactionHistory.map((entry) =>
            entry._id === entryId
              ? { ...entry, confirmationStatus: "confirmed" }
              : entry
          ),
        }));
        setSuccessModal({
          isOpen: true,
          message: "Transaction status updated successfully!"
        });
      } else {
        console.error("Failed to update transaction status.");
        setErrorModal({
          isOpen: true,
          message: "Failed to update status. Please try again."
        });
      }
    } catch (error) {
      console.error("Error updating transaction status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleAddTransaction = async () => {
    if (!transaction) return;
  
    setAdding(true);
    const token = localStorage.getItem("token");
    const parsedAmount = parseFloat(newTransaction.amount);
  
    // Clear any previous error modals before starting
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
  
      // Log the result to check its structure
      console.log("Result object:", result);
      console.log("Message:", result.message);
      console.log("Transaction object:", result.transaction);
  
      // Check if the response message indicates success
      if (response.ok && result.transaction) {
        // Success block
        setErrorModal({ isOpen: false, message: "" });
  
        // Create new transaction data
        const newTransactionData = {
          _id: result.transaction._id,
          amount: parsedAmount,
          transactionType: selectedTransactionType,
          description: newTransaction.description || "",
          initiatedBy: localStorage.getItem("name") || "You",
          initiaterId: userId,
          confirmationStatus: "pending",
          transactionDate: new Date().toISOString(),
          file: result.transaction.file || "",
          clientUserId: transaction.clientUserId,
          bookId: transaction.bookId,
        };
  
        // Update the state with the new transaction
        setTransaction((prevState) => ({
          ...prevState,
          transactionHistory: [newTransactionData, ...(prevState?.transactionHistory || [])],
          outstandingBalance: result.transaction.outstandingBalance,
        }));
  
        // Reset form
        setNewTransaction({ amount: "", description: "", file: null });
        setSelectedTransactionType("");
        setShowForm(false);
  
        // Show success modal with the success message from the server
        setSuccessModal({
          isOpen: true,
          message: result.message || "Transaction added successfully!",
        });
      } else {
        // Failure block
        console.log("Transaction failed:", result);
        setErrorModal({
          isOpen: true,
          message: result.message || "Failed to add transaction"
        });
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      // Show error modal for any caught errors
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

      if (response.ok) {
        setSuccessModal({
          isOpen: true,
          message: "Transaction deleted successfully",
        });
        
        // Update the transaction list by filtering out the deleted transaction
        setTransaction(prev => ({
          ...prev,
          transactionHistory: prev.transactionHistory.filter(t => t._id !== entryId)
        }));
      } else {
        const result = await response.json();
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
        setTransaction((prev) => ({
          ...prev,
          transactionHistory: prev.transactionHistory.map((history) =>
            history._id === id ? { ...history, ...updatedEntry.data } : history
          ),
        }));
        setSuccessModal({
          isOpen: true,
          message: "Transaction updated successfully!"
        });

        closeEditForm();
        
      } else {
        setErrorModal({
          isOpen: true,
          message: "Failed to update the transaction. Please try again."
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
  const handleImageClick = (imagePath) => {
    setModalImage(
      `${process.env.REACT_APP_URL}/${imagePath.replace(/\\/g, "/")}`
    );
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

      <TransactionTable
        transaction={transaction}
        userId={userId}
        updating={updating}
        updateTransactionStatus={updateTransactionStatus}
        openEditForm={openEditForm}
        handleDeleteClick={handleDeleteClick}
        handleImageClick={handleImageClick}
      />

      <EditTransactionForm
        isEditing={isEditing}
        editData={editData}
        setEditData={setEditData}
        handleEditSubmit={handleEditSubmit}
        closeEditForm={closeEditForm}
      />

      <ImageModal
        isModalOpen={isModalOpen}
        modalImage={modalImage}
        closeModal={closeModal}
        handleDownload={handleDownload}
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