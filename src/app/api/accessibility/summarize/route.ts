import { NextRequest, NextResponse } from 'next/server';
import {
  getCachedDocumentSummary,
  DocumentSummaryOptions,
} from '@/ai/flows/summarize-document';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      documentText,
      documentType,
      options = {},
    }: {
      documentText: string;
      documentType?: string;
      options?: DocumentSummaryOptions;
    } = body;

    // Validate input
    if (!documentText || typeof documentText !== 'string') {
      return NextResponse.json(
        { error: 'Document text is required and must be a string' },
        { status: 400 },
      );
    }

    if (documentText.length < 50) {
      return NextResponse.json(
        { error: 'Document text is too short to summarize' },
        { status: 400 },
      );
    }

    if (documentText.length > 50000) {
      return NextResponse.json(
        { error: 'Document text is too long (max 50,000 characters)' },
        { status: 400 },
      );
    }

    // Generate summary
    const summary = await getCachedDocumentSummary(
      documentText,
      documentType,
      options,
    );

    if (!summary) {
      return NextResponse.json(
        { error: 'Failed to generate document summary' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      summary,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[API] Document summarization error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

// Rate limiting helper (basic implementation)
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per hour
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

function _checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const clientData = requestCounts.get(clientId);

  if (!clientData || now > clientData.resetTime) {
    // Reset or initialize
    requestCounts.set(clientId, {
      count: 1,
      resetTime: now + RATE_WINDOW,
    });
    return true;
  }

  if (clientData.count >= RATE_LIMIT) {
    return false;
  }

  clientData.count++;
  return true;
}

export async function GET(_request: NextRequest) {
  return NextResponse.json({
    message: 'Document summarization API',
    usage: {
      endpoint: '/api/accessibility/summarize',
      method: 'POST',
      body: {
        documentText: 'string (required, 50-50000 chars)',
        documentType: 'string (optional)',
        options: {
          readingLevel: 'simple | standard | advanced',
          maxLength: 'brief | detailed | comprehensive',
          focusAreas: 'string[]',
          includeKeyTerms: 'boolean',
        },
      },
    },
    rateLimit: {
      requests: RATE_LIMIT,
      window: '1 hour',
    },
  });
}
