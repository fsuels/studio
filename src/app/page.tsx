
"use client"; // Mark page as client component due to state management and client children

import React, { useState, useEffect } from 'react'; // Ensure useEffect is imported if used elsewhere
// ** Removed InferDocumentTypeOutput import as we now only receive the selected name **
import { DocumentInference } from '@/components/document-inference';
import { Questionnaire } from '@/components/questionnaire';
import { DisclaimerStep } from '@/components/disclaimer-step'; // Import the new disclaimer step
import { PdfPreview } from '@/components/pdf-preview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText, FileSignature, Check, Upload, AlertTriangle, Download } from 'lucide-react'; // Added Check, Upload, AlertTriangle, Download icons
import { HeroSection } from '@/components/landing/HeroSection'; // Corrected import path
import ThreeStepSection from '@/components/ThreeStepSection'; // This might need label updates or become "4 steps"
import { TestimonialCarousel } from '@/components/landing/TestimonialCarousel';
import { FeaturedLogos } from '@/components/landing/FeaturedLogos';
import { GuaranteeBadge } from '@/components/landing/GuaranteeBadge';
import { Button } from '@/components/ui/button'; // Import Button

// Define questionnaire icon SVG inline
const QuestionnaireIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
);

// Define share icon SVG inline
const ShareIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
);


