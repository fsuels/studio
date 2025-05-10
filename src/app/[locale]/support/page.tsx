// src/app/[locale]/support/page.tsx
'use client'

import { useParams } from 'next/navigation'
import SupportContent from '@/components/SupportContent'   // your actual support component
import React from 'react'; // Import React

// Add generateStaticParams for dynamic routes with static export
export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

/**
 * Generic Support page that works for **any** locale segment (/en, /es, /fr …)
 * We don't call i18n.changeLanguage() here – the I18nProvider in _app/layout
 * is already initialised with the locale taken from the URL, so both
 * server-side HTML and client-side hydrate in the same language. No mismatch!
 */
export default function LocalisedSupportPage() {
  const { locale } = useParams() as { locale: 'en' | 'es' }; // Ensure locale is typed correctly

  // Just pass the locale down so SupportContent can pick the right translations
  return <SupportContent locale={locale} />;
}
