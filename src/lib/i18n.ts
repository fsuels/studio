// src/lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const isBrowser = typeof window !== 'undefined';

// Initialize i18n only once
if (!i18n.isInitialized) {
  i18n.use(HttpBackend); // HttpBackend is safe for server and client

  if (isBrowser) {
    // These plugins are browser-specific and should only be used on the client
    i18n.use(LanguageDetector).use(initReactI18next);
  }

  i18n.init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    supportedLngs: ['en', 'es'],
    load: 'languageOnly', // only load 'en', not 'en-US'
    interpolation: { escapeValue: false }, // React already safes from xss
    ns: [
      'common',
      'header',
      'footer',
      'support',
      'electronic-signature',
      'documents',
      // Removed specific document namespaces like 'documents/bill-of-sale-vehicle' for now,
      // assuming keys within 'documents.json' are structured (e.g., 'bill-of-sale-vehicle.sellerName.label')
    ],
    defaultNS: 'common',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Path to your translation files in /public
    },
    // React specific options, only include if in browser
    ...(isBrowser ? { react: { useSuspense: false } } : {}),
    // Detection options for LanguageDetector, only if in browser
    detection: isBrowser
      ? {
          order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
          caches: ['localStorage', 'cookie'],
        }
      : undefined,
    saveMissing: process.env.NODE_ENV === 'development', // Only in dev
  });
}

export default i18n;
