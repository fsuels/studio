// src/lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from './i18nResources';

/** Guard so the same instance isn’t initialised twice */
if (!i18n.isInitialized) {

  // ── Bridge to react-i18next **only in the browser**
  if (typeof window !== 'undefined') {
    i18n.use(initReactI18next);
  }

  // ── Single initialisation call
  i18n
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
      ],
      defaultNS: 'common',
      resources,
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    })
    .catch((err) => {
      // prevent build/dev crashes if translations are missing
      // eslint-disable-next-line no-console
      console.error('i18n init error', err);
    });
}

/** Export the singleton so RootClient can import `default` */
export default i18n;
