import React from 'react';
import { useTranslation } from 'react-i18next';

const ProfileCard = ({ userProfile }) => {
  const { t } = useTranslation();
  
  return (
    <div className="text-center text-white">
      <div className="w-24 h-24 rounded-full bg-white/20 mx-auto mb-4 flex items-center justify-center">
        {userProfile.name ? (
          <span className="text-3xl font-bold">
            {userProfile.name.charAt(0).toUpperCase()}
          </span>
        ) : (
          <span className="text-3xl font-bold">U</span>
        )}
      </div>
      <h2 className="text-xl font-semibold mb-1">{userProfile.name}</h2>
      <p className="text-white/80 text-sm">{userProfile.email}</p>
      {userProfile.phone && (
        <p className="text-white/80 text-sm mt-1">{userProfile.phone}</p>
      )}
    </div>
  );
};

export default ProfileCard;
