import React from 'react';
import { motion } from 'framer-motion';

const ProfileCard = ({ userProfile }) => {
  return (
    <div className="text-center mb-8">
      <div className="relative inline-block">
        <motion.div
          className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-xl mb-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={userProfile.profilePicture || "https://via.placeholder.com/150?text=No+Image"}
            alt={userProfile.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.log("Failed to load image:", e.target.src);
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/150?text=No+Image";
            }}
          />
        </motion.div>
        <motion.div
          className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>
      </div>
      <motion.h2
        className="text-2xl font-bold text-white mb-2"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {userProfile.name}
      </motion.h2>
      <motion.p
        className="text-white/80"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {userProfile.email}
      </motion.p>
    </div>
  );
};

export default ProfileCard;
