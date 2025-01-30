import React from 'react';
import { AiOutlinePlus, AiOutlineUnorderedList, AiOutlineAppstore } from "react-icons/ai";
import { FiRefreshCw } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const DashboardHeader = ({ 
  pageSize, 
  setPageSize, 
  setCurrentPage, 
  viewMode, 
  setViewMode, 
  onAddTransaction, 
  onRefresh 
}) => {
  const { t } = useTranslation();

  return (
    <div className="mb-8 flex flex-col space-y-4">
      <div className="flex flex-wrap gap-2">
        {/* Page Size Selector */}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={10}>10 {t("common.perPage")}</option>
          <option value={25}>25 {t("common.perPage")}</option>
          <option value={50}>50 {t("common.perPage")}</option>
          <option value={100}>100 {t("common.perPage")}</option>
        </select>

        {/* Add Transaction Button */}
        <button
          onClick={onAddTransaction}
          className="flex-1 md:flex-initial flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          <AiOutlinePlus className="text-xl" />
          <span className="text-sm md:text-base">{t("transactions.addTransaction")}</span>
        </button>

        {/* View Mode Toggle */}
        <button
          onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
          className="flex items-center justify-center px-4 py-2 bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors"
        >
          {viewMode === 'list' ? (
            <>
              <AiOutlineAppstore className="text-lg" />
              <span className="hidden md:inline ml-2">{t("common.gridView")}</span>
            </>
          ) : (
            <>
              <AiOutlineUnorderedList className="text-lg" />
              <span className="hidden md:inline ml-2">{t("common.listView")}</span>
            </>
          )}
        </button>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          className="flex items-center justify-center px-4 py-2 bg-white text-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200"
        >
          <FiRefreshCw className="text-lg" />
          <span className="hidden md:inline ml-2">{t("common.refresh")}</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader; 