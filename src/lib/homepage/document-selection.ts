import type { DocumentSummary } from '@/lib/workflow/document-workflow';

export type CanonicalCategoryGroup = {
  id: string;
  defaultLabel: string;
  labelKey?: string;
  patterns: string[];
};

export const CATEGORY_CANONICAL_GROUPS: CanonicalCategoryGroup[] = [
  {
    id: 'real-estate',
    defaultLabel: 'Real Estate & Property',
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
    defaultLabel: 'Employment & HR',
    labelKey: 'home.hero2.builder.categories.employment',
    patterns: ['Employment & HR', 'Employment', 'HR'],
  },
  {
    id: 'personal-family',
    defaultLabel: 'Personal & Family',
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
    defaultLabel: 'Health & Care',
    labelKey: 'home.hero2.builder.categories.health',
    patterns: ['Healthcare & Medical', 'Health & Care', 'Health'],
  },
  {
    id: 'finance',
    defaultLabel: 'Finance & Lending',
    labelKey: 'home.hero2.builder.categories.finance',
    patterns: ['Finance & Lending', 'Finance', 'Investments'],
  },
  {
    id: 'business',
    defaultLabel: 'Business & Operations',
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
    defaultLabel: 'IP & Creative',
    labelKey: 'home.hero2.builder.categories.creative',
    patterns: ['Intellectual Property', 'Entertainment & Media', 'Creative'],
  },
  {
    id: 'legal',
    defaultLabel: 'Legal Process & Disputes',
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

export type CategoryFilterConfig = {
  id: string;
  fallback: string;
  matchTags?: string[];
  keywords?: string[];
  docIds?: string[];
  excludeKeywords?: string[];
  translationKey?: string;
};

export const CATEGORY_ROLE_FILTERS: Record<string, CategoryFilterConfig[]> = {
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
      translationKey: 'home.hero2.builder.scenario.realEstate.buyer',
    },
    {
      id: 'landlord',
      fallback: 'Landlord / Property Manager',
      matchTags: ['landlord', 'property manager'],
      keywords: ['lease', 'tenant', 'rent', 'eviction', 'rental'],
      translationKey: 'home.hero2.builder.scenario.realEstate.landlord',
    },
    {
      id: 'tenant',
      fallback: 'Tenant / Renter',
      matchTags: ['tenant', 'renter'],
      keywords: ['tenant', 'rent', 'rental application', 'roommate', 'security deposit'],
      translationKey: 'home.hero2.builder.scenario.realEstate.tenant',
    },
  ],
  employment: [
    {
      id: 'employer',
      fallback: 'Employer',
      matchTags: ['employer', 'manager', 'hr'],
      keywords: ['employment', 'policy', 'handbook', 'termination', 'offer letter'],
      translationKey: 'home.hero2.builder.scenario.employment.employer',
    },
    {
      id: 'contractor',
      fallback: 'Contractor / Freelancer',
      matchTags: ['contractor', 'freelancer'],
      keywords: ['contractor', 'freelancer', 'independent', 'services'],
      translationKey: 'home.hero2.builder.scenario.employment.contractor',
    },
    {
      id: 'employee',
      fallback: 'Employee',
      matchTags: ['employee', 'worker'],
      keywords: ['employee', 'employment', 'job offer', 'employment agreement'],
      translationKey: 'home.hero2.builder.scenario.employment.employee',
    },
  ],
  'personal-family': [
    {
      id: 'estate',
      fallback: 'Estate & Planning',
      matchTags: ['estate', 'planning'],
      keywords: ['will', 'trust', 'estate', 'inheritance'],
      translationKey: 'home.hero2.builder.scenario.personalFamily.estate',
    },
    {
      id: 'caregiver',
      fallback: 'Caregiver',
      matchTags: ['caregiver'],
      keywords: ['care', 'guardian', 'power of attorney', 'medical'],
      translationKey: 'home.hero2.builder.scenario.personalFamily.caregiver',
    },
    {
      id: 'relationship',
      fallback: 'Marriage & Relationships',
      matchTags: ['marriage', 'relationship'],
      keywords: ['prenup', 'marriage', 'cohabitation', 'relationship'],
      translationKey: 'home.hero2.builder.scenario.personalFamily.relationship',
    },
  ],
  health: [
    {
      id: 'patient',
      fallback: 'Patient & Preferences',
      matchTags: ['patient'],
      keywords: ['patient', 'medical', 'consent', 'directive'],
      translationKey: 'home.hero2.builder.scenario.health.patient',
    },
    {
      id: 'care-provider',
      fallback: 'Care Provider',
      matchTags: ['care provider', 'doctor', 'practice'],
      keywords: ['practice', 'clinic', 'telehealth', 'consent', 'medical'],
      translationKey: 'home.hero2.builder.scenario.health.provider',
    },
  ],
  finance: [
    {
      id: 'lender',
      fallback: 'Lender / Investor',
      matchTags: ['lender', 'investor'],
      keywords: ['loan', 'lender', 'invest', 'finance', 'repayment'],
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

export type CategoryOptionDescriptor = {
  id: string;
  matches: string[];
  defaultLabel: string;
  translationKey?: string;
};

export function buildCategoryOptionDescriptors(
  documents: DocumentSummary[],
): CategoryOptionDescriptor[] {
  const categorySet = new Set<string>();

  documents.forEach((doc) => {
    if (doc.category) {
      categorySet.add(doc.category);
    }
  });

  const remaining = new Set(categorySet);
  const options: CategoryOptionDescriptor[] = [];

  CATEGORY_CANONICAL_GROUPS.forEach((group) => {
    const matches = group.patterns.filter((name) => remaining.has(name));
    if (matches.length > 0) {
      options.push({
        id: group.id,
        matches,
        defaultLabel: group.defaultLabel,
        translationKey: group.labelKey,
      });
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

      options.push({
        id: `other-${slug}`,
        matches: [category],
        defaultLabel: category,
        translationKey: `home.hero2.builder.categories.dynamic.${slug}`,
      });
    });

  return options;
}

export type NormalizedFilterCriteria = {
  id: string;
  fallback: string;
  translationKey?: string;
  matchTags: string[];
  keywords: string[];
  excludeKeywords: string[];
  docIds: string[];
};

export function normalizeFilterConfig(config: CategoryFilterConfig): NormalizedFilterCriteria {
  return {
    id: config.id,
    fallback: config.fallback,
    translationKey: config.translationKey,
    matchTags: (config.matchTags ?? []).map((value) => value.toLowerCase()),
    keywords: (config.keywords ?? []).map((value) => value.toLowerCase()),
    excludeKeywords: (config.excludeKeywords ?? []).map((value) => value.toLowerCase()),
    docIds: [...(config.docIds ?? [])],
  };
}

export function buildDocumentSearchIndex(documents: DocumentSummary[]): Map<string, string> {
  const index = new Map<string, string>();

  documents.forEach((doc) => {
    const fields: string[] = [
      doc.title,
      doc.description,
      ...(doc.tags ?? []),
      ...(doc.aliases ?? []),
    ];

    Object.values(doc.translations ?? {}).forEach((translation) => {
      if (!translation) return;

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
}

export function filterDocumentsForCategory(
  documents: DocumentSummary[],
  matches: string[],
  getDocName: (doc: DocumentSummary) => string,
): DocumentSummary[] {
  if (matches.length === 0) {
    return [];
  }

  const allowed = new Set(matches);
  const subset = documents.filter((doc) => doc.category && allowed.has(doc.category));

  return [...subset].sort((a, b) => getDocName(a).localeCompare(getDocName(b)));
}

export function filterDocumentsByRoleCriteria(
  docsForCategory: DocumentSummary[],
  criteria: NormalizedFilterCriteria | null,
  docSearchIndex: Map<string, string>,
): DocumentSummary[] {
  if (!criteria) {
    return docsForCategory;
  }

  const { docIds, matchTags, keywords, excludeKeywords } = criteria;
  const hasCriteria = docIds.length > 0 || matchTags.length > 0 || keywords.length > 0;
  if (!hasCriteria) {
    return [];
  }

  return docsForCategory.filter((doc) => {
    let include = false;

    if (docIds.length && docIds.includes(doc.id)) {
      include = true;
    }

    if (!include && matchTags.length) {
      const docTags = (doc.tags ?? []).map((tag) => tag.toLowerCase());
      include = matchTags.some((tag) => docTags.includes(tag));
    }

    if (!include && matchTags.length) {
      const docAliases = (doc.aliases ?? []).map((alias) => alias.toLowerCase());
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
}
