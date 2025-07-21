// src/components/WizardLayout.tsx
'use client';

import Link from 'next/link';
import type { LegalDocument } from '@/lib/document-library';
// WizardForm and PreviewPane are no longer directly rendered by WizardLayout
// They are now part of the StartWizardPage structure.
import React from 'react';
import { useTranslation } from 'react-i18next';

interface WizardLayoutProps {
  locale: 'en' | 'es';
  doc: LegalDocument;
  // onComplete might be handled by WizardForm directly now
  children: React.ReactNode; // Allow children to be passed for more flexible layout
}

export default function WizardLayout({
  locale,
  doc,
  children,
}: WizardLayoutProps) {
  const { t } = useTranslation('common');

  const documentDisplayName =
    locale === 'es'
      ? doc.translations?.es?.name || doc.translations?.en?.name || doc.name
      : doc.translations?.en?.name || doc.name || doc.translations?.es?.name;

  // This component now acts more as a structural wrapper if still needed.
  // The core form and preview logic is expected to be handled by its children,
  // likely the StartWizardPage which then uses WizardForm and PreviewPane.

  return (
    <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <nav className="text-sm mb-6 space-x-1 text-muted-foreground">
        <Link
          href={`/${locale}`}
          className="hover:text-primary transition-colors"
        >
          {t('Home', { ns: 'translation' })}
        </Link>
        <span>/</span>
        <Link
          href={`/${locale}/docs/${doc.id}`}
          className="hover:text-primary transition-colors"
        >
          {documentDisplayName}
        </Link>
        <span>/</span>
        <span className="text-foreground font-semibold">
          {t('Create', { ns: 'translation' })}
        </span>
      </nav>
      {/* The actual content (WizardForm, PreviewPane) will be passed as children */}
      {children}
    </main>
  );
}
