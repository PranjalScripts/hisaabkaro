import React from 'react';

const TransactionHeader = ({ bookName, clientName, outstandingBalance }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Transaction Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 transform transition-all hover:scale-105 duration-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-blue-200 rounded-lg transform rotate-6"></div>
              <div className="absolute inset-0 bg-blue-300 rounded-lg transform rotate-3"></div>
              <div className="absolute inset-0 bg-blue-400 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-700">Book Name</h3>
          </div>
          <p className="text-xl text-gray-900">{bookName || "Loading..."}</p>
        </div>

        <div
          className={`rounded-xl p-6 transform transition-all hover:scale-105 duration-300 ${
            outstandingBalance < 0
              ? "bg-gradient-to-r from-red-50 to-red-100"
              : "bg-gradient-to-r from-green-50 to-green-100"
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-green-200 rounded-lg transform rotate-6"></div>
              <div className="absolute inset-0 bg-green-300 rounded-lg transform rotate-3"></div>
              <div className={`absolute inset-0 ${outstandingBalance < 0 ? 'bg-red-400' : 'bg-green-400'} rounded-lg flex items-center justify-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-700">Outstanding Balance</h3>
          </div>
          <p
            className={`text-xl font-bold ${
              outstandingBalance < 0
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
             {Math.abs(outstandingBalance).toLocaleString()}
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 transform transition-all hover:scale-105 duration-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-purple-200 rounded-lg transform rotate-6"></div>
              <div className="absolute inset-0 bg-purple-300 rounded-lg transform rotate-3"></div>
              <div className="absolute inset-0 bg-purple-400 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-700">Client Name</h3>
          </div>
          <p className="text-xl text-gray-900">{clientName?.name || "Loading..."}</p>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-6 transform transition-all hover:scale-105 duration-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-yellow-200 rounded-lg transform rotate-6"></div>
              <div className="absolute inset-0 bg-yellow-300 rounded-lg transform rotate-3"></div>
              <div className="absolute inset-0 bg-yellow-400 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-700">Contact Number</h3>
          </div>
          <p className="text-xl text-gray-900">
            {clientName?.mobile ? (
              <a 
                href={`tel:${clientName.mobile}`}
                className="hover:text-blue-600 transition-colors duration-200 flex items-center gap-2"
              >
                <span>{clientName.mobile}</span>
                 
              </a>
            ) : (
              "Loading..."
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionHeader;
