import { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';

export const useTransaction = (transactionId) => {
  const [transaction, setTransaction] = useState(null);
  const [updatingEntryId, setUpdatingEntryId] = useState(null);
  const [modalState, setModalState] = useState({
    showDeleteModal: false,
    showSuccessModal: false,
    showErrorModal: false,
    previewImageId: null
  });
  const [deleteTransactionDetails, setDeleteTransactionDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchTransaction();
  }, [transactionId]);

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
      console.error("Error fetching transaction details:", error);
    }
  };

  const updateTransactionStatus = async (entryId) => {
    setUpdatingEntryId(entryId);
    const token = localStorage.getItem("token");

    try {
      // Optimistically update the UI first
      setTransaction((prev) => ({
        ...prev,
        transactionHistory: prev.transactionHistory.map((entry) =>
          entry._id === entryId ? { ...entry, confirmationStatus: "confirmed" } : entry
        ),
      }));

      const response = await fetch(
        `${process.env.REACT_APP_URL}/api/collab-transactions/transactions/${transactionId}/entries/${entryId}/confirm`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        setModalState(prev => ({ ...prev, showSuccessModal: true }));
      } else {
        // Revert the optimistic update if the API call fails
        setTransaction((prev) => ({
          ...prev,
          transactionHistory: prev.transactionHistory.map((entry) =>
            entry._id === entryId ? { ...entry, confirmationStatus: "pending" } : entry
          ),
        }));
        throw new Error("Failed to update transaction status");
      }
    } catch (error) {
      console.error("Error updating transaction status:", error);
      setErrorMessage("Failed to update status. Please try again.");
      setModalState(prev => ({ ...prev, showErrorModal: true }));
    } finally {
      setUpdatingEntryId(null);
    }
  };

  const handleImageClick = (imageUrl) => {
    // Removed function implementation
  };

  const confirmDelete = async () => {
    if (!deleteTransactionDetails) return;
    
    console.log("Deleting transaction with details:", {
      transactionId,
      entryId: deleteTransactionDetails._id,
      fullDetails: deleteTransactionDetails
    });
    
    const token = localStorage.getItem("token");
    try {
      const entryId = deleteTransactionDetails._id;
      if (!entryId) {
        throw new Error("Invalid entry ID");
      }

      const response = await fetch(
        `${process.env.REACT_APP_URL}/api/collab-transactions/transactions/${transactionId}/entries/${entryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log("Delete response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete transaction");
      }

      await fetchTransaction();
      setModalState(prev => ({ ...prev, showDeleteModal: false }));
      setDeleteTransactionDetails(null);
      setModalState(prev => ({ ...prev, showSuccessModal: true }));
    } catch (error) {
      console.error("Error deleting transaction:", error);
      setErrorMessage(error.message || "Failed to delete transaction. Please try again.");
      setModalState(prev => ({ ...prev, showErrorModal: true }));
    }
  };

  const handleDelete = (details) => {
    console.log("Delete details:", {
      details,
      id: details._id,
      transactionId
    });
    if (!details._id) {
      setErrorMessage("Invalid transaction entry. Missing ID.");
      setModalState(prev => ({ ...prev, showErrorModal: true }));
      return;
    }
    setDeleteTransactionDetails(details);
    setModalState(prev => ({ ...prev, showDeleteModal: true }));
  };

  const cancelDelete = () => {
    setModalState(prev => ({ ...prev, showDeleteModal: false }));
    setDeleteTransactionDetails(null);
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isModalOpen: false }));
  };

  const handleDownload = async (file) => {
    try {
      const token = localStorage.getItem("token");
      const fileUrl = `${process.env.REACT_APP_URL}/${file.replace(/\\/g, "/")}`;
      
      const response = await fetch(fileUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch the file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.split(/[\/\\]/).pop(); // Get filename from path
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading file:", error);
      setErrorMessage("Failed to download the file. Please try again.");
      setModalState(prev => ({ ...prev, showErrorModal: true }));
    }
  };

  return {
    transaction,
    setTransaction,
    updatingEntryId,
    userId,
    updateTransactionStatus,
    handleImageClick,
    errorMessage,
    setErrorMessage,
    confirmDelete,
    cancelDelete,
    deleteTransactionDetails,
    setDeleteTransactionDetails,
  };
};
