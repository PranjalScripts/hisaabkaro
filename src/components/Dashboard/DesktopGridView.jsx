import React from 'react';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { useTranslation } from "react-i18next";

const DesktopGridView = ({ transactions, currentPage, pageSize, onTransactionClick }) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {transactions
        .slice((currentPage - 1) * pageSize, currentPage * pageSize)
        .map((transaction, index) => (
          <div
            key={index}
            onClick={() => onTransactionClick(transaction.transactionId, transaction.source)}
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
                    <p className="text-sm text-gray-500">
                      {transaction.bookId?.bookname || t("common.couldNotFindBookName")}
                    </p>
                  </div>
                </div>
                {transaction.source === "client" ? (
                  <AiOutlineArrowLeft className="text-blue-500 text-xl" />
                ) : (
                  <AiOutlineArrowRight className="text-orange-500 text-xl" />
                )}
              </div>
            </div>

            {/* Transaction Details */}
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 rounded p-3">
                  <div className="text-sm text-green-600 font-medium mb-1">
                    {t("transactions.youWillGet")}
                  </div>
                  <div className="text-lg font-semibold text-green-600">
                    {transaction.confirmedYouWillGet}
                  </div>
                </div>
                <div className="bg-red-50 rounded p-3">
                  <div className="text-sm text-red-600 font-medium mb-1">
                    {t("transactions.youWillGive")}
                  </div>
                  <div className="text-lg font-semibold text-red-600">
                    {transaction.confirmedYouWillGive}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">
                  {t("transactions.outstandingBalance")}
                </span>
                <span className={`text-lg font-semibold ${
                  transaction.outstandingBalance > 0
                    ? "text-green-600"
                    : transaction.outstandingBalance < 0
                    ? "text-red-600"
                    : "text-gray-600"
                }`}>
                  {Math.abs(transaction.outstandingBalance) || 0}
                </span>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default DesktopGridView; 