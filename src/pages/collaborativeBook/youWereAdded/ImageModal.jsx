import React from 'react';
import { IoDownload } from "react-icons/io5";

const ImageModal = ({ isOpen, imageUrl, onClose, onDownload }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div className="bg-white p-4 rounded-lg w-3/4 max-h-[80vh] relative">
        <div
          className="relative w-full h-full"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={imageUrl}
            alt="Transaction File"
            className="w-full h-[80vh] flex select-none"
            style={{
              height: "70vh",
              width: "auto",
              display: "flex",
              WebkitUserSelect: "none",
              margin: "auto",
            }}
          />
          <button
            className="absolute top-4 right-4 bg-white rounded-full p-3 h-10 w-10 flex items-center justify-center text-xl font-bold"
            onClick={onClose}
          >
            ✖
          </button>
          <button
            onClick={onDownload}
            className="absolute bottom-0 -left-1 bg-white/10 backdrop-blur-lg border rounded-full px-6 py-1 flex items-center justify-center text-3xl font-bold"
          >
            <IoDownload />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
