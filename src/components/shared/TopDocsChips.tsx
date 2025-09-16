// src/components/TopDocsChips.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { resolveDocSlug } from '@/lib/slug-alias';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTranslation } from 'react-i18next';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useDiscoveryModal } from '@/contexts/DiscoveryModalContext';
import {
  Loader2,
  FileText,
  Home,
  Users,
  Clock,
  Zap,
  RefreshCcw,
  Briefcase,
  Shield,
  Building2,
  BadgeDollarSign,
  Gavel,
  Copyright,
  type LucideIcon,
} from 'lucide-react';
import type { LegalDocument } from '@/types/documents';
import documentLibrary, { getDocumentsByCountry } from '@/lib/document-library';
// (No need for mobile-only dropdown after redesign)

const TopDocsChips = React.memo(function TopDocsChips() {
  // Use 'common' namespace for shared UI text
  const { t: tCommon } = useTranslation('common');
  const params = (useParams<{ locale?: string }>() ?? {}) as {
    locale?: string;
  };
  const router = useRouter();
  const { setShowDiscoveryModal } = useDiscoveryModal();
  const locale = (params.locale as 'en' | 'es') || 'en';

  const [topDocs, setTopDocs] = useState<LegalDocument[]>(documentLibrary);
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const [tax, setTax] = useState<any | null>(null);
  // Progressive reveal: start with NO selection (only category cards)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAllForCategory, setShowAllForCategory] = useState(false);
  const badges: Record<string, 'new' | 'updated'> = {
    powerOfAttorney: 'new',
    leaseAgreement: 'updated',
  };
  
  // Get all categories from taxonomy (loaded lazily)
  const allCategories = useMemo(() => Object.keys(tax?.categories || {}), [tax]);
  const searchParams = useSearchParams();
  
  // Category display names and icons - using all your categories
  const categoryMeta: Record<string, { label: string; icon: LucideIcon }> = tax ? {
    'real-estate-property': {
      label: tCommon('categories.realEstate', {
        defaultValue: 'Real Estate & Property',
      }),
      icon: Home,
    },
    'employment-hr': {
      label: tCommon('categories.employment', {
        defaultValue: 'Employment & HR',
      }),
      icon: Briefcase,
    },
    'personal-family': {
      label: tCommon('categories.personalFamily', {
        defaultValue: 'Personal & Family',
      }),
      icon: Users,
    },
    'health-care': {
      label: tCommon('categories.healthCare', {
        defaultValue: 'Health & Care',
      }),
      icon: Shield,
    },
    'finance-lending': {
      label: tCommon('categories.finance', {
        defaultValue: 'Finance & Lending',
      }),
      icon: BadgeDollarSign,
    },
    'business-startups': {
      label: tCommon('categories.businessStartups', {
        defaultValue: 'Business & Start-ups',
      }),
      icon: Building2,
    },
    'ip-creative': {
      label: tCommon('categories.ipCreative', {
        defaultValue: 'IP & Creative Works',
      }),
      icon: Copyright,
    },
    'legal-process-disputes': {
      label: tCommon('categories.legalProcessDisputes', {
        defaultValue: 'Legal Process & Disputes',
      }),
      icon: Gavel,
    },
    'estate-planning': {
      label: tCommon('categories.estatePlanning', {
        defaultValue: 'Estate Planning',
      }),
      icon: FileText,
    },
    'construction-trades': {
      label: tCommon('categories.constructionTrades', {
        defaultValue: 'Construction & Trades',
      }),
      icon: FileText,
    },
    'technology-digital': {
      label: tCommon('categories.technologyDigital', {
        defaultValue: 'Technology & Digital',
      }),
      icon: FileText,
    },
    'agriculture-energy': {
      label: tCommon('categories.agricultureEnergy', {
        defaultValue: 'Agriculture & Energy',
      }),
      icon: FileText,
    },
    'vehicles-equipment': {
      label: tCommon('categories.vehiclesEquipment', {
        defaultValue: 'Vehicles & Equipment',
      }),
      icon: FileText,
    },
    'general-forms': {
      label: tCommon('categories.generalForms', {
        defaultValue: 'General Forms',
      }),
      icon: FileText,
    },
    'ip-creative-works': {
      label: tCommon('categories.ipCreativeWorksMedia', {
        defaultValue: 'IP & Creative Works (Media)',
      }),
      icon: FileText,
    },
    'assets-gear': {
      label: tCommon('categories.assetsGear', {
        defaultValue: 'Assets & Gear',
      }),
      icon: FileText,
    },
  } : {} as any;

  // Short descriptions for category cards (shown in the new grid)
  const categoryDescriptions: Record<string, string> = tax ? {
    'real-estate-property': tCommon('categoryDescriptions.realEstate', {
      defaultValue: 'Leases, deeds, eviction notices and more.',
    }),
    'employment-hr': tCommon('categoryDescriptions.employment', {
      defaultValue: 'Contracts, policies, termination letters, and more.',
    }),
    'personal-family': tCommon('categoryDescriptions.personalFamily', {
      defaultValue: 'Wills, powers of attorney, prenuptial agreements.',
    }),
    'health-care': tCommon('categoryDescriptions.healthCare', {
      defaultValue: 'Living wills, HIPAA, healthcare proxies, medical forms.',
    }),
    'finance-lending': tCommon('categoryDescriptions.finance', {
      defaultValue: 'Loans, promissory notes, bills of sale.',
    }),
    'business-startups': tCommon('categoryDescriptions.businessStartups', {
      defaultValue: 'NDAs, partnership agreements, operating agreements.',
    }),
    'ip-creative': tCommon('categoryDescriptions.ipCreative', {
      defaultValue: 'Copyright, trademarks, licensing agreements.',
    }),
    'legal-process-disputes': tCommon('categoryDescriptions.legalProcessDisputes', {
      defaultValue: 'Cease & desist, affidavits, demand letters.',
    }),
    'estate-planning': tCommon('categoryDescriptions.estatePlanning', {
      defaultValue: 'Estate plans, trusts, guardianship, beneficiary forms.',
    }),
    'construction-trades': tCommon('categoryDescriptions.constructionTrades', {
      defaultValue: 'Construction contracts, bids, lien waivers.',
    }),
    'technology-digital': tCommon('categoryDescriptions.technologyDigital', {
      defaultValue: 'SaaS, terms, data processing, licensing.',
    }),
    'agriculture-energy': tCommon('categoryDescriptions.agricultureEnergy', {
      defaultValue: 'Farm leases, supply, energy services.',
    }),
    'vehicles-equipment': tCommon('categoryDescriptions.vehiclesEquipment', {
      defaultValue: 'Vehicle sale, title transfer, equipment leases.',
    }),
    'general-forms': tCommon('categoryDescriptions.generalForms', {
      defaultValue: 'General purpose contracts, notices, letters.',
    }),
    'ip-creative-works': tCommon('categoryDescriptions.ipCreativeWorksMedia', {
      defaultValue: 'Media releases, content licenses, collaboration.',
    }),
    'assets-gear': tCommon('categoryDescriptions.assetsGear', {
      defaultValue: 'Purchase, loan, rental and lease forms.',
    }),
  } : {} as any;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // If URL contains ?category=<key>, preselect it
  useEffect(() => {
    if (!isHydrated) return;
    const catFromUrl = searchParams?.get('category');
    if (catFromUrl && allCategories.includes(catFromUrl)) {
      setSelectedCategory(catFromUrl);
    }
  }, [isHydrated, searchParams, allCategories]);

  useEffect(() => {
    if (!isHydrated) return;
    let cancelled = false;
    (async () => {
      try {
        const [docs, { taxonomy }] = await Promise.all([
          getDocumentsByCountry('us'),
          import('@/config/taxonomy'),
        ]);
        if (!cancelled) {
          setTopDocs(docs.length ? docs : documentLibrary);
          setTax(taxonomy);
          setIsLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setTopDocs(documentLibrary);
          setIsLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isHydrated]);

  const categories = useMemo(
    () => allCategories.filter((cat) => categoryMeta[cat]),
    [allCategories, categoryMeta],
  );
  // After redesign we show the full category grid responsively
  // Create mapping from taxonomy keys to document category names
  const taxonomyToDocCategory: Record<string, string[]> = tax ? {
    'real-estate-property': ['Real Estate', 'Property'],
    'employment-hr': ['Employment', 'HR'],
    'personal-family': ['Personal', 'Family'],
    'health-care': ['Health', 'Healthcare', 'Medical'],
    'finance-lending': ['Finance', 'Financial', 'Lending'],
    'business-startups': ['Business', 'Corporate'],
    'ip-creative': ['Intellectual Property', 'IP', 'Creative'],
    'legal-process-disputes': ['Legal', 'Disputes'],
    'estate-planning': ['Estate Planning', 'Estate'],
    'construction-trades': ['Construction', 'Trades'],
    'technology-digital': ['Technology', 'Digital'],
    'agriculture-energy': ['Agriculture', 'Energy'],
    'vehicles-equipment': ['Vehicles', 'Equipment'],
    'general-forms': ['General', 'Forms'],
    'ip-creative-works': ['Creative Works', 'Media'],
    'assets-gear': ['Assets', 'Gear'],
  } : {} as any;

  // Filter documents by selected category
  const filteredDocs = useMemo(() => {
    if (!selectedCategory) return [] as LegalDocument[];
    const validCategories = taxonomyToDocCategory[selectedCategory] || [];
    return topDocs.filter((doc) =>
      validCategories.includes(doc.category) || doc.category === selectedCategory
    );
  }, [topDocs, selectedCategory, taxonomyToDocCategory]);

  const handleExploreAll = () => {
    setShowDiscoveryModal(true);
  };

  if (isLoading && isHydrated) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
        <p className="text-sm text-slate-700 dark:text-slate-200 mt-2">
          {tCommon('TopDocsChips.loading', {
            defaultValue: 'Loading popular documents...',
          })}
        </p>
      </div>
    );
  }

  if (!isHydrated || topDocs.length === 0) {
    return isHydrated ? null : <div className="h-20" />;
  }

  return (
    <TooltipProvider>
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-xl font-semibold text-center mb-6 text-foreground">
          {tCommon('TopDocsChips.title', {
            defaultValue: 'Popular Legal Documents',
          })}
        </h2>
        {/* Phase 1: Show a small, curated category grid first */}
        {!selectedCategory && categories.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
              {/* Curated set to reduce overwhelm */}
              {[
                'real-estate-property',
                'employment-hr',
                'personal-family',
                'health-care',
                'finance-lending',
                'business-startups',
                'ip-creative',
                'legal-process-disputes',
              ].map((cat) => {
                if (!categoryMeta[cat]) return null;
                const Icon = categoryMeta[cat]?.icon || FileText;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setShowAllForCategory(false);
                    }}
                    className="text-left rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-sky-300 hover:bg-white/90"
                  >
                    <div className="flex items-start gap-3">
                      {Icon && (
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                          <Icon className="h-6 w-6" />
                        </span>
                      )}
                      <div>
                        <div className="font-semibold text-[15px] text-slate-900">
                          {categoryMeta[cat]?.label || cat}
                        </div>
                        <p className="mt-1 text-[12.5px] leading-5 text-slate-600">
                          {categoryDescriptions[cat] || ''}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="text-center mt-2">
              <Button variant="link" onClick={handleExploreAll} className="text-primary text-sm">
                {tCommon('stepOne.exploreAllCategoriesButton', {
                  defaultValue: 'Explore All Document Categories',
                })} →
              </Button>
            </div>
          </>
        )}

        {/* Phase 2: After a category is selected, show filtered docs only */}
        {selectedCategory && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-foreground" id="popular-docs-selected">
                {categoryMeta[selectedCategory]?.label || selectedCategory}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)}>
                {tCommon('changeCategory', { defaultValue: 'Back to categories' })}
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(showAllForCategory ? filteredDocs : filteredDocs.slice(0, 12)).map((doc) => {
                const Icon = categoryMeta[doc.category]?.icon || FileText;
                const badge = badges[doc.id];
                return (
                  <Link
                    key={doc.id}
                    href={`/${locale}/docs/${resolveDocSlug(doc.id)}`}
                    prefetch
                    className="p-4 border border-gray-200 rounded-lg bg-card shadow-sm transition-all hover:-translate-y-[2px] hover:shadow-lg hover:border-[#006EFF] hover:bg-muted"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {React.createElement(Icon, {
                          className: 'h-4 w-4 text-primary/80',
                        })}
                        <span className="text-sm font-medium">
                          {doc.translations?.[locale as 'en' | 'es']?.name ||
                            doc.translations?.en?.name ||
                            doc.name ||
                            doc.id}
                        </span>
                      </div>
                      {badge && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="secondary"
                              className="flex items-center space-x-1"
                            >
                              {badge === 'new' ? (
                                <Zap className="h-3 w-3" />
                              ) : (
                                <RefreshCcw className="h-3 w-3" />
                              )}
                              <span className="capitalize">
                                {tCommon(`TopDocsChips.badge.${badge}`, {
                                  defaultValue: badge === 'new' ? 'New' : 'Updated',
                                })}
                              </span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            {badge === 'new'
                              ? tCommon('TopDocsChips.tooltip.new', {
                                  defaultValue: 'Recently added',
                                })
                              : tCommon('TopDocsChips.tooltip.updated', {
                                  defaultValue: 'Recently refreshed',
                                })}
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="mt-2 flex items-center gap-1 text-xs text-slate-700 dark:text-slate-200">
                          <Clock className="h-3 w-3" />
                          ~3 min
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>Average completion time</TooltipContent>
                    </Tooltip>
                  </Link>
                );
              })}
            </div>
            <div className="text-center mt-6 space-x-4">
              {!showAllForCategory && filteredDocs.length > 12 && (
                <Button variant="secondary" size="sm" onClick={() => setShowAllForCategory(true)}>
                  {tCommon('showMore', { defaultValue: 'Show more' })}
                </Button>
              )}
              <Button
                variant="link"
                onClick={() => router.push(`/${locale}/category/${selectedCategory}`)}
                className="text-primary text-sm"
              >
                {tCommon('viewAllInCategory', { defaultValue: 'View all in category' })} →
              </Button>
            </div>
          </>
        )}
        
      </section>
    </TooltipProvider>
  );
});
export default TopDocsChips;
