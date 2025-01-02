import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

export function RatingStars() {
  return (
    <div className="flex items-center justify-center mt-4 space-x-1">
      {[1, 2, 3, 4, 5].map((index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.3,
            delay: index * 0.1,
            type: "spring",
            stiffness: 200
          }}
        >
          <Star
            className="w-6 h-6 text-yellow-400 fill-current"
            strokeWidth={1.5}
          />
        </motion.div>
      ))}
      <motion.p
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="ml-2 text-gray-600 font-medium"
      >
        5.0 from 500+ reviews
      </motion.p>
    </div>
  );
}
