import React from "react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../context/ProfileContext";
import { FaCog, FaBell, FaUserCog, FaSignOutAlt, FaBars } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

export default function Header() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { profileData } = useProfile();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const { t } = useTranslation();

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
    <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 px-4 md:px-8 py-3 z-[10] shadow-sm">
      <div className="flex items-center justify-between max-w-[1920px] mx-auto">
        {/* Logo/Brand - Visible on mobile */}
        <div className="flex items-center gap-2">
          <button className="md:hidden mr-2 text-gray-500">
            <FaBars className="text-xl" />
          </button>
          <div className="flex items-center gap-2">
            <img
              src={`${process.env.PUBLIC_URL}/Favicon Hisaabkaro.png`}
              alt="Logo"
              className="h-7 md:h-8"
            />
            <span className="text-lg md:text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-900">
              Hisaab करो!
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Settings - Hidden on mobile */}
          <button 
            className="hidden md:block p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            title={t('common.settings')}
          >
            <FaCog className="text-xl" />
          </button>

          {/* Notifications */}
          <button 
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            title={t('common.notifications')}
          >
            <FaBell className="text-xl" />
          </button>

          {/* Profile Section */}
          <div className="flex items-center md:gap-3 md:pl-4 md:border-l md:border-gray-200" ref={profileMenuRef}>
            <div className="hidden md:flex flex-col items-end">
              <p className="text-sm font-medium text-gray-700">{profileData?.name || t('common.user')}</p>
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
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover ring-2 ring-white shadow-md hover:ring-blue-400 transition-all duration-200"
                    onError={(e) => {
                      console.error("Error loading image URL:", profileData.profilePicture);
                      e.target.src = "https://via.placeholder.com/150?text=No+Image";
                    }}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold ring-2 ring-white shadow-md hover:ring-blue-400 transition-all duration-200">
                    {firstLetter}
                  </div>
                )}
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100">
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <FaUserCog className="mr-3" />
                    {t('common.profile')}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <FaSignOutAlt className="mr-3" />
                    {t('common.logout')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
