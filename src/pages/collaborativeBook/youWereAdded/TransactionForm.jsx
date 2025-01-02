import React, { useState } from 'react';

const TransactionForm = ({ formData, isSubmitting, onSubmit, onChange, onCancel }) => {
  const isYouWillGive = formData.transactionType === "you will give";
  const formColor = isYouWillGive ? {
    bg: "bg-green-50",
    border: "border-green-200",
    button: "bg-green-600 hover:bg-green-700",
    ring: "focus:ring-green-500",
    text: "text-green-700"
  } : {
    bg: "bg-red-50",
    border: "border-red-200",
    button: "bg-red-600 hover:bg-red-700",
    ring: "focus:ring-red-500",
    text: "text-red-700"
  };

  const [fileError, setFileError] = useState('');

  return (
    <>
      {/* Modal header */}
      <div className={`${formColor.bg} rounded-t-xl`}>
        <div className={`px-6 py-4 border-b ${formColor.border}`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-semibold ${formColor.text}`}>
              {formData.transactionType === "you will give" ? "You Will Get" : "You Will Give"}
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal body */}
        <form onSubmit={onSubmit} className="px-6 py-4">
          <div className="space-y-4">
            {/* Amount Input */}
            <div>
              <label className={`block text-sm font-medium ${formColor.text} mb-1`}>Amount</label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <input
                  type="number"
                  name="amount"
                  required
                  min="0"
                  step="0.01"
                  className={`block w-full px-3 py-2 sm:text-sm border-gray-300 rounded-md focus:ring-2 ${formColor.ring} focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                  value={formData.amount === "" ? "" : formData.amount}
                  onChange={onChange}
                />
              </div>
            </div>

            {/* Description Input */}
            <div>
              <label className={`block text-sm font-medium ${formColor.text} mb-1`}>Description</label>
              <textarea
                name="description"
                rows="3"
                className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 ${formColor.ring} focus:border-transparent sm:text-sm`}
                placeholder="Add a note about this transaction..."
                value={formData.description}
                onChange={onChange}
              />
            </div>

            {/* File Upload */}
            <div>
              <label className={`block text-sm font-medium ${formColor.text} mb-1`}>Attach Receipt (Optional)</label>
              <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${formColor.border} border-dashed rounded-md`}>
                <div className="space-y-1 text-center">
                  <svg
                    className={`mx-auto h-12 w-12 ${formColor.text}`}
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex flex-col space-y-2">
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className={`relative cursor-pointer bg-white rounded-md font-medium ${formColor.text} hover:${formColor.text} focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 ${formColor.ring}`}
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            setFileError('');
                            if (file && file.size > 5 * 1024 * 1024) { // 5MB in bytes
                              setFileError('File size must be less than 5MB');
                              e.target.value = ''; // Reset the input
                              return;
                            }
                            onChange({ target: { name: 'file', value: file } });
                          }}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, PDF up to 5MB
                    </p>
                    {fileError && (
                      <p className="text-sm text-red-600 font-medium">
                        {fileError}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal footer */}
          <div className="mt-5 sm:mt-6 flex flex-row-reverse gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm ${formColor.button} focus:outline-none focus:ring-2 ${formColor.ring} focus:ring-offset-2 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                'Submit'
              )}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default TransactionForm;
