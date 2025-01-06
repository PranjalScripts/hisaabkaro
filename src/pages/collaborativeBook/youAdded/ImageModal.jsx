import React from 'react';
import { IoDownload } from 'react-icons/io5';

const FileModal = ({ isModalOpen, modalImage, closeModal, handleDownload }) => {
  if (!isModalOpen) return null;

  const isPDF = modalImage?.toLowerCase().endsWith('.pdf');

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
      onClick={closeModal}
    >
      <div className="bg-white p-4 rounded-lg w-3/4 max-h-[80vh] relative">
        <div
          className="relative w-full h-full"
          onClick={(e) => e.stopPropagation()}
        >
          {isPDF ? (
            <embed
              src={modalImage}
              type="application/pdf"
              className="w-full h-[70vh]"
            />
          ) : (
            <img
              src={modalImage}
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
          )}
          <button
            className="absolute top-4 right-4 bg-white rounded-full p-3 h-10 w-10 flex items-center justify-center text-xl font-bold"
            onClick={closeModal}
          >
            ×
          </button>
          <button
            onClick={handleDownload}
            className="absolute top-4 right-16 bg-white rounded-full p-3 h-10 w-10 flex items-center justify-center"
          >
            <IoDownload />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileModal;
