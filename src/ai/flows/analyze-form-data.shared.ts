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

export const ANALYZE_CHANNEL = 'form_review';

export const unavailableSuggestion: FieldSuggestion = {
  fieldId: 'general',
  importance: 'error',
  message:
    'AI analysis service is unavailable. Please review your answers manually and contact support if you need assistance.',
};

export const guardrailBlockedSuggestion = (reason?: string): FieldSuggestion => ({
  fieldId: 'general',
  importance: 'error',
  message:
    reason?.trim().length
      ? `AI analysis blocked for safety review: ${reason}`
      : 'AI analysis blocked for safety review. A specialist will follow up.',
});

export const unexpectedFailureSuggestion = (error: unknown): FieldSuggestion => ({
  fieldId: 'general',
  importance: 'error',
  message: `AI analysis failed: ${
    error instanceof Error ? error.message : 'Unknown error'
  }`,
});
