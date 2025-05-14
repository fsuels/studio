// src/components/ProgressStepper.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Check, Loader2 } from 'lucide-react';

interface ProgressStepperProps {
  currentStep: number; 
}

const STEPS = [
  { id: 1, labelKey: 'progressStepper.step1' },
  { id: 2, labelKey: 'progressStepper.step2' },
  { id: 3, labelKey: 'progressStepper.step3' },
];

const ProgressStepper: React.FC<ProgressStepperProps> = React.memo(({ currentStep }) => {
  const { t } = useTranslation("common");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const progressPercent = ((currentStep -1) / (STEPS.length -1 )) * 100; 

  if (!isHydrated) {
    return (
      <nav
        aria-label="Progress"
        className="stepper sticky top-0 z-30 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 opacity-50"
      >
        <div className="progress-bar block sm:hidden bg-muted h-1 rounded-full">
            <div className="bg-primary h-full rounded-full" style={{ width: `0%` }} /> 
        </div>
        <ol
          role="list"
          className="flex items-center space-x-2 md:space-x-4 w-full overflow-x-auto scrollbar-hide py-2 md:justify-center"
        >
            {STEPS.map((step) => (
                <li key={step.id} className={cn("stepper__item relative flex-1")}>
                    <div className="stepper__number flex h-10 w-10 items-center justify-center rounded-full border-2 border-border bg-muted text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                </li>
            ))}
        </ol>
      </nav>
    );
  }

  return (
    <nav
      aria-label="Progress"
      className="stepper sticky top-0 z-30 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
       <div className="progress-bar block sm:hidden h-1 bg-muted rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
        </div>
       <ol
         role="list"
         className="flex items-center space-x-2 md:space-x-4 w-full overflow-x-auto scrollbar-hide py-2 md:justify-center"
       >
        {STEPS.map((step, index) => (
          <li key={step.id} className={cn("stepper__item relative flex-1", index < STEPS.length - 1 ? "pr-8 sm:pr-12" : "")}>
            <div
              className={cn(
                "stepper__number flex h-10 w-10 items-center justify-center rounded-full border-2", 
                step.id < currentStep ? 'bg-green-600 border-green-600 text-white stepper__item--complete' : '', 
                step.id === currentStep ? 'border-primary bg-primary/10 text-primary stepper__item--active' : '',
                step.id > currentStep ? 'border-border bg-muted text-muted-foreground stepper__item--incomplete' : ''
              )}
              aria-current={step.id === currentStep ? 'step' : undefined}
            >
              {step.id < currentStep ? (
                <Check className="h-6 w-6" aria-hidden="true" /> 
              ) : (
                <span
                  className={cn(
                    "text-sm font-medium"
                  )}
                >
                  {step.id}
                </span>
              )}
            </div>
             <div className={cn("stepper__label absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-center text-xs font-medium md:bottom-auto md:top-11",
                step.id <= currentStep ? "text-foreground" : "text-muted-foreground"
             )}>
                {t(step.labelKey, `Step ${step.id}`)}
             </div>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "absolute right-0 top-5 h-0.5 w-full -translate-y-1/2", 
                  step.id < currentStep ? 'bg-green-600' : 'bg-border' 
                )}
                aria-hidden="true"
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
});

export default ProgressStepper;
