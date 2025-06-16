// src/app/api/generate-docx/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'DOCX generation not implemented.' },
    { status: 501 }
  );
}