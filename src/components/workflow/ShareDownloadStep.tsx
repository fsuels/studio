// src/components/share-download-step.tsx
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
  Download,
  Share2,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface ShareDownloadStepProps {
  signedPdfData: Blob | null;
  documentName: string;
  onStartOver?: () => void;
  isReadOnly?: boolean;
}

const ShareDownloadStep = React.memo(function ShareDownloadStep({
  signedPdfData,
  documentName,
  onStartOver,
  isReadOnly = false,
}: ShareDownloadStepProps) {
  const { toast } = useToast();
  const { t } = useTranslation('common');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleShare = () => {
    if (isReadOnly) return;
    toast({
      title: t('Share Feature Coming Soon'),
      description: t('Secure document sharing will be available shortly.'),
    });
  };

  const handleDownload = () => {
    if (isReadOnly || !signedPdfData) {
      toast({
        title: t('Download Error'),
        description: t('No document data available to download.'),
        variant: 'destructive',
      });
      return;
    }

    try {
      const url = window.URL.createObjectURL(signedPdfData);
      const a = document.createElement('a');
      a.href = url;
      a.download = documentName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: t('Download Started'),
        description: `${documentName} ${t('is downloading.')}`,
      });
    } catch (error) {
      console.error('Error during download:', error);
      toast({
        title: t('Download Failed'),
        description: t('Could not initiate the download.'),
        variant: 'destructive',
      });
    }
  };

  if (!isHydrated) {
    return (
      <div className="h-72 animate-pulse bg-muted rounded-lg shadow-lg border border-border"></div>
    );
  }

  const actionsDisabled = isReadOnly || !signedPdfData;

  return (
    <Card
      className={`shadow-lg rounded-lg bg-card border border-border ${actionsDisabled && !isReadOnly ? 'opacity-70' : ''} ${isReadOnly ? 'opacity-75' : ''}`}
    >
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Share2 className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">
            {t('shareDownloadStep.stepTitle')}
          </CardTitle>
        </div>
        <CardDescription>
          {actionsDisabled && !isReadOnly
            ? t('shareDownloadStep.disabledDescription')
            : t('shareDownloadStep.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!signedPdfData && !isReadOnly && (
          <div className="p-3 bg-yellow-50 border border-yellow-300 rounded-md text-yellow-700 text-sm flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <span>{t('shareDownloadStep.actionsPlaceholder')}</span>
          </div>
        )}
        {signedPdfData && (
          <div className="p-3 bg-green-100 border border-green-300 rounded-md text-green-800 text-sm flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            <span>{t('Document signed and ready!')}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <Button
            onClick={handleShare}
            disabled={actionsDisabled}
            variant="outline"
            className="w-full"
          >
            <Share2 className="mr-2 h-4 w-4" />
            {t('shareDownloadStep.shareButton')}
          </Button>
          <Button
            onClick={handleDownload}
            disabled={actionsDisabled}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Download className="mr-2 h-4 w-4" />
            {t('shareDownloadStep.downloadButton')}
          </Button>
        </div>
      </CardContent>
      {onStartOver && !isReadOnly && (
        <CardFooter className="border-t pt-6">
          <Button
            onClick={onStartOver}
            variant="ghost"
            className="w-full text-muted-foreground hover:text-primary"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            {t('Start Over')}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
});
export { ShareDownloadStep };
