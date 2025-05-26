
// src/components/DocumentFlow.tsx
"use client";

import React, { useState, useEffect } from 'react'; // Added useEffect
import { ProgressBar } from '@/components/ProgressBar'; // This might be replaced by ProgressSteps
import { StepOneInput } from '@/components/StepOneInput'; // This might be replaced or refactored
import SlideFade from '@/components/motion/SlideFade';
import { StepTwoInput } from '@/components/StepTwoInput'; // This might be replaced or refactored
import { StepThreeInput } from '@/components/StepThreeInput'; // This might be replaced or refactored
import { useRouter } from 'next/navigation'; 
import { useTranslation } from 'react-i18next'; 
import { documentLibrary } from '@/lib/document-library'; // Import documentLibrary

interface DocumentFlowProps {
  initialDocId?: string;
  initialLocale?: 'en' | 'es';
}

export default function DocumentFlow({
  initialDocId,
  initialLocale = 'en',
}: DocumentFlowProps = {}) { 
  const router = useRouter();
  useTranslation("common");

  const [templateId, setTemplateId] = useState<string>(initialDocId ?? '');
  const [step, setStep] = useState(initialDocId ? 2 : 1); 

  const [category, setCategory] = useState<string>(''); 
  const [stateCode, setStateCode] = useState<string>('');
  
  // Effect to set initial category if docId is provided
  useEffect(() => {
    if (initialDocId) {
      const doc = documentLibrary.find(d => d.id === initialDocId);
      if (doc) {
        setCategory(doc.category);
        // No need to set step here as it's already initialized based on initialDocId
      }
    }
  }, [initialDocId]);


  const advanceTo = (next: number) => {
    setStep(next);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };



  return (
    <div className="overflow-x-hidden">
      <ProgressBar currentStep={step} totalSteps={3} />

      <SlideFade key={step}>
        {step === 1 && !initialDocId && ( 
          <StepOneInput
            onSelectCategory={(cat) => {
              setCategory(cat);
              advanceTo(2);
            }}
          />
        )}

        {step === 2 && (
          <StepTwoInput
            category={category || documentLibrary.find(d => d.id === initialDocId)?.category || ''}
            onStateChange={(st) => setStateCode(st)}
            onSelectTemplate={(id) => {
              setTemplateId(id);
              advanceTo(3);
            }}
          />
        )}

        {step === 3 && (
          <StepThreeInput
            templateId={templateId}
            stateCode={stateCode}
            // The StepThreeInput or its child (like DynamicFormRenderer) would call handleWizardComplete
            // This needs to be wired up. Assuming StepThreeInput has an onSubmit prop.
            // For now, this is a conceptual link.
            // onSubmitForm={handleWizardComplete} // Example prop
          />
        )}
      </SlideFade>
    </div>
  );
}
