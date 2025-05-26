// src/app/[locale]/pricing/page.tsx
import React from 'react';
import PricingClientContent from './pricing-client-content';
import type { PageProps } from 'next';

// Add generateStaticParams for dynamic routes with static export
export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export default function PricingPage({ params }: PageProps<{ locale: 'en' | 'es' }>) {
  const { locale } = params;
  // The rest of the page content including client-side hooks and logic
  // is now in PricingClientContent.tsx
  return <PricingClientContent locale={locale} />;
}
