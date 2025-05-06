// src/app/page.tsx
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { LegalDocument } from '@/lib/document-library';
import { usStates, documentLibrary } from '@/lib/document-library'; 
import DocTypeSelector, { type AISuggestion } from '@/components/DocumentTypeSelector'; 
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
import Step1DocumentSelector from '@/components/Step1DocumentSelector'; 
import StickyFilterBar from '@/components/StickyFilterBar'; // Import StickyFilterBar


const ShareIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
);

export default function Home() {
  console.log('[page.tsx] Home component rendering...');
  const { t, i18n } = useTranslation();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1); 
  const [selectedDocument, setSelectedDocument] = useState<LegalDocument | null>(null);
  const [formAnswers, setFormAnswers] = useState<Record<string, any> | null>(null);
  const [disclaimerAgreed, setDisclaimerAgreed] = useState(false);
  const [pdfSigned, setPdfSigned] = useState(false);

  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [globalSelectedState, setGlobalSelectedState] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [generatedPdfBlob, setGeneratedPdfBlob] = useState<Blob | null>(null);

  const [apiError, setApiError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false); // Hydration check

  useEffect(() => {
    setIsHydrated(true);
  }, []);


  const user = useMemo(() => ({ uid: 'test_user_123', name: 'Test User', email: 'test@example.com' }), []);

  const isDocumentConfirmed = !!selectedDocument;
  const areDetailsProvided = !!formAnswers;

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);


  const handleDocumentSelect = useCallback((doc: LegalDocument) => {
    console.log('[page.tsx] handleDocumentSelect called with doc:', doc);
    setSelectedDocument(doc);
    setCurrentStep(2); 
    scrollToTop();
    if (isHydrated) { // Ensure toast is called only on client
        toast({ title: t('toasts.docTypeConfirmedTitle'), description: t('toasts.docTypeConfirmedDescription', { docName: doc.name }) });
    }
  }, [scrollToTop, t, toast, isHydrated]);


  const handleAnswersSubmit = useCallback((answers: Record<string, any>) => {
    console.log('[page.tsx] handleAnswersSubmit called with answers:', answers);
    setFormAnswers(answers);
    setCurrentStep(3); 
    scrollToTop();
    if (isHydrated) {
        toast({ title: t('toasts.detailsRecordedTitle'), description: t('toasts.detailsRecordedDescription') });
    }
  }, [scrollToTop, t, toast, isHydrated]);

  const handleDisclaimerAgree = useCallback(() => {
    console.log('[page.tsx] handleDisclaimerAgree called');
    setDisclaimerAgreed(true);
    scrollToTop();
  }, [scrollToTop]);

  useEffect(() => {
    const fetchPdfData = async () => {
      if (currentStep === 3 && selectedDocument && formAnswers && disclaimerAgreed && !pdfUrl && !isPdfLoading && isHydrated) {
        setIsPdfLoading(true);
        setPdfError(null);
        setGeneratedPdfBlob(null); 
        setApiError(null); 
        toast({ title: t('toasts.generatingPDFTitle'), description: t('toasts.generatingPDFDescription') });
        console.log('[page.tsx] Fetching PDF for Step 3 (Finalize). Doc:', selectedDocument.name, 'State:', globalSelectedState);

        try {
          const response = await fetch('/api/generate-pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              documentType: selectedDocument.name, 
              answers: formAnswers,
              state: globalSelectedState, 
            }),
          });

          if (!response.ok) {
            let errorText = '';
            try {
                errorText = await response.text();
            } catch(e) {}
            let errorData;
            try {
                errorData = JSON.parse(errorText); 
            } catch (e) {
                errorData = { error: errorText || `HTTP error ${response.status}` };
            }
            console.error(`[API /generate-pdf] Error ${response.status}:`, errorData);
            const clientMessage = errorData?.error || `Failed to generate PDF: ${response.statusText}`;
            setApiError(`PDF Generation Error: ${clientMessage}`);
            throw new Error(clientMessage);
          }

          const pdfBlob = await response.blob();
          const url = URL.createObjectURL(pdfBlob);
          setPdfUrl(url);
          setGeneratedPdfBlob(pdfBlob); 
          toast({ title: t('toasts.pdfGenSuccessTitle'), description: t('toasts.pdfGenSuccessDescription') });
        } catch (err: any) {
          console.error('[page.tsx] Error fetching PDF:', err);
          setPdfError(err.message || t('toasts.pdfGenFailedDescription'));
          toast({ title: t('toasts.pdfGenErrorTitle'), description: err.message || t('toasts.pdfGenFailedDescription'), variant: 'destructive' });
        } finally {
          setIsPdfLoading(false);
        }
      }
    };

    fetchPdfData();

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [currentStep, selectedDocument, formAnswers, disclaimerAgreed, globalSelectedState, t, toast, isPdfLoading, pdfUrl, isHydrated]);

  const handlePdfSign = useCallback(() => {
    console.log('[page.tsx] handlePdfSign called');
    setPdfSigned(true);
    scrollToTop();
  }, [scrollToTop]);

  const resetFlow = () => {
    setCurrentStep(1);
    setSelectedDocument(null);
    setFormAnswers(null);
    setDisclaimerAgreed(false);
    setPdfSigned(false);
    setGlobalSearchTerm(''); 
    setGlobalSelectedState(''); 
    setSelectedCategory(null); 
    setPdfUrl(null);
    setIsPdfLoading(false);
    setPdfError(null);
    setGeneratedPdfBlob(null);
    setApiError(null);
    scrollToTop();
  };


  const renderStepContent = () => {
    if (!isHydrated) { // Don't render steps content until hydrated
        return <div className="text-center py-10"><Loader2 className="h-8 w-8 animate-spin mx-auto" /> <p>{t('Loading...')}</p></div>;
    }
    console.log(`[page.tsx] Rendering content for step: ${currentStep}`);
    switch (currentStep) {
      case 1: 
        return (
          <Step1DocumentSelector
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            onDocumentSelect={handleDocumentSelect} 
            globalSelectedState={globalSelectedState} 
            globalSearchTerm={globalSearchTerm}     
          />
        );
      case 2: 
        if (!selectedDocument) return <p>{t('Confirm a document type in Step 1 to see the questions.')}</p>;
        return (
          <Questionnaire
            documentType={selectedDocument.name}
            selectedState={globalSelectedState} 
            onAnswersSubmit={handleAnswersSubmit}
          />
        );
      case 3: 
        if (!areDetailsProvided) return <p>{t('Complete the questions above to view the disclaimer.')}</p>;
        
        if (!disclaimerAgreed) {
          return <DisclaimerStep onAgree={handleDisclaimerAgree} />;
        }

        if (isPdfLoading) return <div className="text-center py-10"><Loader2 className="h-8 w-8 animate-spin mx-auto" /> <p>{t('toasts.generatingPDFTitle')}</p></div>;
        if (pdfError) return <div className="text-center py-10 text-destructive"><AlertTriangle className="h-8 w-8 mx-auto mb-2" /> <p>{t('toasts.pdfGenFailedTitle')}</p><p className="text-sm">{pdfError}</p></div>;
        if (!pdfUrl) return <p>{t('Preparing document preview...')}</p>; 

        if (!pdfSigned) {
          return (
            <PdfPreview
              documentDataUrl={pdfUrl}
              documentName={`${selectedDocument?.name.replace(/\s/g, '_') || 'document'}.pdf`}
              onSignSuccess={handlePdfSign}
            />
          );
        }
        return (
          <ShareDownloadStep
            signedPdfData={generatedPdfBlob}
            documentName={`${selectedDocument?.name.replace(/\s/g, '_') || 'document'}_signed.pdf`}
            onStartOver={resetFlow}
          />
        );
      default:
        return <p>Unknown step.</p>;
    }
  };


  const workflowSectionId = "workflow-start";

  return (
    <>
      <PromoBanner />
      <HeroSection
          onGetStartedClick={() => {
              const section = document.getElementById(workflowSectionId);
              if (section) section.scrollIntoView({ behavior: 'smooth' });
          }}
      />
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
                    <p><strong>{t('API Error Occurred')}:</strong></p>
                    <pre className="whitespace-pre-wrap break-all">{apiError}</pre>
                </div>
            )}
            
            {/* Conditionally render StickyFilterBar only on client and when step is 1 */}
            {isHydrated && currentStep === 1 && (
              <StickyFilterBar
                searchTerm={globalSearchTerm}
                onSearchTermChange={setGlobalSearchTerm}
                selectedState={globalSelectedState}
                onSelectedStateChange={setGlobalSelectedState}
              />
            )}

            {isHydrated && <ProgressStepper currentStep={currentStep} />}

            <div className="mt-8 bg-card p-4 sm:p-6 md:p-8 rounded-xl shadow-2xl border border-border/20">
                {renderStepContent()}
            </div>

             {isHydrated && currentStep > 1 && currentStep <= 3 && (
                 <div className="mt-8 flex justify-center">
                     <Button variant="outline" onClick={() => {
                         if (currentStep === 3) {
                           setDisclaimerAgreed(false); 
                           setPdfSigned(false); 
                           setPdfUrl(null); 
                           setGeneratedPdfBlob(null); 
                           setCurrentStep(2);
                         } else { 
                           setCurrentStep(prev => Math.max(1, prev - 1));
                         }
                         if (currentStep === 3) {
                             setDisclaimerAgreed(false);
                             setPdfSigned(false);
                             setPdfUrl(null);
                             setIsPdfLoading(false);
                             setPdfError(null);
                             setGeneratedPdfBlob(null);
                         }
                     }}>
                         {t('Back', {defaultValue: 'Back'})}
                     </Button>
                 </div>
             )}
         </div>
      </section>
    </>
  );
}

