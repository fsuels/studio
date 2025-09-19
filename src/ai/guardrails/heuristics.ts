export type HeuristicRule = {
  id: string;
  pattern: RegExp;
  verdict: 'review' | 'block';
  reason: string;
  severity?: 'low' | 'medium' | 'high';
};

export const HEURISTIC_RULES: HeuristicRule[] = [
  {
    id: 'upl_request_represent',
    pattern: /(represent|act)\s+(me|us)\s+in\s+(court|legal case)/i,
    verdict: 'block',
    reason: 'Detected request for legal representation which violates UPL guardrails.',
    severity: 'high',
  },
  {
    id: 'upl_predict_outcome',
    pattern: /(predict|guarantee).*court verdict/i,
    verdict: 'review',
    reason: 'User requesting guaranteed court outcomes should route to human escalation.',
    severity: 'medium',
  },
  {
    id: 'personal_data_exposure',
    pattern: /(ssn|social security|passport|drivers? license)/i,
    verdict: 'review',
    reason: 'Potential personal data exposure; ensure redaction before processing.',
    severity: 'medium',
  },
];

export function evaluateHeuristics(text: string): HeuristicRule | undefined {
  for (const rule of HEURISTIC_RULES) {
    if (rule.pattern.test(text)) {
      return rule;
    }
  }
  return undefined;
}