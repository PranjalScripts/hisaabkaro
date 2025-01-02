import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export function TestimonialCard({ testimonial }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300"
    >
      <div className="absolute -top-4 -right-4 bg-indigo-500 rounded-full p-3 shadow-lg">
        <Quote className="w-5 h-5 text-white" />
      </div>
      
      <div className="flex items-center">
        <div className="relative">
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="h-14 w-14 rounded-full object-cover ring-4 ring-indigo-50"
          />
          <motion.div
            className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          />
        </div>
        <div className="ml-4">
          <p className="text-lg font-semibold text-gray-900">{testimonial.name}</p>
          <p className="text-sm text-gray-600">{testimonial.role}</p>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-6"
      >
        <p className="text-gray-600 leading-relaxed italic">"{testimonial.content}"</p>
      </motion.div>
      
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-b-2xl"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3 }}
      />
    </motion.div>
  );
}
