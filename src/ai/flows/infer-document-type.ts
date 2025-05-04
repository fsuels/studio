
// **Removed 'use server'; directive**

/**
 * @fileOverview This file defines a Genkit flow that infers the type of legal document a user needs based on their description and state.
 * This flow is intended to be called by an API route.
 *
 * - InferDocumentTypeInputSchema - The input type schema for the flow.
 * - InferDocumentTypeInput - The input type for the flow.
 * - InferDocumentTypeOutputSchema - The output type schema for the flow.
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
    .optional() // Make state optional
    .describe('The 2-letter US state code relevant to the legal situation (e.g., "CA", "NY"). Optional.'),
});
export type InferDocumentTypeInput = z.infer<typeof InferDocumentTypeInputSchema>;

// Output Schema (Exported for use in API route)
export const InferDocumentTypeOutputSchema = z.object({
  documentType: z
    .string()
    .describe('The inferred type or ID of the most likely legal document the user needs (e.g., "Residential Lease Agreement", "nda-mutual"). Must exactly match a "name" from the provided document library, or be "General Inquiry".'),
  alternatives: z.array(z.string()).optional().describe('Optionally, suggest 1-2 alternative document types (using exact "name" from the library) if the primary inference is uncertain. Ensure alternatives are different from the primary documentType.'),
  confidence: z
    .number()
    .min(0).max(1)
    .describe(
      'The confidence level of the primary document type inference, on a scale of 0 to 1.'
    ),
  reasoning: z.string().optional().describe('Brief explanation for the inference, especially if confidence is low, alternatives are suggested, or "General Inquiry" is chosen.'),
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
  3. If the description is vague, confidence is low (e.g., < 0.6), or multiple documents could plausibly fit based on aliases or description, suggest 1-2 plausible 'alternatives' (using their exact 'Name' strings from the list). **Ensure alternatives are different from the primary 'documentType'.**
  4. **CRITICAL:** If the description doesn't clearly suggest any specific legal document *from the list provided*, or if the need seems outside the scope of these documents (e.g., asking for legal advice, a complex lawsuit), output "General Inquiry" as the documentType, set confidence low (e.g., 0.1), and explain *why* in the reasoning (e.g., "Description 'suing my neighbor' falls outside standard document templates available."). Do NOT invent document types not in the list.
  5. Provide a confidence score (0.0-1.0) for your primary inference. Be realistic; high confidence (e.g., > 0.9) requires a very clear match between the description and a document's name/aliases/description.
  6. Provide a concise 'reasoning' string explaining your primary inference (e.g., "Matches 'rent apartment' alias for Residential Lease") and justify low confidence, alternatives, or the 'General Inquiry' choice.

  Provide your inference STRICTLY as a JSON object matching the following structure:
  {
    "documentType": "The exact inferred document name (string) from the list, or 'General Inquiry'",
    "alternatives": ["Alternative Document Name 1", "Alternative Document Name 2"], // Optional array, exact names from list, different from documentType
    "confidence": A confidence score between 0.0 and 1.0 (float),
    "reasoning": "Brief explanation (string)" // Required, especially for 'General Inquiry' or low confidence
  }

  Example output for a clear case:
  {
    "documentType": "Residential Lease Agreement",
    "alternatives": ["Bill of Sale (Vehicle)"], // Example alternative
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

   Example output for out-of-scope request:
   {
    "documentType": "General Inquiry",
    "confidence": 0.1,
    "reasoning": "User asking 'how to file a lawsuit' is requesting legal advice, which is outside the scope of document generation."
   }

  Example output for state mismatch consideration:
  {
    "documentType": "General Power of Attorney", // Assuming this exists in the list and applies to 'all' or the specified state
    "confidence": 0.7,
    "reasoning": "User needs someone to 'act on my behalf' matching POA. State 'WA' was provided; assuming the chosen template applies or is general. State relevance considered." // Reasoning reflects the choice made based on state matching rules.
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
async (input) => {
   const logPrefix = `[inferDocumentTypeFlow]`;
   console.log(`${logPrefix} Flow started. Received input: ${JSON.stringify(input)}`);
   let response: GenerateResponseData<z.infer<typeof InferDocumentTypeOutputSchema>>;
   try {
        // Validate input within the flow
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
           const validationErrors = validatedOutput.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
            console.error(`${logPrefix} Prompt output validation failed: ${validationErrors}`, 'Raw output:', JSON.stringify(output));
           // Attempt to return a General Inquiry if validation fails severely
            return {
                documentType: 'General Inquiry',
                confidence: 0.1,
                reasoning: `AI response format was invalid. Validation Errors: ${validationErrors}. Original Description: "${input.description}"`,
                alternatives: [],
            };
           // Or re-throw if you prefer stricter error handling:
           // throw new Error(`AI output validation failed: ${validationErrors}. Raw output: ${JSON.stringify(output)}`);
       }

       // **** Additional Validation ****
       const inferredDocName = validatedOutput.data.documentType;
       let alternatives = validatedOutput.data.alternatives || [];

       // Check 1: Is the primary documentType valid (exists in our library OR is "General Inquiry")?
       const primaryDocExists = documentLibrary.some(doc => doc.name === inferredDocName);

       if (!primaryDocExists && inferredDocName !== 'General Inquiry') {
            console.warn(`${logPrefix} AI returned a document type ('${inferredDocName}') not found in the library. Falling back to 'General Inquiry'. Raw output:`, JSON.stringify(output));
            // Force to "General Inquiry" if AI hallucinated an unknown type.
            const fallbackOutput: InferDocumentTypeOutput = {
                documentType: 'General Inquiry',
                confidence: 0.1, // Low confidence for fallback/hallucination
                reasoning: `AI suggested '${inferredDocName}', which is not a recognized document type. User description needs clarification or doesn't match available options. Original Description: "${input.description}"`,
                alternatives: alternatives.filter(alt => documentLibrary.some(doc => doc.name === alt) && alt !== 'General Inquiry'), // Filter invalid alternatives & exclude General Inquiry here
            };
            console.log(`${logPrefix} Returning fallback: ${JSON.stringify(fallbackOutput)}`);
            return fallbackOutput;
       }

       // Check 2: Are the alternatives valid (exist in our library)? Filter out invalid ones AND the primary type.
       const validAlternatives = alternatives.filter(alt =>
            alt !== inferredDocName && // Ensure alternative is not the same as primary
            documentLibrary.some(doc => doc.name === alt) // Ensure alternative exists in library
       );
       if (validAlternatives.length !== alternatives.length) {
            console.warn(`${logPrefix} AI returned invalid or duplicate alternative document types. Filtering. Raw: ${JSON.stringify(alternatives)}, Valid/Filtered: ${JSON.stringify(validAlternatives)}`);
            validatedOutput.data.alternatives = validAlternatives; // Update the output with only valid alternatives
       }

        // Ensure reasoning exists, especially for General Inquiry
        if (inferredDocName === 'General Inquiry' && !validatedOutput.data.reasoning) {
            validatedOutput.data.reasoning = "User need is unclear or does not match available document templates.";
             console.warn(`${logPrefix} Added default reasoning for 'General Inquiry'.`);
        }


       console.log(`${logPrefix} Validation successful. Returning: ${JSON.stringify(validatedOutput.data)}`);
      return validatedOutput.data;

   } catch (error: unknown) {
       console.error(`${logPrefix} Error during prompt execution or processing:`, error);
        const errorMessage = error instanceof Error ? error.message : String(error);
       // Return a General Inquiry as a fallback on unexpected errors during flow execution
        return {
            documentType: 'General Inquiry',
            confidence: 0.05,
            reasoning: `An unexpected error occurred during analysis: ${errorMessage}. Original Description: "${input.description}"`,
            alternatives: [],
        };
       // Or re-throw if you prefer API route to handle:
       // if (error instanceof Error) {
       //     error.message = `${logPrefix} Error: ${error.message}`;
       //     throw error;
       // } else {
       //     throw new Error(`${logPrefix} Unknown error in AI inference flow: ${String(error)}`);
       // }
   }
});
