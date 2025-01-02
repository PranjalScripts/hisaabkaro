import { useState } from 'react';

export const useTransactionForm = (transactionId, setTransaction) => {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    transactionType: "",
    amount: "",
    description: "",
    file: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? (value === "" ? "" : parseFloat(value)) : value,
    }));
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!formData.transactionType) {
      setError("Please select a transaction type.");
      return;
    }

    if (formData.amount <= 0) {
      setError("Please enter a valid amount greater than zero.");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    const formDataToSend = new FormData();
    formDataToSend.append("transactionType", formData.transactionType);
    formDataToSend.append("amount", formData.amount);
    formDataToSend.append("description", formData.description);
    if (formData.file) {
      formDataToSend.append("file", formData.file);
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/api/collab-transactions/transactions/${transactionId}/add`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        // Fetch the updated transaction to get the latest data
        const updatedResponse = await fetch(
          `${process.env.REACT_APP_URL}/api/collab-transactions/single-transaction/${transactionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const updatedData = await updatedResponse.json();
        
        if (updatedData.success) {
          setTransaction(updatedData.data);
        }

        setShowForm(false);
        setFormData({
          transactionType: "",
          amount: "",
          description: "",
          file: "",
        });
        setSuccess(true);
      } else {
        console.error("Failed to add transaction.");
        setError(data.message || "Failed to add transaction.");
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      setError("Failed to add the transaction due to a network issue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    showForm,
    formData,
    isSubmitting,
    error,
    success,
    setShowForm,
    setFormData,
    setError,
    setSuccess,
    handleInputChange,
    handleAddTransaction,
  };
};
