'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Loader2, AlertCircle, Download } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SimplePDFViewerProps {
  pdfUrl: string;
  formData?: Record<string, unknown>;
  onOverlay?: (pdfBytes: ArrayBuffer) => Promise<ArrayBuffer>;
  className?: string;
}

export default function SimplePDFViewer({
  pdfUrl,
  formData,
  onOverlay,
  className
}: SimplePDFViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processedPdfUrl, setProcessedPdfUrl] = useState<string | null>(null);
  const [originalPdfBytes, setOriginalPdfBytes] = useState<ArrayBuffer | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const processPDF = useCallback(async () => {
    if (!pdfUrl) {
      setError('No PDF URL provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Ensure URL is absolute
      const absoluteUrl = pdfUrl.startsWith('http') ? pdfUrl : 
                         pdfUrl.startsWith('/') ? pdfUrl : 
                         `/${pdfUrl}`;
      
      console.log('SimplePDFViewer: Loading PDF from:', absoluteUrl);

      const response = await fetch(absoluteUrl);
      console.log('SimplePDFViewer: Fetch response:', {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
      }

      const pdfBytes = await response.arrayBuffer();
      setOriginalPdfBytes(pdfBytes);
      console.log('SimplePDFViewer: PDF loaded, size:', pdfBytes.byteLength, 'bytes');

      let finalPdfBytes = pdfBytes;

      if (onOverlay && formData && Object.keys(formData).length > 0) {
        console.log('SimplePDFViewer: Applying overlay...');
        try {
          finalPdfBytes = await onOverlay(pdfBytes);
          console.log('SimplePDFViewer: Overlay applied successfully');
        } catch (overlayError) {
          console.warn('SimplePDFViewer: Overlay failed, using original PDF:', overlayError);
          finalPdfBytes = pdfBytes;
        }
      }

      const blob = new Blob([finalPdfBytes], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      
      setProcessedPdfUrl(prevUrl => {
        if (prevUrl) {
          URL.revokeObjectURL(prevUrl);
        }
        return blobUrl;
      });
      console.log('SimplePDFViewer: PDF processed and blob URL created');

    } catch (err) {
      console.error('SimplePDFViewer: Error processing PDF:', err);
      setError(err instanceof Error ? err.message : 'Failed to load PDF');
    } finally {
      setLoading(false);
    }
  }, [pdfUrl, formData, onOverlay]);

  useEffect(() => {
    processPDF();

    return () => {
      if (processedPdfUrl) {
        URL.revokeObjectURL(processedPdfUrl);
      }
    };
  }, [processPDF, processedPdfUrl]);

  const handleDownload = useCallback(async () => {
    if (!originalPdfBytes) return;

    try {
      let finalPdfBytes = originalPdfBytes;

      if (onOverlay && formData && Object.keys(formData).length > 0) {
        console.log('SimplePDFViewer: Applying overlay for download...');
        finalPdfBytes = await onOverlay(originalPdfBytes);
      }

      const blob = new Blob([finalPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'vehicle-bill-of-sale.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('SimplePDFViewer: Download failed:', err);
    }
  }, [originalPdfBytes, onOverlay, formData]);

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center bg-muted rounded-lg", className)}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading PDF...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("p-4", className)}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!processedPdfUrl) {
    return (
      <div className={cn("flex items-center justify-center bg-muted rounded-lg", className)}>
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No PDF to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <div className="absolute top-2 right-2 z-10">
        <Button
          onClick={handleDownload}
          size="sm"
          variant="secondary"
          className="shadow-md"
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </div>
      
      <iframe
        ref={iframeRef}
        src={processedPdfUrl}
        className="w-full h-full border-0 rounded-lg"
        title="PDF Preview"
        onLoad={() => {
          console.log('SimplePDFViewer: PDF iframe loaded successfully');
        }}
        onKeyDown={() => {}}
        onError={(e) => {
          console.error('SimplePDFViewer: PDF iframe error:', e);
          setError('Failed to display PDF');
        }}
      />
    </div>
  );
}