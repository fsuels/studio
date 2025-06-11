// src/lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { loadAllResources } from './i18nResources';

/** Guard so the same instance isn’t initialised twice */
if (!i18n.isInitialized) {
  const i18nInstance = i18n; // Use a local var for clarity in this block

  // ── Bridge to react-i18next and LanguageDetector **only in the browser**
  if (typeof window !== 'undefined') {
    i18nInstance.use(LanguageDetector).use(initReactI18next);
  }

  // ── Single initialisation call
  const resources = await loadAllResources();

  await i18nInstance
    .init({
      lng: 'en', // Default language
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
        'doc_promissory_note',
        'online-notary',
        'electronic-signature',
      ],
      defaultNS: 'common',
      resources,
      interpolation: { escapeValue: false }, // React already does escaping
      react: { useSuspense: false }, // Recommended for Next.js App Router
      // Detection options, only relevant on client
      detection:
        typeof window !== 'undefined'
          ? {
              order: [
                'querystring',
                'cookie',
                'localStorage',
                'navigator',
                'htmlTag',
                'path',
                'subdomain',
              ],
              caches: ['localStorage', 'cookie'],
            }
          : undefined,
      saveMissing: false, // Disable auto POST to `/locales/add`
      returnObjects: false,
      returnEmptyString: true,
    })
    .catch((err) => {
      console.error('i18n init error', err);
    });
}

/** Export the singleton so RootClient can import `default` */
export default i18n;
