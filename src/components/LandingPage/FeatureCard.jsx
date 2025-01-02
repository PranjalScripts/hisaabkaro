import React from 'react';
import { motion } from 'framer-motion';

export function FeatureCard({ feature }) {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative group"
    >
      <div className="h-full bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
        <div className="relative h-48 overflow-hidden">
          <img
            src={feature.image}
            alt={feature.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
        
        <div className="p-6 relative">
          <div className="absolute -top-8 left-6 p-3 bg-indigo-600 rounded-xl shadow-lg transform -translate-y-1/2 group-hover:-translate-y-2/3 transition-transform duration-300">
            <Icon className="w-6 h-6 text-white" />
          </div>
          
          <div className="pt-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {feature.name}
            </h3>
            <p className="text-gray-600">
              {feature.description}
            </p>
          </div>
          
          <div className="mt-4 flex items-center">
            <motion.div
              className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transform origin-left"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
