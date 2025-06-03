'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

const steps = [
  {
    emoji: '🗣️',
    titleKey: 'home.steps.step1.title',
    descKey: 'home.steps.step1.desc',
    defaultTitle: 'Tell Us Your Needs',
    defaultDesc: 'Use voice or text to tell us what you need.',
  },
  {
    emoji: '🤖',
    titleKey: 'home.steps.step2.title',
    descKey: 'home.steps.step2.desc',
    defaultTitle: 'AI Crafts Your Document',
    defaultDesc: 'Answer a few smart prompts.',
  },
  {
    emoji: '✅',
    titleKey: 'home.steps.step3.title',
    descKey: 'home.steps.step3.desc',
    defaultTitle: 'Securely Download & Share',
    defaultDesc: 'Fully compliant and ready in minutes.',
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
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.titleKey}
              className="flex flex-col items-center text-center p-6 bg-card rounded-xl border border-border shadow-sm"
            >
              <div className="text-4xl mb-4" aria-hidden="true">
                {step.emoji}
              </div>
              <h3 className="text-2xl font-bold mb-2 text-card-foreground">
                {t(step.titleKey, { defaultValue: step.defaultTitle })}
              </h3>
              <p className="text-muted-foreground">
                {t(step.descKey, { defaultValue: step.defaultDesc })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default HowItWorks;
