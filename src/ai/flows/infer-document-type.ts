// **Removed 'use server'; directive**

/**
 * @fileOverview This file defines a Genkit flow that infers the type of legal document a user needs
 * based on their description, state, and language. Intended for an API route.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';
import { GenerateResponseData } from 'genkit/generate';
import { documentLibrary } from '@/lib/document-library';

// Input Schema
export const InferDocumentTypeInputSchema = z.object({
  description: z
    .string()
    .min(1, "Description cannot be empty.")
    .describe('A description of the user situation, via voice or text.'),
  state: z
    .string()
    .length(2, "State code must be 2 characters.")
    .optional()
    .describe('2-letter US state code (e.g., "CA", "NY"). Optional.'),
  language: z.enum(['en', 'es']).default('en')
    .describe('Language of the description (en or es). Defaults to en.')
});
export type InferDocumentTypeInput = z.infer<typeof InferDocumentTypeInputSchema>;

// Suggestion Schema
export const DocumentSuggestionSchema = z.object({
  documentType: z.string()
    .describe('Exact English name from documentLibrary or "General Inquiry".'),
  confidence: z.number().min(0).max(1)
    .describe('Confidence level, 0 to 1.'),
  reasoning: z.string().optional()
    .describe('Brief explanation for suggestion.')
});

// Output Schema
export const InferDocumentTypeOutputSchema = z.object({
  suggestions: z.array(DocumentSuggestionSchema)
    .min(1, "At least one suggestion required.")
    .max(3, "No more than 3 suggestions.")
    .describe('1-3 suggested document types.')
});
export type InferDocumentTypeOutput = z.infer<typeof InferDocumentTypeOutputSchema>;

// Build context string from documentLibrary
// Currently we ignore the language argument but keep the helper for
// potential localization of document names in the future.
const getAvailableDocumentsContext = (): string => {
  return `Available Document Types:
${documentLibrary.map(doc => `- ${doc.name} (Category: ${doc.category})`).join('\n')}`;
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

Respond with strict JSON matching schema.`
});

// Define flow
export const inferDocumentTypeFlow = ai.defineFlow<
  typeof InferDocumentTypeInputSchema,
  typeof InferDocumentTypeOutputSchema
>({
  name: 'inferDocumentTypeFlow',
  inputSchema: InferDocumentTypeInputSchema,
  outputSchema: InferDocumentTypeOutputSchema,
},
async (input) => {
  // Allow any type of additional log arguments without using `any`.
  const log = (msg: string, ...args: unknown[]) => console.log(`[inferDocFlow] ${msg}`, ...args);
  log('Received input', input);

  // Trim and validate description
  const trimmed = input.description?.trim();
  if (!trimmed) {
    return {
      suggestions: [{
        documentType: 'General Inquiry',
        confidence: 0.0,
        reasoning: 'Description was empty or whitespace only.'
      }]
    };
  }

  // Re-validate with trimmed description
  const parsed = InferDocumentTypeInputSchema.safeParse({ ...input, description: trimmed });
  if (!parsed.success) {
    log('Validation failed', parsed.error.errors);
    return {
      suggestions: [{
        documentType: 'General Inquiry',
        confidence: 0.0,
        reasoning: `Validation error: ${parsed.error.errors.map(e => e.message).join(', ')}`
      }]
    };
  }

  const ctx = getAvailableDocumentsContext();

  try {
    const response: GenerateResponseData<InferDocumentTypeOutput> = await prompt({
      ...parsed.data,
      availableDocumentsContext: ctx
    });
    const output = response.output;

    if (!output) throw new Error('AI returned no output');

    // Validate output
    const validOut = InferDocumentTypeOutputSchema.safeParse(output);
    if (!validOut.success) {
      log('AI output invalid', validOut.error.errors);
      throw new Error('AI output schema mismatch');
    }

    // Filter suggestions to known docs
    let suggestions = validOut.data.suggestions.filter(s =>
      s.documentType === 'General Inquiry' || documentLibrary.some(d => d.name === s.documentType)
    );
    if (suggestions.length === 0) {
      suggestions = [{
        documentType: 'General Inquiry',
        confidence: 0.1,
        reasoning: 'No valid suggestions after filtering.'
      }];
    }

    log('Returning suggestions', suggestions);
    return { suggestions };

  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    log('Error in flow', error.message);
    return {
      suggestions: [{
        documentType: 'General Inquiry',
        confidence: 0.05,
        reasoning: `Unexpected error: ${error.message}`
      }]
    };
  }
});
