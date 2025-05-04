
// src/components/landing/HeroSection.tsx
"use client";

import React from 'react'; // Removed useState as language is handled by i18next
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion'; // For animations
import { Check, ChevronDown } from 'lucide-react'; // Added ChevronDown
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu" // Import Dropdown components
import { Logo } from '@/components/layout/Logo'; // Import the Logo component

// Example Language Switcher Flags (replace with actual flag SVGs or images)
// Using simple text for flags for better consistency across browsers
const FlagEN = () => <span className="mr-2 text-xs" role="img" aria-label="UK Flag">🇬🇧</span>;
const FlagES = () => <span className="mr-2 text-xs" role="img" aria-label="Spain Flag">🇪🇸</span>;


export function HeroSection() {
  const { t, i18n } = useTranslation(); // Use the hook
  const currentLanguage = i18n.language.startsWith('es') ? 'ES' : 'EN'; // Determine current language

  const handleLanguageChange = (lang: 'en' | 'es') => {
    i18n.changeLanguage(lang); // Change language using i18next
    console.log(`Language switched to ${lang}`);
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full py-16 md:py-24 bg-gradient-to-br from-teal-100 via-blue-100 to-soft-blue-100 text-center relative overflow-hidden" // Use theme colors if defined, otherwise fallback
      style={{
          // Soft blue gradient fallback
          background: 'linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(var(--background)) 50%, hsl(180, 50%, 85%) 100%)', // Using HSL theme vars
      }}
    >
       {/* Logo */}
      <div className="absolute top-4 left-4 z-10">
        <Logo className="h-8"/> {/* Adjust size as needed */}
      </div>


      {/* Language Switcher Dropdown */}
      <div className="absolute top-4 right-4 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline" // Changed to outline for better definition
              size="sm"
              className="text-xs font-medium text-foreground/80 hover:bg-foreground/5 hover:text-foreground px-3 py-1.5 border-border/50 shadow-sm" // Adjusted styling
              aria-label="Select language"
            >
              {currentLanguage === 'EN' ? <FlagEN /> : <FlagES />}
              {currentLanguage}
              <ChevronDown className="ml-1 h-4 w-4 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[8rem]">
            <DropdownMenuItem
               onSelect={() => handleLanguageChange('en')} // Use 'en' code
               className={`text-xs ${currentLanguage === 'EN' ? 'font-medium text-primary' : ''}`}
            >
               <FlagEN /> English {currentLanguage === 'EN' && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem
               onSelect={() => handleLanguageChange('es')} // Use 'es' code
               className={`text-xs ${currentLanguage === 'ES' ? 'font-medium text-primary' : ''}`}
            >
               <FlagES /> Español {currentLanguage === 'ES' && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>


      <div className="container mx-auto px-4 relative z-0 pt-12 md:pt-0"> {/* Added padding top for small screens to avoid overlap */}
        {/* Pricing Teaser */}
        <div className="mb-4">
           <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mr-2">
             {t('pricingTeaser')} {/* Use t function */}
           </span>
           <a href="/pricing" className="text-sm text-primary underline hover:text-primary/80">
             {t('pricingLinkText')} {/* Use t function */}
           </a>
        </div>

        {/* Headline */}
        <motion.h1
          key={`headline-${currentLanguage}`} // Add key for animation on language change
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground leading-tight" // Use responsive text sizes
        >
          {t('headline')} {/* Use t function */}
        </motion.h1>

        {/* Subhead */}
        <motion.p
          key={`subhead-${currentLanguage}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
        >
          {t('subhead')} {/* Use t function */}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200">
            {t('ctaPrimary')} {/* Use t function */}
          </Button>
          <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200">
            {t('ctaSecondary')} {/* Use t function */}
          </Button>
        </motion.div>

        {/* Trust Bar */}
         <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="mt-12 text-sm text-muted-foreground flex justify-center items-center gap-2 flex-wrap"
          >
             <span>{t('trustText')}</span> {/* Use t function */}
             <span className="text-yellow-500 flex items-center">
                 ⭐⭐⭐⭐⭐
                 {/* Replace with actual rating logos/component if available */}
             </span>
         </motion.div>
      </div>
    </motion.section>
  );
}
