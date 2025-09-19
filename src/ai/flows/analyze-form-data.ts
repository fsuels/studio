import 'server-only';

import {
  createChatCompletion,
  extractMessageContent,
  getAIGatewayModel,
  isAIGatewayConfigured,
} from '@/ai/gateway';
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

const ANALYZE_MODEL = process.env.AI_GATEWAY_ANALYZE_MODEL;

const unavailableSuggestion: FieldSuggestion = {
  fieldId: 'general',
  importance: 'error',
  message:
    'AI analysis service is unavailable. Please review your answers manually and contact support if you need assistance.',
};

export async function analyzeFormData(
  params: AnalyzeParams,
): Promise<FieldSuggestion[]> {
  if (!isAIGatewayConfigured()) {
    return [unavailableSuggestion];
  }

  const { documentType, schema, answers, language = 'en' } = params;

  const messages = [
    {
      role: 'system' as const,
      content:
        'You are a bilingual senior paralegal ensuring data quality for legal intake forms. Respond with valid JSON matching the requested schema.',
    },
    {
      role: 'user' as const,
      content: [
        `Language: ${language}`,
        `Document type: ${documentType}`,
        'Schema:',
        JSON.stringify(schema, null, 2),
        'Answers:',
        JSON.stringify(answers, null, 2),
        'Return ONLY a JSON array of objects like [{"fieldId":"", "importance":"info|warning|error", "message":""}]',
        'Flag missing required answers as error, suspicious values as warning, and stylistic improvements as info.',
      ].join('\n'),
    },
  ];

  try {
    const completion = await createChatCompletion({
      model: getAIGatewayModel(ANALYZE_MODEL),
      messages,
      temperature: 0.1,
      responseFormat: 'json',
      maxTokens: 600,
    });

    const raw = extractMessageContent(completion) || '[]';
    const suggestions = JSON.parse(raw) as FieldSuggestion[];

    if (!Array.isArray(suggestions)) {
      throw new Error('AI gateway returned non-array suggestions');
    }

    return suggestions;
  } catch (error) {
    console.error('[analyze-form-data] AI gateway failure:', error);
    return [
      {
        fieldId: 'general',
        importance: 'error',
        message: `AI analysis failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      },
    ];
  }
}
