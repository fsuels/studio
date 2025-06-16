// src/components/landing/HomepageHeroSteps.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import SearchBar from '@/components/shared/SearchBar'; // Import SearchBar
import { track } from '@/lib/analytics';
import LiveActivityFeed from './LiveActivityFeed';

// Placeholder for TrustStrip - in a real app this would be a separate component
const TrustStripPlaceholder = () => {
  const { t } = useTranslation('common');
  return (
    <div className="mt-6 mb-8 flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-3 text-foreground/90 text-sm font-medium">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <span>
          {t('trustBadges.secure', { defaultValue: 'SSL Secure Checkout' })}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-primary" />{' '}
        {/* Using ShieldCheck for attorney reviewed as well for consistency */}
        <span>
          {t('trustBadges.attorneyReviewed', {
            defaultValue: 'Attorney-Reviewed Templates',
          })}
        </span>
      </div>
      {/* Placeholder for Trustpilot widget - actual integration needed */}
      <div className="flex items-center gap-2">
        <span className="font-bold">Trustpilot</span> ⭐⭐⭐⭐⭐{' '}
        {/* Simplified representation */}
      </div>
    </div>
  );
};

const HomepageHeroSteps = React.memo(function HomepageHeroSteps() {
  const { t, i18n } = useTranslation('common');
  const [isHydrated, setIsHydrated] = useState(false);
  const [variant, setVariant] = useState<'A' | 'B'>('A');

  useEffect(() => {
    setIsHydrated(true);
    const stored = localStorage.getItem('docCtaVariant');
    if (stored === 'A' || stored === 'B') {
      setVariant(stored as 'A' | 'B');
    } else {
      const chosen = Math.random() < 0.5 ? 'A' : 'B';
      localStorage.setItem('docCtaVariant', chosen);
      setVariant(chosen);
    }
  }, []);

  const handleStartClick = useCallback(() => {
    track('cta_click', { variant, label: 'start_button' });
  }, [variant]);

  const handleDemoClick = useCallback(() => {
    track('cta_click', { variant, label: 'demo_button' });
  }, [variant]);

  const placeholderText = '...';

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full pt-4 md:pt-12 pb-16 md:pb-24 px-4 text-center relative overflow-hidden" // Reduced top padding
      style={{
        // Basic gradient, replace with mesh or organic blobs if needed
        background:
          'radial-gradient(ellipse at top, hsl(var(--secondary)) 0%, hsl(var(--background)) 70%)',
      }}
    >
      <div id="morphBg" aria-hidden="true" />
      <div className="relative z-10">
        {' '}
        {/* Ensure content is above background elements */}
        <div className="mb-4">
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
        <motion.h1
          key={`headline-${i18n.language}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground leading-tight"
          suppressHydrationWarning
        >
          {t('home.hero.title', {
            defaultValue: 'Instant Legal Documents, Tailored to You',
          })}
        </motion.h1>
        <motion.p
          key={`subhead-${i18n.language}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          suppressHydrationWarning
        >
          {t('home.hero.subtitle', {
            defaultValue:
              'Create, sign & share professional contracts in minutes—no lawyer required.',
          })}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHydrated ? 1 : 0, y: isHydrated ? 0 : 10 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mb-8" // Margin for SearchBar
        >
          <SearchBar />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHydrated ? 1 : 0, y: isHydrated ? 0 : 10 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6"
        >
          <Button
            asChild
            size="lg"
            className="text-lg h-12 px-10 py-4 bg-brand-blue text-white hover:bg-brand-blue/90 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            disabled={!isHydrated}
          >
            <Link href="/#workflow-start" onClick={handleStartClick}>
              {isHydrated
                ? t('ctaPrimary', {
                    defaultValue:
                      variant === 'A'
                        ? 'Start for Free'
                        : 'Try Now — No Account Needed',
                  })
                : placeholderText}
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="text-lg px-8 py-4 border-foreground/30 text-foreground hover:bg-foreground/5 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200"
            disabled={!isHydrated}
          >
            <Link href="/#how-it-works" onClick={handleDemoClick}>
              {isHydrated
                ? t('ctaSecondary', { defaultValue: 'Learn More' })
                : placeholderText}
            </Link>
          </Button>
        </motion.div>
        <LiveActivityFeed />
        {isHydrated && <TrustStripPlaceholder />}
      </div>
    </motion.section>
  );
});
export default HomepageHeroSteps;
