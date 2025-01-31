import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../context/ProfileContext";  // Add this import
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Phone, Lock, X, ChevronDown, Search } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";

const LoginModal = ({ showLoginModal, setShowLoginModal, setShowSignupModal }) => {
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'phone'
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showCountryList, setShowCountryList] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  
  
  const { login } = useAuth();
  const { fetchProfileData } = useProfile();  // Add this line
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const countryListRef = useRef(null);
  const recaptchaRef = useRef(null);

  useEffect(() => {
    // Fetch and set countries data
    fetch('/country.js')
      .then(response => response.text())
      .then(text => {
        // Remove "const data =" and evaluate the array
        const countriesData = eval(text.replace('const data =', ''));
        setCountries(countriesData);
        // Set India as default country
        const india = countriesData.find(country => country.countryCode === 'IN');
        setSelectedCountry(india);
      })
      .catch(error => console.error('Error loading countries:', error));
  }, []);

  const filteredCountries = countries.filter(country => 
    country.countryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.callingCode.includes(searchQuery)
  );

  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowLoginModal(false);
      }
      if (countryListRef.current && !countryListRef.current.contains(event.target)) {
        setShowCountryList(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowLoginModal]);

  useEffect(() => {
    if (showLoginModal) {
      // Disable scroll when modal opens
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scroll when modal closes
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to re-enable scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showLoginModal]);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login attempt started");
    
    const identifier = loginMethod === 'email' ? email : phone;
    
    if (!identifier || !password) {
      toast.warn("Please fill in all fields");
      return;
    }

    if (!captchaToken) {
      toast.warn("Please complete the captcha verification");
      return;
    }

    let loginPayload;
    if (loginMethod === 'email') {
      loginPayload = { 
        email: identifier, 
        password,
        captchaToken 
      };
    } else {
      // Combine country code and phone number
      const formattedPhone = `${selectedCountry.callingCode}${identifier}`;
      loginPayload = { 
        phone: formattedPhone,
        password,
        country: selectedCountry.countryCode,
        captchaToken
      };
    }

    // console.log("Sending login request with payload:", loginPayload);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL}/api/v1/auth/login`,
        loginPayload
      );

      console.log("Login response:", response.data);
      
      if (response.data.success || response.data.user) {
        console.log("Login successful, storing user data");
        await login(response.data.user);
        
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        
        // Fetch profile data immediately after login
        await fetchProfileData();
        
        console.log("User logged in, closing modal");
        setShowLoginModal(false);
        
        console.log("Attempting navigation to /home");
        // Try different navigation approaches
        try {
          navigate('/home');
          console.log("Navigation completed");
        } catch (navError) {
          console.error("Navigation error:", navError);
          // Fallback navigation
          window.location.href = '/';
        }
        
        toast.success("Login successful!");
      } else {
        console.error("Login response missing success or user data");
        toast.error("Login failed - invalid response");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const baseUrl = process.env.REACT_APP_URL;
      if (!baseUrl) {
        console.error("REACT_APP_URL is not defined");
        toast.error("Configuration error. Please try again later.");
        return;
      }
      window.location.href = `${baseUrl}/auth/google`;
    } catch (error) {
      console.error("Error initiating Google login:", error);
      toast.error("Failed to initiate Google login");
    }
  };

  const handleShowSignup = (e) => {
    e.preventDefault();
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  if (!showLoginModal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", duration: 0.5 }}
          ref={modalRef}
          className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 relative"
        >
          {/* Close Button */}
          <button
            onClick={() => setShowLoginModal(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back!</h2>
            <p className="text-gray-600">Please sign in to continue</p>
          </div>

          {/* Login Method Toggle */}
          <div className="flex rounded-lg bg-gray-100 p-1 mb-4">
            <button
              type="button"
              onClick={() => setLoginMethod('email')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                loginMethod === 'email'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('phone')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                loginMethod === 'phone'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Phone
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email/Phone Input */}
            {loginMethod === 'email' ? (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            ) : (
              <div className="relative">
                <div className="flex">
                  {selectedCountry && (
                    <div className="relative">
                      <button
                        type="button"
                        className="h-full px-3 py-3 border border-r-0 border-gray-300 rounded-l-xl flex items-center space-x-2 hover:bg-gray-50 focus:outline-none"
                        onClick={() => setShowCountryList(!showCountryList)}
                      >
                        <img 
                          src={selectedCountry.flag} 
                          alt={selectedCountry.countryName} 
                          className="w-6 h-4 object-cover"
                        />
                        <span className="text-sm text-gray-600">{selectedCountry.callingCode}</span>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </button>
                      {showCountryList && (
                        <div
                          ref={countryListRef}
                          className="absolute z-10 mt-1 w-72 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                        >
                          <div className="p-2 border-b border-gray-200">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <input
                                type="text"
                                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Search country or code..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="overflow-y-auto max-h-48">
                            {filteredCountries.map((country) => (
                              <button
                                key={country.countryCode}
                                type="button"
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-3"
                                onClick={() => {
                                  setSelectedCountry(country);
                                  setShowCountryList(false);
                                  setSearchQuery("");
                                }}
                              >
                                <img 
                                  src={country.flag} 
                                  alt={country.countryName} 
                                  className="w-6 h-4 object-cover"
                                />
                                <span className="text-sm">{country.callingCode}</span>
                                <span className="text-sm text-gray-600">{country.countryName}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone number"
                      className="block w-full py-3 border border-gray-300 rounded-r-xl pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* reCAPTCHA */}
            <div className="flex justify-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.REACT_APP_RECAPTCHA}
                onChange={(token) => setCaptchaToken(token)}
                onExpired={() => setCaptchaToken(null)}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-medium rounded-xl hover:from-indigo-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-indigo-500/25"
            >
              Sign in
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3 px-4 bg-white border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Sign in with Google
            </button>

            {/* Sign Up Link */}
            <p className="mt-4 text-center text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={handleShowSignup}
                className="text-indigo-600 hover:text-indigo-500 font-medium focus:outline-none"
              >
                Sign up
              </button>
            </p>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LoginModal;
