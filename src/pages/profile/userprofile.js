import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useProfile } from "../../context/ProfileContext";

// Import components
import ProfileHeader from "./components/ProfileHeader";
import ProfileStats from "./components/ProfileStats";
import ProfileTabs from "./components/ProfileTabs";
import ContactInformation from "./components/ContactInformation";
import UpdateProfileModal from "./components/UpdateProfileModal";
import ProfileCard from "./components/ProfileCard";

const GetUserProfile = () => {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();
  const { profileData: userProfile, loading } = useProfile();

  if (!localStorage.getItem("token")) {
    toast.warn("Please log in to access your profile");
    navigate("/login");
    return null;
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center"
      >
        <div className="p-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-500/30 rounded-full animate-pulse"></div>
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
              <div className="w-16 h-16 border-4 border-purple-500/30 rounded-full animate-pulse absolute top-0"></div>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Loading your profile
              </p>
              <p className="text-sm text-gray-500">Please wait a moment...</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const handleProfileUpdate = () => {
    // Refresh the profile data
    // Close the modal
    setShowModal(false); // Close the modal
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center py-12 px-4 relative"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl animate-slow-spin"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-[1000px] h-[1000px] bg-gradient-to-tr from-purple-100/30 to-blue-100/30 rounded-full blur-3xl animate-slow-spin-reverse"></div>
      </div>

      <motion.div
        className="w-full max-w-4xl mx-auto relative"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ProfileHeader
          title="Your Profile"
          subtitle="Manage your account information and settings"
        />

        {userProfile ? (
          <motion.div
            className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 relative group"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={tabVariants}
                transition={{ duration: 0.3 }}
              >
                {activeTab === "profile" && (
                  <div className="relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <div className="md:flex">
                      <div className="md:w-1/3 bg-gradient-to-br from-blue-600 to-purple-600 p-8 flex flex-col items-center justify-center relative overflow-hidden">
                        <ProfileCard 
                          userProfile={userProfile} 
                        />
                        <ProfileStats expenses="25,000" income="50,000" />
                      </div>

                      <div className="md:w-2/3 p-8 relative">
                        <div className="space-y-6">
                          <ContactInformation
                            email={userProfile.email}
                            phone={userProfile.phone}
                          />

                          <button
                            onClick={() => setShowModal(true)}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform relative group overflow-hidden"
                          >
                            <span className="relative z-10">Update Profile</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "security" && (
                  <div className="p-8">
                    <h3 className="text-xl font-semibold mb-4">
                      Security Settings
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium">Password Settings</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Change your password or set up password recovery
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "preferences" && (
                  <div className="p-8">
                    <h3 className="text-xl font-semibold mb-4">
                      User Preferences
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium">Notification Settings</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Manage your email and push notifications
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium">Language & Region</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Set your preferred language and regional settings
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="bg-red-100 p-2 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-red-800">
                  Unable to Load Profile
                </h3>
                <p className="text-red-700 mt-1">
                  Please try refreshing the page or contact support if the issue
                  persists.
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <UpdateProfileModal
            showModal={showModal}
            setShowModal={setShowModal}
            onUpdate={handleProfileUpdate}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GetUserProfile;
