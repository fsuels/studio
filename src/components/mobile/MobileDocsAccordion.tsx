'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import type { LegalDocument } from '@/lib/document-library';
import type { CategoryInfo } from '@/components/workflow/Step1DocumentSelector';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { getDocTranslation } from '@/lib/i18nUtils';

interface MobileDocsAccordionProps {
  categories: CategoryInfo[];
  documents: LegalDocument[];
  onLinkClick?: () => void;
}

export default function MobileDocsAccordion({
  categories,
  documents,
  onLinkClick,
}: MobileDocsAccordionProps) {
  const { t, i18n } = useTranslation('common');
  const locale = i18n.language as 'en' | 'es';
  const [openKey, setOpenKey] = React.useState<string | null>(null);

  const toggle = (key: string) =>
    setOpenKey((prev) => (prev === key ? null : key));

  const docsForCategory = (key: string) =>
    documents.filter(
      (doc) =>
        doc.category.trim().toLowerCase() === key.trim().toLowerCase() &&
        doc.id !== 'general-inquiry',
    );

  return (
    <div className="divide-y border-t border-gray-200">
      {(categories || []).map((cat) => {
        const docs = docsForCategory(cat.key);
        if (docs.length === 0) return null;
        const label = t(cat.labelKey, { defaultValue: cat.key });
        const isOpen = openKey === cat.key;
        return (
          <Accordion
            key={cat.key}
            type="single"
            collapsible
            value={isOpen ? 'open' : ''}
            onValueChange={() => toggle(cat.key)}
          >
            <AccordionItem value="open" className="border-none">
              <AccordionTrigger className="w-full flex justify-between items-center px-4 py-3 text-base font-medium text-gray-900 border-t border-gray-200">
                <span className="flex items-center gap-2">
                  {cat.key === 'finance' && '💰'}
                  {cat.key === 'business' && '🏢'}
                  {cat.key === 'real-estate' && '🏠'}
                  {cat.key === 'family' && '👨‍👩‍👧‍👦'}
                  {label}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pl-6 pr-4 pb-2">
                <ul>
                  {docs.map((doc) => {
                    const translated = getDocTranslation(doc, locale);
                    return (
                      <li key={doc.id}>
                        <Link
                          href={`/${locale}/docs/${doc.id}`}
                          className="block py-2 text-primary-600 hover:underline"
                          onClick={onLinkClick}
                        >
                          {translated.name}
                        </Link>
                      </li>
                    );
                  })}
                  <li>
                    <Link
                      href={`/${locale}/?category=${encodeURIComponent(cat.key)}#workflow-start`}
                      className="block mt-2 text-sm italic text-gray-500"
                      onClick={onLinkClick}
                    >
                      {t('nav.seeMoreDocuments', {
                        defaultValue: 'See all in {{categoryName}}...',
                        categoryName: label,
                      })}
                    </Link>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      })}
    </div>
  );
}
