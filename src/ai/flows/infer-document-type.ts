import 'server-only';

import { generateText, GuardrailViolationError } from '@/ai/ai-instance';
import { getLinkableDocuments } from '@/lib/internal-linking';
import { z } from 'zod';

// Input Schema
export const InferDocumentTypeInputSchema = z.object({
  description: z
    .string()
    .min(1, 'Description cannot be empty.')
    .describe('A description of the user situation, via voice or text.'),
  state: z
    .string()
    .length(2, 'State code must be 2 characters.')
    .optional()
    .describe('2-letter US state code (e.g., "CA", "NY"). Optional.'),
  language: z
    .enum(['en', 'es'])
    .default('en')
    .describe('Language of the description (en or es). Defaults to en.'),
});
export type InferDocumentTypeInput = z.infer<
  typeof InferDocumentTypeInputSchema
>;

// Suggestion Schema
export const DocumentSuggestionSchema = z.object({
  documentType: z
    .string()
    .describe('Exact manifest document name (English) or "General Inquiry".'),
  confidence: z.number().min(0).max(1).describe('Confidence level, 0 to 1.'),
  reasoning: z
    .string()
    .optional()
    .describe('Brief explanation for suggestion.'),
});

// Output Schema
export const InferDocumentTypeOutputSchema = z.object({
  suggestions: z
    .array(DocumentSuggestionSchema)
    .min(1, 'At least one suggestion required.')
    .max(3, 'No more than 3 suggestions.')
    .describe('1-3 suggested document types.'),
});
export type InferDocumentTypeOutput = z.infer<
  typeof InferDocumentTypeOutputSchema
>;

const GENERAL_INQUIRY: InferDocumentTypeOutput = {
  suggestions: [
    {
      documentType: 'General Inquiry',
      confidence: 0.0,
      reasoning:
        'Not enough information to classify the request. A human specialist should review it.',
    },
  ],
};

const getAvailableDocumentsContext = (): {
  context: string;
  englishNames: Set<string>;
  localizedNames: Map<string, Set<string>>;
} => {
  const docs = getLinkableDocuments();
  const englishNames = new Set<string>();
  const localizedNames = new Map<string, Set<string>>();

  const lines = docs.map((doc) => {
    englishNames.add(doc.name.toLowerCase());

    (['en', 'es'] as const).forEach((locale) => {
      const localized = doc.translations?.[locale]?.name;
      if (!localized) return;
      if (!localizedNames.has(locale)) {
        localizedNames.set(locale, new Set());
      }
      localizedNames.get(locale)!.add(localized.toLowerCase());
    });

    const tags = doc.tags.length ? ` | Tags: ${doc.tags.join(', ')}` : '';
    return `- ${doc.name} (ID: ${doc.id}; Category: ${doc.category}${tags})`;
  });

  return {
    context: `Available Document Types:\n${lines.join('\n')}`,
    englishNames,
    localizedNames,
  };
};

const buildPrompt = (
  input: InferDocumentTypeInput,
  documentContext: string,
): string => {
  return [
    'Classify the user request into specific legal document templates.',
    'Return strict JSON with the following shape:',
    '{',
    '  "suggestions": [',
    '    { "documentType": "<exact English template name>", "confidence": 0-1, "reasoning": "short bilingual-friendly explanation" }',
    '  ]',
    '}',
    'Rules:',
    '- Suggest up to 3 document types ranked by confidence.',
    '- Use exact template names from the catalog context. If unsure, return "General Inquiry" with confidence 0.05-0.2.',
    '- Avoid legal advice; keep explanations informational only.',
    '- Provide reasoning in the same language requested when possible.',
    '- Respect the user state and highlight state-specific matches.',
    '- If the description indicates translation-only help, consider forms like "Bilingual Document Support".',
    '',
    `User Description: ${input.description}`,
    `State: ${input.state ?? 'Not specified'}`,
    `Language: ${input.language}`,
    '',
    documentContext,
  ].join('\n');
};

