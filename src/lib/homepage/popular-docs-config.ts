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
  'real-estate-property': ['Real Estate', 'Property'],
  'employment-hr': ['Employment', 'HR'],
  'personal-family': ['Personal', 'Family'],
  'health-care': ['Health', 'Healthcare', 'Medical'],
  'finance-lending': ['Finance', 'Financial', 'Lending'],
  'business-startups': ['Business', 'Corporate'],
  'ip-creative': ['Intellectual Property', 'IP', 'Creative'],
  'legal-process-disputes': ['Legal', 'Disputes'],
};
