// src/components/landing/HowItWorks.tsx
"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { FileText, Edit3, FileSignature, Share2 } from 'lucide-react'; // Icons for steps

interface StepProps {
  stepNumber: number;
  title: string;
  icon: React.ElementType;
  isActive: boolean;
  isCompleted: boolean;
}

const Step: React.FC<StepProps> = ({ stepNumber, title, icon: Icon, isActive, isCompleted }) => {
  return (
    <div className="flex flex-col items-center text-center relative z-10 flex-1 min-w-0">
      <div
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 transition-colors duration-300",
          isActive ? "bg-primary border-primary text-primary-foreground" :
          isCompleted ? "bg-primary/70 border-primary/70 text-primary-foreground" :
          "bg-muted border-border text-muted-foreground"
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p
        className={cn(
          "text-xs sm:text-sm font-medium transition-colors duration-300",
          isActive ? "text-primary" :
          isCompleted ? "text-foreground" :
          "text-muted-foreground"
        )}
      >
         <span className="hidden sm:inline">{stepNumber}. </span>{title}
      </p>
    </div>
  );
};

interface HowItWorksProps {
  currentStep: number; // e.g., 1, 2, 3, 4
}

export function HowItWorks({ currentStep }: HowItWorksProps) {
  const steps = [
    { number: 1, title: "Describe", icon: FileText },
    { number: 2, title: "Answer Questions", icon: Edit3 },
    { number: 3, title: "Preview & Sign", icon: FileSignature },
    { number: 4, title: "Share & Track", icon: Share2 }, // Assuming step 4
  ];

  const progressPercentage = Math.max(0, ((currentStep - 1) / (steps.length - 1)) * 100);

  return (
    <section className="w-full py-8 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold text-center mb-8 text-foreground">How It Works</h2>
        <div className="relative flex justify-between items-start max-w-3xl mx-auto">
          {/* Progress Bar Background */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-muted rounded-full z-0">
             {/* Progress Bar Foreground */}
             <div
                className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
             />
          </div>

          {/* Steps */}
          {steps.map((step, index) => (
            <Step
              key={step.number}
              stepNumber={step.number}
              title={step.title}
              icon={step.icon}
              isActive={currentStep === step.number}
              isCompleted={currentStep > step.number}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
