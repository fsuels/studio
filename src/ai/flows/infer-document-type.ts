'use server';

/**
 * @fileOverview This file defines a Genkit flow that infers the type of legal document a user needs based on their description of the situation.
 *
 * - inferDocumentType - A function that takes a user's description and returns the inferred document type.
 * - InferDocumentTypeInput - The input type for the inferDocumentType function.
 * - InferDocumentTypeOutput - The return type for the inferDocumentType function.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';
import { GenerateResponseData } from 'genkit/generate'; // Import necessary type

const InferDocumentTypeInputSchema = z.object({
  description: z
    .string()
    .min(1, "Description cannot be empty.") // Add basic validation
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
  console.log("[inferDocumentType] Received request with input:", JSON.stringify(input)); // Log entry

  // Validate input at the entry point
  const validatedInput = InferDocumentTypeInputSchema.safeParse(input);
  if (!validatedInput.success) {
    const errorMessage = `Invalid input: ${validatedInput.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`;
    console.error("[inferDocumentType] Validation Error:", errorMessage, "Input:", input);
    // Throw a standard Error that can be serialized and caught by the client
    throw new Error(errorMessage);
  }
   console.log(`[inferDocumentType] Input validated. Calling inferDocumentTypeFlow with: ${JSON.stringify(validatedInput.data)}`);
   try {
       const result = await inferDocumentTypeFlow(validatedInput.data);
       console.log(`[inferDocumentType] inferDocumentTypeFlow executed successfully. Result: ${JSON.stringify(result)}`);
       return result;
   } catch (error: unknown) {
       // Catch any error from the flow, log it server-side, and re-throw a standard Error
       console.error(`[inferDocumentType] Error executing inferDocumentTypeFlow:`, error);
       let clientErrorMessage = 'An error occurred while inferring the document type. Please check the server logs for details.'; // Generic default message for client

        if (error instanceof Error) {
            // Use the message from the caught error for the client-facing message
            // Keep it relatively simple and avoid exposing sensitive details
            clientErrorMessage = `Failed to infer document type: ${error.message}`;
            console.error("Stack Trace:", error.stack); // Log stack trace server-side only for debugging
        } else {
            // Handle cases where the thrown object is not an Error instance
            clientErrorMessage = `An unexpected error occurred: ${String(error)}`;
        }
       // Throw a new, simple Error object suitable for the client (Server Action boundary)
       throw new Error(clientErrorMessage);
   }
}

const prompt = ai.definePrompt({
  name: 'inferDocumentTypePrompt',
  input: {
    schema: InferDocumentTypeInputSchema, // Use the schema directly
  },
  output: {
    schema: InferDocumentTypeOutputSchema, // Use the schema directly
    format: 'json', // Explicitly request JSON format
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


const inferDocumentTypeFlow = ai.defineFlow<
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
        console.log("[inferDocumentTypeFlow] Calling AI prompt...");
        response = await prompt(input); // Await the prompt call
        console.log(`[inferDocumentTypeFlow] Raw prompt response received.`);

       const output = response.output; // Access output using .output

       if (!output) {
           console.error('[inferDocumentTypeFlow] Prompt returned null or undefined output. Full response:', JSON.stringify(response));
           // Throw an error if the expected output structure is missing
            throw new Error("AI prompt returned no parsable output.");
       }
       console.log(`[inferDocumentTypeFlow] Raw output from prompt: ${JSON.stringify(output)}`);

      // Validate the output against the schema before returning
      const validatedOutput = InferDocumentTypeOutputSchema.safeParse(output);
       if (!validatedOutput.success) {
           console.error('[inferDocumentTypeFlow] Prompt output validation failed:', validatedOutput.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '), 'Raw output:', JSON.stringify(output));
           // Throw an error if validation fails, indicating the AI didn't follow instructions
           throw new Error(`AI output validation failed: ${validatedOutput.error.errors.map(e => e.message).join(', ')}. Raw output: ${JSON.stringify(output)}`);
       }

       console.log(`[inferDocumentTypeFlow] Validation successful. Returning: ${JSON.stringify(validatedOutput.data)}`);
      return validatedOutput.data;
   } catch (error: unknown) {
       // Log the specific error within the flow
       console.error('[inferDocumentTypeFlow] Error during prompt execution or processing:', error);
       // Decide whether to throw the original error or a new one.
       // Throwing a new Error allows attaching a more specific message for this context.
        if (error instanceof Error) {
            // Re-throw a new error that includes the original message but keeps it potentially simpler.
            throw new Error(`Error in AI inference flow: ${error.message}`, { cause: error }); // Preserve original error in cause if needed server-side
        } else {
            // Handle non-Error exceptions
            throw new Error(`Unknown error in AI inference flow: ${String(error)}`);
        }
   }
});
