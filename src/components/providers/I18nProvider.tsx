// src/components/providers/I18nProvider.tsx
'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18nInstance, { ensureI18nInitialized } from '@/lib/i18n'; // Import the server-safe and client-configured instance

interface I18nProviderProps {
  children: ReactNode;
  locale: 'en' | 'es';
  /** Optional element shown until the i18n instance is ready */
  fallback?: ReactNode;
  /** Optional namespaces to load to minimize payload */
  namespaces?: string[];
}

const isServerEnvironment = typeof window === 'undefined';

const I18nClientProvider: React.FC<I18nProviderProps> = ({
  children,
  locale,
  fallback,
  namespaces,
}) => {
  const [isLanguageSynced, setIsLanguageSynced] = useState(() => {
    if (isServerEnvironment) {
      if (!i18nInstance.isInitialized) {
        void ensureI18nInitialized({ locale, namespaces }).catch((err) => {
          console.error('[I18nClientProvider] ensureI18nInitialized (ssr) error:', err);
        });
      } else if (i18nInstance.language !== locale) {
        void i18nInstance.changeLanguage(locale).catch((err) => {
          console.error('[I18nClientProvider] changeLanguage (ssr) error:', err);
        });
      }
      return true;
    }

    return i18nInstance.isInitialized && i18nInstance.language === locale;
  });

  useEffect(() => {
    let cancelled = false;

    const syncLocale = async () => {
      try {
        await ensureI18nInitialized({ locale, namespaces });
        if (cancelled) return;

        if (i18nInstance.language !== locale) {
          await i18nInstance.changeLanguage(locale);
        }
      } catch (err) {
        console.error('[I18nClientProvider] init/changeLanguage error:', err);
      } finally {
        if (!cancelled) {
          setIsLanguageSynced(true);
        }
      }
    };

    if (!isLanguageSynced || i18nInstance.language !== locale) {
      void syncLocale();
    }

    return () => {
      cancelled = true;
    };
  }, [locale, namespaces, isLanguageSynced]);

  useEffect(() => {
    if (isLanguageSynced || typeof window === 'undefined') {
      return;
    }

    const timer = window.setTimeout(() => {
      if (!isLanguageSynced) {
        console.warn('[I18nClientProvider] Timeout waiting for i18n; rendering anyway');
        setIsLanguageSynced(true);
      }
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [isLanguageSynced]);

  if (!isLanguageSynced) {
    return <>{fallback || null}</>;
  }

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
};

export default I18nClientProvider;