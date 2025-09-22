// Shared configuration for homepage popular document categories
// Keep in sync between server (HomepageContainer) and client (TopDocsChips).

export const CURATED_CATEGORY_KEYS = [
  'real-estate-property',
  'employment-hr',
  'personal-family',
  'health-care',
  'finance-lending',
  'business-startups',
  'ip-creative',
  'legal-process-disputes',
] as const;

export const CATEGORY_MATCHES: Record<string, string[]> = {
  'real-estate-property': [
    'Real Estate & Property',
    'Real Estate',
    'Property Management',
    'Construction & Home Improvement',
    'Construction',
  ],
  'employment-hr': ['Employment & HR', 'Employment', 'HR'],
  'personal-family': [
    'Personal',
    'Family',
    'Family & Personal',
    'Personal & Lifestyle',
    'Estate Planning',
  ],
  'health-care': ['Healthcare & Medical'],
  'finance-lending': ['Finance & Lending', 'Finance'],
  'business-startups': [
    'Business & Commercial',
    'Business',
    'Corporate',
    'Professional Services',
    'Sales',
    'Marketing & Advertising',
    'Technology & IT',
    'Digital Assets & Blockchain',
    'Gaming & Esports',
  ],
  'ip-creative': ['Intellectual Property', 'Entertainment & Media'],
  'legal-process-disputes': [
    'Legal',
    'Dispute Resolution',
    'Government & Legal Services',
    'Risk & Liability',
    'Risk Management',
  ],
};

const normalize = (value: string) => value.trim().toLowerCase();

export function matchesCategoryLabel(categoryLabel: string, categoryKey: string): boolean {
  const normalizedLabel = normalize(categoryLabel);
  const synonyms = CATEGORY_MATCHES[categoryKey] ?? [];

  if (synonyms.length > 0) {
    return synonyms.some((value) => normalizedLabel === normalize(value));
  }

  const normalizedFromKey = normalize(categoryKey.replace(/-/g, ' '));
  return normalizedLabel === normalizedFromKey;
}
