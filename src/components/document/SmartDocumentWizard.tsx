'use client';

import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, FileText, Shield, Clock } from 'lucide-react';
import InteractivePDFFormFiller from './InteractivePDFFormFiller';
import { floridaFormConfig } from '@/lib/state-forms/florida-vehicle-bill-of-sale';

interface SmartDocumentWizardProps {
  documentType: 'vehicle-bill-of-sale';
  selectedState?: string;
  onPaymentRequired: (formData: Record<string, any>, price: number, state: string) => void;
  onComplete: (document: ArrayBuffer) => void;
  initialFormData?: Record<string, any>;
  isLoggedIn?: boolean;
}

// States that have mandatory official forms
const STATES_WITH_OFFICIAL_FORMS = {
  'AL': { formName: 'MVT-32-13B', price: 19.95 },
  'CO': { formName: 'DR-2116', price: 19.95 },
  'FL': { formName: 'HSMV-82050', price: 19.95 },
  'GA': { formName: 'T-7', price: 19.95 },
  'ID': { formName: 'ITD-3738', price: 19.95 },
  'KS': { formName: 'TR-312', price: 19.95 },
  'MD': { formName: 'VR-181', price: 19.95 },
  'MT': { formName: 'MV-24', price: 19.95 },
  'ND': { formName: 'SFN-2888', price: 19.95 },
  'WV': { formName: 'DMV-7-TR', price: 19.95 }
};

export default function SmartDocumentWizard({
  documentType,
  selectedState,
  onPaymentRequired,
  onComplete,
  initialFormData = {},
  isLoggedIn = false
}: SmartDocumentWizardProps) {
  const [loading, setLoading] = useState(!selectedState);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedState) {
      setLoading(false);
    }
  }, [selectedState]);

  const handleSaveAndContinue = (formData: Record<string, any>) => {
    if (!selectedState) return;
    
    // If user is not logged in, prompt for account creation first
    if (!isLoggedIn) {
      // Save form data to localStorage as backup
      localStorage.setItem(`state_form_draft_${selectedState}`, JSON.stringify(formData));
      
      // Redirect to registration/login with return path
      const returnPath = window.location.pathname;
      window.location.href = `/register?return=${encodeURIComponent(returnPath)}&save_draft=true`;
      return;
    }
    
    // For logged-in users, save to dashboard and show success message
    // This would integrate with your existing dashboard save system
    alert('Progress saved! You can continue later from your dashboard.');
  };

  const handleCompleteAndPay = (formData: Record<string, any>) => {
    if (!selectedState) return;
    
    const stateInfo = STATES_WITH_OFFICIAL_FORMS[selectedState as keyof typeof STATES_WITH_OFFICIAL_FORMS];
    const price = stateInfo?.price || 14.95;
    
    onPaymentRequired(formData, price, selectedState);
  };

  const handleComplete = (formData: Record<string, any>) => {
    // This would generate the actual PDF with the form data
    // For now, we'll create a placeholder ArrayBuffer
    const placeholder = new ArrayBuffer(0);
    onComplete(placeholder);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading document wizard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // No state selected
  if (!selectedState) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Select Your State</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please select your state first to determine which form and process to use.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Check if state has official form
  const hasOfficialForm = selectedState in STATES_WITH_OFFICIAL_FORMS;
  const stateInfo = STATES_WITH_OFFICIAL_FORMS[selectedState as keyof typeof STATES_WITH_OFFICIAL_FORMS];

  if (hasOfficialForm) {
    // Use Direct Form Filling Interface for states with official forms
    
    if (selectedState === 'FL') {
      // Florida - fully configured
      return (
        <InteractivePDFFormFiller
          state={floridaFormConfig.state}
          formName={floridaFormConfig.formName}
          pdfUrl={floridaFormConfig.pdfUrl}
          requiresNotary={floridaFormConfig.requiresNotary}
          basePrice={floridaFormConfig.basePrice}
          onSaveAndContinue={handleSaveAndContinue}
          onCompleteAndPay={handleCompleteAndPay}
          initialFormData={initialFormData}
          isLoggedIn={isLoggedIn}
        />
      );
    } else {
      // Other states with official forms (to be configured)
      return (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {selectedState} Official Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p>
                    <strong>{selectedState} requires an official form ({stateInfo?.formName}).</strong>
                  </p>
                  <p>
                    We're currently configuring the direct form filling interface for {selectedState}. 
                    This will allow you to fill out the official state form directly with the same 
                    intuitive experience as Florida.
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-muted-foreground">
                      Form: {stateInfo?.formName} • Price: ${stateInfo?.price}
                    </span>
                    <Badge variant="outline">Coming Soon</Badge>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      );
    }
  } else {
    // Use Question Wizard for states without official forms (your existing system)
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {selectedState} Vehicle Bill of Sale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>
                  <strong>{selectedState} uses a custom template approach.</strong>
                </p>
                <p>
                  You'll go through our guided question wizard to create a legally compliant 
                  vehicle bill of sale document tailored for {selectedState} requirements.
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-muted-foreground">
                    Custom Template • Price: $14.95
                  </span>
                  <Badge variant="secondary">Question Wizard</Badge>
                </div>
              </div>
            </AlertDescription>
          </Alert>
          
          {/* Here you would integrate your existing question wizard component */}
          <div className="mt-4 p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
            <p className="text-muted-foreground">
              [Your existing question wizard component would go here]
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
}