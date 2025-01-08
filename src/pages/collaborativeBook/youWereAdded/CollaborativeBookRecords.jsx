import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import { AiOutlineCheckCircle, AiOutlineClockCircle, AiOutlineFileImage } from "react-icons/ai";
import { BsFilePdf } from "react-icons/bs";
import TransactionForm from "./TransactionForm";
import EditTransactionForm from "./EditTransactionForm";
import { useTransaction } from "./useTransaction";
import { useTransactionForm } from "./useTransactionForm";
import { useEditTransaction } from "./useEditTransaction";
import DeleteConfirmationModal from "../youAdded/DeleteConfirmationModal";
import SuccessModal from "../youAdded/SuccessModal";
import ErrorModal from "../youAdded/ErrorModal";
import FileModal from "../youAdded/FileModal";
import { Image, Button, Dropdown, Space} from "antd";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  DownloadOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  SortAscendingOutlined,
  FilterOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  PlusOutlined,
  MinusOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";

const CollaborativeBookRecords = () => {
  const { transactionId } = useParams();
  const {
    transaction,
    setTransaction,
    updatingEntryId,
    userId,
    updateTransactionStatus,
    handleDeleteClick,
    handleDownload,
    errorMessage,
    setErrorMessage,
    confirmDelete,
    cancelDelete,
    deleteTransactionDetails,
    setDeleteTransactionDetails, // Get the setter function
  } = useTransaction(transactionId);

  const {
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
  } = useTransactionForm(transactionId, setTransaction);

  const [modalState, setModalState] = useState({
    showDeleteModal: false,
    showSuccessModal: false,
    showErrorModal: false,
    previewImageId: null,
    isModalOpen: false,
    modalImage: null,
    currentFile: null,
    selectedEntry: null,
  });

  const [successMessage, setSuccessMessage] = useState("");

  const {
    isEditing,
    editData,
    setEditData,
    openEditForm,
    closeEditForm,
    handleEditSubmit,
  } = useEditTransaction(transactionId, setTransaction, {
    onSuccess: () => {
      setSuccessMessage("Transaction updated successfully!");
      setModalState((prev) => ({ ...prev, showSuccessModal: true }));
      closeEditForm();
    },
    onError: (error) => {
      setErrorMessage(
        error.message || "Failed to update transaction. Please try again."
      );
      setModalState((prev) => ({ ...prev, showErrorModal: true }));
    },
  });

  const [sortConfig, setSortConfig] = useState({
    type: "date", // 'date' or 'amount'
    order: "desc", // 'asc' or 'desc'
  });

  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'confirmed', 'pending'
  const [userFilter, setUserFilter] = useState({ id: 'all', name: 'All' });
  const [clientFilter, setClientFilter] = useState("all");
  const [uniqueUsers, setUniqueUsers] = useState([]);
  const [uniqueClients, setUniqueClients] = useState([]);
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'grid'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (transaction?.transactionHistory) {
      // Extract unique users and clients with full information
      const usersMap = new Map();
      const clientsMap = new Map();

      transaction.transactionHistory.forEach((history) => {
        if (history.initiatedBy) {
          usersMap.set(history.initiaterId, {
            id: history.initiaterId,
            name: history.initiatedBy
          });
        }
        if (history.clientName) {
          clientsMap.set(history.clientId, {
            id: history.clientId,
            name: history.clientName
          });
        }
      });

      setUniqueUsers(Array.from(usersMap.values()));
      setUniqueClients(Array.from(clientsMap.values()));
    }
  }, [transaction?.transactionHistory]);

  const [userItems, setUserItems] = useState([
    {
      key: "all",
      label: "All",
    }
  ]);

  // Update userItems when uniqueUsers changes
  useEffect(() => {
    const updatedUserItems = [
      {
        key: "all",
        label: "All",
      },
      ...uniqueUsers.map((user) => ({
        key: user.id,
        label: user.name,
      })),
    ];
    setUserItems(updatedUserItems);
  }, [uniqueUsers]);

  const filterAndSortTransactions = (transactions) => {
    if (!transactions) return [];

    // First filter by status, user, and client
    let filteredTransactions = transactions.filter((history) => {
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "confirmed"
          ? history.confirmationStatus === "confirmed"
          : statusFilter === "pending"
          ? history.confirmationStatus !== "confirmed"
          : true);

      const matchesUser =
        userFilter.id === "all" || history.initiaterId === userFilter.id;
      const matchesClient =
        clientFilter === "all" || history.clientId === clientFilter;

      return matchesStatus && matchesUser && matchesClient;
    });

    // Then sort the filtered results
    return [...filteredTransactions].sort((a, b) => {
      if (sortConfig.type === "date") {
        const dateA = new Date(a.transactionDate);
        const dateB = new Date(b.transactionDate);
        return sortConfig.order === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        const amountA = a.amount || 0;
        const amountB = b.amount || 0;
        return sortConfig.order === "asc"
          ? amountA - amountB
          : amountB - amountA;
      }
    });
  };

  const handleSortChange = (value) => {
    switch (value) {
      case "oldest":
        setSortConfig({ type: "date", order: "asc" });
        break;
      case "newest":
        setSortConfig({ type: "date", order: "desc" });
        break;
      case "amount_high":
        setSortConfig({ type: "amount", order: "desc" });
        break;
      case "amount_low":
        setSortConfig({ type: "amount", order: "asc" });
        break;
      default:
        setSortConfig({ type: "date", order: "desc" });
    }
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
  };

  const handleUserFilterChange = (value) => {
    const selectedUser = uniqueUsers.find(user => user.id === value) || { id: 'all', name: 'All' };
    setUserFilter(selectedUser);
  };

  const handleClientFilterChange = (value) => {
    setClientFilter(value);
  };

  const clearAllFilters = () => {
    setStatusFilter("all");
    setUserFilter({ id: 'all', name: 'All' });
    setClientFilter("all");
    setSortConfig({
      type: "date",
      order: "desc",
    });
  };

  const [sortItems] = useState([
    {
      key: "newest",
      label: "Newest First",
    },
    {
      key: "oldest",
      label: "Oldest First",
    },
    {
      key: "amount_high",
      label: "Amount: High to Low",
    },
    {
      key: "amount_low",
      label: "Amount: Low to High",
    },
  ]);

  const [statusItems] = useState([
    {
      key: "all",
      label: "All",
    },
    {
      key: "confirmed",
      label: "Confirmed",
    },
    {
      key: "pending",
      label: "Pending",
    },
  ]);

  const handleFileClick = (file) => {
    setModalState((prev) => ({
      ...prev,
      isModalOpen: true,
      modalImage: `${process.env.REACT_APP_URL}/${file.replace(/\\/g, "/")}`,
      currentFile: file,
    }));
  };

  const sortedAndFilteredTransactions = filterAndSortTransactions(
    transaction?.transactionHistory
  );

  useEffect(() => {
    if (error) {
      setModalState((prev) => ({
        ...prev,
        showErrorModal: true,
        errorMessage: error,
      }));
      setError("");
    }
  }, [error, setError, setModalState]);

  useEffect(() => {
    if (success) {
      setSuccessMessage("Transaction added successfully!");
      setModalState((prev) => ({ ...prev, showSuccessModal: true }));
      setSuccess(false);
    }
  }, [success, setSuccess, setModalState]);
  
  const getSortLabel = () => {
    if (sortConfig.type === "date") {
      return sortConfig.order === "desc" ? "Newest First" : "Oldest First";
    }
    return sortConfig.order === "desc"
      ? "Amount: High to Low"
      : "Amount: Low to High";
  };

  const getStatusLabel = () => {
    switch (statusFilter) {
      case "confirmed":
        return "Confirmed";
      case "pending":
        return "Pending";
      default:
        return "All";
    }
  };

  const getUserLabel = () => {
    return userFilter.name;
  };

  const renderGridView = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {sortedAndFilteredTransactions.map((entry, index) => (
          <div
            key={entry._id}
            className={`bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-200 relative overflow-hidden ${
              entry.confirmationStatus === 'pending'
                ? 'border border-yellow-200'
                : entry.transactionType === 'you will get'
                  ? 'border border-red-200'
                  : 'border border-green-200'
            }`}
          >
            {/* Status Notch */}
            <div
              className={`absolute -top-4 -right-4 w-16 h-16 rounded-full transform rotate-45 ${
                entry.confirmationStatus === 'pending'
                  ? 'bg-yellow-200'
                  : entry.transactionType === 'you will get'
                    ? 'bg-red-200'
                    : 'bg-green-200'
              }`}
            />

            {/* User Info */}
            <div className="flex items-start space-x-3 mb-6">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-medium text-gray-600">
                  {entry.initiatedBy.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{entry.initiatedBy}</h3>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-sm font-medium ${
                  entry.transactionType === 'you will get'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  <span className={
                    entry.transactionType === 'you will get' 
                      ? 'text-red-800'
                      : 'text-green-800'
                  }>
                    {entry.transactionType === 'you will get' ? 'you will give' : 'you will get'}
                  </span>
                </span>
                <p className="text-sm text-gray-500 mt-1">{entry.description || 'No description'}</p>
              </div>
            </div>

            {/* Amount */}
            <div className="mb-4">
              <span className={`text-3xl font-bold ${
                entry.transactionType === 'you will get'
                  ? 'text-red-600'
                  : 'text-green-600'
              }`}>
                ₹{entry.amount?.toFixed(2) || "0.00"}
              </span>
              <p className="text-sm text-gray-500 mt-1">{new Date(entry.transactionDate).toLocaleString()}</p>
            </div>

            {/* Status and Actions */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center">
                {entry.confirmationStatus === 'confirmed' ? (
                  <span className="flex items-center text-green-600">
                    <AiOutlineCheckCircle className="w-5 h-5 mr-1" />
                    <span className="text-sm">Confirmed</span>
                  </span>
                ) : (
                  <span className="flex items-center text-yellow-600">
                    <AiOutlineClockCircle className="w-5 h-5 mr-1" />
                    <span className="text-sm">Pending</span>
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {entry.file && (
                  <button
                    onClick={() => handleFileClick(entry.file)}
                    className={`p-2 rounded-full hover:bg-gray-50 transition-colors ${
                      entry.file.toLowerCase().endsWith('.pdf')
                        ? 'text-red-500'
                        : 'text-blue-500'
                    }`}
                    title={entry.file.toLowerCase().endsWith('.pdf') ? 'View PDF' : 'View Image'}
                  >
                    {entry.file.toLowerCase().endsWith('.pdf') ? (
                      <BsFilePdf className="w-5 h-5" />
                    ) : (
                      <AiOutlineFileImage className="w-5 h-5" />
                    )}
                  </button>
                )}

                {userId === entry.initiaterId ? (
                  <>
                    <button
                      onClick={() => openEditForm(entry)}
                      className="p-2 rounded-full hover:bg-gray-50 transition-colors text-yellow-500"
                      title="Edit"
                    >
                      <MdEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry)}
                      className="p-2 rounded-full hover:bg-gray-50 transition-colors text-red-500"
                      title="Delete"
                    >
                      <MdDelete className="w-5 h-5" />
                    </button>
                  </>
                ) : entry.confirmationStatus === 'pending' ? (
                  <button
                    onClick={() => updateTransactionStatus(entry._id)}
                    disabled={updatingEntryId === entry._id}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 text-sm"
                  >
                    {updatingEntryId === entry._id ? 'Updating...' : 'Confirm'}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleDelete = (entry) => {
    setDeleteTransactionDetails(entry);
    setModalState((prev) => ({
      ...prev,
      showDeleteModal: true,
    }));
  };

  const handleConfirmDelete = async () => {
    await confirmDelete();
    setSuccessMessage("Transaction deleted successfully!");
    setModalState((prev) => ({
      ...prev,
      showDeleteModal: false,
      showSuccessModal: true,
    }));
  };

  const handleCancelDelete = () => {
    setDeleteTransactionDetails(null);
    setModalState((prev) => ({
      ...prev,
      showDeleteModal: false,
    }));
  };

  const totalItems = sortedAndFilteredTransactions?.length || 0;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems =
    sortedAndFilteredTransactions?.slice(startIndex, endIndex) || [];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.setTextColor(37, 99, 235); // Set title to blue
    doc.text("Transaction History", 14, 15);

    // Add cards for user info and balance
    const pageWidth = doc.internal.pageSize.width;
    const cardWidth = (pageWidth - 28 - (3 * 7)) / 4; // Distribute space evenly among 4 cards with gaps
    const cardHeight = 30;
    const startY = 25;
    const gap = 7;

    // Card 1 - User Name (Blue)
    doc.setFillColor(239, 246, 255); // Light blue background
    doc.setDrawColor(37, 99, 235); // Blue border
    doc.roundedRect(14, startY, cardWidth, cardHeight, 3, 3, 'FD');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text("Your Name", 17, startY + 7);
    doc.setFontSize(11);
    doc.setTextColor(37, 99, 235);
    doc.text(transaction.userId.name, 17, startY + 15, { maxWidth: cardWidth - 6 });

    // Card 2 - Other User (Purple)
    doc.setFillColor(245, 243, 255); // Light purple background
    doc.setDrawColor(139, 92, 246); // Purple border
    doc.roundedRect(14 + cardWidth + gap, startY, cardWidth, cardHeight, 3, 3, 'FD');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text("Other User", 17 + cardWidth + gap, startY + 7);
    doc.setFontSize(11);
    doc.setTextColor(139, 92, 246);
    doc.text(transaction.clientUserId.name, 17 + cardWidth + gap, startY + 15, { maxWidth: cardWidth - 6 });

    // Card 3 - Book Name (Green)
    doc.setFillColor(240, 253, 244); // Light green background
    doc.setDrawColor(34, 197, 94); // Green border
    doc.roundedRect(14 + (cardWidth + gap) * 2, startY, cardWidth, cardHeight, 3, 3, 'FD');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text("Book Name", 17 + (cardWidth + gap) * 2, startY + 7);
    doc.setFontSize(11);
    doc.setTextColor(34, 197, 94);
    doc.text(transaction.bookId.bookname, 17 + (cardWidth + gap) * 2, startY + 15, { maxWidth: cardWidth - 6 });

    // Card 4 - Outstanding Balance (Orange/Red based on balance)
    const balance = transaction.outstandingBalance || 0;
    const isPositive = balance >= 0;
    
    // Set fill color based on balance
    if (isPositive) {
        doc.setFillColor(255, 247, 237); // Light orange background
        doc.setDrawColor(249, 115, 22); // Orange border
    } else {
        doc.setFillColor(254, 242, 242); // Light red background
        doc.setDrawColor(239, 68, 68); // Red border
    }
    
    const card4X = 14 + (cardWidth + gap) * 3;
    doc.roundedRect(card4X, startY, cardWidth, cardHeight, 3, 3, 'FD');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text("Outstanding Balance", card4X + 3, startY + 7);
    doc.setFontSize(11);
    
    // Set text color based on balance
    if (isPositive) {
        doc.setTextColor(249, 115, 22); // Orange text
    } else {
        doc.setTextColor(239, 68, 68); // Red text
    }
    
    // Format the balance with appropriate spacing
    const formattedBalance = Math.abs(balance).toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
    });
    const balanceText = `${formattedBalance}`;
    doc.text(
      balanceText,
      card4X + 3,
      startY + 15,
      { maxWidth: cardWidth - 6 }
    );
    
    doc.setFontSize(8);
    doc.text(
      isPositive ? "You will give" : "You will get",
      card4X + 3,
      startY + 22
    );

    // Add filters info
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105); // Reset text color

    // Prepare table data
    const tableData = sortedAndFilteredTransactions.map((history, index) => [
      (currentPage - 1) * pageSize + index + 1,
      history?.transactionDate
        ? new Date(history.transactionDate).toLocaleString()
        : "N/A",
      history.initiatedBy,
      history?.transactionType === "you will give"
        ? "You will get"
        : "You will give",
      history?.amount?.toFixed(2) || "0.00",
      history?.description || "",
      history?.confirmationStatus === "confirmed" ? "Confirmed" : "Pending",
    ]);

    // Define table headers
    const headers = [
      [
        "S.No",
        "Date",
        "Initiated By",
        "Type",
        "Amount",
        "Description",
        "Status",
      ],
    ];

    // Add table to PDF
    doc.autoTable({
      head: headers,
      body: tableData,
      startY: startY + cardHeight + 10, // Adjusted starting position for table
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 10 }, // S.No
        1: { cellWidth: 35 }, // Date
        2: { cellWidth: 25 }, // Initiated By
        3: { cellWidth: 20 }, // Type
        4: { cellWidth: 20 }, // Amount
        5: { cellWidth: 50 }, // Description
        6: { cellWidth: 20 }, // Status
      },
      headStyles: {
        fillColor: [37, 99, 235], // Changed to blue
        textColor: 255,
        fontSize: 8,
        fontStyle: "bold",
      },
      bodyStyles: {
        textColor: [71, 85, 105], // Slate gray for better readability
      },
      alternateRowStyles: {
        fillColor: [239, 246, 255], // Light blue background
      },
      margin: { top: 40 },
      didDrawPage: function (data) {
        // Add footer to each page
        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;
        const footerY = pageHeight - 25;

        // Footer divider line
        doc.setDrawColor(37, 99, 235); // Blue divider
        doc.setLineWidth(0.5);
        doc.line(14, footerY, pageWidth - 14, footerY);

        // Footer content
        doc.setFontSize(12);
        doc.setTextColor(37, 99, 235);
        doc.text("HisaabKaro", 14, footerY + 8);

        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105); // Slate gray
        doc.text("Your Digital Expense Management Partner", 14, footerY + 14);

        doc.setTextColor(37, 99, 235);
        doc.text(
          "www.hisaabkaro.com",
          pageWidth / 2,
          footerY + 14,
          { align: "center" }
        );

        doc.setFontSize(7);
        doc.setTextColor(71, 85, 105); // Slate gray
        const currentDate = new Date().toLocaleDateString("en-US");
        const year = new Date().getFullYear();
        doc.text(`Generated: ${currentDate}`, 14, footerY + 20);
        doc.text(
          ` ${year} HisaabKaro. All rights reserved`,
          pageWidth - 14,
          footerY + 20,
          { align: "right" }
        );
      }
    });

    // Save PDF
    doc.save("transaction-history.pdf");
  };

  if (!transaction) {
    return (
      <div className="text-center py-10">Loading transaction details...</div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center sm:text-left">
          Transaction Details
        </h1>

        {/* Transaction Info Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* User Name Card */}
          <div className="group relative bg-gradient-to-br from-cyan-50 via-sky-50 to-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/50 via-sky-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6">
              <p className="text-sm font-medium text-cyan-600/90 mb-1">
                User Name
              </p>
              <p className="text-xl font-bold text-cyan-700 truncate">
                {transaction.userId.name}
              </p>
            </div>
          </div>

          {/* Other User Card */}
          <div className="group relative bg-gradient-to-br from-pink-50 via-rose-50 to-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-100/50 via-rose-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6">
              <p className="text-sm font-medium text-pink-600/90 mb-1">
                Other User
              </p>
              <p className="text-xl font-bold text-pink-700 truncate">
                {transaction.clientUserId.name}
              </p>
            </div>
          </div>

          {/* Book Name Card */}
          <div className="group relative bg-gradient-to-br from-indigo-50 via-violet-50 to-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/50 via-violet-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6">
              <p className="text-sm font-medium text-indigo-600/90 mb-1">
                Book Name
              </p>
              <p className="text-xl font-bold text-indigo-700 truncate">
                {transaction.bookId.bookname}
              </p>
            </div>
          </div>

          {/* Outstanding Balance Card */}
          <div
            className={`group relative bg-gradient-to-br ${
              userId === transaction.initiaterId
                ? transaction.outstandingBalance > 0
                  ? "from-teal-50 via-emerald-50"
                  : "from-orange-50 via-amber-50"
                : transaction.outstandingBalance > 0
                ? "from-orange-50 via-amber-50"
                : "from-teal-50 via-emerald-50"
            } to-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${
                userId === transaction.initiaterId
                  ? transaction.outstandingBalance > 0
                    ? "from-teal-100/50 via-emerald-50/30"
                    : "from-orange-100/50 via-amber-50/30"
                  : transaction.outstandingBalance > 0
                  ? "from-orange-100/50 via-amber-50/30"
                  : "from-teal-100/50 via-emerald-50/30"
              } to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            ></div>
            <div className="relative p-6">
              <p
                className={`text-sm font-medium ${
                  userId === transaction.initiaterId
                    ? transaction.outstandingBalance > 0
                      ? "text-teal-600/90"
                      : "text-orange-600/90"
                    : transaction.outstandingBalance > 0
                    ? "text-orange-600/90"
                    : "text-teal-600/90"
                } mb-1`}
              >
                Outstanding Balance
              </p>
              <p
                className={`text-xl font-bold ${
                  userId === transaction.initiaterId
                    ? transaction.outstandingBalance > 0
                      ? "text-teal-700"
                      : "text-orange-700"
                    : transaction.outstandingBalance > 0
                    ? "text-orange-700"
                    : "text-teal-700"
                }`}
              >
                {Math.abs(transaction.outstandingBalance).toLocaleString('en-IN', {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Action Buttons */}
          <div className="relative z-5 flex gap-4 mb-6 mt-6">
            <button
              onClick={() => {
                setShowForm(true);
                setFormData((prev) => ({
                  ...prev,
                  transactionType: "you will give",
                }));
              }}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl 
          hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-md"
            >
              <PlusOutlined className="mr-2" />
              <span className="font-semibold">You Will Get</span>
            </button>
            <button
              onClick={() => {
                setShowForm(true);
                setFormData((prev) => ({
                  ...prev,
                  transactionType: "you will get",
                }));
              }}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-xl 
          hover:from-red-600 hover:to-rose-700 transform hover:scale-105 transition-all duration-200 shadow-md"
            >
              <MinusOutlined className="mr-2" />
              <span className="font-semibold">You Will Give</span>
            </button>
            <button
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl 
          hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-md"
              onClick={handleExportPDF}
            >
              <DownloadOutlined className="mr-2" />
              <span className="font-semibold">Export PDF</span>
            </button>
          </div>

          {showForm && (
            <div
              className="fixed inset-0 z-50 overflow-y-auto"
              aria-labelledby="modal-title"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div
                  className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                  aria-hidden="true"
                ></div>

                {/* Modal panel */}
                <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                  <TransactionForm
                    formData={formData}
                    isSubmitting={isSubmitting}
                    onSubmit={handleAddTransaction}
                    onChange={handleInputChange}
                    onCancel={() => setShowForm(false)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Filter Section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Dropdown
                menu={{
                  items: sortItems,
                  onClick: ({ key }) => handleSortChange(key),
                }}
                trigger={["click"]}
              >
                <Button className="flex items-center font-semibold h-10">
                  <Space>
                    <SortAscendingOutlined />
                    <span className="font-semibold">Sort By</span>
                  </Space>
                </Button>
              </Dropdown>

              <Dropdown
                menu={{
                  items: statusItems,
                  onClick: ({ key }) => handleStatusFilterChange(key),
                }}
                trigger={["click"]}
              >
                <Button className="flex items-center h-10">
                  <Space>
                    <FilterOutlined />
                    <span className="font-semibold">
                      Status: {getStatusLabel()}
                    </span>
                  </Space>
                </Button>
              </Dropdown>

              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'all',
                      label: 'All'
                    },
                    ...uniqueUsers.map(user => ({
                      key: user.id,
                      label: user.name
                    }))
                  ],
                  onClick: ({ key }) => handleUserFilterChange(key),
                }}
                trigger={["click"]}
              >
                <Button className="flex items-center h-10">
                  <Space>
                    <FilterOutlined />
                    <span className="font-semibold">
                      Added By: {userFilter.name}
                    </span>
                  </Space>
                </Button>
              </Dropdown>

              <Button
                onClick={clearAllFilters}
                className="flex items-center h-10"
                disabled={
                  statusFilter === "all" &&
                  userFilter.id === "all" &&
                  sortConfig.type === "date" &&
                  sortConfig.order === "desc"
                }
              >
                <span className="font-semibold">Clear Filter</span>
              </Button>

              <Button
                onClick={() =>
                  setViewMode(viewMode === "list" ? "grid" : "list")
                }
                type={viewMode === "list" ? "primary" : "default"}
                className={`flex items-center h-10 ${
                  viewMode === "list"
                    ? "bg-blue-500 hover:bg-blue-600 border-none"
                    : ""
                }`}
              >
                <Space>
                  {viewMode === "list" ? (
                    <AppstoreOutlined />
                  ) : (
                    <UnorderedListOutlined />
                  )}
                  <span className="font-semibold">
                    {viewMode === "list" ? "List View" : "Grid View"}
                  </span>
                </Space>
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <Dropdown
                menu={{
                  items: [
                    { value: 10, label: "10 per page" },
                    { value: 20, label: "20 per page" },
                    { value: 50, label: "50 per page" },
                    { value: 100, label: "100 per page" },
                  ],
                  onClick: ({ key }) => handlePageSizeChange(parseInt(key)),
                }}
                trigger={["click"]}
              >
                <Button className="flex items-center h-10">
                  <Space>
                    <span className="font-semibold">
                      {pageSize} per page
                    </span>
                  </Space>
                </Button>
              </Dropdown>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-10"
                  icon={<LeftOutlined />}
                />
                <span className="inline-block px-4 py-2 min-w-[40px] text-center bg-blue-500 text-white rounded">
                  {currentPage}
                </span>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-10"
                  icon={<RightOutlined />}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-100 rounded-md shadow-sm">
            <span className="text-gray-800 font-medium">
              <b className="text-blue-600">Showing:</b> {startIndex + 1} to{" "}
              {Math.min(endIndex, totalItems)}
            </span>
            <span className="text-gray-800 font-medium">
              <b className="text-green-600">Total Entries:</b> {totalItems}
            </span>
          </div>
          {/* Transaction History */}
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <div className="max-w-screen-xl mx-auto">
              {viewMode === "list" ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                        S.No
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                        Date
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                        Initiated By
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                        Type
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                        Amount
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                        Description
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                        Files
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                        Status
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.length > 0 ? (
                      currentItems.map((history, index) => (
                        <tr
                          key={history._id}
                          className={`${
                            history?.transactionType === "you will give"
                              ? "hover:bg-green-50"
                              : "hover:bg-red-50"
                          }`}
                        >
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                            {(currentPage - 1) * pageSize + index + 1}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                            {history?.transactionDate
                              ? new Date(
                                  history.transactionDate
                                ).toLocaleString()
                              : "N/A"}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                            {history.initiatedBy}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className={`font-medium ${history?.transactionType === "you will give" ? "text-green-600" : "text-red-600"}`}>
                              {history?.transactionType === "you will give"
                                ? "You will get"
                                : "You will give"}
                            </span>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <span className={`font-medium ${history?.transactionType === "you will give" ? "text-green-600" : "text-red-600"}`}>
                              ₹{history?.amount?.toFixed(2) || "0.00"}
                            </span>
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-900 break-words w-64">
                            {history?.description || ""}
                          </td>
                          <td className="px-3 py-4">
                            <div className="h-6 flex items-center justify-center">
                              {typeof history.file === "string" &&
                              history.file.trim() !== "" ? (
                                history.file.toLowerCase().endsWith(".pdf") ? (
                                  <div
                                    className="cursor-pointer hover:opacity-80 h-6 flex items-center"
                                    onClick={() => handleFileClick(history.file)}
                                  >
                                    <FilePdfOutlined
                                      style={{
                                        fontSize: "24px",
                                        color: "#ff4d4f",
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div className="relative cursor-pointer h-6 flex items-center">
                                    <div
                                      onClick={() =>
                                        handleFileClick(history.file)
                                      }
                                    >
                                      <FileImageOutlined
                                        style={{
                                          fontSize: "24px",
                                          color: "#1890ff",
                                        }}
                                        className="hover:opacity-80"
                                      />
                                    </div>
                                    <Image
                                      src={`${
                                        process.env.REACT_APP_URL
                                      }/${history.file.replace(/\\/g, "/")}`}
                                      alt="Transaction File"
                                      className="hidden"
                                      preview={{
                                        visible:
                                          modalState.previewImageId ===
                                          history._id,
                                        onVisibleChange: (visible) => {
                                          setModalState((prev) => ({
                                            ...prev,
                                            previewImageId: visible
                                              ? history._id
                                              : null,
                                          }));
                                        },
                                        mask: null,
                                        toolbarRender: (
                                          _,
                                          { transform: { scale }, actions }
                                        ) => (
                                          <div className="ant-image-preview-operations">
                                            <div className="ant-image-preview-operations-operation">
                                              <DownloadOutlined
                                                onClick={() =>
                                                  handleDownload(history.file)
                                                }
                                              />
                                            </div>
                                            <div className="ant-image-preview-operations-operation">
                                              <RotateLeftOutlined
                                                onClick={actions.onRotateLeft}
                                              />
                                            </div>
                                            <div className="ant-image-preview-operations-operation">
                                              <RotateRightOutlined
                                                onClick={actions.onRotateRight}
                                              />
                                            </div>
                                            <div className="ant-image-preview-operations-operation">
                                              <ZoomOutOutlined
                                                disabled={scale === 1}
                                                onClick={actions.onZoomOut}
                                              />
                                            </div>
                                            <div className="ant-image-preview-operations-operation">
                                              <ZoomInOutlined
                                                disabled={scale === 50}
                                                onClick={actions.onZoomIn}
                                              />
                                            </div>
                                          </div>
                                        ),
                                      }}
                                    />
                                  </div>
                                )
                              ) : (
                                <span className="text-sm text-gray-500 whitespace-nowrap h-6 flex items-center">
                                  No file
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            {history?.confirmationStatus === "confirmed" ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Confirmed
                              </span>
                            ) : userId === history?.initiaterId ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Pending
                              </span>
                            ) : (
                              <button
                                onClick={() =>
                                  updateTransactionStatus(history._id)
                                }
                                disabled={updatingEntryId === history._id}
                                className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                  updatingEntryId === history._id
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                              >
                                {updatingEntryId === history._id
                                  ? "Updating..."
                                  : "Confirm"}
                              </button>
                            )}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                            {userId === history?.initiaterId ? (
                              <div className="flex space-x-3">
                                <button
                                  onClick={() => openEditForm(history)}
                                  className="text-yellow-600 hover:text-yellow-900 transition-colors"
                                  title="Edit"
                                >
                                  <MdEdit className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(history)}
                                  className="text-red-600 hover:text-red-900 transition-colors"
                                  title="Delete"
                                >
                                  <MdDelete className="h-5 w-5" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500 italic">
                                Not initiated by you
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="9"
                          className="px-3 py-10 text-center text-gray-500"
                        >
                          No transactions found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : (
                renderGridView()
              )}
            </div>
          </div>

          {/* Pagination footer */}
        </div>

        <EditTransactionForm
          editData={editData}
          onSubmit={handleEditSubmit}
          onChange={setEditData}
          onCancel={closeEditForm}
          isOpen={isEditing}
        />

        <DeleteConfirmationModal
          isOpen={modalState.showDeleteModal}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          transactionDetails={deleteTransactionDetails}
        />

        <SuccessModal
          isOpen={modalState.showSuccessModal}
          message={successMessage}
          onClose={() => {
            setModalState((prev) => ({ ...prev, showSuccessModal: false }));
            setSuccessMessage("");
          }}
        />

        <ErrorModal
          isOpen={modalState.showErrorModal}
          message={errorMessage}
          onClose={() =>
            setModalState((prev) => ({ ...prev, showErrorModal: false }))
          }
        />

        <FileModal
          isOpen={modalState.isModalOpen}
          fileUrl={modalState.modalImage}
          onClose={() =>
            setModalState((prev) => ({
              ...prev,
              isModalOpen: false,
              modalImage: null,
              currentFile: null,
            }))
          }
          onDownload={() => handleDownload(modalState.currentFile)}
        />
      </div>
    </div>
  );
};

export default CollaborativeBookRecords;

<style jsx>{`
  .ant-btn {
    background: transparent;
    border: none !important;
    box-shadow: none !important;
  }
  .ant-btn:hover {
    color: white !important;
    border-color: transparent !important;
  }
  .ant-btn:focus {
    color: white !important;
    border-color: transparent !important;
  }
`}</style>;
