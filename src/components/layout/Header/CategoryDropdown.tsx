// src/components/layout/Header/CategoryDropdown.tsx
'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { getDocumentsForCountry } from '@/lib/document-library';
import { getDocTranslation } from '@/lib/i18nUtils';
import type { LegalDocument } from '@/lib/document-library';

interface CategoryDropdownProps {
  locale: 'en' | 'es';
  activeCategory: string | null;
  onLinkClick: () => void;
  isOpen: boolean;
}

// Category content mappings - User-intent focused
interface CategoryContent {
  title: string;
  subtitle?: string;
  sections: {
    id: string;
    label: string;
    documents: string[];
  }[];
}

const categoryContent: Record<string, CategoryContent> = {
  'agreements-contracts': {
    title: 'Agreements & Contracts',
    subtitle: 'Foundational agreements for business & legal needs',
    sections: [
      {
        id: 'business-operations',
        label: 'Business Operations',
        documents: ['business-contract', 'service-agreement', 'consulting-agreement', 'sales-agreement', 'general-purchase-agreement', 'vendor-agreement', 'letter-of-intent', 'memorandum-of-agreement', 'memorandum-of-understanding', 'non-disclosure-agreement', 'confidentiality-agreement']
      },
      {
        id: 'intellectual-property',
        label: 'Intellectual Property & Licensing',
        documents: ['copyright-assignment', 'copyright-license-agreement', 'trademark-assignment', 'trademark-license-agreement', 'patent-assignment', 'patent-license-agreement', 'general-licensing-agreement', 'software-license-agreement', 'music-license-agreement', 'invention-assignment-agreement']
      },
      {
        id: 'employment-hr',
        label: 'Employment & HR',
        documents: ['employment-contract', 'independent-contractor-agreement', 'non-compete-agreement', 'commission-agreement', 'employee-non-disclosure-agreement', 'severance-agreement', 'executive-employment-agreement', 'internship-agreement', 'telecommuting-agreement', 'work-from-home-agreement', 'volunteer-agreement']
      },
      {
        id: 'partnerships',
        label: 'Partnerships & Investments',
        documents: ['partnership-agreement', 'partnership-agreement-amendment', 'partnership-dissolution-agreement', 'joint-venture-agreement', 'limited-partnership-agreement', 'shareholder-agreement', 'investment-agreement', 'startup-equity-agreement', 'private-placement-memorandum', 'investment-term-sheet']
      }
    ]
  },
  'letters-notices': {
    title: 'Letters & Notices',
    subtitle: 'Formal communications & notifications',
    sections: [
      {
        id: 'payment-debt',
        label: 'Payment & Debt',
        documents: ['demand-letter-payment', 'collection-letter', 'debt-validation-letter']
      },
      {
        id: 'property-tenancy',
        label: 'Property & Tenancy',
        documents: ['eviction-notice', 'late-rent-notice', 'lease-termination-letter']
      },
      {
        id: 'employment-hr-letters',
        label: 'Employment & HR',
        documents: ['employment-verification-letter', 'resignation-letter', 'employee-warning-notice']
      },
      {
        id: 'general-personal',
        label: 'General & Personal',
        documents: ['complaint-letter', 'cease-desist-letter', 'breach-contract-notice', 'contract-termination-letter']
      }
    ]
  },
  'forms-authorizations': {
    title: 'Forms & Authorizations',
    subtitle: 'Official documentation & permissions',
    sections: [
      {
        id: 'personal-legal-affidavits',
        label: 'Personal & Legal Affidavits',
        documents: ['affidavit', 'affidavit-general', 'affidavit-of-death', 'affidavit-of-heirship', 'affidavit-of-identity']
      },
      {
        id: 'powers-attorney-directives',
        label: 'Powers of Attorney & Directives',
        documents: ['durable-power-of-attorney', 'advance-directive', 'living-will']
      },
      {
        id: 'medical-child-care',
        label: 'Medical & Child Care',
        documents: ['child-medical-consent', 'child-care-authorization-form']
      },
      {
        id: 'property-transactions',
        label: 'Property & Transactions',
        documents: ['vehicle-bill-of-sale', 'bill-of-sale-general', 'boat-bill-of-sale', 'ach-authorization-form', 'promissory-note']
      }
    ]
  },
  'family-personal': {
    title: 'Family & Personal Life',
    subtitle: 'Life events & relationships',
    sections: [
      {
        id: 'estate-planning',
        label: 'Estate Planning',
        documents: ['last-will-testament', 'living-will', 'codicil-to-will']
      },
      {
        id: 'marriage-relationships',
        label: 'Marriage & Relationships',
        documents: ['cohabitation-agreement', 'child-custody-agreement', 'child-support-agreement']
      },
      {
        id: 'children-dependents',
        label: 'Children & Dependents',
        documents: ['child-custody-agreement', 'child-support-agreement', 'child-care-contract', 'child-travel-consent']
      },
      {
        id: 'personal-life',
        label: 'Personal Life & Recreation',
        documents: ['donation-agreement']
      }
    ]
  },
  'business-commercial': {
    title: 'Business & Commercial',
    subtitle: 'Comprehensive business documents for all stages',
    sections: [
      {
        id: 'business-formation',
        label: 'Business Formation & Governance',
        documents: ['articles-of-incorporation', 'corporate-bylaws', 'llc-operating-agreement', 'business-plan', 'board-resolution']
      },
      {
        id: 'finance-lending',
        label: 'Finance & Lending',
        documents: ['promissory-note', 'loan-agreement', 'debt-settlement-agreement', 'security-agreement']
      },
      {
        id: 'commercial-real-estate',
        label: 'Commercial Real Estate',
        documents: ['commercial-lease-agreement', 'lease-agreement', 'property-deed', 'quitclaim-deed', 'real-estate-purchase-agreement']
      },
      {
        id: 'industry-specific',
        label: 'Industry-Specific Contracts',
        documents: ['construction-contract', 'catering-agreement', 'auto-repair-agreement', 'consulting-agreement']
      }
    ]
  }
};

