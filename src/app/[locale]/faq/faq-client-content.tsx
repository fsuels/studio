// src/app/[locale]/faq/faq-client-content.tsx
'use client'

import { useState, useEffect } from 'react' 
import { useTranslation } from 'react-i18next'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion" 
import React from 'react'; 

interface FaqClientContentProps {
  locale: 'en' | 'es'; // Included for consistency, though useTranslation handles locale
}

export default function FaqClientContent({ locale }: FaqClientContentProps) {
  const { t } = useTranslation("common")
  const [isHydrated, setIsHydrated] = useState(false); 

  useEffect(() => {
    setIsHydrated(true); 
  }, []);

  const questions = Array.from({ length: 6 }, (_, i) => i + 1)

  const placeholderTitle = "Frequently Asked Questions";
  const placeholderSubtitle = "Find answers to common questions below.";
  const placeholderQuestion = "Loading question...";
  const placeholderAnswer = "Loading answer...";

  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold text-center mb-8 text-foreground">
          {isHydrated ? t('faq.title', placeholderTitle) : placeholderTitle}
      </h1>
      <p className="text-lg text-muted-foreground text-center mb-12">
          {isHydrated ? t('faq.subtitle', placeholderSubtitle) : placeholderSubtitle}
      </p>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {questions.map((n) => (
          <AccordionItem key={n} value={`item-${n}`} className="bg-card border border-border rounded-lg shadow-sm px-4">
            <AccordionTrigger className="text-left font-semibold text-lg text-card-foreground hover:no-underline">
                {isHydrated ? t(`faq.q${n}.question`, placeholderQuestion) : placeholderQuestion}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pt-1 pb-4">
                 {isHydrated ? t(`faq.q${n}.answer`, placeholderAnswer) : placeholderAnswer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  )
}
