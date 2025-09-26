// src/app/[locale]/HomePageClient.tsx
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import lazyOnView from '@/components/shared/media/LazyOnView';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';
import { track } from '@/lib/analytics';
import AutoImage from '@/components/shared/media/AutoImage';
import TopDocsChips from '@/components/shared/TopDocsChips';
import type { DocumentSummary } from '@/lib/workflow/document-workflow';
import { loadWorkflowModule } from '@/lib/workflow/load-workflow-module';
import { resolveDocSlug } from '@/lib/slug-alias';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { CheckCircle2, DownloadCloud, FileText, PenSquare, ShieldCheck } from 'lucide-react';

const HERO_TRUST_ITEMS = [
  { key: 'home.hero2.trustRow.noCard', icon: CheckCircle2 },
  { key: 'home.hero2.trustRow.instant', icon: DownloadCloud },
  { key: 'home.hero2.trustRow.ssl', icon: ShieldCheck },
  { key: 'home.hero2.trustRow.edit', icon: PenSquare },
] as const;

const CATEGORY_CANONICAL_GROUPS = [
  {
    id: 'real-estate',
    label: 'Real Estate & Property',
    labelKey: 'home.hero2.builder.categories.realEstate',
    patterns: [
      'Real Estate & Property',
      'Real Estate',
      'Property Management',
      'Construction & Home Improvement',
      'Construction',
    ],
  },
  {
    id: 'employment',
    label: 'Employment & HR',
    labelKey: 'home.hero2.builder.categories.employment',
    patterns: ['Employment & HR', 'Employment', 'HR'],
  },
  {
    id: 'personal-family',
    label: 'Personal & Family',
    labelKey: 'home.hero2.builder.categories.personalFamily',
    patterns: [
      'Personal',
      'Family',
      'Family & Personal',
      'Personal & Lifestyle',
      'Estate Planning',
    ],
  },
  {
    id: 'health',
    label: 'Health & Care',
    labelKey: 'home.hero2.builder.categories.health',
    patterns: ['Healthcare & Medical', 'Health & Care', 'Health'],
  },
  {
    id: 'finance',
    label: 'Finance & Lending',
    labelKey: 'home.hero2.builder.categories.finance',
    patterns: ['Finance & Lending', 'Finance', 'Investments'],
  },
  {
    id: 'business',
    label: 'Business & Operations',
    labelKey: 'home.hero2.builder.categories.business',
    patterns: [
      'Business & Commercial',
      'Business',
      'Professional Services',
      'Sales',
      'Marketing & Advertising',
      'Technology & IT',
      'Digital Assets & Blockchain',
      'Gaming & Esports',
      'Corporate',
    ],
  },
  {
    id: 'creative',
    label: 'IP & Creative',
    labelKey: 'home.hero2.builder.categories.creative',
    patterns: ['Intellectual Property', 'Entertainment & Media', 'Creative'],
  },
  {
    id: 'legal',
    label: 'Legal Process & Disputes',
    labelKey: 'home.hero2.builder.categories.legal',
    patterns: [
      'Legal',
      'Dispute Resolution',
      'Government & Legal Services',
      'Risk & Liability',
      'Risk Management',
    ],
  },
];


type CategoryFilterConfig = {
  id: string;
  fallback: string;
  matchTags?: string[];
  keywords?: string[];
  docIds?: string[];
  excludeKeywords?: string[];
  translationKey?: string;
};

