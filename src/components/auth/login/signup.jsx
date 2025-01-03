import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  EyeIcon, 
  EyeSlashIcon,
  UserIcon,
  EnvelopeIcon as MailIcon,
  LockClosedIcon,
  ChevronDownIcon,
  XMarkIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { FcGoogle } from 'react-icons/fc';
import { motion, AnimatePresence } from 'framer-motion';

const Signup = ({ showSignupModal, setShowSignupModal, onSignupSuccess }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    // Load countries data
    fetch('/country.js')
      .then(response => response.text())
      .then(text => {
        const countriesData = JSON.parse(text.replace('const data =', '').trim());
        setCountries(countriesData);
        // Set India as default
        const india = countriesData.find(country => country.countryCode === 'IN');
        setSelectedCountry(india);
      })
      .catch(error => {
        console.error('Error loading countries:', error);
        toast.error('Error loading country data');
      });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowSignupModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowSignupModal]);

  useEffect(() => {
    if (confirmPassword) {
      setPasswordMatch(password === confirmPassword);
    } else {
      setPasswordMatch(true);
    }
  }, [password, confirmPassword]);

  // Add useEffect to handle body scroll
  useEffect(() => {
    if (showSignupModal) {
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
  }, [showSignupModal]);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!selectedCountry) {
      toast.error('Please select a country code');
      return;
    }

    if (phone.length !== selectedCountry.numberLength) {
      toast.error(`Phone number must be ${selectedCountry.numberLength} digits for ${selectedCountry.countryName}`);
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', `${selectedCountry.callingCode}${phone}`);
    formData.append('password', password);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    try {
      console.log('Sending signup request...');
      const response = await axios.post(`${process.env.REACT_APP_URL}/api/v1/auth/signup`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Signup response:', response.data);

      // Show success toast
      toast.success('Account created successfully! 🎉', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Wait for toast to be visible
      setTimeout(() => {
        // Show login prompt
        toast.info('Login Modal is showing up', {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Call onSignupSuccess to handle modal transitions
        setTimeout(() => {
          onSignupSuccess();
        }, 1000);
      }, 1000);

    } catch (error) {
      console.error('Signup error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error creating account. Please try again.', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      window.location.href = `${process.env.REACT_APP_URL}/auth/google`;
    } catch (error) {
      toast.error('Error with Google signup');
    }
  };

  const handleLoginClick = () => {
    setShowSuccessModal(false);
    setShowSignupModal(false);
  };

  if (!showSignupModal && !showSuccessModal) return null;

  return (
    <AnimatePresence>
      {showSignupModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="flex min-h-screen items-center justify-center px-4 pt-2 pb-20 text-center sm:block sm:p-0">
            {/* Center modal vertically */}
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

            <motion.div
              ref={modalRef}
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="inline-block w-full max-w-md transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all sm:my-8 sm:align-middle"
            >
              {/* Modal content */}
              <div className="bg-white px-4 pt-2 pb-4 sm:p-6 sm:pb-4 relative">
                {/* Close button - now positioned absolutely relative to modal content */}
                <button
                  type="button"
                  onClick={() => setShowSignupModal(false)}
                  className="absolute right-4 top-2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-500 group-hover:text-gray-700" />
                </button>

                <div className="text-center sm:mt-0">
                  <h3 className="text-2xl font-semibold leading-6 text-gray-900 mb-4">
                    Create Account
                  </h3>
                  <form onSubmit={handleSignup} className="space-y-3">
                    {/* Profile Picture Upload */}
                    <div className="flex flex-col items-center space-y-1">
                      <div className="relative w-20 h-16 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                        {previewUrl ? (
                          <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <PhotoIcon className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        <label className="absolute inset-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                          <span className="text-white text-sm font-medium">Change</span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleProfilePictureChange}
                          />
                        </label>
                      </div>
                      <span className="text-sm text-gray-500">Upload profile picture</span>
                    </div>

                    {/* Full Name */}
                    <div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <UserIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Full Name"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MailIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Email Address"
                        />
                      </div>
                    </div>

                    {/* Phone with Country Code */}
                    <div>
                      <div className="flex">
                        <button
                          type="button"
                          onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                          className="flex items-center px-3 py-2 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-gray-700 hover:bg-gray-100"
                        >
                          {selectedCountry ? (
                            <>
                              <img
                                src={selectedCountry.flag}
                                alt={selectedCountry.countryName}
                                className="h-4 w-6 object-cover"
                              />
                              <span className="ml-2">{selectedCountry.callingCode}</span>
                              <ChevronDownIcon className="h-4 w-4 ml-1" />
                            </>
                          ) : (
                            <span>Select</span>
                          )}
                        </button>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (selectedCountry && value.length <= selectedCountry.numberLength) {
                              setPhone(value);
                            }
                          }}
                          required
                          className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Phone Number"
                        />
                      </div>
                      {showCountryDropdown && (
                        <div className="absolute z-10 mt-1 w-72 bg-white shadow-lg max-h-60 rounded-lg overflow-auto border border-gray-200">
                          {countries.map((country) => (
                            <button
                              key={country.countryCode}
                              type="button"
                              onClick={() => {
                                setSelectedCountry(country);
                                setShowCountryDropdown(false);
                                setPhone('');
                              }}
                              className="w-full flex items-center px-4 py-2 hover:bg-gray-50"
                            >
                              <img
                                src={country.flag}
                                alt={country.countryName}
                                className="h-4 w-6 object-cover"
                              />
                              <span className="ml-3">{country.countryName}</span>
                              <span className="ml-auto text-gray-500">{country.callingCode}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Password and Confirm Password in one row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Password */}
                      <div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LockClosedIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPassword ? (
                              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                            ) : (
                              <EyeIcon className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LockClosedIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className={`block w-full pl-10 pr-3 py-2 border ${!passwordMatch ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                            placeholder="Confirm Password"
                          />
                        </div>
                        {!passwordMatch && (
                          <p className="mt-1 text-sm text-red-500">
                            Passwords do not match
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="space-y-4 pt-2">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white transform transition-all duration-200 ease-in-out hover:scale-[1.02] hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 active:scale-[0.98] ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating Account...
                          </span>
                        ) : (
                          'Create Account'
                        )}
                      </button>

                      {/* Or continue with divider */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleGoogleSignup}
                        className="w-full inline-flex justify-center items-center space-x-2 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 transform transition-all duration-200 ease-in-out hover:scale-[1.02] hover:bg-gray-50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 active:scale-[0.98]"
                      >
                        <FcGoogle className="h-5 w-5" />
                        <span>Sign up with Google</span>
                      </button>
                    </div>

                    {/* Login Link */}
                    <p className="text-center text-sm text-gray-600">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setShowSignupModal(false)}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Log in
                      </button>
                    </p>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
      
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    {/* Success Icon */}
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Account Created Successfully!
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Your account has been created successfully. Click below to login and start using your account.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleLoginClick}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Login Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Signup;
