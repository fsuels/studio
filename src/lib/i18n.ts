// src/lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
// import LanguageDetector from 'i18next-browser-languagedetector'; // REMOVED

i18n
  // load translation using http -> see /public/locales
  // learn more: https://github.com/i18next/i18next-http-backend
  .use(HttpBackend)
  // .use(LanguageDetector) // REMOVED - Language detection will be handled by Next.js routing and props
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development', // Enable debug output in development
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    // Specify where translations are stored
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    // Specify namespaces (optional, default is 'translation')
    ns: ['translation', 'support'], // Added 'support' namespace if it's used
    defaultNS: 'translation',
    // React specific options
    react: {
      useSuspense: false, // Set to true if using Suspense for loading translations
    },
    saveMissing: process.env.NODE_ENV === 'development', // Save missing keys to .missing.json in dev
    // Missing key handler is set up in scripts/find-missing-i18n.js
  });

export default i18n;
