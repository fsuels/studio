// src/components/docs/PromissoryNoteDisplay.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCart } from "@/contexts/CartProvider";
import { track } from "@/lib/analytics";
import { useTranslation } from 'react-i18next';

interface PromissoryNoteDisplayProps {
  locale: "en" | "es";
}

export default function PromissoryNoteDisplay({ locale }: PromissoryNoteDisplayProps) {
  const { t, i18n } = useTranslation('doc_promissory_note');
  const router = useRouter();
  const { addItem } = useCart();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale, i18n]);

  const handleStartProcess = () => {
    if (!isHydrated) return;
    const itemName = t('pageTitle', { defaultValue: 'Promissory Note Template & How-To Guide | 123LegalDoc' });
    const priceCents = 500;
    track("add_to_cart", { item_id: "promissory-note", item_name: itemName, value: priceCents / 100, currency: "USD" });
    addItem({ id: "promissory-note", type: "doc", name: itemName, price: priceCents });
    router.push(`/${locale}/docs/promissory-note/start`);
  };

  const informationalSections = [
    { id: 'what-is', titleKey: 'sections.whatIs.title', contentKey: 'sections.whatIs.content', type: 'list' },
    { id: 'when-to-use', titleKey: 'sections.whenToUse.title', tableKey: 'sections.whenToUse.table', type: 'table' },
    { id: 'varieties', titleKey: 'sections.varieties.title', contentKey: 'sections.varieties.content', type: 'list' },
    { id: 'clauses', titleKey: 'sections.clauses.title', tableKey: 'sections.clauses.table', type: 'table' },
    { id: 'how-to-complete', titleKey: 'sections.howToComplete.title', itemsKey: 'sections.howToComplete.items', totalTimeKey: 'sections.howToComplete.totalTime', type: 'ordered-list' },
    { id: 'state-rules', titleKey: 'sections.stateRules.title', contentKey: 'sections.stateRules.content', type: 'paragraph' },
    { id: 'checklist', titleKey: 'sections.checklist.title', itemsKey: 'sections.checklist.items', printNoteKey: 'sections.checklist.printNote', type: 'checklist' },
    { id: 'supporting-docs', titleKey: 'sections.supportingDocs.title', itemsKey: 'sections.supportingDocs.items', type: 'list' },
    { id: 'why-us', titleKey: 'sections.whyUs.title', itemsKey: 'sections.whyUs.items', ctaKey: 'sections.whyUs.cta', type: 'list-cta' },
  ];

  const faqItems = [
    { id: 'faq1', titleKey: 'faq.q1.question', contentKey: 'faq.q1.answer', type: 'paragraph' },
    { id: 'faq2', titleKey: 'faq.q2.question', contentKey: 'faq.q2.answer', type: 'paragraph' },
    { id: 'faq3', titleKey: 'faq.q3.question', contentKey: 'faq.q3.answer', type: 'paragraph' },
    { id: 'faq4', titleKey: 'faq.q4.question', contentKey: 'faq.q4.answer', type: 'paragraph' },
    { id: 'faq5', titleKey: 'faq.q5.question', contentKey: 'faq.q5.answer', type: 'paragraph' },
  ];

  const allSections = [...informationalSections, ...faqItems];

  const renderSectionContent = (section: typeof allSections[0]) => {
    if (section.type === 'paragraph' && section.contentKey) {
      return <p className="text-muted-foreground">{t(section.contentKey)}</p>;
    }
    if ((section.type === 'list' || section.type === 'checklist') && section.itemsKey) {
      const items = t(section.itemsKey, { returnObjects: true });
      if (Array.isArray(items)) {
        return (
          <>
            <ul className={`${section.type === 'checklist' ? 'list-none pl-0' : 'list-disc list-outside pl-5'} space-y-1 text-muted-foreground`}>
              {items.map((item: string, i: number) => (
                <li key={i} className={section.type === 'checklist' ? 'flex items-center' : ''}>
                  {section.type === 'checklist' && <span className="mr-2">✓</span>}
                  {item}
                </li>
              ))}
            </ul>
            {section.type === 'checklist' && (section as any).printNoteKey && <p className="text-sm text-muted-foreground mt-2 italic">{t((section as any).printNoteKey)}</p>}
          </>
        );
      }
    }
     if (section.type === 'ordered-list' && section.itemsKey) {
      const items = t(section.itemsKey, { returnObjects: true });
      if (Array.isArray(items)) {
        return (
          <>
            <ol className="list-decimal list-outside pl-5 space-y-1 text-muted-foreground">
              {items.map((item: string, i: number) => <li key={i}>{item}</li>)}
            </ol>
            {(section as any).totalTimeKey && <p className="text-sm text-muted-foreground mt-2">{t((section as any).totalTimeKey)}</p>}
          </>
        );
      }
    }
    if (section.tableKey) {
      const headers = t(`${section.tableKey}.headers`, { returnObjects: true });
      const rows = t(`${section.tableKey}.rows`, { returnObjects: true });
      return (
        <div className="overflow-x-auto my-4">
          <Table className="min-w-full text-sm">
            <TableHeader>
              <TableRow>
                {Array.isArray(headers) && headers.map((header: string) => <TableHead key={header} className="text-foreground bg-muted/50">{header}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(rows) && rows.map((row: string[], rowIndex: number) => (
                <TableRow key={rowIndex}>
                  {Array.isArray(row) && row.map((cell, cellIndex) => <TableCell key={cellIndex} className="text-muted-foreground">{cell}</TableCell>)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    }
     if (section.type === 'list-cta' && section.itemsKey && (section as any).ctaKey) {
      const items = t(section.itemsKey, { returnObjects: true });
      if (Array.isArray(items)) {
        return (
          <>
            <ul className="list-disc list-outside pl-5 space-y-1 text-muted-foreground">
              {items.map((item: string, i: number) => <li key={i}>{item}</li>)}
            </ul>
            <p className="text-muted-foreground mt-4">{t((section as any).ctaKey)}</p>
          </>
        );
      }
    }
    // Fallback for section.contentKey if other types didn't match or had missing sub-keys
    if (section.contentKey) {
        return <p className="text-muted-foreground">{t(section.contentKey)}</p>;
    }
    return null;
  };


  if (!isHydrated) {
    return <div className="container mx-auto px-4 py-12 animate-pulse"><div className="h-12 bg-muted rounded w-3/4 mx-auto mb-6"></div><div className="h-8 bg-muted rounded w-1/2 mx-auto mb-10"></div><div className="space-y-4"><div className="h-48 bg-muted rounded"></div><div className="h-64 bg-muted rounded"></div><div className="h-32 bg-muted rounded"></div></div></div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{t('pageTitle')}</h1>
        <p className="text-lg text-muted-foreground">{t('pageSubtitle')}</p>
      </header>
      
      <Accordion type="single" collapsible className="w-full space-y-4 mb-10">
        {allSections.map((section) => (
          <AccordionItem
            key={section.id}
            value={section.id}
            className="border border-border rounded-lg bg-card shadow-md"
          >
            <AccordionTrigger className="px-6 py-4 text-left font-semibold text-foreground hover:no-underline text-md md:text-lg">
              {t(section.titleKey)}
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 pt-0 text-muted-foreground">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {renderSectionContent(section)}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <section className="text-center py-8 bg-secondary/30 rounded-lg border border-border">
        <h2 className="text-2xl font-semibold text-foreground mb-3">{t('finalCtaTitle')}</h2>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">{t('finalCtaSubtitle')}</p>
        <Button onClick={handleStartProcess} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          {t('startMyPromissoryNoteButton')}
        </Button>
      </section>
    </div>
  );
}
