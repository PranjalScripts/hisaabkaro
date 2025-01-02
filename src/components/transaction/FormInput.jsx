import React from 'react';

const FormInput = ({ label, type, name, value, onChange, placeholder, required }) => {
  return (
    <div>
      <label className="block text-gray-600 text-sm mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

export default FormInput;
