import 'server-only';

import { generateText, GuardrailViolationError } from '@/ai/ai-instance';
import { isAIGatewayConfigured } from '@/ai/gateway';
import type { FormField } from '@/data/formSchemas';

export interface AnalyzeParams {
  documentType: string;
  schema: FormField[];
  answers: Record<string, string | number | boolean | undefined>;
  language?: 'en' | 'es';
}

export interface FieldSuggestion {
  fieldId: string;
  importance: 'info' | 'warning' | 'error';
  message: string;
}

const ANALYZE_CHANNEL = 'form_review';

const unavailableSuggestion: FieldSuggestion = {
  fieldId: 'general',
  importance: 'error',
  message:
    'AI analysis service is unavailable. Please review your answers manually and contact support if you need assistance.',
};

const guardrailBlockedSuggestion = (reason?: string): FieldSuggestion => ({
  fieldId: 'general',
  importance: 'error',
  message:
    reason?.trim().length
      ? `AI analysis blocked for safety review: ${reason}`
      : 'AI analysis blocked for safety review. A specialist will follow up.',
});

const unexpectedFailureSuggestion = (error: unknown): FieldSuggestion => ({
  fieldId: 'general',
  importance: 'error',
  message: `AI analysis failed: ${
    error instanceof Error ? error.message : 'Unknown error'
  }`,
});

export async function analyzeFormData(
  params: AnalyzeParams,
): Promise<FieldSuggestion[]> {
  if (!isAIGatewayConfigured()) {
    return [unavailableSuggestion];
  }

  const { documentType, schema, answers, language = 'en' } = params;

  const prompt = [
    `Language: ${language}`,
    `Document type: ${documentType}`,
    'Schema:',
    JSON.stringify(schema, null, 2),
    'Answers:',
    JSON.stringify(answers, null, 2),
    'Return ONLY a JSON array of objects like [{"fieldId":"", "importance":"info|warning|error", "message":""}]',
    'Flag missing required answers as error, suspicious values as warning, and stylistic improvements as info.',
  ].join('\n');

  try {
    const raw = await generateText(prompt, {
      system:
        'You are a bilingual senior paralegal ensuring data quality for legal intake forms. Respond with valid JSON matching the requested schema.',
      channel: ANALYZE_CHANNEL,
      language,
      metadata: {
        documentType,
        schemaFieldCount: schema.length,
      },
      context: [`documentType:${documentType}`, `language:${language}`],
      responseFormat: 'json',
      temperature: 0.1,
      maxTokens: 600,
    });

    const suggestions = JSON.parse(raw) as FieldSuggestion[];

    if (!Array.isArray(suggestions)) {
      throw new Error('AI gateway returned non-array suggestions');
    }

    return suggestions;
  } catch (error) {
    if (error instanceof GuardrailViolationError) {
      console.warn('[analyze-form-data] Guardrail violation', error.decision);
      return [guardrailBlockedSuggestion(error.decision.reason)];
    }

    console.error('[analyze-form-data] AI gateway failure:', error);
    return [unexpectedFailureSuggestion(error)];
  }
}

