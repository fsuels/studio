// src/components/mega-menu/MegaMenuContent.tsx
'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { getDocumentTitle } from '@/lib/format-utils';
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
    key: 'Real Estate & Property',
    icon: Home,
    labelKey: 'categories.realEstate',
    priority: 1,
    subcategories: [
      'Residential Leasing',
      'Commercial Leasing',
      'Real-Estate Transactions',
      'Deeds & Financing',
    ],
  },
  {
    key: 'Estate Planning',
    icon: FileText,
    labelKey: 'categories.estatePlanning',
    priority: 2,
    subcategories: [
      'Wills & Codicils',
      'Trusts',
      'Powers of Attorney',
      'Advance Directives',
      'Estate Administration',
    ],
  },
  {
    key: 'Business & Commercial',
    icon: Briefcase,
    labelKey: 'categories.business',
    priority: 3,
    subcategories: [
      'General Contracts',
      'Sales & Purchasing',
      'Company Formation & Governance',
      'Marketing & Services',
      'Tech & Web',
    ],
  },
  {
    key: 'Employment & HR',
    icon: Building,
    labelKey: 'categories.employment',
    priority: 4,
    subcategories: [
      'Hiring & On-boarding',
      'Policies & Benefits',
      'Performance & Discipline',
      'Separation',
      'Restrictions',
    ],
  },
  {
    key: 'Finance & Lending',
    icon: DollarSign,
    labelKey: 'categories.finance',
    priority: 5,
    subcategories: [
      'Loans & Notes',
      'Security & Collateral',
      'Debt & Collection',
      'Instruments',
    ],
  },
  {
    key: 'Intellectual Property',
    icon: Scale,
    labelKey: 'categories.intellectualProperty',
    priority: 6,
    subcategories: [
      'Confidentiality & NDAs',
      'Trademark',
      'Patent & Invention',
      'Copyright & Media',
    ],
  },
  {
    key: 'Risk & Liability',
    icon: Heart,
    labelKey: 'categories.riskLiability',
    priority: 7,
    subcategories: ['Waivers & Releases', 'Reports'],
  },
  {
    key: 'Family & Personal',
    icon: Users,
    labelKey: 'categories.family',
    priority: 8,
    subcategories: ['Parenting & Childcare', 'Affidavits'],
  },
  {
    key: 'Construction & Home Improvement',
    icon: Building,
    labelKey: 'categories.construction',
    priority: 9,
    subcategories: ['Contracts', 'Bids, Bonds & Liens'],
  },
  {
    key: 'Dispute Resolution',
    icon: Scale,
    labelKey: 'categories.disputeResolution',
    priority: 10,
    subcategories: ['Demand & Warnings', 'ADR & Settlement', 'Court Prep'],
  },
];

const MAX_DOCS_PER_CATEGORY = 8;

