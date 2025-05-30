// src/lib/i18n.ts
import i18n from 'i18next';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

/** Guard so the same instance isn’t initialised twice */
if (!i18n.isInitialized) {
  i18n
    /* Load JSON from /public/locales/{lng}/{ns}.json */
    .use(HttpBackend);
  if (typeof window !== 'undefined') {
    // react-i18next relies on browser APIs like createContext which
    // aren't available when this file runs on the server.
    i18n.use(initReactI18next);
  }
  i18n
    /* Initialise once with basic config */
    .init({
      lng: 'en',
      fallbackLng: 'en',
      supportedLngs: ['en', 'es'],
      ns: [
        'common',
        'header',
        'footer',
        'support',
        'faq',
        'documents',
        'doc_bill_of_sale_vehicle',
        'electronic-signature',
        'online-notary',
        'documents',
        'doc_bill_of_sale_vehicle',
      ],
      defaultNS: 'common',
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },

      interpolation: {
        escapeValue: false, // React already escapes
      },

      react: {
        useSuspense: false,
      },
    })
    .catch((err) => {
      // Prevent build/development crashes if translations are missing
      // eslint-disable-next-line no-console
      console.error('i18n init error', err);
    });
}

/** Export the singleton so RootClient can import `default` */
export default i18n;