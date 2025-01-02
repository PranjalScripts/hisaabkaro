import React from 'react';

const ModalHeader = ({ modalType, onClose, formData }) => {
  const getHeaderColor = () => {
    if (modalType === "Edit Transaction") {
      return formData?.transactionType === "you will get" ? "bg-green-500" : "bg-red-500";
    }
    return modalType === "You Will Give" ? "bg-red-500" : "bg-green-500";
  };

  return (
    <div className={`${getHeaderColor()} px-6 py-4 flex justify-between items-center`}>
      <div className="flex items-center">
        <h3 className="text-xl text-white font-medium">
          {modalType}
        </h3>
        {modalType === "Edit Transaction" && (
          <span className="ml-2 text-sm text-white opacity-90">
            ({formData?.transactionType === "you will get" ? "You Will Get" : "You Will Give"})
          </span>
        )}
      </div>
      <button 
        onClick={onClose}
        className="text-white hover:text-gray-100"
      >
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default ModalHeader;
