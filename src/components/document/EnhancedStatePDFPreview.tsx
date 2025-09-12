'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Loader2, FileText, AlertCircle, Download, Eye, Maximize2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getStateFormPath, getFormDisplayName } from '@/lib/pdf/state-form-manager';
import { getVehicleBillOfSaleCompliance } from '@/lib/compliance-helper';
import { overlayFormData } from '@/lib/pdf/pdf-overlay-service';
import { cn } from '@/lib/utils';

interface EnhancedStatePDFPreviewProps {
  state: string;
  formData: Record<string, unknown>;
  documentType: 'vehicle-bill-of-sale';
  showLivePreview?: boolean;
  onFormDataChange?: (data: Record<string, unknown>) => void;
}

export default function EnhancedStatePDFPreview({ 
  state, 
  formData,
  documentType: _documentType,
  showLivePreview = true,
  onFormDataChange: _onFormDataChange
}: EnhancedStatePDFPreviewProps) {
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [processedPdfUrl, setProcessedPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastProcessedData, setLastProcessedData] = useState<Record<string, unknown> | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);

  const compliance = getVehicleBillOfSaleCompliance(state);
  const formName = getFormDisplayName(state);

  // Load the PDF file
  useEffect(() => {
    if (!state || state.length !== 2) {
      setLoading(false);
      return;
    }

    const loadStatePDF = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const formPath = getStateFormPath(state);
        
        if (!formPath) {
          setError('No official form available for this state');
          setLoading(false);
          return;
        }

        // Load the PDF file
        const response = await fetch(formPath);
        
        if (!response.ok) {
          throw new Error(`Failed to load PDF: ${response.status} ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        setPdfBytes(arrayBuffer);
        setPdfUrl(formPath);
        
      } catch (err) {
        console.error('Error loading state PDF:', err);
        setError('Failed to load state form');
      } finally {
        setLoading(false);
      }
    };

    loadStatePDF();
  }, [state]);

  // Process PDF with form data overlay
  const processPDFWithFormData = useCallback(async () => {
    if (!pdfBytes || !showLivePreview) return;

    try {
      // Check if form data has changed
      const formDataString = JSON.stringify(formData);
      if (formDataString === lastProcessedData) {
        return; // No changes, skip processing
      }

      let processedBytes = pdfBytes;
      
      // Apply form data overlay if we have data
      if (formData && Object.keys(formData).length > 0) {
        try {
          processedBytes = await overlayFormData(pdfBytes, formData, state);
        } catch (overlayError) {
          console.warn('Form overlay failed, using original PDF:', overlayError);
          processedBytes = pdfBytes;
        }
      }

      // Create blob URL
      const blob = new Blob([processedBytes], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);

      // Clean up previous blob URL
      if (processedPdfUrl) {
        URL.revokeObjectURL(processedPdfUrl);
      }

      setProcessedPdfUrl(blobUrl);
      setLastProcessedData(formDataString);

    } catch (err) {
      console.error('Error processing PDF with form data:', err);
      // Fall back to original PDF
      if (pdfBytes) {
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        
        if (processedPdfUrl) {
          URL.revokeObjectURL(processedPdfUrl);
        }
        
        setProcessedPdfUrl(blobUrl);
      }
    }
  }, [pdfBytes, formData, showLivePreview, lastProcessedData, processedPdfUrl, state]);

  // Update PDF when form data changes
  useEffect(() => {
    if (pdfBytes && showLivePreview) {
      processPDFWithFormData();
    }
  }, [pdfBytes, formData, processPDFWithFormData, showLivePreview]);

  // Initial processing when PDF loads
  useEffect(() => {
    if (pdfBytes && !processedPdfUrl) {
      processPDFWithFormData();
    }
  }, [pdfBytes, processedPdfUrl, processPDFWithFormData]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (processedPdfUrl) {
        URL.revokeObjectURL(processedPdfUrl);
      }
    };
  }, [processedPdfUrl]);

  const handleDownload = useCallback(async () => {
    if (!pdfBytes) return;

    try {
      let finalPdfBytes = pdfBytes;

      if (formData && Object.keys(formData).length > 0) {
        try {
          finalPdfBytes = await overlayFormData(pdfBytes, formData, state);
        } catch (overlayError) {
          console.warn('Download overlay failed, using original PDF:', overlayError);
        }
      }

      const blob = new Blob([finalPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${state.toLowerCase()}-vehicle-bill-of-sale.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
  }, [pdfBytes, formData, state]);

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      if (fullscreenRef.current?.requestFullscreen) {
        fullscreenRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  if (!state || state.length !== 2) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Select a state to preview the official form
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">
            Loading {state.toUpperCase()} official form...
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Preparing live preview with your answers
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error || !pdfUrl) {
    return (
      <Card className="h-full">
        <CardContent className="py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || 'Unable to load state form'}
            </AlertDescription>
          </Alert>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Using generic bill of sale template for {state.toUpperCase()}
            </p>
            <div className="border rounded-lg bg-white p-8 min-h-[600px]">
              <h2 className="text-2xl font-bold mb-6">Vehicle Bill of Sale</h2>
              <div className="text-left space-y-4">
                <p><strong>State:</strong> {state.toUpperCase()}</p>
                {formData.seller_name && (
                  <p><strong>Seller:</strong> {formData.seller_name}</p>
                )}
                {formData.buyer_name && (
                  <p><strong>Buyer:</strong> {formData.buyer_name}</p>
                )}
                {formData.year && formData.make && formData.model && (
                  <p><strong>Vehicle:</strong> {formData.year} {formData.make} {formData.model}</p>
                )}
                {formData.vin && (
                  <p><strong>VIN:</strong> {formData.vin}</p>
                )}
                {formData.price && (
                  <p><strong>Sale Price:</strong> ${formData.price}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div ref={fullscreenRef} className={cn("h-full", isFullscreen ? "fixed inset-0 z-50 bg-white" : "")}>
      <Card className="h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">
                {state.toUpperCase()} Official Form
              </CardTitle>
              {formName && (
                <Badge variant="secondary" className="text-xs">
                  {formName}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {compliance?.requiresNotary && (
                <Badge variant="destructive" className="text-xs">
                  Notary Required
                </Badge>
              )}
              <Button
                onClick={toggleFullscreen}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                <Maximize2 className="h-3 w-3 mr-1" />
                {isFullscreen ? 'Exit' : 'Fullscreen'}
              </Button>
              <Button
                onClick={handleDownload}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                <Download className="h-3 w-3 mr-1" />
                Download
              </Button>
            </div>
          </div>
          
          {showLivePreview && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span>Live Preview - Your answers appear automatically</span>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-4 pt-0">
          {processedPdfUrl ? (
            <div className="relative">
              {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
              <iframe
                ref={iframeRef}
                src={processedPdfUrl}
                className={cn(
                  "w-full border-0 rounded-lg",
                  isFullscreen ? "h-[calc(100vh-120px)]" : "h-[800px]"
                )}
                title="PDF Preview"
                onLoad={() => {
                  console.log('Enhanced PDF loaded successfully');
                }}
                onKeyDown={() => {}}
                onError={(e) => {
                  console.error('Enhanced PDF iframe error:', e);
                  setError('Failed to display PDF');
                }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-[800px] bg-muted rounded-lg">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Processing form with your answers...</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}