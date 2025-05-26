// src/components/mega-menu/MegaMenuContent.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import type { LegalDocument } from '@/lib/document-library'; // Use the re-exported type
import type { CategoryInfo } from '@/components/Step1DocumentSelector'; 
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText } from 'lucide-react';
import { getDocTranslation } from '@/lib/i18nUtils'; // Import the utility

interface MegaMenuContentProps {
  categories: CategoryInfo[];
  documents: LegalDocument[]; // This will be the US documents by default if Header passes `documentLibrary`
  onLinkClick?: () => void; 
}

const MAX_DOCS_PER_CATEGORY_INITIAL = 5;

const MemoizedDocLink = React.memo(function DocLink({ doc, locale, onClick, t }: { doc: LegalDocument; locale: 'en' | 'es'; onClick?: () => void; t: (key: string, fallback?: string | object) => string; }) {
  const translatedDoc = getDocTranslation(doc, locale); // Use utility
  const docName = translatedDoc.name;
  const docHref = `/${locale}/docs/${doc.id}`;
  
  return (
    <li>
      <Link 
        href={docHref} 
        className="text-xs md:text-sm text-muted-foreground hover:text-primary hover:underline transition-colors duration-150 block py-0.5"
        onClick={onClick}
      >
        {t(docName, {defaultValue: docName})}
      </Link>
    </li>
  );
});

export default function MegaMenuContent({ categories, documents, onLinkClick }: MegaMenuContentProps) {
  const { t, i18n } = useTranslation("common");
  const tSimple = React.useCallback(
    (key: string, fallback?: string | object): string =>
      typeof fallback === 'string'
        ? (t(key, { defaultValue: fallback }) as string)
        : (t(key, fallback as any) as string),
    [t]
  );
  const currentLocale = i18n.language as 'en' | 'es';

  const getDocumentsForCategory = (categoryKey: string) => {
    const normalizedCategoryKey = categoryKey.trim().toLowerCase();
    return documents.filter(doc => doc.category.trim().toLowerCase() === normalizedCategoryKey && doc.id !== 'general-inquiry');
  };

  const hasContent = categories.some(category => getDocumentsForCategory(category.key).length > 0);

  return (
    <ScrollArea className="w-full max-h-[calc(100vh-10rem-4rem)] md:max-h-[70vh] bg-popover text-popover-foreground rounded-b-lg">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-x-4 gap-y-6 p-4 md:p-6 min-h-[200px]">
        {categories.map(category => {
            const categoryDocs = getDocumentsForCategory(category.key);
            const categoryLabel = t(category.labelKey, { defaultValue: category.key });
            return (
            <div key={category.key}>
                <h4 className="font-semibold mb-2 text-sm md:text-base text-foreground flex items-center border-b border-border pb-1.5">
                  {React.createElement(category.icon || FileText, { className: "mr-2 h-4 w-4 md:h-5 md:w-5 text-primary" })}
                  {categoryLabel}
                </h4>
                {categoryDocs.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">{t('nav.noDocumentsInCategory', {defaultValue: 'No documents in this category yet.'})}</p>
                ): (
                <ul className="space-y-1.5">
                    {categoryDocs.slice(0, MAX_DOCS_PER_CATEGORY_INITIAL).map(doc => (
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
                        {t('nav.seeMoreDocuments', {defaultValue: 'See all in {{categoryName}}...', categoryName: categoryLabel })}
                        </Link>
                    </li>
                    )}
                </ul>
                )}
            </div>
            );
        })}
        {!hasContent && categories.length > 0 && (
            <div className="col-span-full text-center text-muted-foreground py-8">
                <p>{t('nav.noDocumentsAvailable', {defaultValue: 'No documents available for the selected categories at this time.'})}</p>
            </div>
        )}
         {categories.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground py-8">
                <p>{t('nav.noCategoriesAvailable', {defaultValue: 'No document categories available.'})}</p>
            </div>
        )}
        </div>
    </ScrollArea>
  );
}
