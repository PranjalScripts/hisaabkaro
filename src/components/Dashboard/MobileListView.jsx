import React from 'react';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { useTranslation } from "react-i18next";

const MobileListView = ({ transactions, currentPage, pageSize, onTransactionClick }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-1.5">
      {transactions
        .slice((currentPage - 1) * pageSize, currentPage * pageSize)
        .map((transaction, index) => (
          <div
            key={index}
            onClick={() => onTransactionClick(transaction.transactionId, transaction.source)}
            className="bg-white px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              {/* Left Section - Index, Arrow & Names */}
              <div className="flex items-start flex-1 min-w-0">
                <span className="text-xs text-gray-400 w-5 mt-1">
                  #{(currentPage - 1) * pageSize + index + 1}
                </span>
                {transaction.source === "client" ? (
                  <AiOutlineArrowLeft className="text-blue-500 text-sm mx-2 mt-1" />
                ) : (
                  <AiOutlineArrowRight className="text-orange-500 text-sm mx-2 mt-1" />
                )}
                <div className="min-w-0">
                  <span className="text-sm font-medium text-gray-900 block truncate">
                    {transaction.source === "client"
                      ? transaction.userId?.name || "N/A"
                      : transaction.clientUserId?.name || "N/A"}
                  </span>
                  <span className={`text-xs ${
                    transaction.source === "client"
                      ? "text-blue-600"
                      : "text-orange-600"
                  }`}>
                    {transaction.bookId?.bookname || t("common.couldNotFindBookName")}
                  </span>
                </div>
              </div>

              {/* Right Section - Outstanding Balance */}
              <div className="flex-shrink-0 text-right">
                <span className={`text-sm font-medium ${
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

export default MobileListView; 