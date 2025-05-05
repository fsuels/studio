// src/components/landing/HomepageHeroSteps.tsx
'use client'

import { useState, useEffect } from 'react'; // Import hooks
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { CheckCircle, ShieldCheck, Rocket } from 'lucide-react'
import { motion } from 'framer-motion'; // Import motion
import Link from 'next/link'; // Import Link
// Removed Logo import as it's handled in the Header
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Import Dropdown
import { Check, ChevronDown } from 'lucide-react'; // Icons for dropdown

// Example Language Switcher Flags
const FlagEN = () => <span className="mr-2 text-xs" role="img" aria-label="UK Flag">🇬🇧</span>;
const FlagES = () => <span className="mr-2 text-xs" role="img" aria-label="Spain Flag">🇪🇸</span>;


export default function HomepageHeroSteps() {
  const { t, i18n } = useTranslation()
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

  const scrollToWorkflow = () => {
    const workflowSection = document.getElementById('workflow-start');
    if (workflowSection) {
      workflowSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
       console.warn('Workflow section with id "workflow-start" not found.');
       window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Placeholder text while hydrating
  const placeholderText = "...";

  return (
    <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full py-16 md:py-24 px-4 text-center relative overflow-hidden"
        style={{
            background: 'linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(var(--background)) 50%, hsl(180, 50%, 85%) 100%)',
        }}
    >
        {/* Removed Logo - It's now in the Header */}

        {/* Language Switcher - Moved to Header */}
        {/* <div className="absolute top-4 right-4 z-10">...</div> */}

        {/* Main Content */}
        <div className="relative z-0 pt-0 md:pt-0"> {/* Adjusted padding */}
           {/* Pricing Teaser */}
           <div className="mb-4">
              <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mr-2">
                {isHydrated ? t('pricingTeaser') : placeholderText}
              </span>
              <Link href="/pricing" className="text-sm text-primary underline hover:text-primary/80">
                {isHydrated ? t('pricingLinkText') : placeholderText}
              </Link>
           </div>

            <motion.h1
                key={`headline-${currentLanguage}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isHydrated ? 1 : 0, y: isHydrated ? 0 : 10 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground leading-tight"
            >
                {isHydrated ? t('home.hero.title') : placeholderText}
            </motion.h1>
            <motion.p
                key={`subhead-${currentLanguage}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isHydrated ? 1 : 0, y: isHydrated ? 0 : 10 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12"
            >
                {isHydrated ? t('home.hero.subtitle') : placeholderText}
            </motion.p>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-card p-6 rounded-xl shadow-md text-center border border-border"
                >
                    <Rocket className="mx-auto text-primary mb-3" size={32} />
                    <h3 className="text-lg font-semibold mb-1 text-card-foreground">{isHydrated ? t('home.steps.step1.title') : placeholderText}</h3>
                    <p className="text-muted-foreground text-sm">{isHydrated ? t('home.steps.step1.desc') : placeholderText}</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-card p-6 rounded-xl shadow-md text-center border border-border"
                >
                    <ShieldCheck className="mx-auto text-primary mb-3" size={32} />
                    <h3 className="text-lg font-semibold mb-1 text-card-foreground">{isHydrated ? t('home.steps.step2.title') : placeholderText}</h3>
                    <p className="text-muted-foreground text-sm">{isHydrated ? t('home.steps.step2.desc') : placeholderText}</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="bg-card p-6 rounded-xl shadow-md text-center border border-border"
                >
                    <CheckCircle className="mx-auto text-primary mb-3" size={32} />
                    <h3 className="text-lg font-semibold mb-1 text-card-foreground">{isHydrated ? t('home.steps.step3.title') : placeholderText}</h3>
                    <p className="text-muted-foreground text-sm">{isHydrated ? t('home.steps.step3.desc') : placeholderText}</p>
                </motion.div>
            </div>

            {/* CTA Button */}
             <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isHydrated ? 1 : 0, y: isHydrated ? 0 : 10 }}
                transition={{ duration: 0.3, delay: 0.6 }}
             >
                <Button
                    size="lg"
                    className="text-lg px-8 py-4 bg-accent hover:bg-accent/90 text-accent-foreground shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    onClick={scrollToWorkflow}
                >
                    {isHydrated ? t('home.cta.startNow') : placeholderText}
                </Button>
             </motion.div>

             {/* Removed the duplicate Trust Bar */}

        </div>
    </motion.section>
  )
}
