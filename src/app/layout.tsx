
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster
import { PromoBanner } from '@/components/landing/PromoBanner';
import { Footer } from '@/components/layout/Footer';
import I18nClientProvider from '@/components/providers/I18nProvider'; // Import the i18n provider

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '123LegalDoc', // Updated app title
  description: 'AI-Powered Legal Document Generation', // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        {/* Wrap children with the I18nProvider */}
        <I18nClientProvider>
          <PromoBanner />
          <main className="flex-grow">{children}</main>
          <Footer />
          <Toaster /> {/* Add Toaster component */}
        </I18nClientProvider>
      </body>
    </html>
  );
}
