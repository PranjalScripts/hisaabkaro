import React, { useState } from 'react';
import axios from 'axios';
import { getFileName, getFileUrl } from '../../../utils/fileUtils';

const FileViewer = ({ file, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Return early if no file is provided
  if (!file) {
    return null;
  }

  // Get the filename and check if it's an image or PDF
  const fileName = getFileName(file);
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
  const isPdf = /\.pdf$/i.test(fileName);
  const fileUrl = getFileUrl(file);

  const handleDownloadFile = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        fileUrl,
        { 
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      const blob = new Blob([response.data], { type: response.data.type });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with title and buttons */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">{fileName}</h3>
          <div className="flex items-center gap-2">
            {/* Download button */}
            <button
              onClick={handleDownloadFile}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-500 transition-colors"
              title="Download file"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
            
            {/* Close button */}
            <button
              className="text-gray-400 hover:text-gray-500 transition-colors"
              onClick={onClose}
              title="Close preview"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {isImage && (
                <img
                  src={fileUrl}
                  alt={fileName}
                  className="max-h-[70vh] object-contain"
                />
              )}
              {isPdf && (
                <iframe
                  src={fileUrl}
                  title={fileName}
                  className="w-full h-[70vh]"
                />
              )}
              {!isImage && !isPdf && (
                <div className="text-gray-500">
                  This file type cannot be previewed
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileViewer;
