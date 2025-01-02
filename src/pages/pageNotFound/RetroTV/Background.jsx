import React from "react";
import { motion } from "framer-motion";

const textVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 0.05,
    y: 0,
    transition: {
      duration: 1,
      ease: "easeOut",
    },
  },
};

export const Background404 = () => (
  <motion.div
    className="absolute inset-0 flex items-center justify-center overflow-hidden select-none pointer-events-none"
    initial="hidden"
    animate="visible"
  >
    <motion.div
      className="text-[40rem] font-bold text-white"
      style={{ fontFamily: "system-ui" }}
      variants={textVariants}
    >
      404
    </motion.div>
  </motion.div>
);
