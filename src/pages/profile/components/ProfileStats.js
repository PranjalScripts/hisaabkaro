import React from "react";
import { motion } from "framer-motion";

const ProfileStats = ({ expenses, income }) => {
  return (
    <motion.div
      className="mt-6 w-full grid grid-cols-2 gap-4 relative z-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
        <p className="text-white/90 text-sm">Total Expenses</p>
        <motion.p
          className="text-white font-bold text-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            delay: 0.6,
          }}
        >
          ₹{expenses}
        </motion.p>
      </div>
      <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
        <p className="text-white/90 text-sm">Total Income</p>
        <motion.p
          className="text-white font-bold text-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            delay: 0.7,
          }}
        >
          ₹{income}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default ProfileStats;
