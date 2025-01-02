import React, { useEffect } from 'react';
import TransactionForm from './TransactionForm';
import ModalHeader from './ModalHeader';

const TransactionModal = ({ showModal, setShowModal, modalType, handleFormSubmit, formData = {}, handleInputChange }) => {
  useEffect(() => {
    return () => {
      // Cleanup when component unmounts
      if (showModal) {
        setShowModal(false);
      }
    };
  }, []);

  if (!showModal) return null;

  const handleClose = () => {
    setShowModal(false);
  };

  // Ensure formData has all required fields with default values
  const normalizedFormData = {
    amount: formData?.amount || "",
    description: formData?.description || "",
    transactionType: formData?.transactionType || "",
    file: formData?.file || null,
    transactionDate: formData?.transactionDate || new Date().toISOString()
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <ModalHeader 
          modalType={modalType} 
          onClose={handleClose}
          formData={normalizedFormData}
        />
        <TransactionForm 
          modalType={modalType}
          formData={normalizedFormData}
          handleInputChange={handleInputChange}
          handleFormSubmit={(e) => {
            e.preventDefault();
            handleFormSubmit(e);
          }}
          onCancel={handleClose}
        />
      </div>
    </div>
  );
};

export default TransactionModal;
