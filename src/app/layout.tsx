/* prettier-ignore */
/* src/app/layout.tsx */

import fs from 'fs';
import path from 'path';

const globalCss = fs.readFileSync(
  path.join(process.cwd(), 'src/app/globals.css'),
  'utf8',
);
import localFont from 'next/font/local';
import Script from 'next/script';
import Head from 'next/head';
import SEOConfig from '../../next-seo.config.ts'; // Changed import
import RootClient from './root-client';

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
  const headElements = [
    <meta
      key="viewport"
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1"
    />,
    <meta key="description" name="description" content={SEOConfig.description} />,
    <title key="title">{SEOConfig.title}</title>,
    <style key="globals" dangerouslySetInnerHTML={{ __html: globalCss }} />,
    <link key="preload-hero" rel="preload" href="/images/hero-homepage.png" as="image" />,
    <link key="preload-signwell" rel="preload" href="/images/signwell-hero.svg" as="image" />,
    <link key="alt-en" rel="alternate" href="https://123legaldoc.com/en/" hrefLang="en" />,
    <link key="alt-es" rel="alternate" href="https://123legaldoc.com/es/" hrefLang="es" />,
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <Head>{headElements}</Head><body
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
