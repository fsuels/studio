// src/app/root-client.tsx
'use client';

import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import { mark, measure } from '@/utils/performance';

export default function RootClient({
  children,
}: {
  children: React.ReactNode;
}) {
  if (typeof window !== 'undefined') {
    mark('root-layout-start');
  }

  useEffect(() => {
    mark('root-layout-end');
    measure('root-layout', 'root-layout-start', 'root-layout-end');
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}
