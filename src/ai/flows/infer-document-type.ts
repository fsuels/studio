// **Removed 'use server'; directive**

/**
 * @fileOverview This file defines a Genkit flow that infers the type of legal document a user needs
 * based on their description, state, and language. Intended for an API route.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'zod';
import { getLinkableDocuments } from '@/lib/internal-linking';

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

// Build a manifest-backed context string for the AI prompt.
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

    const locales: Array<'en' | 'es'> = ['en', 'es'];
    locales.forEach((locale) => {
      const localized = doc.translations?.[locale]?.name;
      if (!localized) return;
      const mapKey = locale;
      if (!localizedNames.has(mapKey)) {
        localizedNames.set(mapKey, new Set());
      }
      localizedNames.get(mapKey)!.add(localized.toLowerCase());
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

// Define AI prompt
const prompt = ai.definePrompt({
  name: 'inferDocumentTypePrompt',
  model: 'googleai/gemini-2.5-pro-exp-03-25',
  input: { schema: InferDocumentTypeInputSchema },
  output: { schema: InferDocumentTypeOutputSchema, format: 'json' },
  prompt: `You are a legal AI assistant. Suggest 1-3 documents based on:
User Description: {{{description}}}
State: {{#if state}}{{state}}{{else}}Not Specified{{/if}}
Language: {{language}}
Context:
{{{availableDocumentsContext}}}

Respond with strict JSON matching schema.`,
});

// Define flow
export const inferDocumentTypeFlow = ai.defineFlow(
  {
    name: 'inferDocumentTypeFlow',
    inputSchema: InferDocumentTypeInputSchema,
    outputSchema: InferDocumentTypeOutputSchema,
  },
  async (input: InferDocumentTypeInput) => {
    // Allow any type of additional log arguments without using `any`.
    const log = (msg: string, ...args: unknown[]) =>
      console.log(`[inferDocFlow] ${msg}`, ...args);
    log('Received input', input);

    // Trim and validate description
    const trimmed = input.description?.trim();
    if (!trimmed) {
      return {
        suggestions: [
          {
            documentType: 'General Inquiry',
            confidence: 0.0,
            reasoning: 'Description was empty or whitespace only.',
          },
        ],
      };
    }

    // Re-validate with trimmed description
    const parsed = InferDocumentTypeInputSchema.safeParse({
      ...input,
      description: trimmed,
    });
    if (!parsed.success) {
      log('Validation failed', parsed.error.errors);
      return {
        suggestions: [
          {
            documentType: 'General Inquiry',
            confidence: 0.0,
            reasoning: `Validation error: ${parsed.error.errors.map((e) => e.message).join(', ')}`,
          },
        ],
      };
    }

    const { context: availableContext, englishNames, localizedNames } =
      getAvailableDocumentsContext();

    try {
      const response = await prompt({
        ...parsed.data,
        // Extra context isn't part of the input schema; cast to satisfy typing
        availableDocumentsContext: availableContext,
      } as InferDocumentTypeInput & { availableDocumentsContext: string });
      const output = response.output as InferDocumentTypeOutput;

      if (!output) throw new Error('AI returned no output');

      // Validate output
      const validOut = InferDocumentTypeOutputSchema.safeParse(output);
      if (!validOut.success) {
        log('AI output invalid', validOut.error.errors);
        throw new Error('AI output schema mismatch');
      }

      // Filter suggestions to known docs
      const docs = getLinkableDocuments();

      const matchesKnownDocument = (name: string, language: 'en' | 'es') => {
        const normalized = name.trim().toLowerCase();
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
          ].some((candidate) =>
            candidate?.toLowerCase() === normalized,
          ),
        );
      };

      let suggestions = validOut.data.suggestions.filter((s) => {
        if (s.documentType === 'General Inquiry') return true;
        const locale = parsed.data.language ?? 'en';
        return matchesKnownDocument(s.documentType, locale);
      });
      if (suggestions.length === 0) {
        suggestions = [
          {
            documentType: 'General Inquiry',
            confidence: 0.1,
            reasoning: 'No valid suggestions after filtering.',
          },
        ];
      }

      log('Returning suggestions', suggestions);
      return { suggestions };
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      log('Error in flow', error.message);
      return {
        suggestions: [
          {
            documentType: 'General Inquiry',
            confidence: 0.05,
            reasoning: `Unexpected error: ${error.message}`,
          },
        ],
      };
    }
  },
);
