// src/components/providers/I18nProvider.tsx
"use client";

import React, { ReactNode, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18nInstance from '@/lib/i18n'; // Import the initialized instance

interface I18nProviderProps {
  children: ReactNode;
  locale: 'en' | 'es';
}

const I18nClientProvider: React.FC<I18nProviderProps> = ({ children, locale }) => {
  useEffect(() => {
    // Check current i18next language and change only if different from prop
    if (i18nInstance.language !== locale) {
      i18nInstance.changeLanguage(locale);
    }
  }, [locale]); // Depend only on locale, as i18nInstance is stable

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
};

export default I18nClientProvider;
