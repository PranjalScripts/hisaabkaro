import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlinePlus,
  AiOutlineUnorderedList,
  AiOutlineAppstore,
} from "react-icons/ai";
import { FiRefreshCw } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import TransactionSummary from "../../components/Dashboard/TransactionSummary";

const DashBoard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchAllTransactions = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const [clientTransactionsRes, transactionsRes] = await Promise.all([
        fetch(
          `${process.env.REACT_APP_URL}/api/collab-transactions/client-transactions`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        fetch(
          `${process.env.REACT_APP_URL}/api/collab-transactions/transactions`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
      ]);

      const clientTransactions = await clientTransactionsRes.json();
      const transactionsData = await transactionsRes.json();

      const clientTransactionsWithSource = (
        clientTransactions.transactions || []
      ).map((transaction) => {
        const confirmedYouWillGet = transaction.transactionHistory
          .filter(
            (t) =>
              t.transactionType === "you will give" &&
              t.confirmationStatus === "confirmed"
          )
          .reduce((acc, curr) => acc + curr.amount, 0);

        const confirmedYouWillGive = transaction.transactionHistory
          .filter(
            (t) =>
              t.transactionType === "you will get" &&
              t.confirmationStatus === "confirmed"
          )
          .reduce((acc, curr) => acc + curr.amount, 0);

        const unconfirmedYouWillGet = transaction.transactionHistory
          .filter(
            (t) =>
              t.transactionType === "you will give" &&
              t.confirmationStatus !== "confirmed"
          )
          .reduce((acc, curr) => acc + curr.amount, 0);

        const unconfirmedYouWillGive = transaction.transactionHistory
          .filter(
            (t) =>
              t.transactionType === "you will get" &&
              t.confirmationStatus !== "confirmed"
          )
          .reduce((acc, curr) => acc + curr.amount, 0);

        const outstandingBalance = confirmedYouWillGet - confirmedYouWillGive;

        return {
          ...transaction,
          confirmedYouWillGet,
          confirmedYouWillGive,
          unconfirmedYouWillGet,
          unconfirmedYouWillGive,
          outstandingBalance,
          source: "client",
          transactionId: transaction._id,
        };
      });

      const transactionsWithSource = (transactionsData.transactions || []).map(
        (transaction) => {
          const confirmedYouWillGet = transaction.transactionHistory
            .filter(
              (t) =>
                t.transactionType === "you will get" &&
                t.confirmationStatus === "confirmed"
            )
            .reduce((acc, curr) => acc + curr.amount, 0);

          const confirmedYouWillGive = transaction.transactionHistory
            .filter(
              (t) =>
                t.transactionType === "you will give" &&
                t.confirmationStatus === "confirmed"
            )
            .reduce((acc, curr) => acc + curr.amount, 0);

          const unconfirmedYouWillGet = transaction.transactionHistory
            .filter(
              (t) =>
                t.transactionType === "you will get" &&
                t.confirmationStatus !== "confirmed"
            )
            .reduce((acc, curr) => acc + curr.amount, 0);

          const unconfirmedYouWillGive = transaction.transactionHistory
            .filter(
              (t) =>
                t.transactionType === "you will give" &&
                t.confirmationStatus !== "confirmed"
            )
            .reduce((acc, curr) => acc + curr.amount, 0);

          const outstandingBalance = transaction.outstandingBalance;

          return {
            ...transaction,
            confirmedYouWillGet,
            confirmedYouWillGive,
            unconfirmedYouWillGet,
            unconfirmedYouWillGive,
            outstandingBalance,
            source: "transaction",
            transactionId: transaction._id,
          };
        }
      );

      setTransactions([
        ...clientTransactionsWithSource,
        ...transactionsWithSource,
      ]);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  useEffect(() => {
    const filtered = transactions.filter((transaction) => {
      const bookName = transaction.bookId?.bookname || '';
      return bookName.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredTransactions(filtered);
  }, [searchTerm, transactions]);

  const viewTransactionDetails = (transactionId, source) => {
    if (source === "client") {
      navigate(`/transaction-details/${transactionId}`);
    } else {
      navigate(`/history/${transactionId}`);
    }
  };

  const addTransaction = () => {
    navigate("/addtransaction");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <div className="text-lg font-medium text-gray-700">
            {t("common.loading")}
          </div>
        </div>
      </div>
    );
  }

  const transactionsFromSource = filteredTransactions.filter(
    (transaction) => transaction.source === "transaction"
  );
  const clientsFromSource = filteredTransactions.filter(
    (transaction) => transaction.source === "client"
  );

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          {t("dashboard.recentTransactions")}
        </h1>
        <div className="flex space-x-4">
          {/* Search Input */}
          <input
            type="text"
            placeholder={t("Search by book name")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* Page Size Selector */}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={10}>10 {t("common.perPage")}</option>
            <option value={25}>25 {t("common.perPage")}</option>
            <option value={50}>50 {t("common.perPage")}</option>
            <option value={100}>100 {t("common.perPage")}</option>
          </select>

          {/* View Mode Toggle */}
          <button
            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            className="px-3 py-2 rounded-lg flex items-center space-x-2 bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 transition-colors"
          >
            {viewMode === 'list' ? (
              <>
                <AiOutlineAppstore className="text-lg" />
                <span>{t("common.gridView")}</span>
              </>
            ) : (
              <>
                <AiOutlineUnorderedList className="text-lg" />
                <span>{t("common.listView")}</span>
              </>
            )}
          </button>

          <button
            onClick={fetchAllTransactions}
            className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200"
          >
            <FiRefreshCw className="text-lg" />
            <span>{t("common.refresh")}</span>
          </button>
          <button
            onClick={addTransaction}
            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
          >
            <AiOutlinePlus className="text-xl" />
            <span>{t("transactions.addTransaction")}</span>
          </button>
        </div>
      </div>

      {filteredTransactions.length > 0 && (
        <TransactionSummary transactions={filteredTransactions} />
      )}

      {transactionsFromSource.length === 0 && clientsFromSource.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm">
          <div className="text-lg text-gray-600 mb-6">
            {t("common.noRecordsFound")}
          </div>
          <button
            onClick={addTransaction}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
          >
            <AiOutlinePlus className="text-xl" />
            <span>{t("transactions.addYourFirstTransaction")}</span>
          </button>
        </div>
      ) : viewMode === 'list' ? (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-600">
                  <th className="px-6 py-4 font-medium">{t("common.name")}</th>
                  <th className="px-6 py-4 font-medium">
                    {t("common.bookName")}
                  </th>
                  <th className="px-6 py-4 font-medium">
                    {t("transactions.youWillGet")}
                  </th>
                  <th className="px-6 py-4 font-medium">
                    {t("transactions.youWillGive")}
                  </th>
                  <th className="px-6 py-4 font-medium">
                    {t("transactions.outstandingBalance")}
                  </th>
                  <th className="px-6 py-4 font-medium">
                    {t("common.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTransactions
                  .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                  .map((transaction, index) => (
                    <tr
                      key={index}
                      onClick={() =>
                        viewTransactionDetails(
                          transaction.transactionId,
                          transaction.source
                        )
                      }
                      className="hover:bg-blue-50/50 transition-colors duration-150 cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-700">
                            {transaction.source === "client"
                              ? transaction.userId?.name || "N/A"
                              : transaction.clientUserId?.name || "N/A"}
                          </span>
                          {transaction.source === "client" ? (
                            <AiOutlineArrowLeft
                              className="text-blue-500 text-xl"
                              title={t("transactions.clientTransaction")}
                            />
                          ) : (
                            <AiOutlineArrowRight
                              className="text-orange-500 text-xl"
                              title={t("transactions.transaction")}
                            />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {transaction.bookId?.bookname ||
                          t("common.couldNotFindBookName")}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-green-600 font-medium">
                          {transaction.confirmedYouWillGet}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-red-600 font-medium">
                          {transaction.confirmedYouWillGive}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`font-medium ${
                            transaction.source === "client"
                              ? transaction.outstandingBalance > 0
                                ? "text-green-600"
                                : transaction.outstandingBalance < 0
                                ? "text-red-600"
                                : "text-gray-600"
                              : transaction.outstandingBalance > 0
                              ? "text-green-600"
                              : transaction.outstandingBalance < 0
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {transaction.outstandingBalance === 0
                            ? 0
                            : Math.abs(transaction.outstandingBalance) ||
                              t("common.na")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-150">
                          {t("common.viewDetails")}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Grid View
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTransactions
            .slice((currentPage - 1) * pageSize, currentPage * pageSize)
            .map((transaction, index) => (
              <div
                key={index}
                onClick={() =>
                  viewTransactionDetails(
                    transaction.transactionId,
                    transaction.source
                  )
                }
                className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all duration-200 cursor-pointer overflow-hidden"
              >
                {/* Header Section */}
                <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                        <span className="text-lg font-semibold text-blue-600">
                          {(transaction.source === "client"
                            ? transaction.userId?.name
                            : transaction.clientUserId?.name || "N/A"
                          ).charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {transaction.source === "client"
                            ? transaction.userId?.name || "N/A"
                            : transaction.clientUserId?.name || "N/A"}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center space-x-1">
                          {transaction.source === "client" ? (
                            <>
                              <AiOutlineArrowLeft className="text-blue-500" />
                              <span>{t("transactions.clientTransaction")}</span>
                            </>
                          ) : (
                            <>
                              <AiOutlineArrowRight className="text-orange-500" />
                              <span>{t("transactions.transaction")}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-sm font-medium text-gray-500">
                    {transaction.bookId?.bookname || t("common.couldNotFindBookName")}
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    {/* You Will Get */}
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="text-xs text-green-600 font-medium mb-1">
                        {t("transactions.youWillGet")}
                      </div>
                      <div className="text-lg font-semibold text-green-600">
                        ₹{transaction.confirmedYouWillGet}
                      </div>
                    </div>

                    {/* You Will Give */}
                    <div className="bg-red-50 rounded-lg p-3">
                      <div className="text-xs text-red-600 font-medium mb-1">
                        {t("transactions.youWillGive")}
                      </div>
                      <div className="text-lg font-semibold text-red-600">
                        ₹{transaction.confirmedYouWillGive}
                      </div>
                    </div>
                  </div>

                  {/* Outstanding Balance */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-600">
                        {t("transactions.outstandingBalance")}
                      </span>
                      <span
                        className={`text-lg font-semibold ${
                          transaction.source === "client"
                            ? transaction.outstandingBalance > 0
                              ? "text-green-600"
                              : transaction.outstandingBalance < 0
                              ? "text-red-600"
                              : "text-gray-600"
                            : transaction.outstandingBalance > 0
                            ? "text-green-600"
                            : transaction.outstandingBalance < 0
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        ₹
                        {transaction.outstandingBalance === 0
                          ? 0
                          : Math.abs(transaction.outstandingBalance) ||
                            t("common.na")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 bg-gray-50 group-hover:bg-blue-50 transition-colors border-t border-gray-100">
                  <div className="flex items-center justify-center text-blue-600 font-medium">
                    <span className="mr-2">{t("common.viewDetails")}</span>
                    <AiOutlineArrowRight className="text-lg group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
      {/* Pagination Controls */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
        <div className="text-sm text-gray-700 mb-4 sm:mb-0">
          {t("common.showing")}{" "}
          {Math.min((currentPage - 1) * pageSize + 1, filteredTransactions.length)}{" "}
          {t("common.to")}{" "}
          {Math.min(currentPage * pageSize, filteredTransactions.length)}{" "}
          {t("common.of")} {filteredTransactions.length} {t("common.transactions")}
        </div>
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            }`}
          >
            {t("common.previous")}
          </button>
          {Array.from(
            { length: Math.min(5, Math.ceil(filteredTransactions.length / pageSize)) },
            (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                  }`}
                >
                  {pageNum}
                </button>
              );
            }
          )}
          <button
            onClick={() =>
              setCurrentPage(prev =>
                Math.min(prev + 1, Math.ceil(filteredTransactions.length / pageSize))
              )
            }
            disabled={currentPage >= Math.ceil(filteredTransactions.length / pageSize)}
            className={`px-3 py-1 rounded-md ${
              currentPage >= Math.ceil(filteredTransactions.length / pageSize)
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            }`}
          >
            {t("common.next")}
          </button>
        </div>
      </div>
    </div>
  );
};
export default DashBoard;
