// src/app/[locale]/features/page.tsx
import React from 'react';
import FeaturesClientContent from './features-client-content'; // Import the client component

// generateStaticParams is a server-side function and can be exported from a Server Component page
export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

interface FeaturesPageProps {
  params: { locale: string }; // Next.js passes params automatically
}

// This page.tsx itself is a Server Component
export default function FeaturesPage({ params }: FeaturesPageProps) {
  // The locale from params can be passed to FeaturesClientContent if needed,
  // but useTranslation hook in FeaturesClientContent will get it from I18nProvider context.
  return <FeaturesClientContent />;
}
