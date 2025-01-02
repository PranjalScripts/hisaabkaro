import React from 'react';
import { ChevronRight } from "lucide-react";

const HeroSection = ({ setShowLoginModal }) => {
  return (
    <section className="py-20 mt-10 text-center bg-white">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800">
          Smart Expense Management <span className="text-blue-600">System</span>
        </h1>
        <p className="text-lg text-gray-600 mt-4">
          Transform your business expense tracking with insights, real-time
          reporting, and automated reconciliation.
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-blue-600 text-white font-medium py-2 px-6 rounded-md flex items-center hover:bg-blue-700"
          >
            Get Started <ChevronRight className="ml-2" />
          </button>
          <button className="border border-blue-600 text-blue-600 font-medium py-2 px-6 rounded-md hover:bg-blue-100">
            Watch Demo
          </button>
        </div>
        <img
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
          alt="Dashboard Preview"
          className="w-full max-w-4xl mx-auto mt-8 rounded-lg shadow-lg"
        />
      </div>
    </section>
  );
};

export default HeroSection;
