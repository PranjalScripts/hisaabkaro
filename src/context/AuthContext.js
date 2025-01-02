import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
}; 

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    
    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
    setLoading(false);
  }, []);

  const login = async (user) => {
    try {
      console.log("Login function triggered", user);
      
      // Store user data in localStorage
      localStorage.setItem("token", user.token);
      localStorage.setItem("username", user.name);
      localStorage.setItem("userId", user.id);
      if (user.profilePicture) {
        localStorage.setItem("profile", user.profilePicture);
      }

      // Update state
      setIsLoggedIn(true);
      setUsername(user.name);


      return true;
    } catch (error) {
      console.error("Error in login:", error);
      return false;
    }
  };

  const logout = () => {
    try {
      // Clear all stored data
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("userId");
      localStorage.removeItem("profile");
      
      // Reset state
      setIsLoggedIn(false);
      setUsername("");
    } catch (error) {
      console.error("Error in logout:", error);
    }
  };

  const value = {
    isLoggedIn,
    username,
    login,
    logout,
    loading
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
