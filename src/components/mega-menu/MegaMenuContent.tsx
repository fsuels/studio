// src/components/mega-menu/MegaMenuContent.tsx
'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  getWorkflowDocuments,
  type DocumentSummary,
} from '@/lib/workflow/document-workflow';
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

const CATEGORY_ALIASES: Record<string, string[]> = {
  'Real Estate & Property': ['real estate', 'property'],
  'Estate Planning': ['estate planning', 'estate', 'wills', 'trusts'],
  'Business & Commercial': ['business', 'commercial', 'contracts'],
  'Employment & HR': ['employment', 'hr', 'human resources'],
  'Finance & Lending': ['finance', 'lending', 'financial'],
  'Intellectual Property': ['intellectual property', 'ip'],
  'Risk & Liability': ['risk', 'liability'],
  'Family & Personal': ['family', 'personal'],
  'Construction & Home Improvement': ['construction', 'home improvement'],
  'Dispute Resolution': ['dispute', 'legal', 'resolution'],
};


const MemoizedDocLink = React.memo(function DocLink({
  doc,
  locale,
  onClick,
}: {
  doc: DocumentSummary;
  locale: 'en' | 'es';
  onClick?: () => void;
}) {
  const { t } = useTranslation('common');

  // Get the document name from translations
  const docName =
    doc.translations?.[locale]?.name || doc.translations?.en?.name || doc.title;

  const docHref = `/${locale}/docs/${doc.id}`;

  return (
    <li className="md:px-0 md:py-0">
      <Link
        href={docHref}
        onClick={onClick}
        className="block w-full text-left px-4 md:px-4 py-3.5 md:py-3 min-h-[44px] md:min-h-0 text-base md:text-sm text-foreground md:text-muted-foreground font-medium md:font-normal hover:text-primary hover:underline hover:bg-muted/40 active:bg-muted/60 transition-colors duration-150 rounded-md"
        title={
          doc.translations?.[locale]?.description ||
          doc.translations?.en?.description ||
          doc.description
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
  const docs = useMemo(
    () => getWorkflowDocuments({ jurisdiction: 'us' }),
    [],
  );

  // Get all documents and categorize them
  const categorizedDocuments = useMemo(() => {
    const categories: Record<string, DocumentSummary[]> = {};

    docs
      .filter((doc) => doc.id !== 'general-inquiry')
      .forEach((doc) => {
        const docCategory = doc.category.toLowerCase();
        const matchedEntry = CATEGORIES.find((category) => {
          const aliases = CATEGORY_ALIASES[category.key] || [];
          return aliases.some((alias) => docCategory.includes(alias))
            || category.key.toLowerCase() === docCategory;
        });

        const targetKey = matchedEntry?.key || 'Business & Commercial';
        const bucket = categories[targetKey];

        if (
          bucket.length < MAX_DOCS_PER_CATEGORY &&
          !bucket.some((existing) => existing.id === doc.id)
        ) {
          bucket.push(doc);
        }
      });

    Object.keys(categories).forEach((categoryKey) => {
      categories[categoryKey].sort((a, b) => {
        const nameA = a.translations?.en?.name || a.title || a.id;
        const nameB = b.translations?.en?.name || b.title || b.id;
        return nameA.localeCompare(nameB);
      });
    });

    return categories;
  }, [docs]);

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
                              href={`/${locale}/marketplace?category=${encodeURIComponent(category.key)}`}
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
            href={`/${locale}/marketplace`}
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
