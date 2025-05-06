"use client";

import React, { useState } from 'react';
import { ProgressBar } from '@/components/ProgressBar';
import { StepOneInput } from '@/components/StepOneInput';
import { StepTwoInput } from '@/components/StepTwoInput';
import { StepThreeInput } from '@/components/StepThreeInput';

export function DocumentFlowComponent() {
  const [step, setStep] = useState(1);
    const [category, setCategory] = useState<string>('');
    const [stateCode, setStateCode] = useState<string>('');
    const [templateId, setTemplateId] = useState<string>('');

    const advanceTo = (next: number) => {
        setStep(next);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="overflow-x-hidden">
            <ProgressBar currentStep={step} totalSteps={3} />

            {step === 1 && (
                <StepOneInput
                    onSelectCategory={(cat) => {
                        setCategory(cat);
                        advanceTo(2);
                    }}
                />
            )}

            {step === 2 && (
                <StepTwoInput
                    category={category}
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
                />
            )}
        </div>
    );
}
