import React from "react";
import { motion } from "framer-motion";
  const Screen = () => (
  <div className="display_div">
    <div className="screen_out">
      <div className="screen_out1">
        <motion.div
          className="screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.8, 1] }}
          transition={{
            duration: 2,
            times: [0, 0.5, 0.75, 1],
            repeat: Infinity,
            repeatDelay: 3,
          }}
        >
          <motion.span
            className="notfound_text"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.3,
            }}
          >
            NOT FOUND
          </motion.span>
        </motion.div>
      </div>
    </div>
  </div>
);

export default Screen;