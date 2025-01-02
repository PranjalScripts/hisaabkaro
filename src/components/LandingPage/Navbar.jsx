import React, { useState } from "react";

const Navbar = ({ setShowLoginModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev); // Toggle menu open/close state
  };

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
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16" // Three-line icon (hamburger menu)
            />
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-6">
          <a href="#features" className="text-gray-700 hover:text-blue-500">
            Features
          </a>
          <a href="#pricing" className="text-gray-700 hover:text-blue-500">
            Pricing
          </a>
          <a href="#testimonials" className="text-gray-700 hover:text-blue-500">
            Testimonials
          </a>
          <button
            onClick={() => setShowLoginModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-md transition-all">
            <div className="flex flex-col items-start p-4 space-y-4">
              <a
                href="#features"
                className="text-gray-700 hover:text-blue-500 block w-full text-left"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-gray-700 hover:text-blue-500 block w-full text-left"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="text-gray-700 hover:text-blue-500 block w-full text-left"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </a>
              <button
                onClick={() => {
                  setShowLoginModal(true);
                  setIsMenuOpen(false);
                }}
                className=" px-4 py-2 right-0 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-left"
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
