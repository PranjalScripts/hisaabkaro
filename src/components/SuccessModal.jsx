import React, { useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const SuccessModal = ({ message, onClose }) => {
  useEffect(() => {
    // Auto close after 2 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div 
        className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 shadow-2xl transform transition-all duration-300 ease-in-out animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 transform transition-all duration-500 ease-in-out animate-bounce">
            <FaCheckCircle className="w-20 h-20 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Success!</h3>
          <p className="text-lg text-gray-700 mb-6">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
