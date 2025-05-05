"use client"; // Mark page as client component due to state management and client children

import React, { useState, useEffect, useCallback, useRef } from 'react'; // Ensure useEffect is imported if used elsewhere
import type { InferDocumentTypeOutput, DocumentSuggestion, InferDocumentTypeInput } from '@/ai/flows/infer-document-type'; // Import new output types
// Removed import StepOneInput from '@/components/StepOneInput'; // Remove the old StepOneInput component
import DocumentTypeSelector from '@/components/DocumentTypeSelector'; // Import the new selector
import DynamicFormRenderer from '@/components/DynamicFormRenderer'; // Import the new dynamic renderer
import { formSchemas } from '@/data/formSchemas'; // Import schemas
import { DisclaimerStep } from '@/components/disclaimer-step'; // Import the new disclaimer step
import { PdfPreview } from '@/components/pdf-preview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText, FileSignature, Check, Upload, AlertTriangle, Download, ListChecks, Loader2 } from 'lucide-react'; // Added ListChecks, Loader2 icons
import HomepageHeroSteps from '@/components/landing/HomepageHeroSteps'; // Corrected import path to landing
import { Button } from '@/components/ui/button'; // Import Button
import { useToast } from '@/hooks/use-toast'; // Import useToast
import { useTranslation } from 'react-i18next'; // Import useTranslation
import TrustAndTestimonialsSection from '@/components/landing/TrustAndTestimonialsSection'; // Import the combined Trust/Testimonials component
import StepOneInput from '@/components/StepOneInput';
import TrustAndTestimonialsSection_server from "@/components/landing/TrustAndTestimonialsSection"; // Import the combined Trust/Testimonials component
// Removed PromoBanner import
// Removed Footer import

// Define share icon SVG inline
const ShareIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
);
import Step1DocumentSelector from '@/components/Step1DocumentSelector';