const CATEGORY_ROLE_FILTERS: Record<string, CategoryFilterConfig[]> = {
  'real-estate': [
    {
      id: 'buyer',
      fallback: 'Buyer',
      matchTags: ['buyer', 'purchase', 'purchaser'],
      keywords: ['purchase', 'buyer', 'offer', 'earnest', 'closing', 'sale contract'],
      docIds: [
        'real-estate-purchase-agreement',
        'earnest-money-agreement',
        'mortgage-agreement',
        'warranty-deed',
      ],
      excludeKeywords: ['lease', 'rent'],
      translationKey: 'home.hero2.builder.scenario.realEstate.buyer',
    },
    {
      id: 'seller',
      fallback: 'Seller',
      matchTags: ['seller', 'sale', 'disclosure'],
      keywords: ['seller', 'sale', 'disclosure', 'listing', 'transfer'],
      docIds: [
        'real-estate-purchase-agreement',
        'warranty-deed',
        'timber-sale-agreement',
        'water-rights-agreement',
      ],
      translationKey: 'home.hero2.builder.scenario.realEstate.seller',
    },
    {
      id: 'landlord',
      fallback: 'Landlord',
      matchTags: ['landlord', 'rental', 'property-owner'],
      keywords: ['landlord', 'rent', 'lease', 'eviction', 'property management'],
      docIds: [
        'lease-addendum',
        'lease-amendment',
        'notice-of-lease-violation',
        'notice-to-enter',
        'notice-to-pay-rent-or-quit',
        'rent-increase-letter',
        'rent-receipt',
        'residential-rental-inspection-report',
        'pet-addendum',
        'farm-lease-agreement',
        'hunting-lease-agreement',
        'mining-lease-agreement',
        'parking-space-lease-agreement',
        'storage-space-lease-agreement',
        'oil-gas-lease-agreement',
      ],
      translationKey: 'home.hero2.builder.scenario.realEstate.landlord',
    },
    {
      id: 'tenant',
      fallback: 'Tenant',
      matchTags: ['tenant', 'renter'],
      keywords: ['tenant', 'renter', 'rental application', 'security deposit', 'rent receipt'],
      docIds: [
        'residential-rental-application',
        'rent-receipt',
      ],
      excludeKeywords: ['landlord'],
      translationKey: 'home.hero2.builder.scenario.realEstate.tenant',
    },
    {
      id: 'homeowner',
      fallback: 'Homeowner',
      matchTags: ['homeowner', 'owner'],
      keywords: ['homeowner', 'remodel', 'renovation', 'contractor', 'neighbor'],
      docIds: [
        'mortgage-agreement',
        'warranty-deed',
        'water-rights-agreement',
      ],
      translationKey: 'home.hero2.builder.scenario.realEstate.homeowner',
    },
  ],
  'employment': [
    {
      id: 'employer',
      fallback: 'Employer / HR',
      matchTags: ['employer', 'hr'],
      keywords: ['employer', 'policy', 'hr', 'handbook', 'discipline', 'termination'],
      translationKey: 'home.hero2.builder.scenario.employment.employer',
    },
    {
      id: 'employee',
      fallback: 'Employee',
      matchTags: ['employee', 'worker'],
      keywords: ['employee', 'performance', 'evaluation', 'complaint', 'warning'],
      translationKey: 'home.hero2.builder.scenario.employment.employee',
    },
    {
      id: 'contractor',
      fallback: 'Contractor / Freelancer',
      matchTags: ['contractor', 'freelancer'],
      keywords: ['contractor', 'independent', 'freelance', 'gig', 'statement of work'],
      translationKey: 'home.hero2.builder.scenario.employment.contractor',
    },
  ],
  'personal-family': [
    {
      id: 'family',
      fallback: 'Family & Dependents',
      matchTags: ['family', 'dependent'],
      keywords: ['family', 'dependent', 'child', 'care', 'travel consent', 'guardianship'],
      translationKey: 'home.hero2.builder.scenario.personal.family',
    },
    {
      id: 'estate',
      fallback: 'Estate Planning',
      matchTags: ['estate', 'will'],
      keywords: ['estate', 'will', 'trust', 'probate', 'inheritance'],
      translationKey: 'home.hero2.builder.scenario.personal.estate',
    },
    {
      id: 'lifeEvent',
      fallback: 'Life Events',
      matchTags: ['life-event', 'affidavit', 'name-change'],
      keywords: ['affidavit', 'name change', 'personal finance', 'notary', 'consent'],
      translationKey: 'home.hero2.builder.scenario.personal.lifeEvent',
    },
  ],
  health: [
    {
      id: 'patient',
      fallback: 'Patient',
      matchTags: ['patient', 'medical'],
      keywords: ['patient', 'medical', 'consent', 'hipaa', 'treatment'],
      translationKey: 'home.hero2.builder.scenario.health.patient',
    },
    {
      id: 'caregiver',
      fallback: 'Caregiver',
      matchTags: ['caregiver', 'care'],
      keywords: ['caregiver', 'care plan', 'support', 'assistance'],
      translationKey: 'home.hero2.builder.scenario.health.caregiver',
    },
    {
      id: 'provider',
      fallback: 'Healthcare Provider',
      matchTags: ['provider', 'physician'],
      keywords: ['provider', 'clinic', 'medical services', 'compliance', 'practice'],
      translationKey: 'home.hero2.builder.scenario.health.provider',
    },
  ],
  finance: [
    {
      id: 'lender',
      fallback: 'Lender',
      matchTags: ['lender', 'loan'],
      keywords: ['lender', 'loan', 'credit', 'financing', 'collateral'],
      translationKey: 'home.hero2.builder.scenario.finance.lender',
    },
    {
      id: 'borrower',
      fallback: 'Borrower',
      matchTags: ['borrower', 'debtor'],
      keywords: ['borrower', 'repayment', 'hardship', 'debt', 'payment plan'],
      translationKey: 'home.hero2.builder.scenario.finance.borrower',
    },
    {
      id: 'vehicle',
      fallback: 'Vehicle Sale',
      matchTags: ['vehicle', 'auto', 'car'],
      keywords: ['vehicle', 'auto', 'car', 'odometer', 'title'],
      translationKey: 'home.hero2.builder.scenario.finance.vehicle',
    },
  ],
  business: [
    {
      id: 'founder',
      fallback: 'Founder / Owner',
      matchTags: ['founder', 'owner'],
      keywords: ['founder', 'startup', 'operating agreement', 'bylaws', 'formation'],
      translationKey: 'home.hero2.builder.scenario.business.founder',
    },
    {
      id: 'partnership',
      fallback: 'Partners & Investors',
      matchTags: ['partner', 'investor'],
      keywords: ['partner', 'investor', 'equity', 'capital', 'joint venture'],
      translationKey: 'home.hero2.builder.scenario.business.partnership',
    },
    {
      id: 'hr',
      fallback: 'HR & Operations',
      matchTags: ['hr', 'operations'],
      keywords: ['hr', 'operations', 'employment', 'policy', 'onboarding'],
      translationKey: 'home.hero2.builder.scenario.business.hr',
    },
  ],
  creative: [
    {
      id: 'creator',
      fallback: 'Creator / Artist',
      matchTags: ['creator', 'artist'],
      keywords: ['creator', 'artist', 'creative', 'collaboration', 'commission'],
      translationKey: 'home.hero2.builder.scenario.ip.creator',
    },
    {
      id: 'brand',
      fallback: 'Brand & Marketing',
      matchTags: ['brand', 'marketing'],
      keywords: ['brand', 'marketing', 'influencer', 'sponsorship', 'campaign'],
      translationKey: 'home.hero2.builder.scenario.ip.brand',
    },
    {
      id: 'technology',
      fallback: 'Technology & Digital',
      matchTags: ['technology', 'digital'],
      keywords: ['technology', 'software', 'saas', 'digital', 'license'],
      translationKey: 'home.hero2.builder.scenario.ip.technology',
    },
  ],
  legal: [
    {
      id: 'demand',
      fallback: 'Demand & Enforcement',
      matchTags: ['demand', 'enforcement'],
      keywords: ['demand', 'cease and desist', 'claim', 'payment demand'],
      translationKey: 'home.hero2.builder.scenario.legal.demand',
    },
    {
      id: 'court',
      fallback: 'Court & Sworn Statements',
      matchTags: ['court', 'affidavit'],
      keywords: ['court', 'affidavit', 'declaration', 'sworn', 'testimony'],
      translationKey: 'home.hero2.builder.scenario.legal.court',
    },
    {
      id: 'compliance',
      fallback: 'Compliance & Risk',
      matchTags: ['compliance', 'risk'],
      keywords: ['compliance', 'policy', 'waiver', 'liability', 'risk'],
      translationKey: 'home.hero2.builder.scenario.legal.compliance',
    },
  ],
};



