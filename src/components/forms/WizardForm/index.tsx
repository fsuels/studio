// src/components/forms/WizardForm/index.tsx
'use client';

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import { useFormContext } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { TooltipProvider } from '@/components/ui/tooltip';
import { saveFormProgress } from '@/lib/firestore/saveFormProgress';
import type { LegalDocument } from '@/lib/document-library';
import { WizardSkeleton } from '@/components/ui/skeleton-variants';

import { useWizardSteps, calculateProgress } from './WizardStepManager';
import WizardProgress from './WizardProgress';
import WizardFormContent from './WizardFormContent';
import WizardNavigation from './WizardNavigation';
import WizardAuth from './WizardAuth';
import WizardPayment from './WizardPayment';

interface WizardFormProps {
  locale: 'en' | 'es';
  doc: LegalDocument;
  onComplete: (checkoutUrlOrPath: string) => void;
}

export default function WizardForm({
  locale,
  doc,
  onComplete,
}: WizardFormProps) {
  const { t } = useTranslation('common');
  const { toast } = useToast();
  const { isLoggedIn, isLoading: authIsLoading, user } = useAuth();
  const router = useRouter();
  const { getValues, trigger } = useFormContext();

  // Component state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [formIsSubmitting, setFormIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [pendingSaveDraft, setPendingSaveDraft] = useState(false);
  
  // Modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentClientSecret, setPaymentClientSecret] = useState<string | null>(null);

  const liveRef = useRef<HTMLDivElement>(null);

  // Get steps and progress
  const { steps, totalSteps } = useWizardSteps(doc);
  const progress = calculateProgress(currentStepIndex, totalSteps, isReviewing);
  const currentField = steps[currentStepIndex];

  // Effects
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (pendingSaveDraft && !isLoggedIn && !authIsLoading) {
      setShowAuthModal(true);
    }
  }, [pendingSaveDraft, isLoggedIn, authIsLoading]);

  // Navigation handlers
  const handlePreviousStep = useCallback(() => {
    if (isReviewing) {
      setIsReviewing(false);
    } else if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
    
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStepIndex, isReviewing]);

  const handleNextStep = useCallback(async () => {
    setFormIsSubmitting(true);

    try {
      // Validate current step
      if (currentField) {
        const isValid = await trigger(currentField.id);
        if (!isValid) {
          toast({
            title: t('Validation Error'),
            description: t('Please fix the errors before continuing.'),
            variant: 'destructive',
          });
          return;
        }
      }

      // Proceed to next step or review
      if (currentStepIndex < totalSteps - 1) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        // If on the last question, validate all fields before moving to review
        const allFieldsValid = await trigger();
        if (allFieldsValid) {
          setIsReviewing(true);
        } else {
          toast({
            title: t('Validation Failed'),
            description: t(
              'Please correct all errors before reviewing your answers.',
            ),
            variant: 'destructive',
          });
          return;
        }
      }

      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Update screen reader
      if (liveRef.current && currentField) {
        liveRef.current.innerText = `${currentField.label} ${t('updated', { defaultValue: 'updated' })}`;
        setTimeout(() => {
          if (liveRef.current) liveRef.current.innerText = '';
        }, 1000);
      }
    } finally {
      setFormIsSubmitting(false);
    }
  }, [
    currentStepIndex,
    totalSteps,
    isReviewing,
    currentField,
    trigger,
    toast,
    t,
  ]);

  // Draft saving
  const handleSaveAndFinishLater = useCallback(async () => {
    if (!isLoggedIn) {
      setPendingSaveDraft(true);
      return;
    }

    setIsSavingDraft(true);
    try {
      const formData = getValues();
      await saveFormProgress(doc.id, formData, locale);
      
      toast({
        title: t('wizard.draftSaved', { defaultValue: 'Draft Saved' }),
        description: t('wizard.draftSavedDescription', {
          defaultValue: 'Your progress has been saved. You can continue later from your dashboard.',
        }),
      });
      
      router.push(`/${locale}/dashboard`);
    } catch (error) {
      console.error('Failed to save draft:', error);
      toast({
        title: t('Error'),
        description: t('wizard.draftSaveError', {
          defaultValue: 'Failed to save draft. Please try again.',
        }),
        variant: 'destructive',
      });
    } finally {
      setIsSavingDraft(false);
      setPendingSaveDraft(false);
    }
  }, [getValues, doc.id, locale, router, toast, t, isLoggedIn]);

  // Auth success handler
  const handleAuthSuccess = useCallback(() => {
    setShowAuthModal(false);
    if (pendingSaveDraft) {
      handleSaveAndFinishLater();
    }
  }, [pendingSaveDraft, handleSaveAndFinishLater]);

  // Payment success handler
  const handlePaymentSuccess = useCallback(() => {
    localStorage.removeItem(`draft-${doc.id}-${locale}`);
    setShowPaymentModal(false);
    setPaymentClientSecret(null);
    onComplete(`/${locale}/dashboard?paymentSuccess=true&docId=${doc.id}`);
  }, [doc.id, locale, onComplete]);

  // Show skeleton while loading auth or not hydrated
  if (!isHydrated || authIsLoading) {
    return (
      <TooltipProvider>
        <div className="bg-card rounded-lg shadow-xl p-4 md:p-6 border border-border">
          <WizardSkeleton />
        </div>
      </TooltipProvider>
    );
  }

  return (
    <>
      <TooltipProvider>
        <div className="bg-card rounded-lg shadow-xl p-4 md:p-6 border border-border">
          <WizardProgress progress={progress} totalSteps={totalSteps} />
          
          <WizardFormContent
            doc={doc}
            locale={locale}
            currentStepIndex={currentStepIndex}
            isReviewing={isReviewing}
            steps={steps}
            isHydrated={isHydrated}
          />

          <div className="sr-only" aria-live="polite" ref={liveRef}></div>

          <WizardNavigation
            currentStepIndex={currentStepIndex}
            totalSteps={totalSteps}
            isReviewing={isReviewing}
            formIsSubmitting={formIsSubmitting}
            authIsLoading={authIsLoading}
            isSavingDraft={isSavingDraft}
            onPreviousStep={handlePreviousStep}
            onNextStep={handleNextStep}
            onSaveAndFinishLater={handleSaveAndFinishLater}
          />
        </div>
      </TooltipProvider>

      <WizardAuth
        showAuthModal={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setPendingSaveDraft(false);
        }}
        onAuthSuccess={handleAuthSuccess}
      />

      <WizardPayment
        showPaymentModal={showPaymentModal}
        paymentClientSecret={paymentClientSecret}
        doc={doc}
        locale={locale}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
}