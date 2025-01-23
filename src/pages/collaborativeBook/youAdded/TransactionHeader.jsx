import React from 'react';

const TransactionHeader = ({ transaction }) => {
  

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
          Transaction Details
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Book Name Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
            <div className="relative bg-white ring-1 ring-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="text-blue-600 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="font-semibold">Book Name</span>
              </div>
              <p className="text-gray-700 font-medium">{transaction.bookId.bookname}</p>
            </div>
          </div>

          {/* User Name Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
            <div className="relative bg-white ring-1 ring-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="text-emerald-600 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-semibold">User Name</span>
              </div>
              <p className="text-gray-700 font-medium">{transaction.userId.name}</p>
            </div>
          </div>

          {/* Client Name Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
            <div className="relative bg-white ring-1 ring-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="text-amber-600 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="font-semibold">Client Name</span>
              </div>
              <p className="text-gray-700 font-medium">{transaction.clientUserId.name}</p>
            </div>
          </div>

          {/* Outstanding Balance Card */}
          <div className="relative group">
            <div className={`absolute inset-0 ${transaction.outstandingBalance < 0 ? 'bg-gradient-to-r from-red-400 to-red-600' : 'bg-gradient-to-r from-green-400 to-green-600'} rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-200`}></div>
            <div className={`relative ${transaction.outstandingBalance < 0 ? 'bg-red-50' : 'bg-green-50'} ring-1 ${transaction.outstandingBalance < 0 ? 'ring-red-200' : 'ring-green-200'} rounded-xl p-6 hover:shadow-lg transition-shadow duration-200`}>
              <div className={`mb-2 flex items-center ${transaction.outstandingBalance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">Outstanding Balance</span>
              </div>
              <p className={`font-medium ${transaction.outstandingBalance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                {Math.abs(transaction.outstandingBalance)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHeader;