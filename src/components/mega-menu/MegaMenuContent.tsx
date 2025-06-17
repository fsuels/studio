// src/components/mega-menu/MegaMenuContent.tsx
'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { documentLibrary } from '@/lib/document-library';
import type { LegalDocument } from '@/types/documents';
import { ScrollArea } from '@/components/ui/ScrollArea';
import {
  Briefcase,
  Home,
  Users,
  DollarSign,
  Scale,
  FileText,
  Building,
  Heart,
} from 'lucide-react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

interface MegaMenuContentProps {
  locale: 'en' | 'es';
  onLinkClick?: () => void;
}

// Define document categories with icons and improved organization
const CATEGORIES = [
  { 
    key: 'Business', 
    icon: Briefcase, 
    labelKey: 'categories.business',
    priority: 1
  },
  { 
    key: 'Real Estate', 
    icon: Home, 
    labelKey: 'categories.realEstate',
    priority: 2
  },
  { 
    key: 'Finance', 
    icon: DollarSign, 
    labelKey: 'categories.finance',
    priority: 3
  },
  { 
    key: 'Legal', 
    icon: Scale, 
    labelKey: 'categories.legal',
    priority: 4
  },
  { 
    key: 'Family', 
    icon: Users, 
    labelKey: 'categories.family',
    priority: 5
  },
  { 
    key: 'Employment', 
    icon: Building, 
    labelKey: 'categories.employment',
    priority: 6
  },
  { 
    key: 'Personal', 
    icon: Heart, 
    labelKey: 'categories.personal',
    priority: 7
  },
];

const MAX_DOCS_PER_CATEGORY = 8;

const MemoizedDocLink = React.memo(function DocLink({
  doc,
  locale,
  onClick,
}: {
  doc: LegalDocument;
  locale: 'en' | 'es';
  onClick?: () => void;
}) {
  const { t } = useTranslation('common');
  
  // Get the document name from translations
  const docName = locale === 'es' && doc.translations?.es?.name
    ? doc.translations.es.name
    : doc.translations?.en?.name || doc.name || doc.id;

  const docHref = `/${locale}/docs/${doc.id}`;

  return (
    <li className="md:px-0 md:py-0">
      <Link
        href={docHref}
        onClick={onClick}
        className="block w-full text-left px-4 md:px-4 py-3.5 md:py-3 min-h-[44px] md:min-h-0 text-base md:text-sm text-foreground md:text-muted-foreground font-medium md:font-normal hover:text-primary hover:underline hover:bg-muted/40 active:bg-muted/60 transition-colors duration-150 rounded-md"
        title={locale === 'es' && doc.translations?.es?.description
          ? doc.translations.es.description
          : doc.translations?.en?.description || doc.description}
      >
        {t(docName, { defaultValue: docName })}
      </Link>
    </li>
  );
});

