import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "../../.././pages/Layout/sidebar";
import { 
  EyeIcon, 
  EyeSlashIcon,
  UserIcon,
  EnvelopeIcon as MailIcon,
  LockClosedIcon,
  ChevronDownIcon 
} from '@heroicons/react/24/outline';
import { FcGoogle } from 'react-icons/fc'; // Import Google icon

const Signup = ({ isModal = false, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // For image preview
  const [fileError, setFileError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    // Load countries data
    const loadCountries = async () => {
      try {
        const response = await fetch('/country.js');
        const text = await response.text();
        // Extract the array from the text content
        const dataText = text.replace('const data =', '');
        const countriesData = JSON.parse(dataText);
        setCountries(countriesData);
        // Set India as default
        const india = countriesData.find(country => country.countryCode === 'IN');
        setSelectedCountry(india);
      } catch (error) {
        console.error('Error loading countries:', error);
        toast.error('Error loading country data');
      }
    };
    loadCountries();
  }, []);

  useEffect(() => {
    if (isModal) {
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isModal, onClose]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(email)) {
      toast.warn("Please enter a valid email address.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!selectedCountry) {
      toast.error("Please select a country");
      return;
    }

    if (phone.length !== selectedCountry.numberLength) {
      toast.error(`Phone number must be ${selectedCountry.numberLength} digits for ${selectedCountry.countryName}`);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", `${selectedCountry.callingCode}${phone}`);
      formData.append("password", password);
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      await axios.post(`${process.env.REACT_APP_URL}/api/v1/auth/signup`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Signup successful! You can now log in.");
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      setProfilePicture(null);
      setPreviewUrl(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    const maxFileSize = 5 * 1024 * 1024;

    if (file) {
      if (file.size > maxFileSize) {
        setFileError("File size is too large. Please upload a file smaller than 5MB.");
        setProfilePicture(null);
        setPreviewUrl(null);
      } else {
        setFileError("");
        setProfilePicture(file);
        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      window.location.href = `${process.env.REACT_APP_URL}/auth/google`;
    } catch (error) {
      toast.error("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className={`${isModal ? '' : 'flex min-h-screen'} bg-white`}>
      {!isModal && <Sidebar className="hidden lg:block" />}
      <div className="flex-1 flex items-center justify-center p-4">
        <div ref={modalRef} className="w-full max-w-lg bg-white rounded-xl shadow-sm p-4">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Create your account
            </h2>
            <p className="text-sm text-gray-500">Start managing your business finances today</p>
          </div>

          <form onSubmit={handleSignup} className="mt-4 space-y-3">
            {/* Profile Picture Upload */}
            <div className="flex flex-col sm:flex-row items-center gap-3 bg-gray-50 p-3 rounded-lg">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-white border-2 border-gray-200 shadow-inner">
                {previewUrl ? (
                  <img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <svg className="h-6 w-6 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8c0 2.208-1.79 4-3.998 4-2.208 0-3.998-1.792-3.998-4s1.79-4 3.998-4c2.208 0 3.998 1.792 3.998 4z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <label className="inline-flex items-center px-3 py-1.5 border-2 border-indigo-500 rounded-lg text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 transition-colors cursor-pointer">
                  <span>Upload profile photo</span>
                  <input
                    type="file"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
                {fileError && <p className="text-red-500 text-xs mt-1">{fileError}</p>}
                <p className="text-xs text-gray-500 mt-1">Maximum file size: 5MB</p>
              </div>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Name Input */}
              <div className="col-span-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="block w-full pl-10 px-3 py-2 border-2 border-gray-200 rounded-lg shadow-sm text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Full name"
                  />
                </div>
              </div>

              {/* Phone Input */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <div className="flex">
                  {/* Country Selector */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className="inline-flex items-center px-3 py-2 border-2 border-r-0 border-gray-200 rounded-l-lg bg-gray-50 text-gray-700 text-sm hover:bg-gray-100 transition-colors"
                    >
                      {selectedCountry ? (
                        < >
                          <img
                            src={selectedCountry.flag}
                            alt={selectedCountry.countryName}
                            className="h-4 w-6 object-cover mr-1"
                          />
                          <span>{selectedCountry.callingCode}</span>
                          <ChevronDownIcon className="h-4 w-4 ml-1" />
                        </>
                      ) : (
                        <span>Select</span>
                      )}
                    </button>

                    {/* Country Dropdown */}
                    {showCountryDropdown && (
                      <div className="absolute z-10 mt-1 w-72 bg-white shadow-lg max-h-48 rounded-lg py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                        {countries.map((country) => (
                          <button
                            key={country.countryCode}
                            type="button"
                            className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                            onClick={() => {
                              setSelectedCountry(country);
                              setShowCountryDropdown(false);
                              if (phone.length !== country.numberLength) {
                                setPhone('');
                              }
                            }}
                          >
                            <img
                              src={country.flag}
                              alt={country.countryName}
                              className="h-4 w-6 object-cover mr-2"
                            />
                            <span className="flex-1 text-left">{country.countryName}</span>
                            <span className="text-gray-500">{country.callingCode}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Phone Input */}
                  <div className="flex-1 min-w-[160px]">
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (selectedCountry && value.length <= selectedCountry.numberLength) {
                          setPhone(value);
                        }
                      }}
                      required
                      className="block w-full px-3 py-2 border-2 border-gray-200 rounded-r-lg shadow-sm text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder={selectedCountry ? `${selectedCountry.numberLength} digits required` : "Select country first"}
                    />
                  </div>
                </div>
                {selectedCountry && phone && phone.length !== selectedCountry.numberLength && (
                  <p className="mt-1 text-xs text-red-500">
                    Phone number must be {selectedCountry.numberLength} digits for {selectedCountry.countryName}
                  </p>
                )}
              </div>

              {/* Email Input */}
              <div className="col-span-1 sm:col-span-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full pl-10 px-3 py-2 border-2 border-gray-200 rounded-lg shadow-sm text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Email address"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="col-span-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full pl-10 pr-10 px-3 py-2 border-2 border-gray-200 rounded-lg shadow-sm text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="col-span-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="block w-full pl-10 pr-10 px-3 py-2 border-2 border-gray-200 rounded-lg shadow-sm text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit and Google Sign In */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Create Account
              </button>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 py-2 px-4 border-2 border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <FcGoogle className="h-4 w-4" />
                Sign up with Google
              </button>

              <p className="text-center text-xs text-gray-500">
                Already have an account?{" "}
                {isModal ? (
                  <button
                    onClick={onClose}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Log in
                  </button>
                ) : (
                  <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Log in
                  </a>
                )}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
