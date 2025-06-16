// src/app/[locale]/pricing/page.tsx
import React from 'react';
import PricingClientContent from './pricing-client-content';
interface PricingPageProps {
  params: { locale: 'en' | 'es' } & Record<string, string>;
}

// Add generateStaticParams for dynamic routes with static export
export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export default function PricingPage({ params }: PricingPageProps) {
  const { locale } = params;
  // The rest of the page content including client-side hooks and logic
  // is now in PricingClientContent.tsx
  return <PricingClientContent locale={locale} />;
}
