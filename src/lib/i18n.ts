// src/lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { loadLocaleResources } from './i18nResources';
import type { Resource } from 'i18next';

let initPromise: Promise<void> | null = null;

type SupportedLocale = 'en' | 'es';
interface InitOptions {
  locale?: SupportedLocale;
  namespaces?: string[];
}

export async function ensureI18nInitialized(
  options: InitOptions = {},
): Promise<void> {
  // If already initialized, optionally just change language below
  if (i18n.isInitialized && options.locale) {
    if (i18n.language !== options.locale) {
      await i18n.changeLanguage(options.locale);
    }
    return;
  }

  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      // Bridge adapters only in the browser
      if (typeof window !== 'undefined') {
        i18n.use(LanguageDetector).use(initReactI18next);
      }

      const locale: SupportedLocale = options.locale ?? 'en';

      let localeResources: Resource[string] | null = null;
      try {
        // Load only the current locale and requested namespaces to reduce payload
        localeResources = await loadLocaleResources(locale, options.namespaces);
      } catch (err) {
        console.error(
          'i18n resource load error; falling back to minimal resources',
          err,
        );
        localeResources = {
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
        } as unknown as Resource[string];
      }

      // Default to a minimal set unless explicitly expanded by callers
      const ns = options.namespaces ?? ['common', 'header', 'footer'];

      const resources: Resource = {
        [locale]: localeResources!,
      } as Resource;

      await i18n
        .init({
          lng: locale,
          fallbackLng: 'en',
          supportedLngs: ['en', 'es'],
          ns,
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
