
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
      titleKey: 'Describe Your Situation', // Using the key directly from translation.json
      descriptionKey: 'Tell us what you need—type or speak it.',
      icon: FileText,
    },
    {
      number: 2,
      titleKey: 'Answer Simple Questions',
      descriptionKey: 'Provide a few details to customize your document.',
      icon: Edit3,
    },
    {
      number: 3,
      titleKey: 'Preview & Sign',
      descriptionKey: 'Get a professional PDF ready to sign and share.',
      icon: FileSignature,
    },
  ];

  const steps = getSteps(); // Get steps based on hydration state
  const sectionTitleKey = 'Just 3 Easy Steps';
  const sectionDescriptionKey = 'In three quick steps, you’ll have a ready-to-use legal document.';

  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
          {isHydrated ? t(sectionTitleKey) : '...'}
        </h2>
        <p className="text-muted-foreground mb-12">
          {isHydrated ? t(sectionDescriptionKey) : '...'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {steps.map(step => (
            <div key={step.number} className="space-y-4 flex flex-col items-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground mb-4">
                <step.icon className="h-8 w-8" />
              </div>
              <p className="text-sm font-semibold text-primary">
                {/* Translate "STEP" prefix as well if needed */}
                {isHydrated ? t('stepPrefix', { defaultValue: 'STEP' }) : '...'} {step.number}
              </p>
              <h3 className="text-xl font-semibold text-foreground">
                 {isHydrated ? t(step.titleKey) : '...'}
              </h3>
              <p className="text-muted-foreground">
                {isHydrated ? t(step.descriptionKey) : '...'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
