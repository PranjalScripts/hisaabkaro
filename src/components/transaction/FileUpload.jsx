import React from 'react';

const FileUpload = ({ file, onChange }) => {
  return (
    <div>
      <label className="block text-gray-600 text-sm mb-2">
        Attachment
      </label>
      <div className="flex">
        <button
          type="button"
          onClick={() => document.querySelector('input[type="file"]').click()}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Choose File
        </button>
        <span className="ml-2 text-gray-500">
          {file ? file.name : "No file chosen"}
        </span>
        <input
          type="file"
          name="file"
          onChange={onChange}
          className="hidden"
          accept="image/*"
        />
      </div>
    </div>
  );
};

export default FileUpload;
