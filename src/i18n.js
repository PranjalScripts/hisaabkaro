import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslation from "./locales/en/translation.json";
import hiTranslation from "./locales/hi/translation.json";

const resources = {
  en: {
    translation: enTranslation,
    name: "English",
  },
  hi: {
    translation: hiTranslation,
    name: "हिंदी",
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });

export const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी" },
];

export default i18n;
