import React from 'react';
import { Image } from 'antd';

const ImageViewer = ({ src, alt, placeholderImage, className = "" }) => {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <Image
        src={src}
        alt={alt}
        fallback={placeholderImage}
        className="w-full h-full object-cover"
        preview={{
          maskClassName: 'group-hover:opacity-20',
          mask: (
            <div className="text-white text-sm">
              Click to view
            </div>
          ),
        }}
      />
    </div>
  );
};

export default ImageViewer;
