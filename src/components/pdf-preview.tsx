"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileSignature, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signPdfDocument, DigitalSignatureResult } from '@/services/digital-signature'; // Assuming service exists

interface PdfPreviewProps {
  // Placeholder: In a real app, you'd pass the generated document data (e.g., as a Blob or URL)
  documentDataUrl?: string; // Example: URL to the generated PDF
  documentName?: string; // Example: "Lease Agreement.pdf"
}

export function PdfPreview({ documentDataUrl, documentName = "document.pdf" }: PdfPreviewProps) {
  const [isSigning, setIsSigning] = useState(false);
  const [signatureResult, setSignatureResult] = useState<DigitalSignatureResult | null>(null);
  const { toast } = useToast();

  // Placeholder for actual PDF data fetching or generation
  const pdfData = new Uint8Array([/* Some byte data representing the PDF */]); // Replace with actual data later

  const handleSignDocument = async () => {
    if (!pdfData || pdfData.length === 0) {
       toast({
        title: "No Document",
        description: "Cannot sign an empty document.",
        variant: "destructive",
      });
      return;
    }

    setIsSigning(true);
    setSignatureResult(null); // Clear previous result

    try {
      // In a real app, you might need more complex signature options
      const options = { /* Certificate info, signature appearance, etc. */ };
      const result = await signPdfDocument(pdfData, options);
      setSignatureResult(result);

      if (result.success) {
        toast({
          title: "Document Signed",
          description: result.message,
        });
        // Optionally trigger download of the signed document
        // downloadFile(result.signedPdf, `signed_${documentName}`);
      } else {
        toast({
          title: "Signing Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error signing document:', error);
      toast({
        title: "Signing Error",
        description: "An unexpected error occurred during signing.",
        variant: "destructive",
      });
    } finally {
      setIsSigning(false);
    }
  };

  // Helper function to trigger file download (implementation depends on environment)
  const downloadFile = (data: Uint8Array, filename: string) => {
     if (typeof window === 'undefined') return; // Only run in browser

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
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <FileSignature className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">Preview & Sign Document</CardTitle>
        </div>
        <CardDescription>
          Review the generated document below. You can digitally sign it when ready.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* PDF Viewer Placeholder */}
        <div className="border rounded-md p-4 min-h-[300px] flex items-center justify-center bg-muted/50">
          {documentDataUrl ? (
             <iframe src={documentDataUrl} width="100%" height="500px" title="PDF Preview" className="border-0"></iframe>
          ) : (
             <p className="text-muted-foreground italic">PDF Preview will load here...</p>
          )}

        </div>

        {signatureResult && signatureResult.success && (
            <div className="p-4 bg-green-100 border border-green-300 rounded-md text-green-800 text-sm flex items-center justify-between">
               <span>Document successfully signed!</span>
               <Button
                 variant="outline"
                 size="sm"
                 onClick={() => downloadFile(signatureResult.signedPdf, `signed_${documentName}`)}
               >
                 <Download className="mr-2 h-4 w-4" />
                 Download Signed PDF
               </Button>
            </div>
        )}
         {signatureResult && !signatureResult.success && (
            <div className="p-4 bg-red-100 border border-red-300 rounded-md text-red-800 text-sm">
               Signing failed: {signatureResult.message}
            </div>
        )}

      </CardContent>
      <CardFooter>
        <Button onClick={handleSignDocument} disabled={isSigning || !documentDataUrl || (!!signatureResult && signatureResult.success)} className="w-full">
          {isSigning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing...
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
