
import type { Metadata } from 'next'; 
import { Geist, Geist_Mono } from 'next/font/google'; 
import './globals.css'; 
import { ClientProviders } from '@/components/providers/ClientProviders'; 
import React from 'react'; 
// Removed dynamic import of LanguageSwitcher as it's not used here and caused an error.
// The LanguageSwitcher component is correctly imported and used within Header.tsx, which is a client component.

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>{/* Add suppressHydrationWarning and remove whitespace */}
      <head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen overflow-x-hidden`}>
          {/* ClientProviders will handle its placement or Header is client-side */}
          <ClientProviders>
            {children}
          </ClientProviders>
      </body>
    </html>
  );
}

