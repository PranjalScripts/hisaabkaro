import { FaSearch, FaCog, FaBell, FaUserCog, FaSignOutAlt } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  const userName = localStorage.getItem("username") || "User";
  const profileImage = localStorage.getItem("profile");
  const firstLetter = userName.charAt(0).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    navigate('/profile');
    setShowProfileMenu(false);
  };

  return (
    <div className="fixed top-0 flex items-center justify-between bg-white border-b border-gray-100 px-8 py-4 z-[10] shadow-sm" style={{ width: "calc(100% - 260px)" }}>
      {/* Title */}
      <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
        Overview
      </h1>

      {/* Action Items */}
      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="flex items-center bg-gray-50 hover:bg-gray-100 rounded-lg px-4 py-2.5 transition-colors duration-200 border border-gray-100 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
          <FaSearch className="text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Quick search..."
            className="bg-transparent text-sm text-gray-600 placeholder-gray-400 focus:outline-none ml-3 w-56"
          />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <button className="relative p-2.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200">
            <FaCog className="text-lg" />
          </button>
          <button className="relative p-2.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200">
            <FaBell className="text-lg" />
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-[11px] font-bold text-white rounded-full flex items-center justify-center">
              2
            </span>
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200" ref={profileMenuRef}>
          <div className="hidden md:flex flex-col items-end">
            <p className="text-sm font-medium text-gray-700">{userName}</p>
            <p className="text-xs text-gray-500">User</p>
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="focus:outline-none transform transition-transform duration-200 hover:scale-105"
            >
              {profileImage && !imageError ? (
                <img
                  src=""
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-md hover:ring-blue-400 transition-all duration-200"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold ring-2 ring-white shadow-md hover:ring-blue-400 transition-all duration-200">
                  {firstLetter}
                </div>
              )}
              <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full ring-2 ring-white"></div>
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-lg py-2 transform transition-all duration-200 border border-gray-100">
                {/* User Info Section */}
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-700">{userName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">User Account</p>
                </div>
                
                {/* Menu Items */}
                <div className="py-1">
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <FaUserCog className="mr-3 text-gray-400" />
                    Profile Settings
                  </button>
                  <button
                    onClick={() => {
                      localStorage.clear();
                      navigate('/login');
                    }}
                    className="flex items-center w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                  >
                    <FaSignOutAlt className="mr-3 text-red-400" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
