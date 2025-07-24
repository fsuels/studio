// src/components/document/StatePDFPreview.tsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Loader2, FileText, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  loadComplianceOnly,
  loadDocumentConfig,
  normalizeJurisdiction,
  type ComplianceConfig,
  type DocumentConfig,
} from '@/lib/config-loader';
import { overlayFormData } from '@/lib/pdf/pdf-overlay-service';
import { getStateFormPath, getFormDisplayName } from '@/lib/pdf/state-form-manager';
import { getVehicleBillOfSaleCompliance } from '@/lib/compliance-helper';
import SimplePDFViewer from './SimplePDFViewer';

interface StatePDFPreviewProps {
  state: string;
  formData: Record<string, any>;
  documentType: 'vehicle-bill-of-sale' | string;
}

export default function StatePDFPreview({
  state,
  formData,
  documentType,
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

        const jurisdiction = normalizeJurisdiction(state);

        let complianceConfig: ComplianceConfig;
        let fullDocConfig: DocumentConfig | null = null;

        try {
          fullDocConfig = await loadDocumentConfig(documentType, jurisdiction);
          complianceConfig = fullDocConfig.compliance;
          setDocumentConfig(fullDocConfig);

          console.groupCollapsed(
            '%c🚑 StatePDFPreview runtime audit',
            'background:#333;color:#0f0;padding:2px'
          );
          console.log('questions', fullDocConfig?.questions?.map((q) => q.id));
          console.log(
            'overlay.fieldMapping',
            Object.keys(fullDocConfig?.overlayConfig?.fieldMapping ?? {})
          );
          console.log(
            'overlay.coordinates',
            Object.keys(fullDocConfig?.overlayConfig?.coordinates ?? {})
          );
          console.log('formData', formData);
          console.groupEnd();
        } catch {
          // Fallback path
          try {
            complianceConfig = await loadComplianceOnly(documentType, jurisdiction);
          } catch {
            if (documentType === 'vehicle-bill-of-sale') {
              const legacy = getVehicleBillOfSaleCompliance(state);
              if (!legacy) {
                throw new Error(`No compliance configuration for ${state}`);
              }
              complianceConfig = {
                requiresNotary: legacy.requiresNotary,
                officialForm: legacy.officialForm,
                billOfSaleMandatory: legacy.billOfSaleMandatory,
                odometerIntegrated: legacy.odometerIntegrated,
                specialNotes: legacy.specialNotes,
                localFormPath: legacy.localFormPath,
              };
            } else {
              throw new Error('Could not load compliance for this document');
            }
          }
        }

        setCompliance(complianceConfig);

        const formPath = complianceConfig.localFormPath || getStateFormPath(state);
        if (!formPath) {
          setError('No official form available for this state');
          setLoading(false);
          return;
        }
        setPdfUrl(formPath);
      } catch (err) {
        console.error(err);
        setError('Failed to load state form configuration');
      } finally {
        setLoading(false);
      }
    };

    void loadStatePDF();
  }, [state, documentType, formData]);

  const formName = compliance?.officialForm || getFormDisplayName(state);

  const handleOverlay = useCallback(
    async (pdfBytes: ArrayBuffer) => {
      return await overlayFormData(pdfBytes, formData, state, documentConfig?.overlayConfig);
    },
    [formData, state, documentConfig]
  );

  const shouldUseOverlay = true;

  if (!state || state.length !== 2) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Select a state to preview the official form</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading {state.toUpperCase()} official form...</p>
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
            <AlertDescription>{error || 'Unable to load state form'}</AlertDescription>
          </Alert>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Using generic bill of sale template for {state.toUpperCase()}
            </p>
            <div className="border rounded-lg bg-white p-8 min-h-[600px]">
              <h2 className="text-2xl font-bold mb-6">Vehicle Bill of Sale</h2>
              <div className="text-left space-y-4">
                <p>
                  <strong>State:</strong> {state.toUpperCase()}
                </p>
                {formData.seller_name && (
                  <p>
                    <strong>Seller:</strong> {formData.seller_name}
                  </p>
                )}
                {formData.buyer_name && (
                  <p>
                    <strong>Buyer:</strong> {formData.buyer_name}
                  </p>
                )}
                {formData.year && formData.make && formData.model && (
                  <p>
                    <strong>Vehicle:</strong> {formData.year} {formData.make} {formData.model}
                  </p>
                )}
                {formData.vin && (
                  <p>
                    <strong>VIN:</strong> {formData.vin}
                  </p>
                )}
                {formData.price && (
                  <p>
                    <strong>Sale Price:</strong> ${formData.price}
                  </p>
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
            <Badge variant="outline">{state.toUpperCase()} Official Form</Badge>
            {formName && <Badge variant="secondary">{formName}</Badge>}
          </div>
          {compliance?.requiresNotary && <Badge variant="destructive">Notary Required</Badge>}
        </div>

        <SimplePDFViewer
          pdfUrl={pdfUrl}
          formData={shouldUseOverlay ? formData : undefined}
          onOverlay={shouldUseOverlay ? handleOverlay : undefined}
          className="h-[calc(100vh-12rem)] min-h-[900px]"
        />
      </CardContent>
    </Card>
  );
}
