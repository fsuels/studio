// src/components/shared/TopDocsChips.tsx
'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { useRouter } from 'next/navigation';
import { useCurrentSearchParams } from '@/hooks/useCurrentSearchParams';
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
import type { DocumentSummary } from '@/lib/workflow/document-workflow';
import { CURATED_CATEGORY_KEYS, matchesCategoryLabel } from '@/lib/homepage/popular-docs-config';

type TopDocsChipsProps = {
  locale: 'en' | 'es';
  initialDocs?: DocumentSummary[];
};

type CategoryMeta = {
  labelKey: string;
  icon: LucideIcon;
};

const CATEGORY_DISPLAY_META: Record<string, CategoryMeta> = {
  'real-estate-property': { labelKey: 'categories.realEstate', icon: Home },
  'employment-hr': { labelKey: 'categories.employment', icon: Briefcase },
  'personal-family': { labelKey: 'categories.personalFamily', icon: Users },
  'health-care': { labelKey: 'categories.healthCare', icon: Shield },
  'finance-lending': { labelKey: 'categories.finance', icon: BadgeDollarSign },
  'business-startups': { labelKey: 'categories.businessStartups', icon: Building2 },
  'ip-creative': { labelKey: 'categories.ipCreative', icon: Copyright },
  'legal-process-disputes': { labelKey: 'categories.legalProcessDisputes', icon: Gavel },
};

const CATEGORY_DESCRIPTION_KEYS: Record<string, string> = {
  'real-estate-property': 'categoryDescriptions.realEstate',
  'employment-hr': 'categoryDescriptions.employment',
  'personal-family': 'categoryDescriptions.personalFamily',
  'health-care': 'categoryDescriptions.healthCare',
  'finance-lending': 'categoryDescriptions.finance',
  'business-startups': 'categoryDescriptions.businessStartups',
  'ip-creative': 'categoryDescriptions.ipCreative',
  'legal-process-disputes': 'categoryDescriptions.legalProcessDisputes',
};

const CATEGORY_DESCRIPTION_DEFAULTS: Record<string, string> = {
  'real-estate-property': 'Leases, deeds, eviction notices and more.',
  'employment-hr': 'Contracts, policies, termination letters, and more.',
  'personal-family': 'Wills, powers of attorney, prenuptial agreements.',
  'health-care': 'Living wills, HIPAA, healthcare proxies, medical forms.',
  'finance-lending': 'Loans, promissory notes, bills of sale.',
  'business-startups': 'NDAs, partnership agreements, operating agreements.',
  'ip-creative': 'Copyright, trademarks, licensing agreements.',
  'legal-process-disputes': 'Cease & desist, affidavits, demand letters.',
};

const DOC_BADGES: Record<string, 'new' | 'updated'> = {
  powerOfAttorney: 'new',
  leaseAgreement: 'updated',
};

const normalizeDisplayName = (doc: DocumentSummary) => {
  const name = doc.translations?.en?.name || doc.title || doc.id;
  return name.trim().toLowerCase();
};


