
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ClientProviders } from '@/components/providers/ClientProviders'; // Import the new client component
import React from 'react'; // Import React

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
  // Add viewport meta tag here if not done globally
  // viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

// RootLayout remains a Server Component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Remove useState and useEffect from here

  return (
    <html lang="en">
      <head>
          {/* Add viewport meta tag here */}
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        {/* Use the ClientProviders component to wrap children and handle client-side logic */}
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}

