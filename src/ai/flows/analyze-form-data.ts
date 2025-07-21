// src/ai/flows/analyze-form-data.ts
//--------------------------------------------------
// Very small, framework‑agnostic helper that calls
// OpenAI and returns field‑level suggestions or
// warnings you can surface in DynamicFormRenderer.
//--------------------------------------------------

import { OpenAI } from 'openai'; // make sure you have this tiny SDK
import type { FormField } from '@/data/formSchemas';

export interface AnalyzeParams {
  documentType: string;
  schema: FormField[];
  answers: Record<string, string | number | boolean | undefined>;
}

export interface FieldSuggestion {
  fieldId: string;
  importance: 'info' | 'warning' | 'error';
  message: string;
}

// Lazily initialize OpenAI client
let openai: OpenAI | null = null;
const initializeOpenAI = (): OpenAI | null => {
  if (openai) {
    return openai;
  }
  const openAIApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (!openAIApiKey) {
    console.error(
      '[analyze-form-data.ts] CRITICAL: NEXT_PUBLIC_OPENAI_API_KEY environment variable is NOT SET or is EMPTY. AI analysis will be skipped.',
    );
    return null;
  }
  try {
    openai = new OpenAI({ apiKey: openAIApiKey });
    console.log(
      '[analyze-form-data.ts] OpenAI client initialized successfully.',
    );
    return openai;
  } catch (error) {
    console.error(
      '[analyze-form-data.ts] Failed to initialize OpenAI client:',
      error,
    );
    return null;
  }
};

export async function analyzeFormData(
  params: AnalyzeParams,
): Promise<FieldSuggestion[]> {
  const { documentType, schema, answers } = params;

  const localOpenAI = initializeOpenAI();
  if (!localOpenAI) {
    // Return an empty array or a specific error suggestion if the key is missing
    // This prevents the app from crashing and allows it to continue without AI analysis.
    return [
      {
        fieldId: 'general',
        importance: 'error',
        message:
          'AI analysis service is unavailable due to configuration issues. Please ensure the OpenAI API key is correctly set up.',
      },
    ];
  }

  // Compose a compact prompt. You can of course make this smarter.
  const prompt = `
    You are a senior paralegal helping users spot mistakes in legal‑form answers.
    The document type is "${documentType}".
    Here is the JSON array of questions (schema):
    ${JSON.stringify(schema, null, 2)}

    Here are the user answers:
    ${JSON.stringify(answers, null, 2)}

    Check each answer.  If an answer:
      • is missing but required  ➜ importance "error"
      • looks suspicious (e.g., improbable VIN, future date) ➜ "warning"
      • could be improved stylistically                  ➜ "info"
    Return ONLY a JSON array of objects
      [{ fieldId, importance, message }, …]
  `.trim();

  try {
    console.log('[analyze-form-data.ts] Sending request to OpenAI...');
    const completion = await localOpenAI.chat.completions.create({
      model: 'gpt-4o-mini', // Ensure this model is appropriate and available
      temperature: 0.2,
      messages: [{ role: 'user', content: prompt }],
    });
    console.log('[analyze-form-data.ts] Received response from OpenAI.');

    const raw = completion.choices[0].message.content ?? '[]';
    const suggestions = JSON.parse(raw) as FieldSuggestion[];
    // Shallow validation
    return Array.isArray(suggestions) ? suggestions : [];
  } catch (err: unknown) {
    console.error(
      '[analyze-form-data.ts] Failed to get suggestions from OpenAI or parse them:',
      err,
    );
    const message =
      err instanceof Error
        ? err.message
        : 'Unknown error during OpenAI API call.';
    // Return a specific error suggestion if the API call fails
    return [
      {
        fieldId: 'general', // A general field ID for errors not specific to one input
        importance: 'error',
        message: `AI analysis failed: ${message}`,
      },
    ];
  }
}
