import React from "react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../context/ProfileContext";
import { FaSearch, FaCog, FaBell, FaUserCog, FaSignOutAlt } from "react-icons/fa";

export default function Header() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { profileData } = useProfile();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setShowProfileMenu(false);
  };

  const firstLetter = profileData?.name?.charAt(0).toUpperCase() || "U";

  return (
    <div className="fixed top-0 flex items-center justify-between bg-white border-b border-gray-100 px-8 py-4 z-[10] shadow-sm" style={{ width: "calc(100% - 260px)" }}>
      {/* Search Section */}
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-400 transition-colors duration-200"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Settings */}
        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
          <FaCog className="text-xl" />
        </button>

        {/* Notifications */}
        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
          <FaBell className="text-xl" />
        </button>

        {/* Profile Section */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200" ref={profileMenuRef}>
          <div className="hidden md:flex flex-col items-end">
            <p className="text-sm font-medium text-gray-700">{profileData?.name || "User"}</p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="focus:outline-none transform transition-transform duration-200 hover:scale-105"
            >
              {profileData?.profilePicture ? (
                <img
                  src={profileData.profilePicture}
                  alt={profileData.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-md hover:ring-blue-400 transition-all duration-200"
                  onError={(e) => {
                    console.error("Error loading image URL:", profileData.profilePicture);
                    e.target.src = "https://via.placeholder.com/150?text=No+Image";
                  }}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold ring-2 ring-white shadow-md hover:ring-blue-400 transition-all duration-200">
                  {firstLetter}
                </div>
              )}
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-lg py-2 transform transition-all duration-200 border border-gray-100">
                {/* User Info Section */}
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-700">{profileData?.name || "User"}</p>
                  <p className="text-xs text-gray-500 mt-0.5">User Account</p>
                </div>
                
                {/* Menu Items */}
                <button
                  onClick={handleProfileClick}
                  className="flex items-center w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                >
                  <FaUserCog className="mr-3 text-gray-400" />
                  Profile Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                >
                  <FaSignOutAlt className="mr-3 text-red-400" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
