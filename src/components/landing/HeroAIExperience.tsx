// src/components/landing/HeroAIExperience.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SmartAssistantBar from '@/components/landing/SmartAssistantBar';
import LiveActivityFeed from './LiveActivityFeed';
import { TrustBanner } from './TrustBanner'; // Assuming TrustBanner is a separate component
import AutoImage from '@/components/AutoImage'; // Import AutoImage
import { ShieldCheck, Users, Globe, Zap, FileText, UserCheck, Send } from 'lucide-react';
import Link from 'next/link';
import { track } from '@/lib/analytics';

const HeroAIExperience = React.memo(function HeroAIExperience() {
  const { t, i18n } = useTranslation('common');
  const [isHydrated, setIsHydrated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleSamplePrompt = (prompt: string) => {
    setSearchQuery(prompt);
    track('sample_prompt_click', { prompt });
  };

  const handleSubmitQuery = (submittedQuery: string) => {
    // This would typically navigate to a search results page or trigger AI inference
    console.log('Submitting query:', submittedQuery);
    track('smart_assistant_submit', { query: submittedQuery });
    // Example navigation: router.push(`/${i18n.language}/generate?search=${encodeURIComponent(submittedQuery)}`);
  };


  const samplePrompts = [
    { key: 'samplePrompt1', defaultText: 'I need a rental agreement' },
    { key: 'samplePrompt2', defaultText: 'Help me sell my car' },
    { key: 'samplePrompt3', defaultText: 'I want a contract for a freelancer' },
  ];

  const keyBenefits = [
    { icon: Zap, textKey: 'hero.benefit1', defaultText: 'AI-Powered Document Matching' },
    { icon: FileText, textKey: 'hero.benefit2', defaultText: 'Guided Questionnaires' },
    { icon: UserCheck, textKey: 'hero.benefit3', defaultText: 'Attorney-Reviewed Templates' },
    { icon: Send, textKey: 'hero.benefit4', defaultText: 'Instant Download & eSign' },
  ];


  const placeholderText = '...';

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-sky-100 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 pt-12 pb-16 md:pt-16 md:pb-24"
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Column: Text content, Smart Assistant, CTAs */}
          <div className="text-center md:text-left">
            <div className="mb-4 inline-block">
              {isHydrated && (
                <Badge
                  variant="outline"
                  className="border-primary/50 text-primary bg-primary/10 px-4 py-1.5 text-sm shadow-sm"
                >
                  {t('home.hero.pricingBadge', {
                    defaultValue: 'One-time $35/document • No subscription',
                  })}
                </Badge>
              )}
            </div>
            <h1
              className="text-4xl lg:text-5xl font-bold leading-tight text-foreground mb-4"
              suppressHydrationWarning
            >
              {t('home.hero.title', {
                defaultValue: 'Instant Legal Documents, Tailored to You',
              })}
            </h1>
            <p
              className="text-lg text-muted-foreground mb-6"
              suppressHydrationWarning
            >
              {t('home.hero.subtitle', {
                defaultValue:
                  'Describe your situation—our AI guides you to the right document instantly.',
              })}
            </p>

            <SmartAssistantBar
              query={searchQuery}
              onQueryChange={setSearchQuery}
              onSubmit={handleSubmitQuery}
            />

            <div className="mt-3 text-xs text-muted-foreground flex flex-wrap justify-center md:justify-start items-center gap-x-2 gap-y-1">
              <span>{t('Try:')}</span>
              {samplePrompts.map((prompt) => (
                <Button
                  key={prompt.key}
                  variant="link"
                  size="sm"
                  onClick={() => handleSamplePrompt(t(prompt.key, {defaultValue: prompt.defaultText}))}
                  className="text-primary p-0 h-auto hover:underline text-xs"
                >
                  {t(prompt.key, {defaultValue: prompt.defaultText})}
                </Button>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Button
                asChild
                size="lg"
                className="bg-brand-blue text-white hover:bg-brand-blue/90 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-base h-12 px-10 py-4"
              >
                <Link href="/#workflow-start">
                  {isHydrated
                    ? t('ctaPrimary', { defaultValue: 'Start for Free' })
                    : placeholderText}
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-foreground/30 text-foreground hover:bg-foreground/5 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 text-base px-8 py-3"
              >
                <Link href="/#how-it-works">
                  {isHydrated
                    ? t('ctaSecondary', { defaultValue: 'Learn More' })
                    : placeholderText}
                </Link>
              </Button>
            </div>

             <div className="mt-6 flex items-center justify-center md:justify-start gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>ISO 27001</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4 text-primary" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-primary" />
                <span>Trusted by 4M+ Users</span>
              </div>
            </div>
            <LiveActivityFeed />
          </div>

          {/* Right Column: Image / Benefits */}
          <div className="hidden md:block relative">
            {/* Animated background placeholder - visual element */}
            {/* <div className="absolute inset-0 opacity-50 dark:opacity-20 rounded-2xl overflow-hidden">
              <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-300 dark:bg-purple-800 rounded-full filter blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-sky-300 dark:bg-sky-800 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
            </div> */}
            <AutoImage
              src="https://placehold.co/800x500.png"
              alt={t('Hero image illustrating legal document generation', {
                defaultValue: 'AI legal assistant helping users',
              })}
              className="rounded-xl shadow-2xl object-cover w-full h-auto aspect-[4/3] lg:aspect-[16/10]"
              data-ai-hint="team collaboration"
              priority
            />
             <div className="mt-6 grid grid-cols-2 gap-4">
                {keyBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-background/50 dark:bg-slate-800/50 rounded-lg shadow-sm border border-border/50">
                    <benefit.icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{t(benefit.textKey, {defaultValue: benefit.defaultText})}</h4>
                    </div>
                  </div>
                ))}
              </div>
          </div>
        </div>

        {/* TrustBanner can be placed here if it's a separate component meant to span full-width below the 2-column layout */}
        {/* <TrustBanner /> */}
      </div>
    </section>
  );
});
export default HeroAIExperience;
