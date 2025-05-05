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
  const progressPercent = ((currentStep -1) / (STEPS.length -1 )) * 100; // Calculate progress for mobile bar


  return (
    // Use the 'stepper' class which is now responsive in globals.css
    <nav aria-label="Progress" className="stepper">
      {/* Mobile Progress Bar - Visible only on small screens */}
       <div className="progress-bar block sm:hidden">
            <div style={{ width: `${progressPercent}%` }} />
        </div>

      {/* Desktop/Tablet Step Indicator List - Hidden on small screens */}
       <ol role="list" className="hidden sm:flex items-center justify-between space-x-2 md:space-x-4 w-full">
        {STEPS.map((step, index) => (
          <li key={step.id} className={cn("stepper__item relative flex-1", index < STEPS.length - 1 ? "pr-8 sm:pr-12" : "")}>
            {/* Step Circle/Number */}
            <div
              className={cn(
                "stepper__number flex h-10 w-10 items-center justify-center rounded-full border-2", // Added border-2 here for consistency
                step.id < currentStep ? 'bg-green-600 border-green-600 text-white stepper__item--complete' : '', // Use completion style
                step.id === currentStep ? 'border-primary bg-primary/10 text-primary stepper__item--active' : '',
                step.id > currentStep ? 'border-border bg-muted text-muted-foreground stepper__item--incomplete' : ''
              )}
              aria-current={step.id === currentStep ? 'step' : undefined}
            >
              {step.id < currentStep ? (
                <Check className="h-6 w-6" aria-hidden="true" /> // Use completion icon
              ) : (
                <span
                  className={cn(
                    "text-sm font-medium"
                    // Text color handled by parent div class
                  )}
                >
                  {step.id}
                </span>
              )}
            </div>

             {/* Label */}
             <div className={cn("stepper__label absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-center text-xs font-medium md:bottom-auto md:top-11",
                step.id <= currentStep ? "text-foreground" : "text-muted-foreground"
             )}>
                {t(step.labelKey, `Step ${step.id}`)}
             </div>


            {/* Connecting Line (except for last step) */}
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "absolute right-0 top-5 h-0.5 w-full -translate-y-1/2", // Adjusted top position for alignment with circle center
                  step.id < currentStep ? 'bg-green-600' : 'bg-border' // Use completion color for line
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
