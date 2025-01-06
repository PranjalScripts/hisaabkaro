import React from 'react';

const ProfileHeader = ({ title, subtitle }) => {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        {title}
      </h1>
      <p className="mt-2 text-gray-600">{subtitle}</p>
    </div>
  );
};

export default ProfileHeader;
