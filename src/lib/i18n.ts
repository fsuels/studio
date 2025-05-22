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
      supportedLngs: ['en', 'es'],
      load: 'languageOnly',
      interpolation: { escapeValue: false },
      ns: [
        'common',
        'header',
        'footer',
        'support',
        'documents', // For document field translations
        'electronic-signature', // For the new eSign landing page
        // Keep document-specific namespaces if they exist and are used
        'documents/promissory-note',
        'documents/bill-of-sale-vehicle',
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
