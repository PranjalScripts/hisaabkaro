 import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import SuccessModal from "../../components/SuccessModal";
import ErrorModal from "../../components/ErrorModal";
import TransactionModal from '../../components/transaction/TransactionModal';
import FileViewer from './components/FileViewer';
import TransactionHeader from './components/TransactionHeader';
import TransactionTable from './components/TransactionTable';
import TransactionActions from './components/TransactionActions';
import { 
  fetchTransactionDetails, 
  fetchBookName, 
  fetchClientName,
  createTransaction,
  updateTransaction,
  deleteTransactionEntry
} from './services/transactionService';

const TransactionHistory = () => {
  const { transactionId } = useParams();
  const [transactionData, setTransactionData] = useState({
    transactionHistory: [],
    outstandingBalance: 0,
    bookId: "",
    clientUserId: ""
  });
  const [bookId, setBookId] = useState("");
  const [clientUserId, setClientUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    transactionType: "",
    file: null,
    transactionDate: "",
  });
  const [editFormData, setEditFormData] = useState({
    amount: "",
    description: "",
    transactionType: "",
    file: null,
    transactionDate: "",
  });
  const [bookName, setBookName] = useState("");
  const [clientName, setClientName] = useState("");
  const [showFileModal, setShowFileModal] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshTransactionData = useCallback(async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      const response = await fetchTransactionDetails(transactionId);
      
      if (!response || !response.data) {
        console.error("Invalid API response:", response);
        throw new Error("Failed to fetch transaction details");
      }

      const sanitizedData = {
        transactionHistory: Array.isArray(response.data.transactionHistory) 
          ? response.data.transactionHistory.filter(t => t && typeof t === 'object')
          : [],
        outstandingBalance: typeof response.data.outstandingBalance === 'number'
          ? response.data.outstandingBalance
          : 0,
        bookId: response.data.bookId || "",
        clientUserId: response.data.clientUserId || ""
      };

      setTransactionData(sanitizedData);
      
      if (sanitizedData.bookId) {
        const bookNameResult = await fetchBookName(sanitizedData.bookId);
        setBookName(bookNameResult || "Unknown Book");
      }
      
      if (sanitizedData.clientUserId) {
        const clientNameResult = await fetchClientName(sanitizedData.clientUserId);
        setClientName(clientNameResult || { name: "Unknown Client", mobile: "N/A" });
      }
    } catch (err) {
      console.error("Error in refreshTransactionData:", err);
      setErrorMessage(err.message || "Failed to refresh transaction data");
      setShowErrorModal(true);
      setTransactionData({
        transactionHistory: [],
        outstandingBalance: 0,
        bookId: "",
        clientUserId: ""
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [transactionId, isRefreshing]);

  useEffect(() => {
    const loadTransactionDetails = async () => {
      try {
        setLoading(true);
        const response = await fetchTransactionDetails(transactionId);
        if (response.success) {
          const data = response.data;
          setTransactionData({
            transactionHistory: data.transactionHistory || [],
            outstandingBalance: data.outstandingBalance || 0,
            bookId: data.bookId || "",
            clientUserId: data.clientUserId || ""
          });
          setBookId(data.bookId || "");
          setClientUserId(data.clientUserId || "");
          const bookNameResult = await fetchBookName(data.bookId);
          const clientNameResult = await fetchClientName(data.clientUserId);
          setBookName(bookNameResult);
          setClientName(clientNameResult);
        } else {
          throw new Error("Failed to fetch transaction details.");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (transactionId) loadTransactionDetails();
  }, [transactionId]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(formData.amount);
    if (isNaN(parsedAmount)) {
      setErrorMessage("Please enter a valid amount");
      setShowErrorModal(true);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("amount", parsedAmount);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("transactionType", modalType === "You Will Give" ? "you will give" : "you will get");
    formDataToSend.append("transactionId", transactionId);
    formDataToSend.append("bookId", bookId);
    formDataToSend.append("clientUserId", clientUserId);
    if (formData.file) {
      formDataToSend.append("file", formData.file);
    }

    try {
      const response = await createTransaction(formDataToSend);
      if (response.success) {
        setSuccessMessage("Transaction created successfully!");
        setShowSuccessModal(true);
        setShowModal(false);
        setFormData({ amount: "", description: "", file: null });
        
        await refreshTransactionData();
        
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 2000);
      } else {
        setErrorMessage(response.message || "Failed to create transaction");
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      setErrorMessage(error.response?.data?.message || "An error occurred while creating the transaction");
      setShowErrorModal(true);
    }
  };

  const handleEdit = (entry) => {
    console.log("Edit button clicked", entry); // Debug log
    if (!entry) {
      console.error("Invalid entry object received in handleEdit");
      return;
    }

    // Sanitize the entry data before setting state
    const sanitizedEditData = {
      amount: typeof entry.amount === 'number' ? entry.amount : 0,
      description: entry.description || "",
      transactionType: entry.transactionType || "",
      transactionDate: entry.transactionDate || new Date().toISOString(),
      file: null
    };

    setEditingEntry(entry);
    setEditFormData(sanitizedEditData);
    setShowEditModal(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setEditFormData(prev => ({
        ...prev,
        file: files[0]
      }));
    } else {
      setEditFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("amount", Number(editFormData.amount));
      formData.append("description", editFormData.description);
      formData.append("transactionType", editFormData.transactionType);
      formData.append("transactionDate", editFormData.transactionDate);
      if (editFormData.file) {
        formData.append("file", editFormData.file);
      }

      const response = await updateTransaction(transactionId, editingEntry._id, formData);
      if (response.success) {
        handleCloseEditModal();
        setSuccessMessage("Transaction updated successfully!");
        setShowSuccessModal(true);
        
        await refreshTransactionData();
        
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 2000);
      } else {
        throw new Error(response.message || "Failed to update transaction");
      }
    } catch (err) {
      setErrorMessage(err.message || "Error updating transaction");
      setShowErrorModal(true);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingEntry(null);
    setEditFormData({
      amount: "",
      description: "",
      transactionType: "",
      file: null,
      transactionDate: "",
    });
  };

  const handleDelete = useCallback((entry) => {
    console.log("Delete button clicked", entry); // Debug log
    if (!entry || !entry._id) {
      console.error("Invalid entry for deletion");
      return;
    }

    setEntryToDelete(entry);
    setShowDeleteModal(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!entryToDelete || !entryToDelete._id) {
      console.error("No valid entry to delete");
      setShowDeleteModal(false);
      return;
    }

    try {
      console.log("Deleting transaction:", entryToDelete._id);
      const response = await deleteTransactionEntry(transactionId, entryToDelete._id);
      console.log("Delete response:", response);

      if (response && response.success) {
        setSuccessMessage("Transaction deleted successfully!");
        setShowSuccessModal(true);
        
        // Refresh data after successful deletion
        await refreshTransactionData();
      } else {
        throw new Error(response?.message || "Failed to delete transaction");
      }
    } catch (error) {
      console.error("Delete error:", error);
      setErrorMessage(error.message || "Failed to delete transaction");
      setShowErrorModal(true);
    } finally {
      setShowDeleteModal(false);
      setEntryToDelete(null);
      
      setTimeout(() => {
        if (showSuccessModal) setShowSuccessModal(false);
        if (showErrorModal) setShowErrorModal(false);
      }, 2000);
    }
  }, [entryToDelete, transactionId, refreshTransactionData, showSuccessModal, showErrorModal]);

  const handleActionClick = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const handleViewFile = useCallback((entry) => {
    console.log("View file clicked, entry:", entry);

    if (!entry) {
      console.error("No entry provided to handleViewFile");
      return;
    }

    // Get the filename from the entry
    const fileName = entry.file;
    console.log("File name:", fileName);

    if (fileName) {
      setCurrentFile(fileName);
      setShowFileModal(true);
    } else {
      console.error("No file found in entry:", entry);
      setErrorMessage("No file available for this transaction");
      setShowErrorModal(true);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!transactionData || !Array.isArray(transactionData.transactionHistory)) {
    console.error("Invalid transaction data:", transactionData);
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> Invalid transaction data</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TransactionHeader
          bookName={bookName || "Unknown Book"}
          clientName={clientName || { name: "Unknown Client", mobile: "N/A" }}
          outstandingBalance={typeof transactionData.outstandingBalance === 'number' ? transactionData.outstandingBalance : 0}
        />

        <div className="mt-8">
          <TransactionActions 
            onActionClick={handleActionClick}
            transactions={transactionData.transactionHistory}
            bookName={bookName || "Unknown Book"}
            clientName={clientName || { name: "Unknown Client", mobile: "N/A" }}
            outstandingBalance={typeof transactionData.outstandingBalance === 'number' ? transactionData.outstandingBalance : 0}
          />
          
          <div className="mt-6">
            <TransactionTable
              transactions={transactionData.transactionHistory}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewFiles={handleViewFile}
              currentPage={currentPage}
              entriesPerPage={entriesPerPage}
              onPageChange={(page) => setCurrentPage(page)}
              onEntriesPerPageChange={(entries) => {
                setEntriesPerPage(entries);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {showModal && (
        <TransactionModal
          showModal={showModal}
          setShowModal={setShowModal}
          modalType={modalType}
          handleFormSubmit={handleFormSubmit}
          formData={formData}
          handleInputChange={handleInputChange}
        />
      )}

      {showEditModal && (
        <TransactionModal
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          modalType="Edit Transaction"
          handleFormSubmit={handleEditSubmit}
          formData={editFormData}
          handleInputChange={handleEditFormChange}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmationModal
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          message="Are you sure you want to delete this transaction?"
        />
      )}

      {showSuccessModal && (
        <SuccessModal
          show={showSuccessModal}
          message={successMessage}
          onClose={() => setShowSuccessModal(false)}
        />
      )}

      {showErrorModal && (
        <ErrorModal
          show={showErrorModal}
          message={errorMessage}
          onClose={() => setShowErrorModal(false)}
        />
      )}

      {showFileModal && currentFile && (
        <FileViewer
          file={currentFile}
          onClose={() => {
            console.log("Closing file viewer");
            setShowFileModal(false);
            setCurrentFile(null);
          }}
        />
      )}
    </div>
  );
};

export default TransactionHistory;