export default function Home() {
  console.log('[page.tsx] Home component rendering...');

  const [confirmedDocType, setConfirmedDocType] = useState<string | null>(null); // Store the *confirmed* document type name
  const [selectedState, setSelectedState] = useState<string | undefined>(undefined); // Store selected state from inference step
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<Record<string, any> | null>(null);
  const [disclaimerAgreed, setDisclaimerAgreed] = useState<boolean>(false); // New state for disclaimer
  const [pdfDataUrl, setPdfDataUrl] = useState<string | undefined>(undefined);

  // Determine current step based on state
  const getCurrentStep = () => {
    if (pdfDataUrl) return 5; // Share/Download is now Step 5
    if (disclaimerAgreed) return 4; // PDF Preview is now Step 4
    if (questionnaireAnswers) return 3; // Disclaimer is now Step 3
    if (confirmedDocType) return 2; // Questionnaire is Step 2 (based on confirmed type)
    return 1; // Inference is Step 1
  };
  const currentStep = getCurrentStep();

  // Updated handler: receives the *selected* document name and state
  const handleDocumentConfirmed = (selectedDocName: string | null, state?: string) => {
    console.log('[page.tsx] handleDocumentConfirmed called with:', selectedDocName, 'State:', state);
    setConfirmedDocType(selectedDocName);
    setSelectedState(state); // Store the state selected during inference
    // Reset subsequent steps if the document type changes or becomes null
    setQuestionnaireAnswers(null);
    setDisclaimerAgreed(false);
    setPdfDataUrl(undefined);
  };

  // Questionnaire submit now leads to disclaimer step
  const handleAnswersSubmit = (answers: Record<string, any>) => {
    console.log('[page.tsx] handleAnswersSubmit called with:', answers);
    setQuestionnaireAnswers(answers);
    setDisclaimerAgreed(false); // Ensure disclaimer needs agreement again
    setPdfDataUrl(undefined); // Clear previous PDF if re-submitting
    console.log("[page.tsx] Questionnaire submitted, proceeding to disclaimer step.");
    // No PDF generation here anymore
  };

  // Disclaimer agreement triggers PDF generation (simulation)
  const handleDisclaimerAgree = () => {
     console.log('[page.tsx] handleDisclaimerAgree called.');
     setDisclaimerAgreed(true);
     console.log("[page.tsx] Disclaimer agreed. Simulating PDF generation with answers:", questionnaireAnswers);
     // Simulate PDF generation after agreement
     // In a real app, this would call a backend function (e.g., Firebase Function)
     // which takes `questionnaireAnswers`, `confirmedDocType`, and `selectedState`, generates the PDF,
     // potentially saves it to storage, and returns a URL or the PDF data.
     setTimeout(() => {
         console.log("[page.tsx] PDF simulation complete. Setting dummy URL.");
         // Simulate a slightly more complex PDF for better preview
         const base64Pdf = "JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0NvdW50IDEvS2lkc1sgMyAwIFJdPj4KZW5kb2JqCjMgMCBvYmoKPDwvVHlwZS9QYWdlL1BhcmVudCAyIDAgUi9NZWRpYUJveFswIDAgNjEyIDc5Ml0vUmVzb3VyY2VzPDwvRm9udDw8L0YxIDQgMCBSPj4+Pi9Db250ZW50cyA1IDAgUi9Hcm91cDw8L1MvVHJhbnNwYXJlbmN5L0NTL0RldmljZVJHQi9JIHRydWU+Pj4+PgplbmRvYmoKNSAwIG9iago8PC9MZW5ndGggMjMxPj4Kc3RyZWFtCkJUCjAgMCAwIHJnIEJUL0YxIDQwIFRmIDEgMCAwIDEgMzAgNzQwIFRtCihQREVQIFNpbXVsYXRpb24gLSBEb2N1bWVudCkgVGoKRVQKClBTIFEuLi5RUQpCdCAvRjEgMTIgVGYgMSAwIDAgMSAzMCA3MDAgVG0KKFN0YXRlOiB7U1RBVEVfSEVSRX0pIFRqCkVUCgpCdCAvRjEgMTIgVGYgMSAwIDAgMSAzMCA2ODAgVG0KKENsaWVudDogSW5wdXRzIGZyb20gcXVlc3Rpb25uYWlyZSkgVGoKRVQKClBTIFEuLi5RUQpCdCAvRjEgOCBUZiAxIDAgMCAxIDMwIDYzMCBUbQooRElTQ0xBSU1FUikgVGoKRVQKZW5kc3RyZWFtCmVuZG9iago0IDAgb2JqCjw8L1R5cGUvRm9udC9TdWJ0eXBlL1R5cGUxL0Jhc2VGb250L0hlbHZldGljYT4+CmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTIgMDAwMDAgbiAKMDAwMDAwMDA2MiAwMDAwMCBuIAowMDAwMDAwMTQwIDAwMDAwIG4gCjAwMDAwMDA3NDMgMDAwMDAgbiAKMDAwMDAwMDI3NyAwMDAwMCBuIAp0cmFpbGVyCjw8L1Jvb3QgMSAwIFIvU2l6ZSA2Pj4KCnN0YXJ0eHJlZgo4MDMKJSUzMAo=";
         const statePlaceholder = selectedState || 'N/A';
         const decodedPdf = atob(base64Pdf);
         const pdfWithState = decodedPdf.replace('{STATE_HERE}', statePlaceholder);
         const finalBase64Pdf = btoa(pdfWithState);

         setPdfDataUrl(`data:application/pdf;base64,${finalBase64Pdf}`);
     }, 500);
  }

  return (
    <div className="flex flex-col items-center w-full bg-background">
       <HeroSection /> {/* Render Hero Section */}
       <ThreeStepSection /> {/* Render 3 Step Section */}

        {/* Main Workflow Section - Wrapper with padding */}
        <div className="w-full max-w-5xl mx-auto px-4 py-12 space-y-12">

            {/* Step Panels Wrapper - Use max-w-3xl for better focus */}
            <div className="w-full max-w-3xl mx-auto space-y-8">
                {/* Step 1: Document Inference & Confirmation */}
                {currentStep === 1 && (
                    <Card className="shadow-lg rounded-lg bg-card border border-border transition-all duration-500 ease-out animate-fade-in">
                        <CardHeader>
                        <div className="flex items-center space-x-2">
                            <FileText className="h-6 w-6 text-primary" />
                            <CardTitle className="text-2xl">Step 1: Describe & Confirm</CardTitle>
                        </div>
                        <CardDescription>
                           Describe your situation and select the relevant U.S. state. Our AI will suggest document types for you to confirm.
                        </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Pass the confirmation handler */}
                            <DocumentInference onInferenceResult={handleDocumentConfirmed} />
                        </CardContent>
                    </Card>
                )}
                {/* Show locked Step 1 if past it */}
                {currentStep > 1 && (
                    <Card className="shadow-lg rounded-lg opacity-50 cursor-not-allowed bg-card border border-border">
                         <CardHeader>
                            <div className="flex items-center space-x-2">
                                <FileText className="h-6 w-6 text-primary" />
                                <CardTitle className="text-2xl">Step 1: Describe & Confirm</CardTitle>
                            </div>
                            <CardDescription>
                               Document type confirmed: <strong>{confirmedDocType || "N/A"}</strong> {selectedState && `(State: ${selectedState})`}
                            </CardDescription>
                         </CardHeader>
                    </Card>
                )}


                {/* Separator between steps */}
                {currentStep > 1 && <Separator className="my-8" />}

                {/* Step 2: Dynamic Questionnaire */}
                 {currentStep >= 2 && confirmedDocType && (
                     <div className={`transition-opacity duration-500 ease-out ${currentStep === 2 ? 'opacity-100 animate-fade-in' : 'opacity-50 cursor-not-allowed'}`}>
                         <Questionnaire
                             documentType={confirmedDocType} // Pass the confirmed document type name
                             selectedState={selectedState} // Pass selected state
                             onAnswersSubmit={handleAnswersSubmit}
                             isReadOnly={currentStep > 2} // Lock if past this step
                         />
                     </div>
                 )}
                 {currentStep < 2 && (
                     <Card className="shadow-lg rounded-lg opacity-50 cursor-not-allowed bg-card border border-border">
                         <CardHeader>
                             <div className="flex items-center space-x-2">
                                 <QuestionnaireIcon />
                                 <CardTitle className="text-2xl">Step 2: Answer Questions</CardTitle>
                             </div>
                             <CardDescription>
                                 Confirm a document type in Step 1 to see the questions.
                             </CardDescription>
                         </CardHeader>
                         <CardContent>
                             <p className="text-muted-foreground italic">Waiting for document confirmation from Step 1...</p>
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
                            isReadOnly={currentStep > 3} // Lock if past this step
                        />
                     </div>
                )}
                {currentStep < 3 && (
                    <Card className="shadow-lg rounded-lg opacity-50 cursor-not-allowed bg-card border border-border">
                         <CardHeader>
                             <div className="flex items-center space-x-2">
                                 <AlertTriangle className="h-6 w-6 text-orange-500" />
                                 <CardTitle className="text-2xl">Step 3: Important Disclaimer</CardTitle>
                             </div>
                             <CardDescription>
                                 Read and agree to the disclaimer before proceeding.
                             </CardDescription>
                         </CardHeader>
                         <CardContent>
                             <p className="text-muted-foreground italic">Complete the questions above to view the disclaimer.</p>
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
                             documentName={`${confirmedDocType || 'document'}.pdf`}
                             isReadOnly={currentStep > 4} // Lock if past this step
                         />
                     </div>
                 )}
                 {currentStep < 4 && (
                      <Card className="shadow-lg rounded-lg opacity-50 cursor-not-allowed bg-card border border-border">
                         <CardHeader>
                             <div className="flex items-center space-x-2">
                                 <FileSignature className="h-6 w-6 text-primary" />
                                 <CardTitle className="text-2xl">Step 4: Preview & Sign</CardTitle>
                             </div>
                             <CardDescription>
                                 Review the generated document and sign it digitally.
                             </CardDescription>
                         </CardHeader>
                         <CardContent>
                             <p className="text-muted-foreground italic">Agree to the disclaimer above to generate the document preview.</p>
                         </CardContent>
                     </Card>
                 )}

                 {/* Separator between steps */}
                 {currentStep > 4 && <Separator className="my-8" />}

                 {/* Step 5: Share & Track */}
                  {currentStep >= 5 && pdfDataUrl && ( // Changed condition to check for step 5
                     <Card className="shadow-lg rounded-lg transition-opacity duration-500 ease-out opacity-100 animate-fade-in bg-card border border-border">
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                 <ShareIcon />
                                 <CardTitle className="text-2xl">Step 5: Share & Download</CardTitle> {/* Updated title */}
                            </div>
                            <CardDescription>
                               Your document is ready! Share it securely or download it.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Placeholder for actual actions */}
                            <p className="text-muted-foreground mb-4">Actions available after document signing.</p>
                            <div className="flex space-x-4">
                                <Button disabled variant="outline"> <Upload className="mr-2 h-4 w-4" /> Share Securely (Soon)</Button>
                                {/* Enable download */}
                                <Button
                                  onClick={() => {
                                       if (pdfDataUrl) {
                                           const link = document.createElement('a');
                                           link.href = pdfDataUrl;
                                           link.download = `${confirmedDocType || 'document'}_signed.pdf`;
                                           document.body.appendChild(link);
                                           link.click();
                                           document.body.removeChild(link);
                                       }
                                   }}
                                   disabled={!pdfDataUrl}
                                >
                                    <Download className="mr-2 h-4 w-4" /> Download PDF
                                 </Button>
                            </div>
                        </CardContent>
                    </Card>
                  )}
                  {currentStep < 5 && ( // Changed condition to check for step 5
                     <Card className="shadow-lg rounded-lg opacity-50 cursor-not-allowed bg-card border border-border">
                           <CardHeader>
                               <div className="flex items-center space-x-2">
                                   <ShareIcon />
                                   <CardTitle className="text-2xl">Step 5: Share & Download</CardTitle> {/* Updated title */}
                               </div>
                               <CardDescription>
                                  Securely share your document or download it after signing.
                               </CardDescription>
                           </CardHeader>
                           <CardContent>
                               <p className="text-muted-foreground italic">Sign the document above to enable sharing and download.</p>
                           </CardContent>
                       </Card>
                  )}

            </div>
        </div>

        {/* Footer Sections */}
        <TestimonialCarousel />
        <FeaturedLogos />
        <GuaranteeBadge />

    </div>
  );
}
