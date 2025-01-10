import React from "react";
import { useTranslation } from "react-i18next";

const TransactionSummary = ({ transactions }) => {
  const { t } = useTranslation();

  const calculateTotals = () => {
    return transactions.reduce(
      (acc, transaction) => {
        const unconfirmedBalance =
          transaction.unconfirmedYouWillGet -
          transaction.unconfirmedYouWillGive;
        return {
          totalWillGet: acc.totalWillGet + transaction.confirmedYouWillGet,
          totalWillGive: acc.totalWillGive + transaction.confirmedYouWillGive,
          totalOutstanding:
            acc.totalOutstanding + transaction.outstandingBalance,
          unconfirmedWillGet:
            acc.unconfirmedWillGet + transaction.unconfirmedYouWillGet,
          unconfirmedWillGive:
            acc.unconfirmedWillGive + transaction.unconfirmedYouWillGive,
          totalUnconfirmedBalance:
            acc.totalUnconfirmedBalance + unconfirmedBalance,
        };
      },
      {
        totalWillGet: 0,
        totalWillGive: 0,
        totalOutstanding: 0,
        unconfirmedWillGet: 0,
        unconfirmedWillGive: 0,
        totalUnconfirmedBalance: 0,
      }
    );
  };

  const {
    totalWillGet,
    totalWillGive,
    totalOutstanding,
    unconfirmedWillGet,
    unconfirmedWillGive,
    totalUnconfirmedBalance,
  } = calculateTotals();

  const potentialOutstanding = totalOutstanding + totalUnconfirmedBalance;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100">
        <h3 className="text-lg font-medium text-gray-600 mb-2">
          {t("transactions.totalYouWillGet")}
        </h3>
        <p className="text-3xl font-bold text-green-600">{totalWillGet}</p>
        {unconfirmedWillGet > 0 && (
          <p className="text-xs text-gray-400 mt-1">
            + {unconfirmedWillGet} {t("transactions.unconfirmed")}
          </p>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100">
        <h3 className="text-lg font-medium text-gray-600 mb-2">
          {t("transactions.totalYouWillGive")}
        </h3>
        <p className="text-3xl font-bold text-red-600">{totalWillGive}</p>
        {unconfirmedWillGive > 0 && (
          <p className="text-xs text-gray-400 mt-1">
            + {unconfirmedWillGive} {t("transactions.unconfirmed")}
          </p>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
        <h3 className="text-lg font-medium text-gray-600 mb-2">
          {t("transactions.totalOutstanding")}
        </h3>
        <p
          className={`text-3xl font-bold ${
            totalOutstanding >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {Math.abs(totalOutstanding)}
        </p>
        {(unconfirmedWillGet > 0 || unconfirmedWillGive > 0) && (
          <p className="text-xs text-gray-400 mt-1">
            {t("transactions.afterSettlement")}:
            <span
              className={
                potentialOutstanding >= 0 ? "text-green-400" : "text-red-400"
              }
            >
              {Math.abs(potentialOutstanding)}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default TransactionSummary;
