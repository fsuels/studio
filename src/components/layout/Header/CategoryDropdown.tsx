// src/components/layout/Header/CategoryDropdown.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { resolveDocSlug } from '@/lib/slug-alias';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronDown, TrendingUp, Layers, Star, Sparkles, FileText, Shield, Users, Building, Briefcase, Scale, Heart, UserCheck, Home, Banknote, Gavel, Clipboard, Handshake, Globe, Car, Plane, Hotel, HeartHandshake, Zap, Search, Brain, ArrowRight, Loader2 } from 'lucide-react';
import { getDocTranslation } from '@/lib/i18nUtils';
import type { DocumentSummary } from '@/lib/workflow/document-workflow';
import { loadWorkflowModule } from '@/lib/workflow/load-workflow-module';
import { useDiscoveryModal } from '@/contexts/DiscoveryModalContext';
import { CATEGORY_MENU_CONTENT } from './categoryMenuContent';


interface CategoryDropdownProps {
  locale: 'en' | 'es';
  activeCategory: string | null;
  onLinkClick: () => void;
  isOpen: boolean;
}

// Category content mappings - User-intent focused
// High-value documents by category - prioritized by conversion rates and business value
const highValueDocumentsByCategory: Record<string, Set<string>> = {
  'business-operations': new Set([
    'non-disclosure-agreement',
    'service-agreement',
    'consulting-agreement',
    'business-contract'
  ]),
  'intellectual-property': new Set([
    'copyright-assignment',
    'trademark-license-agreement',
    'software-license-agreement',
    'licensing-agreement'
  ]),
  'employment-hr': new Set([
    'employment-contract',
    'independent-contractor-agreement',
    'non-compete-agreement',
    'employee-non-disclosure-agreement'
  ]),
  'partnerships': new Set([
    'partnership-agreement',
    'llc-operating-agreement',
    'joint-venture-agreement',
    'shareholder-agreement'
  ]),
  'payment-debt': new Set([
    'promissory-note',
    'loan-agreement',
    'demand-letter-payment'
  ]),
  'property-tenancy': new Set([
    'lease-agreement',
    'eviction-notice',
    'lease-termination-letter'
  ]),
  'legal-affidavits': new Set([
    'affidavit-general',
    'affidavit-of-identity'
  ]),
  'powers-attorney-directives': new Set([
    'durable-power-of-attorney',
    'living-will',
    'advance-directive'
  ]),
  'property-transactions': new Set([
    'vehicle-bill-of-sale',
    'bill-of-sale-general',
    'real-estate-purchase-agreement'
  ]),
  'estate-planning': new Set([
    'last-will-testament',
    'living-trust',
    'simple-will'
  ]),
  'business-formation': new Set([
    'llc-operating-agreement',
    'articles-of-incorporation',
    'corporate-bylaws'
  ])
};

// Best selling documents based on conversion data
const bestSellerDocuments = new Set([
  'llc-operating-agreement',
  'non-disclosure-agreement',
  'employment-contract',
  'lease-agreement',
  'last-will-testament',
  'independent-contractor-agreement',
  'partnership-agreement',
  'service-agreement'
]);

// Recently added or updated documents
const newDocuments = new Set([
  'data-processing-agreement',
  'cybersecurity-agreement',
  'telemedicine-agreement',
  'cryptocurrency-agreement',
  'solar-energy-agreement',
  'influencer-agreement'
]);

