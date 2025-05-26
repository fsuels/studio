/* prettier-ignore */
// src/app/layout.tsx

import './globals.css';
import { Inter, Merriweather } from 'next/font/google';
import Script from 'next/script';
import SEO from '../../next-seo.config.js';
import RootClient from './root-client';

export const metadata = {
  title: SEO.title,
};

// Dev-only helper for catching missing translation keys
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  import('../../scripts/find-missing-i18n.js').catch((err) =>
    console.error('Failed to load find-missing-i18n.js:', err),
  );
}

// Load Google fonts with preloading to prevent layout shift
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  preload: true,
  display: 'swap',
});
const merriweather = Merriweather({
  weight: ['400', '700'],
  subsets: ['latin'],
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
        <link rel="preload" href="/images/hero-placeholder.png" as="image" />
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
        <RootClient>{children}</RootClient>
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
