/* prettier-ignore */
/* src/app/layout.tsx */

import './globals.css';
import localFont from 'next/font/local';
import Script from 'next/script';
import SEO from '../../next-seo.config.js';
import RootClient from './root-client';

export const metadata = {
  title: SEO.title,
};

/* ------------------------------------------------------------------
   Use local WOFF2 files so the build works offline in Firebase Studio.
   Put the font files in /public/fonts/ (one-time copy) and commit them.
-------------------------------------------------------------------*/
const inter = localFont({
  src: '../../public/fonts/Inter-Variable.woff2',
  variable: '--font-geist-sans',
  preload: true,
  display: 'swap',
});
const merriweather = localFont({
  src: '../../public/fonts/Merriweather-Variable.woff2',
  variable: '--font-merriweather',
  preload: true,
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta name="description" content={SEO.description} />
        <title>{SEO.title}</title>

        {/* See README/fonts.md for the one-time download step */}

        {/* Preload and asynchronously apply the generated layout.css file */}
        <Script id="defer-layout-css" strategy="beforeInteractive">
          {`
            const setup = () => {
              const link = document.querySelector('link[href*="layout.css"]');
              if (!link || link.dataset.processed) return;
              link.dataset.processed = 'true';
              const href = link.href;
              const preload = document.createElement('link');
              preload.rel = 'preload';
              preload.as = 'style';
              preload.href = href;
              preload.fetchPriority = 'high';
              document.head.appendChild(preload);
              const style = document.createElement('link');
              style.rel = 'stylesheet';
              style.href = href;
              style.media = 'print';
              style.onload = () => (style.media = 'all');
              document.head.appendChild(style);
              link.remove();
            };
            (document.readyState === 'loading')
              ? document.addEventListener('DOMContentLoaded', setup)
              : setup();
          `}
        </Script>
        <link rel="preload" href="/images/hero-homepage.png" as="image" />
        <link rel="preload" href="/images/signwell-hero.svg" as="image" />
        <link rel="alternate" href="https://123legaldoc.com/en/" hrefLang="en" />
        <link rel="alternate" href="https://123legaldoc.com/es/" hrefLang="es" />
      </head>

      <body
        className={`${inter.variable} ${merriweather.variable} antialiased flex flex-col min-h-screen overflow-x-hidden`}
      >
        <RootClient>{children}</RootClient>
        {/* global gradient defs */}
        <svg width="0" height="0">
          <linearGradient id="goldGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#fcd34d" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </svg>
      </body>
    </html>
  );
}
