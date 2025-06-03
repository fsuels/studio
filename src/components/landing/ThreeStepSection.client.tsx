// src/components/landing/HowItWorks.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useAnimation, useInView } from 'framer-motion';
import { FileText, Edit3, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress'; // Assuming ShadCN progress

const HowItWorks = React.memo(function HowItWorks() {
  const { t } = useTranslation('common');
  const [isHydrated, setIsHydrated] = useState(false);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const controls = useAnimation();
  const [currentStepAnimated, setCurrentStepAnimated] = useState(0);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
      // Animate progress bar
      let step = 0;
      const interval = setInterval(() => {
        step++;
        setCurrentStepAnimated(step);
        if (step >= 3) clearInterval(interval);
      }, 600); // Adjust timing as needed
      return () => clearInterval(interval);
    }
  }, [isInView, controls]);

  const placeholderTitle = '...';
  const placeholderDescription = '...';

  const stepsData = [
    {
      icon: FileText,
      titleKey: 'home.steps.step1.title',
      descriptionKey: 'home.steps.step1.desc',
      defaultTitle: 'Tell Us Your Needs',
      defaultDescription: 'Give a quick summary. Text or mic supported.',
    },
    {
      icon: Edit3,
      titleKey: 'home.steps.step2.title',
      descriptionKey: 'home.steps.step2.desc',
      defaultTitle: 'AI Crafts Your Document',
      defaultDescription: 'AI will guide you through the exact info needed.',
    },
    {
      icon: CheckCircle,
      titleKey: 'home.steps.step3.title',
      descriptionKey: 'home.steps.step3.desc',
      defaultTitle: 'Securely Download & Share',
      defaultDescription: 'Download, sign, or securely share your document.',
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99], // Smoother ease
      },
    }),
  };

  return (
    <section
      ref={containerRef}
      className="bg-background py-16 md:py-24 overflow-hidden"
    >
      {/* Placeholder for parallax document sheets - more complex to implement well without dedicated library */}
      {/* <div className="absolute inset-0 pointer-events-none opacity-5">
        <FileText className="absolute top-1/4 left-1/4 w-32 h-32 text-muted-foreground/30 -rotate-12" />
        <FileText className="absolute bottom-1/4 right-1/4 w-24 h-24 text-muted-foreground/30 rotate-6" />
      </div> */}

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold mb-6 text-foreground"
        >
          {isHydrated
            ? t('home.hero.title', { defaultValue: 'Only 3 Easy Steps' })
            : placeholderTitle}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-muted-foreground mb-12 md:mb-16 max-w-2xl mx-auto"
        >
          {isHydrated
            ? t('home.hero.subtitle', {
                defaultValue:
                  'In a few guided steps, you’ll generate a fully customized legal document.',
              })
            : placeholderDescription}
        </motion.p>

        <div className="mb-12 md:mb-16 max-w-md mx-auto">
          <Progress
            value={(currentStepAnimated / stepsData.length) * 100}
            className="h-2 bg-muted"
            aria-label="Progress"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {isHydrated && currentStepAnimated > 0
              ? t("You're {{currentStep}} of {{totalSteps}} done!", {
                  currentStep: currentStepAnimated,
                  totalSteps: stepsData.length,
                  defaultValue: `Step ${currentStepAnimated}/${stepsData.length}`,
                })
              : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {stepsData.map((step, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate={controls}
              className="flex-shrink-0 w-full snap-center md:snap-none"
            >
              <div className="flex flex-col items-center p-6 bg-card rounded-xl shadow-lg border border-border hover:shadow-2xl transition-all duration-300 h-full transform hover:-translate-y-1">
                <div className="mb-6 p-4 bg-primary/10 rounded-full inline-flex items-center justify-center">
                  <step.icon className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-card-foreground">
                  {isHydrated
                    ? t(step.titleKey, { defaultValue: step.defaultTitle })
                    : placeholderTitle}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {isHydrated
                    ? t(step.descriptionKey, {
                        defaultValue: step.defaultDescription,
                      })
                    : placeholderDescription}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});
export default HowItWorks;
