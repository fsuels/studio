// src/lib/i18n.ts
import i18n from 'i18next';
import HttpBackend from 'i18next-http-backend';

const isBrowser = typeof window !== 'undefined';

// Initialize the core i18n instance
// This instance is server-safe and can be used in `generateMetadata`
if (!i18n.isInitialized) {
  i18n
    .use(HttpBackend) // For loading translations
    .init({
      // Core i18next options
      debug: process.env.NODE_ENV === 'development' && isBrowser,
      fallbackLng: 'en',
      supportedLngs: ['en', 'es'],
      load: 'languageOnly',
      ns: [
        'common',
        'header',
        'footer',
        'support',
        'faq',
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
        escapeValue: false,
      },
      returnObjects: false,
      returnEmptyString: true,
      keySeparator: '.',
      nsSeparator: ':',
    });
}

export default i18n;
