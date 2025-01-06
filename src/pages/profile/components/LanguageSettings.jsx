import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTranslation } from 'react-i18next';

const LanguageSettings = () => {
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  const { t } = useTranslation();

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h4 className="font-medium">{t('profile.language.title')}</h4>
      <p className="text-sm text-gray-500 mt-1">
        {t('profile.language.subtitle')}
      </p>
      <div className="mt-4">
        <select
          value={currentLanguage.code}
          onChange={(e) => changeLanguage(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-600">
          {t('profile.language.current')}: {currentLanguage.name}
        </p>
      </div>
    </div>
  );
};

export default LanguageSettings;
