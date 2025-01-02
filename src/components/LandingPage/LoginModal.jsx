import React, { useState, useEffect, useRef } from "react";
import { FaEyeSlash, FaEye, FaTimes } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc"; 
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Signup from "../auth/login/signup";

const LoginModal = ({ showLoginModal, setShowLoginModal }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const modalRef = useRef(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  const handleGoogleLogin = async () => {
    try {
      const baseUrl = process.env.REACT_APP_URL;
      if (!baseUrl) {
        console.error('REACT_APP_URL is not defined');
        toast.error('Configuration error. Please try again later.');
        return;
      }
      
      // Redirect directly to the backend's Google auth endpoint
      window.location.href = `${baseUrl}/auth/google`;
    } catch (error) {
      console.error('Error initiating Google login:', error);
      toast.error('Failed to initiate Google login');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();  

    if (!emailRegex.test(identifier) && !phoneRegex.test(identifier)) {
      toast.warn("Please enter a valid email or 10-digit phone number.");
      return;
    }

    const loginPayload = emailRegex.test(identifier)
      ? { email: identifier, password }
      : { phone: identifier, password };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL}/api/v1/auth/login`,
        loginPayload
      );
      const { user, token } = response.data;

      if (user && token) {
        login({ ...user, token }); 
        toast.success("Login successful");
        setShowLoginModal(false);
        navigate("/home"); 
      } else {
        toast.error("Invalid response. Please try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const handleShowSignup = (e) => {
    e.preventDefault();
    setShowSignupModal(true);
    setShowLoginModal(false);
  };

  useEffect(() => {
    const handleOutsideOrEscape = (event) => {
      if (event.key === "Escape" || (event.type === "mousedown" && modalRef.current && !modalRef.current.contains(event.target))) {
        setShowLoginModal(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideOrEscape);
    document.addEventListener("keydown", handleOutsideOrEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideOrEscape);
      document.removeEventListener("keydown", handleOutsideOrEscape);
    };
  }, [setShowLoginModal]);

  if (!showLoginModal && !showSignupModal) return null;

  return (
    <>
      {showLoginModal && (
        <div>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              ref={modalRef}
              className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full relative"
            >
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowLoginModal(false)}
              >
                <FaTimes />
              </button>
              <h2 className="text-center text-xl font-bold text-gray-800 mb-4">
                Login
              </h2>
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Email or Phone
                  </label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter email or phone"
                  />
                </div>
                <div className="mb-4 relative">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 mt-[8%]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-md shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                >
                  Login
                </button>

                {/* Google Sign In Button */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 transition duration-300"
                >
                  <FcGoogle size={20} />
                  Sign in with Google
                </button>

                <p className="text-center mt-4 text-sm text-gray-600">
                  Don't have an account?{" "}
                  <button 
                    onClick={handleShowSignup}
                    className="text-blue-600 hover:underline"
                  >
                    Signup here
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <div className="fixed inset-0 z-50" onClick={(e) => e.stopPropagation()}>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
                onClick={() => {
                  setShowSignupModal(false);
                  setShowLoginModal(true);
                }}
              >
                <FaTimes size={20} />
              </button>
              <Signup 
                isModal={true} 
                onClose={() => {
                  setShowSignupModal(false);
                  setShowLoginModal(true);
                }} 
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginModal;
