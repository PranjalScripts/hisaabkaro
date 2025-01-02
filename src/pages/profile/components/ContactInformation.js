import React from "react";

const ContactInformation = ({ email, phone }) => {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path
            fillRule="evenodd"
            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
            clipRule="evenodd"
          />
        </svg>
        Contact Information
      </h4>
      <div className="mt-3 space-y-4">
        <div className="group bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl transition-all duration-300 hover:shadow-md hover:scale-[1.02] transform cursor-pointer relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex items-center space-x-3 relative">
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="font-semibold text-gray-800">{email}</p>
            </div>
          </div>
        </div>

        <div className="group bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl transition-all duration-300 hover:shadow-md hover:scale-[1.02] transform cursor-pointer relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex items-center space-x-3 relative">
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="font-semibold text-gray-800">{phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInformation;
