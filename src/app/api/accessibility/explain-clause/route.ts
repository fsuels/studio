import { NextRequest, NextResponse } from 'next/server';

import { explainClause } from '@/ai/flows/explain-clause';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body as { text?: string };

    if (!text || typeof text !== 'string' || text.trim().length < 5) {
      return NextResponse.json(
        {
          error: 'Clause text is required and must be at least 5 characters long.',
        },
        { status: 400 },
      );
    }

    const explanation = await explainClause(text.trim());

    return NextResponse.json({
      success: true,
      explanation,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[API] Clause explanation error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Clause explanation API',
    usage: {
      endpoint: '/api/accessibility/explain-clause',
      method: 'POST',
      body: {
        text: 'string (required, >=5 characters)',
      },
    },
  });
}
