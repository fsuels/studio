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
    .min(0).max(1) // Ensure confidence is within the 0-1 range
    .describe(
      'The confidence level of the document type inference, on a scale of 0 to 1.'
    ),
});
export type InferDocumentTypeOutput = z.infer<typeof InferDocumentTypeOutputSchema>;

export async function inferDocumentType(
  input: InferDocumentTypeInput
): Promise<InferDocumentTypeOutput> {
  // Validate input at the entry point (optional but good practice)
  const validatedInput = InferDocumentTypeInputSchema.safeParse(input);
  if (!validatedInput.success) {
    console.error("Invalid input to inferDocumentType:", validatedInput.error);
    throw new Error(`Invalid input: ${validatedInput.error.errors.map(e => e.message).join(', ')}`);
  }
  return inferDocumentTypeFlow(validatedInput.data);
}

const prompt = ai.definePrompt({
  name: 'inferDocumentTypePrompt',
  input: {
    schema: InferDocumentTypeInputSchema, // Use the schema directly
  },
  output: {
    schema: InferDocumentTypeOutputSchema, // Use the schema directly
  },
  prompt: `You are an AI assistant specialized in legal document identification. Analyze the user's description of their situation and determine the most appropriate type of legal document they might need.

  User Description: {{{description}}}

  Based *only* on the description provided, infer the single most likely legal document type (e.g., "Lease Agreement", "Non-Disclosure Agreement", "Will", "Partnership Agreement", "Invoice Dispute Letter", "Cease and Desist Letter"). If the description is too vague or doesn't clearly suggest a specific legal document, output "General Inquiry" as the document type.

  Provide your inference as a JSON object matching the following structure:
  {
    "documentType": "The inferred document type (string)",
    "confidence": A confidence score between 0.0 and 1.0 (float), representing your certainty in the inference. Use a lower score if unsure or if "General Inquiry" is chosen.
  }

  Example output for a clear case:
  {
    "documentType": "Lease Agreement",
    "confidence": 0.95
  }

  Example output for a vague case:
  {
    "documentType": "General Inquiry",
    "confidence": 0.3
  }`,
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
   console.log(`[inferDocumentTypeFlow] Received input: ${JSON.stringify(input)}`); // Log input
   try {
      const {output} = await prompt(input);

      if (!output) {
           console.error('[inferDocumentTypeFlow] Prompt returned no output.');
           throw new Error('AI prompt failed to return a valid output.');
      }
      console.log(`[inferDocumentTypeFlow] Received output: ${JSON.stringify(output)}`); // Log output

      // Validate the output against the schema before returning
      const validatedOutput = InferDocumentTypeOutputSchema.safeParse(output);
       if (!validatedOutput.success) {
           console.error('[inferDocumentTypeFlow] Prompt output validation failed:', validatedOutput.error);
           // Attempt to return a default/fallback if validation fails
           // This might happen if the LLM doesn't perfectly adhere to the schema
           return {
             documentType: "General Inquiry",
             confidence: 0.1 // Low confidence due to parsing failure
           };
           // Or re-throw if strict adherence is required:
           // throw new Error(`AI output validation failed: ${validatedOutput.error.errors.map(e => e.message).join(', ')}`);
       }

      return validatedOutput.data;
   } catch (error) {
       console.error('[inferDocumentTypeFlow] Error during prompt execution:', error);
       // Re-throw the error so it can be caught by the calling function
       // Potentially wrap it in a more specific error type if needed
       throw new Error(`Error in AI document inference: ${error instanceof Error ? error.message : String(error)}`);
   }

});
