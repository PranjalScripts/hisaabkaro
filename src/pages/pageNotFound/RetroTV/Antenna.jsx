import React from "react";
import { motion } from "framer-motion";

const Antenna = () => (
  <motion.div
    className="antenna"
    initial={{ rotate: -5 }}
    animate={{ rotate: 5 }}
    transition={{
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    }}
  >
    <div className="antenna_shadow" />
    <div className="a1" />
    <div className="a1d" />
    <div className="a2" />
    <div className="a2d" />
    <div className="a_base" />
  </motion.div>
);

export default Antenna;
