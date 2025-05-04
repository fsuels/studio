
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

// Output Schema Updated: Now returns an array of suggestions
// Output Schema (Exported for use in API route) - Returns top suggestions
export const DocumentSuggestionSchema = z.object({
  documentType: z
    .string()
    .describe('The inferred type or ID of the legal document (e.g., "Residential Lease Agreement", "nda-mutual"). Must exactly match a "name" from the provided document library, or be "General Inquiry".'),
  confidence: z
    .number()
    .min(0).max(1)
    .describe('The confidence level of this specific suggestion, 0 to 1.'),
  reasoning: z
    .string()
    .optional()
    .describe('Brief explanation for suggesting this document type.'),
});

export const InferDocumentTypeOutputSchema = z.object({
   suggestions: z.array(DocumentSuggestionSchema)
     .min(1, "At least one suggestion (even 'General Inquiry') should be provided.")
     .max(3, "Provide no more than 3 suggestions.")
     .describe('An array of 1-3 suggested document types, ordered by relevance. Includes "General Inquiry" if no specific document matches well.')
});

export type InferDocumentTypeOutput = z.infer<typeof InferDocumentTypeOutputSchema>;


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
    schema: InferDocumentTypeOutputSchema, // Use the new output schema
    format: 'json',
  },
  prompt: `You are an AI assistant specialized in identifying U.S. legal document needs. Analyze the user's description and the relevant U.S. state (if provided) to determine the most appropriate types of legal documents from the list provided below.

  User Description: {{{description}}}
  Relevant State: {{#if state}}{{state}}{{else}}Not Specified{{/if}}

  Context on available document types:
  ${availableDocumentsContext}

  Based *only* on the description, state, and the provided "Available Document Types" list:
  1. Identify the top 1-3 most relevant legal document types. Consider the document's 'Name', 'Aliases', and 'Description' to find the best matches.
  2. Consider the 'Relevant State'. If a document lists specific states, prioritize it only if the state matches or if 'all' states apply. If the state is not specified but the best match is state-specific, mention this limitation in the reasoning.
  3. For each suggested document, output the exact 'Name' string for the 'documentType' field.
  4. **CRITICAL:** If the description doesn't clearly suggest any specific legal document *from the list provided*, or if the need seems outside the scope of these documents (e.g., asking for legal advice, a complex lawsuit), the primary suggestion *must* be "General Inquiry". You can still suggest 1-2 other *possible* matches from the list if there's a slight indication, but "General Inquiry" should have the highest confidence in this case. Do NOT invent document types not in the list.
  5. Provide a confidence score (0.0-1.0) for *each* suggestion. Be realistic; high confidence (e.g., > 0.9) requires a very clear match. If suggesting "General Inquiry", its confidence should reflect the uncertainty (e.g., 0.1-0.5).
  6. Provide a concise 'reasoning' string for *each* suggestion explaining the choice (e.g., "Matches 'rent apartment' alias for Residential Lease") and justify low confidence or the 'General Inquiry' choice.
  7. Order the suggestions in the array from most relevant (highest confidence/best match) to least relevant.

  Provide your response STRICTLY as a JSON object matching the following structure:
  {
    "suggestions": [
      {
        "documentType": "The exact inferred document name (string) from the list, or 'General Inquiry'",
        "confidence": A confidence score between 0.0 and 1.0 (float),
        "reasoning": "Brief explanation for this suggestion (string)"
      }
      // Include 1 to 3 suggestions total, ordered by relevance
    ]
  }

  Example output for a clear case:
  {
    "suggestions": [
      {
        "documentType": "Residential Lease Agreement",
        "confidence": 0.95,
        "reasoning": "User mentioned 'renting apartment', strongly matching the lease agreement description and aliases."
      },
      {
        "documentType": "Bill of Sale (Vehicle)",
        "confidence": 0.1,
        "reasoning": "Less likely, but involves property transfer mention."
      }
    ]
  }

  Example output for a vague case:
  {
    "suggestions": [
       {
         "documentType": "General Inquiry",
         "confidence": 0.5, // Confidence reflects vagueness
         "reasoning": "Description 'starting a business' is too vague. Could be Partnership, Service Agreement, or other. Needs more details."
       },
       {
         "documentType": "Partnership Agreement",
         "confidence": 0.3,
         "reasoning": "Possible if starting with others, but lacks detail."
       },
       {
         "documentType": "Service Agreement",
         "confidence": 0.2,
         "reasoning": "Possible if providing services, but description is generic."
       }
    ]
  }

   Example output for out-of-scope request:
   {
     "suggestions": [
       {
         "documentType": "General Inquiry",
         "confidence": 0.9, // High confidence it's a general inquiry / out of scope
         "reasoning": "User asking 'how to file a lawsuit' is requesting legal advice, which is outside the scope of document generation."
       }
     ]
   }
  `,
});