const TopDocsChips = React.memo(function TopDocsChips({
  locale,
  initialDocs = [],
}: TopDocsChipsProps) {
  const { t: tCommon } = useTranslation('common');
  const router = useRouter();
  const searchParams = useCurrentSearchParams();

  const exploreAllDestination = `/${locale}/docs`;
  const prefetchExplore = React.useCallback(() => {
    try {
      router.prefetch(exploreAllDestination);
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.debug('Explore all prefetch failed', error);
      }
    }
  }, [exploreAllDestination, router]);

  const [topDocs, setTopDocs] = useState<DocumentSummary[]>(initialDocs);
  const [isLoading, setIsLoading] = useState(initialDocs.length === 0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAllForCategory, setShowAllForCategory] = useState(false);
  const prefetchedDocIds = useRef<Set<string>>(new Set());

  const buildDocHref = useCallback(
    (docId: string) => `/${locale}/docs/${resolveDocSlug(docId)}`,
    [locale],
  );

  const prefetchDocRoutes = useCallback(
    (docId: string) => {
      const canonicalId = resolveDocSlug(docId);
      if (!canonicalId || prefetchedDocIds.current.has(canonicalId)) {
        return;
      }

      prefetchedDocIds.current.add(canonicalId);

      const detailPath = `/${locale}/docs/${canonicalId}`;
      try {
        router.prefetch(detailPath);
        router.prefetch(`${detailPath}/start`);
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.debug('Prefetch doc routes failed', { canonicalId, error });
        }
        prefetchedDocIds.current.delete(canonicalId);
      }
    },
    [locale, router],
  );

  useEffect(() => {
    if (initialDocs.length > 0) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const module = await import('@/lib/workflow/document-workflow');
        if (cancelled) return;
        const docs = module.getWorkflowDocuments({ jurisdiction: 'us' });
        setTopDocs(docs);
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Failed to load popular documents', error);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [initialDocs]);

  useEffect(() => {
    if (!searchParams) return;
    const categoryFromUrl = searchParams.get('category');
    if (
      categoryFromUrl &&
      CURATED_CATEGORY_KEYS.includes(categoryFromUrl) &&
      categoryFromUrl !== selectedCategory
    ) {
      setSelectedCategory(categoryFromUrl);
      setShowAllForCategory(false);
    }
  }, [searchParams, selectedCategory]);

  const categories = useMemo(
    () => CURATED_CATEGORY_KEYS.filter((key) => CATEGORY_DISPLAY_META[key]),
    [],
  );

  const categoryMeta = useMemo(() => {
    return categories.reduce<Record<string, { label: string; icon: LucideIcon }>>(
      (acc, key) => {
        const meta = CATEGORY_DISPLAY_META[key];
        acc[key] = {
          label: tCommon(meta.labelKey, {
            defaultValue: meta.labelKey.replace('categories.', '').replace(/-/g, ' '),
          }),
          icon: meta.icon ?? FileText,
        };
        return acc;
      },
      {},
    );
  }, [categories, tCommon]);

  const categoryDescriptions = useMemo(() => {
    return categories.reduce<Record<string, string>>((acc, key) => {
      const translationKey = CATEGORY_DESCRIPTION_KEYS[key];
      acc[key] = tCommon(translationKey, {
        defaultValue: CATEGORY_DESCRIPTION_DEFAULTS[key] || '',
      });
      return acc;
    }, {});
  }, [categories, tCommon]);

  const filteredDocs = useMemo(() => {
    if (!selectedCategory) return [] as DocumentSummary[];

    const deduped: DocumentSummary[] = [];
    const seenNames = new Set<string>();

    for (const doc of topDocs) {
      if (!matchesCategoryLabel(doc.category, selectedCategory)) {
        continue;
      }

      const normalizedName = normalizeDisplayName(doc);
      if (seenNames.has(normalizedName)) {
        continue;
      }

      seenNames.add(normalizedName);
      deduped.push(doc);
    }

    return deduped;
  }, [selectedCategory, topDocs]);

  useEffect(() => {
    if (!selectedCategory) return;
    if (filteredDocs.length === 0) return;

    const docsToWarm = (showAllForCategory ? filteredDocs : filteredDocs.slice(0, 12)).slice(0, 8);
    docsToWarm.forEach((doc) => {
      prefetchDocRoutes(doc.id);
    });
  }, [filteredDocs, prefetchDocRoutes, selectedCategory, showAllForCategory]);

  const handleExploreAll = () => {
    router.push(exploreAllDestination);
  };

  if (isLoading) {
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

  if (topDocs.length === 0) {
    return null;
  }

  return (
    <TooltipProvider>
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-xl font-semibold text-center mb-6 text-foreground">
          {tCommon('TopDocsChips.title', {
            defaultValue: 'Popular Legal Documents',
          })}
        </h2>

        {!selectedCategory && categories.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
              {categories.map((cat) => {
                const meta = categoryMeta[cat];
                if (!meta) return null;
                const Icon = meta.icon || FileText;
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
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                        <Icon className="h-6 w-6" />
                      </span>
                      <div>
                        <div className="font-semibold text-[15px] text-slate-900">
                          {meta.label}
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
              <Button
                variant="link"
                onClick={handleExploreAll}
                onMouseEnter={prefetchExplore}
                className="text-primary text-sm"
              >
                {tCommon('stepOne.exploreAllCategoriesButton', {
                  defaultValue: 'Explore All Document Categories',
                })}{'->'}
              </Button>
            </div>
          </>
        )}

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
                const IconComponent = categoryMeta[selectedCategory]?.icon || FileText;
                const badge = DOC_BADGES[doc.id];
                const href = buildDocHref(doc.id);

                return (
                  <Link
                    key={doc.id}
                    href={href}
                    prefetch
                    className="p-4 border border-gray-200 rounded-lg bg-card shadow-sm transition-all hover:-translate-y-[2px] hover:shadow-lg hover:border-[#006EFF] hover:bg-muted"
                    onMouseEnter={() => prefetchDocRoutes(doc.id)}
                    onFocus={() => prefetchDocRoutes(doc.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4 text-primary/80" />
                        <span className="text-sm font-medium">
                          {doc.translations?.[locale]?.name ||
                            doc.translations?.en?.name ||
                            doc.title ||
                            doc.id}
                        </span>
                      </div>
                      {badge && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="secondary" className="flex items-center space-x-1">
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
                      <TooltipContent>
                        {tCommon('TopDocsChips.estimatedCompletion', {
                          defaultValue: 'Average completion time',
                        })}
                      </TooltipContent>
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
                {tCommon('viewAllInCategory', { defaultValue: 'View all in category' })}{'->'}
              </Button>
            </div>
          </>
        )}
      </section>
    </TooltipProvider>
  );
});

TopDocsChips.displayName = 'TopDocsChips';

export default TopDocsChips;


