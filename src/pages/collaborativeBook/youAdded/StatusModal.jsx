import React, { useEffect } from 'react';
import { MdCheckCircle, MdError } from 'react-icons/md';

const StatusModal = ({ isOpen, onClose, status, message }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto close after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isSuccess = status?.toLowerCase() === 'success';

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl transform transition-all duration-300 ease-in-out"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center">
          {isSuccess ? (
            <MdCheckCircle className="mx-auto text-6xl text-green-500 mb-4 animate-bounce" />
          ) : (
            <MdError className="mx-auto text-6xl text-red-500 mb-4 animate-bounce" />
          )}
          
          <h3 className={`text-xl font-semibold mb-2 ${
            isSuccess ? 'text-green-600' : 'text-red-600'
          }`}>
            {isSuccess ? 'Success!' : 'Error!'}
          </h3>
          
          <p className="text-gray-600 mb-4">{message}</p>
          
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg text-white font-semibold transition-colors duration-200 ${
              isSuccess
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;
