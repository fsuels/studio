import {
  unavailableSuggestion,
  unexpectedFailureSuggestion,
  type AnalyzeParams,
  type FieldSuggestion,
} from './analyze-form-data.shared';

const API_ENDPOINT = '/api/ai/analyze-form-data';
const isServer = typeof window === 'undefined';

export async function analyzeFormData(
  params: AnalyzeParams,
): Promise<FieldSuggestion[]> {
  if (isServer) {
    const { analyzeFormDataServer } = await import('./analyze-form-data.server');
    return analyzeFormDataServer(params);
  }

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
      credentials: 'include',
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || `Request failed with status ${response.status}`);
    }

    const data = (await response.json()) as
      | FieldSuggestion[]
      | { suggestions?: FieldSuggestion[] };

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data.suggestions)) {
      return data.suggestions;
    }

    throw new Error('Malformed response from AI analysis endpoint');
  } catch (error) {
    console.error('[analyze-form-data] client request failed', error);
    if (error instanceof TypeError) {
      return [unavailableSuggestion];
    }
    return [unexpectedFailureSuggestion(error)];
  }
}

export type { AnalyzeParams, FieldSuggestion } from './analyze-form-data.shared';
