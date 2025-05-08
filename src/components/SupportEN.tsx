// src/components/SupportEN.tsx
'use client';
import SupportPageContent from '@/components/SupportPageContent';

// This component implies an English context.
// The actual language rendering is handled by i18next within SupportPageContent,
// assuming I18nClientProvider sets the context to 'en' for the /en/... route.
export default function SupportEN() {
  return <SupportPageContent locale="en" />;
}
