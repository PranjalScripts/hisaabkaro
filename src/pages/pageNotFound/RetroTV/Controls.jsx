import React from "react";
import { motion } from "framer-motion";

const Controls = () => (
  <>
    <div className="lines">
      <div className="line1" />
      <div className="line2" />
      <div className="line3" />
    </div>
    <motion.div
      className="buttons_div"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <motion.div className="b1" whileTap={{ scale: 0.95 }}>
        <div />
      </motion.div>
      <motion.div className="b2" whileTap={{ scale: 0.95 }} />
      <div className="speakers">
        <div className="g1">
          <div className="g11" />
          <div className="g12" />
          <div className="g13" />
        </div>
        <div className="g" />
        <div className="g" />
      </div>
    </motion.div>
  </>
);

export default Controls;
