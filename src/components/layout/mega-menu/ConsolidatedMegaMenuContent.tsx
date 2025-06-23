// src/components/layout/mega-menu/ConsolidatedMegaMenuContent.tsx
'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Search, X, ChevronRight, FileText, Mail, FileCheck, Users, Building } from 'lucide-react';
import type { LegalDocument } from '@/lib/document-library';
import { getDocTranslation } from '@/lib/i18nUtils';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ConsolidatedMegaMenuContentProps {
  documents: LegalDocument[];
  onClose?: () => void;
  onLinkClick?: () => void;
  activeCategory?: string | null;
}

interface PanelSection {
  id: string;
  label: string;
  documents: string[];
}

interface Panel {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  sections: PanelSection[];
}

const panels: Panel[] = [
  {
    id: 'agreements-contracts',
    label: 'Agreements & Contracts',
    icon: FileText,
    sections: [
      {
        id: 'confidentiality',
        label: 'Confidentiality',
        documents: [
          'non-disclosure-agreement',
          'confidentiality-agreement',
          'employee-non-disclosure-agreement'
        ]
      },
      {
        id: 'license-ip',
        label: 'License & IP',
        documents: [
          'copyright-assignment',
          'copyright-license-agreement',
          'trademark-assignment',
          'patent-assignment',
          'software-license-agreement',
          'ip-assignment-agreement'
        ]
      },
      {
        id: 'service-sales',
        label: 'Service & Sales',
        documents: [
          'service-agreement',
          'business-contract',
          'consulting-agreement',
          'consulting-services-agreement'
        ]
      },
      {
        id: 'employment',
        label: 'Employment',
        documents: [
          'employment-contract',
          'independent-contractor-agreement',
          'non-compete-agreement',
          'commission-agreement'
        ]
      }
    ]
  },
  {
    id: 'letters-notices',
    label: 'Letters & Notices',
    icon: Mail,
    sections: [
      {
        id: 'payment-debt',
        label: 'Payment & Debt',
        documents: [
          'demand-letter-payment',
          'collection-letter',
          'debt-validation-letter'
        ]
      },
      {
        id: 'tenancy',
        label: 'Tenancy',
        documents: [
          'eviction-notice',
          'late-rent-notice'
        ]
      },
      {
        id: 'general',
        label: 'General',
        documents: [
          'complaint-letter',
          'cease-desist-letter',
          'breach-contract-notice',
          'contract-termination-letter'
        ]
      }
    ]
  },
  {
    id: 'forms-authorizations',
    label: 'Forms & Authorizations',
    icon: FileCheck,
    sections: [
      {
        id: 'personal',
        label: 'Personal',
        documents: [
          'durable-power-of-attorney',
          'advance-directive',
          'living-will'
        ]
      },
      {
        id: 'financial',
        label: 'Financial',
        documents: [
          'ach-authorization-form',
          'promissory-note',
          'loan-agreement'
        ]
      },
      {
        id: 'medical',
        label: 'Medical',
        documents: [
          'child-medical-consent'
        ]
      },
      {
        id: 'government',
        label: 'Government',
        documents: [
          'affidavit',
          'affidavit-general'
        ]
      }
    ]
  },
  {
    id: 'family-personal',
    label: 'Family & Personal',
    icon: Users,
    sections: [
      {
        id: 'protect',
        label: 'Protect',
        documents: [
          'last-will-testament'
        ]
      },
      {
        id: 'care',
        label: 'Care',
        documents: [
          'child-custody-agreement',
          'child-support-agreement'
        ]
      },
      {
        id: 'healthcare',
        label: 'Healthcare',
        documents: [
          'advance-directive',
          'living-will'
        ]
      }
    ]
  },
  {
    id: 'business-commercial',
    label: 'Business & Commercial',
    icon: Building,
    sections: [
      {
        id: 'finance',
        label: 'Finance',
        documents: [
          'promissory-note',
          'loan-agreement'
        ]
      },
      {
        id: 'property',
        label: 'Property',
        documents: [
          'lease-agreement',
          'quitclaim-deed',
          'property-deed',
          'commercial-lease-agreement',
          'vehicle-bill-of-sale',
          'bill-of-sale-general',
          'boat-bill-of-sale'
        ]
      }
    ]
  }
];

