import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from 'i18next';

const LanguageContext = createContext();

export const languages = [
  { code: 'en', name: 'English', region: 'United States' },
  { code: 'hi', name: 'हिंदी', region: 'भारत' },
  
];
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('userLanguage');
    return savedLanguage ? JSON.parse(savedLanguage) : languages[0];
  });

  useEffect(() => {
    localStorage.setItem('userLanguage', JSON.stringify(currentLanguage));
    i18n.changeLanguage(currentLanguage.code);
  }, [currentLanguage]);

  const changeLanguage = (languageCode) => {
    const newLanguage = languages.find(lang => lang.code === languageCode);
    if (newLanguage) {
      setCurrentLanguage(newLanguage);
      i18n.changeLanguage(languageCode);
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
