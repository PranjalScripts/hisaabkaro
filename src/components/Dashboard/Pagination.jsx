import React from 'react';
import { useTranslation } from "react-i18next";

const Pagination = ({ 
  currentPage, 
  pageSize, 
  totalItems, 
  onPageChange, 
  isMobile = false 
}) => {
  const { t } = useTranslation();
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className={`flex justify-center items-center space-x-2 mt-4 ${isMobile ? 'pb-4' : ''}`}>
      <button
        onClick={() => onPageChange(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded-md text-sm ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400"
            : "bg-white text-gray-700 border border-gray-300"
        }`}
      >
        {isMobile ? '←' : t("common.previous")}
      </button>

      {!isMobile && (
        <div className="flex space-x-1">
          {Array.from(
            { length: Math.min(3, totalPages) },
            (_, i) => {
              let pageNum;
              if (currentPage <= 2) pageNum = i + 1;
              else if (currentPage >= totalPages - 1) pageNum = totalPages - 2 + i;
              else pageNum = currentPage - 1 + i;

              if (pageNum <= totalPages) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
              return null;
            }
          )}
        </div>
      )}

      {isMobile ? (
        <span className="text-sm text-gray-600">
          {currentPage} / {totalPages}
        </span>
      ) : null}

      <button
        onClick={() =>
          onPageChange(prev =>
            Math.min(prev + 1, totalPages)
          )
        }
        disabled={currentPage >= totalPages}
        className={`px-3 py-2 rounded-md text-sm ${
          currentPage >= totalPages
            ? "bg-gray-100 text-gray-400"
            : "bg-white text-gray-700 border border-gray-300"
        }`}
      >
        {isMobile ? '→' : t("common.next")}
      </button>
    </div>
  );
};

export default Pagination; 