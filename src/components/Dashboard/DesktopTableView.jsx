import React from 'react';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { useTranslation } from "react-i18next";

const DesktopTableView = ({ transactions, currentPage, pageSize, onTransactionClick }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                {t("common.name")}
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                {t("common.bookName")}
              </th>
              <th className="py-3 px-4 text-right text-sm font-medium text-gray-600">
                {t("transactions.youWillGet")}
              </th>
              <th className="py-3 px-4 text-right text-sm font-medium text-gray-600">
                {t("transactions.youWillGive")}
              </th>
              <th className="py-3 px-4 text-right text-sm font-medium text-gray-600">
                {t("transactions.outstandingBalance")}
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)
              .map((transaction, index) => (
                <tr
                  key={index}
                  onClick={() => onTransactionClick(transaction.transactionId, transaction.source)}
                  className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {transaction.source === "client" ? (
                        <AiOutlineArrowLeft className="text-blue-500 text-lg" />
                      ) : (
                        <AiOutlineArrowRight className="text-orange-500 text-lg" />
                      )}
                      <span>
                        {transaction.source === "client"
                          ? transaction.userId?.name || "N/A"
                          : transaction.clientUserId?.name || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {transaction.bookId?.bookname || t("common.couldNotFindBookName")}
                  </td>
                  <td className="py-3 px-4 text-right text-green-600">
                    {transaction.confirmedYouWillGet}
                  </td>
                  <td className="py-3 px-4 text-right text-red-600">
                    {transaction.confirmedYouWillGive}
                  </td>
                  <td className={`py-3 px-4 text-right font-medium ${
                    transaction.outstandingBalance > 0
                      ? "text-green-600"
                      : transaction.outstandingBalance < 0
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}>
                     {Math.abs(transaction.outstandingBalance) || 0}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DesktopTableView; 