import { NextResponse } from 'next/server';
import { analyzeFormData } from '@/ai/flows/analyze-form-data';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { documentType, schema, answers, language } = body as {
      documentType?: string;
      schema?: unknown;
      answers?: unknown;
      language?: 'en' | 'es';
    };

    if (!documentType || !Array.isArray(schema) || typeof answers !== 'object' || answers === null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const suggestions = await analyzeFormData({
      documentType,
      // The schema arrives cast from the client; analyzeFormData will validate downstream.
      schema: schema as any,
      answers: answers as Record<string, string | number | boolean | undefined>,
      language,
    });

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('[api/form-analysis] Unhandled error', error);
    return NextResponse.json({ error: 'Unable to analyze form data' }, { status: 500 });
  }
}
