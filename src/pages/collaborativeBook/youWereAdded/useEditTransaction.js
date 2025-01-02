import { useState, useEffect } from 'react';

export const useEditTransaction = (transactionId, setTransaction, { onSuccess, onError } = {}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    id: null,
    amount: "",
    transactionType: "",
    description: "",
  });

  const openEditForm = (entry) => {
    setEditData({
      id: entry._id,
      amount: entry.amount,
      transactionType: entry.transactionType,
      description: entry.description,
    });
    setIsEditing(true);
  };

  const closeEditForm = () => {
    setIsEditing(false);
    setEditData({ id: null, amount: "", transactionType: "", description: "" });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const { id, amount, transactionType, description, file } = editData;
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("amount", parseFloat(amount));
    formData.append("transactionType", transactionType.toLowerCase());
    if (description) formData.append("description", description);
    if (file) formData.append("file", file);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/api/collab-transactions/transactions/${transactionId}/entries/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update transaction");
      }

      const updatedEntry = await response.json();
      console.log('API Response:', updatedEntry);
      
      // If the response is empty or doesn't have the expected structure, fetch the latest data
      if (!updatedEntry || !updatedEntry.data) {
        const token = localStorage.getItem("token");
        const refreshResponse = await fetch(
          `${process.env.REACT_APP_URL}/api/collab-transactions/single-transaction/${transactionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const refreshData = await refreshResponse.json();
        if (refreshData.success) {
          setTransaction(refreshData.data);
          onSuccess?.();
          return;
        }
      }

      // Only try to update the specific entry if we have valid data
      if (updatedEntry && updatedEntry.data) {
        const processedEntry = {
          ...updatedEntry.data,
          transactionDate: updatedEntry.data.transactionDate || new Date().toISOString(),
          initiatedBy: updatedEntry.data.initiatedBy,
          confirmationStatus: updatedEntry.data.confirmationStatus || "pending",
          _id: id
        };

        setTransaction((prev) => ({
          ...prev,
          transactionHistory: prev.transactionHistory.map((entry) =>
            entry._id === id ? processedEntry : entry
          ),
        }));
      }

      onSuccess?.();
    } catch (error) {
      console.error("Error updating transaction:", error);
      onError?.(error);
    }
  };

  return {
    isEditing,
    editData,
    setEditData,
    openEditForm,
    closeEditForm,
    handleEditSubmit,
  };
};
