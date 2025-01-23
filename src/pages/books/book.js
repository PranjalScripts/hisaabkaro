import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { FaTh, FaList, FaEdit, FaTrash, FaSearch, FaPlus, FaBook } from "react-icons/fa";
import { Image, Button, Input, Badge } from "antd";
import SuccessModal from "../collaborativeBook/youAdded/SuccessModal";
import ErrorModal from "../../components/ErrorModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import AddBook from "./AddBook";
import { BookContext } from "../Layout/Layout";

const BookPage = () => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [successModal, setSuccessModal] = useState({ isOpen: false, message: '', icon: null });
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, bookId: null, bookName: '' });
  const [isLoading, setIsLoading] = useState(true);
  const { bookAdded } = useContext(BookContext);

  // Base64 encoded placeholder image (a simple gray square with "No Image" text)
  const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZWVlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";

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
      setErrorMessage("Failed to fetch books");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (book) => {
    setDeleteModal({
      isOpen: true,
      bookId: book._id,
      bookName: book.bookname
    });
  };

  const handleDeleteBook = async (bookId) => {
    try {
      const bookToDelete = books.find(book => book._id === bookId);
      const response = await axios.delete(
        `${process.env.REACT_APP_URL}/api/v2/transactionBooks/delete-book/${bookId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (bookToDelete) {
        setBooks(books.filter(book => book._id !== bookId));
        setDeleteModal({ isOpen: false, bookId: null, bookName: '' });
        setSuccessModal({
          isOpen: true,
          message: `Book "${bookToDelete.bookname}" and all its associated transactions have been successfully deleted!`,
          icon: (
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <div className="relative">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <FaTrash className="w-8 h-8 text-red-500" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
            </div>
          )
        });
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      setErrorMessage(error.response?.data?.message || 'Error deleting book and its transactions');
    }
  };

  const handleBookAdded = (newBook) => {
    setBooks((prevBooks) => [...prevBooks, newBook]);
    setShowModal(false);
    setSuccessModal({
      isOpen: true,
      message: `Book "${newBook.bookname}" has been successfully added!`
    });
  };

  const handleBookUpdated = (updatedBook) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book._id === updatedBook._id ? updatedBook : book
      )
    );
    setEditingBook(null);
    setShowModal(false);
    setSuccessModal({
      isOpen: true,
      message: `Book "${updatedBook.bookname}" has been successfully updated!`
    });
  };

  const filteredBooks = books.filter((book) =>
    book.bookname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
      {filteredBooks.map((book) => (
        <div
          key={book._id}
          className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-blue-200 flex flex-col transform hover:-translate-y-1"
        >
          <div className="relative">
            <div className="absolute top-4 right-4 z-10">
              <Badge count={<FaBook className="text-blue-500" />} />
            </div>
            <div className="w-full h-[200px] bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden flex items-center justify-center p-4">
              <div className="w-[160px] h-[160px] relative overflow-hidden rounded-xl shadow-md">
                {book.profile ? (
                  <Image
                    src={`${process.env.REACT_APP_URL}${book.profile}`}
                    alt={book.bookname}
                    placeholder={placeholderImage}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    preview={{
                      mask: (
                        <div className="text-lg font-medium text-white flex items-center gap-2">
                          <FaSearch className="w-5 h-5" />
                          View Image
                        </div>
                      ),
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
                    <FaBook className="w-12 h-12 text-blue-200" />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between bg-white">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 truncate hover:text-clip hover:whitespace-normal transition-all duration-300 group-hover:text-blue-600">
                {book.bookname}
              </h3>
              <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-4"></div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <Button
                type="default"
                icon={<FaEdit className="w-3.5 h-3.5" />}
                onClick={() => setEditingBook(book)}
                className="flex items-center hover:text-blue-600 hover:border-blue-600 shadow-sm"
              >
                Edit
              </Button>
              <Button
                danger
                icon={<FaTrash className="w-3.5 h-3.5" />}
                onClick={() => handleDeleteClick(book)}
                className="flex items-center shadow-sm"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 via-blue-50 to-gray-50">
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">
                Book Image
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Book Name
              </th>
              <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[250px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBooks.map((book) => (
              <tr key={book._id} className="hover:bg-blue-50/30 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-[100px] h-[100px] mx-auto bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl overflow-hidden flex items-center justify-center p-2">
                    <div className="w-[80px] h-[80px] relative overflow-hidden rounded-lg shadow-sm">
                      {book.profile ? (
                        <Image
                          src={`${process.env.REACT_APP_URL}${book.profile}`}
                          alt={book.bookname}
                          placeholder={placeholderImage}
                          className="w-full h-full object-cover"
                          preview={{
                            mask: (
                              <div className="text-sm font-medium text-white flex items-center gap-1">
                                <FaSearch className="w-4 h-4" />
                                View
                              </div>
                            ),
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                          <FaBook className="w-8 h-8 text-blue-200" />
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <div className="text-base font-semibold text-gray-900 group-hover:text-blue-600">
                      {book.bookname}
                    </div>
                    <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-2"></div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex justify-end space-x-3">
                    <Button
                      type="default"
                      icon={<FaEdit className="w-3.5 h-3.5" />}
                      onClick={() => setEditingBook(book)}
                      className="flex items-center hover:text-blue-600 hover:border-blue-600 shadow-sm"
                    >
                      Edit
                    </Button>
                    <Button
                      danger
                      icon={<FaTrash className="w-3.5 h-3.5" />}
                      onClick={() => handleDeleteClick(book)}
                      className="flex items-center shadow-sm"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Your Books Collection
            </h1>
            <p className="text-gray-500 mt-2">Manage and organize your books efficiently</p>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<FaPlus className="w-4 h-4" />}
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg"
          >
            Add New Book
          </Button>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-md mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Input
              prefix={<FaSearch className="text-gray-400" />}
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 rounded-xl shadow-sm"
              size="large"
            />
          </div>
          <div className="flex items-center space-x-2 bg-gray-100/80 backdrop-blur-sm rounded-xl p-1.5">
            <Button
              type={viewMode === "grid" ? "primary" : "default"}
              icon={<FaTh className="w-4 h-4" />}
              onClick={() => setViewMode("grid")}
              className={`rounded-lg ${
                viewMode === "grid"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 border-0 hover:from-blue-700 hover:to-indigo-700"
                  : "hover:text-blue-600"
              }`}
            />
            <Button
              type={viewMode === "list" ? "primary" : "default"}
              icon={<FaList className="w-4 h-4" />}
              onClick={() => setViewMode("list")}
              className={`rounded-lg ${
                viewMode === "list"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 border-0 hover:from-blue-700 hover:to-indigo-700"
                  : "hover:text-blue-600"
              }`}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="mt-4 text-gray-500 text-center">Loading books...</div>
            </div>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md">
            <FaBook className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <div className="text-gray-500 text-xl mb-6">No books found</div>
            <Button
              type="primary"
              icon={<FaPlus className="w-4 h-4" />}
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0"
              size="large"
            >
              Add your first book
            </Button>
          </div>
        ) : (
          <div>{viewMode === "grid" ? renderGridView() : renderListView()}</div>
        )}
      </div>

      {showModal && !editingBook && (
        <AddBook onBookAdded={handleBookAdded} onClose={() => setShowModal(false)} />
      )}

      {editingBook && (
        <AddBook
          editingBook={editingBook}
          onBookUpdated={handleBookUpdated}
          onClose={() => {
            setEditingBook(null);
            setShowModal(false);
          }}
        />
      )}

      {deleteModal.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md mx-4 relative z-10">
            <div className="text-center">
              {/* Warning Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Delete "{deleteModal.bookName}"?
              </h3>

              {/* Warning Message */}
              <div className="mb-6 space-y-3">
                <p className="text-gray-500">
                  This action cannot be undone. Are you sure you want to delete this book?
                </p>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm text-yellow-800 font-medium">
                    ⚠️ Warning: This will permanently delete:
                  </p>
                  <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                    <li>All transaction records associated with this book</li>
                    <li>All payment history and balances</li>
                    <li>Book profile and settings</li>
                  </ul>
                </div>
                <p className="text-sm text-red-600 font-medium">
                  * These changes are irreversible and cannot be recovered
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  block
                  size="large"
                  onClick={() => setDeleteModal({ isOpen: false, bookId: null, bookName: '' })}
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-0"
                >
                  Cancel
                </Button>
                <Button
                  block
                  size="large"
                  onClick={() => handleDeleteBook(deleteModal.bookId)}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 hover:from-red-600 hover:to-red-700"
                >
                  Yes, Delete Book
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {successModal.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-sm mx-4 relative z-10 transform transition-all">
            {successModal.icon || (
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            )}
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">Success!</h3>
            <p className="text-gray-500 text-center mb-6">{successModal.message}</p>
            <Button
              type="primary"
              block
              size="large"
              onClick={() => setSuccessModal({ isOpen: false, message: '', icon: null })}
              className="bg-gradient-to-r from-green-500 to-green-600 border-0 hover:from-green-600 hover:to-green-700"
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {errorMessage && (
        <ErrorModal message={errorMessage} onClose={() => setErrorMessage("")} />
      )}
    </div>
  );
};

export default BookPage;
