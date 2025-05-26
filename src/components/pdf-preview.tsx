// src/components/pdf-preview.tsx
'use client';

import React, { useState, useEffect } from 'react'; // Import React
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Loader2,
  FileSignature,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  signPdfDocument,
  DigitalSignatureResult,
} from '@/services/digital-signature';
import { useTranslation } from 'react-i18next';

interface PdfPreviewProps {
  documentDataUrl?: string;
  documentName?: string;
  isReadOnly?: boolean;
  onSignSuccess?: () => void;
}

const PdfPreview = React.memo(function PdfPreview({
  documentDataUrl,
  documentName = 'document.pdf',
  isReadOnly = false,
  onSignSuccess,
}: PdfPreviewProps) {
  const [isSigning, setIsSigning] = useState(false);
  const [signatureResult, setSignatureResult] =
    useState<DigitalSignatureResult | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation('common');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleSignDocument = async () => {
    if (isReadOnly || (signatureResult && signatureResult.success)) return;

    if (!documentDataUrl) {
      toast({
        title: t('pdfPreview.noDocumentDataTitle'),
        description: t('pdfPreview.noDocumentDataDescriptionSign'),
        variant: 'destructive',
      });
      return;
    }

    const dummyPdfData = new Uint8Array([0]);

    if (!dummyPdfData || dummyPdfData.length === 0) {
      toast({
        title: t('pdfPreview.noDocumentDataTitle'),
        description: t('pdfPreview.noDocumentDataDescriptionLoad'),
        variant: 'destructive',
      });
      return;
    }

    setIsSigning(true);
    if (!signatureResult?.success) {
      setSignatureResult(null);
    }

    try {
      const result = await signPdfDocument(dummyPdfData, {
        fileName: documentName,
      });
      setSignatureResult(result);

      if (result.success) {
        toast({
          title: t('pdfPreview.signingSuccessTitle'),
          description: t('pdfPreview.signingSuccessDescription'),
        });
        if (onSignSuccess) {
          onSignSuccess();
        }
      } else {
        toast({
          title: t('pdfPreview.signingFailedTitle'),
          description: result.message || t('An error occurred during signing.'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error signing document:', error);
      toast({
        title: t('pdfPreview.signingErrorTitle'),
        description: t('pdfPreview.signingErrorDescription'),
        variant: 'destructive',
      });
    } finally {
      setIsSigning(false);
    }
  };

  if (!isHydrated) {
    return (
      <div className="h-[600px] animate-pulse bg-muted rounded-lg shadow-lg border border-border"></div>
    );
  }

  return (
    <Card
      className={`shadow-lg rounded-lg bg-card border border-border ${isReadOnly ? 'opacity-75' : ''}`}
    >
      <CardHeader>
        <div className="flex items-center space-x-2">
          <FileSignature className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">
            {t('pdfPreview.stepTitle')}
          </CardTitle>
        </div>
        <CardDescription>
          {isReadOnly
            ? t('pdfPreview.descriptionReadOnly')
            : signatureResult?.success
              ? t('pdfPreview.descriptionReadOnly')
              : t('pdfPreview.descriptionSign')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-md min-h-[300px] flex items-center justify-center bg-muted/50 overflow-hidden">
          {documentDataUrl ? (
            <object
              data={documentDataUrl}
              type="application/pdf"
              width="100%"
              height="500px"
              className="border-0"
            >
              <p className="p-4 text-muted-foreground">
                {t('pdfPreview.browserNotSupported')}{' '}
                <a
                  href={documentDataUrl}
                  download={documentName}
                  className="underline text-primary"
                >
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

        {signatureResult && signatureResult.success && (
          <div className="p-3 bg-green-100 border border-green-300 rounded-md text-green-800 text-sm flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>{t('pdfPreview.signingSuccessDescription')}</span>
            </div>
            {signatureResult.signingUrl && (
              <a
                href={signatureResult.signingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-primary text-xs"
              >
                {t('pdfPreview.openSigningLink')}
              </a>
            )}
          </div>
        )}
        {signatureResult && !signatureResult.success && !isSigning && (
          <div className="p-3 bg-red-100 border border-red-300 rounded-md text-red-800 text-sm flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <span>
              {t('pdfPreview.signingFailedTitle')}: {signatureResult.message}
            </span>
          </div>
        )}
      </CardContent>
      {!isReadOnly && (
        <CardFooter>
          <Button
            onClick={handleSignDocument}
            disabled={
              isSigning ||
              !documentDataUrl ||
              (!!signatureResult && signatureResult.success)
            }
            className="w-full transition-colors duration-200"
            aria-label={
              signatureResult?.success
                ? t('pdfPreview.alreadySignedButton')
                : t('pdfPreview.signButton')
            }
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
      )}
    </Card>
  );
});
export { PdfPreview };
