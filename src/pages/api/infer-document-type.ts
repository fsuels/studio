
import type { NextApiRequest, NextApiResponse } from 'next';
import { inferDocumentTypeFlow, InferDocumentTypeInputSchema, InferDocumentTypeOutput } from '@/ai/flows/infer-document-type';
import { z } from 'zod'; // Import z for detailed error handling

// Define a more specific error response type
type ErrorResponse = {
  error: string; // User-friendly error message
  details?: any; // Optional structured details (e.g., validation errors)
  code?: string; // Optional internal error code
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<InferDocumentTypeOutput | ErrorResponse> // Use updated ErrorResponse type
) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const logPrefix = `[API /infer-document-type] [${requestId}]`;

  // --- TEMPORARY CHANGE FOR STATIC EXPORT ---
  // Next.js API Routes (like this one) DO NOT WORK when `output: 'export'` is set in next.config.ts.
  // Static export builds a purely static site with no server-side API capabilities.
  // Trying to access this route will result in a 404 or other errors.
  //
  // To prevent build/runtime errors related to this incompatible route, we immediately return a 503 error.
  //
  // RECOMMENDED FIX FOR PRODUCTION (using static export):
  // 1. Remove this API route file (`src/pages/api/infer-document-type.ts`).
  // 2. Move the AI logic (`inferDocumentTypeFlow`) to a separate backend service (e.g., Firebase Function, Cloud Run).
  // 3. Update the client-side component (`src/components/document-inference.tsx`) to `fetch` from your new backend service URL.
  // 4. Ensure the backend service has the necessary environment variables (like GOOGLE_GENAI_API_KEY).
  console.warn(`${logPrefix} API Route Disabled: This route (/api/infer-document-type) is incompatible with 'output: "export"' in next.config.ts. Returning 503.`);
  return res.status(503).json({
      error: "AI Service Unavailable: API route is disabled in static export mode.",
      code: 'STATIC_EXPORT_API_DISABLED'
  });
  // --- END TEMPORARY CHANGE ---


  // Log request entry with ID - This part will not be reached due to the check above
  console.log(`${logPrefix} Received request: ${req.method} ${req.url}`);

  if (req.method !== 'POST') {
    console.warn(`${logPrefix} Method Not Allowed: ${req.method}`);
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed`, code: 'METHOD_NOT_ALLOWED' });
  }

  try {
    // 1. Validate Input using Zod schema
    console.log(`${logPrefix} Validating request body...`);
    const validationResult = InferDocumentTypeInputSchema.safeParse(req.body);
    if (!validationResult.success) {
      const validationErrors = validationResult.error.flatten();
      console.error(`${logPrefix} Invalid input:`, JSON.stringify(validationErrors));
      const errorMessages = validationResult.error.errors.map(e => `${e.path.join('.') || 'input'}: ${e.message}`).join('; ');
      return res.status(400).json({
        error: `Invalid input provided. ${errorMessages}`,
        details: validationErrors,
        code: 'INVALID_INPUT'
      });
    }

    const input = validationResult.data;
    console.log(`${logPrefix} Received valid input:`, JSON.stringify(input));

    // 2. Call the Genkit Flow
    console.log(`${logPrefix} Calling inferDocumentTypeFlow...`);
    const output: InferDocumentTypeOutput = await inferDocumentTypeFlow(input);

    if (!output) {
      console.error(`${logPrefix} inferDocumentTypeFlow returned null or undefined unexpectedly.`);
      throw new Error("AI flow completed but returned an empty result.");
    }
    console.log(`${logPrefix} Flow executed successfully. Output:`, JSON.stringify(output));

    // 3. Return the successful response
    console.log(`${logPrefix} Sending successful response status 200.`);
    return res.status(200).json(output);

  } catch (error: unknown) {
    // 4. Handle errors
    console.error(`${logPrefix} === UNHANDLED ERROR START ===`);
    console.error(`${logPrefix} Timestamp: ${new Date().toISOString()}`);
    console.error(`${logPrefix} Error Type:`, error?.constructor?.name);

    let statusCode = 500;
    let clientErrorMessage = 'An internal server error occurred while processing your request.';
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let errorDetails: any = undefined;

    if (error instanceof z.ZodError) {
        statusCode = 502;
        clientErrorMessage = "The AI generated an invalid response format. Please try rephrasing or contact support.";
        errorCode = 'AI_RESPONSE_FORMAT_INVALID';
        errorDetails = error.flatten();
        console.error(`${logPrefix} ZodError (AI Output Validation):`, JSON.stringify(errorDetails));
    } else if (error instanceof Error) {
        console.error(`${logPrefix} Error Message:`, error.message);
        console.error(`${logPrefix} Error Stack:`, error.stack);

        clientErrorMessage = error.message;

        if (error.message.includes('AI output validation failed')) {
            statusCode = 502;
            clientErrorMessage = "The AI generated an invalid response format. Please try rephrasing or contact support.";
            errorCode = 'AI_RESPONSE_VALIDATION_FAILED';
        } else if (error.message.includes('Invalid input to flow')) {
            statusCode = 400;
            clientErrorMessage = `Invalid data sent to AI flow: ${error.message.replace('Invalid input to flow: ','')}`;
            errorCode = 'FLOW_INPUT_INVALID';
        } else if (error.message.includes('API key not valid') || error.message.includes('permission denied')) {
            statusCode = 503;
            clientErrorMessage = "Could not authenticate with the AI service. Please contact support.";
            errorCode = 'AI_AUTH_ERROR';
        } else if (error.message.includes('quota exceeded')) {
             statusCode = 429;
             clientErrorMessage = "AI service quota exceeded. Please try again later or contact support.";
             errorCode = 'AI_QUOTA_EXCEEDED';
        } else if (error.message.includes('fetch failed') || error.message.includes('network error') || error.message.includes('socket hang up') || error.message.includes('timeout')) {
            statusCode = 504;
            clientErrorMessage = "Could not reach the AI service due to a network issue. Please check your connection or try again later.";
            errorCode = 'AI_NETWORK_ERROR';
        } else if (error.message.includes("AI flow completed but returned an empty result.")) {
            statusCode = 500;
            clientErrorMessage = "The AI process completed but returned an empty result. Please try again.";
            errorCode = 'AI_EMPTY_RESULT';
        } else if (error.message.includes("Missing GOOGLE_GENAI_API_KEY") || error.message.includes("Genkit initialization failed")) {
            statusCode = 503;
            clientErrorMessage = "AI Service configuration error or unavailable. Please contact support.";
            errorCode = 'AI_CONFIG_ERROR';
        } else {
            clientErrorMessage = 'An unexpected error occurred while processing your request.';
            errorCode = 'UNKNOWN_SERVER_ERROR';
            statusCode = 500;
        }
    } else {
        console.error(`${logPrefix} Non-Error Caught:`, error);
        clientErrorMessage = `An unexpected server error occurred.`;
        errorCode = 'UNKNOWN_EXCEPTION';
        statusCode = 500;
    }

    console.error(`${logPrefix} === UNHANDLED ERROR END ===`);
    console.log(`${logPrefix} Sending error response status ${statusCode}. Code: ${errorCode}, Client Message: "${clientErrorMessage}"`);

    const responsePayload: ErrorResponse = {
        error: clientErrorMessage,
        code: errorCode,
        ...(errorDetails && { details: errorDetails }),
    };

    if (!res.headersSent) {
        return res.status(statusCode).json(responsePayload);
    } else {
        console.error(`${logPrefix} Error handler attempted to send response, but headers were already sent.`);
    }
  }
}
