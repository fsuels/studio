/* prettier-ignore */
// src/app/layout.tsx
import './globals.css';
// import { ClientProviders } from '@/components/providers/ClientProviders'; // Already in [locale]/layout.tsx
import type { Metadata } from 'next';
import { Inter, Merriweather } from 'next/font/google';
// import { GeistMono } from 'geist/font'; // Temporarily commented out
import React from 'react';
import { DefaultSeo } from 'next-seo';
import SEO from '../../next-seo.config.js'; // Corrected import path to root
import Script from 'next/script';
import { AuthProvider } from '@/hooks/useAuth.tsx'; // Updated import path

// Dev-only i18n helper
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // @ts-ignore Property 'then' does not exist on type 'void'.
  import('../../scripts/find-missing-i18n.js').catch(err =>
    console.error('Failed to load find-missing-i18n.js:', err),
  );
}

// Fonts
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const merriweather = Merriweather({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-merriweather',
});

// const geistMono = GeistMono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// }); // Temporarily commented out

export const metadata: Metadata = {
  // Metadata is now primarily handled by next-seo.config.js and DefaultSeo
  // title: '123LegalDoc', // Default title can be set in next-seo.config.js
  // description: 'AI-Powered Legal Document Generation', // Default description can be set in next-seo.config.js
};

/* prettier-ignore */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  return (
    /* prettier-ignore */
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        {/* The Google Maps script will be loaded by next/script below */}
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="preload" href="/images/hero-placeholder.png" as="image" />
        <link rel="alternate" href="https://123legaldoc.com/en/" hrefLang="en" />
        <link rel="alternate" href="https://123legaldoc.com/es/" hrefLang="es" />
      </head>
      <body className={`${inter.variable} ${merriweather.variable} antialiased flex flex-col min-h-screen overflow-x-hidden`}>
        <AuthProvider>
          {/* <DefaultSeo {...SEO} /> */}
          {children}
          <Script defer src="https://cdn.intercom.io/widget.js" strategy="lazyOnload" />
        </AuthProvider>
        {/* Load Google Maps API using next/script */}
        {googleMapsApiKey && (
          <Script
            src={`https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places&loading=async`}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
