// src/app/page.tsx
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { LegalDocument } from '@/lib/document-library';
import { usStates } from '@/lib/document-library';
import { DocumentInference, type UserInput } from '@/components/document-inference';
import { DocTypeSelector, type AISuggestion } from '@/components/DocumentTypeSelector'; // Corrected import path
import { Questionnaire } from '@/components/questionnaire';
import { DisclaimerStep } from '@/components/disclaimer-step';
import { PdfPreview } from '@/components/pdf-preview';
import { ShareDownloadStep } from '@/components/share-download-step';
import ProgressStepper from '@/components/ProgressStepper'; // Main stepper component
import HeroSection from '@/components/landing/HomepageHeroSteps'; // Corrected import path
import ThreeStepSection from '@/components/landing/ThreeStepSection'; // Corrected import path
import { TrustAndTestimonialsSection } from '@/components/landing/TrustAndTestimonialsSection';
import { GuaranteeBadge } from '@/components/landing/GuaranteeBadge';
import { PromoBanner } from '@/components/landing/PromoBanner';
import { Button } from '@/components/ui/button'; // Import Button
import { useToast } from '@/hooks/use-toast'; // Import useToast
import { Separator } from '@/components/ui/separator';
import { FileText, FileSignature, Check, Upload, AlertTriangle, Download, ListChecks } from 'lucide-react'; // Added ListChecks icon
import Step1DocumentSelector from '@/components/Step1DocumentSelector'; // Corrected import for Step1DocumentSelector

// Define share icon SVG inline
const ShareIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
);

