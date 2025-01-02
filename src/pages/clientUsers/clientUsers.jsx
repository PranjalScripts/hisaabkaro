import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import SuccessModal from "../../components/SuccessModal";
import ErrorModal from "../../components/ErrorModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import EditUser from "./EditUser";
import { UserContext } from "../Layout/Layout";

const ClientUsers = () => {
  const [users, setUsers] = useState([]);
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

  const handleUserUpdated = (updatedUser) => {
    setUsers(users.map(user => user._id === updatedUser._id ? updatedUser : user));
    showNotification("User updated successfully!", "success");
  };

  useEffect(() => {
    fetchUsers();
  }, [userAdded]); // Add userAdded as a dependency to refresh when a new user is added

  const filteredUsers = users.filter(
    (user) =>
      (user?.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) || false) ||
      (user?.mobile?.includes(searchQuery) || false)
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && deleteModal.user && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete User</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete {deleteModal.user.name}? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={handleDeleteCancel}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
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

      <div className="container mx-auto">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Client Users</h1>
            <div className="flex items-center gap-4">
              {/* View Toggle */}
              <div className="flex items-center bg-white rounded-lg shadow-sm p-1">
                <button
                  onClick={() => setViewType("grid")}
                  className={`p-2 rounded ${
                    viewType === "grid"
                      ? "bg-indigo-500 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  title="Grid View"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewType("list")}
                  className={`p-2 rounded ${
                    viewType === "list"
                      ? "bg-indigo-500 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  title="List View"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <button
                onClick={() => handleAddUser()}
                className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add User
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative max-w-md">
            <input
              type="text"
              className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              placeholder="Search by name or phone"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {filteredUsers.length > 0 ? (
          viewType === "grid" ? (
            // Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user, index) => (
                <div
                  key={user._id}
                  className={`rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden bg-gradient-to-br ${gradients[index % gradients.length].bg}`}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${gradients[index % gradients.length].avatar} flex items-center justify-center shadow-sm`}>
                          <span className="text-xl font-semibold text-white">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span className="text-sm">{user.mobile}</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-3 bg-white/50 backdrop-blur-sm flex justify-end space-x-2 border-t border-gray-100">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(user)}
                      className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // List View
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
                          <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${gradients[index % gradients.length].avatar} flex items-center justify-center shadow-sm`}>
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
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
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
      </div>

      {editingUser && (
        <EditUser
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onUserUpdated={handleUserUpdated}
        />
      )}
    </div>
  );
};

export default ClientUsers;
