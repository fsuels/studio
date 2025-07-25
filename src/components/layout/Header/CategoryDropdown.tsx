// src/components/layout/Header/CategoryDropdown.tsx
'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronDown, TrendingUp, Layers, Star, Sparkles, FileText, Shield, Users, Building, Briefcase, Scale, Heart, UserCheck, Home, Banknote, Gavel, Clipboard, Handshake, Globe, Car, Plane, Hotel, HeartHandshake, Zap, Search, Brain, ArrowRight } from 'lucide-react';
import { getDocumentsForCountry } from '@/lib/document-library';
import { getDocTranslation } from '@/lib/i18nUtils';
import { useDiscoveryModal } from '@/contexts/DiscoveryModalContext';
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

const categoryContent: Record<string, CategoryContent> = {
  'agreements-contracts': {
    title: 'Agreements & Contracts',
    subtitle: 'Protect your business interests and avoid costly disputes',
    sections: [
      {
        id: 'business-operations',
        label: 'Business Operations',
        documents: ['business-contract', 'service-agreement', 'consulting-agreement', 'sales-agreement', 'purchase-agreement', 'vendor-agreement', 'letter-of-intent', 'non-disclosure-agreement', 'general-contractor-agreement', 'subcontractor-agreement', 'catering-agreement', 'auto-repair-agreement', 'consulting-services-agreement', 'bookkeeping-services-agreement', 'website-development-agreement', 'app-development-agreement', 'cloud-services-agreement', 'cybersecurity-agreement', 'government-contract-agreement']
      },
      {
        id: 'intellectual-property',
        label: 'Intellectual Property & Licensing',
        documents: ['copyright-assignment', 'copyright-license-agreement', 'trademark-assignment', 'trademark-license-agreement', 'patent-assignment', 'patent-license-agreement', 'licensing-agreement', 'software-license-agreement', 'music-licensing-agreement', 'data-processing-agreement', 'digital-asset-agreement', 'content-creation-agreement', 'brand-licensing-agreement', 'franchise-agreement', 'ecommerce-terms-of-service']
      },
      {
        id: 'employment-hr',
        label: 'Employment & HR',
        documents: ['employment-contract', 'independent-contractor-agreement', 'non-compete-agreement', 'commission-agreement', 'employee-non-disclosure-agreement', 'severance-agreement', 'executive-employment-agreement', 'internship-agreement', 'work-from-home-agreement', 'volunteer-agreement', 'employment-offer-letter', 'employment-termination-letter', 'employee-warning-notice', 'resignation-letter', 'employment-verification-letter', 'salary-verification-letter', 'progressive-discipline-policy', 'employee-evaluation-form', 'employee-handbook']
      },
      {
        id: 'partnerships',
        label: 'Partnerships & Investments',
        documents: ['partnership-agreement', 'partnership-amendment', 'partnership-dissolution-agreement', 'joint-venture-agreement', 'limited-partnership-agreement', 'buy-sell-agreement', 'investment-agreement', 'startup-equity-agreement', 'private-placement-memorandum', 'shareholder-agreement', 'franchise-disclosure-agreement', 'business-sale-agreement', 'equity-incentive-plan', 'retirement-plan-agreement', 'sponsorship-agreement']
      }
    ]
  },
  'letters-notices': {
    title: 'Letters & Notices',
    subtitle: 'Handle disputes professionally and protect your rights',
    sections: [
      {
        id: 'payment-debt',
        label: 'Payment & Debt',
        documents: ['demand-letter-payment', 'collection-letter', 'debt-validation-letter', 'debt-settlement-agreement', 'promissory-note', 'loan-agreement', 'loan-modification-agreement', 'personal-loan-agreement', 'credit-card-agreement']
      },
      {
        id: 'property-tenancy',
        label: 'Property & Tenancy',
        documents: ['eviction-notice', 'late-rent-notice', 'lease-termination-letter', 'notice-to-pay-rent-or-quit', 'notice-to-enter', 'notice-of-lease-violation', 'rent-increase-letter', 'lease-amendment', 'lease-addendum', 'tenant-maintenance-request', 'residential-rental-application']
      },
      {
        id: 'employment-hr-letters',
        label: 'Employment & HR',
        documents: ['employment-verification-letter', 'resignation-letter', 'employee-warning-notice', 'employment-offer-letter', 'employment-termination-letter', 'salary-verification-letter', 'proof-of-income-letter', 'two-weeks-notice-letter', 'leave-of-absence-request-form', 'name-change-notification-letter']
      },
      {
        id: 'legal-business',
        label: 'Legal & Business',
        documents: ['complaint-letter', 'cease-desist-letter', 'breach-contract-notice', 'contract-termination-letter', 'force-majeure-notice', 'membership-cancellation-letter', 'demand-letter', 'termination-letter']
      }
    ]
  },
  'forms-authorizations': {
    title: 'Forms & Authorizations',
    subtitle: 'Ensure compliance and secure your legal standing',
    sections: [
      {
        id: 'legal-affidavits',
        label: 'Legal Affidavits & Court Documents',
        documents: ['affidavit-general', 'affidavit-of-death', 'affidavit-of-heirship', 'affidavit-of-identity', 'immigration-affidavit', 'court-filing-document', 'small-claims-worksheet', 'incident-report', 'accident-report', 'notarization-request']
      },
      {
        id: 'powers-attorney-directives',
        label: 'Powers of Attorney & Health Directives',
        documents: ['durable-power-of-attorney', 'power-of-attorney', 'healthcare-power-of-attorney', 'medical-power-of-attorney', 'power-of-attorney-for-child', 'revocation-of-power-of-attorney', 'advance-directive', 'health-care-directive', 'living-will', 'medical-consent']
      },
      {
        id: 'medical-healthcare',
        label: 'Medical & Healthcare',
        documents: ['child-medical-consent', 'medical-consent-form', 'hipaa-authorization-form', 'covid19-health-screening', 'telemedicine-agreement', 'clinical-trial-agreement', 'elder-care-agreement']
      },
      {
        id: 'financial-authorizations',
        label: 'Financial & Banking',
        documents: ['ach-authorization-form', 'direct-deposit-form', 'insurance-claim-form', 'mortgage-agreement', 'security-agreement', 'earnest-money-agreement']
      },
      {
        id: 'property-transactions',
        label: 'Property & Vehicle Transactions',
        documents: ['vehicle-bill-of-sale', 'bill-of-sale-general', 'boat-bill-of-sale', 'property-deed', 'quitclaim-deed', 'warranty-deed', 'real-estate-purchase-agreement']
      }
    ]
  },
  'family-personal': {
    title: 'Family & Personal Life',
    subtitle: 'Protect your loved ones and secure your legacy',
    sections: [
      {
        id: 'estate-planning',
        label: 'Estate Planning & Wills',
        documents: ['last-will-testament', 'simple-will', 'pour-over-will', 'codicil-to-will', 'living-trust', 'joint-living-trust', 'living-trust-amendment', 'education-trust', 'guardianship-agreement']
      },
      {
        id: 'marriage-relationships',
        label: 'Marriage & Relationships',
        documents: ['prenuptial-agreement', 'postnuptial-agreement', 'cohabitation-agreement', 'marriage-separation-agreement', 'separation-agreement', 'divorce-settlement', 'divorce-settlement-agreement']
      },
      {
        id: 'children-family',
        label: 'Children & Family Care',
        documents: ['child-custody-agreement', 'child-support-agreement', 'child-care-contract', 'child-care-authorization-form', 'child-travel-consent', 'parenting-plan', 'adoption-agreement', 'pet-custody-agreement']
      },
      {
        id: 'personal-recreation',
        label: 'Personal & Recreation',
        documents: ['donation-agreement', 'membership-agreement', 'fitness-waiver', 'personal-training-agreement', 'athletic-scholarship-agreement', 'pet-agreement', 'dog-breeding-agreement', 'horse-boarding-agreement', 'personal-care-agreement', 'lottery-pool-contract']
      }
    ]
  },
  'business-commercial': {
    title: 'Business & Commercial',
    subtitle: 'Scale your business confidently with professional documentation',
    sections: [
      {
        id: 'business-formation',
        label: 'Business Formation & Governance',
        documents: ['articles-of-incorporation', 'articles-of-incorporation-biz', 'corporate-bylaws', 'nonprofit-bylaws', 'llc-operating-agreement', 'business-plan', 'board-resolution', 'consignment-agreement', 'arbitration-agreement', 'mediation-agreement', 'settlement-agreement']
      },
      {
        id: 'commercial-real-estate',
        label: 'Commercial Real Estate',
        documents: ['commercial-lease-agreement', 'commercial-lease-with-option-to-purchase', 'lease-agreement', 'rental-agreement', 'residential-lease-agreement', 'sublease-agreement', 'triple-net-lease', 'office-space-lease', 'retail-space-lease', 'restaurant-lease', 'warehouse-lease', 'storage-space-lease-agreement', 'parking-space-lease-agreement', 'property-manager-agreement']
      },
      {
        id: 'industry-specialized',
        label: 'Industry-Specialized Services',
        documents: ['construction-contract', 'home-improvement-contract', 'catering-agreement', 'restaurant-agreement', 'bar-agreement', 'hotel-agreement', 'auto-repair-agreement', 'automotive-service-agreement', 'vehicle-lease-agreement', 'transportation-service-agreement', 'ride-sharing-agreement', 'food-truck-agreement', 'event-planning-contract', 'tuition-agreement', 'coaching-agreement', 'tutoring-agreement']
      },
      {
        id: 'agriculture-energy',
        label: 'Agriculture, Energy & Natural Resources',
        documents: ['agricultural-agreement', 'farm-lease-agreement', 'crop-sharing-agreement', 'livestock-purchase-agreement', 'timber-sale-agreement', 'water-rights-agreement', 'hunting-lease-agreement', 'mining-agreement', 'mining-lease-agreement', 'oil-gas-lease-agreement', 'solar-energy-agreement', 'environmental-agreement']
      },
      {
        id: 'technology-digital',
        label: 'Technology & Digital Services',
        documents: ['app-development-agreement', 'website-development-agreement', 'cloud-services-agreement', 'data-processing-agreement', 'software-license-agreement', 'cybersecurity-agreement', 'digital-asset-agreement', 'cryptocurrency-agreement', 'ecommerce-terms-of-service', 'international-trade-agreement']
      },
      {
        id: 'entertainment-media',
        label: 'Entertainment & Media',
        documents: ['film-production-agreement', 'recording-artist-agreement', 'talent-agreement', 'talent-management-agreement', 'music-licensing-agreement', 'photography-release', 'influencer-agreement', 'brand-ambassador-agreement', 'affiliate-marketing-agreement', 'social-media-management-agreement', 'gaming-agreement', 'sports-agreement']
      },
      {
        id: 'travel-hospitality',
        label: 'Travel & Hospitality',
        documents: ['vacation-rental-agreement', 'travel-insurance-agreement', 'maritime-charter-agreement', 'aviation-charter-agreement']
      }
    ]
  }
};

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
  const documents = getDocumentsForCountry('us');
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
                  onLinkClick(); // Close the dropdown
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
                            href={`/${locale}/docs/${doc.id}`}
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