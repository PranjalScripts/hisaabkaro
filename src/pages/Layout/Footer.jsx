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
import { useTranslation } from 'react-i18next';
import AddBook from "../books/AddBook";
import { BookContext, UserContext } from "./Layout";

const Footer = () => {
  const navigate = useNavigate();
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const { handleBookAdded: handleBookAddedContext } = useContext(BookContext);
  const { handleAddUser } = useContext(UserContext);
  const { t } = useTranslation();

  const handleClick = () => {
    navigate("/book");
  };

  const handleUser = () => {
    navigate("/users");
  };
  const handleHome = () => {
    navigate("/home");
  };

  const handleBookAdded = (book) => {
    handleBookAddedContext(book);
    setShowAddBookModal(false);
  };

  return (
    <>
      <footer
        className="fixed bottom-0 bg-white/70 backdrop-blur-[2px]
        p-1 min-[768px]:p-1.5 min-[1024px]:p-2 min-[1200px]:p-3 border-t border-gray-200 z-[10] 
        hidden min-[640px]:block
        w-full min-[640px]:w-[calc(100%-230px)]
        left-[230px] overflow-x-auto"
      >
        <div className="flex items-center justify-center gap-1 min-[768px]:gap-1.5 min-[1024px]:gap-2 min-[1200px]:gap-4">
          {/* Transaction Direction Legend */}
          <button
            className="group flex items-center space-x-0.5 min-[768px]:space-x-1 min-[1024px]:space-x-1.5 min-[1200px]:space-x-2 
            bg-gradient-to-br from-red-500/90 via-red-600/90 to-rose-700/90 
            text-white font-medium py-0.5 px-1 
            min-[768px]:py-1 min-[768px]:px-1.5 
            min-[1024px]:py-1.5 min-[1024px]:px-2 
            min-[1200px]:py-2 min-[1200px]:px-4
            rounded min-[768px]:rounded-md min-[1024px]:rounded-lg shadow 
            hover:shadow-red-500/25 hover:translate-y-[-1px] active:translate-y-[0px]
            focus:outline-none focus:ring-1 focus:ring-red-500/50 focus:ring-offset-1 
            transition-all duration-200 text-[10px] min-[768px]:text-xs min-[1024px]:text-sm min-[1200px]:text-base"
            onClick={handleHome}
          >
            <div className="p-0.5 min-[768px]:p-0.5 min-[1024px]:p-1 min-[1200px]:p-1.5 bg-white/10 rounded group-hover:bg-white/20 transition-colors">
              <FaChartBar className="w-2.5 h-2.5 min-[768px]:w-2.5 min-[768px]:h-2.5 min-[1024px]:w-3 min-[1024px]:h-3 min-[1200px]:w-4 min-[1200px]:h-4" />
            </div>
            <span>{t('dashboard.statistics')}</span>
          </button>

          <div className="hidden min-[1024px]:flex flex-col text-[10px] min-[768px]:text-xs min-[1024px]:text-sm text-gray-600">
            <div className="flex items-center space-x-0.5 min-[768px]:space-x-1 min-[1024px]:space-x-1.5 min-[1200px]:space-x-2">
              <div className="p-0.5 min-[768px]:p-0.5 min-[1024px]:p-1 min-[1200px]:p-1.5 bg-green-100 rounded">
                <FaArrowRight className="w-2 h-2 min-[768px]:w-2.5 min-[768px]:h-2.5 min-[1024px]:w-3 min-[1024px]:h-3 min-[1200px]:w-3.5 min-[1200px]:h-3.5 text-green-600" />
              </div>
              <span>{t('transactions.youInitiated')}</span>
            </div>
            <div className="flex items-center space-x-0.5 min-[768px]:space-x-1 min-[1024px]:space-x-1.5 min-[1200px]:space-x-2">
              <div className="p-0.5 min-[768px]:p-0.5 min-[1024px]:p-1 min-[1200px]:p-1.5 bg-blue-100 rounded">
                <FaArrowLeft className="w-2 h-2 min-[768px]:w-2.5 min-[768px]:h-2.5 min-[1024px]:w-3 min-[1024px]:h-3 min-[1200px]:w-3.5 min-[1200px]:h-3.5 text-blue-600" />
              </div>
              <span>{t('transactions.initiatedByOthers')}</span>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-1 min-[768px]:gap-1.5 min-[1024px]:gap-2 min-[1200px]:gap-4">
            <button
              onClick={() => setShowAddBookModal(true)}
              className="flex items-center space-x-0.5 min-[768px]:space-x-1 min-[1024px]:space-x-1.5 min-[1200px]:space-x-2 
              bg-gradient-to-r from-blue-500/90 to-indigo-600/90 
              text-white font-medium py-0.5 px-1 
              min-[768px]:py-1 min-[768px]:px-1.5 
              min-[1024px]:py-1.5 min-[1024px]:px-2 
              min-[1200px]:py-2 min-[1200px]:px-4
              rounded min-[768px]:rounded-md min-[1024px]:rounded-lg shadow 
              hover:shadow-blue-500/25 hover:translate-y-[-1px] active:translate-y-[0px]
              focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:ring-offset-1 
              transition-all duration-200 text-[10px] min-[768px]:text-xs min-[1024px]:text-sm min-[1200px]:text-base"
            >
              <div className="p-0.5 min-[768px]:p-0.5 min-[1024px]:p-1 min-[1200px]:p-1.5 bg-white/10 rounded group-hover:bg-white/20 transition-colors">
                <FaBook className="w-2.5 h-2.5 min-[768px]:w-2.5 min-[768px]:h-2.5 min-[1024px]:w-3 min-[1024px]:h-3 min-[1200px]:w-4 min-[1200px]:h-4" />
              </div>
              <span>{t('books.addBook')}</span>
            </button>

            <button
              className="group flex items-center space-x-0.5 min-[768px]:space-x-1 min-[1024px]:space-x-1.5 min-[1200px]:space-x-2 
              bg-gradient-to-r from-blue-500/90 to-indigo-600/90 
              text-white font-medium py-0.5 px-1 
              min-[768px]:py-1 min-[768px]:px-1.5 
              min-[1024px]:py-1.5 min-[1024px]:px-2 
              min-[1200px]:py-2 min-[1200px]:px-4
              rounded min-[768px]:rounded-md min-[1024px]:rounded-lg shadow 
              hover:shadow-blue-500/25 hover:translate-y-[-1px] active:translate-y-[0px]
              focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:ring-offset-1 
              transition-all duration-200 text-[10px] min-[768px]:text-xs min-[1024px]:text-sm min-[1200px]:text-base"
              onClick={handleClick}
            >
              <div className="p-0.5 min-[768px]:p-0.5 min-[1024px]:p-1 min-[1200px]:p-1.5 bg-white/10 rounded group-hover:bg-white/20 transition-colors">
                <FaBook className="w-2.5 h-2.5 min-[768px]:w-2.5 min-[768px]:h-2.5 min-[1024px]:w-3 min-[1024px]:h-3 min-[1200px]:w-4 min-[1200px]:h-4" />
              </div>
              <span>{t('navigation.books')}</span>
            </button>

            <button
              className="group flex items-center space-x-0.5 min-[768px]:space-x-1 min-[1024px]:space-x-1.5 min-[1200px]:space-x-2 
              bg-gradient-to-r from-blue-500/90 to-indigo-600/90 
              text-white font-medium py-0.5 px-1 
              min-[768px]:py-1 min-[768px]:px-1.5 
              min-[1024px]:py-1.5 min-[1024px]:px-2 
              min-[1200px]:py-2 min-[1200px]:px-4
              rounded min-[768px]:rounded-md min-[1024px]:rounded-lg shadow 
              hover:shadow-blue-500/25 hover:translate-y-[-1px] active:translate-y-[0px]
              focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:ring-offset-1 
              transition-all duration-200 text-[10px] min-[768px]:text-xs min-[1024px]:text-sm min-[1200px]:text-base"
              onClick={handleUser}
            >
              <div className="p-0.5 min-[768px]:p-0.5 min-[1024px]:p-1 min-[1200px]:p-1.5 bg-white/10 rounded group-hover:bg-white/20 transition-colors">
                <FaUsers className="w-2.5 h-2.5 min-[768px]:w-2.5 min-[768px]:h-2.5 min-[1024px]:w-3 min-[1024px]:h-3 min-[1200px]:w-4 min-[1200px]:h-4" />
              </div>
              <span>{t('navigation.users')}</span>
            </button>

            <button
              className="group flex items-center space-x-0.5 min-[768px]:space-x-1 min-[1024px]:space-x-1.5 min-[1200px]:space-x-2 
              bg-gradient-to-r from-blue-500/90 to-indigo-600/90 
              text-white font-medium py-0.5 px-1 
              min-[768px]:py-1 min-[768px]:px-1.5 
              min-[1024px]:py-1.5 min-[1024px]:px-2 
              min-[1200px]:py-2 min-[1200px]:px-4
              rounded min-[768px]:rounded-md min-[1024px]:rounded-lg shadow 
              hover:shadow-blue-500/25 hover:translate-y-[-1px] active:translate-y-[0px]
              focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:ring-offset-1 
              transition-all duration-200 text-[10px] min-[768px]:text-xs min-[1024px]:text-sm min-[1200px]:text-base"
              onClick={handleAddUser}
            >
              <div className="p-0.5 min-[768px]:p-0.5 min-[1024px]:p-1 min-[1200px]:p-1.5 bg-white/10 rounded group-hover:bg-white/20 transition-colors">
                <FaUserPlus className="w-2.5 h-2.5 min-[768px]:w-2.5 min-[768px]:h-2.5 min-[1024px]:w-3 min-[1024px]:h-3 min-[1200px]:w-4 min-[1200px]:h-4" />
              </div>
              <span>{t('common.add')} {t('navigation.users')}</span>
            </button>
          </div>
        </div>
      </footer>

      {showAddBookModal && (
        <AddBook
          onBookAdded={handleBookAdded}
          onClose={() => setShowAddBookModal(false)}
        />
      )}
    </>
  );
};

export default Footer;
