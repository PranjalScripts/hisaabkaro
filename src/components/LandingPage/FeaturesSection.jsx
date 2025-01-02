import React from 'react';
import { BarChart3, Shield, Zap, Clock, Receipt, PieChart } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <BarChart3 className="text-blue-600" size={24} />,
      title: "Real-time Analytics",
      description:
        "Get instant insights into your spending patterns with powerful analytics tools.",
    },
    {
      icon: <Receipt className="text-blue-600" size={24} />,
      title: "Smart Receipt Scanning",
      description:
        "Automatically extract data from receipts using our advanced OCR technology.",
    },
    {
      icon: <PieChart className="text-blue-600" size={24} />,
      title: "Budget Tracking",
      description:
        "Set and monitor budgets with automatic alerts and spending forecasts.",
    },
    {
      icon: <Shield className="text-blue-600" size={24} />,
      title: "Secure & Compliant",
      description:
        "Bank-grade security with automatic backup and encryption.",
    },
    {
      icon: <Zap className="text-blue-600" size={24} />,
      title: "Automated Processing",
      description:
        "Save time with automated expense categorization and reporting.",
    },
    {
      icon: <Clock className="text-blue-600" size={24} />,
      title: "24/7 Support",
      description:
        "Round-the-clock support to help you manage your expenses better.",
    },
  ];

  return (
    <section className="py-10 bg-gray-100" id="features">
      <div className="container mx-auto text-center px-4">
        <h2 className="text-3xl font-bold mb-10">
          Everything you need to manage expenses
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 text-left"
            >
              <div className="mb-4">{feature.icon}</div>
              <h5 className="text-lg font-semibold mb-2">{feature.title}</h5>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
