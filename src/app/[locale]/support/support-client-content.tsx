// src/app/[locale]/support/support-client-content.tsx
'use client'

import { useParams } from 'next/navigation'
import SupportContent from '@/components/SupportContent' 
import React from 'react';

interface SupportClientContentProps {
  locale: 'en' | 'es';
}

export default function SupportClientContent({ locale }: SupportClientContentProps) {
  // const { locale: localeFromParams } = useParams() as { locale: 'en' | 'es' };
  // Prioritize prop, but useParams could be a fallback or for other uses if needed.
  // For this structure, the passed `locale` prop is sufficient and cleaner.

  return <SupportContent locale={locale} />;
}
