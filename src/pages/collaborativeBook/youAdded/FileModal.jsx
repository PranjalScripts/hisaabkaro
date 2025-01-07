import React, { useEffect } from 'react';
import { IoDownload } from 'react-icons/io5';
import { IoMdClose } from 'react-icons/io';
import { Image } from 'antd';
import { DownloadOutlined, RotateLeftOutlined, RotateRightOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { AiOutlineClose } from 'react-icons/ai';

const FileModal = ({ isOpen, fileUrl, onClose, onDownload }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !fileUrl) return null;

  const isPDF = fileUrl?.toLowerCase().endsWith('.pdf');

  if (!isPDF) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-75">
        <Image
          preview={{
            visible: true,
            src: fileUrl,
            onVisibleChange: (visible) => {
              if (!visible) onClose();
            },
            toolbarRender: (_, { transform: { scale }, actions }) => (
              <div className="ant-image-preview-operations">
                <div className="ant-image-preview-operations-operation">
                  <DownloadOutlined onClick={onDownload} />
                </div>
                <div className="ant-image-preview-operations-operation">
                  <RotateLeftOutlined onClick={actions.onRotateLeft} />
                </div>
                <div className="ant-image-preview-operations-operation">
                  <RotateRightOutlined onClick={actions.onRotateRight} />
                </div>
                <div className="ant-image-preview-operations-operation">
                  <ZoomOutOutlined
                    disabled={scale === 1}
                    onClick={actions.onZoomOut}
                  />
                </div>
                <div className="ant-image-preview-operations-operation">
                  <ZoomInOutlined
                    disabled={scale === 50}
                    onClick={actions.onZoomIn}
                  />
                </div>
              </div>
            ),
          }}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative w-full h-full max-w-4xl mx-auto flex flex-col">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 p-2 text-white hover:text-gray-300 transition-colors"
          title="Close Modal"
        >
          <IoMdClose className="text-3xl" />
        </button>
        <div className="flex-1 relative">
          <button
            onClick={onClose}
            className="absolute -right-12 top-4 p-2 text-white hover:text-gray-300 transition-colors rounded-full hover:bg-white/10"
            title="Close PDF"
          >
            <AiOutlineClose className="text-2xl" />
          </button>
          <iframe
            src={fileUrl}
            className="w-full h-full rounded-lg bg-white"
            title="PDF Viewer"
          />
        </div>
      </div>
    </div>
  );
};

export default FileModal;
