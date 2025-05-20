
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

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta name="description" content={SEO.description} />
        <title>{SEO.title}</title>
        {/* Preload and defer the generated layout.css file without blocking rendering */}
        <Script id="defer-layout-css" strategy="beforeInteractive">
          {`
            const process = (link) => {
              if (!link || link.dataset.processed) return;
              link.dataset.processed = 'true';

              const href = link.href;

              // Preload the stylesheet with high priority
              const preload = document.createElement('link');
              preload.rel = 'preload';
              preload.as = 'style';
              preload.href = href;
              preload.fetchPriority = 'high';
              document.head.appendChild(preload);

              // Apply the stylesheet asynchronously
              const style = document.createElement('link');
              style.rel = 'stylesheet';
              style.href = href;
              style.media = 'print';
              style.onload = () => { style.media = 'all'; };
              document.head.appendChild(style);

              // Remove the original blocking link
              link.remove();
            };

            const init = () => {
              const link = document.querySelector('link[href*="layout.css"]');
              if (link) process(link);
            };

            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', init);
            } else {
              init();
            }

            // Watch for the stylesheet being injected after this script runs
            const observer = new MutationObserver((mutations) => {
              for (const m of mutations) {
                for (const node of m.addedNodes) {
                  if (
                    node.tagName === 'LINK' &&
                    node.href &&
                    node.href.includes('layout.css')
                  ) {
                    process(node);
                  }
                }
              }
            });
            observer.observe(document.head, { childList: true });
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
        <RootClient>
          {children}
        </RootClient>
      </body>
    </html>
  );
}
