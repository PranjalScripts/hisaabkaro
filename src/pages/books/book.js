import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { FaTh, FaList, FaEdit, FaTrash } from "react-icons/fa";
import SuccessModal from "../collaborativeBook/youAdded/SuccessModal";
import ErrorModal from "../../components/ErrorModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import AddBook from "./AddBook";
import { BookContext } from "../Layout/Layout";

const BookPage = () => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [successModal, setSuccessModal] = useState({ isOpen: false, message: '' });
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, bookId: null, bookName: '' });
  const [isLoading, setIsLoading] = useState(true);
  const { bookAdded } = useContext(BookContext);

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line
  }, [bookAdded]);

  const getAuthToken = () => localStorage.getItem("token");

  const fetchBooks = async () => {
    if (!getAuthToken()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_URL}/api/v2/transactionBooks/getAll-books`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      
      if (response.data && Array.isArray(response.data.books)) {
        setBooks(response.data.books);
      } else {
        console.warn("Invalid books data format:", response.data);
        setBooks([]);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      // Only show error modal if it's not an authentication error
      if (error.response?.status !== 401) {
        setErrorMessage('Failed to fetch books. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_URL}/api/v2/transactionBooks/delete-book/${bookId}`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      setBooks(books.filter((book) => book._id !== bookId));
      setSuccessModal({
        isOpen: true,
        message: 'Book deleted successfully!'
      });
      setDeleteModal({ isOpen: false, bookId: null, bookName: '' });
    } catch (error) {
      console.error("Error deleting book", error);
      setErrorMessage('Failed to delete book. Please try again.');
    }
  };

  const confirmDelete = (bookId, bookName) => {
    setDeleteModal({ isOpen: true, bookId, bookName });
  };

  const filteredBooks = books.filter((book) =>
    book.bookname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Manage Books</h2>
          <button
            onClick={() => {
              setShowModal(true);
              setEditingBook(null);
            }}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Book
          </button>
        </div>

        {/* Search and View Mode */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Search books..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center space-x-4 bg-white rounded-lg p-2 shadow-sm">
            <button
              onClick={() => {
                setViewMode("grid");
              }}
              className={`p-2 rounded-md transition-colors duration-200 ${
                viewMode === "grid"
                  ? "bg-indigo-100 text-indigo-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <FaTh className="text-xl" />
            </button>
            <button
              onClick={() => {
                setViewMode("list");
              }}
              className={`p-2 rounded-md transition-colors duration-200 ${
                viewMode === "list"
                  ? "bg-indigo-100 text-indigo-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <FaList className="text-xl" />
            </button>
          </div>
        </div>

        {/* Books Display */}
        {viewMode === "list" ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBooks.map((book, index) => (
                  <tr key={book._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {book.bookname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setEditingBook(book);
                          setShowModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors duration-200"
                      >
                        <FaEdit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => confirmDelete(book._id, book.bookname)}
                        className="text-red-600 hover:text-red-900 transition-colors duration-200"
                      >
                        <FaTrash className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book, index) => (
              <div
                key={book._id}
                className={`bg-gradient-to-br ${
                  index % 3 === 0 ? 'from-blue-200 via-blue-100 to-white' : 
                  index % 3 === 1 ? 'from-purple-200 via-purple-100 to-white' : 
                  'from-emerald-200 via-emerald-100 to-white'
                } rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group border border-gray-100`}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      index % 3 === 0 ? 'bg-blue-500 text-white' : 
                      index % 3 === 1 ? 'bg-purple-500 text-white' : 
                      'bg-emerald-500 text-white'
                    }`}>
                      {book.bookname.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                      {book.bookname}
                    </h3>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setEditingBook(book);
                        setShowModal(true);
                      }}
                      className={`inline-flex items-center px-4 py-2 ${
                        index % 3 === 0 ? 'border-blue-500 text-blue-500 hover:bg-blue-500' : 
                        index % 3 === 1 ? 'border-purple-500 text-purple-500 hover:bg-purple-500' : 
                        'border-emerald-500 text-emerald-500 hover:bg-emerald-500'
                      } border hover:text-white rounded-md text-sm font-medium transition-all duration-200`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(book._id, book.bookname)}
                      className="inline-flex items-center px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-md text-sm font-medium transition-all duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <AddBook
          onBookAdded={(newBook) => setBooks([...books, newBook])}
          onBookUpdated={(updatedBook) => 
            setBooks(books.map((book) => book._id === updatedBook._id ? updatedBook : book))
          }
          editingBook={editingBook}
          onClose={() => {
            setShowModal(false);
            setEditingBook(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Book</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete "{deleteModal.bookName}"? This action cannot be undone, and all associated transactions will be deleted.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => handleDeleteBook(deleteModal.bookId)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteModal({ isOpen: false, bookId: null, bookName: '' })}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <SuccessModal 
        isOpen={successModal.isOpen}
        message={successModal.message}
        onClose={() => setSuccessModal({ ...successModal, isOpen: false })}
      />

      {/* Error Modal */}
      {errorMessage && (
        <ErrorModal 
          message={errorMessage}
          onClose={() => setErrorMessage("")}
        />
      )}
    </div>
  );
};

export default BookPage;
