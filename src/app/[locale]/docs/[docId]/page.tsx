// src/app/[locale]/docs/[docId]/page.tsx
'use client';

import { useParams, notFound } from 'next/navigation';
import DocumentDetail from '@/components/DocumentDetail'; // Component to render the detail
import { documentLibrary } from '@/lib/document-library'; // Assuming this is where doc configs are
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import React from 'react';


export default function DocPage() {
  const params = useParams();
  const { t } = useTranslation();

  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale as 'en' | 'es';
  const docId = Array.isArray(params.docId) ? params.docId[0] : params.docId as string;

  const docConfig = documentLibrary.find(d => d.id === docId);

  if (!docConfig) {
    return notFound();
  }
  
  const documentDisplayName = locale === 'es' && docConfig.name_es ? docConfig.name_es : docConfig.name;


  return (
    <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
       <nav className="text-sm mb-6 space-x-1 text-muted-foreground">
          <Link href={`/${locale}`} className="hover:text-primary transition-colors">
            {t('Home', { ns: 'translation' })} 
          </Link>
          <span>/</span>
           <span className="text-foreground font-medium">
            {documentDisplayName}
          </span>
        </nav>
        
        <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="lg:order-2">
                <h1 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
                    {documentDisplayName}
                </h1>
                <Badge variant="outline" className="mb-3 border-primary text-primary bg-primary/10">
                   {t('Attorney-Drafted', {defaultValue: 'Attorney-Drafted'})}
                </Badge>
                <p className="text-lg text-muted-foreground mb-6">
                   {locale === 'es' && docConfig.description_es ? docConfig.description_es : docConfig.description}
                </p>
                <div className="flex items-baseline space-x-2 mb-6">
                    <span className="text-3xl font-bold text-primary">${docConfig.basePrice.toFixed(2)}</span>
                    <span className="text-sm text-muted-foreground">{t('pricing.perDocument', {defaultValue: 'per document'})}</span>
                </div>
                <Button size="lg" className="w-full sm:w-auto text-base" asChild>
                  <Link href={`/${locale}/docs/${docId}/start`}>
                    {locale === 'es' ? t('Start for Free', {lng: 'es', defaultValue: 'Comenzar Gratis'}) : t('Start for Free', {defaultValue: 'Start for Free'})}
                  </Link>
                </Button>
            </div>
            <div className="lg:order-1">
                 <DocumentDetail locale={locale} docId={docId} />
            </div>
        </div>
    </main>
  );
}