const generalInquiry = (reasoning: string): InferDocumentTypeOutput => ({
  suggestions: [
    {
      documentType: 'General Inquiry',
      confidence: 0.05,
      reasoning,
    },
  ],
});

const matchesKnownDocument = (
  value: string,
  language: 'en' | 'es',
  englishNames: Set<string>,
  localizedNames: Map<string, Set<string>>,
  docs: ReturnType<typeof getLinkableDocuments>,
): boolean => {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return false;
  if (englishNames.has(normalized)) return true;

  const localizedSet = localizedNames.get(language);
  if (localizedSet && localizedSet.has(normalized)) {
    return true;
  }

  return docs.some((doc) =>
    [
      doc.translations?.en?.name,
      doc.translations?.es?.name,
      doc.name,
    ].some((candidate) => candidate?.toLowerCase() === normalized),
  );
};

export const inferDocumentTypeFlow = async (
  input: InferDocumentTypeInput,
): Promise<InferDocumentTypeOutput> => {
  const log = (message: string, ...args: unknown[]) => {
    console.log(`[inferDocumentTypeFlow] ${message}`, ...args);
  };

  log('Received input', input);

  const trimmed = input.description?.trim();
  if (!trimmed) {
    return GENERAL_INQUIRY;
  }

  const parsed = InferDocumentTypeInputSchema.safeParse({
    ...input,
    description: trimmed,
  });

  if (!parsed.success) {
    log('Validation failed', parsed.error.flatten());
    return generalInquiry(
      `Validation error: ${parsed.error.errors.map((e) => e.message).join(', ')}`,
    );
  }

  const safeInput = parsed.data;
  const { context: availableContext, englishNames, localizedNames } =
    getAvailableDocumentsContext();
  const catalog = getLinkableDocuments();

  const prompt = buildPrompt(safeInput, availableContext);

  try {
    const raw = await generateText(prompt, {
      system:
        'You are a bilingual legal intake classifier. Provide compliant, non-advisory suggestions using catalog template names only.',
      channel: 'document_classification',
      language: safeInput.language,
      jurisdiction: safeInput.state,
      metadata: {
        document_catalog_size: catalog.length,
        has_state: Boolean(safeInput.state),
      },
      context: [`language:${safeInput.language}`, `state:${safeInput.state ?? 'none'}`],
      responseFormat: 'json',
      temperature: 0.2,
      maxTokens: 600,
    });

    let candidate: unknown;
    try {
      candidate = JSON.parse(raw);
    } catch (parseError) {
      throw new Error(`Failed to parse AI response as JSON: ${raw}`);
    }

    const validation = InferDocumentTypeOutputSchema.safeParse(candidate);
    if (!validation.success) {
      log('AI output invalid', validation.error.flatten());
      throw new Error('AI output schema mismatch');
    }

    let suggestions = validation.data.suggestions.filter((suggestion) => {
      if (suggestion.documentType === 'General Inquiry') return true;
      return matchesKnownDocument(
        suggestion.documentType,
        safeInput.language,
        englishNames,
        localizedNames,
        catalog,
      );
    });

    if (suggestions.length === 0) {
      suggestions = [
        {
          documentType: 'General Inquiry',
          confidence: 0.1,
          reasoning: 'No catalog matches after safety filtering.',
        },
      ];
    }

    const output: InferDocumentTypeOutput = { suggestions };
    log('Returning suggestions', output);
    return output;
  } catch (error) {
    if (error instanceof GuardrailViolationError) {
      log('Guardrail violation', error.decision);
      return generalInquiry(
        error.decision.reason ??
          'Request routed for human review due to safety policy.',
      );
    }

    const message =
      error instanceof Error ? error.message : 'Unexpected classification error.';
    log('Unexpected error', message);

    return generalInquiry(`Unable to classify automatically: ${message}`);
  }
};
