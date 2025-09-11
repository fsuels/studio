// src/lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { loadAllResources } from './i18nResources';
import type { Resource } from 'i18next';

let initPromise: Promise<void> | null = null;

export async function ensureI18nInitialized(): Promise<void> {
  if (i18n.isInitialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      // Bridge adapters only in the browser
      if (typeof window !== 'undefined') {
        i18n.use(LanguageDetector).use(initReactI18next);
      }

      let resources: Resource = {} as Resource;
      try {
        resources = await loadAllResources();
      } catch (err) {
        console.error(
          'i18n resource load error; falling back to empty resources',
          err,
        );
        resources = {
          en: {
            common: {},
            header: {},
            footer: {},
            support: {},
            faq: {},
            documents: {},
            doc_bill_of_sale_vehicle: {},
            doc_promissory_note: {},
            'online-notary': {},
            'electronic-signature': {},
          },
          es: {
            common: {},
            header: {},
            footer: {},
            support: {},
            faq: {},
            documents: {},
            doc_bill_of_sale_vehicle: {},
            doc_promissory_note: {},
            'online-notary': {},
            'electronic-signature': {},
          },
        } as unknown as Resource;
      }

      await i18n
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
            'doc_promissory_note',
            'online-notary',
            'electronic-signature',
          ],
          defaultNS: 'common',
          resources,
          interpolation: { escapeValue: false },
          react: { useSuspense: false },
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
          saveMissing: false,
          returnObjects: false,
          returnEmptyString: true,
        })
        .catch((err) => {
          console.error('i18n init error', err);
        });
    } finally {
      // no-op
    }
  })();

  return initPromise;
}

export default i18n;
