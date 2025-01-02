import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const YourBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookName, setBookName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/api/v2/transactionBooks/getAll-books`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (Array.isArray(response.data.books)) {
          setBooks(response.data.books);
        }
      } catch (err) {
        setError("Failed to fetch books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const openAddModal = () => {
    setBookName("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setBookName("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    try {
      await axios.post(
        `${process.env.REACT_APP_URL}/api/v2/transactionBooks/create-books`,
        { bookname: bookName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // Refresh the books list
      const response = await axios.get(
        `${process.env.REACT_APP_URL}/api/v2/transactionBooks/getAll-books`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (Array.isArray(response.data.books)) {
        setBooks(response.data.books);
      }
      
      closeModal();
    } catch (err) {
      setError("Failed to create book. Please try again.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100/50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Books</h1>
            <p className="mt-2 text-gray-600">Track your financial records</p>
          </div>
          <div
            onClick={openAddModal}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex items-center gap-2 hover:-translate-y-0.5"
          >
            <FaPlus size={16} />
            <span className="font-medium">New Book</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book, index) => {
            const gradients = [
              "bg-gradient-to-br from-blue-100 via-blue-50 to-white",
              "bg-gradient-to-br from-purple-100 via-purple-50 to-white",
              "bg-gradient-to-br from-green-100 via-green-50 to-white",
              "bg-gradient-to-br from-red-100 via-red-50 to-white",
              "bg-gradient-to-br from-yellow-100 via-yellow-50 to-white",
              "bg-gradient-to-br from-pink-100 via-pink-50 to-white",
              "bg-gradient-to-br from-indigo-100 via-indigo-50 to-white",
              "bg-gradient-to-br from-orange-100 via-orange-50 to-white",
              "bg-gradient-to-br from-teal-100 via-teal-50 to-white",
              "bg-gradient-to-br from-cyan-100 via-cyan-50 to-white"
            ][index % 10];

            const textColors = [
              "text-blue-600",
              "text-purple-600",
              "text-green-600",
              "text-red-600",
              "text-yellow-600",
              "text-pink-600",
              "text-indigo-600",
              "text-orange-600",
              "text-teal-600",
              "text-cyan-600"
            ][index % 10];

            const borderColors = [
              "border-blue-200",
              "border-purple-200",
              "border-green-200",
              "border-red-200",
              "border-yellow-200",
              "border-pink-200",
              "border-indigo-200",
              "border-orange-200",
              "border-teal-200",
              "border-cyan-200"
            ][index % 10];

            return (
              <div
                key={book._id}
                onClick={() => navigate(`/your-books/${book._id}`)}
                className={`${gradients} rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer min-h-[160px] border ${borderColors} group relative overflow-hidden hover:-translate-y-0.5`}
              >
                <div className="absolute inset-0 bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <div className="relative flex items-center">
                  <div className={`w-10 h-10 rounded-full bg-white ${textColors} border-2 ${borderColors} flex items-center justify-center font-semibold text-lg shadow-sm group-hover:scale-105 transition-transform duration-200`}>
                    {book.bookname.charAt(0).toUpperCase()}
                  </div>
                  <h2 className={`ml-3 text-lg font-semibold ${textColors} group-hover:translate-x-1 transition-transform duration-200`}>
                    {book.bookname}
                  </h2>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div 
              className="bg-white rounded-xl p-8 w-full max-w-md mx-4 shadow-xl border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Book</h2>
              <p className="text-gray-600 mb-6">Enter a name for your new book</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="bookName" className="block text-sm font-medium text-gray-700 mb-2">
                    Book Name
                  </label>
                  <input
                    id="bookName"
                    type="text"
                    value={bookName}
                    onChange={(e) => setBookName(e.target.value)}
                    placeholder="Enter book name"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-md transition-all duration-200 font-medium hover:-translate-y-0.5"
                  >
                    Create Book
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YourBooks;
