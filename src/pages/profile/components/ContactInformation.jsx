import React from 'react';
import { useTranslation } from 'react-i18next';

const ContactInformation = ({ email, phone }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('auth.email')}
        </label>
        <div className="mt-1">
          <input
            type="text"
            readOnly
            value={email}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('auth.phone')}
        </label>
        <div className="mt-1">
          <input
            type="text"
            readOnly
            value={phone}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactInformation;
