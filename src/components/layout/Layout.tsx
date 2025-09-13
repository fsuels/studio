// src/components/layout/Layout.tsx
import React from 'react';
import Header from './Header/index'; // Import from Header directory
import dynamic from 'next/dynamic';
const Footer = dynamic(() => import('./Footer').then(m => m.Footer), {
  ssr: true,
  loading: () => null,
});

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    // Use w-full max-w-screen to prevent exceeding screen width
    <div className="flex min-h-screen flex-col w-full max-w-screen overflow-x-hidden mx-auto">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
