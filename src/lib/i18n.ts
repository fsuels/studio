// src/lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

if (!i18n.isInitialized) {
  i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: 'en',
      debug: process.env.NODE_ENV === 'development',
      // Only allow supported languages and strip region codes like en-US
      supportedLngs: ['en', 'es'],
      load: 'languageOnly',
      interpolation: { escapeValue: false },
      ns: [
        'common',
        'header',
        'footer',
        'support', // Added support namespace
        'documents/promissory-note',
        'documents/bill-of-sale-vehicle',
        // etc...
      ],
      defaultNS: 'common',
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json'
      },
      react: { useSuspense: false },
      saveMissing: process.env.NODE_ENV === 'development'
    });
}

export default i18n;
