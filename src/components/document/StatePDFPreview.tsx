'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Loader2, FileText, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { loadComplianceOnly, loadDocumentConfig, normalizeJurisdiction, type ComplianceConfig, type DocumentConfig } from '@/lib/config-loader';
import { overlayFormData } from '@/lib/pdf/pdf-overlay-service';
// Keep legacy imports as fallback
import { getStateFormPath, getFormDisplayName } from '@/lib/pdf/state-form-manager';
import { getVehicleBillOfSaleCompliance } from '@/lib/compliance-helper';
import SimplePDFViewer from './SimplePDFViewer';

interface StatePDFPreviewProps {
  state: string;
  formData: any;
  documentType: 'vehicle-bill-of-sale' | string; // Made more flexible for future document types
}

export default function StatePDFPreview({ 
  state, 
  formData,
  documentType 
}: StatePDFPreviewProps) {
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [compliance, setCompliance] = useState<ComplianceConfig | null>(null);
  const [documentConfig, setDocumentConfig] = useState<DocumentConfig | null>(null);

  useEffect(() => {
    if (!state || state.length !== 2) {
      setLoading(false);
      return;
    }

    const loadStatePDF = async () => {
      try {
        setLoading(true);
        setError(null);
        setCompliance(null);
        console.log('StatePDFPreview: Loading configuration for state:', state, 'docType:', documentType);

        // Normalize jurisdiction (FL -> us/florida)
        const jurisdiction = normalizeJurisdiction(state);
        console.log('StatePDFPreview: Normalized jurisdiction:', jurisdiction);

        // Try to load full document configuration first (includes overlay config)
        let complianceConfig: ComplianceConfig;
        let fullDocConfig: DocumentConfig | null = null;
        
        try {
          fullDocConfig = await loadDocumentConfig(documentType, jurisdiction);
          complianceConfig = fullDocConfig.compliance;
          setDocumentConfig(fullDocConfig);
          console.log('✅ StatePDFPreview: Loaded full document config via unified loader');
        } catch (loaderError) {
          console.warn('⚠️ StatePDFPreview: Full document config failed, trying compliance only');
          
          try {
            complianceConfig = await loadComplianceOnly(documentType, jurisdiction);
            console.log('✅ StatePDFPreview: Loaded compliance via unified loader');
          } catch (complianceError) {
            console.warn('⚠️ StatePDFPreview: Unified loader failed, falling back to legacy');
            // Fallback to legacy method for Vehicle Bill of Sale
            if (documentType === 'vehicle-bill-of-sale') {
              const legacyCompliance = getVehicleBillOfSaleCompliance(state);
              if (!legacyCompliance) {
                throw new Error(`No compliance configuration found for state: ${state}`);
              }
              complianceConfig = {
                requiresNotary: legacyCompliance.requiresNotary,
                officialForm: legacyCompliance.officialForm,
                billOfSaleMandatory: legacyCompliance.billOfSaleMandatory,
                odometerIntegrated: legacyCompliance.odometerIntegrated,
                specialNotes: legacyCompliance.specialNotes,
                localFormPath: legacyCompliance.localFormPath
              };
            } else {
              throw complianceError;
            }
          }
        }

        setCompliance(complianceConfig);

        // Check if there's an official form available
        const formPath = complianceConfig.localFormPath || getStateFormPath(state);
        console.log('StatePDFPreview: Form path:', formPath);
        
        if (!formPath) {
          console.log('StatePDFPreview: No form path found for state:', state);
          setError('No official form available for this state');
          setLoading(false);
          return;
        }

        console.log('StatePDFPreview: Setting PDF URL:', formPath);
        setPdfUrl(formPath);
        
      } catch (err) {
        setError('Failed to load state form configuration');
        console.error('Error loading state PDF:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStatePDF();
  }, [state, documentType]);

  // Get form display name from compliance or fallback to legacy
  const formName = compliance?.officialForm || getFormDisplayName(state);

  const handleOverlay = useCallback(async (pdfBytes: ArrayBuffer) => {
    console.log('StatePDFPreview: Applying overlay with form data:', formData);
    console.log('StatePDFPreview: Using overlay config:', documentConfig?.overlayConfig ? 'JSON' : 'TypeScript fallback');
    return await overlayFormData(pdfBytes, formData, state, documentConfig?.overlayConfig);
  }, [formData, state, documentConfig]);

  const shouldUseOverlay = true;

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
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {state.toUpperCase()} Official Form
            </Badge>
            {formName && (
              <Badge variant="secondary">
                {formName}
              </Badge>
            )}
          </div>
          {compliance?.requiresNotary && (
            <Badge variant="destructive">
              Notary Required
            </Badge>
          )}
        </div>

        <SimplePDFViewer
          pdfUrl={pdfUrl}
          formData={shouldUseOverlay ? formData : undefined}
          onOverlay={shouldUseOverlay ? handleOverlay : undefined}
          className="h-[800px]"
        />
      </CardContent>
    </Card>
  );
}