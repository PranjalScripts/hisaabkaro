import React from "react";
import { useTranslation } from "react-i18next";

const SidebarTransactionSummary = ({ transactions }) => {
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
    <div className="flex flex-col space-y-1 w-full text-sm">
      <div className="bg-white px-2 py-0.5 rounded-md shadow-sm border border-green-100">
        <h3 className="text-[10px] font-medium text-gray-600 leading-tight">
          {t("transactions.totalYouWillGet")}
        </h3>
        <p className="text-sm font-bold text-green-600 leading-tight">{totalWillGet}</p>
        {unconfirmedWillGet > 0 && (
          <p className="text-[8px] text-gray-400 leading-tight">
            + {unconfirmedWillGet} {t("transactions.unconfirmed")}
          </p>
        )}
      </div>

      <div className="bg-white px-2 py-0.5 rounded-md shadow-sm border border-red-100">
        <h3 className="text-[10px] font-medium text-gray-600 leading-tight">
          {t("transactions.totalYouWillGive")}
        </h3>
        <p className="text-sm font-bold text-red-600 leading-tight">{totalWillGive}</p>
        {unconfirmedWillGive > 0 && (
          <p className="text-[8px] text-gray-400 leading-tight">
            + {unconfirmedWillGive} {t("transactions.unconfirmed")}
          </p>
        )}
      </div>

      <div className="bg-white px-2 py-0.5 rounded-md shadow-sm border border-blue-100">
        <h3 className="text-[10px] font-medium text-gray-600 leading-tight">
          {t("transactions.totalOutstanding")}
        </h3>
        <p
          className={`text-sm font-bold leading-tight ${
            totalOutstanding >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {Math.abs(totalOutstanding)}
        </p>
        {(unconfirmedWillGet > 0 || unconfirmedWillGive > 0) && (
          <p className="text-[8px] text-gray-400 leading-tight">
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

export default SidebarTransactionSummary;
