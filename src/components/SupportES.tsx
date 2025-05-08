// src/components/SupportES.tsx
'use client';
import SupportPageContent from '@/components/SupportPageContent';

// This component implies a Spanish context.
// The actual language rendering is handled by i18next within SupportPageContent,
// assuming I18nClientProvider sets the context to 'es' for the /es/... route.
export default function SupportES() {
  return <SupportPageContent locale="es" />;
}
