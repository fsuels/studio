// src/components/landing/HowItWorks.client.tsx
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { FolderOpen, FileQuestion, Lock, Share2 } from 'lucide-react';
import StepCard from './StepCard';

const steps = [
  {
    number: 1,
    Icon: FolderOpen,
    titleKey: 'home.steps.step1.titleUpdated',
    descKey: 'home.steps.step1.descUpdated',
    defaultTitle: 'Select a Legal Template',
    defaultDesc:
      'Choose from 1,000+ state-specific templates built on up-to-date statutes & best practices.',
  },
  {
    number: 2,
    Icon: FileQuestion,
    titleKey: 'home.steps.step2.titleUpdated',
    descKey: 'home.steps.step2.descUpdated',
    defaultTitle: 'Answer Quick Prompts',
    defaultDesc:
      'Fill in simple fields—no legal expertise needed. As you answer plain-language questions, your document populates in real time. Then edit any clause or section until it’s exactly what you need.',
  },
  {
    number: 3,
    Icon: () => (
      <span className="relative inline-block w-8 h-8">
        <Lock className="absolute inset-0" />
        <Share2 className="absolute -right-2 -bottom-2 w-4 h-4" />
      </span>
    ),
    titleKey: 'home.steps.step3.title',
    descKey: 'home.steps.step3.descUpdated',
    defaultTitle: 'Securely Download & Share',
    defaultDesc:
      'Once you’ve double-checked every detail, hit “Complete.” Your polished PDF is ready to download, print, or share via a protected link—controlled by you, accessible to anyone you choose.',
  },
] as const;

const HowItWorks = React.memo(function HowItWorks() {
  const { t } = useTranslation('common'); // Uses 'common' namespace

  return (
    <section
      id="how-it-works"
      className="relative bg-gradient-to-b from-background to-secondary/20 border-t border-border py-16 md:py-20"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[url('/images/pattern-legal.svg')] bg-repeat bg-[length:40px_40px] opacity-[0.02]"
        aria-hidden="true"
      />
      <div className="relative max-w-5xl mx-auto text-center px-4">
        <h2 className="text-3xl font-bold text-foreground">
          <span>
            {t('home.howItWorksSectionTitle.main', {
              defaultValue: 'Generate and Personalize Legal Forms',
            })}
          </span>
        </h2>
        <span className="block mt-3 mb-10 text-lg text-muted-foreground">
          {t('home.howItWorksSectionTitle.sub', {
            defaultValue: '• Fast • Easy • No Hidden Fees •',
          })}
        </span>
        <div className="mt-8 flex flex-col items-stretch space-y-8 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
          {steps.map((step) => (
            <div key={step.titleKey} className="flex sm:flex-1">
              <StepCard
                number={step.number}
                title={t(step.titleKey, { defaultValue: step.defaultTitle })}
                desc={t(step.descKey, { defaultValue: step.defaultDesc })}
                icon={<step.Icon className="w-8 h-8 text-primary" />}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default HowItWorks;
