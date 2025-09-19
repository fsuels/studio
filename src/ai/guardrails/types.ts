export type GuardrailStage = 'prompt_guard' | 'llama_guard' | 'heuristic';

export type GuardrailVerdict = 'allow' | 'review' | 'block';

export type GuardrailEvent = {
  stage: GuardrailStage;
  verdict: GuardrailVerdict;
  reason?: string;
  model?: string;
  metadata?: Record<string, unknown>;
  latencyMs?: number;
};

export type GuardrailDecision = {
  allowed: boolean;
  verdict: GuardrailVerdict;
  stage: GuardrailStage;
  reason?: string;
  escalate?: boolean;
  events: GuardrailEvent[];
};

export type GuardrailInput = {
  prompt: string;
  context?: string[];
  language?: 'en' | 'es' | string;
  jurisdiction?: string;
  channel?: 'intake' | 'drafting' | 'support' | string;
  metadata?: Record<string, unknown>;
};

export type GuardrailConfig = {
  enabled: boolean;
  promptGuardModel?: string;
  llamaGuardModel?: string;
  timeoutMs: number;
};