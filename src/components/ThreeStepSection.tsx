
// src/components/ThreeStepSection.tsx
'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { FileText, Edit3, FileSignature } from 'lucide-react'; // Changed icon import

export default function ThreeStepSection() {
  const { t } = useTranslation(); // Use the hook

  // Updated steps to match the HowItWorks component and use translations
  const steps = [
    {
      number: 1,
      title: t('Describe Your Situation'),
      description: t('Tell us what you need—type or speak it.'),
      icon: FileText,
    },
    {
      number: 2,
      title: t('Answer Simple Questions'),
      description: t('Provide a few details to customize your document.'),
      icon: Edit3,
    },
    {
      number: 3,
      title: t('Preview & Sign'), // Using generic title key, might need specific key like 'step3Title'
      description: t('Get a professional PDF ready to sign and share.'), // Using generic desc key, might need specific key like 'step3Description'
      icon: FileSignature,
    },
  ];

  return (
    <section className="bg-background py-16"> {/* Changed background to theme background */}
      <div className="container mx-auto px-4 text-center"> {/* Used container class */}
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground"> {/* Used theme foreground */}
          {t('Just 3 Easy Steps')}
        </h2>
        <p className="text-muted-foreground mb-12"> {/* Used theme muted-foreground */}
          {t('In three quick steps, you’ll have a ready-to-use legal document.')}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {steps.map(step => (
            <div key={step.number} className="space-y-4 flex flex-col items-center"> {/* Added flex for centering */}
               {/* Updated icon rendering */}
              <div className="mx-auto h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground mb-4"> {/* Used theme colors */}
                {/* Use Lucide Icon */}
                <step.icon className="h-8 w-8" />
                 {/* Removed number inside icon circle */}
                 {/* <span className="text-xl font-bold">{step.number}</span> */}
              </div>
              {/* Added Step Number above Title */}
              <p className="text-sm font-semibold text-primary">STEP {step.number}</p>
              <h3 className="text-xl font-semibold text-foreground">{step.title}</h3> {/* Used theme foreground */}
              <p className="text-muted-foreground">{step.description}</p> {/* Used theme muted-foreground */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
