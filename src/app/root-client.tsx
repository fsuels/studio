// src/app/root-client.tsx
'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import { mark, measure } from '@/utils/performance';

// ✅ Dynamically load DocumentFlow to allow preload
const DocumentFlow = dynamic(() => import('@/components/DocumentFlow'), {
  ssr: false,
}) as any; // 👈 temporary `any` so we can safely check .preload()

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

    // ✅ Prevent runtime error: check preload exists
    if (typeof DocumentFlow?.preload === 'function') {
      void DocumentFlow.preload();
    }
    // REMOVED: Problematic line below as StepThreeInput is not defined here.
    // if (typeof window !== 'undefined' && StepThreeInput?.preload) {
    //   void StepThreeInput.preload();
    // }
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}
