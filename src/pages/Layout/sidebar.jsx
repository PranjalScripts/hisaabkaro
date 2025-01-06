import React, { useState } from "react";
import {
  FaTachometerAlt,
  FaFileAlt,
  FaUsers,
  FaSignOutAlt,
  FaSignInAlt,
  FaBook,
  FaIdCard,
  FaHandshake,
  FaHandHoldingUsd,
  FaReceipt,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from 'react-i18next';

const Sidebar = () => {
  const { isLoggedIn, logout } = useAuth() || {};
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollabOpen, setCollabOpen] = useState(false);
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleCollabDropdown = () => {
    setCollabOpen(!isCollabOpen);
  };

  const isActive = (path) => location.pathname === path;

  const navigationItems = [
    { path: "/dashboard", icon: FaTachometerAlt, label: t('navigation.dashboard') },
    { path: "/your-books", icon: FaFileInvoiceDollar, label: t('navigation.selfRecord') },
    { path: "/book", icon: FaBook, label: t('navigation.books') },
    { path: "/users", icon: FaUsers, label: t('navigation.users') },
    { path: "/loans", icon: FaHandHoldingUsd, label: t('navigation.loans') },
    { path: "/invoice", icon: FaReceipt, label: t('navigation.invoice') },
  ];

  return (
    <div className="fixed left-0 h-screen w-64 bg-gradient-to-b from-slate-50 to-slate-100 shadow-2xl flex flex-col">
      {/* Logo Section with glass effect */}
      <div className="relative p-[1.19rem] bg-white bg-opacity-70 backdrop-blur-sm border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="rounded-lg">
            <img
              src={`${process.env.PUBLIC_URL}/Favicon Hisaabkaro.png`}
              alt="Logo"
              className="h-9"
            />
          </div>
          <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-900">
            Hisaab करो!
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        {navigationItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`relative group flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive(item.path)
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "text-slate-600 hover:bg-white hover:shadow-md hover:scale-[1.02]"
            }`}
          >
            <item.icon
              className={`text-lg ${
                isActive(item.path)
                  ? "text-white"
                  : "text-blue-500 group-hover:text-blue-600"
              }`}
            />
            <span className="ml-3 font-medium">{item.label}</span>
            {isActive(item.path) && (
              <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white shadow-md" />
            )}
          </Link>
        ))}

        {isLoggedIn && (
          <Link
            to="/profile"
            className={`relative group flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive("/profile")
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "text-slate-600 hover:bg-white hover:shadow-md hover:scale-[1.02]"
            }`}
          >
            <FaIdCard
              className={`text-lg ${
                isActive("/profile")
                  ? "text-white"
                  : "text-blue-500 group-hover:text-blue-600"
              }`}
            />
            <span className="ml-3 font-medium">{t('common.profile')}</span>
            {isActive("/profile") && (
              <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white shadow-md" />
            )}
          </Link>
        )}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-slate-600 hover:bg-white hover:shadow-md rounded-xl transition-all duration-200 hover:scale-[1.02]"
        >
          <FaSignOutAlt className="text-lg text-blue-500" />
          <span className="ml-3 font-medium">{t('common.logout')}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
