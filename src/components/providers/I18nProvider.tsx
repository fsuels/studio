// src/components/providers/I18nProvider.tsx
'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18nInstance from '@/lib/i18n'; // Import the server-safe and client-configured instance

interface I18nProviderProps {
  children: ReactNode;
  locale: 'en' | 'es';
  /** Optional element shown until the i18n instance is ready */
  fallback?: ReactNode;
}

const I18nClientProvider: React.FC<I18nProviderProps> = ({
  children,
  locale,
  fallback,
}) => {
  // i18nInstance from i18n.ts is already initialized (or being initialized).
  // We just need to ensure the language is correctly set.
  const [isLanguageSynced, setIsLanguageSynced] = useState(false);

  useEffect(() => {
    // Ensure the i18n instance is fully initialized before trying to change language.
    // The `i18n.isInitialized` check in i18n.ts handles the init call.
    // Here, we primarily focus on setting the correct language.
    if (i18nInstance.isInitialized) {
      if (i18nInstance.language !== locale) {
        i18nInstance
          .changeLanguage(locale)
          .then(() => {
            setIsLanguageSynced(true);
          })
          .catch((err) => {
            console.error(
              '[I18nClientProvider] Failed to change language:',
              err,
            );
            setIsLanguageSynced(true); // Still allow app to render
          });
      } else {
        setIsLanguageSynced(true);
      }
    } else {
      // If not initialized yet, wait for the 'initialized' event.
      const handleInitialized = () => {
        if (i18nInstance.language !== locale) {
          i18nInstance
            .changeLanguage(locale)
            .then(() => setIsLanguageSynced(true))
            .catch((err) => {
              console.error(
                '[I18nClientProvider] Failed to change language post-init event:',
                err,
              );
              setIsLanguageSynced(true);
            });
        } else {
          setIsLanguageSynced(true);
        }
      };
      i18nInstance.on('initialized', handleInitialized);
      return () => {
        i18nInstance.off('initialized', handleInitialized);
      };
    }
  }, [locale]);

  if (!isLanguageSynced) {
    return <>{fallback || null}</>;
  }

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
};

export default I18nClientProvider;
