import React from 'react';

const SuccessModal = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg p-6 z-50 max-w-sm w-full mx-4">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-green-100 rounded-full p-2">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-medium text-center text-gray-900 mb-4">{message}</h3>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
