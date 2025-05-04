
import type { NextApiRequest, NextApiResponse } from 'next';
import { inferDocumentTypeFlow, InferDocumentTypeInputSchema, InferDocumentTypeOutput } from '@/ai/flows/infer-document-type';
import { z } from 'zod'; // Import z for detailed error handling

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<InferDocumentTypeOutput | { error: string }> // Define response types
) {
  // Log request entry
  console.log(`[API /infer-document-type] Received request: ${req.method} ${req.url}`);

  if (req.method !== 'POST') {
    console.warn(`[API /infer-document-type] Method Not Allowed: ${req.method}`);
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    // Log raw request body for debugging (be cautious with sensitive data in production logs)
    // console.log("[API /infer-document-type] Raw request body:", JSON.stringify(req.body));

    // 1. Validate Input using Zod schema
    const validationResult = InferDocumentTypeInputSchema.safeParse(req.body);
    if (!validationResult.success) {
      console.error("[API /infer-document-type] Invalid input:", validationResult.error.errors);
      // Provide specific validation errors back to the client
      const errorMessages = validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      return res.status(400).json({ error: `Invalid input: ${errorMessages}` });
    }

    const input = validationResult.data;
    console.log("[API /infer-document-type] Received valid input:", JSON.stringify(input));

    // 2. Call the Genkit Flow with specific error handling
    let output: InferDocumentTypeOutput;
    try {
        console.log("[API /infer-document-type] Attempting to call inferDocumentTypeFlow...");
        output = await inferDocumentTypeFlow(input);
        // Ensure output is not null/undefined before proceeding (though schema validation should cover this)
        if (!output) {
            console.error("[API /infer-document-type] inferDocumentTypeFlow returned null or undefined.");
            throw new Error("AI flow returned empty result.");
        }
        console.log("[API /infer-document-type] Flow executed successfully. Output:", JSON.stringify(output));
    } catch (flowError: unknown) {
        console.error("[API /infer-document-type] Error *during* inferDocumentTypeFlow call:", flowError);
        // Re-throw the error to be caught by the outer catch block, which handles HTTP response
        throw flowError;
    }


    // 3. Return the successful response
    console.log("[API /infer-document-type] Sending successful response status 200.");
    return res.status(200).json(output);

  } catch (error: unknown) {
    // 4. Handle errors from the flow or other issues
    console.error("[API /infer-document-type] Error processing request in outer catch block:", error);

    let errorMessage = 'An internal server error occurred while inferring the document type.';
    let statusCode = 500;

    if (error instanceof z.ZodError) {
        // This case might occur if the flow itself returns data that fails output validation
        errorMessage = `AI response format error: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`;
        statusCode = 502; // Bad Gateway - upstream service (AI) returned invalid data
        console.error("[API /infer-document-type] ZodError (likely from flow output validation):", error.errors);
    } else if (error instanceof Error) {
        // Use the error message from the flow if available
        errorMessage = error.message;
        // Map specific error messages to different status codes
         if (error.message.includes('AI output validation failed')) {
             statusCode = 502; // Bad Gateway
             errorMessage = "The AI failed to generate a valid response format. Please try rephrasing.";
         } else if (error.message.includes('Invalid input to flow')) {
              statusCode = 400; // Bad Request (Should be caught by initial validation, but defense in depth)
              errorMessage = `Flow rejected input: ${error.message}`;
         } else if (error.message.includes('API key not valid') || error.message.includes('permission') || error.message.includes('quota')) {
             // Log sensitive details server-side only
             console.error("[API /infer-document-type] Detailed Error: AI Service Error (Key/Quota/Permission):", error.message);
             errorMessage = "AI service unavailable or configuration error. Please contact support."; // More generic client message
             statusCode = 503; // Service Unavailable
         } else if (error.message.includes('fetch failed') || error.message.includes('network error')) {
              console.error("[API /infer-document-type] Detailed Error: Network issue calling AI Service:", error.message);
              errorMessage = "Could not reach AI service. Please check network connectivity or try again later.";
              statusCode = 504; // Gateway Timeout
         }
         // Add more specific error handling as needed
    } else {
        // Handle non-Error exceptions
        errorMessage = `An unexpected error occurred: ${String(error)}`;
        console.error("[API /infer-document-type] Caught non-Error exception:", error);
    }

    // Return the structured error response
    console.log(`[API /infer-document-type] Sending error response status ${statusCode}: ${errorMessage}`);
    return res.status(statusCode).json({ error: errorMessage });
  }
}
