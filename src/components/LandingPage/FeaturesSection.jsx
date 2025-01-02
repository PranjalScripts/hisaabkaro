import React from 'react';
import { Users2, Bell, Shield, Clock, SplitSquareVertical, HeadphonesIcon } from 'lucide-react';
import { FeatureCard } from './FeatureCard';
import { motion } from 'framer-motion';

const features = [
  {
    name: 'Easy Split',
    description: 'Split expenses fairly among friends with just a few taps.',
    icon: SplitSquareVertical,
    image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&q=80&w=400'
  },
  {
    name: 'Real-time Tracking',
    description: 'Monitor transactions and balances in real-time.',
    icon: Clock,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400'
  },
  {
    name: 'Secure Transactions',
    description: 'Your financial data is protected with bank-grade security.',
    icon: Shield,
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=400'
  },
  {
    name: 'Group Management',
    description: 'Create groups for different occasions and manage expenses together.',
    icon: Users2,
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=400'
  },
  {
    name: '24/7 Support',
    description: 'Get help anytime with our round-the-clock customer support team.',
    icon: HeadphonesIcon,
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=400'
  },
  {
    name: 'Real-time Notifications',
    description: 'Stay updated with instant notifications for all transactions and settlements.',
    icon: Bell,
    image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&q=80&w=400'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function FeaturesSection() {
  return (
    <div className="py-24 bg-gradient-to-b from-indigo-50 to-white" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
            Features
          </h2>
          <p className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Everything you need to manage expenses
          </p>
          <p className="max-w-3xl mt-5 mx-auto text-xl text-gray-500">
            Simplify your expense tracking and management with our comprehensive suite of features.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <FeatureCard key={feature.name} feature={feature} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
