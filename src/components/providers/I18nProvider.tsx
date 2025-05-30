// src/components/providers/I18nProvider.tsx
'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18nInstance from '@/lib/i18n'; // Import the server-safe instance
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

interface I18nProviderProps {
  children: ReactNode;
  locale: 'en' | 'es';
  /** Optional element shown until the i18n instance is ready */
  fallback?: ReactNode;
}

let clientSidePluginsApplied = false;

const I18nClientProvider: React.FC<I18nProviderProps> = ({
  children,
  locale,
  fallback,
}) => {
  const [isClientInitialized, setIsClientInitialized] = useState(
    clientSidePluginsApplied,
  );

  useEffect(() => {
    if (!clientSidePluginsApplied) {
      i18nInstance
        .use(LanguageDetector)
        .use(initReactI18next)
        .init(
          {
            ...i18nInstance.options, // Inherit server-safe options
            lng: locale, // Set initial language based on prop
            // Override or add React-specific and browser-specific options
            react: {
              useSuspense: false, // Recommended for Next.js App Router
            },
            detection: {
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
            },
            // Disable auto POST to `/locales/add` which isn't handled server-side
            saveMissing: false,
            // Ensure these are also set for client-side instance for consistency
            interpolation: {
              escapeValue: false, // React already does escaping
            },
            returnObjects: false, // Explicitly ensure objects are not returned
            returnEmptyString: true, // Return empty string for missing keys
          },
          (err) => {
            if (err) {
              return console.error(
                'Error initializing i18next for client with plugins:',
                err,
              );
            }
            clientSidePluginsApplied = true;
            setIsClientInitialized(true);
            if (i18nInstance.language !== locale) {
              i18nInstance
                .changeLanguage(locale)
                .catch((e) =>
                  console.error('Error changing language post-init:', e),
                );
            }
          },
        );
    } else {
      // If plugins are already applied, just ensure language syncs
      if (i18nInstance.language !== locale) {
        i18nInstance
          .changeLanguage(locale)
          .then(() => {
            setIsClientInitialized(true);
          })
          .catch((err) =>
            console.error(
              'Error changing language on already initialized instance:',
              err,
            ),
          );
      } else {
        setIsClientInitialized(true);
      }
    }
  }, [locale]);

  // Render children only once the client-side i18n instance is ready to
  // avoid hydration mismatches when translations load.
  if (!isClientInitialized) {
    return <>{fallback || null}</>;
  }

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
};

export default I18nClientProvider;
