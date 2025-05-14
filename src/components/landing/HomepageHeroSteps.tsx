// src/components/landing/HomepageHeroSteps.tsx
'use client'

import React, { useState, useEffect } from 'react'; 
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { CheckCircle, ShieldCheck, Rocket } from 'lucide-react'
import { motion } from 'framer-motion'; 
import Link from 'next/link'; 
import { Badge } from '@/components/ui/badge';
import SearchBar from '@/components/SearchBar'; // Import SearchBar

// Placeholder for TrustStrip - in a real app this would be a separate component
const TrustStripPlaceholder = () => {
  const { t } = useTranslation("common");
  return (
    <div className="mt-6 mb-8 flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-3 text-foreground/90 text-sm font-medium">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <span>{t('trustBadges.secure', { defaultValue: "SSL Secure Checkout" })}</span>
      </div>
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-primary" /> {/* Using ShieldCheck for attorney reviewed as well for consistency */}
        <span>{t('trustBadges.attorneyReviewed', { defaultValue: "Attorney-Reviewed Templates" })}</span>
      </div>
      {/* Placeholder for Trustpilot widget - actual integration needed */}
      <div className="flex items-center gap-2">
        <span className="font-bold">Trustpilot</span> ⭐⭐⭐⭐⭐ {/* Simplified representation */}
      </div>
    </div>
  );
};


const HomepageHeroSteps = React.memo(function HomepageHeroSteps() {
  const { t, i18n } = useTranslation("common")
  const [isHydrated, setIsHydrated] = useState(false); 
  
  useEffect(() => {
    setIsHydrated(true);
  }, []); 

  const placeholderText = "..."; 

  return (
    <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full pt-4 md:pt-12 pb-16 md:pb-24 px-4 text-center relative overflow-hidden" // Reduced top padding
        style={{
            // Basic gradient, replace with mesh or organic blobs if needed
            background: 'radial-gradient(ellipse at top, hsl(var(--secondary)) 0%, hsl(var(--background)) 70%)', 
        }}
    >
        <div className="relative z-10"> {/* Ensure content is above background elements */}
           <div className="mb-4">
             {isHydrated && (
                <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10 px-4 py-1.5 text-sm shadow-sm">
                    {t('home.hero.pricingBadge', { defaultValue: 'One-time $35/document • No subscription' })}
                </Badge>
             )}
           </div>

            <motion.h1
                key={`headline-${i18n.language}`} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isHydrated ? 1 : 0, y: isHydrated ? 0 : 10 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground leading-tight"
            >
                {isHydrated ? t('headline', { defaultValue: 'Legal Docs at Your Fingertips' }) : placeholderText}
            </motion.h1>
            <motion.p
                key={`subhead-${i18n.language}`} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isHydrated ? 1 : 0, y: isHydrated ? 0 : 10 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            >
                {isHydrated ? t('subhead', { defaultValue: 'Create, sign & share professional contracts in minutes—no lawyer required.'}) : placeholderText}
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
                    className="text-lg px-8 py-4 bg-accent hover:bg-accent/90 text-accent-foreground shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    disabled={!isHydrated} 
                >
                  <Link href="/#workflow-start">{isHydrated ? t('ctaPrimary', { defaultValue: 'Start Free, Pay $35/Doc →' }) : placeholderText}</Link>
                </Button>
                <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-4 border-foreground/30 text-foreground hover:bg-foreground/5 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200"
                    disabled={!isHydrated}
                >
                   <Link href="/#how-it-works">{isHydrated ? t('ctaSecondary', { defaultValue: 'See Demo' }) : placeholderText}</Link>
                </Button>
             </motion.div>
             
             {isHydrated && <TrustStripPlaceholder />}
        </div>
    </motion.section>
  )
});
export default HomepageHeroSteps;
