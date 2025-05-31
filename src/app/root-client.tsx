// src/app/root-client.tsx
'use client';
import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { I18nextProvider } from 'react-i18next';
// import { AuthProvider } from '@/hooks/useAuth'; // Ensure this was removed if consolidated
import i18n from '@/lib/i18n';
import { mark, measure } from '@/utils/performance';
// import { DefaultSeo } from 'next-seo'; // Temporarily removed
// import SEO from '@/next-seo.config'; // Temporarily removed

// Dynamically loaded wizard to allow early prefetching
const DocumentFlow = dynamic(() => import('@/components/DocumentFlow'), {
  ssr: false,
});

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
    // Preload the document flow wizard to speed up navigation
    void DocumentFlow.preload();
  }, []);

  // Temporarily removed DefaultSeo to diagnose the error
  // const seoProps = {
  //   title: '123LegalDoc',
  //   description: 'AI-Powered Legal Document Generation',
  // };

  return (
    <I18nextProvider i18n={i18n}>
      {/* Removed the fragment <> and </> because I18nextProvider will be the root */}
      {/* <DefaultSeo {...seoProps} /> */}
      {children}
    </I18nextProvider>
  );
}
