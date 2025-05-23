// src/components/docs/VehicleBillOfSaleDisplay.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { track } from '@/lib/analytics'; // Assuming track function exists
import { useCart } from '@/contexts/CartProvider'; // Assuming useCart hook exists

interface VehicleBillOfSaleDisplayProps {
  locale: 'en' | 'es';
}

export default function VehicleBillOfSaleDisplay({ locale }: VehicleBillOfSaleDisplayProps) {
  const { t, i18n } = useTranslation('doc_bill_of_sale_vehicle');
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
    const itemName = t('metaTitle', { defaultValue: 'Vehicle Bill of Sale' });
    const priceCents = 1995;
    track('add_to_cart', { item_id: 'bill-of-sale-vehicle', item_name: itemName, value: priceCents / 100, currency: 'USD' });
    addItem({ id: 'bill-of-sale-vehicle', type: 'doc', name: itemName, price: priceCents });
    router.push(`/${locale}/#workflow-start?docId=bill-of-sale-vehicle`);
  };

  const sections = [
    { id: "what-is", titleKey: "sections.whatIs.title", contentKey: "sections.whatIs.content", type: "list" },
    { id: "why", titleKey: "sections.why.title", tableKey: "sections.why.table", type: "table" },
    { id: "covered", titleKey: "sections.covered.title", contentKey: "sections.covered.content", type: "paragraph" },
    { id: "types", titleKey: "sections.types.title", itemsKey: "sections.types.items", type: "list" },
    { id: "components", titleKey: "sections.components.title", tableKey: "sections.components.table", type: "table" },
    { id: "how-to", titleKey: "sections.howTo.title", itemsKey: "sections.howTo.items", totalTimeKey: "sections.howTo.totalTime", type: "ordered-list" },
    { id: "state-rules", titleKey: "sections.stateRules.title", contentKey: "sections.stateRules.content", itemsKey: "sections.stateRules.items", type: "mixed-list" },
    { id: "checklist", titleKey: "sections.checklist.title", itemsKey: "sections.checklist.items", printNoteKey: "sections.checklist.printNote", type: "checklist" },
    { id: "supporting", titleKey: "sections.supporting.title", itemsKey: "sections.supporting.items", type: "list" },
    { id: "why-us", titleKey: "sections.whyUs.title", itemsKey: "sections.whyUs.items", ctaKey: "sections.whyUs.cta", type: "list-cta" }
  ];

  const faqItems = [
    { id: "q1", questionKey: "faq.q1.question", answerKey: "faq.q1.answer" },
    { id: "q2", questionKey: "faq.q2.question", answerKey: "faq.q2.answer" },
    { id: "q3", questionKey: "faq.q3.question", answerKey: "faq.q3.answer" },
    { id: "q4", questionKey: "faq.q4.question", answerKey: "faq.q4.answer" },
    { id: "q5", questionKey: "faq.q5.question", answerKey: "faq.q5.answer" }
  ];

  if (!isHydrated) {
    return <div className="container mx-auto px-4 py-12 animate-pulse"><div className="h-12 bg-muted rounded w-3/4 mx-auto mb-6"></div><div className="h-8 bg-muted rounded w-1/2 mx-auto mb-10"></div><div className="space-y-8"><div className="h-48 bg-muted rounded"></div><div className="h-64 bg-muted rounded"></div><div className="h-32 bg-muted rounded"></div></div></div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <article className="prose dark:prose-invert max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{t('pageTitle')}</h1>
          <p className="text-lg text-muted-foreground">{t('pageSubtitle')}</p>
        </header>

        {/* Removed Table of Contents section */}

        {sections.map((section, index) => (
          <section key={section.id} id={section.id} className="mb-10 scroll-mt-20">
            <h2 className="text-2xl font-semibold text-foreground mb-4 border-b border-border pb-2">{t(section.titleKey)}</h2>
            {section.type === "paragraph" && section.contentKey && <p className="text-muted-foreground">{t(section.contentKey)}</p>}
            
            {section.type === "list" && section.contentKey && Array.isArray(t(section.contentKey, { returnObjects: true })) && (
              <ul className="list-disc list-outside pl-5 space-y-1 text-muted-foreground">
                {(t(section.contentKey, { returnObjects: true }) as string[]).map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            )}
             {section.type === "list" && section.itemsKey && Array.isArray(t(section.itemsKey, { returnObjects: true })) && (
              <ul className="list-disc list-outside pl-5 space-y-1 text-muted-foreground">
                {(t(section.itemsKey, { returnObjects: true }) as string[]).map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            )}
            {section.type === "ordered-list" && section.itemsKey && Array.isArray(t(section.itemsKey, { returnObjects: true })) && (
              <ol className="list-decimal list-outside pl-5 space-y-1 text-muted-foreground">
                {(t(section.itemsKey, { returnObjects: true }) as string[]).map((item, i) => <li key={i}>{item}</li>)}
              </ol>
            )}
            {section.type === "mixed-list" && section.contentKey && section.itemsKey && (
              <>
                <p className="text-muted-foreground mb-2">{t(section.contentKey)}</p>
                {Array.isArray(t(section.itemsKey, { returnObjects: true })) && (
                    <ul className="list-disc list-outside pl-5 space-y-1 text-muted-foreground">
                        {(t(section.itemsKey, { returnObjects: true }) as string[]).map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                )}
              </>
            )}
            {section.type === "checklist" && section.itemsKey && Array.isArray(t(section.itemsKey, { returnObjects: true })) && (
                <ul className="list-none pl-0 space-y-1 text-muted-foreground">
                    {(t(section.itemsKey, { returnObjects: true }) as string[]).map((item, i) => <li key={i} className="flex items-center"><span className="mr-2">✓</span>{item}</li>)}
                </ul>
            )}
            {section.tableKey && (
              <div className="overflow-x-auto">
                <Table className="my-4 text-sm">
                  <TableHeader>
                    <TableRow>
                      {Array.isArray(t(`${section.tableKey}.headers`, { returnObjects: true })) && 
                        (t(`${section.tableKey}.headers`, { returnObjects: true }) as string[]).map(header => <TableHead key={header} className="text-foreground">{header}</TableHead>)}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(t(`${section.tableKey}.rows`, { returnObjects: true })) && 
                        (t(`${section.tableKey}.rows`, { returnObjects: true }) as string[][]).map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {row.map((cell, cellIndex) => <TableCell key={cellIndex} className="text-muted-foreground">{cell}</TableCell>)}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            {section.totalTimeKey && <p className="text-sm text-muted-foreground mt-2">{t(section.totalTimeKey)}</p>}
            {section.printNoteKey && <p className="text-sm text-muted-foreground mt-2 italic">{t(section.printNoteKey)}</p>}
            {section.ctaKey && <p className="text-muted-foreground mt-4">{t(section.ctaKey)}</p>}
             {section.id === 'why-us' && (
              <div className="mt-6">
                <Button onClick={handleStartProcess} size="lg">{t('startMyBillOfSaleButton')}</Button>
              </div>
            )}
          </section>
        ))}

        <section id="faq" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-semibold text-foreground mb-6 border-b border-border pb-2">{t('faq.title')}</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="border-b border-border">
                <AccordionTrigger className="text-left hover:no-underline text-foreground py-4">
                  {t(item.questionKey)}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4 pt-0">
                  {t(item.answerKey)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="text-center py-8 bg-secondary/30 rounded-lg border border-border">
          <h2 className="text-2xl font-semibold text-foreground mb-3">{t('finalCtaTitle')}</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">{t('finalCtaSubtitle')}</p>
          <Button onClick={handleStartProcess} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {t('startMyBillOfSaleButton')}
          </Button>
        </section>
      </article>
    </div>
  );
}
