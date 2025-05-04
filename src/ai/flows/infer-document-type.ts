
// **Removed 'use server'; directive**

/**
 * @fileOverview This file defines a Genkit flow that infers the type of legal document a user needs based on their description and state.
 * This flow is intended to be called by an API route.
 *
 * - InferDocumentTypeInput - The input type for the flow.
 * - InferDocumentTypeOutput - The return type for the flow.
 * - inferDocumentTypeFlow - The internal Genkit flow function.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';
import { GenerateResponseData } from 'genkit/generate';
import { documentLibrary } from '@/lib/document-library'; // Import library for context

// Input Schema (Exported for use in API route)
export const InferDocumentTypeInputSchema = z.object({
  description: z
    .string()
    .min(1, "Description cannot be empty.")
    .describe(
      'A description of the user situation, provided via voice or text.'
    ),
  state: z
    .string()
    .length(2, "State code must be 2 characters.") // Basic validation for US state code
    .optional() // Make state optional for now
    .describe('The 2-letter US state code relevant to the legal situation (e.g., "CA", "NY"). Optional.'),
});
export type InferDocumentTypeInput = z.infer<typeof InferDocumentTypeInputSchema>;

// Output Schema (Exported for use in API route)
export const InferDocumentTypeOutputSchema = z.object({
  documentType: z
    .string()
    .describe('The inferred type or ID of the most likely legal document the user needs (e.g., "Residential Lease Agreement", "nda-mutual"). Must exactly match a "name" from the provided document library.'),
  alternatives: z.array(z.string()).optional().describe('Optionally, suggest 1-2 alternative document types (using exact "name" from the library) if the primary inference is uncertain.'),
  confidence: z
    .number()
    .min(0).max(1)
    .describe(
      'The confidence level of the primary document type inference, on a scale of 0 to 1.'
    ),
  reasoning: z.string().optional().describe('Brief explanation for the inference, especially if confidence is low or alternatives are suggested.'),
});
export type InferDocumentTypeOutput = z.infer<typeof InferDocumentTypeOutputSchema>;

// **Removed the exported `inferDocumentType` async function wrapper**


// Provide context about available documents to the AI
const availableDocumentsContext = `
Available Document Types (use the 'name' field for output):
${documentLibrary.map(doc => `- Name: "${doc.name}" (ID: ${doc.id}, Aliases: ${doc.aliases.join(', ')}, States: ${Array.isArray(doc.states) ? doc.states.join(', ') : doc.states})${doc.description ? ` - Description: ${doc.description}` : ''}`).join('\n')}
`;


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
  prompt: `You are an AI assistant specialized in identifying U.S. legal document needs. Analyze the user's description and the relevant U.S. state (if provided) to determine the most appropriate type of legal document from the list provided below.

  User Description: {{{description}}}
  Relevant State: {{#if state}}{{state}}{{else}}Not Specified{{/if}}

  Context on available document types:
  ${availableDocumentsContext}

  Based *only* on the description, state, and the provided "Available Document Types" list:
  1. Infer the single most likely legal document type. Consider the document's 'Name', 'Aliases', and 'Description' to find the best match. Output the exact 'Name' string for the 'documentType' field.
  2. Consider the 'Relevant State'. If a document lists specific states, prioritize it only if the state matches or if 'all' states apply. If the state is not specified but the best match is state-specific, mention this limitation in the reasoning.
  3. If the description is vague, confidence is low (e.g., < 0.6), or multiple documents could plausibly fit based on aliases or description, suggest 1-2 plausible 'alternatives' (using their exact 'Name' strings from the list).
  4. **CRITICAL:** If the description doesn't clearly suggest any specific legal document *from the list provided*, or if the need seems outside the scope of these documents, output "General Inquiry" as the documentType, set confidence low (e.g., 0.1), and explain why in the reasoning. Do NOT invent document types not in the list.
  5. Provide a confidence score (0.0-1.0) for your primary inference. Be realistic; high confidence (e.g., > 0.9) requires a very clear match.
  6. Briefly explain your reasoning, especially for low confidence, state considerations, or when suggesting alternatives.

  Provide your inference STRICTLY as a JSON object matching the following structure:
  {
    "documentType": "The exact inferred document name (string) from the list",
    "alternatives": ["Alternative Document Name 1", "Alternative Document Name 2"], // Optional array, exact names from list
    "confidence": A confidence score between 0.0 and 1.0 (float),
    "reasoning": "Brief explanation (string)" // Optional but encouraged
  }

  Example output for a clear case:
  {
    "documentType": "Residential Lease Agreement",
    "confidence": 0.95,
    "reasoning": "User mentioned 'renting apartment', strongly matching the lease agreement description and aliases."
  }

  Example output for a vague case:
  {
    "documentType": "General Inquiry",
    "alternatives": ["Service Agreement", "Partnership Agreement"],
    "confidence": 0.3,
    "reasoning": "Description 'starting a business' is too vague and could apply to multiple contract types. Need more details."
  }

  Example output for state mismatch:
  {
    "documentType": "General Power of Attorney", // Assuming this exists in the list and applies to 'all' or the specified state
    "confidence": 0.7,
    "reasoning": "User needs someone to 'act on my behalf' matching POA. State 'WA' was provided; assuming the chosen template applies or is general." // Reasoning reflects the choice made based on state matching rules.
  }
  `,
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
   const logPrefix = `[inferDocumentTypeFlow]`;
   console.log(`${logPrefix} Flow started. Received input: ${JSON.stringify(input)}`);
   let response: GenerateResponseData<z.infer<typeof InferDocumentTypeOutputSchema>>;
   try {
        // Validate input within the flow (or rely on API route validation)
        const validatedInput = InferDocumentTypeInputSchema.safeParse(input);
        if (!validatedInput.success) {
             const errorMessage = `Invalid input to flow: ${validatedInput.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`;
             console.error(`${logPrefix} Validation Error:`, errorMessage, "Input:", input);
             throw new Error(errorMessage);
        }

        console.log(`${logPrefix} Calling AI prompt with description and state:`, validatedInput.data.state || 'None');
        response = await prompt(validatedInput.data); // Use validated data
        console.log(`${logPrefix} Raw prompt response received.`);

       const output = response.output;

       if (!output) {
           console.error(`${logPrefix} Prompt returned null or undefined output. Full response:`, JSON.stringify(response));
            throw new Error("AI prompt returned no parsable output.");
       }
       console.log(`${logPrefix} Raw output from prompt: ${JSON.stringify(output)}`);

      // Validate the structure and types of the AI's output
      const validatedOutput = InferDocumentTypeOutputSchema.safeParse(output);
       if (!validatedOutput.success) {
           console.error(`${logPrefix} Prompt output validation failed:`, validatedOutput.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '), 'Raw output:', JSON.stringify(output));
           const validationErrors = validatedOutput.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
           throw new Error(`AI output validation failed: ${validationErrors}. Raw output: ${JSON.stringify(output)}`);
       }

       // **** Additional Validation ****
       const inferredDocName = validatedOutput.data.documentType;
       const alternatives = validatedOutput.data.alternatives || [];

       // Check 1: Is the primary documentType valid (exists in our library)?
       const primaryDocExists = documentLibrary.some(doc => doc.name === inferredDocName);

       if (!primaryDocExists) {
            console.warn(`${logPrefix} AI returned a document type ('${inferredDocName}') not found in the library. Raw output:`, JSON.stringify(output));
            // If the AI failed to return a valid type OR explicitly returned "General Inquiry" (which exists), treat it as such.
            // If it hallucinated something else, force it to "General Inquiry".
            const fallbackOutput: InferDocumentTypeOutput = {
                documentType: 'General Inquiry',
                confidence: 0.1, // Low confidence for fallback/hallucination
                reasoning: inferredDocName === 'General Inquiry'
                             ? (validatedOutput.data.reasoning || "User need is unclear or doesn't match available documents.")
                             : `AI suggested '${inferredDocName}', which is not a recognized document type. User description needs clarification or doesn't match available options.`,
                alternatives: alternatives.filter(alt => documentLibrary.some(doc => doc.name === alt)), // Filter invalid alternatives
            };
            console.log(`${logPrefix} Returning fallback: ${JSON.stringify(fallbackOutput)}`);
            return fallbackOutput;
       }

       // Check 2: Are the alternatives valid (exist in our library)?
       const validAlternatives = alternatives.filter(alt => documentLibrary.some(doc => doc.name === alt));
       if (validAlternatives.length !== alternatives.length) {
            console.warn(`${logPrefix} AI returned some invalid alternative document types. Filtering invalid ones. Raw alternatives: ${JSON.stringify(alternatives)}, Valid: ${JSON.stringify(validAlternatives)}`);
            validatedOutput.data.alternatives = validAlternatives; // Update the output with only valid alternatives
       }


       console.log(`${logPrefix} Validation successful. Returning: ${JSON.stringify(validatedOutput.data)}`);
      return validatedOutput.data;
   } catch (error: unknown) {
       console.error(`${logPrefix} Error during prompt execution or processing:`, error);
       // Re-throw the error to be handled by the API route.
       if (error instanceof Error) {
           // Add prefix to error message for easier tracing
           error.message = `${logPrefix} Error: ${error.message}`;
           throw error; // Re-throw original error with prefix
       } else {
           throw new Error(`${logPrefix} Unknown error in AI inference flow: ${String(error)}`);
       }
   }
});
