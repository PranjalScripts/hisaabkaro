import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBook,
  FaUsers,
  FaArrowRight,
  FaArrowLeft,
  FaUserPlus,
  FaChartBar,
} from "react-icons/fa";
import AddBook from "../books/AddBook";
import { BookContext, UserContext } from "./Layout";

const Footer = () => {
  const navigate = useNavigate();
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const { handleBookAdded } = useContext(BookContext);
  const { handleAddUser } = useContext(UserContext);

  const handleClick = () => {
    navigate("/book");
  };

  const handleUser = () => {
    navigate("/users");
  };
  const handleHome = () => {
    navigate("/home");
  };
  return (
    <>
      <footer
        className="fixed bottom-0   bg-white/70 backdrop-blur-[2px]
      p-3 md:p-4 border-t border-gray-200 z-[10]"
        style={{ width: "calc(100% - 260px)" }}
      >
        <div className="flex items-center justify-center space-x-8 md:space-x-12 -ml-24">
          {/* Transaction Direction Legend */}
          <button
            className="group flex items-center space-x-2 bg-gradient-to-br from-red-500/90 via-red-600/90 to-rose-700/90 
  text-white font-medium py-2 px-4 md:py-2.5 md:px-5 rounded-lg shadow-lg 
  hover:shadow-red-500/25 hover:translate-y-[-1px] active:translate-y-[0px]
  focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 
  transition-all duration-200 text-sm md:text-base"
            onClick={handleHome}
          >
            <div className="p-1.5 bg-white/10 rounded-md group-hover:bg-white/20 transition-colors">
              <FaChartBar className="w-4 h-4" />
            </div>
            <span>Charts</span>
          </button>

          <div className="flex flex-col  text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-green-100 rounded-md">
                <FaArrowRight className="w-3.5 h-3.5 text-green-600" />
              </div>
              <span>You initiated</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-blue-100 rounded-md">
                <FaArrowLeft className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <span>Initiated by others</span>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-3 md:space-x-4">
            <button
              onClick={() => setShowAddBookModal(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500/90 to-indigo-600/90 
              text-white font-medium py-2 px-4 md:py-2.5 md:px-5 rounded-lg shadow-lg 
              hover:shadow-blue-500/25 hover:translate-y-[-1px] active:translate-y-[0px]
              focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 
              transition-all duration-200 text-sm md:text-base"
            >
              <div className="p-1.5 bg-white/10 rounded-md group-hover:bg-white/20 transition-colors">
                <FaBook className="w-4 h-4" />
              </div>
              <span>Add Book</span>
            </button>

            <button
              className="group flex items-center space-x-2 bg-gradient-to-r from-blue-500/90 to-indigo-600/90 
              text-white font-medium py-2 px-4 md:py-2.5 md:px-5 rounded-lg shadow-lg 
              hover:shadow-blue-500/25 hover:translate-y-[-1px] active:translate-y-[0px]
              focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 
              transition-all duration-200 text-sm md:text-base"
              onClick={handleClick}
            >
              <div className="p-1.5 bg-white/10 rounded-md group-hover:bg-white/20 transition-colors">
                <FaBook className="w-4 h-4" />
              </div>
              <span>All Books</span>
            </button>

            <button
              className="group flex items-center space-x-2 bg-gradient-to-r from-blue-500/90 to-indigo-600/90 
              text-white font-medium py-2 px-4 md:py-2.5 md:px-5 rounded-lg shadow-lg 
              hover:shadow-blue-500/25 hover:translate-y-[-1px] active:translate-y-[0px]
              focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 
              transition-all duration-200 text-sm md:text-base"
              onClick={handleUser}
            >
              <div className="p-1.5 bg-white/10 rounded-md group-hover:bg-white/20 transition-colors">
                <FaUsers className="w-4 h-4" />
              </div>
              <span>All Users</span>
            </button>

            <button
              className="group flex items-center space-x-2 bg-gradient-to-r from-blue-500/90 to-indigo-600/90 
              text-white font-medium py-2 px-4 md:py-2.5 md:px-5 rounded-lg shadow-lg 
              hover:shadow-blue-500/25 hover:translate-y-[-1px] active:translate-y-[0px]
              focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 
              transition-all duration-200 text-sm md:text-base"
              onClick={handleAddUser}
            >
              <div className="p-1.5 bg-white/10 rounded-md group-hover:bg-white/20 transition-colors">
                <FaUserPlus className="w-4 h-4" />
              </div>
              <span>Add User</span>
            </button>
          </div>
        </div>
      </footer>

      {showAddBookModal && (
        <AddBook
          onBookAdded={() => handleBookAdded()}
          onClose={() => setShowAddBookModal(false)}
        />
      )}
    </>
  );
};

export default Footer;
