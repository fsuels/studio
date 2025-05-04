
import type { NextApiRequest, NextApiResponse } from 'next';
import { inferDocumentTypeFlow, InferDocumentTypeInputSchema, InferDocumentTypeOutput } from '@/ai/flows/infer-document-type';
import { z } from 'zod'; // Import z for detailed error handling

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<InferDocumentTypeOutput | { error: string; details?: any }> // Define response types, add optional details
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
    console.log("[API /infer-document-type] Validating request body...");
    const validationResult = InferDocumentTypeInputSchema.safeParse(req.body);
    if (!validationResult.success) {
      console.error("[API /infer-document-type] Invalid input:", validationResult.error.errors);
      // Provide specific validation errors back to the client
      const errorMessages = validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      return res.status(400).json({ error: `Invalid input: ${errorMessages}`, details: validationResult.error.errors });
    }

    const input = validationResult.data;
    console.log("[API /infer-document-type] Received valid input:", JSON.stringify(input));

    // 2. Call the Genkit Flow with specific error handling
    let output: InferDocumentTypeOutput;
    console.log("[API /infer-document-type] Attempting to call inferDocumentTypeFlow...");
    output = await inferDocumentTypeFlow(input);
    // Ensure output is not null/undefined before proceeding (schema validation in flow should cover this)
    if (!output) {
        // This case should ideally be caught by the flow's output validation, but adding defense here.
        console.error("[API /infer-document-type] inferDocumentTypeFlow returned null or undefined after execution.");
        throw new Error("AI flow returned an unexpectedly empty result.");
    }
    console.log("[API /infer-document-type] Flow executed successfully. Output:", JSON.stringify(output));


    // 3. Return the successful response
    console.log("[API /infer-document-type] Sending successful response status 200.");
    return res.status(200).json(output);

  } catch (error: unknown) {
    // 4. Handle errors (including those re-thrown from the flow)
    console.error("[API /infer-document-type] Encountered error during request processing:", error);

    let errorMessage = 'An internal server error occurred while inferring the document type.';
    let statusCode = 500;
    let errorDetails: any = undefined;

    if (error instanceof z.ZodError) {
        // This case might occur if the flow returns data that fails its *own* output validation
        errorMessage = `AI response format error. Please try rephrasing or contact support if the issue persists.`;
        statusCode = 502; // Bad Gateway - upstream service (AI) returned invalid data
        errorDetails = error.errors;
        console.error("[API /infer-document-type] ZodError (likely from flow output validation):", error.flatten());
    } else if (error instanceof Error) {
        // Use the error message from the flow/logic if available
        errorMessage = error.message; // Start with the original message
        errorDetails = { name: error.name, message: error.message, stack: error.stack }; // Capture more detail for server logs

        // Map specific error messages to different status codes and user-facing messages
         if (error.message.includes('AI output validation failed')) {
             statusCode = 502; // Bad Gateway
             errorMessage = "The AI generated an invalid response format. Please try rephrasing or contact support.";
         } else if (error.message.includes('Invalid input to flow')) {
              statusCode = 400; // Bad Request (Should be caught by initial validation, but defense in depth)
              errorMessage = `Flow rejected input: ${error.message}`;
         } else if (error.message.includes('API key not valid') || error.message.includes('permission denied') || error.message.includes('quota exceeded')) {
             // Log sensitive details server-side only
             console.error("[API /infer-document-type] Critical AI Service Error (Key/Quota/Permission):", error.message);
             errorMessage = "Could not connect to the AI service due to a configuration or quota issue. Please contact support."; // More generic client message
             statusCode = 503; // Service Unavailable
         } else if (error.message.includes('fetch failed') || error.message.includes('network error') || error.message.includes('socket hang up')) {
              console.error("[API /infer-document-type] Network Error calling AI Service:", error.message);
              errorMessage = "Could not reach the AI service due to a network issue. Please check your connection or try again later.";
              statusCode = 504; // Gateway Timeout
         } else if (error.message.includes("AI flow returned an unexpectedly empty result.")) {
             errorMessage = "The AI flow completed but returned an empty result. Please try again.";
             statusCode = 500;
         }
         // Add more specific error handling based on observed errors
    } else {
        // Handle non-Error exceptions
        errorMessage = `An unexpected non-error exception occurred: ${String(error)}`;
        errorDetails = error;
        console.error("[API /infer-document-type] Caught non-Error exception:", error);
    }

    // Ensure a valid JSON response is sent
    console.log(`[API /infer-document-type] Sending error response status ${statusCode}: ${errorMessage}`);
    // Optionally include simplified details for the client if needed, avoid sending full stack traces
    const responsePayload: { error: string; details?: any } = { error: errorMessage };
    // if (errorDetails && statusCode !== 500) { // Example: Send some details for non-500 errors
    //    responsePayload.details = "See server logs for detailed information.";
    // }

    return res.status(statusCode).json(responsePayload);
  }
}
