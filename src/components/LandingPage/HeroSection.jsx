import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Users, Receipt, Shield } from "lucide-react";

export default function HeroSection({ setShowLoginModal }) {
  return (
    <div className="relative  overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-white pt-20 pb-16 sm:pb-24">
      <div className="absolute inset-y-0 w-full h-full">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div>

      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-50 mb-8"
            >
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-600">
                Simplify Your Finances
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
            >
              <span className="block">Smart Expense</span>
              <span className="block text-indigo-600">
                Management Made Easy
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-6 max-w-3xl mx-auto"
            >
              <p className="text-xl text-gray-500">
                Track, split, and manage expenses with friends and family
                effortlessly.
                <span className="block mt-2 text-indigo-600 font-medium">
                  Never let money come between relationships.
                </span>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 flex justify-center space-x-4"
            >
              <button
                onClick={() => setShowLoginModal(true)}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
              >
                Get Started Free
                <ArrowRight className="ml-2 -mr-1 w-5 h-5" />
              </button>
              <a
                href="#features"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200"
              >
                Learn More
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-12 grid grid-cols-3 gap-8 max-w-3xl mx-auto"
            >
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-4">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
                <p className="text-sm text-gray-600">Split Expenses Easily</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-4">
                  <Receipt className="w-6 h-6 text-indigo-600" />
                </div>
                <p className="text-sm text-gray-600">Track in Real-time</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mb-4">
                  <Shield className="w-6 h-6 text-indigo-600" />
                </div>
                <p className="text-sm text-gray-600">Secure & Private</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white pointer-events-none"
      />
    </div>
  );
}
