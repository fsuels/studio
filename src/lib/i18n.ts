// src/lib/i18n.ts
import i18n from 'i18next';
import HttpBackend from 'i18next-http-backend';
// DO NOT import initReactI18next or LanguageDetector here at the top level

const isBrowser = typeof window !== 'undefined';

// Initialize the core i18n instance
// This instance is server-safe and can be used in `generateMetadata`
if (!i18n.isInitialized) {
  i18n
    .use(HttpBackend) // For loading translations
    .init({
      // Core i18next options
      debug: process.env.NODE_ENV === 'development' && isBrowser, // More targeted debug logging
      fallbackLng: 'en',
      supportedLngs: ['en', 'es'],
      load: 'languageOnly', // Loads 'en' instead of 'en-US'
      ns: ['common', 'header', 'footer', 'support', 'electronic-signature', 'documents', 'doc_bill_of_sale_vehicle'],
      defaultNS: 'common',
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
      interpolation: {
        escapeValue: false, // React already safes from XSS
      },
      // Options to prevent `t()` from returning objects or complex structures
      returnObjects: false,
      returnEmptyString: true, // Return empty string if key not found (safer than key itself)
      keySeparator: '.', // Default
      nsSeparator: ':', // Default
    });
}

export default i18n;
