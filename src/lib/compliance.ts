import type { ComplianceRule } from '@/types/documents';

const complianceRules: Record<string, ComplianceRule> = {
  CA: { requireNotary: true, witnessCount: 0 },
  TX: { requireNotary: false, witnessCount: 1 },
  FL: { requireNotary: true, witnessCount: 2 },
  NY: { requireNotary: false, witnessCount: 1 },
  DEFAULT: { requireNotary: false, witnessCount: 0 },
};

export const rules = complianceRules;

export function getCompliance(state: string) {
  return (
    complianceRules[state.toUpperCase() as keyof typeof complianceRules] ?? {
      witnessCount: 0,
      notaryRequired: false,
    }
  );
}
