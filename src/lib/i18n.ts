// src/lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { loadLocaleResources } from './i18nResources';
import type { Resource } from 'i18next';

type SupportedLocale = 'en' | 'es';
interface InitOptions {
  locale?: SupportedLocale;
  namespaces?: string[];
}

const runtimeFlags = i18n as typeof i18n & {
  __hasBoundReact?: boolean;
  __hasLanguageDetector?: boolean;
};

const ensurePluginsBound = () => {
  if (!runtimeFlags.__hasBoundReact) {
    i18n.use(initReactI18next);
    runtimeFlags.__hasBoundReact = true;
  }

  if (typeof window !== 'undefined' && !runtimeFlags.__hasLanguageDetector) {
    i18n.use(LanguageDetector);
    runtimeFlags.__hasLanguageDetector = true;
  }
};

let initPromise: Promise<void> | null = null;

export async function ensureI18nInitialized(
  options: InitOptions = {},
): Promise<void> {
  ensurePluginsBound();

  if (i18n.isInitialized && options.locale) {
    if (i18n.language !== options.locale) {
      await i18n.changeLanguage(options.locale);
    }
    return;
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      ensurePluginsBound();

      const locale: SupportedLocale = options.locale ?? 'en';

      let localeResources: Resource[string] | null = null;
      try {
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
      initPromise = null;
    }
  })();

  return initPromise;
}

export default i18n;