export default function Home() {
  console.log('[page.tsx] Home component rendering...');
  const { t, i18n } = useTranslation();
  const { toast } = useToast();

  // Global state for the multi-step flow
  const [currentStep, setCurrentStep] = useState(1);
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<LegalDocument | null>(null);
  const [formAnswers, setFormAnswers] = useState<Record<string, any> | null>(null);
  const [disclaimerAgreed, setDisclaimerAgreed] = useState(false);
  const [pdfSigned, setPdfSigned] = useState(false);

  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [globalSelectedState, setGlobalSelectedState] = useState<string>('');

  // PDF generation and preview state
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [generatedPdfBlob, setGeneratedPdfBlob] = useState<Blob | null>(null);

  const [apiError, setApiError] = useState<string | null>(null);


  // User (placeholder - replace with actual auth)
  const user = useMemo(() => ({ uid: 'test_user_123', name: 'Test User', email: 'test@example.com' }), []);

  // Derived state for conditional rendering and logic
  const isStateSelected = !!globalSelectedState;
  const isDocumentConfirmed = !!selectedDocument;
  const areDetailsProvided = !!formAnswers;

  // Scroll to top smoothly
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Handler for Step 1: Document Inference
  const handleAnalyze = useCallback(async (input: UserInput) => {
    console.log('[page.tsx] handleAnalyze called with input:', input);
    setApiError(null); // Clear previous errors
    setUserInput(input);

    try {
      const response = await fetch('/api/infer-document-type', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: input.description,
          state: input.state,
          language: i18n.language,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        let errorText = '';
        try {
          errorText = await response.text();
        } catch (e) {
          // If text() fails, errorData might be the best we have
        }
        console.error(`[handleAnalyze] API Error ${response.status} ${response.statusText}:`, errorData || errorText);
        const clientMessage = errorData?.error || `Server responded with ${response.status}. Please try again.`;
        setApiError(`Unable to reach server: ${response.status} ${response.statusText} - ${errorData?.error || errorText || 'No additional details'}`);
        toast({
          title: t('toasts.analysisFailedTitle', "Analysis Failed"),
          description: clientMessage,
          variant: "destructive",
        });
        setAiSuggestions([]);
        return;
      }

      const data = await response.json();
      console.log('[page.tsx] AI Suggestions received:', data.suggestions);
      if (data.suggestions && data.suggestions.length > 0) {
        setAiSuggestions(data.suggestions);
        toast({ title: t('toasts.analysisCompleteTitle'), description: t('toasts.analysisCompleteDescription') });
      } else {
        setAiSuggestions([]);
        toast({ title: t('toasts.analysisInconclusiveTitle'), description: t('toasts.analysisInconclusiveDescription'), variant: "default" });
      }
    } catch (error: any) {
      console.error('[page.tsx] Network or unexpected error during analysis:', error);
      setApiError(`An unexpected error occurred during analysis: ${error.message}. Original Description: "${input.description}"`);
      toast({
        title: t('toasts.networkErrorTitle', "Network Error"),
        description: t('toasts.networkErrorDescription', "Could not connect to the analysis service. Please check your connection."),
        variant: "destructive",
      });
      setAiSuggestions([]);
    }
  }, [i18n.language, t, toast]);


  // Handler for Step 2: Document Type Confirmation
  const handleDocumentSelect = useCallback((doc: LegalDocument) => {
    console.log('[page.tsx] handleDocumentSelect called with doc:', doc);
    setSelectedDocument(doc);
    setCurrentStep(3); // Move to Questionnaire step
    scrollToTop();
    toast({ title: t('toasts.docTypeConfirmedTitle'), description: t('toasts.docTypeConfirmedDescription', { docName: doc.name }) });
  }, [scrollToTop, t, toast]);


  // Handler for Step 3: Questionnaire Submission
  const handleAnswersSubmit = useCallback((answers: Record<string, any>) => {
    console.log('[page.tsx] handleAnswersSubmit called with answers:', answers);
    setFormAnswers(answers);
    setCurrentStep(4); // Move to Disclaimer step
    scrollToTop();
    toast({ title: t('toasts.detailsRecordedTitle'), description: t('toasts.detailsRecordedDescription') });
  }, [scrollToTop, t, toast]);

  // Handler for Step 4: Disclaimer Agreement
  const handleDisclaimerAgree = useCallback(() => {
    console.log('[page.tsx] handleDisclaimerAgree called');
    setDisclaimerAgreed(true);
    setCurrentStep(5); // Move to PDF Preview step
    scrollToTop();
  }, [scrollToTop]);

  // Fetch PDF data when advancing to Step 5
  useEffect(() => {
    const fetchPdfData = async () => {
      if (currentStep === 5 && selectedDocument && formAnswers && disclaimerAgreed && !pdfUrl && !isPdfLoading) {
        setIsPdfLoading(true);
        setPdfError(null);
        setGeneratedPdfBlob(null); // Clear previous blob
        setApiError(null); // Clear previous API errors
        toast({ title: t('toasts.generatingPDFTitle'), description: t('toasts.generatingPDFDescription') });
        console.log('[page.tsx] Fetching PDF for Step 5. Doc:', selectedDocument.name, 'State:', globalSelectedState);

        try {
          const response = await fetch('/api/generate-pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              documentType: selectedDocument.name, // Send document name or ID
              answers: formAnswers,
              state: globalSelectedState, // Pass state if your generator uses it
            }),
          });

          if (!response.ok) {
            let errorText = '';
            try {
                errorText = await response.text();
            } catch(e) {
                // if text() fails, errorData might be the best we have
            }
            let errorData;
            try {
                errorData = JSON.parse(errorText); // Attempt to parse as JSON only if text() succeeds
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
          setGeneratedPdfBlob(pdfBlob); // Store the blob for download
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

    // Cleanup object URL when component unmounts or pdfUrl changes
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, selectedDocument, formAnswers, disclaimerAgreed, globalSelectedState, t, toast]); // Removed pdfUrl, isPdfLoading from deps to avoid re-fetch loops

  // Handler for Step 5: PDF Signing
  const handlePdfSign = useCallback(() => {
    console.log('[page.tsx] handlePdfSign called');
    setPdfSigned(true);
    setCurrentStep(6); // Move to Share/Download step
    scrollToTop();
  }, [scrollToTop]);

  // Function to reset the flow
  const resetFlow = () => {
    setCurrentStep(1);
    setUserInput(null);
    setAiSuggestions([]);
    setSelectedDocument(null);
    setFormAnswers(null);
    setDisclaimerAgreed(false);
    setPdfSigned(false);
    setGlobalSearchTerm('');
    setGlobalSelectedState('');
    setPdfUrl(null);
    setIsPdfLoading(false);
    setPdfError(null);
    setGeneratedPdfBlob(null);
    setApiError(null);
    scrollToTop();
  };


  const renderStepContent = () => {
    console.log(`[page.tsx] Rendering content for step: ${currentStep}`);
    switch (currentStep) {
      case 1: // Category Selection
        return (
            <Step1DocumentSelector
                selectedCategory={null} // This prop might need to be managed if category selection should be sticky
                onCategorySelect={(categoryKey) => {
                    // Logic if a category is selected directly in Step1DocumentSelector
                    // This might set some local state within Step1DocumentSelector or bubble up further if needed
                    console.log("Category selected in parent (Home):", categoryKey);
                    // If Step1DocumentSelector internally manages its 'currentCategory' for view, this might be sufficient.
                    // If the parent (Home) needs to know the category for other reasons, update a state here.
                }}
                onDocumentSelect={handleDocumentSelect} // This is the crucial callback for when a document is chosen
                globalSelectedState={globalSelectedState}
                globalSearchTerm={globalSearchTerm}
            />
        );
      case 2: // AI Suggestions - This step might be bypassed if direct selection is preferred
        if (aiSuggestions.length > 0 && userInput) {
          return (
            <DocTypeSelector
              userInput={userInput}
              suggestions={aiSuggestions}
              onConfirm={(docSuggestion) => {
                const fullDoc = documentLibrary.find(d => d.name === docSuggestion.documentType) as LegalDocument | undefined;
                if (fullDoc) {
                    handleDocumentSelect(fullDoc);
                } else {
                    toast({title: "Error", description: `Document type "${docSuggestion.documentType}" not found in library.`, variant: "destructive"})
                    setCurrentStep(1); // Revert if the suggested doc is not found (should not happen if AI is well-trained)
                }
              }}
              onSelectDifferent={() => {
                  setCurrentStep(1); // Go back to manual selection
                  setAiSuggestions([]); // Clear AI suggestions
              }}
            />
          );
        }
        // If no AI suggestions, or user skipped AI, they should be in Step 1 (Category/Doc Selection)
        // Or, if direct selection leads here, it implies `selectedDocument` should be set.
        // This fallback might need refinement based on exact flow logic.
         return <p>{t('Loading suggestions or select a document from Step 1...')}</p>;


      case 3: // Questionnaire
        if (!selectedDocument) return <p>{t('Confirm a document type in Step 1 to see the questions.')}</p>;
        return (
          <Questionnaire
            documentType={selectedDocument.name}
            selectedState={globalSelectedState}
            onAnswersSubmit={handleAnswersSubmit}
          />
        );
      case 4: // Disclaimer
        if (!areDetailsProvided) return <p>{t('Complete the questions above to view the disclaimer.')}</p>;
        return <DisclaimerStep onAgree={handleDisclaimerAgree} />;
      case 5: // PDF Preview & Sign
        if (!disclaimerAgreed) return <p>{t('Agree to the disclaimer above to generate the document preview.')}</p>;
        if (isPdfLoading) return <div className="text-center py-10"><Loader2 className="h-8 w-8 animate-spin mx-auto" /> <p>{t('toasts.generatingPDFTitle')}</p></div>;
        if (pdfError) return <div className="text-center py-10 text-destructive"><AlertTriangle className="h-8 w-8 mx-auto mb-2" /> <p>{t('toasts.pdfGenFailedTitle')}</p><p className="text-sm">{pdfError}</p></div>;
        if (!pdfUrl) return <p>{t('Preparing document preview...')}</p>;
        return (
          <PdfPreview
            documentDataUrl={pdfUrl}
            documentName={`${selectedDocument?.name.replace(/\s/g, '_') || 'document'}.pdf`}
            onSignSuccess={handlePdfSign}
          />
        );
      case 6: // Share & Download
        if (!pdfSigned) return <p>{t('Securely share your document or download it after signing.')}</p>;
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
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
                {t('headline')}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground text-center mb-10">
                {t('subhead')}
            </p>

            {apiError && (
                <div className="my-4 p-4 bg-destructive/10 border border-destructive text-destructive rounded-md text-sm">
                    <p><strong>{t('API Error Occurred')}:</strong></p>
                    <pre className="whitespace-pre-wrap break-all">{apiError}</pre>
                </div>
            )}

            <ProgressStepper currentStep={currentStep} />

            <div className="mt-8 bg-card p-4 sm:p-6 md:p-8 rounded-xl shadow-2xl border border-border/20">
                {renderStepContent()}
            </div>

            {currentStep > 1 && currentStep < 6 && (
                 <div className="mt-8 flex justify-center">
                     <Button variant="outline" onClick={() => setCurrentStep(prev => Math.max(1, prev -1))}>
                         {t('Back', {defaultValue: 'Back'})}
                     </Button>
                 </div>
             )}
         </div>
      </section>
    </>
  );
}

// Placeholder for Loader2 icon if not already imported
const Loader2 = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

// Helper function to get documentLibrary - can be removed if not directly used here
// const getDocumentLibrary = () => documentLibrary;

