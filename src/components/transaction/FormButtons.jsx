import React from 'react';

const FormButtons = ({ modalType, onCancel, formData }) => {
  const getButtonColor = () => {
    if (modalType === "Edit Transaction") {
      return formData?.transactionType === "you will get" 
        ? "bg-green-500 hover:bg-green-600"
        : "bg-red-500 hover:bg-red-600";
    }
    return modalType === "You Will Give"
      ? "bg-red-500 hover:bg-red-600"
      : "bg-green-500 hover:bg-green-600";
  };

  return (
    <div className="flex gap-3 pt-2">
      <button
        type="submit"
        className={`flex-1 py-2.5 text-white font-medium rounded-md ${getButtonColor()}`}
      >
        Submit
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 py-2.5 bg-gray-100 text-gray-800 font-medium rounded-md hover:bg-gray-200"
      >
        Cancel
      </button>
    </div>
  );
};

export default FormButtons;
