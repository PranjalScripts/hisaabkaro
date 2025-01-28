import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../context/ProfileContext";
import {
  FaCog,
  FaBell,
  FaUserCog,
  FaSignOutAlt,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import SearchTools from "../../Tools/SearchTools";

export default function Header() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { profileData } = useProfile();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const profileMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const { t } = useTranslation();

  // Handle clicks outside of menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
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
    navigate("/profile");
    setShowProfileMenu(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Add your dark mode implementation here
  };

  const firstLetter = profileData?.name?.charAt(0).toUpperCase() || "U";

  // Mock notifications - replace with real data
  const notifications = [
    {
      id: 1,
      title: "New Update",
      message: "System has been updated",
      time: "2 min ago",
    },
    {
      id: 2,
      title: "Welcome",
      message: "Welcome to the new interface",
      time: "1 hour ago",
    },
  ];

  return (
    <header className="fixed top-0 right-0 w-full md:w-[calc(100%-230px)] bg-white/95 backdrop-blur-sm border-b border-gray-100 z-[10]">
      <div className="px-3 md:px-6 py-[0.46rem] bg-[#f3f7fa] shadow-sm">
        <div className="flex items-center justify-between">
          {/* Search Section */}
          <div className="w-full max-w-[180px] sm:max-w-xs md:max-w-xl lg:max-w-2xl">
            <div className="relative flex items-center">
              <SearchTools placeholder="Search..." className="w-full pr-14" />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2 md:space-x-4 ml-2 md:ml-4">
            {/* Dark Mode Toggle - Hidden on mobile */}
            <button
              onClick={toggleDarkMode}
              className="hidden md:block p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              title={
                isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
              }
            >
              {isDarkMode ? (
                <FaSun className="text-xl" />
              ) : (
                <FaMoon className="text-xl" />
              )}
            </button>

            {/* Settings - Hidden on mobile */}
            <button
              className="hidden md:block p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              title={t("common.settings")}
            >
              <FaCog className="text-xl" />
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors duration-200 relative"
                title={t("common.notifications")}
              >
                <FaBell className="text-lg md:text-xl" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Notifications Dropdown */}
              <div
                className={`fixed md:absolute left-1/2 md:left-auto right-auto md:right-0 -translate-x-1/2 md:translate-x-0 top-16 md:top-full mt-1 w-[calc(100vw-2rem)] md:w-80 bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-200 ease-out transform origin-top ${
                  showNotifications
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}
              >
                <div className="p-3 md:p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-[60vh] md:max-h-[400px] overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-3 md:p-4 hover:bg-gray-50 border-b border-gray-100 cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-gray-900">
                          {notification.title}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Profile Section */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 hover:bg-gray-50 rounded-xl transition-all duration-200 p-1.5 md:p-2"
              >
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-700">
                    {profileData?.name || t("common.user")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {profileData?.email || ""}
                  </p>
                </div>
                {profileData?.profilePicture ? (
                  <img
                    src={profileData.profilePicture}
                    alt={profileData.name}
                    className="w-9 h-9 md:w-11 md:h-11 rounded-xl object-cover ring-2 ring-white shadow-md hover:ring-blue-400 transition-all duration-200"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/150?text=No+Image";
                    }}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold ring-2 ring-white shadow-md hover:ring-blue-400 transition-all duration-200">
                    {firstLetter}
                  </div>
                )}
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-60 md:w-72 bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">
                      {profileData?.name || t("common.user")}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {profileData?.email || ""}
                    </p>
                  </div>

                  <div className="py-2">
                    {/* Dark Mode Toggle - Visible only on mobile */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleDarkMode();
                        setShowProfileMenu(false);
                      }}
                      className="md:hidden w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                    >
                      {isDarkMode ? (
                        <FaSun className="text-gray-400" />
                      ) : (
                        <FaMoon className="text-gray-400" />
                      )}
                      <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
                    </button>

                    {/* Settings - Visible only on mobile */}
                    <button className="md:hidden w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                      <FaCog className="text-gray-400" />
                      <span>{t("common.settings")}</span>
                    </button>

                    <button
                      onClick={handleProfileClick}
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                    >
                      <FaUserCog className="text-gray-400" />
                      <span>{t("common.profile")}</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                    >
                      <FaSignOutAlt className="text-red-500" />
                      <span>{t("common.logout")}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
