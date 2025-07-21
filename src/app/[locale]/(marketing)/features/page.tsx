// src/app/[locale]/features/page.tsx
import React from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load the heavy features client content
const FeaturesClientContent = dynamic(() => import('./features-client-content'), {
  loading: () => (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <Skeleton className="h-12 w-96 mx-auto" />
        <Skeleton className="h-6 w-[600px] mx-auto" />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-6 border rounded-lg space-y-4">
            <Skeleton className="h-12 w-12" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
    </div>
  ),
});

// generateStaticParams is a server-side function and can be exported from a Server Component page
export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

// This page.tsx itself is a Server Component
export default function FeaturesPage() {
  // The locale from params can be passed to FeaturesClientContent if needed,
  // but useTranslation hook in FeaturesClientContent will get it from I18nProvider context.
  return <FeaturesClientContent />;
}
