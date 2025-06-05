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
    titleKey: 'home.steps.step1.titleUpdated', // Changed key
    descKey: 'home.steps.step1.descUpdated',
    defaultTitle: 'Select a Legal Template', // Ensured default is correct
    defaultDesc:
      'Browse our extensive library of legal forms built on current statutes, regulations, and industry best practices so you can start with confidence. Each template uses real laws and guidelines and is fully ready for customization.',
  },
  {
    number: 2,
    Icon: Sparkles,
    titleKey: 'home.steps.step2.titleUpdated',
    descKey: 'home.steps.step2.descUpdated',
    defaultTitle: 'Answer Quick Prompts',
    defaultDesc: 'Fill in simple fields—no legal expertise needed. As you answer plain-language questions, your document populates in real time. Then edit any clause or section until it’s exactly what you need.',
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
          <span>
            {t('home.howItWorksSectionTitle.main', {
              defaultValue:
                'Generate and Personalize Legal Forms',
            })}
          </span>
          <br />
          <span className="block mt-2 text-xl font-medium text-gray-600">
            {t('home.howItWorksSectionTitle.sub', {
              defaultValue: '• Fast • Easy • No Hidden Fees',
            })}
          </span>
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
