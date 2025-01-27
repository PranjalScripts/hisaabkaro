import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { countries } from '../../utils/country';

const EditUser = ({ user, onClose, onUserUpdated }) => {
  const [editedUser, setEditedUser] = useState({
    name: user.name || "",
    email: user.email || "",
    mobile: "",
  });

  const [selectedCountry, setSelectedCountry] = useState(countries.find(c => c.countryCode === "IN") || countries[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    // Parse the existing mobile number to set initial country and number
    if (user.mobile) {
      // Find the country code from the mobile number
      const country = countries.find(c => 
        user.mobile.startsWith(c.callingCode.replace('+', '')) || 
        user.mobile.startsWith(c.callingCode)
      );
      
      if (country) {
        setSelectedCountry(country);
        // Remove the country code from the mobile number
        const mobileWithoutCode = user.mobile.replace(country.callingCode, '').replace('+', '');
        setEditedUser(prev => ({
          ...prev,
          mobile: mobileWithoutCode
        }));
      } else {
        // If no country code is found, set the full number as mobile
        setEditedUser(prev => ({
          ...prev,
          mobile: user.mobile
        }));
      }
    }
  }, [user.mobile]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isDropdownOpen]);

  const filteredCountries = countries.filter(country => 
    country.countryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.callingCode.includes(searchQuery) ||
    country.countryCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const validateForm = () => {
    if (!editedUser.name.trim()) {
      setErrorMessage("Name is required");
      return false;
    }
    if (!editedUser.email.trim()) {
      setErrorMessage("Email is required");
      return false;
    }
    if (!emailRegex.test(editedUser.email)) {
      setErrorMessage("Invalid email format");
      return false;
    }
    if (editedUser.mobile) {
      if (editedUser.mobile.length !== selectedCountry.numberLength) {
        setErrorMessage(`Phone number must be ${selectedCountry.numberLength} digits for ${selectedCountry.countryName}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Authentication required");
        return;
      }

      const fullMobileNumber = editedUser.mobile ? `${selectedCountry.callingCode}${editedUser.mobile}` : '';

      const response = await axios.put(
        `${process.env.REACT_APP_URL}/api/v3/client/update-client/${user._id}`,
        {
          ...editedUser,
          mobile: fullMobileNumber
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data && response.data.data) {
        const updatedUser = {
          ...response.data.data,
          mobile: response.data.data.mobile || fullMobileNumber
        };
        onUserUpdated(updatedUser);
        onClose();
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Update error:", error);
      setErrorMessage(error.response?.data?.message || "Failed to update user");
    }
  };

  return (
    <div className="fixed inset-0 overflow-y-auto z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity" aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Edit User</h3>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={editedUser.name}
                    onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                    placeholder="Enter name"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={editedUser.email}
                    onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                    placeholder="Enter email"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <div className="flex gap-2">
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white flex items-center gap-2 min-w-[120px] relative"
                    >
                      <img
                        src={selectedCountry.flag}
                        alt={selectedCountry.countryName}
                        className="w-5 h-4 object-cover absolute left-3"
                      />
                      <span>{selectedCountry.callingCode}</span>
                      <svg
                        className={`w-4 h-4 ml-auto transition-transform ${isDropdownOpen ? 'transform rotate-0' : 'transform rotate-180'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute z-10 bottom-full mb-1 w-72 bg-white border border-gray-300 rounded-lg shadow-lg">
                        <div className="p-2 border-b">
                          <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search country..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div className="overflow-y-auto" style={{ maxHeight: '176px' }}>
                          {filteredCountries.length > 0 ? (
                            filteredCountries.map(country => (
                              <button
                                key={country.countryCode}
                                type="button"
                                className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-3"
                                onClick={() => {
                                  setSelectedCountry(country);
                                  setIsDropdownOpen(false);
                                  setSearchQuery("");
                                  if (editedUser.mobile.length !== country.numberLength) {
                                    setEditedUser(prev => ({ ...prev, mobile: '' }));
                                  }
                                }}
                              >
                                <img
                                  src={country.flag}
                                  alt={country.countryName}
                                  className="w-5 h-4 object-cover"
                                />
                                <span className="min-w-[60px]">{country.callingCode}</span>
                                <span className="text-gray-500 text-sm truncate">{country.countryName}</span>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-gray-500 text-sm">No countries found</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    id="mobile"
                    type="tel"
                    value={editedUser.mobile}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= selectedCountry.numberLength) {
                        setEditedUser({ ...editedUser, mobile: value });
                      }
                    }}
                    maxLength={selectedCountry.numberLength}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder={`Enter ${selectedCountry.numberLength} digits`}
                  />
                </div>
                {selectedCountry && (
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedCountry.countryName} - {selectedCountry.numberLength} digits required
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>

          {errorMessage && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center p-4 text-red-800 rounded-lg bg-red-50">
                <div className="flex-shrink-0">
                  <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                  </svg>
                </div>
                <div className="ml-3 text-sm font-medium">{errorMessage}</div>
                <button
                  type="button"
                  onClick={() => setErrorMessage("")}
                  className="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditUser;
