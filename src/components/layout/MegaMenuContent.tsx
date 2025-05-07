// src/components/layout/MegaMenuContent.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import type { LegalDocument } from '@/lib/document-library';
import type { CategoryInfo } from '@/components/Step1DocumentSelector'; // Assuming CategoryInfo is exported
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText } from 'lucide-react';

interface MegaMenuContentProps {
  categories: CategoryInfo[];
  documents: LegalDocument[];
  onLinkClick?: () => void; // Optional callback for when a link is clicked (e.g., to close mobile menu)
}

const MAX_DOCS_PER_CATEGORY_INITIAL = 5;

export default function MegaMenuContent({ categories, documents, onLinkClick }: MegaMenuContentProps) {
  const { t, i18n } = useTranslation();

  const getDocumentsForCategory = (categoryKey: string) => {
    return documents.filter(doc => doc.category === categoryKey && doc.id !== 'general-inquiry');
  };

  return (
    <ScrollArea className="max-h-[70vh] md:max-h-[calc(100vh-10rem)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8 p-6 md:p-8 bg-popover text-popover-foreground rounded-b-lg shadow-lg">
        {categories.map(category => {
            const categoryDocs = getDocumentsForCategory(category.key);
            return (
            <div key={category.key}>
                <h4 className="font-semibold mb-3 text-base text-foreground flex items-center border-b border-border pb-2">
                {React.createElement(category.icon || FileText, { className: "mr-2 h-5 w-5 text-primary" })}
                {t(category.labelKey, category.key)}
                </h4>
                {categoryDocs.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">{t('nav.noDocumentsInCategory', 'No documents in this category yet.')}</p>
                ): (
                <ul className="space-y-2">
                    {categoryDocs.slice(0, MAX_DOCS_PER_CATEGORY_INITIAL).map(doc => (
                    <li key={doc.id}>
                        <Link 
                            href={`/?docId=${encodeURIComponent(doc.id)}#workflow-start`} 
                            className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors duration-150 block py-0.5"
                            onClick={onLinkClick}
                        >
                        {t(i18n.language === 'es' && doc.name_es ? doc.name_es : doc.name, doc.name)}
                        </Link>
                    </li>
                    ))}
                    {categoryDocs.length > MAX_DOCS_PER_CATEGORY_INITIAL && (
                    <li>
                        <Link 
                            href={`/?category=${encodeURIComponent(category.key)}#workflow-start`} 
                            className="text-sm text-primary font-medium hover:underline mt-1 inline-block"
                            onClick={onLinkClick}
                        >
                        {t('nav.seeMoreDocuments', 'See all in {{categoryName}}...', { categoryName: t(category.labelKey, category.key) })}
                        </Link>
                    </li>
                    )}
                </ul>
                )}
            </div>
            );
        })}
        </div>
    </ScrollArea>
  );
}
