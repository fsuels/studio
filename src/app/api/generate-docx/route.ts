// src/app/api/generate-docx/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/server-auth';

export async function POST(request: NextRequest) {
  // Authenticate user first
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) {
    return authResult;
  }
  const user = authResult;
  console.log(`[API /generate-docx] User authenticated: ${user.uid} (${user.email})`);

  return NextResponse.json(
    { error: 'DOCX generation not implemented.' },
    { status: 501 }
  );
}