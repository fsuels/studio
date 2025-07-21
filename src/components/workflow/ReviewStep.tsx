// src/components/ReviewStep.tsx
'use client';

import React from 'react';
import type { LegalDocument } from '@/lib/document-library';
import ReviewStepContainer from './ReviewStep/ReviewStepContainer';

interface ReviewStepProps {
  doc: LegalDocument;
  locale: 'en' | 'es';
}

export default function ReviewStep({ doc, locale }: ReviewStepProps) {
  return <ReviewStepContainer doc={doc} locale={locale} />;
}
