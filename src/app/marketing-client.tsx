'use client';

import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n, { ensureI18nInitialized } from '@/lib/i18n';

export default function MarketingClient({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    ensureI18nInitialized().catch(() => {});
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

