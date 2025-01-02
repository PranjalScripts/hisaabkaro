import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Overview */}
          <div>
            <div className="flex items-center mb-4">
              <span className="text-white font-bold text-lg">
                <a href="/" className="flex items-center">
                  <img
                    src="HisaabKaro2 white.png"
                    alt="HisaabKaro"
                    className="h-8"
                  />
                </a>
              </span>
            </div>
            <p className="text-gray-400">
              Making expense management effortless for modern businesses.
            </p>
          </div>
          {/* Product Links */}
          <div>
            <h5 className="text-white font-semibold mb-3">Product</h5>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://pizeonfly.com/explore-our-digital-marketing-services-pizeonfly-in-delhi"
                  className="hover:text-white"
                >
                  Features
                </a>
              </li>
              <li>
                <a href="https://pizeonfly.com/" className="hover:text-white">
                  Enterprise
                </a>
              </li>
            </ul>
          </div>
          {/* Company Links */}
          <div>
            <h5 className="text-white font-semibold mb-3">Company</h5>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://pizeonfly.com/about-digital-marketing-agency-in-delhi-pizeonfly"
                  className="hover:text-white"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="https://pizeonfly.com/pizeonfly-blogs-expert-insights-trends-in-digital-marketing"
                  className="hover:text-white"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>
          {/* Legal Links */}
          <div>
            <h5 className="text-white font-semibold mb-3">Legal</h5>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://pizeonfly.com/privacy-policy"
                  className="hover:text-white"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="https://pizeonfly.com/terms-of-use"
                  className="hover:text-white"
                >
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* Footer Bottom */}
        <div className="text-center mt-6">
          <p className="text-gray-500">© 2024 Pizeonfly. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
