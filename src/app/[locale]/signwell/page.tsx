// src/app/[locale]/signwell/page.tsx
import React from 'react';
import SignWellClientContent from './signwell-client-content'; // Import the new client component

// generateStaticParams remains here
export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

interface SignWellPageProps {
  params: { locale: 'en' | 'es' };
}

export default function SignWellPage({ params }: SignWellPageProps) {
  // This Server Component now simply renders the Client Component
  return <SignWellClientContent params={params} />;
}