type RoleFilter = {
  id: string;
  label: string;
  config: CategoryFilterConfig;
};







const SpinnerIcon = () => (
  <svg
    className="h-8 w-8 animate-spin text-primary"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

type HomePageClientProps = {
  locale: 'en' | 'es';
  popularDocs: DocumentSummary[];
};

// Minimal loading spinner without text
const _MinimalLoadingSpinner = () => (
  <div className="flex justify-center items-center h-32" role="status" aria-live="polite">
    <SpinnerIcon />
  </div>
);

// Skeletons for lazy-loaded sections
const HowItWorksSkeleton = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-8"></div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-muted rounded-lg p-6 h-40"></div>
      ))}
    </div>
  </div>
);

const TestimonialsSkeleton = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-8"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="bg-muted rounded-lg p-6 h-48"></div>
      ))}
    </div>
  </div>
);

const HowItWorks = lazyOnView(
  () => import('@/components/layout/landing/HowItWorks'),
  {
    placeholder: <HowItWorksSkeleton />,
  },
);

const TrustAndTestimonialsSection = lazyOnView(
  () => import('@/components/layout/landing/TrustAndTestimonialsSection'),
  {
    placeholder: <TestimonialsSkeleton />,
  },
);

type HeroDocumentBuilderProps = {
  locale: 'en' | 'es';
};


