import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const ProfileUpdate = ({ onClose, onUpdate }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warn("Please log in to access your profile");
      navigate("/login");
      return;
    }
    
    // Fetch user data when component mounts
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/api/v1/auth/get-profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Profile response:", response.data);
        const userData = response.data.user;
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          password: "",
        });

        // Extract the relative path from the full server path
        let profilePicUrl = null;
        if (userData.profilePicture) {
          const pathParts = userData.profilePicture.split('uploads');
          if (pathParts.length > 1) {
            const relativePath = pathParts[1].replace(/\\/g, '/');
            profilePicUrl = `${process.env.REACT_APP_URL}/uploads${relativePath}`;
          }
        }
        
        console.log("Profile picture URL:", profilePicUrl);
        setPreviewUrl(profilePicUrl);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error(error.response?.data?.message || "Failed to fetch profile data");
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File size should be less than 5MB");
        return;
      }
      console.log("Selected file:", file); // Debug log
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const userId = localStorage.getItem("userId");

    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();
      
      // Debug logs
      console.log("Form data before sending:", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        hasPassword: !!formData.password,
        hasProfilePicture: !!profilePicture
      });

      if (formData.name) formDataToSend.append("name", formData.name);
      if (formData.phone) formDataToSend.append("phone", formData.phone);
      if (formData.password) formDataToSend.append("password", formData.password);
      if (profilePicture) {
        console.log("Appending profile picture:", profilePicture.name);
        formDataToSend.append("profilePicture", profilePicture);
      }

      // Log FormData contents
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
      }

      const response = await axios.patch(
        `${process.env.REACT_APP_URL}/api/v1/auth/update-profile/${userId}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Update response:", response.data);
      toast.success("Profile updated successfully");
      if (onUpdate) {
        onUpdate();
      } else {
        onClose();
      }
    } catch (error) {
      console.error("Error updating profile:", error.response || error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full"
    >
      <div className="space-y-3">
        {/* Profile Picture Section */}
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-blue-100 mx-auto">
              <img
                src={previewUrl || "https://via.placeholder.com/150?text=No+Image"}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/150?text=No+Image";
                }}
              />
            </div>
            <label className="block mt-2">
              <span className="sr-only">Choose profile photo</span>
              <input
                type="file"
                name="profilePicture"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </label>
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-3" encType="multipart/form-data">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              title="Email cannot be updated"
            />
            <p className="mt-0.5 text-xs text-gray-500">Email address cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password (leave blank to keep current)
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter new password"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-1.5 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Updating...
                </span>
              ) : (
                "Update Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ProfileUpdate;
