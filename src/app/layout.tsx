'use client';
/* prettier-ignore */
// src/app/layout.tsx

import './globals.css';
import { Inter, Merriweather } from 'next/font/google';
import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n'; // Changed this line
import { DefaultSeo } from 'next-seo';
import SEO from '../../next-seo.config.js';
import Script from 'next/script';
import { AuthProvider } from '@/hooks/useAuth';
import { mark, measure } from '@/utils/performance';

// Dev-only helper for catching missing translation keys
if (
  process.env.NODE_ENV === 'development' &&
  typeof window !== 'undefined'
) {
  import('../../scripts/find-missing-i18n.js').catch((err) =>
    console.error('Failed to load find-missing-i18n.js:', err)
  );
}

// Load our Google fonts and expose their CSS variables
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});
const merriweather = Merriweather({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-merriweather',
});

export default function RootLayout({
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <title>{SEO.title}</title>
        {/* Preload and asynchronously apply the generated layout.css file */}
        <Script id="defer-layout-css" strategy="beforeInteractive">
          {`
            const setup = () => {
              const link = document.querySelector('link[href*="layout.css"]');
              if (!link || link.dataset.processed) return;
              link.dataset.processed = 'true';

              const href = link.href;

              // Preload the stylesheet so it downloads with high priority
              const preload = document.createElement('link');
              preload.rel = 'preload';
              preload.as = 'style';
              preload.href = href;
              preload.fetchPriority = 'high';
              document.head.appendChild(preload);

              // Apply the stylesheet without blocking rendering
              const style = document.createElement('link');
              style.rel = 'stylesheet';
              style.href = href;
              style.media = 'print';
              style.onload = () => {
                style.media = 'all';
              };
              document.head.appendChild(style);

              // Remove the original blocking link
              link.remove();
            };

            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', setup);
            } else {
              setup();
            }
          `}
        </Script>
        <link
          rel="preload"
          href="/images/hero-placeholder.png"
          as="image"
        />
        <link
          rel="alternate"
          href="https://123legaldoc.com/en/"
          hrefLang="en"
        />
        <link
          rel="alternate"
          href="https://123legaldoc.com/es/"
          hrefLang="es"
        />
      </head>
      <body
        className={`${inter.variable} ${merriweather.variable} antialiased flex flex-col min-h-screen overflow-x-hidden`}
      >
        {/* 1) Provide translations to the entire tree */}
        <I18nextProvider i18n={i18n}>
          {/* 2) Mock-auth context for client hooks */}
          <AuthProvider>
            {/* 3) SEO defaults */}
            <DefaultSeo {...SEO} />

            {children}

            {/* Chat widget will load on user interaction. See Footer component. */}
          </AuthProvider>
        </I18nextProvider>

      </body>
    </html>
  );
}
