
// src/components/DocumentFlow.tsx
"use client";

import React, { useState } from 'react';
import { ProgressBar } from '@/components/ProgressBar';
import { StepOneInput } from '@/components/StepOneInput';
import SlideFade from '@/components/motion/SlideFade';
import { StepTwoInput } from '@/components/StepTwoInput';
import { StepThreeInput } from '@/components/StepThreeInput';
import { useRouter } from 'next/navigation'; // For navigation
import { useTranslation } from 'react-i18next'; // For localization

interface DocumentFlowProps {
  initialDocId?: string;
  initialLocale?: 'en' | 'es';
}

export default function DocumentFlow({
  initialDocId,
  initialLocale = 'en',
}: DocumentFlowProps = {}) { // Provide default empty object for props
  const router = useRouter();
  const { t } = useTranslation();

  // Initialize step and templateId based on initialDocId
  const [templateId, setTemplateId] = useState<string>(initialDocId ?? '');
  const [step, setStep] = useState(initialDocId ? 2 : 1); // Start at step 2 if doc is pre-selected

  // Other states remain the same
  const [category, setCategory] = useState<string>(''); // Category might be derived if initialDocId is present
  const [stateCode, setStateCode] = useState<string>('');
  

  // If initialDocId is provided, we might want to find its category to pre-fill
  // This logic can be added if needed, for now, category selection will be manual if step 1 is shown.

  const advanceTo = (next: number) => {
    setStep(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWizardComplete = (values: Record<string, any>) => {
    // This function is called when the DynamicFormRenderer's onSubmit is triggered (final step)
    // Now we redirect to a checkout page or success page.
    // The actual API call for submission will be in WizardForm component,
    // and onComplete from WizardLayout will handle the redirect after Stripe interaction.
    console.log("DocumentFlow: Wizard complete with values:", values);
    // Example redirect (this should be handled by WizardLayout's onComplete prop)
    // router.push(`/${initialLocale}/docs/${templateId}/checkout`); 
    // For DocumentFlow itself, we might not navigate directly but signal completion.
    // Or, if this component is embedded, its parent handles navigation.
    // For the StartWizardPage, the WizardLayout's onComplete handles it.
  };


  return (
    <div className="overflow-x-hidden">
      <ProgressBar currentStep={step} totalSteps={3} />

      <SlideFade key={step}>
        {step === 1 && !initialDocId && ( // Only show step 1 if no initialDocId
          <StepOneInput
            onSelectCategory={(cat) => {
              setCategory(cat);
              advanceTo(2);
            }}
          />
        )}

        {step === 2 && (
          <StepTwoInput
            // If initialDocId was provided, category might need to be found from documentLibrary
            // For simplicity, if skipping step 1, category might not be explicitly set here
            // unless derived from initialDocId.
            category={category || documentLibrary.find(d => d.id === initialDocId)?.category || ''}
            onStateChange={(st) => setStateCode(st)}
            onSelectTemplate={(id) => {
              setTemplateId(id);
              advanceTo(3);
            }}
            // onBack is not implemented in this structure, back navigation is handled by WizardForm
          />
        )}

        {step === 3 && (
          <StepThreeInput
            templateId={templateId}
            stateCode={stateCode}
            // onBack is not implemented here, handled by WizardForm
          />
        )}
      </SlideFade>
    </div>
  );
}
