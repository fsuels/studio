'use client';
import dynamic from 'next/dynamic';
import React from 'react';

interface SignWellPageClientProps {
  params: { locale: 'en' | 'es' };
}

const SignWellClientContent = dynamic(
  () => import('./signwell-client-content'),
  { ssr: false },
);

export default function SignWellPageClient({
  params,
}: SignWellPageClientProps) {
  return <SignWellClientContent params={params} />;
}
