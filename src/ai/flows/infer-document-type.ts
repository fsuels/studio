// **Removed 'use server'; directive**

/**
 * @fileOverview This file defines a Genkit flow that infers the type of legal document a user needs based on their description, state, and language.
 * This flow is intended to be called by an API route.
 *
 * - InferDocumentTypeInputSchema - The input type schema for the flow.
 * - InferDocumentTypeInput - The input type for the flow.
 * - DocumentSuggestionSchema - Schema for a single document suggestion.
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
  language: z.enum(['en', 'es']).default('en').describe('The language of the user description (en or es). Defaults to en.')
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


// Provide context about available documents to the AI based on language
const getAvailableDocumentsContext = (language: 'en' | 'es'): string => {
    const context = `
    Available Document Types (Use the English 'name' field for the 'documentType' output):
    ${documentLibrary.filter(doc => doc.id !== 'default') // Exclude default schema
    .map(doc => {
        const aliases = language === 'es' ? doc.aliases_es : doc.aliases;
        return `- Name: "${doc.name}" (Relevant Aliases in ${language}: ${aliases.join(', ')}; States: ${Array.isArray(doc.states) ? doc.states.join(', ') : doc.states})${doc.description ? ` - Description: ${doc.description}` : ''}`;
    }).join('\n')}
    `;
    // console.log(`[getAvailableDocumentsContext] Generated context for language ${language}:`, context); // Log generated context
    return context;
};


// Internal Genkit prompt definition
const prompt = ai.definePrompt({
  name: 'inferDocumentTypePrompt_v2', // Renamed for clarity
  model: 'googleai/gemini-1.5-flash-latest', // ** Explicitly specify the model here **
  input: {
    schema: InferDocumentTypeInputSchema,
  },
  output: {
    schema: InferDocumentTypeOutputSchema, // Use the new output schema
    format: 'json',
  },
  // Prompt template now dynamically includes language-specific aliases
  prompt: `You are an AI legal assistant expert at identifying the correct U.S. legal document based on a user's situation.
  The user provided a description in {{language}}.
  Analyze the user's description and the relevant U.S. state (if provided) to determine the most appropriate types of legal documents FROM THE LIST PROVIDED BELOW.

  User Description (in {{language}}): {{{description}}}
  Relevant State: {{#if state}}{{state}}{{else}}Not Specified{{/if}}
  Language Provided: {{language}}

  Context on available document types:
  {{{availableDocumentsContext}}}

  **CRITICAL INSTRUCTIONS:**
  1.  **Exclusive List:** Base your suggestions *exclusively* on the user's description, state (if provided), language, and the "Available Document Types" list above. **Do NOT suggest document types NOT present in this list.**
  2.  **Match Phrasing:** Pay close attention to the user's phrasing and match it against the document 'Name' and the relevant language 'Aliases' provided in the list.
  3.  **State Relevance:** Consider the 'Relevant State'. If a document lists specific states, prioritize it *only* if the state matches or if 'all' states apply. If no state is specified by the user but the best match is state-specific, mention this limitation in the reasoning.
  4.  **Output Format:** For each suggested document, output the exact English 'Name' string for the 'documentType' field.
  5.  **General Inquiry Condition:** If the description is too vague, ambiguous, clearly requests legal advice (e.g., "how do I sue someone?"), is unrelated to legal documents, or clearly does not match any document in the provided list, your **primary suggestion MUST be "General Inquiry"** with a confidence score reflecting the uncertainty (e.g., 0.1-0.6). You may still suggest 1-2 *possible* low-confidence matches from the list if there's a weak signal, but "General Inquiry" must be the top suggestion in unclear cases. Do NOT invent document types.
  6.  **Confidence Score:** Provide a realistic confidence score (0.0-1.0) for *each* suggestion. High confidence (>0.85) requires a very clear match between the description and a document's name/aliases.
  7.  **Reasoning:** Provide a concise 'reasoning' string for *each* suggestion explaining the choice (e.g., "Matches 'rent apartment' alias for Residential Lease") and justify low confidence or the 'General Inquiry' choice.
  8.  **Order & Quantity:** Return 1 to 3 suggestions total, ordered in the array from most relevant (highest confidence/best match) to least relevant.

  **RESPONSE FORMAT (Strict JSON):**
  Provide your response STRICTLY as a JSON object matching the following structure:
  {
    "suggestions": [
      {
        "documentType": "The exact English document name from the list, or 'General Inquiry'",
        "confidence": A confidence score between 0.0 and 1.0 (float),
        "reasoning": "Brief explanation for this suggestion (string)"
      }
      // ... up to 3 suggestions total, ordered by relevance
    ]
  }

  Example output for a clear case (English):
  {
    "suggestions": [
      { "documentType": "Residential Lease Agreement", "confidence": 0.95, "reasoning": "User mentioned 'renting my apartment', strongly matching the lease agreement description and aliases." },
      { "documentType": "Service Agreement", "confidence": 0.1, "reasoning": "Less likely, mentioned 'agreement' but context points to rental." }
    ]
  }

  Example output for a vague case (Spanish input 'empezando un negocio'):
  {
    "suggestions": [
       { "documentType": "General Inquiry", "confidence": 0.5, "reasoning": "Description 'empezando un negocio' is too vague. Could be Partnership, Service Agreement, or Articles of Incorporation. Needs more details." },
       { "documentType": "Partnership Agreement", "confidence": 0.3, "reasoning": "Possible if starting with others, but lacks detail." },
       { "documentType": "Service Agreement", "confidence": 0.2, "reasoning": "Possible if providing services, but description is generic." }
    ]
  }

   Example output for out-of-scope request ('how to file a lawsuit'):
   {
     "suggestions": [
       { "documentType": "General Inquiry", "confidence": 0.9, "reasoning": "User asking 'how to file a lawsuit' is requesting legal advice, which is outside the scope of document generation." }
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

        const currentLanguage = validatedInput.data.language; // Extract language for use in error messages

        // Get language-specific context
        const availableDocumentsContext = getAvailableDocumentsContext(currentLanguage);
        console.log(`${logPrefix} Generated context for language ${currentLanguage}. Length: ${availableDocumentsContext.length}`);

        console.log(`${logPrefix} Calling AI prompt with description, state (${validatedInput.data.state || 'None'}), and language (${validatedInput.data.language})`);
        // Pass the dynamic context along with other input data to the prompt
        response = await prompt({ ...validatedInput.data, availableDocumentsContext });
        console.log(`${logPrefix} Raw AI prompt response received.`);

       const output = response.output;

       if (!output) {
           console.error(`${logPrefix} AI Prompt returned null or undefined output. Full response object:`, JSON.stringify(response, null, 2));
            // Return structured error
            return {
                suggestions: [{
                    documentType: 'General Inquiry',
                    confidence: 0.0,
                    reasoning: "AI prompt returned no parsable output."
                }]
            };
       }
       console.log(`${logPrefix} Raw output from AI prompt: ${JSON.stringify(output)}`);

      // Validate the structure and types of the AI's output
      const validatedOutput = InferDocumentTypeOutputSchema.safeParse(output);
       if (!validatedOutput.success) {
           const validationErrors = validatedOutput.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
            console.error(`${logPrefix} AI Output validation failed: ${validationErrors}`, 'Raw AI output:', JSON.stringify(output));
           // Return a structured error response
            return {
                suggestions: [{
                    documentType: 'General Inquiry',
                    confidence: 0.1,
                    reasoning: `AI response format was invalid. Errors: ${validationErrors}. Original Desc: "${input.description}"`
                }]
            };
       }
        console.log(`${logPrefix} AI output passed Zod validation.`);

       // **** Additional Post-Validation ****
       const validatedSuggestions = validatedOutput.data.suggestions;

       // Filter out any suggestions where the documentType doesn't exist in our library OR isn't "General Inquiry"
       const finalSuggestions = validatedSuggestions.filter(suggestion => {
            const docExists = documentLibrary.some(doc => doc.name === suggestion.documentType);
            const isGeneral = suggestion.documentType === 'General Inquiry';
            if (!docExists && !isGeneral) {
                 console.warn(`${logPrefix} AI returned a suggestion ('${suggestion.documentType}') not found in the document library. Filtering it out. Raw AI output:`, JSON.stringify(output));
                 return false; // Remove this invalid suggestion
            }
            // Ensure reasoning exists, especially for General Inquiry
            if (!suggestion.reasoning) {
                 suggestion.reasoning = currentLanguage === 'es'
                    ? "No se proporcionó justificación para esta sugerencia."
                    : "No reasoning provided for this suggestion.";
                console.warn(`${logPrefix} Added default reasoning for suggestion '${suggestion.documentType}'.`);
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
                    reasoning: currentLanguage === 'es'
                       ? `Las sugerencias de la IA no fueron válidas o no se reconocieron. Descripción original: "${input.description}"`
                       : `AI suggestions were invalid or not recognized. Original Description: "${input.description}"`
                }]
            };
       }

       // Construct the final valid output object
       const finalOutput: InferDocumentTypeOutput = {
            suggestions: finalSuggestions
       };

       console.log(`${logPrefix} Flow finished successfully. Returning validated/filtered suggestions: ${JSON.stringify(finalOutput)}`);
      return finalOutput;

   } catch (error: unknown) {
       console.error(`${logPrefix} === UNEXPECTED ERROR IN GENKIT FLOW START ===`);
       console.error(`${logPrefix} Timestamp: ${new Date().toISOString()}`);
       console.error(`${logPrefix} Raw Error Object:`, error); // Log the raw error object
       const currentLanguage = (input as InferDocumentTypeInput)?.language || 'en'; // Get language from input if possible

       let errorMessage = 'An unexpected error occurred during analysis.'; // Default generic message
       let errorStack = 'No stack trace available.';

       if (error instanceof Error) {
            console.error(`${logPrefix} Error Type:`, error.constructor?.name);
            console.error(`${logPrefix} Error Message:`, error.message);
            console.error(`${logPrefix} Error Stack:`, error.stack); // Log stack trace
            errorMessage = error.message; // Use specific error message
            errorStack = error.stack || errorStack;

            // Add more specific error handling based on potential Genkit/API errors
            if (error.message.includes('API key') || error.message.includes('permission')) {
                 errorMessage = 'AI Service Authentication Error';
            } else if (error.message.includes('quota')) {
                 errorMessage = 'AI Service Quota Exceeded';
            } else if (error.message.includes('network') || error.message.includes('fetch') || error.message.includes('timeout')) {
                 errorMessage = 'AI Service Network Error';
            } else if (error.message.includes('invalid response') || error.message.includes('parse error') || error.message.includes('malformed')) {
                 errorMessage = 'AI Service returned an invalid response';
            }
             // ** Check for the specific model error **
             else if (error.message.includes('Must supply a `model`')) {
                  errorMessage = `AI model configuration error: ${error.message}`;
             }
            // ... add more specific cases as needed
       } else {
           console.error(`${logPrefix} Non-Error Caught in Flow:`, error);
           errorMessage = 'An unknown error occurred during analysis.';
       }
       console.error(`${logPrefix} === UNEXPECTED ERROR IN GENKIT FLOW END ===`);

       // Return a structured error response matching the schema
       return {
           suggestions: [{
               documentType: 'General Inquiry',
               confidence: 0.05,
               reasoning: currentLanguage === 'es'
                   ? `Ocurrió un error inesperado durante el análisis: ${errorMessage}. Descripción original: "${(input as InferDocumentTypeInput)?.description || 'N/A'}"`
                   : `An unexpected error occurred during analysis: ${errorMessage}. Original Description: "${(input as InferDocumentTypeInput)?.description || 'N/A'}"`
           }]
       };
   }
});
