/* prettier-ignore */
/* src/app/layout.tsx */

import './globals.css';
import localFont from 'next/font/local';
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
  title: SEOConfig.title,
  description: SEOConfig.description,
  alternates: {
    languages: {
      en: '/en/',
      es: '/es/',
    },
  },
} as const;

export const viewport = {
  width: 'device-width',
  initialScale: 1,
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
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${merriweather.variable} antialiased flex flex-col min-h-screen overflow-x-hidden`}
        suppressHydrationWarning
      >
        {criticalCSS && (
          <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
        )}
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
