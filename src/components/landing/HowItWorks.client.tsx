'use client';

import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowDown, ArrowRight } from 'lucide-react';

const steps = [
  {
    emoji: '🗣️',
    titleKey: 'home.steps.step1.title',
    descKey: 'home.steps.step1.desc',
    defaultTitle: 'Describe Your Situation',
    defaultDesc: 'Skip forms—just speak or type.',
  },
  {
    emoji: '🤖',
    titleKey: 'home.steps.step2.title',
    descKey: 'home.steps.step2.desc',
    defaultTitle: 'Let AI Guide You',
    defaultDesc: "AI asks only what's needed.",
  },
  {
    emoji: '✅',
    titleKey: 'home.steps.step3.title',
    descKey: 'home.steps.step3.desc',
    defaultTitle: 'Download, Sign & Share',
    defaultDesc: 'Download a compliant doc in minutes.',
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
        <div className="flex flex-col md:flex-row items-center md:justify-between gap-6">
          {steps.map((step, index) => (
            <Fragment key={step.titleKey}>
              <div className="flex flex-col items-center text-center p-6 bg-card rounded-xl border border-border shadow-sm">
                <div className="text-4xl mb-6" aria-hidden="true">
                  {step.emoji}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-card-foreground">
                  {t(step.titleKey, { defaultValue: step.defaultTitle })}
                </h3>
                <p className="text-muted-foreground">
                  {t(step.descKey, { defaultValue: step.defaultDesc })}
                </p>
              </div>
              {index < steps.length - 1 && (
                <>
                  <ArrowDown className="md:hidden h-6 w-6 text-muted-foreground" aria-hidden="true" />
                  <ArrowRight className="hidden md:block h-6 w-6 text-muted-foreground" aria-hidden="true" />
                </>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
});

export default HowItWorks;
