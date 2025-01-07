import React, { forwardRef, useImperativeHandle, useState, useMemo, useEffect, useCallback } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import { AiOutlineFileImage, AiOutlineCheckCircle, AiOutlineClockCircle, AiOutlineFilter } from "react-icons/ai";
import { BsFilePdf, BsFilter, BsGrid, BsListUl } from "react-icons/bs";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const TransactionTable = forwardRef(({
  transaction,
  userId,
  updating,
  updateTransactionStatus,
  openEditForm,
  handleDeleteClick,
  handleImageClick,
  handleAddTransaction,
}, ref) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'transactionDate',
    direction: 'desc'
  });
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'confirmed', 'pending'
  const [addedByFilter, setAddedByFilter] = useState('all'); // 'all', 'user', 'client'
  const [showStatusFilterMenu, setShowStatusFilterMenu] = useState(false);
  const [showAddedByFilterMenu, setShowAddedByFilterMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [showItemsPerPage, setShowItemsPerPage] = useState(false);

  const filteredAndSortedTransactions = useMemo(() => {
    if (!transaction?.transactionHistory) return [];
    
    // First apply status and added by filters
    let filteredData = [...transaction.transactionHistory];
    
    if (statusFilter !== 'all') {
      filteredData = filteredData.filter(item => item.confirmationStatus === statusFilter);
    }
    
    // Apply added by filter
    if (addedByFilter !== 'all') {
      filteredData = filteredData.filter(item => {
        if (addedByFilter === 'user') {
          return item.initiatedBy === transaction?.userId?.name;
        } else {
          return item.initiatedBy === transaction?.clientUserId?.name;
        }
      });
    }
    
    // Then sort the filtered data
    switch(sortConfig.key) {
      case 'transactionDate':
        filteredData.sort((a, b) => {
          const dateA = new Date(a.transactionDate).getTime();
          const dateB = new Date(b.transactionDate).getTime();
          return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        });
        break;
      case 'amount':
        filteredData.sort((a, b) => {
          const amountA = parseFloat(a.amount);
          const amountB = parseFloat(b.amount);
          return sortConfig.direction === 'asc' ? amountA - amountB : amountB - amountA;
        });
        break;
      default:
        break;
    }
    
    return filteredData;
  }, [transaction?.transactionHistory, sortConfig, statusFilter, addedByFilter]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedTransactions, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedTransactions.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
    setShowSortMenu(false);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setShowStatusFilterMenu(false);
  };

  const handleAddedByFilter = (addedBy) => {
    setAddedByFilter(addedBy);
    setShowAddedByFilterMenu(false);
  };

  const clearAllFilters = () => {
    setStatusFilter('all');
    setAddedByFilter('all');
    setShowStatusFilterMenu(false);
    setShowAddedByFilterMenu(false);
    setCurrentPage(1); // Reset to first page
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const formatAmount = (amount) => {
    return Number(amount).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    });
  };

  const formatAmountWithoutPrefix = (amount) => {
    const num = Number(amount);
    if (isNaN(num)) return "0.00";
    return Math.abs(num).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    });
  };

  const getHoverClass = (transactionType) => {
    return transactionType === "you will get" ? "hover:bg-green-50" : "hover:bg-red-50";
  };

  const exportToPDF = () => {
    try {
      if (!transaction?.transactionHistory) {
        console.error("No transaction data available");
        return;
      }

      const doc = new jsPDF({
        format: 'a4',
        unit: 'mm'
      });
      
      // Add footer function
      const addFooter = () => {
        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;
        const footerY = pageHeight - 25;

        // Footer divider line
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.line(14, footerY, pageWidth - 14, footerY);

        // Footer content
        doc.setFontSize(12);
        doc.setTextColor(37, 99, 235);
        doc.text("HisaabKaro", 14, footerY + 8);

        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text("Your Digital Expense Management Partner", 14, footerY + 14);

        doc.setTextColor(37, 99, 235);
        doc.text(
          "www.hisaabkaro.com",
          pageWidth / 2,
          footerY + 14,
          { align: "center" }
        );

        doc.setFontSize(7);
        doc.setTextColor(120, 120, 120);
        const currentDate = new Date().toLocaleDateString("en-US");
        const year = new Date().getFullYear();
        doc.text(`Generated: ${currentDate}`, 14, footerY + 20);
        doc.text(
          ` ${year} HisaabKaro. All rights reserved`,
          pageWidth - 14,
          footerY + 20,
          { align: "right" }
        );
      };
      
      // Add title
      doc.setFontSize(24);
      doc.text("Transaction History", 14, 20);

      // Calculate available width for cards
      const pageWidth = doc.internal.pageSize.width;
      const marginX = 14;
      const availableWidth = pageWidth - (2 * marginX);
      
      // Draw cards
      const cardWidth = 42;
      const cardHeight = 30;
      const startX = marginX;
      const startY = 30;
      const gap = 6;

      // Your Name card (Green)
      doc.setFillColor(34, 197, 94);
      doc.roundedRect(startX, startY, cardWidth, cardHeight, 3, 3, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.text("Your Name", startX + 5, startY + 10);
      doc.setFontSize(10);
      const userName = transaction?.userId?.name || localStorage.getItem("user") || "";
      const userNameLines = doc.splitTextToSize(userName, cardWidth - 10);
      doc.text(userNameLines, startX + 5, startY + 20);

      // Client Name card (Orange)
      doc.setFillColor(249, 115, 22);
      doc.roundedRect(startX + cardWidth + gap, startY, cardWidth, cardHeight, 3, 3, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.text("Client Name", startX + cardWidth + gap + 5, startY + 10);
      doc.setFontSize(10);
      const clientName = transaction?.clientUserId?.name || "";
      const clientNameLines = doc.splitTextToSize(clientName, cardWidth - 10);
      doc.text(clientNameLines, startX + cardWidth + gap + 5, startY + 20);

      // Book Name card (Purple)
      doc.setFillColor(147, 51, 234);
      doc.roundedRect(startX + (cardWidth + gap) * 2, startY, cardWidth, cardHeight, 3, 3, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.text("Book Name", startX + (cardWidth + gap) * 2 + 5, startY + 10);
      doc.setFontSize(10);
      const bookName = transaction?.bookName || "";
      const bookNameLines = doc.splitTextToSize(bookName, cardWidth - 10);
      doc.text(bookNameLines, startX + (cardWidth + gap) * 2 + 5, startY + 20);

      // Outstanding Balance card (Blue)
      doc.setFillColor(59, 130, 246);
      doc.roundedRect(startX + (cardWidth + gap) * 3, startY, cardWidth, cardHeight, 3, 3, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.text("Outstanding", startX + (cardWidth + gap) * 3 + 5, startY + 10);
      doc.setFontSize(10);
      const balanceText = transaction.outstandingBalance >= 0 
        ? formatAmountWithoutPrefix(transaction.outstandingBalance)
        : `-${formatAmountWithoutPrefix(transaction.outstandingBalance)}`;
      doc.text(balanceText, startX + (cardWidth + gap) * 3 + 5, startY + 20);

      // Reset text color for table
      doc.setTextColor(0, 0, 0);
      
      // Prepare table data
      const tableData = transaction.transactionHistory.map((entry, index) => [
        (index + 1).toString(),
        formatDate(entry.transactionDate),
        entry.initiatedBy,
        entry.transactionType,
        formatAmountWithoutPrefix(entry.amount),
        entry.description || "",
        entry.confirmationStatus,
      ]);

      // Add table with larger font
      autoTable(doc, {
        head: [["#", "Date", "Initiated By", "Type", "Amount", "Description", "Status"]],
        body: tableData,
        startY: startY + cardHeight + 15,
        styles: { fontSize: 9 },
        headStyles: { 
          fillColor: [41, 128, 185],
          fontSize: 10,
          fontStyle: 'bold'
        },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: marginX },
        columnStyles: {
          0: { cellWidth: 15 }, // Index
          1: { cellWidth: 30 }, // Date
          2: { cellWidth: 35 }, // Initiated By
          3: { cellWidth: 25 }, // Type
          4: { cellWidth: 25 }, // Amount
          5: { cellWidth: 35 }, // Description
          6: { cellWidth: 25 }  // Status
        },
        didDrawPage: function(data) {
          addFooter();
        }
      });

      // Add footer to the first page
      addFooter();

      // Save the PDF
      doc.save("transaction-history.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const renderGridView = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {paginatedTransactions.map((entry, index) => (
          <div
            key={entry._id}
            className={`bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-200 relative overflow-hidden ${
              entry.confirmationStatus === 'pending'
                ? 'border border-yellow-200'
                : entry.transactionType === 'you will get'
                  ? 'border border-green-200'
                  : 'border border-red-200'
            }`}
          >
            {/* Status Notch */}
            <div
              className={`absolute -top-4 -right-4 w-16 h-16 rounded-full transform rotate-45 ${
                entry.confirmationStatus === 'pending'
                  ? 'bg-yellow-200'
                  : entry.transactionType === 'you will get'
                    ? 'bg-green-200'
                    : 'bg-red-200'
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
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {entry.transactionType}
                </span>
                <p className="text-sm text-gray-500 mt-1">{entry.description || 'No description'}</p>
              </div>
            </div>

            {/* Amount */}
            <div className="mb-4">
              <span className={`text-3xl font-bold ${
                entry.transactionType === 'you will get' ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatAmountWithoutPrefix(entry.amount)}
              </span>
              <p className="text-sm text-gray-500 mt-1">{formatDate(entry.transactionDate)}</p>
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
                    onClick={() => handleImageClick(entry.file)}
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
                      onClick={() => handleDeleteClick(entry)}
                      className="p-2 rounded-full hover:bg-gray-50 transition-colors text-red-500"
                      title="Delete"
                    >
                      <MdDelete className="w-5 h-5" />
                    </button>
                  </>
                ) : entry.confirmationStatus === 'pending' ? (
                  <button
                    onClick={() => updateTransactionStatus(entry._id)}
                    disabled={updating}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 text-sm"
                  >
                    {updating ? 'Updating...' : 'Confirm'}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    // Reset to first page when filter, sort, or items per page changes
    setCurrentPage(1);
  }, [statusFilter, addedByFilter, sortConfig, itemsPerPage]);

  const handleClickOutside = useCallback((event) => {
    if (showItemsPerPage && !event.target.closest('.items-per-page-dropdown')) {
      setShowItemsPerPage(false);
    }
    if (showStatusFilterMenu && !event.target.closest('.status-filter-dropdown')) {
      setShowStatusFilterMenu(false);
    }
    if (showAddedByFilterMenu && !event.target.closest('.added-by-filter-dropdown')) {
      setShowAddedByFilterMenu(false);
    }
  }, [showItemsPerPage, showStatusFilterMenu, showAddedByFilterMenu]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside]);

  useImperativeHandle(ref, () => ({
    exportToPDF
  }));

  if (!transaction?.transactionHistory) {
    return null;
  }

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          {/* Sort Button */}
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <BsFilter className="w-5 h-5 mr-2 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Sort By</span>
            </button>
            
            {showSortMenu && (
              <div className="absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <button
                    onClick={() => handleSort('transactionDate')}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      sortConfig.key === 'transactionDate' ? 'bg-gray-50' : ''
                    }`}
                  >
                    Date ({sortConfig.key === 'transactionDate' ? (sortConfig.direction === 'asc' ? 'Oldest First' : 'Newest First') : 'Newest First'})
                  </button>
                  <button
                    onClick={() => handleSort('amount')}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      sortConfig.key === 'amount' ? 'bg-gray-50' : ''
                    }`}
                  >
                    Amount ({sortConfig.key === 'amount' ? (sortConfig.direction === 'asc' ? 'Low to High' : 'High to Low') : 'High to Low'})
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Status Filter Button */}
          <div className="relative status-filter-dropdown">
            <button
              type="button"
              onClick={() => {
                setShowStatusFilterMenu(!showStatusFilterMenu);
                setShowAddedByFilterMenu(false);
              }}
              className="inline-flex items-center justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <AiOutlineFilter className="-ml-0.5 h-5 w-5" aria-hidden="true" />
              Status: {statusFilter === 'all' ? 'All' : statusFilter === 'confirmed' ? 'Confirmed' : 'Pending'}
            </button>
            {showStatusFilterMenu && (
              <div className="absolute left-0 z-10 mt-2 w-48 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <button
                    onClick={() => handleStatusFilter('all')}
                    className={`w-full text-left px-4 py-2 text-sm ${statusFilter === 'all' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => handleStatusFilter('confirmed')}
                    className={`w-full text-left px-4 py-2 text-sm ${statusFilter === 'confirmed' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                  >
                    Confirmed
                  </button>
                  <button
                    onClick={() => handleStatusFilter('pending')}
                    className={`w-full text-left px-4 py-2 text-sm ${statusFilter === 'pending' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                  >
                    Pending
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Added By Filter Button */}
          <div className="relative added-by-filter-dropdown">
            <button
              type="button"
              onClick={() => {
                setShowAddedByFilterMenu(!showAddedByFilterMenu);
                setShowStatusFilterMenu(false);
              }}
              className="inline-flex items-center justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <AiOutlineFilter className="-ml-0.5 h-5 w-5" aria-hidden="true" />
              Added By: {addedByFilter === 'all' ? 'Both' : addedByFilter === 'user' ? transaction?.userId?.name || 'You' : transaction?.clientUserId?.name || 'Client'}
            </button>
            {showAddedByFilterMenu && (
              <div className="absolute left-0 z-10 mt-2 w-48 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <button
                    onClick={() => handleAddedByFilter('all')}
                    className={`w-full text-left px-4 py-2 text-sm ${addedByFilter === 'all' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                  >
                    Both
                  </button>
                  <button
                    onClick={() => handleAddedByFilter('user')}
                    className={`w-full text-left px-4 py-2 text-sm ${addedByFilter === 'user' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                  >
                    Added by {transaction?.userId?.name || 'You'}
                  </button>
                  <button
                    onClick={() => handleAddedByFilter('client')}
                    className={`w-full text-left px-4 py-2 text-sm ${addedByFilter === 'client' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                  >
                    Added by {transaction?.clientUserId?.name || 'Client'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Clear Filter Button */}
          <button
            onClick={clearAllFilters}
            className="inline-flex items-center justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Clear Filter
          </button>

          {/* View Toggle Button */}
          <button
            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {viewMode === 'list' ? (
              <>
                <BsGrid className="w-5 h-5 mr-2 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Grid View</span>
              </>
            ) : (
              <>
                <BsListUl className="w-5 h-5 mr-2 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">List View</span>
              </>
            )}
          </button>
        </div>

        {/* Items per page and pagination controls */}
        <div className="flex items-center gap-4">
          <div className="relative items-per-page-dropdown">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={(e) => {
                e.stopPropagation();
                setShowItemsPerPage(!showItemsPerPage);
              }}
            >
              {itemsPerPage} per page
              <svg className="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>

            {showItemsPerPage && (
              <div className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  {[10, 25, 50, 100].map((number) => (
                    <button
                      key={number}
                      onClick={() => {
                        handleItemsPerPageChange(number);
                        setShowItemsPerPage(false);
                      }}
                      className={`block w-full px-4 py-2 text-left text-sm ${
                        itemsPerPage === number ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } hover:bg-gray-50`}
                    >
                      {number} per page
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <HiChevronLeft className="h-5 w-5" />
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                  currentPage === index + 1
                    ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                    : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <HiChevronRight className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>

      <div className="mt-2 text-sm text-gray-700">
        {filteredAndSortedTransactions.length > 0 ? (
          <>
            Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, filteredAndSortedTransactions.length)}
            </span>{' '}
            of <span className="font-medium">{filteredAndSortedTransactions.length}</span> results
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-500 text-lg mb-2">No transactions found</div>
            <div className="text-gray-400">
              {addedByFilter !== 'all' 
                ? `No transactions ${addedByFilter === 'user' 
                    ? `added by ${transaction?.userId?.name || 'you'}` 
                    : `added by ${transaction?.clientUserId?.name || 'client'}`}`
                : 'No transactions match the current filters'}
            </div>
          </div>
        )}
      </div>

      {filteredAndSortedTransactions.length > 0 ? (
        viewMode === 'list' ? (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Initiated By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Files
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedTransactions.map((entry, index) => (
                  <tr
                    key={entry._id}
                    className={`transition-all duration-200 ${getHoverClass(entry?.transactionType)}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {((currentPage - 1) * itemsPerPage) + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(entry.transactionDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry?.initiatedBy || "N/A"}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-semibold capitalize ${
                        entry?.transactionType === "you will give" ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {entry?.transactionType || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                      <span
                        className={`${
                          entry?.transactionType === "you will give" ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {formatAmountWithoutPrefix(entry?.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry?.description || "No description"}
                    </td>
                    <td className="px-6 py-4">
                      {entry?.confirmationStatus === "confirmed" ? (
                        <span className="flex items-center gap-2 text-green-600 font-medium">
                          <AiOutlineCheckCircle className="text-lg" />
                          Confirmed
                        </span>
                      ) : userId === entry?.initiaterId ? (
                        <span className="flex items-center gap-2 text-yellow-600 font-medium">
                          <AiOutlineClockCircle className="text-lg" />
                          Pending
                        </span>
                      ) : (
                        <button
                          onClick={() => updateTransactionStatus(entry._id)}
                          disabled={updating}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                          {updating ? "Updating..." : "Confirm"}
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {entry?.file ? (
                        <div className="group relative cursor-pointer">
                          {entry.file.toLowerCase().endsWith('.pdf') ? (
                            <BsFilePdf
                              onClick={() => handleImageClick(`${process.env.REACT_APP_URL}/${entry.file}`)}
                              className="text-2xl text-red-500 group-hover:text-red-700 transition"
                            />
                          ) : (
                            <AiOutlineFileImage
                              onClick={() => handleImageClick(`${process.env.REACT_APP_URL}/${entry.file}`)}
                              className="text-2xl text-blue-500 group-hover:text-blue-700 transition"
                            />
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500">No file</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {userId === entry?.initiaterId ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditForm(entry)}
                            className="text-yellow-500 hover:text-yellow-600"
                            title="Edit"
                          >
                            <MdEdit className="text-xl" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(entry)}
                            className="text-red-500 hover:text-red-600"
                            title="Delete"
                          >
                            <MdDelete className="text-xl" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">Not yours</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          renderGridView()
        )
      ) : null}
    </div>
  );
});

export default TransactionTable;
