// src/app/api/generate-pdf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  logDocumentGenerationError,
  logDocumentGenerationStart,
  logDocumentGenerationSuccess,
} from '@/lib/logging/document-generation-logger';

// Run dynamically at request time (SSR)
export const dynamic = 'force-dynamic';

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
  const context: Record<string, unknown> = {
    requestId,
    method: request.method,
    url: request.url,
    documentType: 'unknown',
  };
  const start = logDocumentGenerationStart('api.generatePdf', context);

  let user: any = null;

  try {
    // Authenticate user first (dynamically import heavy auth only when needed)
    const { requireAuth } = await import('@/lib/server-auth');
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) {
      logDocumentGenerationError(
        'api.generatePdf',
        start,
        { ...context, auth: 'failed' },
        new Error('Authentication failed'),
      );
      return authResult;
    }
    user = authResult;
    context.userId = user.uid;
    context.userEmail = user.email;

    if (process.env.NEXT_PUBLIC_DISABLE_API_ROUTES === 'true') {
      const error = new Error('API Route Disabled via NEXT_PUBLIC_DISABLE_API_ROUTES');
      logDocumentGenerationError(
        'api.generatePdf',
        start,
        { ...context, disabled: true },
        error,
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

    const body: RequestData = await request.json();
    const { answers, state } = body;
    const documentType = body.documentType;
    context.documentType = documentType;
    context.state = state;
    context.answerCount = Object.keys(answers || {}).length;

    if (
      !documentType ||
      typeof documentType !== 'string' ||
      documentType.trim() === ''
    ) {
      const error = new Error('Missing or invalid documentType');
      logDocumentGenerationError('api.generatePdf', start, context, error);
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
      context.answersEmpty = true;
    }

    // Dynamically import heavy pdf generator only when needed
    const { generatePdfDocument } = await import('@/services/pdf-generator');
    const pdfBytes = await generatePdfDocument({ documentType, answers });

    if (!pdfBytes || pdfBytes.length === 0) {
      throw new Error('PDF generation process completed but returned no data.');
    }

    const safeDocumentName =
      documentType.replace(/[^a-zA-Z0-9_.-]/g, '_') || 'document';

    // Log successful PDF download
    const { auditService } = await import('@/services/firebase-audit-service');
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

    logDocumentGenerationSuccess('api.generatePdf', start, context, {
      status: 200,
      pdfSize: pdfBytes.length,
    });

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${safeDocumentName}.pdf"`,
        'Content-Length': pdfBytes.length.toString(),
      },
    });
  } catch (error: unknown) {
    let statusCode = 500;
    let clientErrorMessage =
      'Failed to generate PDF document due to an internal server error.';
    let errorCode = 'PDF_GENERATION_INTERNAL_ERROR';
    const errorDetails =
      error instanceof Error
        ? { name: error.name, message: error.message, stack: error.stack }
        : { message: String(error) };

    if (error instanceof Error) {
      clientErrorMessage = `PDF Generation Failed: ${error.message}`;

      if (
        error.message.includes('template not found') ||
        error.message.includes('No questions found')
      ) {
        statusCode = 404;
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
    } else {
      errorCode = 'UNKNOWN_EXCEPTION_PDF_GENERATION';
    }

    logDocumentGenerationError('api.generatePdf', start, { ...context, statusCode }, error);

    if (user) {
      const { auditService } = await import('@/services/firebase-audit-service');
      await auditService.logDocumentEvent(
        'download',
        `${context.documentType}-${Date.now()}`,
        String(context.documentType),
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

// Note: Health monitoring wrapper removed to keep this route lean.
