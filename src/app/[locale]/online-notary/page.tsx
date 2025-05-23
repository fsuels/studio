// src/app/[locale]/online-notary/page.tsx
import React from 'react'
import OnlineNotaryClientContent from './online-notary-client-content'

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }]
}

interface OnlineNotaryPageProps {
  params: { locale: 'en' | 'es' }
}

export default function OnlineNotaryPage({ params }: OnlineNotaryPageProps) {
  const { locale } = params
  return <OnlineNotaryClientContent />
}