export default function ConsolidatedMegaMenuContent({
  documents,
  onClose,
  onLinkClick,
  activeCategory
}: ConsolidatedMegaMenuContentProps) {
  const { t, i18n } = useTranslation('common');
  const currentLocale = i18n.language as 'en' | 'es';
  const [searchQuery, setSearchQuery] = useState('');
  const [activePanel, setActivePanel] = useState(activeCategory || 'agreements-contracts');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // Create a map of document IDs to documents for quick lookup
  const documentMap = useMemo(() => {
    const map = new Map<string, LegalDocument>();
    documents.forEach(doc => {
      map.set(doc.id, doc);
    });
    return map;
  }, [documents]);

  // Filter documents based on search - show ALL documents when searching
  const searchResults = useMemo(() => {
    if (!searchQuery) return [];

    const query = searchQuery.toLowerCase();
    return documents.filter(doc => {
      if (doc.id === 'general-inquiry') return false;
      
      const translatedDoc = getDocTranslation(doc, currentLocale);
      const name = translatedDoc.name.toLowerCase();
      const description = translatedDoc.description?.toLowerCase() || '';
      const aliases = translatedDoc.aliases?.map(a => a.toLowerCase()) || [];
      
      return name.includes(query) || 
             description.includes(query) || 
             aliases.some(alias => alias.includes(query));
    });
  }, [searchQuery, documents, currentLocale]);

  // Group search results by their original categories for better organization
  const groupedSearchResults = useMemo(() => {
    if (!searchResults.length) return {};
    
    const grouped = searchResults.reduce((acc, doc) => {
      const category = doc.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(doc);
      return acc;
    }, {} as Record<string, typeof documents>);
    
    return grouped;
  }, [searchResults]);

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  }, []);

  const handleDocumentClick = useCallback(() => {
    onLinkClick?.();
    onClose?.();
  }, [onLinkClick, onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">What do you need help with?</h2>
              <p className="text-muted-foreground mt-1">
                Find the right legal document for your situation
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
          
          {/* Search Bar */}
          <div className="relative mt-4 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search all 320+ documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery('')}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {searchQuery ? (
          // Search Results View - Show ALL matching documents
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Found {searchResults.length} document{searchResults.length !== 1 ? 's' : ''} matching "{searchQuery}"
              </div>
              {searchResults.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="text-xs"
                >
                  Browse by Category
                </Button>
              )}
            </div>
            
            {Object.keys(groupedSearchResults).length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No documents found matching your search.</p>
                <p className="text-sm text-muted-foreground mt-2">Try different keywords or browse the categories below.</p>
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
                    <ul className="space-y-2 ml-7">
                      {docs.map(doc => {
                        const translatedDoc = getDocTranslation(doc, currentLocale);
                        return (
                          <li key={doc.id}>
                            <Link
                              href={`/${currentLocale}/docs/${doc.id}`}
                              onClick={handleDocumentClick}
                              className="block text-sm hover:text-primary hover:underline"
                            >
                              <div className="font-medium">{translatedDoc.name}</div>
                              {translatedDoc.description && (
                                <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {translatedDoc.description}
                                </div>
                              )}
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
        ) : (
          // Panel View
          <Tabs value={activePanel} onValueChange={setActivePanel}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 h-auto p-1">
              {panels.map(panel => (
                <TabsTrigger
                  key={panel.id}
                  value={panel.id}
                  className="flex items-center gap-2 py-3"
                >
                  <panel.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{panel.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {panels.map(panel => (
              <TabsContent key={panel.id} value={panel.id} className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {panel.sections.map(section => {
                    const isExpanded = expandedSections[section.id] !== false;
                    const visibleDocs = isExpanded ? section.documents : section.documents.slice(0, 5);
                    
                    return (
                      <div key={section.id} className="bg-card rounded-lg p-4">
                        <h3 className="font-semibold mb-3">{section.label}</h3>
                        <ul className="space-y-2">
                          {visibleDocs.map(docId => {
                            const doc = documentMap.get(docId);
                            if (!doc) return null;
                            
                            const translatedDoc = getDocTranslation(doc, currentLocale);
                            return (
                              <li key={docId}>
                                <Link
                                  href={`/${currentLocale}/docs/${doc.id}`}
                                  onClick={handleDocumentClick}
                                  className="flex items-center justify-between group hover:bg-muted p-2 -mx-2 rounded-md transition-colors"
                                >
                                  <span className="text-sm group-hover:text-primary">
                                    {translatedDoc.name}
                                  </span>
                                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                        
                        {section.documents.length > 5 && (
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => toggleSection(section.id)}
                            className="mt-2 p-0 h-auto"
                          >
                            {isExpanded ? 'Show less' : `Show ${section.documents.length - 5} more`}
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>

      {/* Footer CTA */}
      <div className="border-t mt-auto">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Can't find what you're looking for?
            </p>
            <Link
              href={`/${currentLocale}/docs/general-inquiry`}
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