export default function MegaMenuContent({
  locale,
  onLinkClick,
}: MegaMenuContentProps) {
  const { t } = useTranslation('common');

  // Get all documents and categorize them
  const categorizedDocuments = useMemo(() => {
    const categories: Record<string, LegalDocument[]> = {};
    
    // Initialize all categories
    CATEGORIES.forEach(cat => {
      categories[cat.key] = [];
    });

    // Filter out general inquiry and categorize documents
    const validDocuments = documentLibrary.filter(doc => 
      doc.id !== 'general-inquiry' && 
      doc.schema && 
      doc.translations?.en?.name
    );

    validDocuments.forEach(doc => {
      const category = doc.category || 'Legal';
      
      // Map similar categories to our defined ones
      let mappedCategory = category;
      if (category === 'Estate Planning') mappedCategory = 'Family';
      if (category === 'Transactions') mappedCategory = 'Finance';
      if (category === 'Property') mappedCategory = 'Real Estate';
      if (category === 'Corporate') mappedCategory = 'Business';
      
      if (categories[mappedCategory]) {
        categories[mappedCategory].push(doc);
      } else {
        // If category doesn't exist, add to Legal
        categories['Legal'].push(doc);
      }
    });

    // Sort documents within each category by name
    Object.keys(categories).forEach(categoryKey => {
      categories[categoryKey].sort((a, b) => {
        const nameA = locale === 'es' && a.translations?.es?.name
          ? a.translations.es.name
          : a.translations?.en?.name || a.name || a.id;
        const nameB = locale === 'es' && b.translations?.es?.name
          ? b.translations.es.name
          : b.translations?.en?.name || b.name || b.id;
        return nameA.localeCompare(nameB);
      });
    });

    return categories;
  }, [locale]);

  const [openCategories, setOpenCategories] = React.useState<Record<string, boolean>>(() => {
    // Default open the categories with the most documents
    const initial: Record<string, boolean> = {};
    CATEGORIES.forEach(cat => {
      const docCount = categorizedDocuments[cat.key]?.length || 0;
      initial[cat.key] = docCount > 0 && cat.priority <= 3; // Open top 3 categories if they have docs
    });
    return initial;
  });

  const handleToggle = React.useCallback((categoryKey: string) => {
    setOpenCategories(prev => ({ 
      ...prev, 
      [categoryKey]: !prev[categoryKey] 
    }));
  }, []);

  // Filter categories that have documents
  const categoriesWithDocs = CATEGORIES.filter(cat => 
    categorizedDocuments[cat.key]?.length > 0
  );

  const totalDocuments = Object.values(categorizedDocuments).flat().length;

  return (
    <ScrollArea className="w-full max-h-[calc(100vh-10rem-4rem)] md:max-h-[70vh] bg-popover text-popover-foreground rounded-b-lg">
      <div className="w-full p-4 md:p-6">
        {/* Header */}
        <div className="mb-6 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {t('megaMenu.title', { defaultValue: 'Legal Documents' })}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t('megaMenu.subtitle', { 
              defaultValue: 'Browse {{count}} professional legal documents',
              count: totalDocuments
            })}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categoriesWithDocs.map((category) => {
            const categoryDocs = categorizedDocuments[category.key] || [];
            const isOpen = openCategories[category.key];
            const displayDocs = isOpen ? categoryDocs : categoryDocs.slice(0, MAX_DOCS_PER_CATEGORY);
            
            return (
              <div key={category.key} className="space-y-2">
                <Accordion
                  type="single"
                  collapsible
                  value={isOpen ? 'item' : undefined}
                  onValueChange={() => handleToggle(category.key)}
                >
                  <AccordionItem value="item" className="border-none">
                    <AccordionTrigger
                      className={cn(
                        'font-semibold text-sm md:text-base flex items-center border-b border-border pb-2 hover:text-primary transition-colors',
                        category.priority <= 2 && 'text-primary'
                      )}
                    >
                      <category.icon className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                      <span className="text-left">
                        {t(category.labelKey, { defaultValue: category.key })}
                        <span className="ml-1 text-xs text-muted-foreground">
                          ({categoryDocs.length})
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-3">
                      {categoryDocs.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic">
                          {t('megaMenu.noDocuments', {
                            defaultValue: 'No documents in this category yet.',
                          })}
                        </p>
                      ) : (
                        <div className="space-y-2">
                          <ul className="space-y-1">
                            {displayDocs.map((doc) => (
                              <MemoizedDocLink
                                key={`${category.key}-${doc.id}`}
                                doc={doc}
                                locale={locale}
                                onClick={onLinkClick}
                              />
                            ))}
                          </ul>
                          
                          {!isOpen && categoryDocs.length > MAX_DOCS_PER_CATEGORY && (
                            <button
                              onClick={() => handleToggle(category.key)}
                              className="text-xs text-primary font-medium hover:underline mt-2"
                            >
                              {t('megaMenu.showMore', {
                                defaultValue: '+{{count}} more',
                                count: categoryDocs.length - MAX_DOCS_PER_CATEGORY
                              })}
                            </button>
                          )}
                          
                          {categoryDocs.length > 5 && (
                            <Link
                              href={`/${locale}/?category=${encodeURIComponent(category.key)}#workflow-start`}
                              className="block text-xs text-primary font-medium hover:underline mt-2 pt-2 border-t border-border"
                              onClick={onLinkClick}
                            >
                              {t('megaMenu.browseAll', {
                                defaultValue: 'Browse all {{category}} documents →',
                                category: t(category.labelKey, { defaultValue: category.key })
                              })}
                            </Link>
                          )}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-border text-center">
          <Link
            href={`/${locale}/#workflow-start`}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            onClick={onLinkClick}
          >
            <FileText className="h-4 w-4" />
            {t('megaMenu.viewAll', { 
              defaultValue: 'View all {{count}} documents',
              count: totalDocuments
            })}
          </Link>
        </div>
      </div>
    </ScrollArea>
  );
}