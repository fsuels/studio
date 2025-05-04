
"use client";

import React, { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n'; // Import your i18n configuration

interface I18nProviderProps {
  children: ReactNode;
}

const I18nClientProvider: React.FC<I18nProviderProps> = ({ children }) => {
  // Ensure i18n instance is initialized. The configuration in `i18n.ts` handles this.
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default I18nClientProvider;
