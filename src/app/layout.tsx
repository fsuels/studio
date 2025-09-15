/* prettier-ignore */
/* src/app/layout.tsx */

import './globals.css';
import localFont from 'next/font/local';
import Script from 'next/script';
import Head from 'next/head';
import SEOConfig from '../../next-seo.config';
import { readFileSync } from 'fs';
import { join } from 'path';

// Read critical CSS at build time for inlining
const criticalCSS = (() => {
  try {
    return readFileSync(join(process.cwd(), 'src/styles/critical.css'), 'utf8');
  } catch {
    return '';
  }
})();

export const metadata = {
  title: SEOConfig.title, // Use imported config
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
  // Use the preview or production origin from env
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  const headElements = [
    <meta
      key="viewport"
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1"
    />,
    <meta
      key="description"
      name="description"
      content={SEOConfig.description}
    />,
    <title key="title">{SEOConfig.title}</title>,
    // Enhanced font preloading for critical performance
    <link
      key="preload-inter"
      rel="preload"
      href="/fonts/Inter-Variable.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
    />,
    <link
      key="preload-merriweather"
      rel="preload"
      href="/fonts/Merriweather-Variable.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
    />,
    // DNS prefetch for external resources
    <link key="dns-firebase" rel="dns-prefetch" href="//firebasestorage.googleapis.com" />,
    <link key="dns-google" rel="dns-prefetch" href="//fonts.googleapis.com" />,
    <Script key="defer-css" id="defer-layout-css" strategy="beforeInteractive">
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
    </Script>,
    <link key="alt-en" rel="alternate" href={`${siteUrl}/en/`} hrefLang="en" />,
    <link key="alt-es" rel="alternate" href={`${siteUrl}/es/`} hrefLang="es" />,
    // Inline critical CSS for immediate rendering
    criticalCSS && <style key="critical-css" dangerouslySetInnerHTML={{ __html: criticalCSS }} />,
  ].filter(Boolean);

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head>{headElements}</Head>
      <body
        className={`${inter.variable} ${merriweather.variable} antialiased flex flex-col min-h-screen overflow-x-hidden`}
        suppressHydrationWarning
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var body = document.body;
                  if (body) {
                    body.removeAttribute('ap-style');
                    body.removeAttribute('spellcheck');
                    body.removeAttribute('cz-shortcut-listen');
                    body.removeAttribute('data-new-gr-c-s-check-loaded');
                    body.removeAttribute('data-gr-ext-installed');
                  }
                } catch (e) {}
              })();
            `
          }}
        />
        {children}
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
