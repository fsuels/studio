// src/app/[locale]/pricing/page.tsx
import React from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load pricing page for better performance
const PricingClientContent = dynamic(() => import('./pricing-client-content'), {
  loading: () => (
    <div className="container mx-auto px-4 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <Skeleton className="h-12 w-96 mx-auto" />
        <Skeleton className="h-6 w-[600px] mx-auto" />
      </div>
      
      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-8 border-2 rounded-lg space-y-6">
            <div className="text-center space-y-2">
              <Skeleton className="h-6 w-24 mx-auto" />
              <Skeleton className="h-10 w-32 mx-auto" />
              <Skeleton className="h-4 w-40 mx-auto" />
            </div>
            <div className="space-y-3">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
      
      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48 mx-auto" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 border rounded-lg space-y-2">
            <Skeleton className="h-6 w-80" />
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
    </div>
  ),
});

// Add generateStaticParams for dynamic routes with static export
export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: 'en' | 'es' } & Record<string, string>>;
}) {
  const { locale } = await params;
  // The rest of the page content including client-side hooks and logic
  // is now in PricingClientContent.tsx
  return <PricingClientContent locale={locale} />;
}