// Internal Genkit flow definition (Exported for use by the API route)
export const inferDocumentTypeFlow = ai.defineFlow<
  typeof InferDocumentTypeInputSchema,
  typeof InferDocumentTypeOutputSchema // Use the new output schema
>({
  name: 'inferDocumentTypeFlow',
  inputSchema: InferDocumentTypeInputSchema,
  outputSchema: InferDocumentTypeOutputSchema, // Use the new output schema
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
             // Return a structured error response matching the expected output schema format
             return {
                suggestions: [{
                    documentType: 'General Inquiry',
                    confidence: 0.0,
                    reasoning: `Input validation failed: ${errorMessage}`
                }]
             };
        }

        console.log(`${logPrefix} Calling AI prompt with description and state:`, validatedInput.data.state || 'None');
        response = await prompt(validatedInput.data); // Use validated data
        console.log(`${logPrefix} Raw prompt response received.`);

       const output = response.output;

       if (!output) {
           console.error(`${logPrefix} Prompt returned null or undefined output. Full response:`, JSON.stringify(response));
            // Return structured error
            return {
                suggestions: [{
                    documentType: 'General Inquiry',
                    confidence: 0.0,
                    reasoning: "AI prompt returned no parsable output."
                }]
            };
       }
       console.log(`${logPrefix} Raw output from prompt: ${JSON.stringify(output)}`);

      // Validate the structure and types of the AI's output
      const validatedOutput = InferDocumentTypeOutputSchema.safeParse(output);
       if (!validatedOutput.success) {
           const validationErrors = validatedOutput.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
            console.error(`${logPrefix} Prompt output validation failed: ${validationErrors}`, 'Raw output:', JSON.stringify(output));
           // Return a structured error response
            return {
                suggestions: [{
                    documentType: 'General Inquiry',
                    confidence: 0.1,
                    reasoning: `AI response format was invalid. Validation Errors: ${validationErrors}. Original Description: "${input.description}"`
                }]
            };
       }

       // **** Additional Validation ****
       const validatedSuggestions = validatedOutput.data.suggestions;

       // Filter out any suggestions where the documentType doesn't exist in our library OR isn't "General Inquiry"
       const finalSuggestions = validatedSuggestions.filter(suggestion => {
            const docExists = documentLibrary.some(doc => doc.name === suggestion.documentType);
            const isGeneral = suggestion.documentType === 'General Inquiry';
            if (!docExists && !isGeneral) {
                 console.warn(`${logPrefix} AI returned a suggestion ('${suggestion.documentType}') not found in the library. Filtering it out. Raw output:`, JSON.stringify(output));
                 return false; // Remove this invalid suggestion
            }
            // Ensure reasoning exists, especially for General Inquiry
            if (suggestion.documentType === 'General Inquiry' && !suggestion.reasoning) {
                suggestion.reasoning = "User need is unclear or does not match available document templates.";
                console.warn(`${logPrefix} Added default reasoning for 'General Inquiry' suggestion.`);
            }
            return true; // Keep valid suggestions
       });

       // If filtering removed all suggestions, return a default General Inquiry
       if (finalSuggestions.length === 0) {
            console.warn(`${logPrefix} All AI suggestions were invalid or filtered. Returning default General Inquiry.`);
            return {
                suggestions: [{
                    documentType: 'General Inquiry',
                    confidence: 0.1,
                    reasoning: `AI suggestions were invalid or not recognized. User description needs clarification. Original: "${input.description}"`
                }]
            };
       }

        // Construct the final valid output object
       const finalOutput: InferDocumentTypeOutput = {
            suggestions: finalSuggestions
       };


       console.log(`${logPrefix} Validation successful. Returning: ${JSON.stringify(finalOutput)}`);
      return finalOutput;

   } catch (error: unknown) {
       console.error(`${logPrefix} Error during prompt execution or processing:`, error);
        const errorMessage = error instanceof Error ? error.message : String(error);
       // Return a structured error response matching the schema
        return {
            suggestions: [{
                documentType: 'General Inquiry',
                confidence: 0.05,
                reasoning: `An unexpected error occurred during analysis: ${errorMessage}. Original Description: "${input.description}"`
            }]
        };
   }
});

    