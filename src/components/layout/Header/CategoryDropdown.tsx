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

// Category content mappings
const categoryContent = {
  'agreements': {
    title: 'Agreements & Contracts',
    sections: [
      {
        id: 'confidentiality',
        label: 'Confidentiality',
        documents: ['non-disclosure-agreement', 'confidentiality-agreement', 'employee-non-disclosure-agreement']
      },
      {
        id: 'license-ip',
        label: 'License & IP',
        documents: ['copyright-assignment', 'copyright-license-agreement', 'trademark-assignment', 'patent-assignment', 'software-license-agreement', 'ip-assignment-agreement']
      },
      {
        id: 'service-sales',
        label: 'Service & Sales',
        documents: ['service-agreement', 'business-contract', 'consulting-agreement', 'consulting-services-agreement']
      },
      {
        id: 'employment',
        label: 'Employment',
        documents: ['employment-contract', 'independent-contractor-agreement', 'non-compete-agreement', 'commission-agreement']
      }
    ]
  },
  'letters-notices': {
    title: 'Letters & Notices',
    sections: [
      {
        id: 'payment-debt',
        label: 'Payment & Debt',
        documents: ['demand-letter-payment', 'collection-letter', 'debt-validation-letter']
      },
      {
        id: 'tenancy',
        label: 'Tenancy',
        documents: ['eviction-notice', 'late-rent-notice']
      },
      {
        id: 'general',
        label: 'General',
        documents: ['complaint-letter', 'cease-desist-letter', 'breach-contract-notice', 'contract-termination-letter']
      }
    ]
  },
  'forms-authorizations': {
    title: 'Forms & Authorizations',
    sections: [
      {
        id: 'personal',
        label: 'Personal',
        documents: ['durable-power-of-attorney', 'advance-directive', 'living-will']
      },
      {
        id: 'financial',
        label: 'Financial',
        documents: ['ach-authorization-form', 'promissory-note', 'loan-agreement']
      },
      {
        id: 'medical',
        label: 'Medical',
        documents: ['child-medical-consent']
      },
      {
        id: 'government',
        label: 'Government',
        documents: ['affidavit', 'affidavit-general']
      }
    ]
  },
  'family-legacy': {
    title: 'Family & Legacy',
    sections: [
      {
        id: 'protect',
        label: 'Protect',
        documents: ['last-will-testament']
      },
      {
        id: 'care',
        label: 'Care',
        documents: ['child-custody-agreement', 'child-support-agreement']
      },
      {
        id: 'healthcare',
        label: 'Healthcare',
        documents: ['advance-directive', 'living-will']
      }
    ]
  },
  'business-finance-property': {
    title: 'Business Finance & Property',
    sections: [
      {
        id: 'finance',
        label: 'Finance',
        documents: ['promissory-note', 'loan-agreement']
      },
      {
        id: 'property',
        label: 'Property',
        documents: ['lease-agreement', 'quitclaim-deed', 'property-deed', 'commercial-lease-agreement', 'vehicle-bill-of-sale', 'bill-of-sale-general', 'boat-bill-of-sale']
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
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground">{content.title}</h2>
          <p className="text-sm text-muted-foreground">Choose from our professionally crafted templates</p>
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
                  .slice(0, 4) // Show only first 4 documents
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
                    <button className="text-xs text-primary hover:underline font-medium">
                      Show {section.documents.filter(docId => documentMap.has(docId)).length - 4} more...
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