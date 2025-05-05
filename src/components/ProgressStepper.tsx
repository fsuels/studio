// src/components/ProgressStepper.tsx
"use client";

import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react'; // Import Check icon

interface ProgressStepperProps {
  currentStep: number; // 1, 2, or 3
}

// Define steps with translation keys
const STEPS = [
  { id: 1, labelKey: 'progressStepper.step1' },
  { id: 2, labelKey: 'progressStepper.step2' },
  { id: 3, labelKey: 'progressStepper.step3' },
];

const ProgressStepper: React.FC<ProgressStepperProps> = ({ currentStep }) => {
  const { t } = useTranslation();

  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center justify-between space-x-2 md:space-x-4">
        {STEPS.map((step, index) => (
          <li key={step.id} className={cn("relative flex-1", index < STEPS.length - 1 ? "pr-8 sm:pr-12" : "")}>
            {/* Step Circle/Number */}
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full",
                step.id < currentStep ? 'bg-primary' : '',
                step.id === currentStep ? 'border-2 border-primary bg-primary/10' : '',
                step.id > currentStep ? 'border-2 border-border bg-muted' : ''
              )}
              aria-current={step.id === currentStep ? 'step' : undefined}
            >
              {step.id < currentStep ? (
                <Check className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
              ) : (
                <span
                  className={cn(
                    "text-sm font-medium",
                    step.id === currentStep ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {step.id}
                </span>
              )}
            </div>

             {/* Label */}
             <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-center text-xs font-medium md:bottom-auto md:top-11">
               <span className={cn(
                 step.id <= currentStep ? "text-foreground" : "text-muted-foreground"
               )}>
                 {t(step.labelKey, `Step ${step.id}`)}
               </span>
             </div>


            {/* Connecting Line (except for last step) */}
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "absolute right-0 top-1/2 h-0.5 w-full -translate-y-1/2",
                   // Adjust line positioning based on index if needed
                  step.id < currentStep ? 'bg-primary' : 'bg-border'
                )}
                aria-hidden="true"
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default ProgressStepper;
