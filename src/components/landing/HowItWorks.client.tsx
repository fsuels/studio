'use client';

import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowDown, ArrowRight } from 'lucide-react';
import {
  StepOneIllustration,
  StepTwoIllustration,
  StepThreeIllustration,
} from './HowItWorksIllustrations';

const steps = [
  {
    Illustration: StepOneIllustration,
    titleKey: 'home.steps.step1.title',
    descKey: 'home.steps.step1.desc',
    defaultTitle: 'Tell Us Your Needs',
    defaultDesc: 'Answer a few quick prompts for tailored guidance.',
  },
  {
    Illustration: StepTwoIllustration,
    titleKey: 'home.steps.step2.title',
    descKey: 'home.steps.step2.desc',
    defaultTitle: 'AI Crafts Your Document',
    defaultDesc: 'Our system builds a professional draft automatically.',
  },
  {
    Illustration: StepThreeIllustration,
    titleKey: 'home.steps.step3.title',
    descKey: 'home.steps.step3.desc',
    defaultTitle: 'Securely Download & Share',
    defaultDesc: 'Your final document is ready to print or send.',
  },
] as const;

const HowItWorks = React.memo(function HowItWorks() {
  const { t } = useTranslation('common');

  return (
    <section id="how-it-works" className="bg-background section-spacing">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl sm:text-4xl font-bold mb-8 text-foreground">
          {t('linkHowItWorks', { ns: 'footer', defaultValue: 'How It Works' })}
        </h2>
        <div className="flex flex-col md:flex-row items-center md:justify-between gap-6">
          {steps.map((step, index) => (
            <Fragment key={step.titleKey}>
              <div className="flex flex-col items-center text-center p-6 bg-card rounded-xl border border-border shadow-sm">
                <step.Illustration
                  className="h-16 w-16 mb-6 text-primary"
                  aria-hidden="true"
                />
                <h3 className="text-xl font-bold mb-3 text-card-foreground">
                  {t(step.titleKey, { defaultValue: step.defaultTitle })}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t(step.descKey, { defaultValue: step.defaultDesc })}
                </p>
              </div>
              {index < steps.length - 1 && (
                <>
                  <ArrowDown className="md:hidden h-8 w-8 text-brand-blue" aria-hidden="true" />
                  <ArrowRight className="hidden md:block h-8 w-8 text-brand-blue" aria-hidden="true" />
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
