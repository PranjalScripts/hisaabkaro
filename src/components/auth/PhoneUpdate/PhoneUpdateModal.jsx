import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PhoneUpdateModal = ({ onClose }) => {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

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

    const handleCountryChange = (e) => {
        const country = countries.find(c => c.countryCode === e.target.value);
        setSelectedCountry(country);
        setPhone(''); // Reset phone when country changes
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!selectedCountry) {
            toast.error('Please select a country');
            setLoading(false);
            return;
        }

        // Validate phone number length
        if (phone.length !== selectedCountry.numberLength) {
            toast.error(`Phone number must be ${selectedCountry.numberLength} digits for ${selectedCountry.countryName}`);
            setLoading(false);
            return;
        }

        // Remove any non-digit characters from phone
        const cleanPhone = phone.replace(/\D/g, '');

        try {
            const response = await axios.patch(
                `${process.env.REACT_APP_URL}/api/v1/auth/update-profile/${userId}`,
                { 
                    phone: `${selectedCountry.callingCode}${cleanPhone}`,
                    countryCode: selectedCountry.countryCode 
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (response.data) {
                toast.success('Phone number updated successfully');
                onClose();
                navigate('/home');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update phone number');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96 relative">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Update Phone Number
                </h2>
                <p className="text-gray-600 mb-4 text-center">
                    Please add your phone number to complete your profile
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                            Country
                        </label>
                        <select
                            id="country"
                            value={selectedCountry?.countryCode || ''}
                            onChange={handleCountryChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                        >
                            {countries.map(country => (
                                <option key={country.countryCode} value={country.countryCode}>
                                    {country.countryName} ({country.callingCode})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="relative">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                        </label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                                {selectedCountry?.callingCode}
                            </span>
                            <input
                                type="tel"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder={`${selectedCountry?.numberLength || ''} digits required`}
                                maxLength={selectedCountry?.numberLength || 15}
                                required
                            />
                        </div>
                        {selectedCountry && (
                            <p className="text-xs text-gray-500 mt-1">
                                Number length: {selectedCountry.numberLength} digits
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? 'Updating...' : 'Update Phone Number'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PhoneUpdateModal;
