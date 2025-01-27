import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SuccessModal from "../../components/SuccessModal";
import ErrorModal from "../../components/ErrorModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import EditUser from "./EditUser";
import { UserContext } from "../Layout/Layout";

const ClientUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [collaboratorClients, setCollaboratorClients] = useState([]); // New state for collaborator clients
  const [editingUser, setEditingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [successModal, setSuccessModal] = useState({ isOpen: false, message: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [viewType, setViewType] = useState("grid"); // 'grid' or 'list'
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null });
  const { userAdded, handleAddUser } = useContext(UserContext);

  // Array of gradient colors for cards
  const gradients = [
    { bg: 'from-blue-50 to-indigo-100', avatar: 'from-blue-400 to-indigo-500' },
    { bg: 'from-purple-50 to-pink-100', avatar: 'from-purple-400 to-pink-500' },
    { bg: 'from-green-50 to-emerald-100', avatar: 'from-green-400 to-emerald-500' },
    { bg: 'from-yellow-50 to-orange-100', avatar: 'from-yellow-400 to-orange-500' },
    { bg: 'from-pink-50 to-rose-100', avatar: 'from-pink-400 to-rose-500' },
    { bg: 'from-sky-50 to-cyan-100', avatar: 'from-sky-400 to-cyan-500' },
    { bg: 'from-violet-50 to-purple-100', avatar: 'from-violet-400 to-purple-500' },
    { bg: 'from-teal-50 to-emerald-100', avatar: 'from-teal-400 to-emerald-500' },
    { bg: 'from-fuchsia-50 to-pink-100', avatar: 'from-fuchsia-400 to-pink-500' },
    { bg: 'from-amber-50 to-orange-100', avatar: 'from-amber-400 to-orange-500' }
  ];

  const API_URL = `${process.env.REACT_APP_URL}/api/v3/client`;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex =
    /^(?:\+?\d{1,3})?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

  const showNotification = (message, type) => {
    if (type === "success") {
      setSuccessModal({ isOpen: true, message });
      setTimeout(() => {
        setSuccessModal({ isOpen: false, message: "" });
      }, 2000);
    } else {
      setErrorMessage(message);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const response = await axios.get(`${API_URL}/getAll-clients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.data && Array.isArray(response.data.data)) {
        setUsers(response.data.data);
      } else {
        setUsers([]);
        console.warn("Invalid users data format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response?.status !== 401) {
        showNotification("Failed to fetch users. Please try again.", "error");
      }
    }
  };

  const fetchCollaboratorClients = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const response = await axios.get(`${process.env.REACT_APP_URL}/api/collab-transactions/client-transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const usersWithTransactions = response.data.transactions.map(transaction => ({
        _id: transaction.userId._id,
        name: transaction.userId.name,
        email: transaction.userId.email,
        phone: transaction.userId.phone,
        profilePicture: transaction.userId.profilePicture,
        transactionId: transaction._id,
        bookId: transaction.bookId._id,
        bookName: transaction.bookId.bookname,
        createdAt: transaction.bookId.createdAt
      }));
      
      console.log('Processed users:', usersWithTransactions);
      setCollaboratorClients(usersWithTransactions);
    } catch (error) {
      console.error('Error fetching collaborator clients:', error);
      setErrorMessage(error.message);
    }
  };

  const handleDeleteClick = (user) => {
    setDeleteModal({ isOpen: true, user });
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/delete-client/${deleteModal.user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showNotification("User deleted successfully!", "success");
      setUsers(users.filter(user => user._id !== deleteModal.user._id));
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Error deleting user",
        "error"
      );
    } finally {
      setDeleteModal({ isOpen: false, user: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, user: null });
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
  };

  const handleUserUpdate = (updatedUser) => {
    // Ensure we have the updated user data
    if (!updatedUser || !updatedUser._id) {
      console.error("Invalid updated user data:", updatedUser);
      return;
    }

    setUsers(prevUsers => 
      prevUsers.map(user => 
        user._id === updatedUser._id ? { ...user, ...updatedUser } : user
      )
    );
    
    // Refresh the users list to ensure we have the latest data
    fetchUsers();
    showNotification("User updated successfully", "success");
  };

  useEffect(() => {
    fetchUsers();
    fetchCollaboratorClients(); // Fetch collaborator clients when component mounts
  }, [userAdded]); // Add userAdded as a dependency to refresh when a new user is added

  const filteredUsers = users.filter(
    (user) =>
      (user?.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) || false) ||
      (user?.mobile?.includes(searchQuery) || false)
  );

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title and Add User Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Users</h1>
          <button
            onClick={() => handleAddUser()}
            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mb-4 sm:mb-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add User
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteModal.isOpen && deleteModal.user && (
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
                  Delete {deleteModal.user.name}?
                </h3>

                {/* Warning Message */}
                <div className="mb-6 space-y-3">
                  <p className="text-gray-500">
                    This action cannot be undone. Are you sure you want to delete this user?
                  </p>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm text-yellow-800 font-medium">
                      ⚠️ Warning: This will permanently delete:
                    </p>
                    <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                      <li>All transaction records associated with this user</li>
                      <li>All payment history and outstanding balances</li>
                      <li>User profile and contact information</li>
                    </ul>
                  </div>
                  <p className="text-sm text-red-600 font-medium">
                    * These changes are irreversible and cannot be recovered
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleDeleteCancel}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-colors"
                  >
                    Yes, Delete User
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <SuccessModal
          isOpen={successModal.isOpen}
          message={successModal.message}
          onClose={() => setSuccessModal({ isOpen: false, message: "" })}
        />
        {errorMessage && (
          <ErrorModal
            message={errorMessage}
            onClose={() => setErrorMessage("")}
          />
        )}

        {/* Search and View Toggle Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div className="w-full sm:w-auto mb-4 sm:mb-0">
            <input
              type="text"
              placeholder="Search by name or mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Hide view toggle on mobile */}
          <div className="hidden sm:flex space-x-2">
            <button
              onClick={() => setViewType("grid")}
              className={`px-4 py-2 rounded-lg ${
                viewType === "grid"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewType("list")}
              className={`px-4 py-2 rounded-lg ${
                viewType === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              List View
            </button>
          </div>
        </div>

        {/* Grid View - Always shown on mobile */}
        <div className={viewType === "grid" || window.innerWidth < 640 ? "block" : "hidden"}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.map((user, index) => (
              <div
                key={user._id}
                className={`relative rounded-xl shadow-md hover:shadow-xl overflow-hidden bg-white border border-gray-100 transition-all duration-300 hover:-translate-y-1`}
              >
                {/* Card Header with Avatar */}
                <div className={`h-24 w-full bg-gradient-to-r ${gradients[index % gradients.length].bg}`}>
                  <div className="flex justify-center">
                    <div
                      className={`w-20 h-20 rounded-full border-4 border-white shadow-md transform translate-y-12 bg-gradient-to-br ${
                        gradients[index % gradients.length].avatar
                      } flex items-center justify-center`}
                    >
                      <span className="text-2xl font-bold text-white">
                        {user.name ? user.name[0].toUpperCase() : "?"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="px-4 pt-14 pb-4">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                      {user.name}
                    </h3>
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span className="text-sm">{user.mobile}</span>
                    </div>
                    {user.email && (
                      <div className="flex items-center justify-center gap-2 text-gray-600 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span className="text-sm truncate max-w-[200px]">{user.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center gap-3 mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(user)}
                      className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* List View - Hidden on mobile */}
        <div className={viewType === "list" && window.innerWidth >= 640 ? "block" : "hidden"}>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user, index) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradients[index % gradients.length].avatar} flex items-center justify-center shadow-sm`}
                        >
                          <span className="text-sm font-medium text-white">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.mobile}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="text-blue-600 hover:text-blue-800 mx-2 transition-colors flex items-center gap-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="text-red-600 hover:text-red-800 transition-colors flex items-center gap-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Display Users who added me */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Users Who Added Me As Client</h2>
          {viewType === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {collaboratorClients.map((user, index) => (
                <div
                  key={user._id}
                  className="relative rounded-xl shadow-md hover:shadow-xl overflow-hidden bg-white border border-gray-100 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  onClick={() => navigate(`/transaction-details/${user.transactionId}`)}
                >
                  {/* Index Number */}
                  <div className="absolute top-2 left-2 bg-white/90 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium z-10">
                    {index + 1}
                  </div>

                  {/* Card Header with Avatar */}
                  <div className={`h-24 w-full bg-gradient-to-r ${gradients[index % gradients.length].bg}`}>
                    <div className="flex justify-center">
                      <div className={`w-20 h-20 rounded-full border-4 border-white shadow-md transform translate-y-12 bg-gradient-to-br ${gradients[index % gradients.length].avatar} flex items-center justify-center overflow-hidden`}>
                        {user.profilePicture ? (
                          <img 
                            src={user.profilePicture} 
                            alt={user.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl font-bold text-white">
                            {user.name ? user.name[0].toUpperCase() : "?"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="px-4 pt-14 pb-4">
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">
                        {user.name}
                      </h3>
                      <div className="flex items-center justify-center gap-2 text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span className="text-sm">{user.phone || '-'}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-gray-600 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <span className="text-sm truncate max-w-[200px]">{user.email}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-gray-600 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-center mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/transaction-details/${user.transactionId}`);
                        }}
                        className="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        See Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Column Headers */}
              <div className="grid grid-cols-[40px_1fr_1fr_1fr_1fr_1fr] gap-2 items-center bg-gray-50 p-2 border-b">
                <div className="font-medium text-gray-500 text-sm uppercase">#</div>
                <div className="font-medium text-gray-500 text-sm uppercase">Date Added</div>
                <div className="font-medium text-gray-500 text-sm uppercase">Name</div>
                <div className="font-medium text-gray-500 text-sm uppercase">Email</div>
                <div className="font-medium text-gray-500 text-sm uppercase">Phone</div>
                <div className="font-medium text-gray-500 text-sm uppercase">Actions</div>
              </div>
              {/* List Items */}
              {collaboratorClients.map((user, index) => (
                <div
                  key={user._id}
                  className="p-2 border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/transaction-details/${user.transactionId}`)}
                >
                  <div className="grid grid-cols-[40px_1fr_1fr_1fr_1fr_1fr] gap-2 items-center">
                    <div className="text-gray-600 font-medium">{index + 1}</div>
                    <div className="text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</div>

                    <div className="flex items-center space-x-3">
                      {user.profilePicture ? (
                        <img 
                          src={user.profilePicture} 
                          alt={user.name} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br ${gradients[index % gradients.length].avatar}`}>
                          {user.name ? user.name[0].toUpperCase() : '?'}
                        </div>
                      )}

                      <span className="font-medium">{user.name}</span>
                    </div>
                    <div className="text-gray-600">{user.email}</div>
                    <div className="text-gray-600">{user.phone || '-'}</div>
                    <div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click
                          navigate(`/transaction-details/${user.transactionId}`);
                        }}
                        className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                      >
                        See Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-yellow-50 rounded-full animate-pulse"></div>
              <svg className="w-full h-full relative z-10" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Main circle */}
                <circle cx="64" cy="64" r="60" className="fill-yellow-400" />
                <circle cx="64" cy="64" r="60" className="stroke-yellow-500" strokeWidth="2" />
                
                {/* 3D effect gradients */}
                <defs>
                  <radialGradient id="face_gradient" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0%" stopColor="#FCD34D" />
                    <stop offset="100%" stopColor="#F59E0B" />
                  </radialGradient>
                  <linearGradient id="shadow_gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(251, 191, 36, 0)" />
                    <stop offset="100%" stopColor="rgba(217, 119, 6, 0.2)" />
                  </linearGradient>
                </defs>
                <circle cx="64" cy="64" r="58" fill="url(#face_gradient)" />
                <circle cx="64" cy="64" r="58" fill="url(#shadow_gradient)" />
                
                {/* Eyes */}
                <g className="transform translate-y-2">
                  <path d="M40 60C43.3137 60 46 57.3137 46 54C46 50.6863 43.3137 48 40 48C36.6863 48 34 50.6863 34 54C34 57.3137 36.6863 60 40 60Z" className="fill-gray-800">
                    <animate attributeName="d" dur="3s" repeatCount="indefinite"
                      values="M40 60C43.3137 60 46 57.3137 46 54C46 50.6863 43.3137 48 40 48C36.6863 48 34 50.6863 34 54C34 57.3137 36.6863 60 40 60Z;
                              M40 58C43.3137 58 46 57.3137 46 54C46 50.6863 43.3137 50 40 50C36.6863 50 34 50.6863 34 54C34 57.3137 36.6863 58 40 58Z;
                              M40 60C43.3137 60 46 57.3137 46 54C46 50.6863 43.3137 48 40 48C36.6863 48 34 50.6863 34 54C34 57.3137 36.6863 60 40 60Z"
                    />
                  </path>
                  <path d="M88 60C91.3137 60 94 57.3137 94 54C94 50.6863 91.3137 48 88 48C84.6863 48 82 50.6863 82 54C82 57.3137 84.6863 60 88 60Z" className="fill-gray-800">
                    <animate attributeName="d" dur="3s" repeatCount="indefinite"
                      values="M88 60C91.3137 60 94 57.3137 94 54C94 50.6863 91.3137 48 88 48C84.6863 48 82 50.6863 82 54C82 57.3137 84.6863 60 88 60Z;
                              M88 58C91.3137 58 94 57.3137 94 54C94 50.6863 91.3137 50 88 50C84.6863 50 82 50.6863 82 54C82 57.3137 84.6863 58 88 58Z;
                              M88 60C91.3137 60 94 57.3137 94 54C94 50.6863 91.3137 48 88 48C84.6863 48 82 50.6863 82 54C82 57.3137 84.6863 60 88 60Z"
                    />
                  </path>
                </g>
                
                {/* Mouth - Sad expression */}
                <path d="M44 88C44 88 54 78 64 78C74 78 84 88 84 88" 
                  className="stroke-gray-800" 
                  strokeWidth="4" 
                  strokeLinecap="round"
                  fill="none"
                >
                  <animate attributeName="d" dur="3s" repeatCount="indefinite"
                    values="M44 88C44 88 54 78 64 78C74 78 84 88 84 88;
                            M44 90C44 90 54 80 64 80C74 80 84 90 84 90;
                            M44 88C44 88 54 78 64 78C74 78 84 88 84 88"
                  />
                </path>
                
                {/* Tear drops */}
                <path d="M38 62C38 62 36 68 34 72C32 76 36 78 38 76C40 74 38 62 38 62Z" className="fill-blue-400">
                  <animate attributeName="opacity" dur="3s" repeatCount="indefinite"
                    values="0;1;0"
                  />
                </path>
                <path d="M86 62C86 62 84 68 82 72C80 76 84 78 86 76C88 74 86 62 86 62Z" className="fill-blue-400">
                  <animate attributeName="opacity" dur="3s" repeatCount="indefinite"
                    values="0;1;0"
                  />
                </path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Clients Yet</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Looks like you haven't added any clients yet. Start by adding your first client!
            </p>
            <button
              onClick={() => handleAddUser()}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add User
            </button>
          </div>
        )}

        {editingUser && (
          <EditUser
            user={editingUser}
            onClose={() => setEditingUser(null)}
            onUserUpdated={handleUserUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default ClientUsers;
