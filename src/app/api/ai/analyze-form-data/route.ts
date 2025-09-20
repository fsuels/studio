import { NextResponse } from 'next/server';
import { analyzeFormDataServer } from '@/ai/flows/analyze-form-data.server';
import type { AnalyzeParams } from '@/ai/flows/analyze-form-data.shared';

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as AnalyzeParams | null;

    if (!payload || typeof payload !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 },
      );
    }

    const suggestions = await analyzeFormDataServer(payload);

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('[api/analyze-form-data] Failed to analyze form data', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unexpected error',
      },
      { status: 500 },
    );
  }
}
