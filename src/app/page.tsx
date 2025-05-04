
"use client"; // Mark page as client component due to state management and client children

import React, { useState, useEffect } from 'react'; // Ensure useEffect is imported if used elsewhere
import type { InferDocumentTypeOutput } from '@/ai/flows/infer-document-type';
import { DocumentInference } from '@/components/document-inference';
import DocumentTypeSelector, { SuggestedDoc } from '@/components/DocumentTypeSelector'; // Import the new selector
import DynamicFormRenderer from '@/components/DynamicFormRenderer'; // Import the new dynamic renderer
import { formSchemas } from '@/data/formSchemas'; // Import schemas
import { DisclaimerStep } from '@/components/disclaimer-step'; // Import the new disclaimer step
import { PdfPreview } from '@/components/pdf-preview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText, FileSignature, Check, Upload, AlertTriangle, Download, ListChecks } from 'lucide-react'; // Added ListChecks icon
import { TestimonialCarousel } from '@/components/landing/TestimonialCarousel';
import { FeaturedLogos } from '@/components/landing/FeaturedLogos';
import { GuaranteeBadge } from '@/components/landing/GuaranteeBadge';
import { Button } from '@/components/ui/button'; // Import Button
import { useToast } from '@/hooks/use-toast'; // Import useToast
import HeroFeatureSection from '@/components/HeroFeatureSection'; // Corrected import path
import ThreeStepSection from '@/components/ThreeStepSection'; // Corrected import path for ThreeStepSection


// Define share icon SVG inline
const ShareIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
);


