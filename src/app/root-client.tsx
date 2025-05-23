// src/app/root-client.tsx
'use client';
import React, { useEffect } from 'react';
// import { AuthProvider } from '@/hooks/useAuth'; // Ensure this was removed if consolidated
import { mark, measure } from '@/utils/performance';
// import { DefaultSeo } from 'next-seo'; // Temporarily removed
// import SEO from '@/next-seo.config'; // Temporarily removed

export default function RootClient({ children }: { children: React.ReactNode }) {
  if (typeof window !== 'undefined') {
    mark('root-layout-start');
  }

  useEffect(() => {
    mark('root-layout-end');
    measure('root-layout', 'root-layout-start', 'root-layout-end');
  }, []);

  // Temporarily removed DefaultSeo to diagnose the error
  // const seoProps = {
  //   title: '123LegalDoc',
  //   description: 'AI-Powered Legal Document Generation',
  // };

  return (
    <>
      {/* <DefaultSeo {...seoProps} /> */}
      {children}
    </>
  );
}
