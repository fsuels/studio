"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileSignature, Download, CheckCircle } from 'lucide-react'; // Added CheckCircle
import { useToast } from '@/hooks/use-toast';
import { signPdfDocument, DigitalSignatureResult } from '@/services/digital-signature';

interface PdfPreviewProps {
  documentDataUrl?: string; // URL to the generated PDF
  documentName?: string; // Example: "Lease Agreement.pdf"
  isReadOnly?: boolean; // Optional prop to make the component read-only
}

export function PdfPreview({ documentDataUrl, documentName = "document.pdf", isReadOnly = false }: PdfPreviewProps) {
  const [isSigning, setIsSigning] = useState(false);
  const [signatureResult, setSignatureResult] = useState<DigitalSignatureResult | null>(null);
  const { toast } = useToast();

  // Placeholder for actual PDF data fetching or generation
  // In a real app, pdfData might be fetched based on documentDataUrl or passed directly
  const pdfData: Uint8Array | null = documentDataUrl ? new Uint8Array([/* Example: decode base64 or fetch bytes */]) : null;

  const handleSignDocument = async () => {
    if (isReadOnly || (signatureResult && signatureResult.success)) return; // Prevent signing if read-only or already signed

    if (!documentDataUrl) { // Check documentDataUrl existence before proceeding
       toast({ title: "No Document Data", description: "Cannot sign an empty document.", variant: "destructive" });
      return;
    }

    // Simulate fetching PDF data from URL if needed, otherwise use pre-loaded data
     // For this example, assume pdfData is derived/available if documentDataUrl exists
     const currentPdfData = pdfData || new Uint8Array([/* Fetch based on documentDataUrl */]); // Replace with actual fetch logic if needed

     if (!currentPdfData || currentPdfData.length === 0) {
         toast({ title: "No Document Data", description: "Could not load PDF data for signing.", variant: "destructive" });
         return;
     }


    setIsSigning(true);
    // Keep previous success result if available, otherwise clear
    if (!signatureResult?.success) {
        setSignatureResult(null);
    }


    try {
      // In a real app, integrate with a digital signature service API here
      // const result = await signDocumentApi(currentPdfData, signatureOptions);
      // For now, we simulate success using the mock service
      const options = { /* Signature options */ };
      const result = await signPdfDocument(currentPdfData, options); // Call the mock signing service
      setSignatureResult(result);

      if (result.success) {
        toast({ title: "Document Signed", description: result.message });
        // Optional: Automatically trigger download after successful signing
        // downloadFile(result.signedPdf, `signed_${documentName}`);
      } else {
        toast({ title: "Signing Failed", description: result.message, variant: "destructive" });
      }
    } catch (error) {
      console.error('Error signing document:', error);
      toast({ title: "Signing Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsSigning(false);
    }
  };

  // Helper function to trigger file download
  const downloadFile = (data: Uint8Array | null, filename: string) => {
     if (!data || typeof window === 'undefined') return;

    const blob = new Blob([data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };


  return (
    <Card className={`shadow-lg rounded-lg bg-card border border-border ${isReadOnly ? 'opacity-75' : ''}`}>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <FileSignature className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">Step 4: Preview & Sign Document</CardTitle> {/* Updated Step Number */}
        </div>
        <CardDescription>
          {isReadOnly
            ? "Document preview below. Signing and sharing is available in the next step."
            : "Review the generated document. You can digitally sign it when ready."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* PDF Viewer */}
        <div className="border rounded-md min-h-[300px] flex items-center justify-center bg-muted/50 overflow-hidden">
          {documentDataUrl ? (
             // Use an embed or object tag for better browser compatibility and control
             <object data={documentDataUrl} type="application/pdf" width="100%" height="500px" className="border-0">
                <p className="p-4 text-muted-foreground">Your browser does not support embedded PDFs. You can <a href={documentDataUrl} download={documentName} className="underline text-primary">download the PDF</a> to view it.</p>
             </object>
             // Alternative using iframe (simpler but sometimes less reliable)
             // <iframe src={documentDataUrl} width="100%" height="500px" title="PDF Preview" className="border-0"></iframe>
          ) : (
             <div className="p-4 text-center text-muted-foreground">
                <Loader2 className="mx-auto h-8 w-8 animate-spin mb-2" />
                Generating document preview...
             </div>
          )}
        </div>

        {/* Signature Status and Download */}
        {signatureResult && signatureResult.success && (
            <div className="p-3 bg-green-100 border border-green-300 rounded-md text-green-800 text-sm flex items-center justify-between gap-2">
               <div className="flex items-center gap-2">
                 <CheckCircle className="h-5 w-5" />
                 <span>Document successfully signed! Proceed to the next step to share or download.</span>
               </div>
               {/* Keep download button maybe, or move it to the final step */}
               {/* <Button
                 variant="outline"
                 size="sm"
                 onClick={() => downloadFile(signatureResult.signedPdf, `signed_${documentName}`)}
                 className="bg-green-200 hover:bg-green-300 border-green-400 text-green-900"
               >
                 <Download className="mr-2 h-4 w-4" />
                 Download Signed PDF
               </Button> */}
            </div>
        )}
         {signatureResult && !signatureResult.success && !isSigning && (
            <div className="p-3 bg-red-100 border border-red-300 rounded-md text-red-800 text-sm">
               Signing failed: {signatureResult.message}
            </div>
        )}

      </CardContent>
      <CardFooter>
        <Button
           onClick={handleSignDocument}
           disabled={isSigning || !documentDataUrl || (!!signatureResult && signatureResult.success) || isReadOnly}
           className="w-full transition-colors duration-200"
           aria-label={signatureResult?.success ? "Document Already Signed" : "Sign Document Digitally"}
        >
          {isSigning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing...
            </>
          ) : signatureResult?.success ? (
             <>
               <CheckCircle className="mr-2 h-4 w-4 text-green-300" />
               Document Signed - Proceed to Next Step
             </>
          ) : (
             <>
               <FileSignature className="mr-2 h-4 w-4" />
               Sign Document Digitally
             </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
