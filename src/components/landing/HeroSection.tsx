// src/components/landing/HeroSection.tsx
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion'; // For animations
import Image from 'next/image';

// Example Language Switcher Flags (replace with actual flag SVGs or images)
const FlagEN = () => <span role="img" aria-label="English Flag" className="text-xl mr-1">🇬🇧</span>;
const FlagES = () => <span role="img" aria-label="Spanish Flag" className="text-xl mr-1">🇪🇸</span>;

export function HeroSection() {
  const [language, setLanguage] = useState<'EN' | 'ES'>('EN');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'EN' ? 'ES' : 'EN');
    // Add actual i18n logic here
    console.log(`Language switched to ${language === 'EN' ? 'ES' : 'EN'}`);
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
    },
    ES: {
      headline: "Documentos Legales al Alcance de tu Mano",
      subhead: "Crea, firma y comparte contratos profesionales en minutos, sin necesidad de abogado.",
      ctaPrimary: "Comienza Gratis",
      ctaSecondary: "Ver Demo",
      trustText: "Con la confianza de más de 2,000 pequeñas empresas",
      pricingTeaser: "Solo $5/doc – Sin suscripciones",
      pricingLinkText: "Ver Precios",
    },
  };

  const currentText = textContent[language];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full py-20 md:py-32 bg-gradient-to-br from-teal-100 via-blue-100 to-soft-blue-100 text-center relative overflow-hidden" // Use theme colors if defined, otherwise fallback
      style={{
          // Example inline SVG background pattern
         // backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23008080' fill-opacity='0.07'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          // Soft blue gradient fallback
          background: 'linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(var(--background)) 50%, hsl(180, 50%, 85%) 100%)', // Using HSL theme vars
      }}
    >
      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLanguage}
          className="text-xs font-medium text-foreground/80 hover:bg-foreground/10 px-2 py-1"
          aria-label={`Switch language to ${language === 'EN' ? 'Spanish' : 'English'}`}
        >
          {language === 'EN' ? <FlagEN /> : <FlagES />}
          {language}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-3 w-3"><path d="m6 9 6 6 6-6"/></svg>
        </Button>
      </div>

      <div className="container mx-auto px-4 relative z-0">
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
