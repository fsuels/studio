
'use server';

/**
 * @fileOverview This file defines a Genkit flow that infers the type of legal document a user needs based on their description of the situation.
 *
 * - inferDocumentType - A function that takes a user's description and returns the inferred document type.
 * - InferDocumentTypeInput - The input type for the inferDocumentType function.
 * - InferDocumentTypeOutput - The return type for the inferDocumentType function.
 */

import { ai } from '@/ai/ai-instance'; // This import might throw if API key is missing due to changes in ai-instance.ts
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

// Main exported Server Action function
export async function inferDocumentType(
  input: InferDocumentTypeInput
): Promise<InferDocumentTypeOutput> {
  console.log("[inferDocumentType] Received request with input:", JSON.stringify(input)); // Log entry

  try {
    // 1. Validate input immediately
    const validatedInput = InferDocumentTypeInputSchema.safeParse(input);
    if (!validatedInput.success) {
      const errorMessage = `Invalid input: ${validatedInput.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`;
      console.error("[inferDocumentType] Validation Error:", errorMessage, "Input:", input);
      // Throw a user-friendly error that can be caught by the client
      throw new Error(errorMessage);
    }

    console.log(`[inferDocumentType] Input validated. Calling inferDocumentTypeFlow with: ${JSON.stringify(validatedInput.data)}`);

    // 2. Execute the Genkit flow
    const result = await inferDocumentTypeFlow(validatedInput.data);
    console.log(`[inferDocumentType] inferDocumentTypeFlow executed successfully. Result: ${JSON.stringify(result)}`);
    return result;

  } catch (error: unknown) {
    // 3. Catch ALL errors (validation, flow execution, AI errors, config errors)
    console.error(`[inferDocumentType] Top-level error caught:`, error);

    let clientErrorMessage = 'An error occurred while inferring the document type. Please check the server logs for details.'; // Generic default message for client

     if (error instanceof Error) {
         // Prioritize the message from the caught error
         clientErrorMessage = `Failed to infer document type: ${error.message}`;
         // Log stack trace server-side only for debugging
         console.error("Stack Trace (Server-Side Only):", error.stack);
     } else {
         // Handle rare cases where the thrown object is not an Error instance
         clientErrorMessage = `An unexpected error occurred: ${String(error)}`;
     }
    // IMPORTANT: Always throw a new, simple Error object to the client boundary
    throw new Error(clientErrorMessage);
  }
}


// Internal Genkit prompt definition
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


// Internal Genkit flow definition
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
        console.log("[inferDocumentTypeFlow] Calling AI prompt..."); // Log before the call
        // The 'ai' instance or the 'prompt' call itself might throw if the API key is invalid/missing
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
           // Include details about validation failure in the error message
           const validationErrors = validatedOutput.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
           throw new Error(`AI output validation failed: ${validationErrors}. Raw output: ${JSON.stringify(output)}`);
       }

       console.log(`[inferDocumentTypeFlow] Validation successful. Returning: ${JSON.stringify(validatedOutput.data)}`);
      return validatedOutput.data;
   } catch (error: unknown) {
       // Log the specific error within the flow for detailed server-side debugging
       console.error('[inferDocumentTypeFlow] Error during prompt execution or processing:', error);

       // Re-throw the error to be caught by the top-level handler in `inferDocumentType`.
       // This keeps the flow focused on its task and lets the Server Action boundary handle client-facing errors.
       // If the error is already an Error instance, re-throw it directly.
       if (error instanceof Error) {
           // Optionally wrap it to add context, but re-throwing the original is often fine.
           // throw new Error(`Error in AI inference flow step: ${error.message}`, { cause: error });
           throw error;
       } else {
           // Handle non-Error exceptions by converting them to a standard Error.
           throw new Error(`Unknown error in AI inference flow: ${String(error)}`);
       }
   }
});
