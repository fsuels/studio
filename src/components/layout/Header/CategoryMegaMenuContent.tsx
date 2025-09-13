// src/components/layout/Header/CategoryMegaMenuContent.tsx
'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { resolveDocSlug } from '@/lib/slug-alias';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { X, Search, ChevronRight, FileText } from 'lucide-react';
import { getDocTranslation } from '@/lib/i18nUtils';
import type { LegalDocument } from '@/types/documents';

interface CategoryMegaMenuContentProps {
  locale: 'en' | 'es';
  activeCategory: string | null;
  searchQuery: string;
  onClose: () => void;
  onSearchChange: (query: string) => void;
}

// Category definitions with document mappings
const categoryContent = {
  'agreements': {
    sections: [
      {
        id: 'confidentiality',
        label: 'Confidentiality',
        documents: ['non-disclosure-agreement', 'confidentiality-agreement', 'employee-non-disclosure-agreement']
      },
      {
        id: 'service-sales',
        label: 'Service & Sales',
        documents: ['service-agreement', 'business-contract', 'consulting-agreement']
      },
      {
        id: 'employment',
        label: 'Employment',
        documents: ['employment-contract', 'independent-contractor-agreement', 'non-compete-agreement']
      }
    ]
  },
  'letters-notices': {
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
        documents: ['complaint-letter', 'cease-desist-letter', 'breach-contract-notice']
      }
    ]
  },
  'forms-authorizations': {
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
      }
    ]
  },
  'family-legacy': {
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
    sections: [
      {
        id: 'finance',
        label: 'Finance',
        documents: ['promissory-note', 'loan-agreement']
      },
      {
        id: 'property',
        label: 'Property',
        documents: ['lease-agreement', 'quitclaim-deed', 'property-deed', 'vehicle-bill-of-sale']
      }
    ]
  }
};