// Function to get section icons
const getSectionIcon = (sectionId: string) => {
  const iconProps = { className: "h-5 w-5 text-blue-600 dark:text-blue-400" };
  
  switch (sectionId) {
    // Business & Commercial
    case 'business-operations':
      return <Briefcase {...iconProps} />;
    case 'business-formation':
      return <Building {...iconProps} />;
    case 'intellectual-property':
      return <Shield {...iconProps} />;
    case 'partnerships':
      return <Handshake {...iconProps} />;
    
    // Employment & HR
    case 'employment-hr':
      return <UserCheck {...iconProps} />;
    case 'employment-hr-letters':
      return <Clipboard {...iconProps} />;
    
    // Financial & Legal
    case 'payment-debt':
      return <Banknote {...iconProps} />;
    case 'legal-affidavits':
      return <Gavel {...iconProps} />;
    case 'legal-business':
      return <Scale {...iconProps} />;
    
    // Healthcare & Personal
    case 'powers-attorney-directives':
      return <FileText {...iconProps} />;
    case 'medical-healthcare':
      return <Heart {...iconProps} />;
    
    // Family & Estate
    case 'estate-planning':
      return <Shield {...iconProps} />;
    case 'marriage-relationships':
      return <HeartHandshake {...iconProps} />;
    case 'children-family':
      return <Users {...iconProps} />;
    case 'personal-recreation':
      return <Star {...iconProps} />;
    
    // Real Estate & Property
    case 'commercial-real-estate':
      return <Building {...iconProps} />;
    case 'property-transactions':
      return <Home {...iconProps} />;
    case 'property-tenancy':
      return <Home {...iconProps} />;
    case 'financial-authorizations':
      return <Banknote {...iconProps} />;
    
    // Industry Specific
    case 'industry-specialized':
      return <Briefcase {...iconProps} />;
    case 'technology-digital':
      return <Globe {...iconProps} />;
    case 'agriculture-energy':
      return <Layers {...iconProps} />;
    case 'entertainment-media':
      return <Star {...iconProps} />;
    case 'travel-hospitality':
      return <Plane {...iconProps} />;
    
    default:
      return <FileText {...iconProps} />;
  }
};

