import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, entriesPerPage, onEntriesPerPageChange }) => {
  const pageNumbers = [];
  const maxVisiblePages = 5;

  // Calculate range of visible page numbers
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  // Adjust if we're near the end
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
      <div className="flex items-center">
        <span className="mr-2 text-sm text-gray-700">Show</span>
        <select
          value={entriesPerPage}
          onChange={(e) => onEntriesPerPageChange(Number(e.target.value))}
          className="px-3 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span className="ml-2 text-sm text-gray-700">entries per page</span>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 text-sm rounded-md ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50 border'
          }`}
        >
          Previous
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50"
            >
              1
            </button>
            {startPage > 2 && (
              <span className="text-gray-500">...</span>
            )}
          </>
        )}

        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`px-3 py-1 text-sm rounded-md ${
              currentPage === number
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border'
            }`}
          >
            {number}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="text-gray-500">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 text-sm rounded-md ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50 border'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
