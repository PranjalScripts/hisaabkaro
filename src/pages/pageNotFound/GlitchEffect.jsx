import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function GlitchEffect({ children }) {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div className="relative">
      <motion.div
        animate={{
          x: isGlitching ? [-2, 2, -2, 0] : 0,
          opacity: isGlitching ? [1, 0.8, 1] : 1,
        }}
        transition={{ duration: 0.2 }}
        className="relative"
      >
        {children}
      </motion.div>
      {isGlitching && (
        <>
          <motion.div
            className="absolute inset-0 text-cyan-500"
            animate={{ x: [-2, 2, -2, 0] }}
            transition={{ duration: 0.2 }}
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)" }}
          >
            {children}
          </motion.div>
          <motion.div
            className="absolute inset-0 text-red-500"
            animate={{ x: [2, -2, 2, 0] }}
            transition={{ duration: 0.2 }}
            style={{ clipPath: "polygon(0 45%, 100% 45%, 100% 100%, 0 100%)" }}
          >
            {children}
          </motion.div>
        </>
      )}
    </div>
  );
}
