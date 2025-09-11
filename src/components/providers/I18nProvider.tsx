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
}

const I18nClientProvider: React.FC<I18nProviderProps> = ({
  children,
  locale,
  fallback,
}) => {
  // i18nInstance from i18n.ts is already initialized (or being initialized).
  // We just need to ensure the language is correctly set.
  const [isLanguageSynced, setIsLanguageSynced] = useState(false);
  // Safety net: ensure we never block rendering indefinitely
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLanguageSynced) {
        console.warn('[I18nClientProvider] Timeout waiting for i18n; rendering anyway');
        setIsLanguageSynced(true);
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [isLanguageSynced]);

  useEffect(() => {
    let cancelled = false;
    const sync = async () => {
      try {
        await ensureI18nInitialized();
        if (cancelled) return;
        if (i18nInstance.language !== locale) {
          await i18nInstance.changeLanguage(locale);
        }
      } catch (err) {
        console.error('[I18nClientProvider] init/changeLanguage error:', err);
      } finally {
        if (!cancelled) setIsLanguageSynced(true);
      }
    };
    sync();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  if (!isLanguageSynced) {
    return <>{fallback || null}</>;
  }

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
};

export default I18nClientProvider;
