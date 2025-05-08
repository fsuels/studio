// app/layout.tsx
import './globals.css';
import { ClientProviders } from '@/components/providers/ClientProviders';
// Header and Footer are now rendered by ClientProviders
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import React from 'react';

// Conditionally import the script for development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  import('../../scripts/find-missing-i18n.js').catch(err => {
    console.error("Failed to load find-missing-i18n.js script:", err);
  });
}


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '123LegalDoc',
  description: 'AI-Powered Legal Document Generation',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>{/* Ensure no whitespace directly after this tag */}
      <head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
          <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY&libraries=places" async defer></script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen overflow-x-hidden`}>
        <ClientProviders>
          {children} {/* children here is the content from [locale]/page.tsx etc. */}
        </ClientProviders>
      </body>
    </html>
  );
}
