// src/app/page.tsx
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { LegalDocument } from '@/lib/document-library'; 
import { usStates, documentLibrary } from '@/lib/document-library'; 
import DocTypeSelector from '@/components/DocumentTypeSelector'; // Corrected import path
import { Questionnaire } from '@/components/questionnaire';
import { DisclaimerStep } from '@/components/disclaimer-step';
import { PdfPreview } from '@/components/pdf-preview';
import { ShareDownloadStep } from '@/components/share-download-step';
import ProgressStepper from '@/components/ProgressStepper'; 
import HeroSection from '@/components/landing/HomepageHeroSteps'; 
import ThreeStepSection from '@/components/landing/ThreeStepSection';
import TrustAndTestimonialsSection from '@/components/landing/TrustAndTestimonialsSection';
import { GuaranteeBadge } from '@/components/landing/GuaranteeBadge';
import { PromoBanner } from '@/components/landing/PromoBanner';
import { Button } from '@/components/ui/button'; 
import { useToast } from '@/hooks/use-toast'; 
import { Separator } from '@/components/ui/separator';
import { FileText, FileSignature, Check, Upload, AlertTriangle, Download, ListChecks, Loader2 } from 'lucide-react'; 
import Step1DocumentSelector, { CATEGORY_LIST } from '@/components/Step1DocumentSelector'; 
import StickyFilterBar from '@/components/StickyFilterBar'; 
import { useTranslation } from 'react-i18next';
import { useSearchParams, useRouter } from 'next/navigation'; 


const ShareIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
);

export default function Home() {
  console.log('[page.tsx] Home component rendering...');
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [globalSelectedState, setGlobalSelectedState] = useState<string>(''); 
  const [selectedCategoryForFilter, setSelectedCategoryForFilter] = useState<string | null>(null);
  
  const [isHydrated, setIsHydrated] = useState(false); 

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const workflowSectionId = "workflow-start";

  const scrollToWorkflow = useCallback(() => {
    const section = document.getElementById(workflowSectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleDocumentSelectFromHomepage = useCallback((doc: LegalDocument) => {
    if (!isHydrated) return;
    console.log('[page.tsx] Homepage document selected:', doc.name);
    
    router.push(`/${i18n.language}/docs/${doc.id}/start`);

    toast({ 
        title: t('toasts.docTypeConfirmedTitle'), 
        description: t('toasts.docTypeConfirmedDescription', { docName: doc.name_es && i18n.language === 'es' ? doc.name_es : doc.name }) 
    });
  }, [i18n.language, router, t, toast, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;

    const docIdFromQuery = searchParams.get('docId');
    const categoryFromQuery = searchParams.get('category');
    const searchFromQuery = searchParams.get('search');

    if (searchFromQuery && !globalSearchTerm) {
        setGlobalSearchTerm(searchFromQuery);
        scrollToWorkflow();
    }

    if (categoryFromQuery && !selectedCategoryForFilter) {
        const isValidCategory = CATEGORY_LIST.some(cat => cat.key === categoryFromQuery);
        if (isValidCategory) {
            setSelectedCategoryForFilter(categoryFromQuery);
            scrollToWorkflow();
        }
    }

    if (docIdFromQuery) {
      const foundDoc = documentLibrary.find(d => d.id === docIdFromQuery);
      if (foundDoc && !selectedCategoryForFilter) {
         setSelectedCategoryForFilter(foundDoc.category);
         scrollToWorkflow();
      }
    }
  }, [searchParams, globalSearchTerm, selectedCategoryForFilter, isHydrated, scrollToWorkflow]);

  const renderHomepageContent = () => {
    if (!isHydrated) { 
        // Render a stable placeholder during SSR and initial client render before hydration
        return <div className="text-center py-10"><Loader2 className="h-8 w-8 animate-spin mx-auto" /> <p suppressHydrationWarning>Loading...</p></div>;
    }
    return (
      <Step1DocumentSelector
        selectedCategory={selectedCategoryForFilter}
        onCategorySelect={setSelectedCategoryForFilter}
        onDocumentSelect={handleDocumentSelectFromHomepage} 
        globalSelectedState={globalSelectedState} 
        globalSearchTerm={globalSearchTerm}     
      />
    );
  };

  return (
    <>
      <PromoBanner />
      <HeroSection />
      <ThreeStepSection /> 
      <TrustAndTestimonialsSection />
      <GuaranteeBadge />

      <Separator className="my-12" />

      <section id={workflowSectionId} className="container mx-auto px-4 py-8 md:py-12 scroll-mt-20">
         <div className="max-w-4xl mx-auto">
            {isHydrated && <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
                {t('headline')}
            </h2>}
            {isHydrated && <p className="text-lg md:text-xl text-muted-foreground text-center mb-10">
                {t('subhead')}
            </p>}
            
            {isHydrated && ( 
              <StickyFilterBar
                searchTerm={globalSearchTerm}
                onSearchTermChange={(term) => {
                    setGlobalSearchTerm(term);
                    if (term.trim() !== '' && selectedCategoryForFilter) {
                        setSelectedCategoryForFilter(null);
                    }
                }}
                selectedState={globalSelectedState}
                onSelectedStateChange={setGlobalSelectedState}
              />
            )}

            <div className="mt-8 bg-card p-4 sm:p-6 md:p-8 rounded-xl shadow-2xl border border-border/20">
                {renderHomepageContent()}
            </div>
         </div>
      </section>
    </>
  );
}
