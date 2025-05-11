// src/app/[locale]/signup/page.tsx
import React from 'react';
import SignUpClientContent from './signup-client-content';

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

interface SignUpPageProps {
  params: {
    locale: 'en' | 'es';
  };
}

export default function SignUpPage({ params }: SignUpPageProps) {
  const { locale } = params;
  return <SignUpClientContent locale={locale} />;
}
