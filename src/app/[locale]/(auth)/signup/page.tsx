// src/app/[locale]/signup/page.tsx
import React from 'react';
import SignUpClientContent from './signup-client-content';

// Force dynamic rendering for form handling and real-time validation
export const dynamic = 'force-dynamic';

interface SignUpPageProps {
  params: Promise<{
    locale: 'en' | 'es';
  }>;
}

export default async function SignUpPage({ params }: SignUpPageProps) {
  const { locale } = await params;
  return <SignUpClientContent locale={locale} />;
}
