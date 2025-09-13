// src/components/forms/WizardForm/index.tsx
'use client';

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { useFormContext } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { TooltipProvider } from '@/components/ui/tooltip';
import { saveFormProgress } from '@/lib/firestore/saveFormProgress';
import type { LegalDocument } from '@/types/documents';
import type { Question } from '@/types/documents';
import { WizardSkeleton } from '@/components/ui/SkeletonVariants';

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
  onFieldFocus?: (fieldId: string | undefined) => void;
  questions?: Question[] | null;      // still optional legacy prop
  overrideQuestions?: Question[];     // <-- NEW: the one we pass from StartWizardPageClient
}

export interface WizardFormRef {
  navigateToField: (fieldId: string) => void;
}

const WizardForm = forwardRef<WizardFormRef, WizardFormProps>(
  function WizardForm({ locale, doc, onComplete, onFieldFocus, questions, overrideQuestions }, ref) {
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

    // Get steps and progress (overrideQuestions > questions > doc.questions)
    const preferredQuestions = overrideQuestions ?? questions ?? doc.questions ?? [];
    const { steps, totalSteps } = useWizardSteps(doc, preferredQuestions);
    const progress = calculateProgress(
      currentStepIndex,
      totalSteps,
      isReviewing,
    );
    const currentField = steps[currentStepIndex];

    // Effects
    useEffect(() => {
      setIsHydrated(true);
    }, []);

    // Track current field focus for preview highlighting
    useEffect(() => {
      if (currentField && onFieldFocus && !isReviewing) {
        onFieldFocus(currentField.id);
      } else if (isReviewing && onFieldFocus) {
        onFieldFocus(undefined);
      }
    }, [currentField, onFieldFocus, isReviewing]);

    // Navigation to specific field
    const navigateToField = useCallback(
      (fieldId: string) => {
        const fieldIndex = steps.findIndex((step) => step.id === fieldId);
        if (fieldIndex !== -1) {
          setCurrentStepIndex(fieldIndex);
          setIsReviewing(false);
          if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      },
      [steps],
    );

    useImperativeHandle(
      ref,
      () => ({
        navigateToField,
      }),
      [navigateToField],
    );

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

        if (currentStepIndex < totalSteps - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          const allFieldsValid = await trigger();
          if (allFieldsValid) {
            setIsReviewing(true);
          } else {
            toast({
              title: t('Validation Failed'),
              description: t('Please correct all errors before reviewing your answers.'),
              variant: 'destructive',
            });
            return;
          }
        }

        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }

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
        if (!user?.uid) {
          console.error('User not logged in, cannot save progress');
          return;
        }
        await saveFormProgress({
          userId: user.uid,
          docType: doc.id,
          formData,
          state: locale,
        });

        toast({
          title: t('wizard.draftSaved', { defaultValue: 'Draft Saved' }),
          description: t('wizard.draftSavedDescription', {
            defaultValue:
              'Your progress has been saved. You can continue later from your dashboard.',
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
    }, [getValues, doc.id, locale, router, toast, t, isLoggedIn, user?.uid]);

    const handleAuthSuccess = useCallback(() => {
      setShowAuthModal(false);
      if (pendingSaveDraft) {
        handleSaveAndFinishLater();
      }
    }, [pendingSaveDraft, handleSaveAndFinishLater]);

    const handlePaymentSuccess = useCallback(() => {
      localStorage.removeItem(`draft-${doc.id}-${locale}`);
      setShowPaymentModal(false);
      setPaymentClientSecret(null);
      onComplete(`/${locale}/dashboard?paymentSuccess=true&docId=${doc.id}`);
    }, [doc.id, locale, onComplete]);

    if (!isHydrated || authIsLoading) {
      return (
        <TooltipProvider>
          <div className="bg-card rounded-xl shadow-2xl p-6 md:p-8 border border-border/50 backdrop-blur-sm">
            <WizardSkeleton />
          </div>
        </TooltipProvider>
      );
    }

    return (
      <>
        <TooltipProvider>
          <div className="bg-card rounded-xl shadow-2xl p-6 md:p-8 border border-border/50 backdrop-blur-sm transition-all duration-300 hover:shadow-3xl">
            <WizardProgress progress={progress} totalSteps={totalSteps} />

            <div className="min-h-[400px] flex flex-col justify-center">
              <WizardFormContent
                doc={doc}
                locale={locale}
                currentStepIndex={currentStepIndex}
                isReviewing={isReviewing}
                steps={steps}
                isHydrated={isHydrated}
                onFieldFocus={onFieldFocus}
              />
            </div>

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
  },
);

export default WizardForm;
