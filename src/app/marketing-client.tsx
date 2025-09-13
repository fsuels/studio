'use client';

import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n, { ensureI18nInitialized } from '@/lib/i18n';

export default function MarketingClient({
  children,
  locale = 'en',
}: {
  children: React.ReactNode;
  locale?: 'en' | 'es';
}) {
  useEffect(() => {
    ensureI18nInitialized({ locale }).catch(() => {});
  }, [locale]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
