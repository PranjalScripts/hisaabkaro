import React, { useState } from "react";
import { Menu, X } from 'lucide-react';

const Navbar = ({ setShowLoginModal }) => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const navItems = [
    { name: 'Features', href: '#features' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Pricing', href: '#pricing' },
  ];

  return (
    <nav className="bg-white shadow fixed w-full z-10">
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        {/* Logo */}
        <a href="/" className="flex items-center">
          <img
            src="Full Logo HisaabKaro.png"
            alt="pizeonflyfull"
            className="h-10 w-auto"
          />
        </a>

        {/* Hamburger Menu Button for Small Screens */}
        <button
          className="lg:hidden text-gray-700 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-6">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => scrollToSection(item.href.slice(1))}
              className="text-gray-700 hover:text-blue-500"
            >
              {item.name}
            </button>
          ))}
          <button
            onClick={() => setShowLoginModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-md transition-all">
            <div className="flex flex-col items-start p-4 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href.slice(1))}
                  className="text-gray-700 hover:text-blue-500 block w-full text-left"
                >
                  {item.name}
                </button>
              ))}
              <button
                onClick={() => {
                  setShowLoginModal(true);
                  setIsOpen(false);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-left"
              >
                Login
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
