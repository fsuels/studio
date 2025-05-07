// src/components/WizardLayout.tsx
'use client';

import Link from 'next/link';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { LegalDocument } from '@/lib/document-library';
import WizardForm from './WizardForm';
import PreviewPane from './PreviewPane'; // Assuming PreviewPane is adapted or created
import React from 'react';
import { z } from 'zod';

interface WizardLayoutProps {
  locale: 'en' | 'es';
  doc: LegalDocument;
  onComplete: (checkoutUrl: string) => void;
}

export default function WizardLayout({ locale, doc, onComplete }: WizardLayoutProps) {
  const formSchema = doc.schema || z.object({}); // Fallback for docs without explicit Zod schema
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(`draft-${doc.id}-${locale}`) || '{}') : {},
    mode: 'onBlur', // Validate on blur
  });

  return (
    <FormProvider {...methods}>
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"> {/* Increased max-width and padding */}
        {/* Breadcrumb */}
        <nav className="text-sm mb-6 space-x-1 text-muted-foreground">
          <Link href={`/${locale}`} className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          {/* Link to a potential document detail page, if exists, or just show name */}
          {/* For now, making it non-clickable if no specific detail page exists beyond the wizard start */}
          <span className="text-foreground font-medium">{doc.name_es && locale === 'es' ? doc.name_es : doc.name}</span>
          <span>/</span>
          <span className="text-foreground font-semibold">Create</span>
        </nav>

        {/* Two-column grid */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-start"> {/* Increased gap */}
          {/* Left column: Form */}
          <div className="bg-card p-6 rounded-xl shadow-xl border border-border">
            <WizardForm locale={locale} doc={doc} onComplete={onComplete} />
          </div>

          {/* Right column: Live Preview, sticky on large screens */}
          <div className="mt-8 lg:mt-0 lg:sticky lg:top-24 self-start">
             <div className="bg-card p-4 rounded-xl shadow-xl border border-border min-h-[400px] lg:min-h-[calc(100vh-10rem)] max-h-[calc(100vh-6rem)] overflow-y-auto">
                <h3 className="text-xl font-semibold mb-4 text-center text-card-foreground">Live Preview</h3>
                <PreviewPane
                    locale={locale}
                    docId={doc.id}
                    templatePath={locale === 'es' && doc.templatePath_es ? doc.templatePath_es : doc.templatePath}
                    watch={methods.watch} // Pass watch for live updates
                />
             </div>
          </div>
        </div>
      </main>
    </FormProvider>
  );
}
