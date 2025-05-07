
// src/app/page.tsx
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { type LegalDocument, usStates, documentLibrary } from '@/lib/document-library'; 
import DocTypeSelector from '@/components/DocumentTypeSelector'; 
import type { AISuggestion } from '@/components/DocumentTypeSelector';
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

  // State for Step 1 (Document Selection on Homepage)
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [globalSelectedState, setGlobalSelectedState] = useState<string>(''); // e.g., "CA", "NY"
  const [selectedCategoryForFilter, setSelectedCategoryForFilter] = useState<string | null>(null);


  // States for the OLD multi-step flow (now largely superseded by the new /start page)
  // These might be removed or significantly refactored if the entire flow moves off the homepage.
  const [currentStep, setCurrentStep] = useState(1); 
  const [selectedDocument, setSelectedDocument] = useState<LegalDocument | null>(null);
  const [formAnswers, setFormAnswers] = useState<Record<string, any> | null>(null);
  const [disclaimerAgreed, setDisclaimerAgreed] = useState(false);
  const [pdfSigned, setPdfSigned] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [generatedPdfBlob, setGeneratedPdfBlob] = useState<Blob | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);


  const [isHydrated, setIsHydrated] = useState(false); 

  useEffect(() => {
    setIsHydrated(true);
  }, []);


  const user = useMemo(() => ({ uid: 'test_user_123', name: 'Test User', email: 'test@example.com' }), []);

  const workflowSectionId = "workflow-start";

  const scrollToWorkflow = useCallback(() => {
    const section = document.getElementById(workflowSectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // This handler is now for Step1DocumentSelector on the homepage
  const handleDocumentSelectFromHomepage = useCallback((doc: LegalDocument) => {
    if (!isHydrated) return;
    console.log('[page.tsx] Homepage document selected:', doc.name);
    
    // Navigate to the new dedicated wizard start page
    router.push(`/${i18n.language}/docs/${doc.id}/start`);

    // Toast for confirmation
    toast({ 
        title: t('toasts.docTypeConfirmedTitle'), 
        description: t('toasts.docTypeConfirmedDescription', { docName: doc.name_es && i18n.language === 'es' ? doc.name_es : doc.name }) 
    });

    // The old logic of setting selectedDocument and advancing step on homepage is removed
    // as the flow now moves to a new page.
  }, [i18n.language, router, t, toast, isHydrated]);


  // Effect to handle docId and category from query parameters for homepage filtering
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

    // If docId is in query, it likely means user came from an external link
    // or an old bookmark. We'll let Step1DocumentSelector handle displaying it,
    // and selection will trigger navigation via handleDocumentSelectFromHomepage.
    if (docIdFromQuery) {
      const foundDoc = documentLibrary.find(d => d.id === docIdFromQuery);
      if (foundDoc && !selectedCategoryForFilter) {
         // If a doc is specified directly, and no category is set,
         // we can pre-select its category for a better UX on the homepage filter.
         setSelectedCategoryForFilter(foundDoc.category);
         scrollToWorkflow();
      }
    }

  }, [searchParams, globalSearchTerm, selectedCategoryForFilter, isHydrated, scrollToWorkflow]);


  // The renderStepContent and associated logic for steps 2-5 on the homepage 
  // might be removed or significantly changed as the wizard flow is now on a dedicated page.
  // For now, let's keep it minimal on the homepage, focusing on document selection.
  const renderHomepageContent = () => {
    if (!isHydrated) { 
        return <div className="text-center py-10"><Loader2 className="h-8 w-8 animate-spin mx-auto" /> <p>{t('Loading...')}</p></div>;
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

            {apiError && (
                <div className="my-4 p-4 bg-destructive/10 border border-destructive text-destructive rounded-md text-sm">
                    <p><strong>{t('API Error Occurred', {defaultValue: 'API Error Occurred'})}:</strong></p> 
                    <pre className="whitespace-pre-wrap break-all">{apiError}</pre>
                </div>
            )}
            
            {isHydrated && ( // Only render StickyFilterBar on client
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

            {/* No ProgressStepper on homepage for document selection part */}
            {/* ProgressStepper will be on the dedicated wizard page */}

            <div className="mt-8 bg-card p-4 sm:p-6 md:p-8 rounded-xl shadow-2xl border border-border/20">
                {renderHomepageContent()}
            </div>

             {/* Back button logic might change or be removed from homepage flow */}
         </div>
      </section>
    </>
  );
}
