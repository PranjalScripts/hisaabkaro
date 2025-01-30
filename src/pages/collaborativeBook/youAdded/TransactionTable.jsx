import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { useParams } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import {
  AiOutlineFileImage,
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineFilter,
} from "react-icons/ai";
import { BsFilePdf, BsFilter, BsGrid, BsListUl } from "react-icons/bs";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { BiGitBranch } from "react-icons/bi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import SplitTransaction from "./splitTransaction";

const TransactionTable = forwardRef(
  (
    {
      transaction,
      userId,
      updating,
      updateTransactionStatus,
      openEditForm,
      handleDeleteClick,
      handleImageClick,
      handleAddTransaction,
      onSplitSuccess,
    },
    ref
  ) => {
    const { transactionId } = useParams(); // Get transactionId from URL params
    const [sortConfig, setSortConfig] = useState({
      key: "transactionDate",
      direction: "desc",
    });
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'confirmed', 'pending'
    const [addedByFilter, setAddedByFilter] = useState("all"); // 'all', 'user', 'client'
    const [showStatusFilterMenu, setShowStatusFilterMenu] = useState(false);
    const [showAddedByFilterMenu, setShowAddedByFilterMenu] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [viewMode, setViewMode] = useState("list"); // 'list' or 'grid'
    const [showItemsPerPage, setShowItemsPerPage] = useState(false);
    const [isFilterApplied, setIsFilterApplied] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [showSplitModal, setShowSplitModal] = useState(false);
    const [showDescriptionModal, setShowDescriptionModal] = useState(false);
    const [selectedDescription, setSelectedDescription] = useState(null);

    const filteredAndSortedTransactions = useMemo(() => {
      if (!transaction?.transactionHistory) return [];

      // First apply status and added by filters
      let filteredData = [...transaction.transactionHistory];

      if (statusFilter !== "all") {
        filteredData = filteredData.filter(
          (item) => item.confirmationStatus === statusFilter
        );
      }

      // Apply added by filter
      if (addedByFilter !== "all") {
        filteredData = filteredData.filter((item) => {
          if (addedByFilter === "user") {
            return item.initiatedBy === transaction?.userId?.name;
          } else {
            return item.initiatedBy === transaction?.clientUserId?.name;
          }
        });
      }

      // Then sort the filtered data
      switch (sortConfig.key) {
        case "transactionDate":
          filteredData.sort((a, b) => {
            const dateA = new Date(a.transactionDate).getTime();
            const dateB = new Date(b.transactionDate).getTime();
            return sortConfig.direction === "asc"
              ? dateA - dateB
              : dateB - dateA;
          });
          break;
        case "amount":
          filteredData.sort((a, b) => {
            const amountA = parseFloat(a.amount);
            const amountB = parseFloat(b.amount);
            return sortConfig.direction === "asc"
              ? amountA - amountB
              : amountB - amountA;
          });
          break;
        default:
          break;
      }

      return filteredData;
    }, [
      transaction?.transactionHistory,
      sortConfig,
      statusFilter,
      addedByFilter,
    ]);

    const paginatedTransactions = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      return filteredAndSortedTransactions.slice(
        startIndex,
        startIndex + itemsPerPage
      );
    }, [filteredAndSortedTransactions, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(
      filteredAndSortedTransactions.length / itemsPerPage
    );

    const handlePageChange = (page) => {
      setCurrentPage(page);
    };

    const handleSort = (key) => {
      setSortConfig((prev) => ({
        key,
        direction:
          prev.key === key && prev.direction === "asc" ? "desc" : "asc",
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

    useEffect(() => {
      // Check if any filter is applied
      const isAnyFilterApplied = 
        statusFilter !== "all" || 
        addedByFilter !== "all" || 
        sortConfig.key !== "transactionDate" || 
        sortConfig.direction !== "desc";
      
      setIsFilterApplied(isAnyFilterApplied);
    }, [statusFilter, addedByFilter, sortConfig]);

    const clearAllFilters = () => {
      setSortConfig({ key: "transactionDate", direction: "desc" });
      setStatusFilter("all");
      setAddedByFilter("all");
      setShowStatusFilterMenu(false);
      setShowAddedByFilterMenu(false);
      setShowSortMenu(false);
      setCurrentPage(1);
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
        minimumFractionDigits: 2,
      });
    };

    const formatAmountWithoutPrefix = (amount) => {
      const num = Number(amount);
      if (isNaN(num)) return "0.00";
      return Math.abs(num).toLocaleString("en-IN", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      });
    };

    const getHoverClass = (transactionType) => {
      return transactionType === "you will get"
        ? "hover:bg-green-50"
        : "hover:bg-red-50";
    };

    const exportToPDF = () => {
      try {
        if (!transaction?.transactionHistory) {
          console.error("No transaction data available");
          return;
        }

        const doc = new jsPDF({
          format: "a4",
          unit: "mm",
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
          doc.text("www.hisaabkaro.com", pageWidth / 2, footerY + 14, {
            align: "center",
          });

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
        const availableWidth = pageWidth - 2 * marginX;

        // Draw cards
        const cardWidth = 42;
        const cardHeight = 30;
        const startX = marginX;
        const startY = 30;
        const gap = 6;

        // Your Name card (Green)
        doc.setFillColor(34, 197, 94);
        doc.roundedRect(startX, startY, cardWidth, cardHeight, 3, 3, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.text("Your Name", startX + 5, startY + 10);
        doc.setFontSize(10);
        const userName =
          transaction?.userId?.name || localStorage.getItem("user") || "";
        const userNameLines = doc.splitTextToSize(userName, cardWidth - 10);
        doc.text(userNameLines, startX + 5, startY + 20);

        // Client Name card (Orange)
        doc.setFillColor(249, 115, 22);
        doc.roundedRect(
          startX + cardWidth + gap,
          startY,
          cardWidth,
          cardHeight,
          3,
          3,
          "F"
        );
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.text("Client Name", startX + cardWidth + gap + 5, startY + 10);
        doc.setFontSize(10);
        const clientName = transaction?.clientUserId?.name || "";
        const clientNameLines = doc.splitTextToSize(clientName, cardWidth - 10);
        doc.text(clientNameLines, startX + cardWidth + gap + 5, startY + 20);

        // Book Name card (Purple)
        doc.setFillColor(147, 51, 234);
        doc.roundedRect(
          startX + (cardWidth + gap) * 2,
          startY,
          cardWidth,
          cardHeight,
          3,
          3,
          "F"
        );
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.text("Book Name", startX + (cardWidth + gap) * 2 + 5, startY + 10);
        doc.setFontSize(10);
        const bookName = transaction?.bookId?.bookname || "";
        const bookNameLines = doc.splitTextToSize(bookName, cardWidth - 10);
        doc.text(
          bookNameLines,
          startX + (cardWidth + gap) * 2 + 5,
          startY + 20
        );

        // Outstanding Balance card (Blue)
        doc.setFillColor(59, 130, 246);
        doc.roundedRect(
          startX + (cardWidth + gap) * 3,
          startY,
          cardWidth,
          cardHeight,
          3,
          3,
          "F"
        );
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.text(
          "Outstanding",
          startX + (cardWidth + gap) * 3 + 5,
          startY + 10
        );
        doc.setFontSize(10);
        const balanceText =
          transaction.outstandingBalance >= 0
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
          head: [
            [
              "#",
              "Date",
              "Initiated By",
              "Type",
              "Amount",
              "Description",
              "Status",
            ],
          ],
          body: tableData,
          startY: startY + cardHeight + 15,
          styles: { fontSize: 9 },
          headStyles: {
            fillColor: [41, 128, 185],
            fontSize: 10,
            fontStyle: "bold",
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
            6: { cellWidth: 25 }, // Status
          },
          didDrawPage: function (data) {
            addFooter();
          },
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

    const truncateText = (text, maxLength = 100) => {
      if (!text) return '';
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    };

    const renderGridView = () => {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {paginatedTransactions.map((entry, index) => (
            <div
              key={entry._id}
              className={`bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-200 relative overflow-hidden ${
                entry.confirmationStatus === "pending"
                  ? "border border-yellow-200"
                  : entry.transactionType === "you will get"
                  ? "border border-green-200"
                  : "border border-red-200"
              }`}
            >
              {/* Status Notch */}
              <div
                className={`absolute -top-4 -right-4 w-16 h-16 rounded-full transform rotate-45 ${
                entry.confirmationStatus === "pending"
                  ? "bg-yellow-200"
                  : entry.transactionType === "you will get"
                  ? "bg-green-200"
                  : "bg-red-200"
              }`}
              />

              {/* User Info */}
              <div className="flex items-start space-x-3 mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-medium text-gray-600">
                    {entry.initiatedBy.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {entry.initiatedBy}
                  </h3>
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 rounded-full text-sm font-medium ${
                      entry.transactionType === "you will get"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {entry.transactionType}
                  </span>
                  <div className="mt-2">
                    <div className="relative">
                      <p className="text-sm text-gray-500 whitespace-pre-wrap break-words overflow-hidden max-h-24">
                        {entry.description || "No description"}
                      </p>
                      {entry.description && entry.description.length > 150 && (
                        <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-white to-transparent flex items-end justify-end">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDescription(entry.description);
                              setShowDescriptionModal(true);
                            }}
                            className="mb-1 mr-2 px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 bg-white rounded-full shadow-sm border border-blue-200 hover:border-blue-300 transition-all duration-200 flex items-center gap-1"
                          >
                            Read more
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="mb-4">
                <span
                  className={`text-3xl font-bold ${
                    entry.transactionType === "you will get"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {formatAmountWithoutPrefix(entry.amount)}
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(entry.transactionDate)}
                </p>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center">
                  {entry.confirmationStatus === "confirmed" ? (
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
                        typeof entry.file === 'string' && entry.file.toLowerCase().endsWith(".pdf")
                          ? "text-red-500"
                          : "text-blue-500"
                      }`}
                      title={
                        typeof entry.file === 'string' && entry.file.toLowerCase().endsWith(".pdf")
                          ? "View PDF"
                          : "View Image"
                      }
                    >
                      {typeof entry.file === 'string' && entry.file.toLowerCase().endsWith(".pdf") ? (
                        <BsFilePdf className="w-5 h-5" />
                      ) : (
                        <AiOutlineFileImage className="w-5 h-5" />
                      )}
                    </button>
                  )}

                  {userId === entry.initiaterId ? (
                    <>
                      <button
                        onClick={() => handleEditClick(entry)}
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
                      <button
                        onClick={() => handleSplitClick(entry)}
                        className="p-2 rounded-full hover:bg-gray-50 transition-colors text-blue-500"
                        title="Split Transaction"
                      >
                        <BiGitBranch className="w-5 h-5" />
                      </button>
                    </>
                  ) : entry.confirmationStatus === "pending" ? (
                    <button
                      onClick={() => updateTransactionStatus(entry._id)}
                      disabled={updating}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 text-sm"
                    >
                      {updating ? "Updating..." : "Confirm"}
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

    const handleClickOutside = useCallback(
      (event) => {
        if (
          showItemsPerPage &&
          !event.target.closest(".items-per-page-dropdown")
        ) {
          setShowItemsPerPage(false);
        }
        if (
          showStatusFilterMenu &&
          !event.target.closest(".status-filter-dropdown")
        ) {
          setShowStatusFilterMenu(false);
        }
        if (
          showAddedByFilterMenu &&
          !event.target.closest(".added-by-filter-dropdown")
        ) {
          setShowAddedByFilterMenu(false);
        }
      },
      [showItemsPerPage, showStatusFilterMenu, showAddedByFilterMenu]
    );

    useEffect(() => {
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }, [handleClickOutside]);

    useImperativeHandle(ref, () => ({
      exportToPDF,
    }));

    if (!transaction?.transactionHistory) {
      return null;
    }

    const handleSortChange = (value) => {
      switch (value) {
        case "oldest":
          setSortConfig({ key: "transactionDate", direction: "asc" });
          break;
        case "newest":
          setSortConfig({ key: "transactionDate", direction: "desc" });
          break;
        case "amount_high":
          setSortConfig({ key: "amount", direction: "desc" });
          break;
        case "amount_low":
          setSortConfig({ key: "amount", direction: "asc" });
          break;
        default:
          setSortConfig({ key: "transactionDate", direction: "desc" });
      }
      setShowSortMenu(false);
    };

    const handleSplitClick = (entry) => {
      // Ensure we have all the necessary data before opening split modal
      const enrichedEntry = {
        ...entry,
        _id: entry._id,
        transactionId: transaction._id,
        amount: parseFloat(entry.amount),
        description: entry.description || '',
        transactionType: entry.transactionType,
        bookId: transaction.bookId?._id || transaction.bookId // Handle both populated and unpopulated bookId
      };
      setSelectedEntry(enrichedEntry);
      setShowSplitModal(true);
    };

    const handleSplitClose = () => {
      setSelectedEntry(null);
      setShowSplitModal(false);
    };

    const handleSplitSuccess = (updatedData) => {
      // Close the split modal
      handleSplitClose();
      
      // Call the parent's success handler if available
      if (onSplitSuccess) {
        onSplitSuccess(updatedData);
      }
    };

    const handleEditClick = (entry) => {
      if (openEditForm) {
        openEditForm(entry);
      }
    };

    const renderTableView = () => {
      return (
        <>
          {/* Desktop View - Original Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <colgroup>
                <col className="w-[5%]" /> {/* # */}
                <col className="w-[12%]" /> {/* Date */}
                <col className="w-[12%]" /> {/* Initiated By */}
                <col className="w-[10%]" /> {/* Type */}
                <col className="w-[10%]" /> {/* Amount */}
                <col className="w-[25%]" /> {/* Description */}
                <col className="w-[10%]" /> {/* Status */}
                <col className="w-[8%]" /> {/* Files */}
                <col className="w-[8%]" /> {/* Action */}
              </colgroup>
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider overflow-hidden">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider overflow-hidden">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider overflow-hidden">
                    Initiated By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider overflow-hidden">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider overflow-hidden">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider overflow-hidden">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider overflow-hidden">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider overflow-hidden">
                    Files
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider overflow-hidden">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedTransactions.map((entry, index) => (
                  <tr
                    key={entry._id}
                    className={`transition-all duration-200 ${getHoverClass(
                      entry?.transactionType
                    )}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 overflow-hidden">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 overflow-hidden">
                      {formatDate(entry.transactionDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 overflow-hidden">
                      <div className="truncate">
                        {entry.initiaterId === userId 
                          ? transaction?.userId?.name || "You"
                          : transaction?.clientUserId?.name || "Client"
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm overflow-hidden">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          entry?.transactionType === "you will give"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {entry?.transactionType || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold overflow-hidden">
                      <span
                        className={`${
                          entry?.transactionType === "you will give"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {formatAmountWithoutPrefix(entry?.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 relative overflow-hidden">
                      <div className="w-full">
                        <div className="relative">
                          <p className="text-sm text-gray-500 whitespace-pre-wrap break-words overflow-hidden max-h-20">
                            {entry?.description || "No description"}
                          </p>
                          {entry?.description && entry.description.length > 100 && (
                            <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-white to-transparent flex items-end justify-end">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDescription(entry.description);
                                  setShowDescriptionModal(true);
                                }}
                                className="mb-1 mr-2 px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 bg-white rounded-full shadow-sm border border-blue-200 hover:border-blue-300 transition-all duration-200 flex items-center gap-1"
                              >
                                Read more
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 overflow-hidden">
                      {entry?.confirmationStatus === "confirmed" ? (
                        <span className="flex items-center gap-2 text-green-600 font-medium">
                          <AiOutlineCheckCircle className="text-lg" />
                          <span className="text-sm">Confirmed</span>
                        </span>
                      ) : userId === entry?.initiaterId ? (
                        <span className="flex items-center gap-2 text-yellow-600 font-medium">
                          <AiOutlineClockCircle className="text-lg" />
                          <span className="text-sm">Pending</span>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 overflow-hidden">
                      {entry?.file ? (
                        <div className="group relative cursor-pointer">
                          {typeof entry.file === 'string' && entry.file.toLowerCase().endsWith(".pdf") ? (
                            <BsFilePdf
                              onClick={() => handleImageClick(entry.file)}
                              className="text-2xl text-red-500 group-hover:text-red-700 transition"
                            />
                          ) : (
                            <AiOutlineFileImage
                              onClick={() => handleImageClick(entry.file)}
                              className="text-2xl text-blue-500 group-hover:text-blue-700 transition"
                            />
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500">No file</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 overflow-hidden">
                      {userId === entry?.initiaterId ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(entry)}
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
                          <button
                            onClick={() => handleSplitClick(entry)}
                            className="text-blue-500 hover:text-blue-600"
                            title="Split Transaction"
                          >
                            <BiGitBranch className="text-xl" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">
                          Added by {transaction?.clientUserId?.name || "Client"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile List View */}
          <div className="sm:hidden space-y-2">
            {paginatedTransactions.map((entry, index) => (
              <div 
                key={entry._id}
                className={`bg-white rounded-lg shadow-sm p-3 ${
                  entry?.transactionType === "you will give" 
                    ? "border-l-4 border-red-500" 
                    : "border-l-4 border-green-500"
                }`}
              >
                {/* Top Row - Amount and Status */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-base font-semibold ${
                      entry?.transactionType === "you will give" 
                        ? "text-red-600" 
                        : "text-green-600"
                    }`}>
                      ₹{formatAmountWithoutPrefix(entry?.amount)}
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      entry?.confirmationStatus === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {entry?.confirmationStatus}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(entry.transactionDate)}
                  </span>
                </div>

                {/* Description with Read More */}
                <div className="text-sm text-gray-600 line-clamp-1 mb-1">
                  {entry?.description || "No description"}
                  {entry?.description && entry.description.length > 100 && (
                    <button
                      onClick={() => {
                        setSelectedDescription(entry.description);
                        setShowDescriptionModal(true);
                      }}
                      className="ml-1 text-blue-600 text-xs"
                    >
                      more
                    </button>
                  )}
                </div>

                {/* Bottom Row - Meta Info and Actions */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    By: {entry.initiaterId === userId 
                      ? transaction?.userId?.name || "You"
                      : transaction?.clientUserId?.name || "Client"
                    }
                  </span>
                  <div className="flex items-center gap-3">
                    {/* File icon */}
                    {entry?.file && (
                      <button
                        onClick={() => handleImageClick(entry.file)}
                        className="text-blue-500"
                      >
                        {entry.file.toLowerCase().endsWith(".pdf") ? (
                          <BsFilePdf className="text-lg" />
                        ) : (
                          <AiOutlineFileImage className="text-lg" />
                        )}
                      </button>
                    )}
                    {/* Action buttons */}
                    {userId === entry?.initiaterId && (
                      <>
                        <button
                          onClick={() => handleEditClick(entry)}
                          className="text-yellow-500"
                        >
                          <MdEdit className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(entry)}
                          className="text-red-500"
                        >
                          <MdDelete className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleSplitClick(entry)}
                          className="text-blue-500"
                        >
                          <BiGitBranch className="text-lg" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      );
    };

    return (
      <div className="mt-4">
        {/* Filter Controls Section */}
        <div className="mb-4">
          {/* Desktop View */}
          <div className="hidden sm:flex justify-between items-center">
            <div className="flex items-center gap-4">
              {/* Sort Button */}
              <div className="relative">
                <button
                  onClick={() => setShowSortMenu((prev) => !prev)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <BsFilter className="mr-2 h-4 w-4" />
                  Sort
                </button>
                {showSortMenu && (
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <button
                        onClick={() => handleSortChange("newest")}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Newest First
                      </button>
                      <button
                        onClick={() => handleSortChange("oldest")}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Oldest First
                      </button>
                      <button
                        onClick={() => handleSortChange("amount_high")}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        High to Low
                      </button>
                      <button
                        onClick={() => handleSortChange("amount_low")}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Low to High
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Filter */}
              <div className="relative status-filter-dropdown">
                <button
                  type="button"
                  onClick={() => {
                    setShowStatusFilterMenu(!showStatusFilterMenu);
                    setShowAddedByFilterMenu(false);
                    setShowSortMenu(false);
                  }}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <AiOutlineFilter className="mr-2 h-4 w-4" />
                  {statusFilter === "all" ? "Status: All" : `Status: ${statusFilter}`}
                </button>
                {showStatusFilterMenu && (
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <button
                        onClick={() => handleStatusFilter("all")}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          statusFilter === "all" ? "bg-gray-100" : "hover:bg-gray-50"
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => handleStatusFilter("confirmed")}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          statusFilter === "confirmed"
                            ? "bg-gray-100"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        Confirmed
                      </button>
                      <button
                        onClick={() => handleStatusFilter("pending")}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          statusFilter === "pending"
                            ? "bg-gray-100"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        Pending
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Added By Filter */}
              <div className="relative added-by-filter-dropdown">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddedByFilterMenu(!showAddedByFilterMenu);
                    setShowStatusFilterMenu(false);
                    setShowSortMenu(false);
                  }}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <AiOutlineFilter className="mr-2 h-4 w-4" />
                  {addedByFilter === "all" ? "Added By: All" : `Added By: ${addedByFilter}`}
                </button>
                {showAddedByFilterMenu && (
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <button
                        onClick={() => handleAddedByFilter("all")}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          addedByFilter === "all"
                            ? "bg-gray-100"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        Both
                      </button>
                      <button
                        onClick={() => handleAddedByFilter("user")}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          addedByFilter === "user"
                            ? "bg-gray-100"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        Added by {transaction?.userId?.name || "You"}
                      </button>
                      <button
                        onClick={() => handleAddedByFilter("client")}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          addedByFilter === "client"
                            ? "bg-gray-100"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        Added by {transaction?.clientUserId?.name || "Client"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Clear Filter */}
              {isFilterApplied && (
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Clear All Filters
                </button>
              )}

              {/* View Toggle */}
              <button
                onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                {viewMode === "list" ? <BsGrid className="h-4 w-4" /> : <BsListUl className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Mobile View */}
          <div className="sm:hidden space-y-3">
            {/* Top Row - Sort and View Toggle */}
            <div className="flex justify-between gap-2">
              {/* Sort Button */}
              <div className="relative flex-grow">
                <button
                  onClick={() => setShowSortMenu((prev) => !prev)}
                  className="w-full inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <BsFilter className="mr-2 h-4 w-4" />
                  Sort By
                </button>
                {showSortMenu && (
                  <div className="absolute left-0 right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <button
                        onClick={() => handleSortChange("newest")}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Newest First
                      </button>
                      <button
                        onClick={() => handleSortChange("oldest")}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Oldest First
                      </button>
                      <button
                        onClick={() => handleSortChange("amount_high")}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        High to Low
                      </button>
                      <button
                        onClick={() => handleSortChange("amount_low")}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Low to High
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* View Toggle */}
              <button
                onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                {viewMode === "list" ? (
                  <BsGrid className="h-4 w-4" />
                ) : (
                  <BsListUl className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Middle Row - Status and Added By Filters */}
            <div className="flex gap-2">
              {/* Status Filter */}
              <div className="relative flex-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowStatusFilterMenu(!showStatusFilterMenu);
                    setShowAddedByFilterMenu(false);
                    setShowSortMenu(false);
                  }}
                  className="w-full inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <AiOutlineFilter className="mr-2 h-4 w-4" />
                  {statusFilter === "all" ? "Status: All" : `Status: ${statusFilter}`}
                </button>
                {showStatusFilterMenu && (
                  <div 
                    className="absolute left-0 right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[100]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="py-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusFilter("all");
                          setShowStatusFilterMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          statusFilter === "all" ? "bg-gray-100" : "hover:bg-gray-50"
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusFilter("confirmed");
                          setShowStatusFilterMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          statusFilter === "confirmed" ? "bg-gray-100" : "hover:bg-gray-50"
                        }`}
                      >
                        Confirmed
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusFilter("pending");
                          setShowStatusFilterMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          statusFilter === "pending" ? "bg-gray-100" : "hover:bg-gray-50"
                        }`}
                      >
                        Pending
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Added By Filter */}
              <div className="relative flex-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAddedByFilterMenu(!showAddedByFilterMenu);
                    setShowStatusFilterMenu(false);
                    setShowSortMenu(false);
                  }}
                  className="w-full inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <AiOutlineFilter className="mr-2 h-4 w-4" />
                  {addedByFilter === "all" ? "Added By: All" : `Added By: ${addedByFilter}`}
                </button>
                {showAddedByFilterMenu && (
                  <div 
                    className="absolute left-0 right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[100]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="py-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddedByFilter("all");
                          setShowAddedByFilterMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          addedByFilter === "all" ? "bg-gray-100" : "hover:bg-gray-50"
                        }`}
                      >
                        Both
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddedByFilter("user");
                          setShowAddedByFilterMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          addedByFilter === "user" ? "bg-gray-100" : "hover:bg-gray-50"
                        }`}
                      >
                        Added by {transaction?.userId?.name || "You"}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddedByFilter("client");
                          setShowAddedByFilterMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          addedByFilter === "client" ? "bg-gray-100" : "hover:bg-gray-50"
                        }`}
                      >
                        Added by {transaction?.clientUserId?.name || "Client"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Row - Clear Filter */}
            {isFilterApplied && (
              <button
                onClick={clearAllFilters}
                className="w-full inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>

        <div className="mt-2 text-sm text-gray-700">
          {filteredAndSortedTransactions.length > 0 ? (
            <div className="flex justify-between items-center p-4 bg-gray-100 rounded-md shadow-sm">
              <span className="text-gray-800 font-medium">
                <b className="text-blue-600">Showing:</b>{" "}
                {(currentPage - 1) * itemsPerPage + 1} to{" "}
                <span className="text-blue-600">
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredAndSortedTransactions.length
                  )}
                </span>
              </span>
              <span className="text-gray-800 font-medium">
                <b className="text-green-600">Total Results:</b>{" "}
                <span className="text-green-600">
                  {filteredAndSortedTransactions.length}
                </span>
              </span>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-500 text-lg mb-2">
                No transactions found
              </div>
              <div className="text-gray-400">
                {addedByFilter !== "all"
                  ? `No transactions ${
                      addedByFilter === "user"
                        ? `added by ${transaction?.userId?.name || "you"}`
                        : `added by ${
                            transaction?.clientUserId?.name || "client"
                          }`
                    }`
                  : "No transactions match the current filters"}
              </div>
            </div>
          )}
        </div>

        {filteredAndSortedTransactions.length > 0 ? (
          viewMode === "list" ? (
            renderTableView()
          ) : (
            renderGridView()
          )
        ) : null}

        {showSplitModal && selectedEntry && (
          <SplitTransaction
            onClose={handleSplitClose}
            originalTransaction={selectedEntry}
            bookId={selectedEntry.bookId}
            onSuccess={handleSplitSuccess}
          />
        )}

        {showDescriptionModal && selectedDescription && (
          <div 
            className="fixed  bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDescriptionModal(false)}
          >
            <div 
              className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                <button 
                  onClick={() => setShowDescriptionModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 whitespace-pre-wrap break-words">
                {selectedDescription}
              </p>
            </div>
          </div>
        )}

        {/* Backdrop - works for both desktop and mobile */}
        {(showSortMenu || showStatusFilterMenu || showAddedByFilterMenu) && (
          <div 
            className="fixed  bg-opacity-25 z-40"
            onClick={() => {
              setShowSortMenu(false);
              setShowStatusFilterMenu(false);
              setShowAddedByFilterMenu(false);
            }}
          />
        )}
      </div>
    );
  }
);

export default TransactionTable;