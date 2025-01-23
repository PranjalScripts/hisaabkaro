import React, { useState } from "react";
import axios from "axios";
import SuccessModal from "../../components/SuccessModal";
import ErrorModal from "../../components/ErrorModal";

const AddBook = ({ onBookAdded, onBookUpdated, editingBook = null, onClose }) => {
  const [bookName, setBookName] = useState(editingBook?.bookname || "");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(editingBook?.profile || null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const getAuthToken = () => localStorage.getItem("token");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBook = async () => {
    if (!bookName.trim()) {
      setErrorMessage('Please enter a book name');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('bookname', bookName.trim());
      if (profileImage) {
        formData.append('profile', profileImage);
      }

      if (editingBook) {
        const response = await axios.put(
          `${process.env.REACT_APP_URL}/api/v2/transactionBooks/update-book/${editingBook._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        onBookUpdated(response.data.book);
        const event = new CustomEvent('bookAdded', { detail: response.data.book });
        window.dispatchEvent(event);
        setShowSuccess(true);
        // Modal will be closed by the success modal's onClose handler
      } else {
        const response = await axios.post(
          `${process.env.REACT_APP_URL}/api/v2/transactionBooks/create-book`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        onBookAdded(response.data.book);
        const event = new CustomEvent('bookAdded', { detail: response.data.book });
        window.dispatchEvent(event);
        setShowSuccess(true);
        // Modal will be closed by the success modal's onClose handler
      }
    } catch (error) {
      console.error("Error saving book:", error);
      setErrorMessage(
        error.response?.data?.message || "An error occurred while saving the book"
      );
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    // Close the form after success modal is closed
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]">
        <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
          <h2 className="text-2xl font-bold mb-4">
            {editingBook ? "Edit Book" : "Add New Book"}
          </h2>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Book Name
            </label>
            <input
              type="text"
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter book name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Book Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/128?text=No+Image';
                  }}
                />
              </div>
            )}
          </div>

          {errorMessage && (
            <ErrorModal message={errorMessage} onClose={() => setErrorMessage("")} />
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveBook}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {editingBook ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </div>

      {showSuccess && (
        <SuccessModal
          message={editingBook ? "Book updated successfully!" : "Book added successfully!"}
          onClose={handleSuccessClose}
        />
      )}
    </>
  );
};

export default AddBook;