export default function Home() {
  console.log('[page.tsx] Home component rendering...');
  const { toast } = useToast();
  const { t, i18n } = useTranslation(); // Get translation function and i18n instance
  const [isHydrated, setIsHydrated] = useState(false); // State for hydration

  // --- State for Step 1 ---
  const [description, setDescription] = useState('');
  const [selectedState, setSelectedState] = useState<string | undefined>(undefined);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'microphone'>('text');
  const [transcript, setTranscript] = useState(''); // Hold interim/final transcript
  const [recognition, setRecognition] = useState<any | null>(null); // Hold recognition instance
  const isRecordingRef = useRef(isRecording);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // --- State for Step 1 -> 2 ---
  const [inferenceResult, setInferenceResult] = useState<InferDocumentTypeOutput | null>(null);

  // --- State for Step 2 -> 3 ---
  const [selectedDocType, setSelectedDocType] = useState<string | null>(null);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<Record<string, any> | null>(null);

  // --- State for Step 3 -> 4 ---
  const [disclaimerAgreed, setDisclaimerAgreed] = useState<boolean>(false);

  // --- State for Step 4 -> 5 ---
  const [pdfDataUrl, setPdfDataUrl] = useState<string | undefined>(undefined);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [userState, setUserState] = useState('');


  useEffect(() => {
    setIsHydrated(true); // Set hydrated state on client
  }, []);

  // Effect to sync isRecording state with its ref
  useEffect(() => {
       isRecordingRef.current = isRecording;
  }, [isRecording]);

  // --- Speech Recognition Setup Effect ---
  useEffect(() => {
    const SpeechRecognitionApi = typeof window !== 'undefined' ? (window.SpeechRecognition || (window as any).webkitSpeechRecognition) : null;

    if (SpeechRecognitionApi && !recognitionRef.current) { // Initialize only once
        try {
            const instance = new SpeechRecognitionApi();
            instance.continuous = true;
            instance.interimResults = true;
            instance.lang = i18n.language; // Set recognition language based on i18n

            instance.onresult = (event: SpeechRecognitionEvent) => {
                let interimTranscript = '';
                let finalTranscriptPiece = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscriptPiece += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
                 // Update description state ONLY with final results
                if (finalTranscriptPiece) {
                    setDescription(prev => (prev + finalTranscriptPiece).trim() + ' ');
                }
                // Update transcript state to show both interim and final (for display)
                setTranscript(prev => description + interimTranscript); // Display combined transcript
            };

            instance.onerror = (event: SpeechRecognitionErrorEvent) => {
                console.error('Speech recognition error:', event.error, event.message);
                 let errorMessage = t('documentInference.micErrorDefault', { error: event.error, message: event.message || 'Try typing.' });
                 if (event.error === 'no-speech') errorMessage = t('documentInference.micErrorNoSpeech');
                 else if (event.error === 'audio-capture') errorMessage = t('documentInference.micErrorAudioCapture');
                 else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') errorMessage = t('documentInference.micErrorNotAllowed');
                 else if (event.error === 'network') errorMessage = t('documentInference.micErrorNetwork');
                 else if (event.error === 'aborted' && !isRecordingRef.current) return; // Ignore intentional stops

                toast({ title: t('documentInference.micErrorTitle'), description: errorMessage, variant: "destructive" });
                if (isRecordingRef.current) setIsRecording(false);
            };

            instance.onend = () => {
                 if (isRecordingRef.current) {
                    setIsRecording(false);
                    console.log("Recognition ended unexpectedly, stopping recording state.");
                 } else {
                    console.log("Recognition ended intentionally.");
                 }
                  setTranscript(description); // Ensure transcript matches final description on end
            };

            recognitionRef.current = instance; // Store instance in ref
            setRecognition(instance); // Keep state for potential conditional rendering if needed

        } catch (e) {
            console.error("Failed to initialize SpeechRecognition:", e);
            setRecognition(null);
        }
    } else if (!SpeechRecognitionApi) {
        console.warn('Speech Recognition API not supported.');
        setRecognition(null);
    } else if (recognitionRef.current) {
        // Update language if i18n language changes after initialization
        recognitionRef.current.lang = i18n.language;
    }

    // Cleanup function
    return () => {
       const currentRecognition = recognitionRef.current;
       if (currentRecognition && isRecordingRef.current) {
           isRecordingRef.current = false;
           try {
                currentRecognition.stop();
                console.log("Stopping recognition on unmount/cleanup.");
           } catch (e) { console.warn("Error stopping recognition on unmount:", e); }
       }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language, t]); // Added t to dependency array


  // --- Mic Handlers for StepOneInput ---
  const handleStartMic = useCallback(() => {
     const currentRecognition = recognitionRef.current;
    if (!currentRecognition) {
         toast({ title: t('documentInference.micUnsupportedTitle'), description: t('documentInference.micUnsupportedDescription'), variant: "destructive" });
         setActiveTab('text');
         return;
    }
    if (!isRecordingRef.current) {
        try {
            currentRecognition.lang = i18n.language; // Ensure correct language before starting
            currentRecognition.start();
            console.log(`Starting recognition in language: ${currentRecognition.lang}.`);
             setIsRecording(true);
             setTranscript(description); // Reset transcript display on start
        } catch (e: any) {
            console.error("Error starting recognition:", e);
            let errorMsg = t('documentInference.micStartErrorDefault', { message: e.message });
            if (e.name === 'NotAllowedError' || e.name === 'SecurityError') errorMsg = t('documentInference.micErrorNotAllowed');
            else if (e.name === 'InvalidStateError') {
                console.warn("Recognition already started? Attempting to stop and restart.");
                try { currentRecognition.stop(); } catch {}
                setTimeout(() => {
                     try {
                        currentRecognition.lang = i18n.language; // Ensure correct language
                        currentRecognition.start();
                        setIsRecording(true);
                        setTranscript(description); // Reset transcript display on start
                     } catch (nestedE: any) {
                         toast({ title: t('documentInference.micStartErrorTitle'), description: t('documentInference.micStartErrorDefault', { message: nestedE.message }), variant: "destructive" });
                         setIsRecording(false);
                     }
                 }, 100);
                 return; // Exit early
            }
             toast({ title: t('documentInference.micStartErrorTitle'), description: errorMsg, variant: "destructive" });
             setIsRecording(false);
        }
    }
  }, [i18n.language, t, toast, description]);

  const handleStopMic = useCallback(() => {
    const currentRecognition = recognitionRef.current;
    if (currentRecognition && isRecordingRef.current) {
        try {
            currentRecognition.stop();
            console.log("Manually stopping recognition.");
        } catch (e) { console.warn("Error stopping recognition:", e); }
        setIsRecording(false);
         setTranscript(description); // Ensure transcript matches final description
    }
  }, [description]);


  // Determine current step based on state
  const getCurrentStep = () => {
    if (pdfDataUrl) return 5; // Share/Download is now Step 5
    if (disclaimerAgreed) return 4; // PDF Preview is now Step 4
    if (questionnaireAnswers) return 3; // Disclaimer is now Step 3
    if (selectedDocType) return 2; // Questionnaire is Step 2 (based on confirmed type)
    return 1; // Inference is Step 1
  };
  const currentStep = getCurrentStep();


  // Handler for Step 1 "Analyze" button
   const handleAnalyze = useCallback(async () => {
     const logPrefix = "[handleAnalyze]";
     const trimmedDescription = description.trim();
     if (!trimmedDescription) {
       toast({ title: t('documentInference.inputRequiredTitle'), description: t('documentInference.inputRequiredDescription'), variant: "destructive" });
       setInferenceResult(null);
       return;
     }
      // Stop recording if analysis starts while recording
      if (isRecordingRef.current) {
          handleStopMic();
      }

     setIsLoadingAnalysis(true);
     setInferenceResult(null); // Clear previous results

     const currentLanguage = i18n.language.startsWith('es') ? 'es' : 'en';

     const inputPayload: InferDocumentTypeInput = {
         description: trimmedDescription,
         language: currentLanguage,
         ...(selectedState && { state: selectedState }),
     };

     console.log(`${logPrefix} Sending payload to API:`, inputPayload);

     try {
         const response = await fetch('/api/infer-document-type', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify(inputPayload),
         });

         if (!response.ok) {
             let errorMsg = t('documentInference.analysisFailedDefault');
             let errorCode = 'API_ERROR';
             try {
                 const errorData = await response.json();
                 errorMsg = errorData.error || errorMsg;
                 errorCode = errorData.code || errorCode;
                  console.error(`${logPrefix} API Error ${response.status} (${errorCode}):`, errorData);
             } catch {
                  console.error(`${logPrefix} API Error ${response.status}:`, await response.text());
             }
             if (errorCode === 'STATIC_EXPORT_API_DISABLED') {
                 errorMsg = t('documentInference.analysisFailedApiDisabled');
             }
             toast({ title: t('documentInference.analysisFailedTitle'), description: errorMsg, variant: "destructive" });
             setInferenceResult(null);
              setIsLoadingAnalysis(false);
             return;
         }

         const result: InferDocumentTypeOutput = await response.json();
         console.log(`${logPrefix} Received API response:`, result);
         setInferenceResult(result);
         // Show success toast for analysis completion
          if (result && result.suggestions && result.suggestions.length > 0) {
             toast({ title: t('toasts.analysisCompleteTitle'), description: t('toasts.analysisCompleteDescription') });
          } else {
              toast({ title: t('toasts.analysisInconclusiveTitle'), description: t('toasts.analysisInconclusiveDescription'), variant: "destructive" });
               // Ensure there's a default General Inquiry if AI returns nothing useful
               if (!result || !result.suggestions || result.suggestions.length === 0) {
                  setInferenceResult({ suggestions: [{ documentType: 'General Inquiry', confidence: 0.1, reasoning: 'Could not confidently match your description to a specific document.' }] });
               }
          }


     } catch (error: unknown) {
         console.error(`${logPrefix} Network or other error during fetch:`, error);
         toast({ title: t('documentInference.networkErrorTitle'), description: t('documentInference.networkErrorDescription'), variant: "destructive" });
         setInferenceResult(null);
     } finally {
         setIsLoadingAnalysis(false);
     }
   }, [description, toast, selectedState, i18n.language, t, handleStopMic]);



  // Handler for when user selects a document type from the DocumentTypeSelector
  const handleDocumentTypeSelected = (docName: string) => {
      console.log(`[page.tsx] handleDocumentTypeSelected: User selected ${docName}`);
      setSelectedDocType(docName);
       toast({ title: t('toasts.docTypeConfirmedTitle'), description: t('toasts.docTypeConfirmedDescription', { docName }) });
        setQuestionnaireAnswers(null);
        setDisclaimerAgreed(false);
        setPdfDataUrl(undefined);
  }

  // Questionnaire submit now leads to disclaimer step
  const handleAnswersSubmit = (answers: Record<string, any>) => {
    console.log('[page.tsx] handleAnswersSubmit called with:', answers);
    setQuestionnaireAnswers(answers);
    setDisclaimerAgreed(false);
    setPdfDataUrl(undefined);
    console.log("[page.tsx] Questionnaire submitted, proceeding to disclaimer step.");
     toast({ title: t('toasts.detailsRecordedTitle'), description: t('toasts.detailsRecordedDescription') });
  };

  // Disclaimer agreement triggers PDF generation (simulation)
  const handleDisclaimerAgree = async () => { // Make async to await generation
     console.log('[page.tsx] handleDisclaimerAgree called.');
     setDisclaimerAgreed(true);
     console.log("[page.tsx] Disclaimer agreed. Triggering PDF generation with type:", selectedDocType, "answers:", questionnaireAnswers);

     if (!selectedDocType || !questionnaireAnswers) {
         toast({ title: t('toasts.missingDataTitle'), description: t('toasts.missingDataDescription'), variant: "destructive"});
         setDisclaimerAgreed(false); // Revert agreement state
         return;
     }

      const generationToast = toast({
          title: t('toasts.generatingPDFTitle'),
          description: t('toasts.generatingPDFDescription'),
          duration: 999999, // Keep open until dismissed
      });

     try {
         const response = await fetch('/api/generate-pdf', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
                 documentType: selectedDocType,
                 answers: questionnaireAnswers,
                 state: selectedState,
             }),
         });

         generationToast.dismiss();

         if (!response.ok) {
            const errorData = await response.json();
             console.error("[page.tsx] PDF generation failed:", errorData);
             toast({ title: t('toasts.pdfGenFailedTitle'), description: errorData.error || t('toasts.pdfGenFailedDescription'), variant: "destructive"});
             setDisclaimerAgreed(false); // Revert agreement state
             return;
         }

         const blob = await response.blob();
         const dataUrl = await new Promise<string>((resolve, reject) => {
             const reader = new FileReader();
             reader.onloadend = () => resolve(reader.result as string);
             reader.onerror = reject;
             reader.readAsDataURL(blob);
         });

         console.log("[page.tsx] PDF generation successful. Setting data URL.");
         setPdfDataUrl(dataUrl);
         toast({ title: t('toasts.pdfGenSuccessTitle'), description: t('toasts.pdfGenSuccessDescription') });

     } catch (error) {
          generationToast.dismiss();
          console.error("[page.tsx] Error during PDF generation fetch:", error);
          toast({ title: t('toasts.pdfGenErrorTitle'), description: "An unexpected error occurred.", variant: "destructive"});
          setDisclaimerAgreed(false); // Revert agreement state
     }
  }

  // Prepare suggestions for DocumentTypeSelector
   const suggestionsForSelector: DocumentSuggestion[] = inferenceResult?.suggestions || [];
   if (inferenceResult && suggestionsForSelector.length > 0 && !suggestionsForSelector.some(s => s.documentType === 'General Inquiry')) {
        suggestionsForSelector.push({
            documentType: 'General Inquiry',
            reasoning: t('docTypeSelector.generalInquiryReason') || 'If none of the above seem correct, or if you need further clarification.',
            confidence: 0.0
        });
   }

  // Get the relevant form schema for the selected document type
   const currentFormSchema = selectedDocType ? (formSchemas[selectedDocType] || formSchemas['default']) : [];

  // Render placeholder or null during SSR and initial client render
  if (!isHydrated) {
     return <div className="min-h-screen bg-background"> {/* Basic layout structure */}
               <div className="h-96 animate-pulse bg-muted"></div> {/* Hero placeholder */}
               <div className="container mx-auto py-12 space-y-8">
                 <div className="h-64 animate-pulse bg-card rounded-lg shadow-lg border border-border"></div> {/* Step 1 placeholder */}
               </div>
            </div>;
  }

  return (
    <div className="flex flex-col items-center w-full bg-background">
        {/* Use the new combined Hero and Steps component */}
       <HomepageHeroSteps />

        {/* Main Workflow Section */}
        <div id="workflow-start" className="w-full max-w-5xl mx-auto px-4 py-12 space-y-12">

            {/* Step Panels Wrapper */}
            <div className="w-full max-w-3xl mx-auto space-y-8">
                {/* Step 1: Document Inference & Confirmation */}
                <Card className={`shadow-lg rounded-lg bg-card border border-border transition-all duration-500 ease-out ${currentStep > 1 ? 'opacity-50 cursor-not-allowed' : 'animate-fade-in'}`}>
                    <CardHeader>
                    <div className="flex items-center space-x-2">
                        <FileText className="h-6 w-6 text-primary" />
                        <CardTitle className="text-2xl">{t('stepOne.title')}</CardTitle>
                    </div>
                    <CardDescription>
                        {currentStep > 1
                            ? `${t('docTypeSelector.confirmed')}: ${selectedDocType || "N/A"} ${selectedState ? `(${t('State')}: ${selectedState})` : ''}`
                            : t('stepOne.description')}
                    </CardDescription>
                    </CardHeader>
                     <Step1DocumentSelector
                         onDocumentSelect={doc => {
                             setSelectedDocType(doc.name);
                             setSelectedState(userState)
                         }}
                         onStateChange={state => setUserState(state)}
                     />

                    {currentStep === 1 && (
                        <CardContent>
                             {/* Use StepOneInput component */}
                           
                        </CardContent>
                    )}
                </Card>


                {/* Separator between steps */}
                {currentStep > 1 && <Separator className="my-8" />}

                {/* Step 2: Dynamic Form Renderer */}
                 {currentStep >= 2 && selectedDocType && (
                     <div className={`transition-opacity duration-500 ease-out ${currentStep === 2 ? 'opacity-100 animate-fade-in' : 'opacity-50 cursor-not-allowed'}`}>
                         <DynamicFormRenderer
                             documentType={selectedDocType}
                             schema={currentFormSchema}
                             onSubmit={handleAnswersSubmit}
                             isReadOnly={currentStep > 2}
                         />
                     </div>
                 )}
                 {currentStep < 2 && (
                     <Card className="shadow-lg rounded-lg opacity-50 cursor-not-allowed bg-card border border-border">
                         <CardHeader>
                             <div className="flex items-center space-x-2">
                                 <ListChecks className="h-6 w-6 text-primary" />
                                 <CardTitle className="text-2xl">{t('Step 2: Provide Details')}</CardTitle> {/* Translate */}
                             </div>
                             <CardDescription>
                                 {t('Confirm a document type in Step 1 to see the questions.')} {/* Translate */}
                             </CardDescription>
                         </CardHeader>
                         <CardContent>
                             <p className="text-muted-foreground italic">{t('Waiting for document confirmation from Step 1...')}</p> {/* Translate */}
                         </CardContent>
                     </Card>
                 )}

                {/* Separator between steps */}
                 {currentStep > 2 && <Separator className="my-8" />}


                {/* Step 3: Disclaimer */}
                {currentStep >= 3 && questionnaireAnswers && (
                     <div className={`transition-opacity duration-500 ease-out ${currentStep === 3 ? 'opacity-100 animate-fade-in' : 'opacity-50 cursor-not-allowed'}`}>
                        <DisclaimerStep
                            onAgree={handleDisclaimerAgree}
                            isReadOnly={currentStep > 3}
                        />
                     </div>
                )}
                {currentStep < 3 && (
                    <Card className="shadow-lg rounded-lg opacity-50 cursor-not-allowed bg-card border border-border">
                         <CardHeader>
                             <div className="flex items-center space-x-2">
                                 <AlertTriangle className="h-6 w-6 text-orange-500" />
                                 <CardTitle className="text-2xl">{t('disclaimerStep.stepTitle')}</CardTitle> {/* Use existing key */}
                             </div>
                             <CardDescription>
                                 {t('Read and agree to the disclaimer before proceeding.')} {/* Translate */}
                             </CardDescription>
                         </CardHeader>
                         <CardContent>
                             <p className="text-muted-foreground italic">{t('Complete the questions above to view the disclaimer.')}</p> {/* Translate */}
                         </CardContent>
                     </Card>
                )}

                 {/* Separator between steps */}
                 {currentStep > 3 && <Separator className="my-8" />}


                {/* Step 4: PDF Preview & Signing */}
                 {currentStep >= 4 && disclaimerAgreed && (
                     <div className={`transition-opacity duration-500 ease-out ${currentStep === 4 ? 'opacity-100 animate-fade-in' : 'opacity-50 cursor-not-allowed'}`}>
                         <PdfPreview
                             documentDataUrl={pdfDataUrl}
                             documentName={`${selectedDocType || 'document'}.pdf`}
                             isReadOnly={currentStep > 4}
                         />
                     </div>
                 )}
                 {currentStep < 4 && (
                      <Card className="shadow-lg rounded-lg opacity-50 cursor-not-allowed bg-card border border-border">
                         <CardHeader>
                             <div className="flex items-center space-x-2">
                                 <FileSignature className="h-6 w-6 text-primary" />
                                 <CardTitle className="text-2xl">{t('pdfPreview.stepTitle')}</CardTitle> {/* Use existing key */}
                             </div>
                             <CardDescription>
                                 {t('Review the generated document and sign it digitally.')} {/* Translate */}
                             </CardDescription>
                         </CardHeader>
                         <CardContent>
                             <p className="text-muted-foreground italic">{t('Agree to the disclaimer above to generate the document preview.')}</p> {/* Translate */}
                         </CardContent>
                     </Card>
                 )}

                 {/* Separator between steps */}
                 {currentStep > 4 && <Separator className="my-8" />}

                 {/* Step 5: Share & Track */}
                  {currentStep >= 5 && pdfDataUrl && (
                     <Card className="shadow-lg rounded-lg transition-opacity duration-500 ease-out opacity-100 animate-fade-in bg-card border border-border">
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                 <ShareIcon />
                                 <CardTitle className="text-2xl">{t('shareDownloadStep.stepTitle')}</CardTitle> {/* Translate */}
                            </div>
                            <CardDescription>
                               {t('shareDownloadStep.description')} {/* Translate */}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">{t('shareDownloadStep.actionsPlaceholder')}</p> {/* Translate */}
                            <div className="flex space-x-4">
                                <Button disabled variant="outline"> <Upload className="mr-2 h-4 w-4" /> {t('shareDownloadStep.shareButton')} {/* Translate */}</Button>
                                <Button
                                  onClick={() => {
                                       if (pdfDataUrl) {
                                           const link = document.createElement('a');
                                           link.href = pdfDataUrl;
                                           link.download = `${selectedDocType || 'document'}_signed.pdf`;
                                           document.body.appendChild(link);
                                           link.click();
                                           document.body.removeChild(link);
                                       }
                                   }}
                                   disabled={!pdfDataUrl}
                                >
                                    <Download className="mr-2 h-4 w-4" /> {t('shareDownloadStep.downloadButton')} {/* Translate */}
                                 </Button>
                            </div>
                        </CardContent>
                    </Card>
                  )}
                  {currentStep < 5 && (
                     <Card className="shadow-lg rounded-lg opacity-50 cursor-not-allowed bg-card border border-border">
                           <CardHeader>
                               <div className="flex items-center space-x-2">
                                   <ShareIcon />
                                   <CardTitle className="text-2xl">{t('shareDownloadStep.stepTitle')}</CardTitle> {/* Translate */}
                               </div>
                               <CardDescription>
                                  {t('Securely share your document or download it after signing.')} {/* Translate */}
                               </CardDescription>
                           </CardHeader>
                           <CardContent>
                               <p className="text-muted-foreground italic">{t('shareDownloadStep.disabledDescription')}</p> {/* Translate */}
                           </CardContent>
                       </Card>
                  )}

            </div>
        </div>

        {/* Footer Sections */}
         <TrustAndTestimonialsSection_server /> {/* Use the combined component */}

    </div>
  );
}


// Define SpeechRecognition types if not available globally (common issue)
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
    readonly message: string;
  }
  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
  }
}