export default function CategoryDropdown({
  locale,
  activeCategory,
  onLinkClick,
  isOpen
}: CategoryDropdownProps) {
  const { t } = useTranslation('common');
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);

  useEffect(() => {
    if (!isOpen || documents.length > 0 || isLoadingDocuments) {
      return;
    }

    let cancelled = false;
    setIsLoadingDocuments(true);

    loadWorkflowModule()
      .then((module) => {
        if (cancelled) return;
        setDocuments(module.getWorkflowDocuments({ jurisdiction: 'us' }));
      })
      .catch((error) => {
        if (!cancelled) {
          console.error('Failed to load workflow documents for CategoryDropdown:', error);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingDocuments(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, documents.length, isLoadingDocuments]);
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({});
  const [hoveredDocument, setHoveredDocument] = React.useState<string | null>(null);
  const { setShowDiscoveryModal } = useDiscoveryModal();

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
    const map = new Map<string, DocumentSummary>();
    documents.forEach((doc) => {
      map.set(doc.id, doc);
    });
    return map;
  }, [documents]);

  if (!isOpen || !activeCategory) return null;

  const content = CATEGORY_MENU_CONTENT[activeCategory as keyof typeof CATEGORY_MENU_CONTENT];
  if (!content) return null;

  if (documents.length === 0) {
    return (
      <div className="fixed inset-0 z-40 flex items-start justify-center pt-24">
        <div className="bg-background border border-border rounded-md px-6 py-8 shadow-lg text-center">
          <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            {t('categoryDropdown.loading', { defaultValue: 'Loading documents…' })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
        onClick={onLinkClick}
      />
      
      {/* Dropdown Content */}
      <div className={cn(
        "fixed top-16 left-0 right-0 z-40 bg-background border-b border-border shadow-lg animate-in slide-in-from-top-2 duration-200"
      )}>
      <div className="container mx-auto px-4 py-6 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-muted/50 scrollbar-track-transparent">
        <div className="mb-6 sticky top-0 bg-background pb-2 z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground">
                {t(`categoryDropdown.${activeCategory || 'agreements-contracts'}.title`, {
                  defaultValue: content.title,
                })}
              </h2>
              <p className="text-sm text-slate-700 dark:text-slate-200 mt-1">
                {t(`categoryDropdown.${activeCategory || 'agreements-contracts'}.subtitle`, {
                  defaultValue: content.subtitle || 'Choose from our professionally crafted templates',
                })}
              </p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-primary font-medium">
                  {t('categoryDropdown.tagline', {
                    defaultValue:
                      '✓ Empower Your Legal Needs • ✓ Professionally Drafted Templates • ✓ Ready in Minutes, Editable in Real Time',
                  })}
                </p>
                <p className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full animate-pulse">
                  {t('categoryDropdown.aiFinder', { defaultValue: 'AI Powered ✨' })}
                </p>
              </div>
            </div>
              <div className="ml-4 text-right">
              <button 
                onClick={() => {
                  setShowDiscoveryModal(true);
                  onLinkClick();
                }}
                className="group relative overflow-hidden inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5"
                title="AI-powered document finder - describe what you need in plain English!"
              >
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"></div>
                
                {/* Main content */}
                <div className="relative flex items-center gap-3">
                  {/* AI Brain Icon with glow effect */}
                  <div className="relative">
                    <Brain className="w-5 h-5 text-white drop-shadow-lg" />
                    <div className="absolute inset-0 bg-white/30 rounded-full blur-md animate-pulse"></div>
                  </div>
                  
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-bold leading-none">AI Document Finder</span>
                    <span className="text-xs text-emerald-100 leading-none mt-0.5">Find exactly what you need</span>
                  </div>
                  
                  {/* Arrow with movement animation */}
                  <ArrowRight className="w-4 h-4 text-white/90 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
                
                {/* Sparkle indicators */}
                <div className="absolute -top-1 -right-1 flex gap-1">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                  <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse delay-100"></div>
                </div>
                
                {/* Bottom highlight */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr">
          {content.sections.map(section => {
            // Get category-specific high-value documents
            const sectionHighValueDocs = highValueDocumentsByCategory[section.id] || new Set();
            
            // Sort documents to show high-value ones first, then best sellers
            const sortedDocuments = section.documents
              .filter(docId => documentMap.has(docId))
              .sort((a, b) => {
                const aIsHighValue = sectionHighValueDocs.has(a);
                const bIsHighValue = sectionHighValueDocs.has(b);
                const aIsBestSeller = bestSellerDocuments.has(a);
                const bIsBestSeller = bestSellerDocuments.has(b);
                
                // High value documents first
                if (aIsHighValue && !bIsHighValue) return -1;
                if (!aIsHighValue && bIsHighValue) return 1;
                
                // Then best sellers
                if (aIsBestSeller && !bIsBestSeller) return -1;
                if (!aIsBestSeller && bIsBestSeller) return 1;
                
                return 0;
              });
              
            return (
            <div key={section.id} className="flex flex-col h-full bg-card/50 rounded-lg border border-border/30 hover:border-border/50 transition-colors overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 px-4 py-3 -mx-[1px] -mt-[1px] border-b border-blue-200/60 dark:border-blue-800/40 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="w-1 h-4 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                    {getSectionIcon(section.id)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base text-blue-900 dark:text-blue-100 leading-tight">
                      {section.label}
                    </h3>
                    <span className="text-xs text-blue-700 dark:text-blue-300 mt-0.5 inline-block font-medium">
                      {sortedDocuments.length} {sortedDocuments.length === 1 ? 'document' : 'documents'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4 pt-3">
              <div className="relative flex-1 min-h-0">
                <div className="transition-all duration-300 ease-in-out">
                <ul className="space-y-2">
                  {sortedDocuments
                    .slice(0, expandedSections[section.id] ? sortedDocuments.length : 4) // Show 4 or all documents
                    .map((docId, index) => {
                      const doc = documentMap.get(docId)!;
                      const translatedDoc = getDocTranslation(doc, locale);
                      const isHighValue = sectionHighValueDocs.has(docId);
                      const isBestSeller = bestSellerDocuments.has(docId);
                      const isNew = newDocuments.has(docId);
                      const isExpanded = expandedSections[section.id];
                      const isNewlyVisible = isExpanded && index >= 4;
                      const isHovered = hoveredDocument === doc.id;
                      
                      return (
                        <li 
                          key={docId}
                          className={cn(
                            "transition-all duration-300",
                            isNewlyVisible && "animate-in fade-in slide-in-from-top-2"
                          )}
                        >
                          <Link
                            href={`/${locale}/docs/${resolveDocSlug(doc.id)}`}
                            onClick={onLinkClick}
                            onMouseEnter={() => setHoveredDocument(doc.id)}
                            onMouseLeave={() => setHoveredDocument(null)}
                            className={cn(
                              "group flex items-start justify-between p-2 rounded-md transition-all duration-200 hover:shadow-sm",
                              isBestSeller ? "hover:bg-blue-50/70 ring-1 ring-blue-100/50" : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                            )}
                            title={isBestSeller ? "📈 Popular choice - frequently selected by users" : undefined}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <div className="font-medium text-sm text-foreground group-hover:text-primary truncate">
                                  {translatedDoc.name}
                                </div>
                                <div className="flex gap-1 flex-wrap">
                                  {isNew && index < 4 && (
                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full shrink-0">
                                      <Sparkles className="h-2.5 w-2.5" />
                                      <span className="text-xs">New</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                              {/* Reserve space for description to prevent layout shift */}
                              <div className="h-8 mt-1">
                                {translatedDoc.description && (
                                  <div className={cn(
                                    "text-xs text-slate-700 dark:text-slate-200 line-clamp-2 transition-opacity duration-200",
                                    isHovered ? "opacity-100" : "opacity-0"
                                  )}>
                                    {translatedDoc.description}
                                  </div>
                                )}
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-500 dark:text-slate-400 group-hover:text-primary ml-2 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
                          </Link>
                        </li>
                      );
                    })}
                </ul>
                </div>
                {sortedDocuments.length > 4 && (
                  <div className={cn(
                    "mt-3 relative z-10 transition-all duration-300",
                    expandedSections[section.id] ? "border-t border-border/50 pt-3" : ""
                  )}>
                    <button 
                      onClick={() => toggleSection(section.id)}
                      className={cn(
                        "group w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg",
                        "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-foreground",
                        "transition-all duration-200 hover:shadow-sm",
                        "focus:outline-none focus:ring-2 focus:ring-primary/20",
                        "border border-transparent hover:border-slate-300 dark:hover:border-slate-500"
                      )}
                      aria-expanded={expandedSections[section.id]}
                      aria-label={
                        expandedSections[section.id]
                          ? t('categoryDropdown.showFewer', { defaultValue: 'Show fewer' })
                          : t('categoryDropdown.viewAll', { 
                              count: sortedDocuments.length - 4,
                              defaultValue: `View all ${sortedDocuments.length - 4} more`,
                            })
                      }
                      title="Expand list here in this menu"
                    >
                      <Layers className="h-3.5 w-3.5 text-slate-700 dark:text-slate-200" />
                      <span className="flex items-center gap-1">
                        {expandedSections[section.id]
                          ? t('categoryDropdown.showFewer', { defaultValue: 'Show fewer' })
                          : (
                              <>
                                {t('categoryDropdown.viewAll', { defaultValue: 'View all' })}
                                <span className="text-xs text-slate-700 dark:text-slate-200">(+{sortedDocuments.length - 4})</span>
                              </>
                            )}
                      </span>
                      <ChevronDown 
                        className={cn(
                          "h-4 w-4 transition-transform duration-300 text-slate-700 dark:text-slate-200",
                          expandedSections[section.id] && "rotate-180"
                        )} 
                      />
                    </button>
                  </div>
                )}
              </div>
              </div>
            </div>
            );
          })}
        </div>
        
        {/* View All Link */}
        <div className="mt-6 pt-4 border-t border-border">
          <Link
            href={`/${locale}/?category=${encodeURIComponent(activeCategory)}`}
            onClick={onLinkClick}
            className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80"
          >
            {t('categoryDropdown.viewAllCategory', {
              category: content.title.toLowerCase(),
              defaultValue: `View all ${content.title.toLowerCase()}`,
            })}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