export default function CategoryDropdown({
  locale,
  activeCategory,
  onLinkClick,
  isOpen
}: CategoryDropdownProps) {
  const { t } = useTranslation('common');
  const documents = getDocumentsForCountry('us');
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Handle escape key
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onLinkClick();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onLinkClick]);

  // Create document map for quick lookup
  const documentMap = useMemo(() => {
    const map = new Map<string, LegalDocument>();
    documents.forEach(doc => {
      map.set(doc.id, doc);
    });
    return map;
  }, [documents]);

  if (!isOpen || !activeCategory) return null;

  const content = categoryContent[activeCategory as keyof typeof categoryContent];
  if (!content) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
        onClick={onLinkClick}
      />
      
      {/* Dropdown Content */}
      <div className={cn(
        "absolute top-full left-0 right-0 z-40 bg-background border-b border-border shadow-lg animate-in slide-in-from-top-2 duration-200"
      )}>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground">{content.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {content.subtitle || 'Choose from our professionally crafted templates'}
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {content.sections.map(section => (
            <div key={section.id} className="space-y-4">
              <h3 className="font-semibold text-base text-foreground border-b border-border pb-2">
                {section.label}
              </h3>
              <ul className="space-y-2">
                {section.documents
                  .filter(docId => documentMap.has(docId))
                  .slice(0, expandedSections[section.id] ? section.documents.length : 4) // Show 4 or all documents
                  .map(docId => {
                    const doc = documentMap.get(docId)!;
                    const translatedDoc = getDocTranslation(doc, locale);
                    return (
                      <li key={docId}>
                        <Link
                          href={`/${locale}/docs/${doc.id}`}
                          onClick={onLinkClick}
                          className="group flex items-start justify-between p-2 rounded-md hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-foreground group-hover:text-primary truncate">
                              {translatedDoc.name}
                            </div>
                            {translatedDoc.description && (
                              <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {translatedDoc.description}
                              </div>
                            )}
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary ml-2 flex-shrink-0" />
                        </Link>
                      </li>
                    );
                  })}
                {section.documents.filter(docId => documentMap.has(docId)).length > 4 && (
                  <li>
                    <button 
                      onClick={() => toggleSection(section.id)}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      {expandedSections[section.id] 
                        ? 'Show less' 
                        : `Show ${section.documents.filter(docId => documentMap.has(docId)).length - 4} more...`
                      }
                    </button>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
        
        {/* View All Link */}
        <div className="mt-6 pt-4 border-t border-border">
          <Link
            href={`/${locale}/?category=${encodeURIComponent(activeCategory)}`}
            onClick={onLinkClick}
            className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80"
          >
            View all {content.title.toLowerCase()}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}