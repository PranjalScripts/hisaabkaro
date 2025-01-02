import React, { useState } from "react";
import axios from "axios";
import SuccessModal from "../../components/SuccessModal";
import ErrorModal from "../../components/ErrorModal";

const AddBook = ({ onBookAdded, onBookUpdated, editingBook = null, onClose }) => {
  const [bookName, setBookName] = useState(editingBook ? editingBook.bookname : "");
  const [successModal, setSuccessModal] = useState({ isOpen: false, message: '' });
  const [errorMessage, setErrorMessage] = useState("");

  const getAuthToken = () => localStorage.getItem("token");

  const handleSuccessModalClose = () => {
    setSuccessModal({ isOpen: false, message: '' });
    onClose();
    setBookName("");
  };

  const handleSaveBook = async () => {
    if (!bookName.trim()) {
      setErrorMessage('Please enter a book name');
      return;
    }

    try {
      if (editingBook) {
        const response = await axios.put(
          `${process.env.REACT_APP_URL}/api/v2/transactionBooks/update-book/${editingBook._id}`,
          { bookname: bookName.trim() },
          {
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
            },
          }
        );
        onBookUpdated(response.data.book);
        setSuccessModal({
          isOpen: true,
          message: 'Book updated successfully!'
        });
      } else {
        const response = await axios.post(
          `${process.env.REACT_APP_URL}/api/v2/transactionBooks/create-books`,
          { bookname: bookName.trim() },
          {
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
            },
          }
        );
        onBookAdded(response.data.book);
        setSuccessModal({
          isOpen: true,
          message: 'Book added successfully!'
        });
      }
    } catch (error) {
      console.error("Error saving book", error);
      setErrorMessage(editingBook ? 
        'Failed to update book. Please try again.' : 
        'Failed to add book. Please try again.'
      );
    }
  };

  return (
    <div className="fixed inset-0 overflow-y-auto z-40" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity" aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">
              {editingBook ? "Edit Book" : "Add New Book"}
            </h3>
          </div>

          <div className="px-6 py-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Book Name
                </label>
                <input
                  type="text"
                  value={bookName}
                  onChange={(e) => setBookName(e.target.value)}
                  placeholder="Enter book name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveBook}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {editingBook ? "Save Changes" : "Add Book"}
            </button>
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={successModal.isOpen}
        message={successModal.message}
        onClose={handleSuccessModalClose}
      />
      {errorMessage && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setErrorMessage("")}
        />
      )}
    </div>
  );
};

export default AddBook;
