// src/app/api/infer-document-type/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  getAllDocumentMetadata,
  type DocumentMetadata,
} from '@/lib/document-metadata-registry';
import type { InferDocumentTypeOutput as FlowInferDocumentTypeOutput } from '@/ai/flows/infer-document-type';

type FlowSuggestion = FlowInferDocumentTypeOutput['suggestions'][number];

type ApiDocType = {
  id: string;
  title: string;
  description: string;
  category: string;
  jurisdiction: string;
  states?: string[];
  requiresNotary?: boolean;
  tags?: string[];
  aliases?: string[];
  translations: DocumentMetadata['translations'];
};

type InferenceSuggestionResponse = {
  docType: ApiDocType | null;
  documentType: string;
  confidence: number;
  reasoning?: string;
};

type InferDocumentTypeApiResponse = {\n  suggestions: InferenceSuggestionResponse[];\n};\n\ntype ErrorResponse = {\n  error: string;\n  code: string;\n  details?: unknown;\n};

type DocumentIndex = {
  lookup: Map<string, DocumentMetadata>;
};

const DOCUMENT_INDEX: DocumentIndex = buildDocumentIndex();

function buildDocumentIndex(): DocumentIndex {
  const lookup = new Map<string, DocumentMetadata>();
  const metadataList = getAllDocumentMetadata();

  metadataList.forEach((metadata) => {
    collectMetadataKeys(metadata).forEach((key) => {
      if (!lookup.has(key)) {
        lookup.set(key, metadata);
      }
    });
  });

  return { lookup };
}

function collectMetadataKeys(metadata: DocumentMetadata): string[] {
  const keys = new Set<string>();

  const addKey = (value?: string | null) => {
    if (!value) return;
    const normalized = value.trim().toLowerCase();
    if (normalized) {
      keys.add(normalized);
    }
  };

  addKey(metadata.id);
  addKey(metadata.title);
  addKey(metadata.translations?.en?.name);
  addKey(metadata.translations?.es?.name);

  (metadata.aliases ?? []).forEach(addKey);
  (metadata.tags ?? []).forEach(addKey);
  (metadata.translations?.en?.aliases ?? []).forEach(addKey);
  (metadata.translations?.es?.aliases ?? []).forEach(addKey);

  return Array.from(keys);
}

function mapMetadataToApiDoc(metadata: DocumentMetadata): ApiDocType {
  return {
    id: metadata.id,
    title: metadata.title,
    description: metadata.description,
    category: metadata.category,
    jurisdiction: metadata.jurisdiction,
    states: metadata.states,
    requiresNotary: metadata.requiresNotary,
    tags: metadata.tags,
    aliases: metadata.aliases,
    translations: metadata.translations,
  };
}

function resolveDocType(documentType: string): ApiDocType | null {
  const normalized = documentType?.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  const metadata = DOCUMENT_INDEX.lookup.get(normalized);
  if (!metadata) {
    return null;
  }

  return mapMetadataToApiDoc(metadata);
}

