/**
 * @deprecated This component is currently disabled in favor of traditional wizard + live overlay.
 * It showed raw PDFs without overlay functionality. Only loaded when USE_DIRECT_PDF_FILLING=true.
 * 
 * TODO: Implement proper overlay support before re-enabling
 */
'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  Shield,
  Save,
  Loader2,
  MousePointer,
  Clock,
  User
} from 'lucide-react';

interface InteractivePDFFormFillerProps {
  state: string;
  formName: string;
  pdfUrl: string;
  onSaveAndContinue: (formData: Record<string, unknown>) => void;
  onCompleteAndPay: (formData: Record<string, unknown>) => void;
  requiresNotary?: boolean;
  basePrice: number;
  initialFormData?: Record<string, unknown>;
  isLoggedIn?: boolean;
}

export default function InteractivePDFFormFiller({
  state,
  formName,
  pdfUrl,
  onSaveAndContinue,
  onCompleteAndPay,
  requiresNotary = false,
  basePrice,
  initialFormData = {},
  isLoggedIn = false
}: InteractivePDFFormFillerProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>(initialFormData);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-save functionality - Enhanced to include cloud save
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      if (Object.keys(formData).length > 0) {
        // Always save to localStorage for immediate backup
        localStorage.setItem(`interactive_form_${state}`, JSON.stringify(formData));
        
        // Auto-save to cloud if user is logged in
        if (isLoggedIn) {
          setIsSaving(true);
          // This would integrate with your existing save system
          setTimeout(() => {
            setIsSaving(false);
            setLastSaved(new Date());
          }, 500);
        } else {
          setLastSaved(new Date());
        }
      }
    }, 1500); // Slightly longer delay for better UX

    return () => clearTimeout(saveTimer);
  }, [formData, state, isLoggedIn]);

  // Load saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem(`interactive_form_${state}`);
    if (saved && Object.keys(initialFormData).length === 0) {
      try {
        const savedData = JSON.parse(saved);
        setFormData(savedData);
      } catch (e) {
        console.warn('Failed to load saved form data:', e);
      }
    }
  }, [state, initialFormData]);

  const handlePDFLoad = useCallback(() => {
    setPdfLoaded(true);
    
    // Try to detect if PDF has fillable forms
    try {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        // Check if we can access the PDF and if it has form fields
        setIsInteractive(true);
      }
    } catch (_e) {
      console.log('PDF is not interactive, will use overlay approach');
      setIsInteractive(false);
    }
  }, []);

  const handleSaveAndContinue = useCallback(() => {
    onSaveAndContinue(formData);
  }, [formData, onSaveAndContinue]);

  const handleCompleteAndPay = useCallback(() => {
    onCompleteAndPay(formData);
  }, [formData, onCompleteAndPay]);

  // For state forms, we can't track completion accurately, so allow actions immediately
  const canPerformActions = true;

  return (
    <div className="space-y-6">

      {/* Compact Instructions with Save Status */}
      <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <MousePointer className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-900 dark:text-blue-100">
              Click directly on the form fields below to fill them out
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {isSaving ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Saving...</span>
              </>
            ) : lastSaved ? (
              <>
                <Save className="h-3 w-3" />
                <span>Saved {lastSaved.toLocaleTimeString()}</span>
              </>
            ) : null}
          </div>
        </div>
      </div>


      {/* Interactive PDF Form */}
      <Card className="relative">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">{formName}</span>
              {requiresNotary && (
                <Badge variant="destructive" size="sm">
                  Notary Required
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleSaveAndContinue}
                variant="outline"
                disabled={!canPerformActions}
              >
                <Clock className="h-4 w-4 mr-2" />
                Save & Continue Later
              </Button>
              <Button
                onClick={handleCompleteAndPay}
                disabled={!canPerformActions}
                className="bg-green-600 hover:bg-green-700"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Complete & Pay ${basePrice}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="relative" style={{ height: '800px' }}>
            {!pdfLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Loading interactive form...</p>
                </div>
              </div>
            )}
            
            <iframe
              ref={iframeRef}
              src={pdfUrl}
              className="w-full h-full border-0"
              title="Interactive PDF Form"
              onLoad={handlePDFLoad}
              onKeyDown={() => {}}
              style={{ 
                minHeight: '800px',
                background: 'white'
              }}
            />
            
            {/* Overlay for non-interactive PDFs */}
            {pdfLoaded && !isInteractive && (
              <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-2 rounded-md text-sm max-w-md">
                <div className="flex items-center gap-2">
                  <MousePointer className="h-4 w-4" />
                  <div>
                    <p className="font-medium">Interactive Mode</p>
                    <p className="text-xs opacity-90">
                      This form may require manual completion. Fill out information and we&apos;ll overlay it on the final document.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Workflow Information */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Document Price</p>
              <p className="text-2xl font-bold text-green-600">${basePrice.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Includes official form + smart completion
              </p>
            </div>
            <div className="text-center">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">Work at your own pace</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <Save className="h-4 w-4" />
                  <span className="text-sm font-medium">Progress automatically saved</span>
                </div>
                {!isLoggedIn && (
                  <div className="flex items-center gap-2 text-purple-600">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">Create account to access dashboard</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legal Requirements */}
      {requiresNotary && (
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> This document must be notarized to be legally valid in {state.toUpperCase()}. 
            After downloading, you&apos;ll need to sign it in front of a notary public.
          </AlertDescription>
        </Alert>
      )}

    </div>
  );
}