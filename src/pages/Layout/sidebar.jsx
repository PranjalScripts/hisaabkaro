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

const Sidebar = () => {
  const { isLoggedIn, logout } = useAuth() || {};
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollabOpen, setCollabOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleCollabDropdown = () => {
    setCollabOpen(!isCollabOpen);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed left-0 h-screen w-64 bg-gradient-to-b from-slate-50 to-slate-100 shadow-2xl flex flex-col">
      {/* Logo Section with glass effect */}
      <div className="relative p-[1.19rem] bg-white bg-opacity-70 backdrop-blur-sm border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="  rounded-lg  ">
            <img
              src={`${process.env.PUBLIC_URL}/Favicon Hisaabkaro.png`}
              alt="fdfddf"
              className=" h-9"
            />
          </div>
          <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-900">
            Hisaab करो!
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        {[
          { path: "/dashboard", icon: FaTachometerAlt, label: "Dashboard" },
          {
            path: "/your-books",
            icon: FaFileInvoiceDollar,
            label: "Self Records",
          },
          { path: "/book", icon: FaBook, label: "Book" },
          { path: "/users", icon: FaUsers, label: "Client Users" },
          { path: "/loans", icon: FaHandHoldingUsd, label: "Loans" },
          { path: "/invoice", icon: FaReceipt, label: "Invoice" },
        ].map((item) => (
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
            <span className="ml-3 font-medium">Your Profile</span>
            {isActive("/profile") && (
              <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white shadow-md" />
            )}
          </Link>
        )}
      </nav>

      {/* Footer Section */}
      <div className="p-4 mx-3 mb-3">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-3 space-x-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] font-medium"
          >
            <FaSignOutAlt className="text-lg" />
            <span>Logout</span>
          </button>
        ) : (
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center w-full px-4 py-3 space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] font-medium"
          >
            <FaSignInAlt className="text-lg" />
            <span>Login</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
