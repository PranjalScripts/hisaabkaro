import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How does HisaabKaro help manage expenses?",
    answer:
      "HisaabKaro provides a comprehensive platform for tracking, splitting, and managing expenses. You can easily record transactions, split bills among friends or team members, and get real-time updates on your financial status.",
  },
  {
    question: "Is my financial data secure with HisaabKaro?",
    answer:
      "Yes, absolutely! We implement bank-grade security measures to protect your data. All transactions are encrypted, and we follow strict privacy protocols to ensure your financial information remains confidential.",
  },
  {
    question: "Can I use HisaabKaro for both personal and business expenses?",
    answer:
      "Yes! HisaabKaro is designed to handle both personal and business expenses. You can create separate groups for different purposes and manage them independently.",
  },
  {
    question: "How does the expense splitting feature work?",
    answer:
      "Our expense splitting feature allows you to divide costs among group members easily. You can split expenses equally or customize the split based on individual contributions. The app automatically calculates and tracks who owes what.",
  },
  {
    question: "Is there a mobile app available?",
    answer:
      "Yes, HisaabKaro is available on both iOS and Android platforms. You can download our mobile app to manage expenses on the go and sync your data across all devices.",
  },
  {
    question: "What kind of support do you offer?",
    answer:
      "We provide 24/7 customer support through multiple channels including email, chat, and phone. Our dedicated support team is always ready to help you with any questions or issues you might have.",
  },
];

const FAQItem = ({ faq, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="border-b border-gray-200 last:border-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left focus:outline-none"
      >
        <span className="text-lg font-medium text-gray-900">
          {faq.question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="pb-6 text-gray-600">{faq.answer}</p>
      </motion.div>
    </motion.div>
  );
};

export default function FAQSection() {
  return (
    <section
      className="py-24 bg-gradient-to-b from-indigo-50 to-white"
      id="faq"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
            FAQ
          </h2>
          <p className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
            Frequently Asked Questions
          </p>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Everything you need to know about HisaabKaro and how it can help you
            manage your expenses better.
          </p>
        </motion.div>

        <div className="space-y-0">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
