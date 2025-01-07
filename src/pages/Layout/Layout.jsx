import React, { useState, createContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./sidebar";
import Footer from "./Footer";
import AddUser from "../clientUsers/AddUser";
import SuccessModal from "../../components/SuccessModal";
import FooterSide from "./FooterSide";
export const BookContext = createContext();
export const UserContext = createContext();

const Layout = () => {
  const location = useLocation();
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [bookAdded, setBookAdded] = useState(false);
  const [userAdded, setUserAdded] = useState(false);
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    message: "",
  });

  const handleAddUser = () => {
    setShowAddUserModal((prev) => !prev);
  };

  const handleBookAdded = () => {
    setBookAdded((prev) => !prev);
  };

  const handleUserAdded = (user) => {
    setUserAdded((prev) => !prev);
    setSuccessModal({ isOpen: true, message: "User added successfully!" });
    setTimeout(() => {
      setSuccessModal({ isOpen: false, message: "" });
    }, 2000);
    setShowAddUserModal(false); // Close the modal after successful addition
  };

  return (
    <BookContext.Provider value={{ bookAdded, handleBookAdded }}>
      <UserContext.Provider
        value={{ showAddUserModal, handleAddUser, userAdded, handleUserAdded }}
      >
        <div className="flex flex-row gap-2">
          <div className="ml-56 md:block hidden">
            <Sidebar />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <div className="mb-16">
              <Header />
            </div>
            <div className="pb-16">
              <Outlet />
            </div>
            <div className="md:hidden block" >
              <FooterSide />
            </div>
            <div className="md:block hidden">
              <Footer />
            </div>
          </div>
        </div>

        {showAddUserModal && (
          <AddUser
            onUserAdded={handleUserAdded}
            onClose={() => setShowAddUserModal(false)}
          />
        )}

        <SuccessModal
          isOpen={successModal.isOpen}
          message={successModal.message}
          onClose={() => setSuccessModal({ isOpen: false, message: "" })}
        />
      </UserContext.Provider>
    </BookContext.Provider>
  );
};

export default Layout;
