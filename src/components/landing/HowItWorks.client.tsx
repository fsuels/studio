// src/components/landing/HowItWorks.client.tsx
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Folder,
  FileQuestion,
  Lock,
  Share2,
  ArrowRight,
} from 'lucide-react';
import StepCard from './StepCard';

const steps = [
  {
    number: 1,
    icon: <Folder className="h-8 w-8" />,
    titleKey: 'home.steps.step1.titleUpdated',
    descKey: 'home.steps.step1.descUpdated',
    defaultTitle: 'Select a Legal Template',
    defaultDesc:
      'Browse our extensive library of legal forms built on current statutes, regulations, and industry best practices so you can start with confidence. Each template uses real laws and guidelines and is fully ready for customization.',
  },
  {
    number: 2,
    icon: <FileQuestion className="h-8 w-8" />,
    titleKey: 'home.steps.step2.titleUpdated',
    descKey: 'home.steps.step2.descUpdated',
    defaultTitle: 'Answer Quick Prompts',
    defaultDesc:
      'Fill in simple fields—no legal expertise needed. As you answer plain-language questions, your document populates in real time. Then edit any clause or section until it’s exactly what you need.',
  },
  {
    number: 3,
    icon: (
      <div className="flex gap-1">
        <Lock className="h-7 w-7" />
        <Share2 className="h-7 w-7" />
      </div>
    ),
    titleKey: 'home.steps.step3.title',
    descKey: 'home.steps.step3.descUpdated',
    defaultTitle: 'Securely Download & Share',
    defaultDesc:
      'Once you’ve double-checked every detail, hit “Complete.” Your polished PDF is ready to download, print, or share via a protected link—controlled by you, accessible to anyone you choose.',
  },
] as const;

function StepFlowItem({
  step,
  isLast,
}: {
  step: (typeof steps)[number];
  isLast: boolean;
}) {
  return (
    <div className="relative flex flex-col items-center group">
      <StepCard
        number={step.number}
        icon={step.icon}
        title={step.title}
        desc={step.desc}
      />
      {!isLast && (
        <div className="hidden sm:flex absolute top-1/2 right-[-70px] items-center w-[70px] pointer-events-none">
          <div className="flex-1 h-px bg-gray-300 opacity-50 group-hover:bg-brand-blue transition-colors" />
          <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-brand-blue transition-colors" />
        </div>
      )}
    </div>
  );
}

const HowItWorks = React.memo(function HowItWorks() {
  const { t } = useTranslation('common');

  const localizedSteps = steps.map((step) => ({
    ...step,
    title: t(step.titleKey, { defaultValue: step.defaultTitle }),
    desc: t(step.descKey, { defaultValue: step.defaultDesc }),
  }));

  return (
    <section id="how-it-works" className="bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          <span>
            {t('home.howItWorksSectionTitle.main', {
              defaultValue: 'Generate and Personalize Legal Forms',
            })}
          </span>
          <br />
          <span className="block mt-2 text-xl font-medium text-gray-600">
            {t('home.howItWorksSectionTitle.sub', {
              defaultValue: '• Fast • Easy • No Hidden Fees',
            })}
          </span>
        </h2>
        <div className="mt-8 flex flex-col sm:flex-row items-start justify-center gap-6">
          {localizedSteps.map((step, idx) => (
            <StepFlowItem key={step.titleKey} step={step} isLast={idx === localizedSteps.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
});

export default HowItWorks;
