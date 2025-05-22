// src/lib/i18n.ts
import i18n from 'i18next';
import HttpBackend from 'i18next-http-backend';
// DO NOT import initReactI18next or LanguageDetector here at the top level

const initializeI18n = () => {
  if (i18n.isInitialized) {
    return;
  }
  i18n
    .use(HttpBackend) // For loading translations
    .init({
      fallbackLng: 'en',
      debug: process.env.NODE_ENV === 'development',
      supportedLngs: ['en', 'es'],
      load: 'languageOnly',
      interpolation: { escapeValue: false }, // React already safes from xss
      ns: ['common', 'header', 'footer', 'support', 'electronic-signature', 'documents'],
      defaultNS: 'common',
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json', // Path to your translation files in /public
      },
      // No 'react' or 'detection' options here for the base server-safe initialization
    });
};

initializeI18n(); // Initialize the core i18n instance

export default i18n;
