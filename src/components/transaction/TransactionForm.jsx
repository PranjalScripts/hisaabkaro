import React from 'react';
import FormInput from './FormInput';
import FileUpload from './FileUpload';
import FormButtons from './FormButtons';

const TransactionForm = ({ modalType = "", formData = {}, handleInputChange, handleFormSubmit, onCancel }) => {
  // Ensure formData is never null/undefined and has all required fields
  const safeFormData = {
    amount: formData?.amount || "",
    description: formData?.description || "",
    transactionType: formData?.transactionType || "",
    file: formData?.file || null,
    transactionDate: formData?.transactionDate || new Date().toISOString()
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFormSubmit(e);
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Amount"
          type="number"
          name="amount"
          value={safeFormData.amount}
          onChange={handleInputChange}
          placeholder="Enter amount"
          required
        />

        <FormInput
          label="Description"
          type="text"
          name="description"
          value={safeFormData.description}
          onChange={handleInputChange}
          placeholder="Enter description"
          required
        />

        <FileUpload
          file={safeFormData.file}
          onChange={handleInputChange}
        />

        <FormButtons
          modalType={modalType}
          onCancel={onCancel}
          formData={safeFormData}
        />
      </form>
    </div>
  );
};

export default TransactionForm;
