import React from 'react';
import { Link } from 'react-router-dom';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Company Overview */}
          <div>
            <div className="flex items-center mb-4">
              <span className="text-white font-bold text-lg">
                <Link to="/" className="flex items-center">
                  <img
                    src="HisaabKaro2 white.png"
                    alt="HisaabKaro"
                    className="h-8"
                  />
                </Link>
              </span>
            </div>
            <p className="text-gray-400">
              Making expense management effortless for modern businesses.
            </p>
            <address className="not-italic text-sm space-y-1 mt-4">
              <p>88, Sant Nagar, Near India Post Office</p>
              <p>East of Kailash, New Delhi 110065, INDIA</p>
              <p>+91 9015-6627-28</p>
              <p>+91 9675-9675-09</p>
            </address>
          </div>
          {/* Product Links */}
          <div>
            <h5 className="text-white font-semibold mb-3">Product</h5>
            <ul className="space-y-2">
              <li>
                <Link to="/features" className="hover:text-white">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-white">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          {/* Company Links */}
          <div>
            <h5 className="text-white font-semibold mb-3">Company</h5>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-white">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="hover:text-white">
                  Blogs
                </Link>
              </li>
            
              <li>
                <Link to="/contact" className="hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          {/* Legal Links */}
          <div>
            <h5 className="text-white font-semibold mb-3">Legal</h5>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
          {/* Google Map */}
          {/* <div className='-ml-24'>
            <h5 className="text-white font-semibold mb-3">Our Location</h5>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14012.996983776303!2d77.2395175!3d28.5535011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3a8f4b7d8f1%3A0x4b0f1e4b0f1e4b0f!2s88%2C%20Sant%20Nagar%2C%20East%20of%20Kailash%2C%20New%20Delhi%2C%20Delhi%20110065%2C%20India!5e0!3m2!1sen!2sus!4v1634567890123!5m2!1sen!2sus"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div> */}
          {/* Social Media Links */}
          <div className="mt-8">
            <h5 className="text-white font-semibold mb-3">Follow Us</h5>
            <div className="flex space-x-4">
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400">
                <YouTubeIcon fontSize="large" />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400">
                <InstagramIcon fontSize="large" />
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400">
                <TwitterIcon fontSize="large" />
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400">
                <LinkedInIcon fontSize="large" />
              </a>
            </div>
          </div>
        </div>
        {/* Footer Bottom */}
        <div className="text-center mt-6">
          <p className="text-gray-500"> &copy; 2024 HisaabKaro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
