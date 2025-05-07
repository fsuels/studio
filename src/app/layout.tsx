
import type { Metadata } from 'next'; // Import Metadata type
import { Geist, Geist_Mono } from 'next/font/google'; // Import font modules
import './globals.css'; // Import global CSS
// Removed AnimatePresence and MotionConfig as they are not used here, can be added in ClientProviders if needed.
import { ClientProviders } from '@/components/providers/ClientProviders'; // Import the new client component
import React from 'react'; // Import React
import { ThemeProvider } from 'next-themes'; // Import ThemeProvider

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

// RootLayout remains a Server Component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning> {/* Add suppressHydrationWarning */}
      <head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen overflow-x-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem> {/* ThemeProvider wraps ClientProviders */}
          <ClientProviders>
            {children}
          </ClientProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}

