// src/components/shared/TopDocsChips.tsx
'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { resolveDocSlug } from '@/lib/slug-alias';
import { loadWorkflowModule } from '@/lib/workflow/load-workflow-module';
import {
  buildCategoryOptionDescriptors,
  CATEGORY_ROLE_FILTERS,
  buildDocumentSearchIndex,
  filterDocumentsByRoleCriteria,
  filterDocumentsForCategory,
  normalizeFilterConfig,
  type NormalizedFilterCriteria,
} from '@/lib/homepage/document-selection';
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

const POPULAR_TO_BUILDER_CATEGORY: Record<string, string> = {
  'real-estate-property': 'real-estate',
  'employment-hr': 'employment',
  'personal-family': 'personal-family',
  'health-care': 'health',
  'finance-lending': 'finance',
  'business-startups': 'business',
  'ip-creative': 'creative',
  'legal-process-disputes': 'legal',
};

type RoleFilterOption = {
  id: string;
  label: string;
  criteria: NormalizedFilterCriteria | null;
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

  const [documents, setDocuments] = useState<DocumentSummary[]>(initialDocs);
  const [isLoading, setIsLoading] = useState(initialDocs.length === 0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFilterId, setSelectedFilterId] = useState<string>('all');
  const [showAllForCategory, setShowAllForCategory] = useState(false);
  const prefetchedDocIds = useRef<Set<string>>(new Set());

  const popularDocIdsByCategory = useMemo(() => {
    const map = new Map<string, Set<string>>();

    initialDocs.forEach((doc) => {
      CURATED_CATEGORY_KEYS.forEach((categoryKey) => {
        if (matchesCategoryLabel(doc.category, categoryKey)) {
          if (!map.has(categoryKey)) {
            map.set(categoryKey, new Set<string>());
          }
          map.get(categoryKey)!.add(doc.id);
        }
      });
    });

    return map;
  }, [initialDocs]);

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

  const getFriendlyDescription = useCallback(
    (doc: DocumentSummary): string => {
      const rawDescription = (
        doc.translations?.[locale]?.description ||
        doc.translations?.en?.description ||
        doc.description ||
        ''
      );

      const normalized = rawDescription.replace(/\s+/g, ' ').trim();
      if (!normalized) {
        return '';
      }

      const firstSentence = normalized.split(/[.!?]/)[0]?.trim() ?? '';
      if (!firstSentence) {
        return '';
      }

      const words = firstSentence.split(/\s+/);
      const shortened = words.slice(0, 12).join(' ');
      const cleaned = shortened.replace(/[,;:]+$/g, '');
      return words.length > 12 ? `${cleaned}...` : cleaned;
    },
    [locale],
  );

  useEffect(() => {
    let cancelled = false;

    if (initialDocs.length > 0) {
      setIsLoading(false);
    }

    (async () => {
      try {
        const module = await loadWorkflowModule();
        if (cancelled) return;
        const docs = module.getWorkflowDocuments({ jurisdiction: 'us' });
        setDocuments(docs);
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
      setSelectedFilterId('all');
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

  const builderCategoryOptions = useMemo(
    () => buildCategoryOptionDescriptors(documents),
    [documents],
  );

  const builderCategoryMap = useMemo(
    () => new Map(builderCategoryOptions.map((option) => [option.id, option])),
    [builderCategoryOptions],
  );

  const mappedCategoryId = selectedCategory
    ? POPULAR_TO_BUILDER_CATEGORY[selectedCategory] ?? null
    : null;

  const activeBuilderCategory = mappedCategoryId
    ? builderCategoryMap.get(mappedCategoryId) ?? null
    : null;

  const getDocName = useCallback(
    (doc: DocumentSummary) =>
      doc.translations?.[locale]?.name ??
      doc.translations?.en?.name ??
      doc.title ??
      doc.id,
    [locale],
  );

  const docsForCategory = useMemo(() => {
    if (!activeBuilderCategory) {
      return [] as DocumentSummary[];
    }

    const docs = filterDocumentsForCategory(
      documents,
      activeBuilderCategory.matches,
      getDocName,
    );

    const seenNames = new Set<string>();
    const deduped: DocumentSummary[] = [];

    docs.forEach((doc) => {
      const normalizedName = normalizeDisplayName(doc);
      if (seenNames.has(normalizedName)) {
        return;
      }
      seenNames.add(normalizedName);
      deduped.push(doc);
    });

    if (!selectedCategory) {
      return deduped;
    }

    const curatedSet = popularDocIdsByCategory.get(selectedCategory);
    if (!curatedSet || curatedSet.size === 0) {
      return deduped;
    }

    return [...deduped].sort((a, b) => {
      const aCurated = curatedSet.has(a.id) ? 0 : 1;
      const bCurated = curatedSet.has(b.id) ? 0 : 1;
      if (aCurated !== bCurated) {
        return aCurated - bCurated;
      }
      return getDocName(a).localeCompare(getDocName(b));
    });
  }, [
    activeBuilderCategory,
    documents,
    getDocName,
    popularDocIdsByCategory,
    selectedCategory,
  ]);

  const docSearchIndex = useMemo(
    () => buildDocumentSearchIndex(documents),
    [documents],
  );

  const roleFilters = useMemo<RoleFilterOption[]>(() => {
    const base: RoleFilterOption[] = [
      {
        id: 'all',
        label: tCommon('home.hero2.builder.filters.all', { defaultValue: 'All documents' }),
        criteria: null,
      },
    ];

    if (!activeBuilderCategory) {
      return base;
    }

    const configs = CATEGORY_ROLE_FILTERS[activeBuilderCategory.id] ?? [];

    configs.forEach((config) => {
      const normalized = normalizeFilterConfig(config);

      base.push({
        id: config.id,
        label: tCommon(
          normalized.translationKey
            ?? `home.hero2.builder.filters.${activeBuilderCategory.id}.${config.id}`,
          { defaultValue: normalized.fallback },
        ),
        criteria: normalized,
      });
    });

    return base;
  }, [activeBuilderCategory, tCommon]);

  useEffect(() => {
    if (!roleFilters.some((filter) => filter.id === selectedFilterId)) {
      setSelectedFilterId(roleFilters[0]?.id ?? 'all');
    }
  }, [roleFilters, selectedFilterId]);

  useEffect(() => {
    setShowAllForCategory(false);
  }, [selectedCategory, selectedFilterId]);

  const filteredDocs = useMemo(() => {
    if (!selectedCategory) {
      return [] as DocumentSummary[];
    }

    if (!selectedFilterId || selectedFilterId === 'all') {
      return docsForCategory;
    }

    const activeFilter = roleFilters.find((filter) => filter.id === selectedFilterId);
    if (!activeFilter || !activeFilter.criteria) {
      return docsForCategory;
    }

    return filterDocumentsByRoleCriteria(docsForCategory, activeFilter.criteria, docSearchIndex);
  }, [
    selectedCategory,
    selectedFilterId,
    roleFilters,
    docsForCategory,
    docSearchIndex,
  ]);

  const displayedDocs = useMemo(() => {
    if (selectedFilterId === 'all' && !showAllForCategory) {
      return filteredDocs.slice(0, 12);
    }
    return filteredDocs;
  }, [filteredDocs, selectedFilterId, showAllForCategory]);

  useEffect(() => {
    if (!selectedCategory) return;
    if (displayedDocs.length === 0) return;

    displayedDocs.slice(0, 8).forEach((doc) => {
      prefetchDocRoutes(doc.id);
    });
  }, [displayedDocs, prefetchDocRoutes, selectedCategory]);

  const handleExploreAll = () => {
    router.push(exploreAllDestination);
  };

  if (documents.length === 0) {
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
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 text-center md:text-left">
              <span className="text-blue-500">1.</span>{' '}
              {tCommon('home.hero2.builder.step1', { defaultValue: 'Choose a category' })}
            </p>
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
                      setSelectedFilterId('all');
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
    <div className="mb-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            <span className="text-blue-500">1.</span>{' '}
            {tCommon('home.hero2.builder.step1', { defaultValue: 'Choose a category' })}
          </p>
          <h3 className="mt-1 text-2xl font-semibold text-[#1D4ED8]" id="popular-docs-selected">
            {categoryMeta[selectedCategory]?.label || selectedCategory}
          </h3>
        </div>
        <Button
          variant="link"
          size="sm"
          className="text-[#2563EB] hover:text-[#1D4ED8] inline-flex items-center gap-1"
          onClick={() => {
            setSelectedCategory(null);
            setSelectedFilterId('all');
            setShowAllForCategory(false);
          }}
        >
          {tCommon('changeCategory', { defaultValue: 'Back to categories' })} →
        </Button>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          <span className="text-blue-500">2.</span>{' '}
          {tCommon('home.hero2.builder.step2', { defaultValue: 'Narrow your focus' })}
        </p>
        <div className="flex flex-wrap gap-2">
          {roleFilters.map((filter) => {
            const isActive = selectedFilterId === filter.id;
            return (
              <Button
                key={filter.id}
                type="button"
                size="sm"
                variant="outline"
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-sm hover:bg-[#1D4ED8]'
                    : 'border-transparent bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                onClick={() => {
                  setSelectedFilterId(filter.id);
                  setShowAllForCategory(false);
                }}
                disabled={roleFilters.length <= 1 && filter.id === 'all'}
              >
                {filter.label}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          <span className="text-blue-500">3.</span>{' '}
          {tCommon('home.hero2.builder.step3', { defaultValue: 'Select a specific document' })}
        </p>
        {filteredDocs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-600">
            {tCommon('home.hero2.builder.step3Empty', {
              defaultValue: 'No documents match this focus yet. Try a different option.',
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedDocs.map((doc) => {
              const badge = DOC_BADGES[doc.id];
              const href = buildDocHref(doc.id);
              const friendlyDescription = getFriendlyDescription(doc);
              return (
                <Link
                  key={doc.id}
                  href={href}
                  prefetch
                  className="group block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-[#1D4ED8]/70 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
                  onMouseEnter={() => prefetchDocRoutes(doc.id)}
                  onFocus={() => prefetchDocRoutes(doc.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                        <FileText className="h-5 w-5" />
                      </span>
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-slate-900 group-hover:text-[#1D4ED8] transition-colors">
                          {getDocName(doc)}
                        </h4>
                        {friendlyDescription && (
                          <p className="text-xs text-slate-500">
                            {tCommon('TopDocsChips.hoverLabel', { defaultValue: 'For' })}: {friendlyDescription}
                          </p>
                        )}
                      </div>
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
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
    <div className="text-center mt-6 space-x-4">
      {selectedFilterId === 'all' && !showAllForCategory && filteredDocs.length > 12 && (
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="rounded-full border-transparent bg-slate-100 px-6 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-200"
          onClick={() => setShowAllForCategory(true)}
        >
          {tCommon('TopDocsChips.showMore', { defaultValue: 'Show more' })}
        </Button>
      )}
      <Button
        variant="link"
        onClick={() => router.push(`/${locale}/category/${selectedCategory}`)}
        className="inline-flex items-center gap-1 text-[#2563EB] text-sm font-semibold hover:text-[#1D4ED8]"
      >
        {tCommon('TopDocsChips.viewAll', { defaultValue: 'View all in category →' })}
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


