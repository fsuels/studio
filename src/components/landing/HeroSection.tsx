// src/components/landing/HeroSection.tsx
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion'; // For animations
import Image from 'next/image';
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
  const [language, setLanguage] = useState<'EN' | 'ES'>('EN');

  const handleLanguageChange = (lang: 'EN' | 'ES') => {
    setLanguage(lang);
    // Add actual i18n logic here
    console.log(`Language switched to ${lang}`);
  };

  const textContent = {
    EN: {
      headline: "Legal Docs at Your Fingertips",
      subhead: "Create, sign & share professional contracts in minutes—no lawyer required.",
      ctaPrimary: "Get Started – It’s Free",
      ctaSecondary: "See Demo",
      trustText: "Trusted by 2,000+ small businesses",
      pricingTeaser: "Only $5/doc – No subscriptions",
      pricingLinkText: "View Pricing",
      languageName: "English",
    },
    ES: {
      headline: "Documentos Legales al Alcance de tu Mano",
      subhead: "Crea, firma y comparte contratos profesionales en minutos, sin necesidad de abogado.",
      ctaPrimary: "Comienza Gratis",
      ctaSecondary: "Ver Demo",
      trustText: "Con la confianza de más de 2,000 pequeñas empresas",
      pricingTeaser: "Solo $5/doc – Sin suscripciones",
      pricingLinkText: "Ver Precios",
      languageName: "Español",
    },
  };

  const currentText = textContent[language];

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
              {language === 'EN' ? <FlagEN /> : <FlagES />}
              {language}
              <ChevronDown className="ml-1 h-4 w-4 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[8rem]">
            <DropdownMenuItem
               onSelect={() => handleLanguageChange('EN')}
               className={`text-xs ${language === 'EN' ? 'font-medium text-primary' : ''}`}
            >
               <FlagEN /> English {language === 'EN' && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem
               onSelect={() => handleLanguageChange('ES')}
               className={`text-xs ${language === 'ES' ? 'font-medium text-primary' : ''}`}
            >
               <FlagES /> Español {language === 'ES' && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>


      <div className="container mx-auto px-4 relative z-0 pt-12 md:pt-0"> {/* Added padding top for small screens to avoid overlap */}
        {/* Pricing Teaser */}
        <div className="mb-4">
           <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mr-2">
             {currentText.pricingTeaser}
           </span>
           <a href="/pricing" className="text-sm text-primary underline hover:text-primary/80">
             {currentText.pricingLinkText}
           </a>
        </div>

        {/* Headline */}
        <motion.h1
          key={`headline-${language}`} // Add key for animation on language change
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground leading-tight" // Use responsive text sizes
        >
          {currentText.headline}
        </motion.h1>

        {/* Subhead */}
        <motion.p
          key={`subhead-${language}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
        >
          {currentText.subhead}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200">
            {currentText.ctaPrimary}
          </Button>
          <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200">
            {currentText.ctaSecondary}
          </Button>
        </motion.div>

        {/* Trust Bar */}
         <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="mt-12 text-sm text-muted-foreground flex justify-center items-center gap-2 flex-wrap"
          >
             <span>{currentText.trustText}</span>
             <span className="text-yellow-500 flex items-center">
                 ⭐⭐⭐⭐⭐
                 {/* Replace with actual rating logos/component if available */}
             </span>
         </motion.div>
      </div>
    </motion.section>
  );
}
