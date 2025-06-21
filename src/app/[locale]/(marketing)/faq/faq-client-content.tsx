// src/app/[locale]/faq/faq-client-content.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import React from 'react';

interface FaqClientContentProps {
  locale: 'en' | 'es'; // Included for consistency, though useTranslation handles locale
}

export default function FaqClientContent({ locale }: FaqClientContentProps) {
  const { t, i18n } = useTranslation(['faq', 'common']);
  const [isHydrated, setIsHydrated] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setIsHydrated(true);
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale, i18n]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, []);

  const placeholderTitle = 'Frequently Asked Questions';
  const placeholderSubtitle = 'Find answers to common questions below.';
  const placeholderQuestion = 'Loading question...';
  const placeholderAnswer = 'Loading answer...';

  const questions = Array.from({ length: 6 }, (_, i) => i + 1);

  const faqItems = questions.map((n) => ({
    id: `item-${n}`,
    question: isHydrated
      ? t(`faq.q${n}.question`, placeholderQuestion)
      : placeholderQuestion,
    answer: isHydrated
      ? t(`faq.q${n}.answer`, placeholderAnswer)
      : placeholderAnswer,
  }));

  const filteredFaqs = faqItems.filter((f) =>
    f.question.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold text-center mb-8 text-foreground">
        {isHydrated ? t('faq.title', placeholderTitle) : placeholderTitle}
      </h1>
      <p className="text-lg text-muted-foreground text-center mb-12">
        {isHydrated
          ? t('faq.subtitle', placeholderSubtitle)
          : placeholderSubtitle}
      </p>

      <input
        type="search"
        placeholder="Search FAQs..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        ref={inputRef}
        onFocus={() => window.innerWidth < 640 && inputRef.current?.select()}
        className="mb-4 w-full rounded-md border px-3 py-2"
      />
      <Accordion
        type="multiple"
        collapsible="true"
        defaultValue={faqItems.slice(0, 3).map((f) => f.id)}
        className="w-full space-y-4"
      >
        {filteredFaqs.map((f) => (
          <AccordionItem
            key={f.id}
            value={f.id}
            className="bg-card border border-border rounded-lg shadow-sm px-4"
          >
            <AccordionTrigger className="text-left font-semibold text-lg text-card-foreground hover:no-underline">
              {f.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pt-1 pb-4">
              {f.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
}
