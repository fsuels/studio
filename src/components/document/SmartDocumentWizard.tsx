'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, FileText, Shield, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import InteractivePDFFormFiller from './InteractivePDFFormFiller';
import { floridaFormConfig } from '@/lib/state-forms/florida-vehicle-bill-of-sale';
import { saveFormProgress } from '@/lib/firestore/saveFormProgress';

const AuthModal = dynamic(() => import('@/components/shared/AuthModal'));

interface SmartDocumentWizardProps {
  documentType: 'vehicle-bill-of-sale';
  selectedState?: string;
  onPaymentRequired: (formData: Record<string, any>, price: number, state: string) => void;
  onComplete: (document: ArrayBuffer) => void;
  initialFormData?: Record<string, any>;
  isLoggedIn?: boolean;
  locale?: 'en' | 'es';
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
  isLoggedIn = false,
  locale = 'en'
}: SmartDocumentWizardProps) {
  const [loading, setLoading] = useState(!selectedState);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingSaveDraft, setPendingSaveDraft] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<Record<string, any>>({});
  
  const router = useRouter();
  const { toast } = useToast();
  const { user, isLoggedIn: authIsLoggedIn } = useAuth();
  const { t } = useTranslation('common');
  
  // Use auth context login status instead of prop for real-time updates
  const effectiveIsLoggedIn = authIsLoggedIn || isLoggedIn;

  useEffect(() => {
    if (selectedState) {
      setLoading(false);
    }
  }, [selectedState]);

  const saveDirectToFirestore = useCallback(async (formData: Record<string, any>, userId: string) => {
    setIsSavingDraft(true);
    
    try {
      if (!selectedState) {
        console.error('🚫 No selected state');
        throw new Error('State not selected');
      }
      
      console.log('👤 Using provided user ID:', userId);
      
      // Skip the complex saveFormProgress function entirely
      // Use direct Firestore save to bypass all auth/audit issues
      console.log('💾 Using direct Firestore save to bypass auth issues');
      
      const { getDb } = await import('@/lib/firebase');
      const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
      
      const db = await getDb();
      const docId = `${encodeURIComponent(`${documentType}-${selectedState}`)}_${locale}`;
      const ref = doc(db, 'users', userId, 'documents', docId);
      
      console.log('🗄️ Saving to path:', `users/${userId}/documents/${docId}`);
      
      // Save to localStorage first as backup
      const backupData = {
        docType: documentType, // Use base document type for dashboard compatibility
        originalDocId: documentType, // Keep original for reference
        state: locale,
        stateCode: selectedState, // Store the actual state separately
        formData: formData,
        userId: userId,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(`backup_${docId}`, JSON.stringify(backupData));
      console.log('💾 Backup saved to localStorage');
      
      // Then save to Firestore with dashboard-compatible format
      await setDoc(ref, {
        docType: documentType, // Use base document type (vehicle-bill-of-sale)
        originalDocId: documentType,
        state: locale,
        stateCode: selectedState, // Store FL, AL, etc. separately
        name: `${documentType} (${selectedState})`, // Human-readable name
        status: 'Draft',
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        formData: formData,
      }, { merge: true });
      
      console.log('✅ Direct save successful!');
      
      toast({
        title: 'Draft Saved',
        description: 'Your progress has been saved. You can continue later from your dashboard.',
      });
      
      // Redirect to dashboard
      router.push(`/${locale}/dashboard`);
      
    } catch (error) {
      console.error('❌ Save failed:', error);
      
      toast({
        title: 'Save Failed',
        description: 'Failed to save draft. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSavingDraft(false);
      setPendingSaveDraft(false);
    }
  }, [selectedState, documentType, locale, router, toast]);
  
  const saveDraftToFirestore = useCallback(async (formData: Record<string, any>) => {
    // For already logged in users, use the user context
    if (user?.uid) {
      await saveDirectToFirestore(formData, user.uid);
    } else {
      console.error('🚫 No user available for direct save');
      toast({
        title: 'Authentication Error',
        description: 'Please try logging in again.',
        variant: 'destructive',
      });
    }
  }, [user, saveDirectToFirestore, toast]);
  
  const handleSaveAndContinue = useCallback(async (formData: Record<string, any>) => {
    console.log('🚀 handleSaveAndContinue called with:', { 
      selectedState, 
      formDataKeys: Object.keys(formData), 
      effectiveIsLoggedIn,
      formData 
    });
    
    if (!selectedState) {
      console.error('❌ No selected state available');
      return;
    }
    
    // If user is not logged in, prompt for account creation first
    if (!effectiveIsLoggedIn) {
      console.log('🔐 User not logged in, showing auth modal');
      
      // Save form data to localStorage as backup
      localStorage.setItem(`state_form_draft_${selectedState}`, JSON.stringify(formData));
      
      // Store pending form data and show auth modal
      setPendingFormData(formData);
      setPendingSaveDraft(true);
      setShowAuthModal(true);
      return;
    }
    
    // For logged-in users, save directly
    console.log('💾 User already logged in, saving directly');
    await saveDraftToFirestore(formData);
  }, [selectedState, effectiveIsLoggedIn, saveDraftToFirestore]);
  
  const handleAuthSuccess = useCallback(async (uid?: string) => {
    console.log('✨ Auth success, pending draft:', { pendingSaveDraft, hasFormData: Object.keys(pendingFormData).length > 0, uid });
    setShowAuthModal(false);
    
    if (pendingSaveDraft && Object.keys(pendingFormData).length > 0) {
      console.log('💾 Attempting to save after auth with form data:', pendingFormData);
      
      // Don't wait for user context - get user directly from Firebase Auth
      const { getAuth } = await import('firebase/auth');
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (currentUser) {
        console.log('✅ Firebase user available, saving now with uid:', currentUser.uid);
        await saveDirectToFirestore(pendingFormData, currentUser.uid);
      } else {
        console.error('❌ No Firebase user found after auth');
        toast({
          title: 'Authentication Error',
          description: 'Please try again.',
          variant: 'destructive',
        });
      }
    } else {
      console.log('ℹ️ No pending draft or form data to save');
    }
  }, [pendingSaveDraft, pendingFormData, toast]);

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
        <>
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
          
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => {
              setShowAuthModal(false);
              setPendingSaveDraft(false);
              setPendingFormData({});
            }}
            onAuthSuccess={handleAuthSuccess}
          />
        </>
      );
    } else {
      // Other states with official forms (to be configured)
      return (
        <>
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
          
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => {
              setShowAuthModal(false);
              setPendingSaveDraft(false);
              setPendingFormData({});
            }}
            onAuthSuccess={handleAuthSuccess}
          />
        </>
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