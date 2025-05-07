
// src/components/ProgressSteps.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ProgressStepsProps {
  current: number; // Current step (1-indexed)
  total: number;   // Total number of steps
  stepLabels?: string[]; // Optional labels for each step
}

export default function ProgressSteps({ current, total, stepLabels }: ProgressStepsProps) {
  if (total <= 0) return null;

  return (
    <nav aria-label="Progress" className="mb-8">
      <ol role="list" className="flex items-center justify-between space-x-2 md:space-x-4">
        {Array.from({ length: total }, (_, i) => i + 1).map((step) => {
          const isActive = step === current;
          const isCompleted = step < current;
          const label = stepLabels && stepLabels[step - 1] ? stepLabels[step - 1] : `Step ${step}`;

          return (
            <li key={step} className="flex-1 relative">
              <div className="flex flex-col items-center text-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors duration-300 step-circle", // Added step-circle for global CSS
                    isCompleted ? "bg-green-600 border-green-600 text-white" : "",
                    isActive ? "border-primary bg-primary/10 text-primary" : "",
                    !isCompleted && !isActive ? "border-border bg-muted text-muted-foreground" : ""
                  )}
                  aria-current={isActive ? "step" : undefined}
                >
                  {isCompleted ? (
                    <Check className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <span className={cn("text-sm font-medium", isActive && "font-bold")}>
                      {step}
                    </span>
                  )}
                </div>
                <p
                  className={cn(
                    "mt-2 text-xs font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px] sm:max-w-none step-caption", // Added step-caption for global CSS
                    isCompleted ? "text-green-700" : "",
                    isActive ? "text-primary" : "",
                    !isCompleted && !isActive ? "text-muted-foreground" : ""
                  )}
                >
                  {label}
                </p>
              </div>

              {/* Connector line - not for the last step */}
              {step < total && (
                <div
                  className={cn(
                    "absolute left-1/2 top-5 h-0.5 w-full -translate-x-0 transform transition-colors duration-300 -z-10",
                    isCompleted ? "bg-green-600" : "bg-border"
                  )}
                  style={{ marginLeft: '50%', width: 'calc(100% - 2.5rem)' }} 
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
      {/* Mobile progress bar */}
      <div className="sm:hidden mt-4 h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div
          className="bg-primary h-full rounded-full transition-all duration-300"
          style={{ width: `${Math.max(0, (current -1) / Math.max(1, total -1)) * 100}%` }}
        />
      </div>
    </nav>
  );
}
