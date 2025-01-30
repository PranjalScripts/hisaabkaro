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
  //eslint-disable-next-line
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
      formData.append("file", file);
    }

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

      if (response.ok) {
        const updatedEntry = await response.json();
        console.log("Updated entry response:", updatedEntry); // Debug log

        // First update the local state with the edited transaction
        setTransaction((prev) => {
          // Get the current history entry
          const currentEntry = prev.transactionHistory.find(h => h._id === id);
          console.log("Current entry:", currentEntry);
          console.log("Server response file:", updatedEntry?.data?.file);
          
          let fileUrl;
          if (updatedEntry?.data?.file) {
            // Clean up and encode the server file path
            const filePath = updatedEntry.data.file
              .replace(/\\/g, '/') // Replace backslashes with forward slashes
              .replace(/^\/+/, ''); // Remove leading slashes
            
            // Check if the file path already includes the API URL
            if (filePath.includes(process.env.REACT_APP_URL)) {
              fileUrl = filePath;
            } else {
              // First decode to handle any existing encoding
              const decodedPath = decodeURIComponent(filePath);
              // Then encode properly
              const encodedPath = encodeURIComponent(decodedPath).replace(/%2F/g, '/');
              fileUrl = `${process.env.REACT_APP_URL}/${encodedPath}`;
            }
            console.log("Using server file URL:", fileUrl);
          } else if (file instanceof File) {
            // If we have a new file but no server URL yet, create a temporary URL
            fileUrl = URL.createObjectURL(file);
            console.log("Using temporary file URL:", fileUrl);
          } else {
            // Keep existing file URL
            fileUrl = currentEntry?.file;
            console.log("Keeping existing file URL:", fileUrl);
          }

          return {
            ...prev,
            transactionHistory: prev.transactionHistory.map((history) =>
              history._id === id ? {
                ...history,
                amount: parseFloat(amount),
                transactionType: transactionType.toLowerCase(),
                description: description,
                file: fileUrl,
                confirmationStatus: "pending",
                transactionDate: new Date().toISOString()
              } : history
            ),
          };
        });

        // Then fetch latest transaction data to get updated balance and complete transaction data
        const updatedDataResponse = await fetch(
          `${process.env.REACT_APP_URL}/api/collab-transactions/single-transaction/${transactionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        const updatedData = await updatedDataResponse.json();
        console.log("Complete updated data:", updatedData); // Debug log
        
        if (updatedData.success) {
          // Update with the complete data from server, including correct file paths
          setTransaction((prev) => {
            const updatedHistory = prev.transactionHistory.map(history => {
              const serverEntry = updatedData.data.transactionHistory.find(h => h._id === history._id);
              if (serverEntry && serverEntry.file) {
                const filePath = serverEntry.file
                  .replace(/\\/g, '/') // Replace backslashes with forward slashes
                  .replace(/^\/+/, ''); // Remove leading slashes
                
                // Check if the file path already includes the API URL
                let finalFileUrl;
                if (filePath.includes(process.env.REACT_APP_URL)) {
                  finalFileUrl = filePath;
                } else {
                  // First decode to handle any existing encoding
                  const decodedPath = decodeURIComponent(filePath);
                  // Then encode properly
                  const encodedPath = encodeURIComponent(decodedPath).replace(/%2F/g, '/');
                  finalFileUrl = `${process.env.REACT_APP_URL}/${encodedPath}`;
                }

                return {
                  ...history,
                  ...serverEntry,
                  file: finalFileUrl
                };
              }
              return history;
            });

            return {
              ...updatedData.data,
              transactionHistory: updatedHistory
            };
          });
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
    console.log("Opening file with URL:", fileUrl); // Debug log
    if (!fileUrl) {
      console.error("No file URL provided");
      return;
    }

    try {
      // Remove any duplicate base URLs
      const baseUrl = process.env.REACT_APP_URL;
      let cleanUrl = fileUrl;
      
      // If the URL starts with the base URL multiple times, remove the extras
      while (cleanUrl.includes(`${baseUrl}/${baseUrl}`)) {
        cleanUrl = cleanUrl.replace(`${baseUrl}/${baseUrl}`, baseUrl);
      }
      
      // If the URL doesn't start with the base URL at all, add it
      if (!cleanUrl.startsWith(baseUrl)) {
        cleanUrl = `${baseUrl}/${cleanUrl.replace(/^\/+/, '')}`;
      }

      console.log("Final URL:", cleanUrl);
      setModalImage(cleanUrl);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error processing file URL:", error);
      setErrorModal({
        isOpen: true,
        message: "Error opening file. Please try again."
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
  };

  const handleSplitSuccess = (updatedData) => {
    if (!updatedData) return;

    // Update the transaction state with the new data
    setTransaction(prevTransaction => {
      if (!prevTransaction?.transactionHistory) return prevTransaction;

      // Only update the original transaction amount, don't add the split transaction
      const updatedEntries = prevTransaction.transactionHistory.map(entry =>
        entry._id === updatedData.originalTransaction._id
          ? { ...entry, amount: updatedData.originalTransaction.amount }
          : entry
      );

      return {
        ...prevTransaction,
        transactionHistory: updatedEntries,
        outstandingBalance: prevTransaction.outstandingBalance
      };
    });

    setSuccessModal({
      isOpen: true,
      message: "Transaction split successfully!"
    });
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
      <div className="relative z-5 mb-6 mt-6">
        {/* Desktop View */}
        <div className="hidden sm:flex gap-4">
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
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586L7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                clipRule="evenodd"
              />
            </svg>
            Export PDF
          </button>
        </div>

        {/* Mobile View */}
        <div className="grid grid-cols-2 gap-3 sm:hidden">
          <button
            type="button"
            onClick={() => {
              setNewTransaction({ amount: "", description: "", file: null });
              setSelectedTransactionType("you will get");
              setShowForm(true);
            }}
            className="flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl 
            active:from-green-600 active:to-emerald-700 shadow-md text-sm"
          >
            <svg
              className="w-4 h-4 mr-1.5"
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
            Get
          </button>
          <button
            type="button"
            onClick={() => {
              setNewTransaction({ amount: "", description: "", file: null });
              setSelectedTransactionType("you will give");
              setShowForm(true);
            }}
            className="flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white font-medium rounded-xl 
            active:from-red-600 active:to-rose-700 shadow-md text-sm"
          >
            <svg
              className="w-4 h-4 mr-1.5"
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
            Give
          </button>
          <button
            type="button"
            onClick={() => {
              if (transaction && transactionTableRef.current) {
                transactionTableRef.current.exportToPDF();
              }
            }}
            className="flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl 
            active:from-blue-600 active:to-indigo-700 shadow-md text-sm col-span-2"
          >
            <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586L7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                clipRule="evenodd"
              />
            </svg>
            Export PDF
          </button>
        </div>
      </div>

      <TransactionTable
        ref={transactionTableRef}
        transaction={transaction}
        userId={userId}
        updating={updating}
        updateTransactionStatus={updateTransactionStatus}
        handleDeleteClick={handleDeleteClick}
        handleImageClick={handleImageClick}
        handleAddTransaction={fetchTransactionData}
        onSplitSuccess={handleSplitSuccess}
        openEditForm={openEditForm}
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
        onConfirm={() =>
          deleteModal.transaction && handleDelete(deleteModal.transaction._id)
        }
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