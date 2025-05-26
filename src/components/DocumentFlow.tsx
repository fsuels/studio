// src/components/DocumentFlow.tsx
'use client';

import React, { useState, useEffect } from 'react'; // Added useEffect
import { StepOneInput } from '@/components/StepOneInput'; // This might be replaced or refactored
import SlideFade from '@/components/motion/SlideFade';
import { StepTwoInput } from '@/components/StepTwoInput'; // This might be replaced or refactored
import dynamic from 'next/dynamic';
const StepThreeInput = dynamic(
  () => import('@/components/StepThreeInput').then((mod) => mod.StepThreeInput),
  { ssr: false },
); // This might be replaced or refactored
import { useTranslation } from 'react-i18next';
import { documentLibrary } from '@/lib/document-library'; // Import documentLibrary

interface DocumentFlowProps {
  initialDocId?: string;
}

export default function DocumentFlow({ initialDocId }: DocumentFlowProps = {}) {
  useTranslation('common');

  const [templateId, setTemplateId] = useState<string>(initialDocId ?? '');
  const [step, setStep] = useState(initialDocId ? 2 : 1);

  const [category, setCategory] = useState<string>('');

  // Effect to set initial category if docId is provided
  useEffect(() => {
    if (initialDocId) {
      const doc = documentLibrary.find((d) => d.id === initialDocId);
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
      <progress
        value={step}
        max={3}
        className="fixed top-0 left-0 h-1 w-full bg-teal-200 z-30"
      />

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
            category={
              category ||
              documentLibrary.find((d) => d.id === initialDocId)?.category ||
              ''
            }
            onStateChange={() => {}}
            onSelectTemplate={(id) => {
              setTemplateId(id);
              advanceTo(3);
            }}
          />
        )}

        {step === 3 && (
          <StepThreeInput
            templateId={templateId}
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
