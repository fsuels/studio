// src/app/api/generate-pdf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generatePdfDocument } from '@/services/pdf-generator';
import { auditService } from '@/services/firebase-audit-service';
import { requireAuth } from '@/lib/server-auth';
import { withHealthMonitoring } from '@/middleware/health-monitoring';
import { operationalHealth } from '@/lib/operational-health';

type RequestData = {
  documentType: string;
  answers: Record<string, unknown>;
  state?: string;
};

type ErrorResponse = {
  error: string;
  details?: string;
  code?: string;
};

export async function POST(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const logPrefix = `[API /generate-pdf] [${requestId}]`;
  let documentType: string = 'unknown';

  console.log(
    `${logPrefix} Received request: ${request.method} ${request.url}`,
  );

  // Authenticate user first
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) {
    console.log(`${logPrefix} Authentication failed`);
    return authResult;
  }
  const user = authResult;
  console.log(`${logPrefix} User authenticated: ${user.uid} (${user.email})`);

  if (process.env.NEXT_PUBLIC_DISABLE_API_ROUTES === 'true') {
    console.warn(
      `${logPrefix} API Route Disabled (NEXT_PUBLIC_DISABLE_API_ROUTES=true). Returning 503.`,
    );
    return NextResponse.json(
      {
        error: 'PDF Generation is disabled in the current environment.',
        details:
          'This API route is not available when NEXT_PUBLIC_DISABLE_API_ROUTES is set to true.',
        code: 'API_DISABLED_PDF_GENERATION',
      },
      { status: 503 },
    );
  }

  try {
    // Authenticate user
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    user = authResult;

    const body: RequestData = await request.json();
    const { answers, state } = body;
    documentType = body.documentType;
    console.log(
      `${logPrefix} Request body parsed. DocumentType: "${documentType}", State: "${state || 'N/A'}", Answers keys:`,
      Object.keys(answers || {}),
    );

    if (
      !documentType ||
      typeof documentType !== 'string' ||
      documentType.trim() === ''
    ) {
      console.error(
        `${logPrefix} Invalid input: Missing or invalid documentType.`,
      );
      return NextResponse.json(
        {
          error:
            'Invalid input for PDF generation: documentType is required and must be a non-empty string.',
          code: 'INVALID_INPUT_PDF_DOCTYPE',
        },
        { status: 400 },
      );
    }
    if (
      !answers ||
      typeof answers !== 'object' ||
      Object.keys(answers).length === 0
    ) {
      // Allow empty answers for documents that might not have questions.
      // If answers are *expected* to be non-empty for all docs, this check could be stricter.
      console.warn(
        `${logPrefix} Warning: 'answers' object is empty or not an object. Proceeding, but this might be an issue for some documents.`,
      );
    }

    console.log(
      `${logPrefix} Calling generatePdfDocument for type: ${documentType}, State: ${state || 'N/A'}`,
    );

    const pdfBytes = await generatePdfDocument({ documentType, answers });

    if (!pdfBytes || pdfBytes.length === 0) {
      console.error(
        `${logPrefix} PDF generation resulted in empty or null data for documentType: ${documentType}.`,
      );
      throw new Error('PDF generation process completed but returned no data.');
    }

    const safeDocumentName =
      documentType.replace(/[^a-zA-Z0-9_.-]/g, '_') || 'document';

    console.log(
      `${logPrefix} Successfully generated PDF (${pdfBytes.length} bytes) for "${documentType}". Sending response.`,
    );

    // Log successful PDF download
    await auditService.logDocumentEvent(
      'download',
      `${documentType}-${Date.now()}`,
      documentType,
      {
        userId: user.uid,
        email: user.email,
        state: state || 'unknown',
        pdfSize: pdfBytes.length,
        requestId,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    );

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${safeDocumentName}.pdf"`,
        'Content-Length': pdfBytes.length.toString(),
      },
    });
  } catch (error: unknown) {
    console.error(`${logPrefix} === PDF GENERATION ERROR HANDLER START ===`);
    console.error(`${logPrefix} Timestamp: ${new Date().toISOString()}`);
    console.error(`${logPrefix} Raw Error Object Type:`, typeof error);

    let statusCode = 500;
    let clientErrorMessage =
      'Failed to generate PDF document due to an internal server error.';
    let errorCode = 'PDF_GENERATION_INTERNAL_ERROR';
    const errorDetails =
      error instanceof Error
        ? { name: error.name, message: error.message, stack: error.stack }
        : { message: String(error) };

    // Modified log line
    console.error(
      `${logPrefix} Processed Error Details:`,
      JSON.stringify(errorDetails, null, 2),
    );

    if (error instanceof Error) {
      console.error(`${logPrefix} Error Name: ${error.name}`);
      console.error(`${logPrefix} Error Message: ${error.message}`);
      console.error(`${logPrefix} Error Stack: ${error.stack}`); // Log stack for better debugging

      clientErrorMessage = `PDF Generation Failed: ${error.message}`; // More specific

      if (
        error.message.includes('template not found') ||
        error.message.includes('No questions found')
      ) {
        statusCode = 404; // Or 400 if it's considered a client error for requesting non-existent type
        clientErrorMessage = `Could not generate PDF: The document type is not found or is misconfigured.`;
        errorCode = 'PDF_TEMPLATE_NOT_FOUND';
      } else if (
        error.message.includes(
          'PDF generation process completed but returned no data',
        )
      ) {
        statusCode = 500;
        clientErrorMessage = `PDF generation resulted in an empty document. This might indicate an issue with the template or data.`;
        errorCode = 'PDF_EMPTY_GENERATION';
      }
      // Add more specific error checks if pdf-lib or your generator throws distinct error types/messages
    } else {
      console.error(
        `${logPrefix} Non-Error object thrown in PDF generation handler:`,
        error,
      );
      errorCode = 'UNKNOWN_EXCEPTION_PDF_GENERATION';
    }

    // Log failed PDF generation attempt
    if (user) {
      await auditService.logDocumentEvent(
        'download',
        `${documentType}-${Date.now()}`,
        documentType,
        {
          userId: user.uid,
          email: user.email,
          success: false,
          error: clientErrorMessage,
          requestId,
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
        },
      );
    }

    console.error(`${logPrefix} === PDF GENERATION ERROR HANDLER END ===`);
    console.log(
      `${logPrefix} Sending error response: Status ${statusCode}, Code: ${errorCode}, Message: "${clientErrorMessage}"`,
    );

    const responsePayload: ErrorResponse = {
      error: clientErrorMessage,
      code: errorCode,
      details:
        process.env.NODE_ENV === 'development'
          ? JSON.stringify(errorDetails)
          : undefined, // Full details in dev
    };

    return NextResponse.json(responsePayload, { status: statusCode });
  }
}

