// src/app/[locale]/signwell/page.tsx
export const revalidate = 3600; // Revalidate every hour

import type { Metadata } from 'next';
import React from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load the SignWell page client for better code splitting
const SignWellPageClient = dynamic(() => import('./SignWellPageClient'), {
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Hero Section Skeleton */}
        <div className="text-center space-y-6">
          <Skeleton className="h-16 w-[600px] mx-auto" />
          <Skeleton className="h-6 w-[800px] mx-auto" />
          <div className="flex justify-center gap-4">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
        
        {/* Features Grid Skeleton */}
        <div className="grid md:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
              <Skeleton className="h-12 w-12" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </div>
        
        {/* CTA Section Skeleton */}
        <div className="text-center bg-white p-12 rounded-lg space-y-6">
          <Skeleton className="h-10 w-96 mx-auto" />
          <Skeleton className="h-6 w-[500px] mx-auto" />
          <Skeleton className="h-12 w-48 mx-auto" />
        </div>
      </div>
    </div>
  ),
});

interface SignWellPageProps {
  params: { locale: 'en' | 'es' } & Record<string, string>;
}

/* ───────── Static metadata (no i18next on server) ───────── */
const META = {
  en: {
    title: 'eSign Documents Online Securely | 123LegalDoc',
    description:
      'Upload, prepare, and send documents for legally binding electronic signatures with 123LegalDoc, powered by SignWell. Fast, secure, and compliant.',
  },
  es: {
    title: 'Firmar Documentos Electrónicamente | 123LegalDoc',
    description:
      'Suba, prepare y envíe documentos para firmas electrónicas legalmente vinculantes con 123LegalDoc, impulsado por SignWell. Rápido, seguro y conforme.',
  },
} as const;

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export async function generateMetadata({
  params,
}: {
  params: { locale: 'en' | 'es' };
}): Promise<Metadata> {
  const { title, description } = META[params.locale] ?? META.en;
  return { title, description, openGraph: { title, description } };
}

export default function SignWellPage({ params }: SignWellPageProps) {
  return <SignWellPageClient params={params} />;
}
