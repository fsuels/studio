
"use client"; // Mark page as client component due to state management

import { useState } from 'react';
import type { InferDocumentTypeOutput } from '@/ai/flows/infer-document-type';
import { DocumentInference } from '@/components/document-inference';
import { Questionnaire } from '@/components/questionnaire'; // Import Questionnaire
import { PdfPreview } from '@/components/pdf-preview'; // Import PdfPreview
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText, FileSignature } from 'lucide-react';

// Define questionnaire icon SVG inline
const QuestionnaireIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
);


export default function Home() {
  const [inferredDocType, setInferredDocType] = useState<string | null>(null);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<Record<string, any> | null>(null);
  // Placeholder for PDF data URL - In a real app, this would be generated
  const [pdfDataUrl, setPdfDataUrl] = useState<string | undefined>(undefined);

  // Callback to receive inferred document type from DocumentInference
  const handleDocumentInferred = (result: InferDocumentTypeOutput | null) => {
    setInferredDocType(result ? result.documentType : null);
    // Reset downstream state when inference changes
    setQuestionnaireAnswers(null);
    setPdfDataUrl(undefined);
  };

  // Callback to receive answers from Questionnaire
  const handleAnswersSubmit = (answers: Record<string, any>) => {
    setQuestionnaireAnswers(answers);
    // Placeholder: Simulate PDF generation based on answers
    console.log("Generating PDF with answers:", answers);
    // In a real app, call a backend service to generate PDF and get a URL
    // For now, just set a dummy URL to enable the preview section
    setTimeout(() => setPdfDataUrl("dummy-pdf-url.pdf"), 500); // Simulate generation delay
  };


  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 text-primary">123LegalDoc</h1>
        <p className="text-lg text-muted-foreground">
          Describe your situation, and we'll guide you through creating the right legal document.
        </p>
      </header>

      <div className="w-full max-w-3xl space-y-8">
        {/* Step 1: Document Inference */}
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Step 1: Describe Your Situation</CardTitle>
            </div>
            <CardDescription>
              Use the text box or microphone below. Our AI will suggest the best document type.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Pass callback to DocumentInference */}
            <DocumentInference onInferenceResult={handleDocumentInferred} />
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Step 2: Dynamic Questionnaire */}
         {/* Pass inferredDocType and callback to Questionnaire */}
         {/* Conditionally render or show placeholder */}
         {inferredDocType ? (
             <Questionnaire
              documentType={inferredDocType}
              onAnswersSubmit={handleAnswersSubmit}
             />
         ) : (
             <Card className="shadow-lg rounded-lg opacity-50 cursor-not-allowed">
                 <CardHeader>
                     <div className="flex items-center space-x-2">
                         <QuestionnaireIcon />
                         <CardTitle className="text-2xl">Step 2: Answer Questions</CardTitle>
                     </div>
                     <CardDescription>
                         Once a document type is inferred, answer questions here.
                     </CardDescription>
                 </CardHeader>
                 <CardContent>
                     <p className="text-muted-foreground italic">Waiting for document type from Step 1...</p>
                 </CardContent>
             </Card>
         )}


        <Separator className="my-8" />

        {/* Step 3: PDF Preview & Signing */}
         {/* Pass generated PDF URL (if available) to PdfPreview */}
         {/* Conditionally render or show placeholder */}
         {questionnaireAnswers && pdfDataUrl ? (
             <PdfPreview documentDataUrl={pdfDataUrl} documentName={`${inferredDocType || 'document'}.pdf`} />
         ) : (
              <Card className="shadow-lg rounded-lg opacity-50 cursor-not-allowed">
                 <CardHeader>
                     <div className="flex items-center space-x-2">
                         <FileSignature className="h-6 w-6 text-primary" />
                         <CardTitle className="text-2xl">Step 3: Preview & Sign</CardTitle>
                     </div>
                     <CardDescription>
                         Review the generated document and sign it digitally.
                     </CardDescription>
                 </CardHeader>
                 <CardContent>
                     <p className="text-muted-foreground italic">Complete Step 2 to generate the document preview.</p>
                 </CardContent>
             </Card>
         )}
      </div>
    </div>
  );
}
