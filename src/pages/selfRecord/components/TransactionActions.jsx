import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import TransactionPDF from './TransactionPDF';

const TransactionActions = ({ onActionClick, transactions, bookName, clientName, outstandingBalance }) => {
  // Validate props before rendering PDF
  const canRenderPDF = () => {
    return (
      Array.isArray(transactions) &&
      typeof bookName === 'string' &&
      clientName &&
      typeof outstandingBalance === 'number'
    );
  };

  const renderPDFLink = () => {
    if (!canRenderPDF()) {
      return (
        <button
          disabled
          className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-400 text-white cursor-not-allowed"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Export PDF
        </button>
      );
    }

    return (
      <PDFDownloadLink
        document={
          <TransactionPDF 
            transactions={transactions || []} 
            bookName={bookName || 'Untitled'} 
            clientName={clientName || { name: 'Unknown', mobile: 'N/A' }}
            outstandingBalance={outstandingBalance || 0}
          />
        }
        fileName={`${bookName || 'transactions'}_${new Date().toISOString().split('T')[0]}.pdf`}
        className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transform transition-all hover:scale-105 duration-300 shadow-md"
      >
        {({ blob, url, loading, error }) => (
          <>
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {loading ? 'Generating...' : error ? 'Error' : 'Export PDF'}
          </>
        )}
      </PDFDownloadLink>
    );
  };

  return (
    <div className="flex space-x-4">
      <button
        className="inline-flex items-center px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transform transition-all hover:scale-105 duration-300 shadow-md"
        onClick={() => onActionClick("You Will Give")}
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        You Will Give
      </button>
      <button
        className="inline-flex items-center px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transform transition-all hover:scale-105 duration-300 shadow-md"
        onClick={() => onActionClick("You Will Get")}
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        You Will Get
      </button>
      {renderPDFLink()}
    </div>
  );
};

export default TransactionActions;
