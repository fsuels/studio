
"use client";

import React, { ReactNode, useEffect } from 'react'; // Import useEffect
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n'; 

interface I18nProviderProps {
  children: ReactNode;
  locale: 'en' | 'es'; // Add locale prop
}

const I18nClientProvider: React.FC<I18nProviderProps> = ({ children, locale }) => {
  // Effect to change i18n language when locale prop changes
  useEffect(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default I18nClientProvider;
