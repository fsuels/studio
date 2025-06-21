import { NextRequest, NextResponse } from 'next/server';
import { simplifyLegalJargon } from '@/ai/flows/summarize-document';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text }: { text: string } = body;

    // Validate input
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      );
    }

    if (text.length < 10) {
      return NextResponse.json(
        { error: 'Text is too short to simplify' },
        { status: 400 }
      );
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { error: 'Text is too long (max 5,000 characters)' },
        { status: 400 }
      );
    }

    // Simplify the text
    const simplifiedText = await simplifyLegalJargon(text);

    return NextResponse.json({
      success: true,
      original: text,
      simplified: simplifiedText,
      simplifiedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('[API] Legal jargon simplification error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Legal jargon simplification API',
    usage: {
      endpoint: '/api/accessibility/simplify',
      method: 'POST',
      body: {
        text: 'string (required, 10-5000 chars)'
      }
    },
    examples: [
      {
        original: 'The party of the first part hereby agrees to indemnify and hold harmless the party of the second part.',
        simplified: 'The first person agrees to protect and pay for any damages to the second person.'
      },
      {
        original: 'Notwithstanding any provision to the contrary herein contained.',
        simplified: 'Despite anything else written in this document.'
      }
    ]
  });
}