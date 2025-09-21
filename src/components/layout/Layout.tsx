// src/components/layout/Layout.tsx
import React, { Suspense } from 'react';
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
    // Ensure layout spans full viewport width without horizontal scroll leaks
    <div className="flex min-h-screen w-full max-w-[100vw] flex-col overflow-x-hidden bg-background">
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <main className="flex-grow w-full">{children}</main>
      <Footer />
    </div>
  );
}
