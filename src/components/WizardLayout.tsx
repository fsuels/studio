
// src/components/WizardLayout.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { LegalDocument } from '@/lib/document-library'; // Changed to LegalDocument
import WizardForm from './WizardForm';
import PreviewPane from './PreviewPane'; 
import React, { useEffect } from 'react'; // Import useEffect
import { z } from 'zod';

interface WizardLayoutProps {
  locale: 'en' | 'es';
  doc: LegalDocument; // Changed to LegalDocument
  onComplete: (checkoutUrl: string) => void; // Keep this prop
}

export default function WizardLayout({ locale, doc, onComplete }: WizardLayoutProps) {
  const router = useRouter();
  const formSchema = doc.schema || z.object({}); 
  
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {}, // Initialize with empty or load from storage
    mode: 'onBlur', 
  });

  // Load draft from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const draft = localStorage.getItem(`draft-${doc.id}-${locale}`);
      if (draft) {
        try {
          methods.reset(JSON.parse(draft));
        } catch (e) {
          console.error("Failed to parse draft from localStorage", e);
          localStorage.removeItem(`draft-${doc.id}-${locale}`); // Clear invalid draft
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc.id, locale, methods.reset]); // methods.reset might not be stable, consider specific fields if issues arise

  return (
    <FormProvider {...methods}>
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <nav className="text-sm mb-6 space-x-1 text-muted-foreground">
          <Link href={`/${locale}`} className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          {/* Link to document detail page (if exists) or display name */}
          <span className="text-foreground font-medium">{doc.name_es && locale === 'es' ? doc.name_es : doc.name}</span>
          <span>/</span>
          <span className="text-foreground font-semibold">Create</span>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-start">
          <div className="bg-card p-6 rounded-xl shadow-xl border border-border">
            <WizardForm locale={locale} doc={doc} onComplete={onComplete} />
          </div>

          <div className="mt-8 lg:mt-0 lg:sticky lg:top-24 self-start">
             <div className="bg-card p-4 rounded-xl shadow-xl border border-border min-h-[400px] lg:min-h-[calc(100vh-10rem)] max-h-[calc(100vh-6rem)] overflow-y-auto">
                <h3 className="text-xl font-semibold mb-4 text-center text-card-foreground">Live Preview</h3>
                <PreviewPane
                    locale={locale}
                    docId={doc.id}
                    templatePath={locale === 'es' && doc.templatePath_es ? doc.templatePath_es : doc.templatePath}
                    watch={methods.watch} 
                />
             </div>
          </div>
        </div>
      </main>
    </FormProvider>
  );
}
