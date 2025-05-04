"use client";

import { useState, useEffect } from 'react'; // Import useEffect
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileSignature, Download, CheckCircle } from 'lucide-react'; // Added CheckCircle
import { useToast } from '@/hooks/use-toast';
import { signPdfDocument, DigitalSignatureResult } from '@/services/digital-signature';
import { useTranslation } from 'react-i18next'; // Import useTranslation

interface PdfPreviewProps {
  documentDataUrl?: string; // URL to the generated PDF
  documentName?: string; // Example: "Lease Agreement.pdf"
  isReadOnly?: boolean; // Optional prop to make the component read-only
}

export function PdfPreview({ documentDataUrl, documentName = "document.pdf", isReadOnly = false }: PdfPreviewProps) {
  const [isSigning, setIsSigning] = useState(false);
  const [signatureResult, setSignatureResult] = useState<DigitalSignatureResult | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation(); // Get translation function
  const [isHydrated, setIsHydrated] = useState(false); // State for hydration

  useEffect(() => {
    setIsHydrated(true); // Set hydrated state on client
  }, []);


  // Placeholder for actual PDF data fetching or generation
  // In a real app, pdfData might be fetched based on documentDataUrl or passed directly
  const pdfData: Uint8Array | null = documentDataUrl ? new Uint8Array([/* Example: decode base64 or fetch bytes */]) : null;

  const handleSignDocument = async () => {
    if (isReadOnly || (signatureResult && signatureResult.success)) return; // Prevent signing if read-only or already signed

    if (!documentDataUrl) { // Check documentDataUrl existence before proceeding
       toast({ title: t('pdfPreview.noDocumentDataTitle'), description: t('pdfPreview.noDocumentDataDescriptionSign'), variant: "destructive" });
      return;
    }

    // Simulate fetching PDF data from URL if needed, otherwise use pre-loaded data
     // For this example, assume pdfData is derived/available if documentDataUrl exists
     const currentPdfData = pdfData || new Uint8Array([/* Fetch based on documentDataUrl */]); // Replace with actual fetch logic if needed

     if (!currentPdfData || currentPdfData.length === 0) {
         toast({ title: t('pdfPreview.noDocumentDataTitle'), description: t('pdfPreview.noDocumentDataDescriptionLoad'), variant: "destructive" });
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
        toast({ title: t('pdfPreview.signingSuccessTitle'), description: t('pdfPreview.signingSuccessDescription') });
        // Optional: Automatically trigger download after successful signing
        // downloadFile(result.signedPdf, `signed_${documentName}`);
      } else {
        toast({ title: t('pdfPreview.signingFailedTitle'), description: result.message, variant: "destructive" });
      }
    } catch (error) {
      console.error('Error signing document:', error);
      toast({ title: t('pdfPreview.signingErrorTitle'), description: t('pdfPreview.signingErrorDescription'), variant: "destructive" });
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

  // Show placeholder or nothing if not hydrated
  if (!isHydrated) {
    return <div className="h-[600px] animate-pulse bg-muted rounded-lg shadow-lg border border-border"></div>; // Example placeholder
  }


  return (
    <Card className={`shadow-lg rounded-lg bg-card border border-border ${isReadOnly ? 'opacity-75' : ''}`}>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <FileSignature className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">{t('pdfPreview.stepTitle')}</CardTitle> {/* Updated Step Number */}
        </div>
        <CardDescription>
          {isReadOnly
            ? t('pdfPreview.descriptionReadOnly')
            : t('pdfPreview.descriptionSign')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* PDF Viewer */}
        <div className="border rounded-md min-h-[300px] flex items-center justify-center bg-muted/50 overflow-hidden">
          {documentDataUrl ? (
             // Use an embed or object tag for better browser compatibility and control
             <object data={documentDataUrl} type="application/pdf" width="100%" height="500px" className="border-0">
                <p className="p-4 text-muted-foreground">
                  {t('pdfPreview.browserNotSupported')} {' '}
                  <a href={documentDataUrl} download={documentName} className="underline text-primary">
                    {t('pdfPreview.downloadLink')}
                  </a>{' '}
                  {t('pdfPreview.toViewIt')}
                </p>
             </object>
          ) : (
             <div className="p-4 text-center text-muted-foreground">
                <Loader2 className="mx-auto h-8 w-8 animate-spin mb-2" />
                {t('pdfPreview.generatingPreview')}
             </div>
          )}
        </div>

        {/* Signature Status and Download */}
        {signatureResult && signatureResult.success && (
            <div className="p-3 bg-green-100 border border-green-300 rounded-md text-green-800 text-sm flex items-center justify-between gap-2">
               <div className="flex items-center gap-2">
                 <CheckCircle className="h-5 w-5" />
                 <span>{t('pdfPreview.signingSuccessDescription')}</span>
               </div>
            </div>
        )}
         {signatureResult && !signatureResult.success && !isSigning && (
            <div className="p-3 bg-red-100 border border-red-300 rounded-md text-red-800 text-sm">
               {t('pdfPreview.signingFailedTitle')}: {signatureResult.message}
            </div>
        )}

      </CardContent>
      <CardFooter>
        <Button
           onClick={handleSignDocument}
           disabled={isSigning || !documentDataUrl || (!!signatureResult && signatureResult.success) || isReadOnly}
           className="w-full transition-colors duration-200"
           aria-label={signatureResult?.success ? t('pdfPreview.alreadySignedButton') : t('pdfPreview.signButton')}
        >
          {isSigning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('pdfPreview.signingButton')}
            </>
          ) : signatureResult?.success ? (
             <>
               <CheckCircle className="mr-2 h-4 w-4 text-green-300" />
               {t('pdfPreview.signedButton')}
             </>
          ) : (
             <>
               <FileSignature className="mr-2 h-4 w-4" />
               {t('pdfPreview.signButton')}
             </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
