import { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';

export const useTransaction = (transactionId) => {
  const [transaction, setTransaction] = useState(null);
  const [updatingEntryId, setUpdatingEntryId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);
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
        alert("Transaction status updated successfully!");
      } else {
        console.error("Failed to update transaction status.");
        alert("Failed to update status. Please try again.");
      }
    } catch (error) {
      console.error("Error updating transaction status:", error);
    } finally {
      setUpdatingEntryId(null);
    }
  };

  const handleDelete = async (entryId) => {
    const token = localStorage.getItem("token");
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_URL}/api/collab-transactions/transactions/${transactionId}/entries/${entryId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          setTransaction((prev) => ({
            ...prev,
            transactionHistory: prev.transactionHistory.filter(
              (entry) => entry._id !== entryId
            ),
          }));
          alert("Transaction deleted successfully!");
        } else {
          console.error("Failed to delete transaction.");
          alert("Failed to delete transaction. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  const handleImageClick = (imagePath) => {
    setModalImage(
      `${process.env.REACT_APP_URL}/${imagePath.replace(/\\/g, "/")}`
    );
    setIsModalOpen(true);
  };

  const handleDownload = async () => {
    try {
      const urlParts = modalImage.split("/");
      const fileName = urlParts[urlParts.length - 1];
      const response = await fetch(modalImage);
      if (!response.ok) {
        throw new Error("Failed to fetch the file");
      }
      const blob = await response.blob();
      saveAs(blob, fileName);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return {
    transaction,
    setTransaction,
    updatingEntryId,
    isModalOpen,
    modalImage,
    userId,
    setIsModalOpen,
    setModalImage,
    updateTransactionStatus,
    handleDelete,
    handleImageClick,
    handleDownload,
  };
};
