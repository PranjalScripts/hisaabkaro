import React from 'react';
import { IoDownload } from 'react-icons/io5';
import { IoMdClose } from 'react-icons/io';
import { Image } from 'antd';
import { DownloadOutlined, RotateLeftOutlined, RotateRightOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';

const FileModal = ({ isModalOpen, modalImage, closeModal, handleDownload }) => {
  if (!isModalOpen) return null;

  const isPDF = modalImage?.toLowerCase().endsWith('.pdf');

  if (!isPDF) {
    return (
      <>
        <Image
          style={{ display: 'none' }}
          preview={{
            visible: isModalOpen,
            src: modalImage,
            onVisibleChange: (visible) => {
              if (!visible) closeModal();
            },
            toolbarRender: (_, { transform: { scale }, actions }) => (
              <div className="ant-image-preview-operations">
                <div className="ant-image-preview-operations-operation">
                  <DownloadOutlined onClick={handleDownload} />
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
        <div style={{ display: 'none' }}>
          <Image src={modalImage} />
        </div>
      </>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
      onClick={closeModal}
    >
      <div className="relative">
        {/* Buttons positioned above the modal */}
        <div className="fixed top-4 right-4 flex gap-4 z-[60]">
          <button
            onClick={handleDownload}
            className="bg-white rounded-full p-4 h-14 w-14 flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
            title="Download"
          >
            <IoDownload className="text-2xl text-gray-700" />
          </button>
          <button
            className="bg-white rounded-full p-4 h-14 w-14 flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              closeModal();
            }}
            title="Close"
          >
            <IoMdClose className="text-3xl text-gray-700" />
          </button>
        </div>

        {/* PDF modal content */}
        <div className="bg-white p-4 rounded-lg w-[95vw] h-[98vh] relative">
          <div
            className="relative w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <embed
              src={modalImage}
              type="application/pdf"
              className="w-full h-full"
              style={{ height: 'calc(98vh - 2rem)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileModal;
