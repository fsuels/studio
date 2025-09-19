import 'server-only';

import {
  evaluateGuardrails,
  type GuardrailDecision,
  type GuardrailInput,
} from '@/ai/guardrails';
import {
  createChatCompletion,
  extractMessageContent,
  getAIGatewayModel,
  isAIGatewayConfigured,
} from '@/ai/gateway';

const DEFAULT_SYSTEM_PROMPT =
  'You are a bilingual legal operations assistant. Provide neutral, plain-language output and never give legal advice.';
const DEFAULT_CHANNEL = 'general';

export class GuardrailViolationError extends Error {
  constructor(
    message: string,
    readonly decision: GuardrailDecision,
    readonly stage: 'prompt' | 'response',
    cause?: unknown,
  ) {
    super(message);
    this.name = 'GuardrailViolationError';
    if (cause instanceof Error && 'cause' in Error.prototype) {
      (this as Error & { cause?: unknown }).cause = cause;
    }
  }
}

export type GenerateTextOptions = {
  system?: string;
  model?: string;
  channel?: string;
  language?: GuardrailInput['language'];
  jurisdiction?: string;
  metadata?: Record<string, unknown>;
  context?: string[];
  temperature?: number;
  maxTokens?: number;
  responseFormat?: 'text' | 'json';
};

const buildGuardrailFailureDecision = (
  stage: 'prompt' | 'response',
  error: unknown,
): GuardrailDecision => {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : 'Unknown guardrail failure';

  return {
    allowed: false,
    verdict: 'review',
    stage: 'heuristic',
    reason: `Guardrail pipeline failure during ${stage}: ${message}`,
    escalate: true,
    events: [],
  };
};

const enforceGuardrails = async (
  stage: 'prompt' | 'response',
  input: GuardrailInput,
  assistantResponse?: string,
): Promise<GuardrailDecision> => {
  try {
    const decision = await evaluateGuardrails(input, assistantResponse);
    if (!decision.allowed) {
      throw new GuardrailViolationError(
        stage === 'prompt'
          ? 'Guardrails blocked the prompt before sending to the model.'
          : 'Guardrails blocked the model response before delivery.',
        decision,
        stage,
      );
    }
    return decision;
  } catch (error) {
    if (error instanceof GuardrailViolationError) {
      throw error;
    }
    const failureDecision = buildGuardrailFailureDecision(stage, error);
    throw new GuardrailViolationError(
      failureDecision.reason ?? 'Guardrail pipeline failure',
      failureDecision,
      stage,
      error,
    );
  }
};

export async function generateText(
  prompt: string,
  options: GenerateTextOptions = {},
): Promise<string> {
  const trimmedPrompt = prompt?.trim();
  if (!trimmedPrompt) {
    throw new Error('Prompt text is required for generateText.');
  }

  if (!isAIGatewayConfigured()) {
    throw new Error('AI gateway is not configured.');
  }

  const guardrailInput: GuardrailInput = {
    prompt: trimmedPrompt,
    channel: options.channel ?? DEFAULT_CHANNEL,
    language: options.language,
    jurisdiction: options.jurisdiction,
    context: options.context,
    metadata: options.metadata,
  };

  await enforceGuardrails('prompt', guardrailInput);

  const completion = await createChatCompletion({
    model: getAIGatewayModel(options.model),
    messages: [
      {
        role: 'system',
        content: options.system?.trim() || DEFAULT_SYSTEM_PROMPT,
      },
      { role: 'user', content: trimmedPrompt },
    ],
    temperature: options.temperature ?? 0.2,
    maxTokens: options.maxTokens,
    responseFormat: options.responseFormat === 'json' ? 'json' : undefined,
  });

  const rawContent = extractMessageContent(completion);
  const content = rawContent?.trim();
  if (!content) {
    throw new Error('AI gateway returned empty content.');
  }

  await enforceGuardrails('response', guardrailInput, content);

  return content;
}

export const aiInstance = {
  generateText,
};

export const ai = {
  async run(): Promise<never> {
    throw new Error('Genkit runtime has been removed. Use aiInstance.generateText instead.');
  },
  definePrompt(): never {
    throw new Error('Genkit prompts are no longer supported.');
  },
  defineFlow(): never {
    throw new Error('Genkit flows are no longer supported.');
  },
};

