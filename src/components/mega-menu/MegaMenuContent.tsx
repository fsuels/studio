// src/components/mega-menu/MegaMenuContent.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import type { LegalDocument } from '@/lib/document-library'; // Use the re-exported type
import type { CategoryInfo } from '@/components/Step1DocumentSelector';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText } from 'lucide-react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { getDocTranslation } from '@/lib/i18nUtils'; // Import the utility

interface MegaMenuContentProps {
  categories: CategoryInfo[];
  documents: LegalDocument[]; // This will be the US documents by default if Header passes `documentLibrary`
  onLinkClick?: () => void;
  /**
   * Categories that should start expanded when the menu first opens.
   * The values should match the `CategoryInfo.key` entries.
   */
  defaultOpenCategories?: string[];
}

const MAX_DOCS_PER_CATEGORY_INITIAL = 5;

const MemoizedDocLink = React.memo(function DocLink({
  doc,
  locale,
  onClick,
  t,
}: {
  doc: LegalDocument;
  locale: 'en' | 'es';
  onClick?: () => void;
  t: (_key: string, _fallback?: string | object) => string;
}) {
  const translatedDoc = getDocTranslation(doc, locale); // Use utility
  const docName = translatedDoc.name;
  const docHref = `/${locale}/docs/${doc.id}`;

  return (
    <li className="md:px-0 md:py-0">
      <div className="block w-full text-left py-3.5 md:py-3 px-4 md:px-4 hover:bg-muted/40 active:bg-muted/60 min-h-[44px] md:min-h-0">
        <Link
          href={docHref}
          className="block text-base md:text-sm text-foreground md:text-muted-foreground font-medium md:font-normal hover:text-primary hover:underline transition-colors duration-150"
          onClick={onClick}
        >
          {t(docName, { defaultValue: docName })}
        </Link>
      </div>
    </li>
  );
});

export default function MegaMenuContent({
  categories,
  documents,
  onLinkClick,
  defaultOpenCategories = [],
}: MegaMenuContentProps) {
  const { t, i18n } = useTranslation('common');
  const tSimple = React.useCallback(
    (key: string, fallback?: string | object): string =>
      typeof fallback === 'string'
        ? (t(key, { defaultValue: fallback }) as string)
        : (t(key, fallback as Record<string, unknown>) as string),
    [t],
  );
  const currentLocale = i18n.language as 'en' | 'es';

  const getDocumentsForCategory = (categoryKey: string) => {
    const normalizedCategoryKey = categoryKey.trim().toLowerCase();
    return documents.filter(
      (doc) =>
        doc.category.trim().toLowerCase() === normalizedCategoryKey &&
        doc.id !== 'general-inquiry',
    );
  };

  const hasContent = categories.some(
    (category) => getDocumentsForCategory(category.key).length > 0,
  );

  const [openMap, setOpenMap] = React.useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    categories.forEach((cat) => {
      map[cat.key] = defaultOpenCategories.includes(cat.key);
    });
    return map;
  });

  const handleToggle = React.useCallback((key: string) => {
    setOpenMap((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  return (
    <ScrollArea className="w-full max-h-[calc(100vh-10rem-4rem)] md:max-h-[70vh] bg-popover text-popover-foreground rounded-b-lg">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-x-4 gap-y-8 p-4 md:p-6 min-h-[200px]">
        {categories.map((category, index) => {
          const categoryDocs = getDocumentsForCategory(category.key);
          const categoryLabel = t(category.labelKey, {
            defaultValue: category.key,
          });
          const highlight =
            category.key === 'Finance' || category.key === 'Business';
          const isOpen = openMap[category.key];
          return (
            <Accordion
              key={category.key}
              type="single"
              collapsible
              value={isOpen ? 'item' : undefined}
              onValueChange={() => handleToggle(category.key)}
              className={cn(index !== 0 && 'border-t mt-6 pt-6')}
            >
              <AccordionItem value="item" className="border-none">
                <AccordionTrigger
                  className={cn(
                    'font-semibold mb-2 text-sm md:text-base flex items-center border-b border-border pb-1.5',
                    highlight && 'text-primary',
                  )}
                >
                  {React.createElement(category.icon || FileText, {
                    className: 'mr-2 h-4 w-4 md:h-5 md:w-5 text-primary',
                  })}
                  {categoryLabel}
                </AccordionTrigger>
                <AccordionContent>
                  {categoryDocs.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">
                      {t('nav.noDocumentsInCategory', {
                        defaultValue: 'No documents in this category yet.',
                      })}
                    </p>
                  ) : (
                    <ul className="space-y-1.5">
                      {categoryDocs
                        .slice(0, MAX_DOCS_PER_CATEGORY_INITIAL)
                        .map((doc) => (
                          <MemoizedDocLink
                            key={`${category.key}-${doc.id}`}
                            doc={doc}
                            locale={currentLocale}
                            onClick={onLinkClick}
                            t={tSimple}
                          />
                        ))}
                      {categoryDocs.length > MAX_DOCS_PER_CATEGORY_INITIAL && (
                        <li>
                          <Link
                            href={`/${currentLocale}/?category=${encodeURIComponent(category.key)}#workflow-start`}
                            className="text-xs md:text-sm text-primary font-medium hover:underline mt-1 inline-block"
                            onClick={onLinkClick}
                          >
                            {t('nav.seeMoreDocuments', {
                              defaultValue: 'See all in {{categoryName}}...',
                              categoryName: categoryLabel,
                            })}
                          </Link>
                        </li>
                      )}
                    </ul>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        })}
        {!hasContent && categories.length > 0 && (
          <div className="col-span-full text-center text-muted-foreground py-8">
            <p>
              {t('nav.noDocumentsAvailable', {
                defaultValue:
                  'No documents available for the selected categories at this time.',
              })}
            </p>
          </div>
        )}
        {categories.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-8">
            <p>
              {t('nav.noCategoriesAvailable', {
                defaultValue: 'No document categories available.',
              })}
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
