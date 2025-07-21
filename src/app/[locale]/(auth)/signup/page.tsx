// src/app/[locale]/signup/page.tsx
import React from 'react';
import SignUpClientContent from './signup-client-content';

// Force dynamic rendering for form handling and real-time validation
export const dynamic = 'force-dynamic';

interface SignUpPageProps {
  params: {
    locale: 'en' | 'es';
  };
}

export default function SignUpPage({ params }: SignUpPageProps) {
  const { locale } = params;
  return <SignUpClientContent locale={locale} />;
}
