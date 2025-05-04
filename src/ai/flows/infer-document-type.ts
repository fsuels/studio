
// **Removed 'use server'; directive**

/**
 * @fileOverview This file defines a Genkit flow that infers the type of legal document a user needs based on their description of the situation.
 * This flow is intended to be called by an API route.
 *
 * - InferDocumentTypeInput - The input type for the flow.
 * - InferDocumentTypeOutput - The return type for the flow.
 * - inferDocumentTypeFlow - The internal Genkit flow function.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';
import { GenerateResponseData } from 'genkit/generate';

// Input Schema (Exported for use in API route)
export const InferDocumentTypeInputSchema = z.object({
  description: z
    .string()
    .min(1, "Description cannot be empty.")
    .describe(
      'A description of the user situation, provided via voice or text.'
    ),
});
export type InferDocumentTypeInput = z.infer<typeof InferDocumentTypeInputSchema>;

// Output Schema (Exported for use in API route)
export const InferDocumentTypeOutputSchema = z.object({
  documentType: z
    .string()
    .describe('The inferred type of legal document the user needs.'),
  confidence: z
    .number()
    .min(0).max(1)
    .describe(
      'The confidence level of the document type inference, on a scale of 0 to 1.'
    ),
});
export type InferDocumentTypeOutput = z.infer<typeof InferDocumentTypeOutputSchema>;

// **Removed the exported `inferDocumentType` async function wrapper**


// Internal Genkit prompt definition
const prompt = ai.definePrompt({
  name: 'inferDocumentTypePrompt',
  input: {
    schema: InferDocumentTypeInputSchema,
  },
  output: {
    schema: InferDocumentTypeOutputSchema,
    format: 'json',
  },
  prompt: `You are an AI assistant specialized in legal document identification. Analyze the user's description of their situation and determine the most appropriate type of legal document they might need.

  User Description: {{{description}}}

  Based *only* on the description provided, infer the single most likely legal document type (e.g., "Lease Agreement", "Non-Disclosure Agreement", "Will", "Partnership Agreement", "Invoice Dispute Letter", "Cease and Desist Letter"). If the description is too vague or doesn't clearly suggest a specific legal document, output "General Inquiry" as the document type.

  Provide your inference STRICTLY as a JSON object matching the following structure:
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


// Internal Genkit flow definition (Exported for use by the API route)
export const inferDocumentTypeFlow = ai.defineFlow<
  typeof InferDocumentTypeInputSchema,
  typeof InferDocumentTypeOutputSchema
>({
  name: 'inferDocumentTypeFlow',
  inputSchema: InferDocumentTypeInputSchema,
  outputSchema: InferDocumentTypeOutputSchema,
},
async input => {
   console.log(`[inferDocumentTypeFlow] Flow started. Received input: ${JSON.stringify(input)}`);
   let response: GenerateResponseData<z.infer<typeof InferDocumentTypeOutputSchema>>;
   try {
        // Validate input within the flow (or rely on API route validation)
        const validatedInput = InferDocumentTypeInputSchema.safeParse(input);
        if (!validatedInput.success) {
             const errorMessage = `Invalid input to flow: ${validatedInput.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`;
             console.error("[inferDocumentTypeFlow] Validation Error:", errorMessage, "Input:", input);
             throw new Error(errorMessage);
        }

        console.log("[inferDocumentTypeFlow] Calling AI prompt...");
        response = await prompt(validatedInput.data); // Use validated data
        console.log(`[inferDocumentTypeFlow] Raw prompt response received.`);

       const output = response.output;

       if (!output) {
           console.error('[inferDocumentTypeFlow] Prompt returned null or undefined output. Full response:', JSON.stringify(response));
            throw new Error("AI prompt returned no parsable output.");
       }
       console.log(`[inferDocumentTypeFlow] Raw output from prompt: ${JSON.stringify(output)}`);

      const validatedOutput = InferDocumentTypeOutputSchema.safeParse(output);
       if (!validatedOutput.success) {
           console.error('[inferDocumentTypeFlow] Prompt output validation failed:', validatedOutput.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '), 'Raw output:', JSON.stringify(output));
           const validationErrors = validatedOutput.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
           throw new Error(`AI output validation failed: ${validationErrors}. Raw output: ${JSON.stringify(output)}`);
       }

       console.log(`[inferDocumentTypeFlow] Validation successful. Returning: ${JSON.stringify(validatedOutput.data)}`);
      return validatedOutput.data;
   } catch (error: unknown) {
       console.error('[inferDocumentTypeFlow] Error during prompt execution or processing:', error);
       // Re-throw the error to be handled by the API route.
       if (error instanceof Error) {
           throw error; // Re-throw original error
       } else {
           throw new Error(`Unknown error in AI inference flow: ${String(error)}`);
       }
   }
});