const HeroDocumentBuilder = React.memo(function HeroDocumentBuilder({
  locale,
}: HeroDocumentBuilderProps) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedFilterId, setSelectedFilterId] = useState<string>('all');
  const [selectedDocId, setSelectedDocId] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    loadWorkflowModule()
      .then((module) => {
        if (cancelled) return;
        const docs = module.getWorkflowDocuments({
          jurisdiction: 'us',
          language: locale === 'es' ? 'es' : 'en',
        });
        setDocuments(docs);
      })
      .catch((error) => {
        if (!cancelled) {
          console.error('Failed to load documents for hero builder:', error);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [locale]);

  const getDocName = useCallback(
    (doc: DocumentSummary) =>
      doc.translations?.[locale]?.name ??
      doc.translations?.en?.name ??
      doc.title,
    [locale],
  );

  const categories = useMemo(() => {
    const unique = new Set<string>();
    documents.forEach((doc) => {
      if (doc.category) {
        unique.add(doc.category);
      }
    });
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [documents]);

  const categoryOptions = useMemo(() => {
    const remaining = new Set(categories);
    const options: Array<{ id: string; label: string; matches: string[] }> = [];

    CATEGORY_CANONICAL_GROUPS.forEach((group) => {
      const matches = group.patterns.filter((name) => remaining.has(name));
      if (matches.length > 0) {
        const translatedLabel = group.labelKey
          ? t(group.labelKey, { defaultValue: group.label })
          : group.label;
        options.push({ id: group.id, label: translatedLabel, matches });
        matches.forEach((name) => remaining.delete(name));
      }
    });

    Array.from(remaining)
      .sort((a, b) => a.localeCompare(b))
      .forEach((category) => {
        const slug = category
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        const translated = t(`home.hero2.builder.categories.dynamic.${slug}`, { defaultValue: category });
        options.push({ id: `other-${slug}`, label: translated, matches: [category] });
      });

    return options;
  }, [categories, t]);

  const activeCategoryOption = useMemo(() =>
    categoryOptions.find((option) => option.id === selectedCategoryId) ?? null,
  [categoryOptions, selectedCategoryId]);

  const activeCategoryLabel = activeCategoryOption?.label ?? null;

  const docsForCategory = useMemo(() => {
    if (!activeCategoryOption) return [] as DocumentSummary[];
    const allowed = new Set(activeCategoryOption.matches);
    const subset = documents.filter((doc) => allowed.has(doc.category));
    return [...subset].sort((a, b) => getDocName(a).localeCompare(getDocName(b)));
  }, [documents, activeCategoryOption, getDocName]);

  const docSearchIndex = useMemo(() => {
    const index = new Map<string, string>();

    documents.forEach((doc) => {
      const fields: string[] = [
        doc.title,
        doc.description,
        ...(doc.tags ?? []),
        ...(doc.aliases ?? []),
      ];

      const translationEntries = Object.values(doc.translations ?? {});
      translationEntries.forEach((translation) => {
        if (!translation) {
          return;
        }

        if (translation.name) {
          fields.push(translation.name);
        }

        if (translation.description) {
          fields.push(translation.description);
        }

        if (Array.isArray(translation.aliases)) {
          fields.push(...translation.aliases);
        }
      });

      index.set(
        doc.id,
        fields
          .filter((value): value is string => Boolean(value))
          .map((value) => value.toLowerCase())
          .join(' | '),
      );
    });

    return index;
  }, [documents]);

  const roleFilters = useMemo<RoleFilter[]>(() => {
    const base: RoleFilter[] = [
      {
        id: 'all',
        label: t('home.hero2.builder.filters.all', { defaultValue: 'All documents' }),
        config: { id: 'all', fallback: 'All documents' },
      },
    ];

    if (!activeCategoryOption) {
      return base;
    }

    const configs = CATEGORY_ROLE_FILTERS[activeCategoryOption.id] ?? [];

    configs.forEach((config) => {
      const normalizedMatchTags = config.matchTags?.map((tag) => tag.toLowerCase());
      const normalizedKeywords = config.keywords?.map((keyword) => keyword.toLowerCase());
      const normalizedExclude = config.excludeKeywords?.map((keyword) => keyword.toLowerCase());

      base.push({
        id: config.id,
        label: t(
          config.translationKey
            ?? `home.hero2.builder.filters.${activeCategoryOption.id}.${config.id}`,
          { defaultValue: config.fallback },
        ),
        config: {
          ...config,
          matchTags: normalizedMatchTags,
          keywords: normalizedKeywords,
          excludeKeywords: normalizedExclude,
        },
      });
    });

    return base;
  }, [activeCategoryOption, t]);

  useEffect(() => {
    if (roleFilters.length === 0) {
      setSelectedFilterId('all');
      return;
    }

    if (!roleFilters.some((filter) => filter.id === selectedFilterId)) {
      setSelectedFilterId(roleFilters[0].id);
    }
  }, [roleFilters, selectedFilterId]);

  const filteredDocs = useMemo(() => {
    if (!selectedFilterId || selectedFilterId === 'all') {
      return docsForCategory;
    }

    const activeFilter = roleFilters.find((filter) => filter.id === selectedFilterId);
    if (!activeFilter || activeFilter.id === 'all') {
      return docsForCategory;
    }

    const matchTags = (activeFilter.config.matchTags ?? []).map((tag) => tag.toLowerCase());
    const keywords = (activeFilter.config.keywords ?? []).map((keyword) => keyword.toLowerCase());
    const docIds = activeFilter.config.docIds ?? [];
    const excludeKeywords = (activeFilter.config.excludeKeywords ?? []).map((keyword) => keyword.toLowerCase());

    const hasCriteria = docIds.length > 0 || matchTags.length > 0 || keywords.length > 0;
    if (!hasCriteria) {
      return [];
    }

    const filtered = docsForCategory.filter((doc) => {
      let include = false;

      if (docIds.length && docIds.includes(doc.id)) {
        include = true;
      }

      if (!include && matchTags.length) {
        const docTags = doc.tags?.map((tag) => tag.toLowerCase()) ?? [];
        include = matchTags.some((tag) => docTags.includes(tag));
      }

      if (!include && matchTags.length) {
        const docAliases = doc.aliases?.map((alias) => alias.toLowerCase()) ?? [];
        include = matchTags.some((tag) => docAliases.includes(tag));
      }

      const docText = docSearchIndex.get(doc.id) ?? '';

      if (!include && keywords.length && docText) {
        include = keywords.some((keyword) => docText.includes(keyword));
      }

      if (!include) {
        return false;
      }

      if (excludeKeywords.length && docText) {
        const hasExcluded = excludeKeywords.some((keyword) => docText.includes(keyword));
        if (hasExcluded) {
          return false;
        }
      }

      return true;
    });

    return filtered;
  }, [docsForCategory, docSearchIndex, roleFilters, selectedFilterId]);

  useEffect(() => {
    if (selectedDocId && !filteredDocs.some((doc) => doc.id === selectedDocId)) {
      setSelectedDocId(undefined);
    }
  }, [filteredDocs, selectedDocId]);

  const handleCategoryChange = useCallback((value: string) => {
    setSelectedCategoryId(value);
    setSelectedFilterId('all');
    setSelectedDocId(undefined);
  }, []);

  const handleFilterChange = useCallback((value: string) => {
    setSelectedFilterId(value);
    setSelectedDocId(undefined);
  }, []);

  const handleDocChange = useCallback((value: string) => {
    setSelectedDocId(value);
  }, []);

  const isSubmitDisabled = isLoading || !selectedDocId;

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!selectedDocId) return;
      const slug = resolveDocSlug(selectedDocId);
      track('hero_document_builder_start', {
        locale,
        category: activeCategoryLabel,
        docId: selectedDocId,
        filter: selectedFilterId === 'all' ? null : selectedFilterId,
      });

      router.push(`/${locale}/docs/${slug}`);
    },
    [locale, router, activeCategoryLabel, selectedDocId, selectedFilterId],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-300 bg-white p-6 shadow-xl shadow-slate-300/60 backdrop-blur-sm md:p-8"
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">
            {t('home.hero2.builder.title', { defaultValue: 'Create Your Document' })}
          </h3>
        </div>
        <div className="space-y-5">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              <span className="text-blue-500">1.</span>{' '}
              {t('home.hero2.builder.step1', { defaultValue: 'Choose a category' })}
            </p>
            <Select
              value={selectedCategoryId ?? undefined}
              onValueChange={handleCategoryChange}
              disabled={isLoading || !categoryOptions.length}
            >
              <SelectTrigger className="h-12 rounded-xl border border-slate-400 bg-white text-sm font-medium text-slate-900 shadow-lg transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/60 hover:border-slate-500">
                <SelectValue
                  placeholder={t('home.hero2.builder.step1Placeholder', { defaultValue: 'Select a category' })}
                />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              <span className="text-blue-500">2.</span>{' '}
              {t('home.hero2.builder.step2', { defaultValue: 'Narrow your focus' })}
            </p>
            <Select
              value={selectedFilterId}
              onValueChange={handleFilterChange}
              disabled={isLoading || roleFilters.length <= 1}
            >
              <SelectTrigger className="h-12 rounded-xl border border-slate-400 bg-white text-sm font-medium text-slate-900 shadow-lg transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/60 hover:border-slate-500">
                <SelectValue
                  placeholder={t('home.hero2.builder.step2Placeholder', { defaultValue: 'Select a focus (optional)' })}
                />
              </SelectTrigger>
              <SelectContent>
                {roleFilters.map((filter) => (
                  <SelectItem key={filter.id} value={filter.id}>
                    {filter.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              <span className="text-blue-500">3.</span>{' '}
              {t('home.hero2.builder.step3', { defaultValue: 'Select a specific document' })}
            </p>
            <Select
              value={selectedDocId ?? undefined}
              onValueChange={handleDocChange}
              disabled={isLoading}
            >
              <SelectTrigger className="h-12 rounded-xl border border-slate-400 bg-white text-sm font-medium text-slate-900 shadow-lg transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/60 hover:border-slate-500">
                <SelectValue
                  placeholder={t('home.hero2.builder.step3Placeholder', { defaultValue: 'e.g. NDA, Lease Agreement, Will...' })}
                />
              </SelectTrigger>
              <SelectContent>
                {filteredDocs.length === 0 ? (
                  <SelectItem value="__no_results__" disabled>
                    {t('home.hero2.builder.step3Empty', {
                      defaultValue: 'No documents match this focus yet. Try a different option.',
                    })}
                  </SelectItem>
                ) : (
                  filteredDocs.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id}>
                      {getDocName(doc)}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          type="submit"
          disabled={isSubmitDisabled}
          className="h-12 rounded-2xl bg-blue-600 text-base font-semibold text-white shadow-lg shadow-blue-300/50 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isLoading
            ? t('home.hero2.builder.loading', { defaultValue: 'Loading...' })
            : t('home.hero2.builder.submit', { defaultValue: 'Start Generation' })}
        </Button>
      </div>
    </form>
  );
});

export default function HomePageClient({
  locale,
  popularDocs,
}: HomePageClientProps) {
  const { t } = useTranslation('common');
  const router = useRouter();

  // Removed selectedDocument to avoid importing the full document library on client




  return (
    <>
      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-slate-100 via-white to-blue-50 pt-8 pb-16 lg:pt-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 lg:flex-row lg:items-start lg:gap-10">
          <div className="w-full max-w-xl space-y-4 lg:space-y-4">
            <div className="space-y-2.5">
              <h1 className="text-[40px] font-semibold tracking-tight text-[#111827] sm:text-[46px] lg:text-[52px] lg:leading-[1.08] antialiased">
                {t('home.hero2.heading.main', { defaultValue: 'Legal Documents Made' })}{' '}
                <span className="font-bold text-[#2563EB]">
                  {t('home.hero2.heading.highlight', { defaultValue: 'Easy.' })}
                </span>
              </h1>
            </div>
            <HeroDocumentBuilder locale={locale} />
            <div className="grid w-full grid-cols-2 gap-2 -mt-2 sm:-mt-1 sm:grid-cols-4">
              {HERO_TRUST_ITEMS.map(({ icon: Icon, key }) => (
                <div
                  key={key}
                    className="flex flex-col items-center text-center sm:items-start sm:text-left"
                >
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600 shadow-sm">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <p className="text-sm font-medium text-slate-600">
                    {t(key)}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative w-full max-w-[560px]">
            <div
              className="absolute -top-12 right-10 hidden h-40 w-40 rounded-full bg-gradient-to-br from-blue-200/60 via-blue-100/40 to-transparent blur-3xl lg:block"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-10 left-0 hidden h-48 w-48 rounded-full bg-gradient-to-tr from-emerald-200/50 via-emerald-100/30 to-transparent blur-3xl lg:block"
              aria-hidden="true"
            />
            <div className="relative rounded-[32px] border border-white/50 bg-white/70 p-4 pb-36 md:pb-12 shadow-xl shadow-blue-200/30 backdrop-blur">
              <div className="overflow-hidden rounded-[24px]">
                <AutoImage
                  src={
                    locale === 'es'
                    ? '/images/hero-main-es.png'
                    : '/images/hero-main.png'
                  }
                  alt={t('home.hero2.imageAlt', {
                    defaultValue: 'Professional reviewing a legal document on a tablet',
                  })}
                  width={1536}
                  height={1024}
                  className="h-full w-full object-cover object-top md:object-center"
                  priority
                />
              </div>
              <div className="absolute -bottom-16 left-6 right-6 mx-auto max-w-[calc(100%-3rem)] rounded-2xl bg-white/90 p-5 pb-8 shadow-lg shadow-slate-200/80 backdrop-blur md:left-12 md:right-12 md:bottom-0 md:p-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-sm">
                    <FileText className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h4 className="text-base font-semibold text-slate-900">
                    {t('home.hero2.preview.title', { defaultValue: 'Vehicle Bill of Sale' })}
                  </h4>
                </div>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                    <span>
                      {t('home.hero2.preview.bullet1', {
                        defaultValue: 'Legally Sound & State-Specific',
                      })}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                    <span>
                      {t('home.hero2.preview.bullet2', {
                        defaultValue: 'Quick & Easy Customization',
                      })}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                    <span>
                      {t('home.hero2.preview.bullet3', {
                        defaultValue: 'Instant Download & Secure',
                      })}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* "Generate and Personalize Legal Forms" section (formerly "How It Works") */}
      <div className="cv-auto">
        <HowItWorks />
      </div>

      {/* Popular Documents by Category */}
      <div className="cv-auto">
        <TopDocsChips locale={locale} initialDocs={popularDocs} />
      </div>


      {/* "Trust and Testimonials" section */}
      <div className="cv-auto">
        <TrustAndTestimonialsSection />
      </div>

      <Separator className="my-12" />

      {/* The "What do you want to accomplish?" section and its contents have been removed. */}
      {/* The PersonalizationBlock that was inside it is also removed. If it's needed elsewhere, it can be re-added. */}
    </>
  );
}
