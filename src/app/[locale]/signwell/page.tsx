// src/app/[locale]/signwell/page.tsx
import React from 'react'
import SignwellClientContent from './signwell-client-content'

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }]
}

interface PageProps {
  params: { locale: 'en' | 'es' }
}

export default function SignwellPage({ params }: PageProps) {
  const { locale } = params
  return <SignwellClientContent locale={locale} />
}
