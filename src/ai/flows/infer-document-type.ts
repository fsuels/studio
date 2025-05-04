'use server';

/**
 * @fileOverview This file defines a Genkit flow that infers the type of legal document a user needs based on their description of the situation.
 *
 * - inferDocumentType - A function that takes a user's description and returns the inferred document type.
 * - InferDocumentTypeInput - The input type for the inferDocumentType function.
 * - InferDocumentTypeOutput - The return type for the inferDocumentType function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const InferDocumentTypeInputSchema = z.object({
  description: z
    .string()
    .describe(
      'A description of the user situation, provided via voice or text.'
    ),
});
export type InferDocumentTypeInput = z.infer<typeof InferDocumentTypeInputSchema>;

const InferDocumentTypeOutputSchema = z.object({
  documentType: z
    .string()
    .describe('The inferred type of legal document the user needs.'),
  confidence: z
    .number()
    .describe(
      'The confidence level of the document type inference, on a scale of 0 to 1.'
    ),
});
export type InferDocumentTypeOutput = z.infer<typeof InferDocumentTypeOutputSchema>;

export async function inferDocumentType(
  input: InferDocumentTypeInput
): Promise<InferDocumentTypeOutput> {
  return inferDocumentTypeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'inferDocumentTypePrompt',
  input: {
    schema: z.object({
      description: z
        .string()
        .describe(
          'A description of the user situation, provided via voice or text.'
        ),
    }),
  },
  output: {
    schema: z.object({
      documentType: z
        .string()
        .describe('The inferred type of legal document the user needs.'),
      confidence: z
        .number()
        .describe(
          'The confidence level of the document type inference, on a scale of 0 to 1.'
        ),
    }),
  },
  prompt: `You are an AI assistant designed to infer the type of legal document a user needs based on their description of the situation.

  Description: {{{description}}}

  Infer the document type and provide a confidence level (0 to 1) for your inference.`,
});

const inferDocumentTypeFlow = ai.defineFlow<
  typeof InferDocumentTypeInputSchema,
  typeof InferDocumentTypeOutputSchema
>({
  name: 'inferDocumentTypeFlow',
  inputSchema: InferDocumentTypeInputSchema,
  outputSchema: InferDocumentTypeOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});