export default function Home() {
  console.log('[page.tsx] Home component rendering...');
  const { toast } = useToast();

  const [inferenceResult, setInferenceResult] = useState<InferDocumentTypeOutput | null>(null); // Store the raw AI output
  const [selectedDocType, setSelectedDocType] = useState<string | null>(null); // Store the *confirmed* document type name
  const [selectedState, setSelectedState] = useState<string | undefined>(undefined); // Store selected state from inference step
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<Record<string, any> | null>(null);
  const [disclaimerAgreed, setDisclaimerAgreed] = useState<boolean>(false); // New state for disclaimer
  const [pdfDataUrl, setPdfDataUrl] = useState<string | undefined>(undefined);

  // Determine current step based on state
  const getCurrentStep = () => {
    if (pdfDataUrl) return 5; // Share/Download is now Step 5
    if (disclaimerAgreed) return 4; // PDF Preview is now Step 4
    if (questionnaireAnswers) return 3; // Disclaimer is now Step 3
    if (selectedDocType) return 2; // Questionnaire is Step 2 (based on confirmed type)
    return 1; // Inference is Step 1
  };
  const currentStep = getCurrentStep();

  // Handler for when DocumentInference completes its analysis
  const handleInferenceComplete = (output: InferDocumentTypeOutput | null, state?: string) => {
    console.log('[page.tsx] handleInferenceComplete called with output:', output, 'State:', state);
    setInferenceResult(output); // Store the raw output
    setSelectedState(state); // Store the state used for inference
    setSelectedDocType(null); // Reset selection, user must pick from suggestions
    // Reset subsequent steps
    setQuestionnaireAnswers(null);
    setDisclaimerAgreed(false);
    setPdfDataUrl(undefined);

     if (output) {
        toast({ title: "Analysis Complete", description: "AI suggestions loaded below. Please review and select the best fit." });
     } else {
         // Handle case where inference resulted in null (e.g., error or cleared input)
         toast({ title: "Input Cleared or Error", description: "Provide a description to get suggestions.", variant: "destructive" });
     }
  };

  // Handler for when user selects a document type from the DocumentTypeSelector
  const handleDocumentTypeSelected = (docName: string) => {
      console.log(`[page.tsx] handleDocumentTypeSelected: User selected ${docName}`);
      setSelectedDocType(docName); // Confirm the selection
       toast({ title: "Document Type Confirmed", description: `Proceeding with ${docName}.` });
       // Reset subsequent steps if user re-selects
        setQuestionnaireAnswers(null);
        setDisclaimerAgreed(false);
        setPdfDataUrl(undefined);
      // Optional: Automatically scroll to the next step or highlight it
  }

  // Questionnaire submit now leads to disclaimer step
  const handleAnswersSubmit = (answers: Record<string, any>) => {
    console.log('[page.tsx] handleAnswersSubmit called with:', answers);
    setQuestionnaireAnswers(answers);
    setDisclaimerAgreed(false); // Ensure disclaimer needs agreement again
    setPdfDataUrl(undefined); // Clear previous PDF if re-submitting
    console.log("[page.tsx] Questionnaire submitted, proceeding to disclaimer step.");
     toast({ title: "Details Recorded", description: "Proceed to the disclaimer." });
  };

  // Disclaimer agreement triggers PDF generation (simulation)
  const handleDisclaimerAgree = async () => { // Make async to await generation
     console.log('[page.tsx] handleDisclaimerAgree called.');
     setDisclaimerAgreed(true);
     console.log("[page.tsx] Disclaimer agreed. Triggering PDF generation with type:", selectedDocType, "answers:", questionnaireAnswers);

     if (!selectedDocType || !questionnaireAnswers) {
         toast({ title: "Missing Data", description: "Cannot generate PDF without document type and answers.", variant: "destructive"});
         setDisclaimerAgreed(false); // Revert agreement state
         return;
     }

     // Show loading toast
      const generationToast = toast({
          title: "Generating Document...",
          description: "Please wait while we create your PDF.",
          duration: 999999, // Keep open until dismissed
      });

     try {
        // Call the actual PDF generation service (simulated via fetch to API route for now)
         // In production with static export, this should call a Cloud Function URL
         const response = await fetch('/api/generate-pdf', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
                 documentType: selectedDocType,
                 answers: questionnaireAnswers,
                 state: selectedState, // Pass state if needed for generation
             }),
         });

         generationToast.dismiss(); // Dismiss loading toast

         if (!response.ok) {
            const errorData = await response.json();
             console.error("[page.tsx] PDF generation failed:", errorData);
             toast({ title: "PDF Generation Failed", description: errorData.error || "Could not generate the document.", variant: "destructive"});
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
         toast({ title: "Document Ready!", description: "Your PDF preview is loaded below." });

     } catch (error) {
          generationToast.dismiss();
          console.error("[page.tsx] Error during PDF generation fetch:", error);
          toast({ title: "PDF Generation Error", description: "An unexpected error occurred.", variant: "destructive"});
          setDisclaimerAgreed(false); // Revert agreement state
     }
  }

  // Prepare suggestions for DocumentTypeSelector
   const suggestionsForSelector: SuggestedDoc[] = [];
   if (inferenceResult) {
       suggestionsForSelector.push({
           name: inferenceResult.documentType,
           reason: inferenceResult.reasoning || `Primary suggestion based on your input. Confidence: ${(inferenceResult.confidence * 100).toFixed(0)}%`,
           confidence: inferenceResult.confidence,
       });
       inferenceResult.alternatives?.forEach(alt => {
           if (alt !== inferenceResult.documentType) { // Avoid duplicates
               suggestionsForSelector.push({ name: alt, reason: "An alternative possibility based on your input." });
           }
       });
        // Add "General Inquiry" / "None of these" if not already present
       if (!suggestionsForSelector.some(s => s.name === 'General Inquiry')) {
           suggestionsForSelector.push({ name: 'General Inquiry', reason: 'If none of the above seem correct, or if you need further clarification.' });
       }
   }

  // Get the relevant form schema for the selected document type
   const currentFormSchema = selectedDocType ? (formSchemas[selectedDocType] || formSchemas['default']) : [];


  return (
    <div className="flex flex-col items-center w-full bg-background">
       <HeroFeatureSection /> {/* Use the combined Hero/Feature component */}
       <ThreeStepSection /> {/* Render 3 Step Section */}

        {/* Main Workflow Section - Wrapper with padding and ID */}
        <div id="workflow-start" className="w-full max-w-5xl mx-auto px-4 py-12 space-y-12">

            {/* Step Panels Wrapper - Use max-w-3xl for better focus */}
            <div className="w-full max-w-3xl mx-auto space-y-8">
                {/* Step 1: Document Inference & Confirmation */}
                <Card className={`shadow-lg rounded-lg bg-card border border-border transition-all duration-500 ease-out ${currentStep > 1 ? 'opacity-50 cursor-not-allowed' : 'animate-fade-in'}`}>
                    <CardHeader>
                    <div className="flex items-center space-x-2">
                        <FileText className="h-6 w-6 text-primary" />
                        <CardTitle className="text-2xl">Step 1: Describe & Confirm</CardTitle>
                    </div>
                    <CardDescription>
                        {currentStep > 1
                            ? `Document type confirmed: ${selectedDocType || "N/A"} ${selectedState ? `(State: ${selectedState})` : ''}`
                            : "Describe your situation and select the relevant U.S. state. Our AI will suggest document types."}
                    </CardDescription>
                    </CardHeader>
                    {currentStep === 1 && (
                        <CardContent>
                            {/* DocumentInference now only triggers analysis, selection happens below */}
                            <DocumentInference onInferenceResult={handleInferenceComplete} />
                             {/* Display suggestions using DocumentTypeSelector if analysis is complete */}
                            {inferenceResult && (
                                 <DocumentTypeSelector
                                     suggestions={suggestionsForSelector}
                                     onSelect={handleDocumentTypeSelected}
                                 />
                            )}
                        </CardContent>
                    )}
                </Card>


                {/* Separator between steps */}
                {currentStep > 1 && <Separator className="my-8" />}

                {/* Step 2: Dynamic Form Renderer */}
                 {currentStep >= 2 && selectedDocType && (
                     <div className={`transition-opacity duration-500 ease-out ${currentStep === 2 ? 'opacity-100 animate-fade-in' : 'opacity-50 cursor-not-allowed'}`}>
                         <DynamicFormRenderer
                             documentType={selectedDocType} // Pass the confirmed document type name
                             schema={currentFormSchema} // Pass the dynamically loaded schema
                             onSubmit={handleAnswersSubmit}
                             isReadOnly={currentStep > 2} // Lock if past this step
                         />
                     </div>
                 )}
                 {currentStep < 2 && (
                     <Card className="shadow-lg rounded-lg opacity-50 cursor-not-allowed bg-card border border-border">
                         <CardHeader>
                             <div className="flex items-center space-x-2">
                                 <ListChecks className="h-6 w-6 text-primary" /> {/* Updated Icon */}
                                 <CardTitle className="text-2xl">Step 2: Provide Details</CardTitle> {/* Updated Title */}
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
                             documentName={`${selectedDocType || 'document'}.pdf`}
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
                                           link.download = `${selectedDocType || 'document'}_signed.pdf`; // Use selectedDocType
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

    