// Document category mapping based on document IDs
const DOCUMENT_CATEGORY_MAPPING: Record<string, string> = {
  // Real Estate & Property
  'lease-agreement': 'Real Estate & Property',
  'residential-lease-agreement': 'Real Estate & Property',
  'room-rental-agreement': 'Real Estate & Property',
  'sublease-agreement': 'Real Estate & Property',
  'lease-renewal-agreement': 'Real Estate & Property',
  'lease-termination-letter': 'Real Estate & Property',
  'roommate-agreement': 'Real Estate & Property',
  'pet-agreement': 'Real Estate & Property',
  'commercial-lease-agreement': 'Real Estate & Property',
  'rental-agreement': 'Real Estate & Property',
  'eviction-notice': 'Real Estate & Property',
  'quitclaim-deed': 'Real Estate & Property',
  'property-deed': 'Real Estate & Property',

  // Estate Planning
  'last-will-testament': 'Estate Planning',
  'simple-will': 'Estate Planning',
  'codicil-to-will': 'Estate Planning',
  'living-trust': 'Estate Planning',
  'living-will': 'Estate Planning',
  'power-of-attorney': 'Estate Planning',
  'durable-power-of-attorney': 'Estate Planning',
  'healthcare-power-of-attorney': 'Estate Planning',

  // Business & Commercial
  'articles-of-incorporation': 'Business & Commercial',
  'articles-of-incorporation-biz': 'Business & Commercial',
  'business-contract': 'Business & Commercial',
  'letter-of-intent': 'Business & Commercial',
  'sales-agreement': 'Business & Commercial',
  'consulting-agreement': 'Business & Commercial',
  'llc-operating-agreement': 'Business & Commercial',
  'partnership-agreement': 'Business & Commercial',
  'service-agreement': 'Business & Commercial',
  'independent-contractor-agreement': 'Business & Commercial',
  'purchase-agreement': 'Business & Commercial',
  'consignment-agreement': 'Business & Commercial',
  'licensing-agreement': 'Business & Commercial',

  // Employment & HR
  'employment-offer-letter': 'Employment & HR',
  'employment-contract': 'Employment & HR',
  'employment-termination-letter': 'Employment & HR',
  'termination-letter': 'Employment & HR',
  'severance-agreement': 'Employment & HR',
  'non-compete-agreement': 'Employment & HR',

  // Finance & Lending
  'promissory-note': 'Finance & Lending',
  'loan-agreement': 'Finance & Lending',
  'vehicle-bill-of-sale': 'Finance & Lending',
  'boat-bill-of-sale': 'Finance & Lending',
  'demand-letter': 'Finance & Lending',
  'demand-letter-payment': 'Finance & Lending',
  invoice: 'Finance & Lending',

  // Intellectual Property
  'non-disclosure-agreement': 'Intellectual Property',
  'copyright-assignment': 'Intellectual Property',
  'trademark-assignment': 'Intellectual Property',

  // Family & Personal
  'child-custody-agreement': 'Family & Personal',
  'child-medical-consent': 'Family & Personal',
  'medical-consent': 'Family & Personal',
  'prenuptial-agreement': 'Family & Personal',
  'divorce-settlement': 'Family & Personal',
  'divorce-settlement-agreement': 'Family & Personal',
  'affidavit-general': 'Family & Personal',

  // Dispute Resolution (fallback for demand letters and legal documents)
  // Note: Some documents like demand-letter could be in multiple categories
};

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
  const docName =
    locale === 'es' && doc.translations?.es?.name
      ? doc.translations.es.name
      : getDocumentTitle(doc, 'en');

  const docHref = `/${locale}/docs/${doc.id}`;

  return (
    <li className="md:px-0 md:py-0">
      <Link
        href={docHref}
        onClick={onClick}
        className="block w-full text-left px-4 md:px-4 py-3.5 md:py-3 min-h-[44px] md:min-h-0 text-base md:text-sm text-foreground md:text-muted-foreground font-medium md:font-normal hover:text-primary hover:underline hover:bg-muted/40 active:bg-muted/60 transition-colors duration-150 rounded-md"
        title={
          locale === 'es' && doc.translations?.es?.description
            ? doc.translations.es.description
            : doc.translations?.en?.description || doc.description
        }
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
  const [docs, setDocs] = React.useState<LegalDocument[]>([]);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mod = await import('@/lib/document-library');
        const list = (mod.documentLibrary as unknown) as LegalDocument[];
        if (!cancelled) setDocs(list);
      } catch (_) {
        if (!cancelled) setDocs([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Get all documents and categorize them
  const categorizedDocuments = useMemo(() => {
    const categories: Record<string, LegalDocument[]> = {};

    // Initialize all categories
    CATEGORIES.forEach((cat) => {
      categories[cat.key] = [];
    });

    // Filter out general inquiry and categorize documents
    const list = (docs || []).filter(
      (doc) =>
        doc.id !== 'general-inquiry' && doc.schema && doc.translations?.en?.name,
    );

    list.forEach((doc) => {
      // Use explicit mapping first, then fallback to document's category
      let mappedCategory = DOCUMENT_CATEGORY_MAPPING[doc.id];

      if (!mappedCategory) {
        // Fallback mapping based on original document category
        const originalCategory = doc.category || 'Business';
        switch (originalCategory) {
          case 'Real Estate':
          case 'Property':
            mappedCategory = 'Real Estate & Property';
            break;
          case 'Business':
          case 'Corporate':
            mappedCategory = 'Business & Commercial';
            break;
          case 'Employment':
            mappedCategory = 'Employment & HR';
            break;
          case 'Finance':
          case 'Transactions':
            mappedCategory = 'Finance & Lending';
            break;
          case 'Legal':
            mappedCategory = 'Dispute Resolution';
            break;
          case 'Family':
          case 'Personal':
            mappedCategory = 'Family & Personal';
            break;
          default:
            mappedCategory = 'Business & Commercial'; // Default fallback
        }
      }

      if (categories[mappedCategory]) {
        categories[mappedCategory].push(doc);
      } else {
        // If category doesn't exist, add to Business & Commercial as fallback
        categories['Business & Commercial'].push(doc);
      }
    });

    // Sort documents within each category by name
    Object.keys(categories).forEach((categoryKey) => {
      categories[categoryKey].sort((a, b) => {
        const nameA =
          locale === 'es' && a.translations?.es?.name
            ? a.translations.es.name
            : a.translations?.en?.name || a.name || a.id;
        const nameB =
          locale === 'es' && b.translations?.es?.name
            ? b.translations.es.name
            : b.translations?.en?.name || b.name || b.id;
        return nameA.localeCompare(nameB);
      });
    });

    return categories;
  }, [locale, docs]);

  // Lazy-load the document library and stash it globally for memo to use
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mod = await import('@/lib/document-library');
        const docs = (mod.documentLibrary || []) as LegalDocument[];
        if (!cancelled) (globalThis as any).__DOC_LIB__ = docs;
      } catch (_) {
        if (!cancelled) (globalThis as any).__DOC_LIB__ = [];
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const [openCategories, setOpenCategories] = React.useState<
    Record<string, boolean>
  >(() => {
    // Default open the categories with the most documents
    const initial: Record<string, boolean> = {};
    CATEGORIES.forEach((cat) => {
      const docCount = categorizedDocuments[cat.key]?.length || 0;
      initial[cat.key] = docCount > 0 && cat.priority <= 3; // Open top 3 categories if they have docs
    });
    return initial;
  });

  const handleToggle = React.useCallback((categoryKey: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryKey]: !prev[categoryKey],
    }));
  }, []);

  // Filter categories that have documents
  const categoriesWithDocs = CATEGORIES.filter(
    (cat) => categorizedDocuments[cat.key]?.length > 0,
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
              count: totalDocuments,
            })}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categoriesWithDocs.map((category) => {
            const categoryDocs = categorizedDocuments[category.key] || [];
            const isOpen = openCategories[category.key];
            const displayDocs = isOpen
              ? categoryDocs
              : categoryDocs.slice(0, MAX_DOCS_PER_CATEGORY);

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
                        category.priority <= 2 && 'text-primary',
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

                          {!isOpen &&
                            categoryDocs.length > MAX_DOCS_PER_CATEGORY && (
                              <button
                                onClick={() => handleToggle(category.key)}
                                className="text-xs text-primary font-medium hover:underline mt-2"
                              >
                                {t('megaMenu.showMore', {
                                  defaultValue: '+{{count}} more',
                                  count:
                                    categoryDocs.length - MAX_DOCS_PER_CATEGORY,
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
                                defaultValue:
                                  'Browse all {{category}} documents →',
                                category: t(category.labelKey, {
                                  defaultValue: category.key,
                                }),
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
              count: totalDocuments,
            })}
          </Link>
        </div>
      </div>
    </ScrollArea>
  );
}
