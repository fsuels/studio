import { GuardrailConfig } from './types';

const parseBoolean = (value: string | undefined): boolean | undefined => {
  if (value === undefined) {
    return undefined;
  }
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  return undefined;
};

const DEFAULT_TIMEOUT_MS = 5000;

export function loadGuardrailConfig(): GuardrailConfig {
  const enabledEnv = parseBoolean(process.env.AI_GUARDRAILS_ENABLED);

  return {
    enabled: enabledEnv ?? true,
    promptGuardModel: process.env.AI_GUARDRAIL_PROMPT_MODEL,
    llamaGuardModel: process.env.AI_GUARDRAIL_POLICY_MODEL,
    timeoutMs: Number(process.env.AI_GUARDRAIL_TIMEOUT_MS ?? DEFAULT_TIMEOUT_MS),
  };
}