export async function POST(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const logPrefix = `[API /infer-document-type] [${requestId}]`;

  console.log(
    `${logPrefix} Received request: ${request.method} ${request.url}`,
  );

  if (process.env.NEXT_PUBLIC_DISABLE_API_ROUTES === 'true') {
    console.warn(
      `${logPrefix} API Route Disabled (NEXT_PUBLIC_DISABLE_API_ROUTES=true). Returning 503.`,
    );
    return NextResponse.json(
      {
        error: 'AI document inference is disabled in the current environment.',
        details:
          'This API route is not available when NEXT_PUBLIC_DISABLE_API_ROUTES is set to true.',
        code: 'API_DISABLED_INFERENCE',
      },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();
    console.log(
      `${logPrefix} Validating request body. Body received:`,
      JSON.stringify(body),
    );
    // Dynamically import AI flow to reduce bundle size
    const { InferDocumentTypeInputSchema } = await import('@/ai/flows/infer-document-type');
    const validationResult = InferDocumentTypeInputSchema.safeParse(body);
    if (!validationResult.success) {
      const validationErrors = validationResult.error.flatten();
      console.error(
        `${logPrefix} Invalid input:`,
        JSON.stringify(validationErrors),
      );
      const errorMessages = validationResult.error.errors
        .map((e) => `${e.path.join('.') || 'input'}: ${e.message}`)
        .join('; ');
      return NextResponse.json(
        {
          error: `Invalid input for document inference: ${errorMessages}`,
          details: validationErrors,
          code: 'INVALID_INPUT_INFERENCE',
        },
        { status: 400 },
      );
    }

    const input = validationResult.data;
    console.log(
      `${logPrefix} Input validation successful. Parsed input:`,
      JSON.stringify(input),
    );

    console.log(`${logPrefix} Calling inferDocumentTypeFlow...`);
    const flowModule = await import('@/ai/flows/infer-document-type');
    const output: FlowInferDocumentTypeOutput =
      await flowModule.inferDocumentTypeFlow(input);

    if (!output || !output.suggestions || output.suggestions.length === 0) {
      console.error(
        `${logPrefix} inferDocumentTypeFlow returned empty or invalid suggestions. Output:`,
        JSON.stringify(output),
      );
      // It's possible the flow intentionally returns empty suggestions if it can't classify.
      // However, if 'output' itself is null/undefined, that's an issue.
      if (!output) {
        throw new Error(
          'AI flow for document inference completed but returned an unexpectedly empty result object.',
        );
      }
      // If output exists but suggestions are empty, this might be a valid scenario (e.g., "General Inquiry")
      // But we should ensure the schema is still met.
      const outputValidation = flowModule.InferDocumentTypeOutputSchema.safeParse(output);
      if (!outputValidation.success) {
        console.error(
          `${logPrefix} inferDocumentTypeFlow output failed schema validation:`,
          JSON.stringify(outputValidation.error.flatten()),
        );
        throw new z.ZodError(outputValidation.error.issues); // Propagate ZodError
      }
      console.log(
        `${logPrefix} Flow executed, result contains suggestions (possibly empty or General Inquiry). Output:`,
        JSON.stringify(output),
      );
    } else {
      console.log(
        `${logPrefix} Flow executed successfully. Output:`,
        JSON.stringify(output),
      );
    }

    console.log(`${logPrefix} Sending successful response status 200.`);

    const suggestions = output.suggestions.map((suggestion: FlowSuggestion) => {
      const docType = resolveDocType(suggestion.documentType);
      if (!docType) {
        console.warn(`${logPrefix} Unable to resolve documentType from catalog: ${suggestion.documentType}`);
      }

      return {
        docType,
        documentType: suggestion.documentType,
        confidence: suggestion.confidence,
        reasoning: suggestion.reasoning,
      };
    });

    const responsePayload: InferDocumentTypeApiResponse = { suggestions };

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error: unknown) {
    console.error(
      `${logPrefix} === UNHANDLED ERROR IN API HANDLER (/infer-document-type) START ===`,
    );
    console.error(`${logPrefix} Timestamp: ${new Date().toISOString()}`);
    console.error(`${logPrefix} Raw Error Object Type:`, typeof error);
    console.error(`${logPrefix} Raw Error Object:`, error);

    let statusCode = 500;
    let clientErrorMessage: string =
      'An internal server error occurred during document type inference.';
    let errorCode: ErrorResponse['code'] =
      'INFERENCE_INTERNAL_SERVER_ERROR';
    let errorDetails: unknown =
      error instanceof Error
        ? { name: error.name, message: error.message, stack: error.stack }
        : { message: String(error) };

    if (error instanceof z.ZodError) {
      statusCode = 502; // Bad Gateway - AI service responded with invalid format
      clientErrorMessage =
        'The AI service generated an invalid response format for document inference. Please try rephrasing or contact support.';
      errorCode = 'AI_RESPONSE_FORMAT_INVALID_INFERENCE';
      errorDetails = error.flatten(); // More specific Zod error details
      console.error(
        `${logPrefix} ZodError (likely AI Output Validation or Input in Flow):`,
        JSON.stringify(errorDetails),
      );
    } else if (error instanceof Error) {
      // More detailed error logging for generic errors
      console.error(`${logPrefix} Error Name: ${error.name}`);
      console.error(`${logPrefix} Error Message: ${error.message}`);
      console.error(`${logPrefix} Error Stack: ${error.stack}`);

      clientErrorMessage = `AI Service Error: ${error.message}`; // Use the actual error message

      if (
        error.message.includes('GOOGLE_GENAI_API_KEY') ||
        error.message.includes('Genkit initialization failed')
      ) {
        statusCode = 503; // Service Unavailable
        clientErrorMessage =
          'AI service configuration or initialization error. Please contact support.';
        errorCode = 'AI_INIT_CONFIG_ERROR_INFERENCE';
      } else if (
        error.message.includes('API key not valid') ||
        error.message.includes('permission denied')
      ) {
        statusCode = 503; // Service Unavailable or Forbidden
        clientErrorMessage =
          'Could not authenticate with the AI service due to an invalid API key or permissions. Please contact support.';
        errorCode = 'AI_AUTH_ERROR_INFERENCE';
      } else if (error.message.includes('quota exceeded')) {
        statusCode = 429; // Too Many Requests
        clientErrorMessage =
          'AI service quota exceeded. Please try again later or contact support.';
        errorCode = 'AI_QUOTA_EXCEEDED_INFERENCE';
      } else if (
        error.message.includes('fetch failed') ||
        error.message.includes('network error') ||
        error.message.includes('socket hang up') ||
        error.message.includes('timeout')
      ) {
        statusCode = 504; // Gateway Timeout
        clientErrorMessage =
          'Network error: Could not reach the AI service. Please check your connection or try again later.';
        errorCode = 'AI_NETWORK_ERROR_INFERENCE';
      } else {
        // Default for other errors from the flow or Genkit
        errorCode = 'AI_FLOW_EXECUTION_ERROR_INFERENCE';
      }
    } else {
      console.error(
        `${logPrefix} Non-Error object thrown in API handler:`,
        error,
      );
      clientErrorMessage = `An unexpected server error of unknown type occurred during document inference.`;
      errorCode = 'UNKNOWN_EXCEPTION_TYPE_INFERENCE';
    }

    console.error(
      `${logPrefix} === UNHANDLED ERROR IN API HANDLER (/infer-document-type) END ===`,
    );
    console.log(
      `${logPrefix} Sending error response: Status ${statusCode}, Code: ${errorCode}, Message: "${clientErrorMessage}"`,
    );

    const responsePayload: ErrorResponse = {
      error: clientErrorMessage,
      code: errorCode,
      details:
        process.env.NODE_ENV === 'development' ? errorDetails : undefined, // Only send full details in dev
    };

    return NextResponse.json(responsePayload, { status: statusCode });
  }
}


