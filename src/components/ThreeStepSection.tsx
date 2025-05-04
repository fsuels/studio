
// src/components/ThreeStepSection.tsx
'use client'

import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { useTranslation } from 'react-i18next';
import { FileText, Edit3, FileSignature } from 'lucide-react';

export default function ThreeStepSection() {
  const { t, i18n } = useTranslation();
  const [isHydrated, setIsHydrated] = useState(false); // State to track hydration

  // Effect to set hydration state
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Update steps to use translations only when hydrated
  const getSteps = () => [
    {
      number: 1,
      title: isHydrated ? t('Describe Your Situation') : '...',
      description: isHydrated ? t('Tell us what you need—type or speak it.') : '...',
      icon: FileText,
    },
    {
      number: 2,
      title: isHydrated ? t('Answer Simple Questions') : '...',
      description: isHydrated ? t('Provide a few details to customize your document.') : '...',
      icon: Edit3,
    },
    {
      number: 3,
      title: isHydrated ? t('Preview & Sign') : '...',
      description: isHydrated ? t('Get a professional PDF ready to sign and share.') : '...',
      icon: FileSignature,
    },
  ];

  const steps = getSteps(); // Get steps based on hydration state

  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
          {isHydrated ? t('Just 3 Easy Steps') : '...'}
        </h2>
        <p className="text-muted-foreground mb-12">
          {isHydrated ? t('In three quick steps, you’ll have a ready-to-use legal document.') : '...'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {steps.map(step => (
            <div key={step.number} className="space-y-4 flex flex-col items-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground mb-4">
                <step.icon className="h-8 w-8" />
              </div>
              <p className="text-sm font-semibold text-primary">STEP {step.number}</p>
              <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
