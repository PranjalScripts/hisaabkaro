import React, { useState, useEffect } from "react";
import { Menu, X } from 'lucide-react';

const Navbar = ({ setShowLoginModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Update active section based on scroll position
      const sections = ['features', 'testimonials', 'pricing'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      setActiveSection(current || '');
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'backdrop-blur-lg bg-white/80 shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <a href="/" className="flex items-center">
          <img
            src="Full Logo HisaabKaro.png"
            alt="pizeonflyfull"
            className="h-10 w-auto"
          />
        </a>

        {/* Desktop Navigation and Login */}
        <div className="hidden lg:flex items-center space-x-6">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.slice(1);
            return (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href.slice(1))}
                className={`text-sm font-medium transition-all duration-200 ${
                  isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-500'
                }`}
              >
                {item.name}
              </button>
            );
          })}
          <button
            onClick={() => setShowLoginModal(true)}
            className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-blue-700 hover:shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-gray-700" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700" />
          )}
        </button>

        {/* Mobile Menu */}
        <div 
          className={`lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md shadow-lg transition-all duration-300 transform ${
            isOpen 
              ? 'translate-y-0 opacity-100 visible' 
              : '-translate-y-full opacity-0 invisible'
          }`}
        >
          <div className="flex flex-col items-start p-6 space-y-4">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href.slice(1))}
                  className={`group relative w-full px-4 py-2 text-left transition-all duration-300 rounded-lg ${
                    isActive 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:text-blue-500 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{item.name}</span>
                  </div>
                </button>
              );
            })}
            <div className="w-full px-4 py-2">
              <button
                onClick={() => {
                  setShowLoginModal(true);
                  setIsOpen(false);
                }}
                className="px-6 py-1.5 rounded-lg transition-all duration-300 border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 hover:text-blue-700 font-medium"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
