
import type { NextApiRequest, NextApiResponse } from 'next';
import { inferDocumentTypeFlow, InferDocumentTypeInputSchema, InferDocumentTypeOutput } from '@/ai/flows/infer-document-type';
import { z } from 'zod';

type ErrorResponse = {
  error: string;
  details?: any;
  code?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<InferDocumentTypeOutput | ErrorResponse>
) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const logPrefix = `[API /infer-document-type] [${requestId}]`;

  console.log(`${logPrefix} Received request: ${req.method} ${req.url}`);

  if (process.env.NEXT_PUBLIC_DISABLE_API_ROUTES === 'true') {
    console.warn(`${logPrefix} API Route Disabled (NEXT_PUBLIC_DISABLE_API_ROUTES=true). Returning 503.`);
    return res.status(503).json({
      error: "AI document inference is disabled in the current environment.",
      details: "This API route is not available when NEXT_PUBLIC_DISABLE_API_ROUTES is set to true.",
      code: 'API_DISABLED_INFERENCE'
    });
  }

  if (req.method !== 'POST') {
    console.warn(`${logPrefix} Method Not Allowed: ${req.method}`);
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed`, code: 'METHOD_NOT_ALLOWED_INFERENCE' });
  }

  try {
    console.log(`${logPrefix} Validating request body. Body received:`, JSON.stringify(req.body));
    const validationResult = InferDocumentTypeInputSchema.safeParse(req.body);
    if (!validationResult.success) {
      const validationErrors = validationResult.error.flatten();
      console.error(`${logPrefix} Invalid input:`, JSON.stringify(validationErrors));
      const errorMessages = validationResult.error.errors.map(e => `${e.path.join('.') || 'input'}: ${e.message}`).join('; ');
      return res.status(400).json({
        error: `Invalid input for document inference: ${errorMessages}`,
        details: validationErrors,
        code: 'INVALID_INPUT_INFERENCE'
      });
    }

    const input = validationResult.data;
    console.log(`${logPrefix} Input validation successful. Parsed input:`, JSON.stringify(input));

    console.log(`${logPrefix} Calling inferDocumentTypeFlow...`);
    const output: InferDocumentTypeOutput = await inferDocumentTypeFlow(input);

    if (!output || !output.suggestions || output.suggestions.length === 0) {
      console.error(`${logPrefix} inferDocumentTypeFlow returned empty or invalid suggestions. Output:`, JSON.stringify(output));
      // It's possible the flow intentionally returns empty suggestions if it can't classify.
      // However, if 'output' itself is null/undefined, that's an issue.
      if (!output) {
         throw new Error("AI flow for document inference completed but returned an unexpectedly empty result object.");
      }
      // If output exists but suggestions are empty, this might be a valid scenario (e.g., "General Inquiry")
      // But we should ensure the schema is still met.
      const outputValidation = InferDocumentTypeOutputSchema.safeParse(output);
      if (!outputValidation.success) {
        console.error(`${logPrefix} inferDocumentTypeFlow output failed schema validation:`, JSON.stringify(outputValidation.error.flatten()));
        throw new z.ZodError(outputValidation.error.issues); // Propagate ZodError
      }
      console.log(`${logPrefix} Flow executed, result contains suggestions (possibly empty or General Inquiry). Output:`, JSON.stringify(output));
    } else {
      console.log(`${logPrefix} Flow executed successfully. Output:`, JSON.stringify(output));
    }
    
    console.log(`${logPrefix} Sending successful response status 200.`);
    return res.status(200).json(output);

  } catch (error: unknown) {
    console.error(`${logPrefix} === UNHANDLED ERROR IN API HANDLER (/infer-document-type) START ===`);
    console.error(`${logPrefix} Timestamp: ${new Date().toISOString()}`);
    console.error(`${logPrefix} Raw Error Object Type:`, typeof error);
    console.error(`${logPrefix} Raw Error Object:`, error);

    let statusCode = 500;
    let clientErrorMessage = 'An internal server error occurred during document type inference.';
    let errorCode = 'INFERENCE_INTERNAL_SERVER_ERROR';
    let errorDetails: any = error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : { message: String(error) };

    if (error instanceof z.ZodError) {
        statusCode = 502; // Bad Gateway - AI service responded with invalid format
        clientErrorMessage = "The AI service generated an invalid response format for document inference. Please try rephrasing or contact support.";
        errorCode = 'AI_RESPONSE_FORMAT_INVALID_INFERENCE';
        errorDetails = error.flatten(); // More specific Zod error details
        console.error(`${logPrefix} ZodError (likely AI Output Validation or Input in Flow):`, JSON.stringify(errorDetails));
    } else if (error instanceof Error) {
        // More detailed error logging for generic errors
        console.error(`${logPrefix} Error Name: ${error.name}`);
        console.error(`${logPrefix} Error Message: ${error.message}`);
        console.error(`${logPrefix} Error Stack: ${error.stack}`);

        clientErrorMessage = `AI Service Error: ${error.message}`; // Use the actual error message

        if (error.message.includes('GOOGLE_GENAI_API_KEY') || error.message.includes('Genkit initialization failed')) {
            statusCode = 503; // Service Unavailable
            clientErrorMessage = "AI service configuration or initialization error. Please contact support.";
            errorCode = 'AI_INIT_CONFIG_ERROR_INFERENCE';
        } else if (error.message.includes('API key not valid') || error.message.includes('permission denied')) {
            statusCode = 503; // Service Unavailable or Forbidden
            clientErrorMessage = "Could not authenticate with the AI service due to an invalid API key or permissions. Please contact support.";
            errorCode = 'AI_AUTH_ERROR_INFERENCE';
        } else if (error.message.includes('quota exceeded')) {
             statusCode = 429; // Too Many Requests
             clientErrorMessage = "AI service quota exceeded. Please try again later or contact support.";
             errorCode = 'AI_QUOTA_EXCEEDED_INFERENCE';
        } else if (error.message.includes('fetch failed') || error.message.includes('network error') || error.message.includes('socket hang up') || error.message.includes('timeout')) {
            statusCode = 504; // Gateway Timeout
            clientErrorMessage = "Network error: Could not reach the AI service. Please check your connection or try again later.";
            errorCode = 'AI_NETWORK_ERROR_INFERENCE';
        } else {
             // Default for other errors from the flow or Genkit
            errorCode = 'AI_FLOW_EXECUTION_ERROR_INFERENCE';
        }
    } else {
        console.error(`${logPrefix} Non-Error object thrown in API handler:`, error);
        clientErrorMessage = `An unexpected server error of unknown type occurred during document inference.`;
        errorCode = 'UNKNOWN_EXCEPTION_TYPE_INFERENCE';
    }

    console.error(`${logPrefix} === UNHANDLED ERROR IN API HANDLER (/infer-document-type) END ===`);
    console.log(`${logPrefix} Sending error response: Status ${statusCode}, Code: ${errorCode}, Message: "${clientErrorMessage}"`);

    const responsePayload: ErrorResponse = {
        error: clientErrorMessage,
        code: errorCode,
        details: process.env.NODE_ENV === 'development' ? errorDetails : undefined, // Only send full details in dev
    };

    if (!res.headersSent) {
        return res.status(statusCode).json(responsePayload);
    } else {
        console.error(`${logPrefix} Error handler attempted to send response, but headers were already sent. This indicates a critical failure or double-response attempt.`);
    }
  }
}
