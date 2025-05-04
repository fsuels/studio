
// src/components/landing/HeroSection.tsx
"use client";

import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from '@/components/layout/Logo';

// Example Language Switcher Flags
const FlagEN = () => <span className="mr-2 text-xs" role="img" aria-label="UK Flag">🇬🇧</span>;
const FlagES = () => <span className="mr-2 text-xs" role="img" aria-label="Spain Flag">🇪🇸</span>;

export function HeroSection() {
  const { t, i18n } = useTranslation();
  const [isHydrated, setIsHydrated] = useState(false); // State to track hydration
  const [currentLanguage, setCurrentLanguage] = useState('EN'); // State for current language display

  // Effect to set hydration state and initialize language
  useEffect(() => {
    setIsHydrated(true);
    setCurrentLanguage(i18n.language.startsWith('es') ? 'ES' : 'EN');
  }, [i18n.language]); // Rerun when language changes

  const handleLanguageChange = (lang: 'en' | 'es') => {
    i18n.changeLanguage(lang).then(() => {
        // Update state after language change is confirmed
        setCurrentLanguage(lang === 'es' ? 'ES' : 'EN');
        console.log(`Language switched to ${lang}`);
    });
  };

  // Placeholder text while hydrating
  const placeholderText = "...";

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full py-16 md:py-24 text-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(var(--background)) 50%, hsl(180, 50%, 85%) 100%)',
      }}
    >
      {/* Logo */}
      <div className="absolute top-4 left-4 z-10">
        <Logo className="h-8"/>
      </div>

      {/* Language Switcher Dropdown */}
      <div className="absolute top-4 right-4 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-medium text-foreground/80 hover:bg-foreground/5 hover:text-foreground px-3 py-1.5 border-border/50 shadow-sm"
              aria-label="Select language"
              // Disable until hydrated to prevent mismatch during initial render
              disabled={!isHydrated}
            >
              {isHydrated ? (currentLanguage === 'EN' ? <FlagEN /> : <FlagES />) : null}
              {isHydrated ? currentLanguage : '...'}
              <ChevronDown className="ml-1 h-4 w-4 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[8rem]">
            <DropdownMenuItem
               onSelect={() => handleLanguageChange('en')}
               className={`text-xs ${currentLanguage === 'EN' ? 'font-medium text-primary' : ''}`}
            >
               <FlagEN /> English {currentLanguage === 'EN' && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem
               onSelect={() => handleLanguageChange('es')}
               className={`text-xs ${currentLanguage === 'ES' ? 'font-medium text-primary' : ''}`}
            >
               <FlagES /> Español {currentLanguage === 'ES' && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="container mx-auto px-4 relative z-0 pt-12 md:pt-0">
        {/* Pricing Teaser */}
        <div className="mb-4">
           <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mr-2">
             {isHydrated ? t('pricingTeaser') : placeholderText}
           </span>
           <a href="/pricing" className="text-sm text-primary underline hover:text-primary/80">
             {isHydrated ? t('pricingLinkText') : placeholderText}
           </a>
        </div>

        {/* Headline */}
        <motion.h1
          key={`headline-${currentLanguage}`} // Re-animate on language change
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHydrated ? 1 : 0, y: isHydrated ? 0 : 10 }} // Animate in only when hydrated
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground leading-tight"
        >
          {isHydrated ? t('headline') : placeholderText}
        </motion.h1>

        {/* Subhead */}
        <motion.p
          key={`subhead-${currentLanguage}`} // Re-animate on language change
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHydrated ? 1 : 0, y: isHydrated ? 0 : 10 }} // Animate in only when hydrated
          transition={{ duration: 0.3, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
        >
          {isHydrated ? t('subhead') : placeholderText}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHydrated ? 1 : 0, y: isHydrated ? 0 : 10 }} // Animate in only when hydrated
          transition={{ duration: 0.3, delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200">
            {isHydrated ? t('ctaPrimary') : placeholderText}
          </Button>
          <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200">
            {isHydrated ? t('ctaSecondary') : placeholderText}
          </Button>
        </motion.div>

        {/* Trust Bar */}
         <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHydrated ? 1 : 0, y: isHydrated ? 0 : 10 }} // Animate in only when hydrated
          transition={{ duration: 0.3, delay: 0.4 }}
          className="mt-12 text-sm text-muted-foreground flex justify-center items-center gap-2 flex-wrap"
          >
             <span>{isHydrated ? t('trustText') : placeholderText}</span>
             <span className="text-yellow-500 flex items-center">
                 ⭐⭐⭐⭐⭐
             </span>
         </motion.div>
      </div>
    </motion.section>
  );
}
