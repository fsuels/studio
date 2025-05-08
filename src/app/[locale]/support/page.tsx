// src/app/[locale]/support/page.tsx
'use client'

import { useParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import SupportContent from '@/components/SupportContent' 
import React, { useEffect } from 'react'; // Import React for useEffect

export default function SupportPage() {
  const { locale } = useParams() as { locale: 'en' | 'es' }
  const { i18n } = useTranslation()

  useEffect(() => {
    if (locale && i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale, i18n]);

  if (!locale) {
    // Handle case where locale might not be available immediately,
    // though Next.js routing should provide it.
    return <div>Loading support information...</div>; 
  }

  return (
    // The container and main tag are now part of SupportContent
    <SupportContent locale={locale} />
  )
}
