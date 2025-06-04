'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Target, Sparkles, Download } from 'lucide-react';
import StepCard from './StepCard';

const steps = [
  {
    number: 1,
    Icon: Target,
    titleKey: 'home.steps.step1.title',
    descKey: 'home.steps.step1.desc',
    defaultTitle: 'Tell Us Your Needs',
    defaultDesc: 'Answer a few quick prompts for tailored guidance.',
  },
  {
    number: 2,
    Icon: Sparkles,
    titleKey: 'home.steps.step2.title',
    descKey: 'home.steps.step2.desc',
    defaultTitle: 'AI Crafts Your Document',
    defaultDesc: 'Our system builds a professional draft automatically.',
  },
  {
    number: 3,
    Icon: Download,
    titleKey: 'home.steps.step3.title',
    descKey: 'home.steps.step3.desc',
    defaultTitle: 'Securely Download & Share',
    defaultDesc: 'Your final document is ready to print or send.',
  },
] as const;

const HowItWorks = React.memo(function HowItWorks() {
  const { t } = useTranslation('common');

  return (
    <section id="how-it-works" className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl sm:text-4xl font-bold mb-8 text-foreground">
          {t('linkHowItWorks', { ns: 'footer', defaultValue: 'How It Works' })}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step) => (
            <StepCard
              key={step.titleKey}
              number={step.number}
              title={t(step.titleKey, { defaultValue: step.defaultTitle })}
              desc={t(step.descKey, { defaultValue: step.defaultDesc })}
              icon={<step.Icon className="h-8 w-8" />}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

export default HowItWorks;