export default function CategoryMegaMenuContent({
  locale,
  activeCategory,
  searchQuery,
  onClose,
  onSearchChange
}: CategoryMegaMenuContentProps) {
  const { t } = useTranslation('common');
  const [documents, setDocuments] = React.useState<LegalDocument[]>([]);
  const [hoveredDocument, setHoveredDocument] = React.useState<string | null>(null);

  // Handle global keyboard events
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Lazy-load docs when menu content mounts
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mod = await import('@/lib/document-library');
        const docs = mod.getDocumentsForCountry('us') as LegalDocument[];
        if (!cancelled) setDocuments(docs);
      } catch (_) {
        if (!cancelled) setDocuments([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Create document map for quick lookup
  const documentMap = useMemo(() => {
    const map = new Map<string, LegalDocument>();
    documents.forEach(doc => {
      map.set(doc.id, doc);
    });
    return map;
  }, [documents]);

  // Search functionality
  const searchResults = useMemo(() => {
    if (!searchQuery) return [];

    const query = searchQuery.toLowerCase();
    return documents.filter(doc => {
      if (doc.id === 'general-inquiry') return false;
      
      const translatedDoc = getDocTranslation(doc, locale);
      const name = translatedDoc.name.toLowerCase();
      const description = translatedDoc.description?.toLowerCase() || '';
      const aliases = translatedDoc.aliases?.map(a => a.toLowerCase()) || [];
      
      return name.includes(query) || 
             description.includes(query) || 
             aliases.some(alias => alias.includes(query));
    });
  }, [searchQuery, documents, locale]);

  // Group search results by category
  const groupedSearchResults = useMemo(() => {
    if (!searchResults.length) return {};
    
    const grouped = searchResults.reduce((acc, doc) => {
      const category = doc.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(doc);
      return acc;
    }, {} as Record<string, LegalDocument[]>);
    
    return grouped;
  }, [searchResults]);

  const handleDocumentClick = () => {
    onClose();
  };

  const renderCategoryContent = (categoryId: string) => {
    const content = categoryContent[categoryId as keyof typeof categoryContent];
    if (!content) return null;

    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {content.sections.map(section => (
          <div key={section.id} className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground border-b border-border pb-2">
              {section.label}
            </h3>
            <ul className="space-y-3">
              {section.documents
                .filter(docId => documentMap.has(docId))
                .map(docId => {
                  const doc = documentMap.get(docId)!;
                  const translatedDoc = getDocTranslation(doc, locale);
                  const isHovered = hoveredDocument === doc.id;
                  return (
                    <li key={docId}>
                      <Link
                        href={`/${locale}/docs/${resolveDocSlug(doc.id)}`}
                        onClick={handleDocumentClick}
                        onMouseEnter={() => setHoveredDocument(doc.id)}
                        onMouseLeave={() => setHoveredDocument(null)}
                        className="group flex items-start justify-between p-3 rounded-lg hover:bg-muted/50 transition-all duration-200"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-foreground group-hover:text-primary">
                            {translatedDoc.name}
                          </div>
                          {/* Reserve space for description to prevent layout shift */}
                          <div className="h-10 mt-1">
                            {translatedDoc.description && (
                              <div className={cn(
                                "text-sm text-muted-foreground line-clamp-2 transition-opacity duration-200",
                                isHovered ? "opacity-100" : "opacity-0"
                              )}>
                                {translatedDoc.description}
                              </div>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary ml-2 mt-0.5 flex-shrink-0" />
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  const renderSearchResults = () => {
    if (!searchQuery) return null;

    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Found {searchResults.length} document{searchResults.length !== 1 ? 's' : ''} matching "{searchQuery}"
          </div>
        </div>
        
        {Object.keys(groupedSearchResults).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No documents found matching your search.</p>
            <p className="text-sm text-muted-foreground mt-2">Try different keywords or browse the categories.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(groupedSearchResults).map(([category, docs]) => (
              <div key={category} className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <FileText className="h-5 w-5 text-primary" />
                  {category}
                  <span className="text-sm font-normal text-muted-foreground">({docs.length})</span>
                </div>
                <ul className="space-y-2">
                  {docs.map(doc => {
                    const translatedDoc = getDocTranslation(doc, locale);
                    const isHovered = hoveredDocument === doc.id;
                    return (
                      <li key={doc.id}>
                        <Link
                          href={`/${locale}/docs/${resolveDocSlug(doc.id)}`}
                          onClick={handleDocumentClick}
                          onMouseEnter={() => setHoveredDocument(doc.id)}
                          onMouseLeave={() => setHoveredDocument(null)}
                          className="block p-3 rounded-lg hover:bg-muted/50 transition-all duration-200"
                        >
                          <div className="font-medium text-foreground hover:text-primary">
                            {translatedDoc.name}
                          </div>
                          {/* Reserve space for description to prevent layout shift */}
                          <div className="h-8 mt-1">
                            {translatedDoc.description && (
                              <div className={cn(
                                "text-xs text-muted-foreground line-clamp-2 transition-opacity duration-200",
                                isHovered ? "opacity-100" : "opacity-0"
                              )}>
                                {translatedDoc.description}
                              </div>
                            )}
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm animate-in fade-in-0 slide-in-from-top-2 duration-300 ease-out">
      {/* Header */}
      <div className="border-b border-border bg-background/90 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                {searchQuery ? 'Search Results' : 
                 activeCategory === 'search' ? 'All Documents' :
                 activeCategory ? categoryContent[activeCategory as keyof typeof categoryContent] ? 
                   activeCategory.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' & ') 
                   : 'Documents' 
                 : 'Legal Documents'}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery ? `Search results for "${searchQuery}"` : 
                 'Find the right legal document for your needs'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Search Bar in Dropdown */}
          <div className="relative mt-4 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search all documents..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-10"
              autoFocus={activeCategory === 'search'}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onSearchChange('')}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-h-[calc(100vh-200px)] overflow-y-auto">
        {searchQuery || activeCategory === 'search' ? 
          renderSearchResults() : 
          activeCategory && renderCategoryContent(activeCategory)
        }
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-background/90 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Can't find what you're looking for?
            </p>
            <Link
              href={`/${locale}/docs/general-inquiry`}
              onClick={handleDocumentClick}
            >
              <Button variant="outline" size="sm">
                Contact Legal Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
