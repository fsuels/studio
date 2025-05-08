// src/components/landing/HomepageHeroSteps.tsx
'use client'

import React, { useState, useEffect } from 'react'; // Import React, useState, useEffect
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { CheckCircle, ShieldCheck, Rocket } from 'lucide-react'
import { motion } from 'framer-motion'; 
import Link from 'next/link'; 


export default function HomepageHeroSteps() {
  const { t, i18n } = useTranslation()
  const [isHydrated, setIsHydrated] = useState(false); 
  
  useEffect(() => {
    setIsHydrated(true);
  }, []); 

  const placeholderText = "..."; // Placeholder for text before hydration

  return (
    <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full py-16 md:py-24 px-4 text-center relative overflow-hidden"
        style={{
            background: 'linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(var(--background)) 50%, hsl(var(--accent)) 100%)',
        }}
    >
        <div className="relative z-0 pt-0 md:pt-0">
           <div className="mb-4">
              <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mr-2">
                {isHydrated ? t('pricingTeaser', { defaultValue: 'Only $5/doc – No subscriptions' }) : placeholderText}
              </span>
              <Link href="/pricing" className="text-sm text-primary underline hover:text-primary/80">
                {isHydrated ? t('pricingLinkText', { defaultValue: 'View Pricing' }) : placeholderText}
              </Link>
           </div>

            <motion.h1
                key={`headline-${i18n.language}`} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isHydrated ? 1 : 0, y: isHydrated ? 0 : 10 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground leading-tight"
            >
                {isHydrated ? t('home.hero.title', { defaultValue: 'Only 3 Easy Steps' }) : placeholderText}
            </motion.h1>
            <motion.p
                key={`subhead-${i18n.language}`} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isHydrated ? 1 : 0, y: isHydrated ? 0 : 10 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12"
            >
                {isHydrated ? t('home.hero.subtitle', { defaultValue: 'In a few guided steps, you’ll generate a fully customized legal document.'}) : placeholderText}
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-card p-6 rounded-xl shadow-md text-center border border-border"
                >
                    <Rocket className="mx-auto text-primary mb-3" size={32} />
                    <h3 className="text-lg font-semibold mb-1 text-card-foreground">{isHydrated ? t('home.steps.step1.title', { defaultValue: 'Describe Situation' }) : placeholderText}</h3>
                    <p className="text-muted-foreground text-sm">{isHydrated ? t('home.steps.step1.desc', { defaultValue: 'Give a quick summary. Text or mic supported.' }) : placeholderText}</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-card p-6 rounded-xl shadow-md text-center border border-border"
                >
                    <ShieldCheck className="mx-auto text-primary mb-3" size={32} />
                    <h3 className="text-lg font-semibold mb-1 text-card-foreground">{isHydrated ? t('home.steps.step2.title', { defaultValue: 'Answer Simple Prompts' }) : placeholderText}</h3>
                    <p className="text-muted-foreground text-sm">{isHydrated ? t('home.steps.step2.desc', { defaultValue: 'AI will guide you through the exact info needed.' }) : placeholderText}</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="bg-card p-6 rounded-xl shadow-md text-center border border-border"
                >
                    <CheckCircle className="mx-auto text-primary mb-3" size={32} />
                    <h3 className="text-lg font-semibold mb-1 text-card-foreground">{isHydrated ? t('home.steps.step3.title', { defaultValue: 'Finalize & Sign' }) : placeholderText}</h3>
                    <p className="text-muted-foreground text-sm">{isHydrated ? t('home.steps.step3.desc', { defaultValue: 'Download, sign, or securely share your document.' }) : placeholderText}</p>
                </motion.div>
            </div>

             <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isHydrated ? 1 : 0, y: isHydrated ? 0 : 10 }}
                transition={{ duration: 0.3, delay: 0.6 }}
             >
                <Button
                    asChild
                    size="lg"
                    className="text-lg px-8 py-4 bg-accent hover:bg-accent/90 text-accent-foreground shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    disabled={!isHydrated} 
                >
                  <Link href="/#workflow-start">{isHydrated ? t('home.cta.startNow', { defaultValue: 'Start for Free' }) : placeholderText}</Link>
                </Button>
             </motion.div>
        </div>
    </motion.section>
  )
}
