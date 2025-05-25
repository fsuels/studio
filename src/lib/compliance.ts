import type { ComplianceRule } from '@/types/documents';

export const rules: Record<string, ComplianceRule> = {
  CA: { requireNotary: true, witnessCount: 0 },
  TX: { requireNotary: false, witnessCount: 1 },
  FL: { requireNotary: true, witnessCount: 2 },
  NY: { requireNotary: false, witnessCount: 1 },
  DEFAULT: { requireNotary: false, witnessCount: 0 },
};

export function getCompliance(country: string, state: string): ComplianceRule {
  const code = state?.toUpperCase();
  const rule = rules[code] || rules.DEFAULT;
  return rule;
}