// Create a monitored version of the POST function
export const monitoredPOST = withHealthMonitoring(
  async (request: NextRequest) => {
    const startTime = performance.now();

    try {
      // Record queue depth before processing
      await operationalHealth.recordQueueOperation(
        'pdf_generation',
        'depth',
        getPdfQueueDepth(),
      );

      const response = await originalPOST(request);

      // Record successful PDF generation metrics
      const endTime = performance.now();
      const duration = endTime - startTime;

      await operationalHealth.recordMetric({
        metricType: 'latency',
        value: duration,
        endpoint: '/api/generate-pdf',
        metadata: {
          success: response.status < 400,
          statusCode: response.status,
          operation: 'pdf_generation',
        },
      });

      // Record queue depth after processing
      await operationalHealth.recordQueueOperation(
        'pdf_generation',
        'dequeue',
        getPdfQueueDepth(),
      );

      return response;
    } catch (error) {
      // Record error metrics
      const endTime = performance.now();
      const duration = endTime - startTime;

      await operationalHealth.recordMetric({
        metricType: 'error_rate',
        value: 1,
        endpoint: '/api/generate-pdf',
        metadata: {
          error: error instanceof Error ? error.message : String(error),
          duration,
          operation: 'pdf_generation',
        },
      });

      throw error;
    }
  },
);

// Helper function to get current PDF queue depth (placeholder)
function getPdfQueueDepth(): number {
  // In a real implementation, this would check your actual PDF generation queue
  // For demonstration, return a random number between 0-20
  return Math.floor(Math.random() * 20);
}
