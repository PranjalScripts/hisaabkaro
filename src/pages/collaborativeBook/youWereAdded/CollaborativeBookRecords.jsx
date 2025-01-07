import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import TransactionForm from "./TransactionForm";
import EditTransactionForm from "./EditTransactionForm";
import { useTransaction } from "./useTransaction";
import { useTransactionForm } from "./useTransactionForm";
import { useEditTransaction } from "./useEditTransaction";
import DeleteConfirmationModal from "../youAdded/DeleteConfirmationModal";
import SuccessModal from "../youAdded/SuccessModal";
import ErrorModal from "../youAdded/ErrorModal";
import FileModal from "../youAdded/FileModal";
import { 
  Image, 
  Select, 
  Button, 
  Dropdown, 
  Space 
} from "antd";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  DownloadOutlined, 
  RotateLeftOutlined, 
  RotateRightOutlined, 
  ZoomInOutlined, 
  ZoomOutOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  FilterOutlined,
  ClearOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  FileExcelOutlined,
  PlusOutlined,
  MinusOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';

const { Option } = Select;

const CollaborativeBookRecords = () => {
  const { transactionId } = useParams();
  const {
    transaction,
    setTransaction,
    updatingEntryId,
    userId,
    updateTransactionStatus,
    handleDelete,
    handleImageClick,
    handleDownload,
    errorMessage,
    setErrorMessage,
    confirmDelete,
    cancelDelete,
    deleteTransactionDetails,
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
    currentFile: null
  });

  const {
    isEditing,
    editData,
    setEditData,
    openEditForm,
    closeEditForm,
    handleEditSubmit,
  } = useEditTransaction(transactionId, setTransaction, {
    onSuccess: () => {
      setModalState(prev => ({ ...prev, showSuccessModal: true }));
      closeEditForm();
    },
    onError: (error) => {
      setErrorMessage(error.message || "Failed to update transaction. Please try again.");
      setModalState(prev => ({ ...prev, showErrorModal: true }));
    }
  });

  const [sortConfig, setSortConfig] = useState({
    type: 'date', // 'date' or 'amount'
    order: 'desc'  // 'asc' or 'desc'
  });

  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'confirmed', 'pending'
  const [userFilter, setUserFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [uniqueUsers, setUniqueUsers] = useState([]);
  const [uniqueClients, setUniqueClients] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (transaction?.transactionHistory) {
      // Extract unique users and clients
      const users = new Set();
      const clients = new Set();
      
      transaction.transactionHistory.forEach(history => {
        if (history.initiatedBy) {
          users.add(history.initiatedBy);
        }
        if (history.clientName) {
          clients.add(history.clientName);
        }
      });

      setUniqueUsers(Array.from(users));
      setUniqueClients(Array.from(clients));
    }
  }, [transaction?.transactionHistory]);

  const filterAndSortTransactions = (transactions) => {
    if (!transactions) return [];

    // First filter by status, user, and client
    let filteredTransactions = transactions.filter(history => {
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'confirmed' ? history.confirmationStatus === 'confirmed' : 
         statusFilter === 'pending' ? history.confirmationStatus !== 'confirmed' : true);

      const matchesUser = userFilter === 'all' || history.initiatedBy === userFilter;
      const matchesClient = clientFilter === 'all' || history.clientName === clientFilter;

      return matchesStatus && matchesUser && matchesClient;
    });

    // Then sort the filtered results
    return [...filteredTransactions].sort((a, b) => {
      if (sortConfig.type === 'date') {
        const dateA = new Date(a.transactionDate);
        const dateB = new Date(b.transactionDate);
        return sortConfig.order === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        const amountA = a.amount || 0;
        const amountB = b.amount || 0;
        return sortConfig.order === 'asc' ? amountA - amountB : amountB - amountA;
      }
    });
  };

  const handleSortChange = (value) => {
    switch(value) {
      case 'oldest':
        setSortConfig({ type: 'date', order: 'asc' });
        break;
      case 'newest':
        setSortConfig({ type: 'date', order: 'desc' });
        break;
      case 'amount_high':
        setSortConfig({ type: 'amount', order: 'desc' });
        break;
      case 'amount_low':
        setSortConfig({ type: 'amount', order: 'asc' });
        break;
      default:
        setSortConfig({ type: 'date', order: 'desc' });
    }
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
  };

  const handleUserFilterChange = (value) => {
    setUserFilter(value);
  };

  const handleClientFilterChange = (value) => {
    setClientFilter(value);
  };

  const clearAllFilters = () => {
    setStatusFilter('all');
    setUserFilter('all');
    setClientFilter('all');
    setSortConfig({
      type: 'date',
      order: 'desc'
    });
  };

  const [sortItems] = useState([
    {
      key: 'newest',
      label: 'Newest First',
    },
    {
      key: 'oldest',
      label: 'Oldest First',
    },
    {
      key: 'amount_high',
      label: 'Amount: High to Low',
    },
    {
      key: 'amount_low',
      label: 'Amount: Low to High',
    },
  ]);

  const [statusItems] = useState([
    {
      key: 'all',
      label: 'All',
    },
    {
      key: 'confirmed',
      label: 'Confirmed',
    },
    {
      key: 'pending',
      label: 'Pending',
    },
  ]);

  const [userItems] = useState([
    {
      key: 'all',
      label: 'All',
    },
    ...(uniqueUsers.map(user => ({
      key: user,
      label: user,
    }))),
  ]);

  const handleFileClick = (file) => {
    setModalState(prev => ({
      ...prev,
      isModalOpen: true,
      modalImage: `${process.env.REACT_APP_URL}/${file.replace(/\\/g, "/")}`,
      currentFile: file
    }));
  };

  const sortedAndFilteredTransactions = filterAndSortTransactions(transaction?.transactionHistory);

  useEffect(() => {
    if (error) {
      setModalState(prev => ({ 
        ...prev, 
        showErrorModal: true,
        errorMessage: error 
      }));
      setError("");
    }
  }, [error, setError, setModalState]);

  useEffect(() => {
    if (success) {
      setModalState(prev => ({ ...prev, showSuccessModal: true }));
      setSuccess(false);
    }
  }, [success, setSuccess, setModalState]);

  const getSortLabel = () => {
    if (sortConfig.type === 'date') {
      return sortConfig.order === 'desc' ? 'Newest First' : 'Oldest First';
    }
    return sortConfig.order === 'desc' ? 'Amount: High to Low' : 'Amount: Low to High';
  };

  const getStatusLabel = () => {
    switch (statusFilter) {
      case 'confirmed':
        return 'Confirmed';
      case 'pending':
        return 'Pending';
      default:
        return 'All';
    }
  };

  const getUserLabel = () => {
    if (userFilter === 'all') return 'Both';
    return userFilter;
  };

  const renderGridView = (transactions) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {transactions.map((history, index) => (
        <div key={history._id} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <div className="text-sm font-medium text-gray-900">#{index + 1}</div>
            <div className="text-sm text-gray-500">
              {history?.transactionDate ? new Date(history.transactionDate).toLocaleString() : 'N/A'}
            </div>
          </div>
          
          <div className="mb-3">
            <div className="text-sm font-medium text-gray-700">Initiated By</div>
            <div className="text-sm text-gray-900">{history.initiatedBy}</div>
          </div>

          <div className="mb-3">
            <div className="text-sm font-medium text-gray-700">Type</div>
            <div className="text-sm text-gray-900">
              {history?.transactionType === "you will give" ? "You will get" : "You will give"}
            </div>
          </div>

          <div className="mb-3">
            <div className="text-sm font-medium text-gray-700">Amount</div>
            <div className="text-sm font-medium text-gray-900">
              {history?.amount?.toFixed(2) || '0.00'}
            </div>
          </div>

          <div className="mb-3">
            <div className="text-sm font-medium text-gray-700">Description</div>
            <div className="text-sm text-gray-900 break-words">
              {history?.description || '-'}
            </div>
          </div>

          <div className="mb-3">
            <div className="text-sm font-medium text-gray-700">File</div>
            <div className="mt-1">
              {typeof history.file === "string" && history.file.trim() !== "" ? (
                history.file.toLowerCase().endsWith('.pdf') ? (
                  <div 
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => handleFileClick(history.file)}
                  >
                    <FilePdfOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />
                  </div>
                ) : (
                  <div className="relative cursor-pointer">
                    <div onClick={() => handleFileClick(history.file)}>
                      <FileImageOutlined 
                        style={{ fontSize: '24px', color: '#1890ff' }} 
                        className="hover:opacity-80"
                      />
                    </div>
                    <Image
                      src={`${process.env.REACT_APP_URL}/${history.file.replace(/\\/g, "/")}`}
                      alt="Transaction File"
                      className="hidden"
                      preview={{
                        visible: modalState.previewImageId === history._id,
                        onVisibleChange: (visible) => {
                          setModalState(prev => ({
                            ...prev,
                            previewImageId: visible ? history._id : null
                          }));
                        },
                        mask: null,
                        toolbarRender: (_, { transform: { scale }, actions }) => (
                          <div className="ant-image-preview-operations">
                            <div className="ant-image-preview-operations-operation">
                              <DownloadOutlined onClick={() => handleDownload(history.file)} />
                            </div>
                            <div className="ant-image-preview-operations-operation">
                              <RotateLeftOutlined onClick={actions.onRotateLeft} />
                            </div>
                            <div className="ant-image-preview-operations-operation">
                              <RotateRightOutlined onClick={actions.onRotateRight} />
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
                        )
                      }}
                    />
                  </div>
                )
              ) : (
                <span className="text-sm text-gray-500">No file</span>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
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
                  onClick={() => updateTransactionStatus(history._id)}
                  disabled={updatingEntryId === history._id}
                  className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    updatingEntryId === history._id ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {updatingEntryId === history._id ? "Updating..." : "Confirm"}
                </button>
              )}
            </div>

            {userId === history?.initiaterId && (
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
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const totalItems = sortedAndFilteredTransactions?.length || 0;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems = sortedAndFilteredTransactions?.slice(startIndex, endIndex) || [];

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
    doc.text('Transaction History', 14, 15);
    
    // Add filters info
    doc.setFontSize(10);
    doc.text(`Status: ${getStatusLabel()}`, 14, 25);
    doc.text(`Added By: ${getUserLabel()}`, 14, 30);
    
    // Add current date
    const currentDate = new Date().toLocaleString();
    doc.text(`Generated on: ${currentDate}`, 14, 35);

    // Prepare table data
    const tableData = sortedAndFilteredTransactions.map((history, index) => [
      index + 1,
      history?.transactionDate ? new Date(history.transactionDate).toLocaleString() : 'N/A',
      history.initiatedBy,
      history?.transactionType === "you will give" ? "You will get" : "You will give",
      history?.amount?.toFixed(2) || '0.00',
      history?.description || '',
      history?.confirmationStatus === "confirmed" ? "Confirmed" : "Pending"
    ]);

    // Define table headers
    const headers = [
      ['S.No', 'Date', 'Initiated By', 'Type', 'Amount', 'Description', 'Status']
    ];

    // Add table to PDF
    doc.autoTable({
      head: headers,
      body: tableData,
      startY: 40,
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
        fillColor: [71, 85, 105],
        textColor: 255,
        fontSize: 8,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
      margin: { top: 40 },
    });

    // Save PDF
    doc.save('transaction-history.pdf');
  };

  if (!transaction) {
    return <div className="text-center py-10">Loading transaction details...</div>;
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
              <p className="text-sm font-medium text-cyan-600/90 mb-1">User Name</p>
              <p className="text-xl font-bold text-cyan-700 truncate">
                {transaction.userId.name}
              </p>
            </div>
          </div>

          {/* Other User Card */}
          <div className="group relative bg-gradient-to-br from-pink-50 via-rose-50 to-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-100/50 via-rose-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6">
              <p className="text-sm font-medium text-pink-600/90 mb-1">Other User</p>
              <p className="text-xl font-bold text-pink-700 truncate">
                {transaction.clientUserId.name}
              </p>
            </div>
          </div>

          {/* Book Name Card */}
          <div className="group relative bg-gradient-to-br from-indigo-50 via-violet-50 to-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/50 via-violet-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6">
              <p className="text-sm font-medium text-indigo-600/90 mb-1">Book Name</p>
              <p className="text-xl font-bold text-indigo-700 truncate">
                {transaction.bookId.bookname}
              </p>
            </div>
          </div>

          {/* Outstanding Balance Card */}
          <div className={`group relative bg-gradient-to-br ${
            userId === transaction.initiaterId
              ? transaction.outstandingBalance > 0
                ? "from-teal-50 via-emerald-50"
                : "from-orange-50 via-amber-50"
              : transaction.outstandingBalance > 0
              ? "from-orange-50 via-amber-50"
              : "from-teal-50 via-emerald-50"
          } to-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${
              userId === transaction.initiaterId
                ? transaction.outstandingBalance > 0
                  ? "from-teal-100/50 via-emerald-50/30"
                  : "from-orange-100/50 via-amber-50/30"
                : transaction.outstandingBalance > 0
                ? "from-orange-100/50 via-amber-50/30"
                : "from-teal-100/50 via-emerald-50/30"
            } to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            <div className="relative p-6">
              <p className={`text-sm font-medium ${
                userId === transaction.initiaterId
                  ? transaction.outstandingBalance > 0
                    ? "text-teal-600/90"
                    : "text-orange-600/90"
                  : transaction.outstandingBalance > 0
                  ? "text-orange-600/90"
                  : "text-teal-600/90"
              } mb-1`}>Outstanding Balance</p>
              <p className={`text-xl font-bold ${
                userId === transaction.initiaterId
                  ? transaction.outstandingBalance > 0
                    ? "text-teal-700"
                    : "text-orange-700"
                  : transaction.outstandingBalance > 0
                  ? "text-orange-700"
                  : "text-teal-700"
              }`}>
                {Math.abs(transaction.outstandingBalance).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Action Buttons */}
          <div className="flex gap-3 mb-4">
            <Button
              type="primary"
              onClick={() => {
                setShowForm(true);
                setFormData((prev) => ({
                  ...prev,
                  transactionType: "you will give",
                }));
              }}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 border-none h-10"
              icon={<PlusOutlined />}
            >
              <span className="font-semibold">You Will Get</span>
            </Button>
            <Button
              type="primary"
              danger
              onClick={() => {
                setShowForm(true);
                setFormData((prev) => ({
                  ...prev,
                  transactionType: "you will get",
                }));
              }}
              className="flex items-center gap-2 h-10"
              icon={<MinusOutlined />}
            >
              <span className="font-semibold">You Will Give</span>
            </Button>
            <Button
              type="primary"
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 border-none h-10"
              icon={<DownloadOutlined />}
              onClick={handleExportPDF}
            >
              <span className="font-semibold">Export PDF</span>
            </Button>
          </div>

          {showForm && (
            <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

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
                trigger={['click']}
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
                trigger={['click']}
              >
                <Button className="flex items-center h-10">
                  <Space>
                    <FilterOutlined />
                    <span className="font-semibold">Status: {getStatusLabel()}</span>
                  </Space>
                </Button>
              </Dropdown>

              <Dropdown
                menu={{
                  items: userItems,
                  onClick: ({ key }) => handleUserFilterChange(key),
                }}
                trigger={['click']}
              >
                <Button className="flex items-center h-10">
                  <Space>
                    <FilterOutlined />
                    <span className="font-semibold">Added By: {getUserLabel()}</span>
                  </Space>
                </Button>
              </Dropdown>

              <Button 
                onClick={clearAllFilters}
                className="flex items-center h-10"
                disabled={
                  statusFilter === 'all' && 
                  userFilter === 'all' && 
                  sortConfig.type === 'date' && 
                  sortConfig.order === 'desc'
                }
              >
                <span className="font-semibold">Clear Filter</span>
              </Button>

              <Button
                onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                type={viewMode === 'list' ? 'primary' : 'default'}
                className={`flex items-center h-10 ${viewMode === 'list' ? 'bg-blue-500 hover:bg-blue-600 border-none' : ''}`}
              >
                <Space>
                  {viewMode === 'list' ? <AppstoreOutlined /> : <UnorderedListOutlined />}
                  <span className="font-semibold">
                    {viewMode === 'list' ? 'List View' : 'Grid View'}
                  </span>
                </Space>
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <Select
                value={pageSize}
                onChange={handlePageSizeChange}
                className="w-32 h-10"
                options={[
                  { value: 10, label: '10 per page' },
                  { value: 20, label: '20 per page' },
                  { value: 50, label: '50 per page' },
                  { value: 100, label: '100 per page' },
                ]}
              />
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

          {/* Transaction History */}
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <div className="max-w-screen-xl mx-auto">
        
              {viewMode === 'list' ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">S.No</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Date</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Initiated By</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Type</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Amount</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">Description</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Files</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Status</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.length > 0 ? (
                      currentItems.map((history, index) => (
                        <tr key={history._id} className="hover:bg-gray-50">
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                            {history?.transactionDate ? new Date(history.transactionDate).toLocaleString() : 'N/A'}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                            {history.initiatedBy  
                              }
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                            {history?.transactionType === "you will give" ? "You will get" : "You will give"}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {history?.amount?.toFixed(2) || '0.00'}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-900 break-words w-64">
                            {history?.description || ''}
                          </td>
                          <td className="px-3 py-4">
                            {typeof history.file === "string" && history.file.trim() !== "" ? (
                              history.file.toLowerCase().endsWith('.pdf') ? (
                                <div 
                                  className="cursor-pointer hover:opacity-80"
                                  onClick={() => handleFileClick(history.file)}
                                >
                                  <FilePdfOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />
                                </div>
                              ) : (
                                <div className="relative cursor-pointer">
                                  <div onClick={() => handleFileClick(history.file)}>
                                    <FileImageOutlined 
                                      style={{ fontSize: '24px', color: '#1890ff' }} 
                                      className="hover:opacity-80"
                                    />
                                  </div>
                                  <Image
                                    src={`${process.env.REACT_APP_URL}/${history.file.replace(/\\/g, "/")}`}
                                    alt="Transaction File"
                                    className="hidden"
                                    preview={{
                                      visible: modalState.previewImageId === history._id,
                                      onVisibleChange: (visible) => {
                                        setModalState(prev => ({
                                          ...prev,
                                          previewImageId: visible ? history._id : null
                                        }));
                                      },
                                      mask: null,
                                      toolbarRender: (_, { transform: { scale }, actions }) => (
                                        <div className="ant-image-preview-operations">
                                          <div className="ant-image-preview-operations-operation">
                                            <DownloadOutlined onClick={() => handleDownload(history.file)} />
                                          </div>
                                          <div className="ant-image-preview-operations-operation">
                                            <RotateLeftOutlined onClick={actions.onRotateLeft} />
                                          </div>
                                          <div className="ant-image-preview-operations-operation">
                                            <RotateRightOutlined onClick={actions.onRotateRight} />
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
                                      )
                                    }}
                                  />
                                </div>
                              )
                            ) : (
                              <span className="text-sm text-gray-500 whitespace-nowrap">No file</span>
                            )}
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
                                onClick={() => updateTransactionStatus(history._id)}
                                disabled={updatingEntryId === history._id}
                                className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                  updatingEntryId === history._id ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                              >
                                {updatingEntryId === history._id ? "Updating..." : "Confirm"}
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
                                  onClick={() => {
                                    console.log("Delete clicked for history:", history);
                                    handleDelete(history);
                                  }}
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
                        <td colSpan="9" className="px-3 py-10 text-center text-gray-500">
                          No transactions found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : (
                renderGridView(currentItems)
              )}
            </div>
          </div>

          {/* Pagination footer */}
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} entries
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    type={currentPage === i + 1 ? 'primary' : 'default'}
                    className={currentPage === i + 1 ? 'bg-blue-500' : ''}
                  >
                    {i + 1}
                  </Button>
                )).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))}
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
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
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          transactionDetails={deleteTransactionDetails}
        />

        <SuccessModal
          isOpen={modalState.showSuccessModal}
          message={updatingEntryId ? "Transaction status updated successfully!" : "Action Done Successfully"}
          onClose={() => setModalState(prev => ({ ...prev, showSuccessModal: false }))}
        />

        <ErrorModal
          isOpen={modalState.showErrorModal}
          message={errorMessage}
          onClose={() => setModalState(prev => ({ ...prev, showErrorModal: false }))}
        />

        <FileModal
          isOpen={modalState.isModalOpen}
          fileUrl={modalState.modalImage}
          onClose={() => setModalState(prev => ({ 
            ...prev, 
            isModalOpen: false, 
            modalImage: null,
            currentFile: null 
          }))}
          onDownload={() => handleDownload(modalState.currentFile)}
        />
      </div>
    </div>
  );
};

export default CollaborativeBookRecords;