'use client';

import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

type Props = {
  documentType: string;
  selectedState?: string;
  onPaymentRequired: (formData: Record<string, any>, price: number, state: string) => void;
  onComplete: (doc: ArrayBuffer) => void;
  initialFormData?: Record<string, any>;
  isLoggedIn?: boolean;
  locale: 'en' | 'es';
  resumeId?: string | null;
};

export default function SmartDocumentWizard(_props: Props) {
  // We intentionally disabled the legacy direct-PDF-filling flow.
  // StartWizardPageClient already forces useDirectFormFilling = false,
  // so this component should never be shown. Keeping a stub avoids build errors.
  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-6">
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Direct PDF filling is disabled. Please use the standard wizard flow.
          </AlertDescription>
        </Alert>
        <div className="text-sm text-muted-foreground">
          This feature has been replaced with the new JSON-first configuration system 
          that provides better state-specific form handling and compliance validation.
        </div>
      </CardContent>
    </Card>
  );
}