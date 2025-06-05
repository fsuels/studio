// src/components/landing/HowItWorks.client.tsx
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
  const { t } = useTranslation('common'); // Uses 'common' namespace

  return (
    <section id="how-it-works" className="bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          {t('home.howItWorksSectionTitle', { defaultValue: 'Generate and Personalize Professional Legal Forms — Fast • Easy • No Hidden Fees' })}
        </h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {steps.map((step) => (
            <StepCard
              key={step.titleKey}
              number={step.number}
              title={t(step.titleKey, { defaultValue: step.defaultTitle })}
              desc={t(step.descKey, { defaultValue: step.defaultDesc })}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

export default HowItWorks;
