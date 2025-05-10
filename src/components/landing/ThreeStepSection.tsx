// src/components/landing/ThreeStepSection.tsx
'use client'

import React, { useEffect, useState } from 'react'; 
import { useTranslation } from 'react-i18next'
import { CheckCircle, Edit3, FileText } from 'lucide-react' 

const ThreeStepSection = React.memo(function ThreeStepSection() {
  const { t } = useTranslation();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const placeholderTitle = "...";
  const placeholderDescription = "...";

  const steps = [
    {
      number: 1,
      icon: <FileText className="h-10 w-10 text-primary" />, 
      titleKey: 'home.steps.step1.title',
      descriptionKey: 'home.steps.step1.desc',
    },
    {
      number: 2,
      icon: <Edit3 className="h-10 w-10 text-primary" />, 
      titleKey: 'home.steps.step2.title',
      descriptionKey: 'home.steps.step2.desc',
    },
    {
      number: 3,
      icon: <CheckCircle className="h-10 w-10 text-primary" />, 
      titleKey: 'home.steps.step3.title',
      descriptionKey: 'home.steps.step3.desc',
    },
  ];

  return (
    <section className="bg-background py-16 md:py-24"> 
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
          {isHydrated ? t('home.hero.title', {defaultValue: "Only 3 Easy Steps"}) : placeholderTitle} 
        </h2>
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          {isHydrated ? t('home.hero.subtitle', {defaultValue: "In a few guided steps, you’ll generate a fully customized legal document."}) : placeholderDescription} 
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map(step => (
            <div key={step.number} className="flex flex-col items-center p-6 bg-card rounded-xl shadow-lg border border-border hover:shadow-xl transition-shadow duration-300">
              <div className="mb-6"> 
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">
                {isHydrated ? t(step.titleKey, {defaultValue: `Step ${step.number} Title`}) : placeholderTitle}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {isHydrated ? t(step.descriptionKey, {defaultValue: "Step description..."}) : placeholderDescription}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
});
export default ThreeStepSection;
