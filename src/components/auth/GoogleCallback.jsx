import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import {jwtDecode} from "jwt-decode";
import PhoneUpdateModal from "./PhoneUpdate/PhoneUpdateModal";

const GoogleCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");

        if (!token) {
          toast.error("Authentication failed - No token received");
          navigate("/login");
          return;
        }

        // Decode and validate the token
        const decodedToken = jwtDecode(token);

        if (!decodedToken.id || !decodedToken.email) {
          toast.error("Invalid authentication data received");
          navigate("/login");
          return;
        }

        // Create user object
        const user = {
          id: decodedToken.id,
          email: decodedToken.email,
          name: decodedToken.name,
          token: token,
          profilePicture: decodedToken.picture || null,
          phone: decodedToken.phone || null,
        };

        // Store token and user info
        localStorage.setItem("token", token);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("username", user.name);
        if (user.profilePicture) {
          localStorage.setItem("profile", user.profilePicture);
        }

        // Login the user
        await login(user);

        // Check if phone number exists
        if (!user.phone) {
          setShowPhoneModal(true);
        } else {
          navigate("/home");
        }
      } catch (error) {
        console.error("Error during Google callback:", error);
        toast.error("Failed to complete Google authentication");
        navigate("/login");
      }
    };

    handleCallback();
  }, [location, navigate, login]);

  const handleClosePhoneModal = () => {
    setShowPhoneModal(false);
    navigate("/home");
  };

  return (
    <div>
      {showPhoneModal && <PhoneUpdateModal onClose={handleClosePhoneModal} />}
      {!showPhoneModal && (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Completing authentication...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleCallback;
