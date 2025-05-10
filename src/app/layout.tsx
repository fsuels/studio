// src/app/layout.tsx
/* prettier-ignore */
import './globals.css'; // Ensures Tailwind and global styles are processed
import { ClientProviders } from '@/components/providers/ClientProviders';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import React from 'react';

// ───────── Dev-only i18n helper ─────────
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  import('../../scripts/find-missing-i18n.js').catch(err =>
    console.error('Failed to load find-missing-i18n.js:', err),
  );
}

// ───────── Fonts ─────────
const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

// ───────── <head> metadata ─────────
export const metadata: Metadata = {
  title: '123LegalDoc',
  description: 'AI-Powered Legal Document Generation',
};

// ───────── Root layout (❗ NO whitespace after <html …>) ─────────
/* prettier-ignore */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning><head><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/></head><body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen overflow-x-hidden`}><ClientProviders>{children}</ClientProviders></body></html>
  );
}
