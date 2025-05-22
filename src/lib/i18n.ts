// src/lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Check if running in a browser environment
const isBrowser = typeof window !== 'undefined';

let i18nChain = i18n;

if (isBrowser) {
  // These plugins are browser-specific
  i18nChain = i18nChain.use(LanguageDetector);
  i18nChain = i18nChain.use(initReactI18next);
}

// HttpBackend can be used on server/client, but configuration might differ.
// For typical Next.js App Router, it's mainly for client-side loading from /public.
i18nChain = i18nChain.use(HttpBackend);

if (!i18n.isInitialized) {
  i18nChain.init({
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
      'documents',
      'electronic-signature',
      'documents/promissory-note',
      'documents/bill-of-sale-vehicle',
    ],
    defaultNS: 'common',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Path to your translation files in /public
    },
    // React specific options, only apply if in browser and initReactI18next was used
    ...(isBrowser ? { react: { useSuspense: false } } : {}),
    // Detection options for LanguageDetector, only if in browser
    detection: isBrowser ? {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage', 'cookie'],
    } : undefined,
    saveMissing: process.env.NODE_ENV === 'development', // Only in dev
  });
}

export default i18n; // Export the original i18n instance which has been configured
