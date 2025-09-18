// src/app/api/collaboration/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  generateCollaborationToken,
  authorizeDocumentAccess,
  checkPermission,
} from '@/lib/collaboration/auth';

export async function POST(request: NextRequest) {
  try {
    // Check if Firebase Admin is configured
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON;
    if (!serviceAccountKey) {
      console.error('[collaboration/auth] Firebase Admin SDK is not configured');
      return NextResponse.json(
        { error: 'Collaboration service is not configured' },
        { status: 503 },
      );
    }

    // Initialize Firebase Admin auth inside the function
    const { getAdmin } = await import('@/lib/firebase-admin');
    const auth = getAdmin().auth();

    const { documentId, role, expiresIn } = await request.json();

    // Get Firebase Auth token from headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing authorization token' },
        { status: 401 },
      );
    }

    const idToken = authHeader.substring(7);
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Check if user has access to the document
    const hasAccess = await authorizeDocumentAccess(documentId, userId);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Generate collaboration token
    const collaborationToken = await generateCollaborationToken(
      userId,
      documentId,
      role || 'editor',
      expiresIn || 3600000, // 1 hour default
    );

    return NextResponse.json({
      success: true,
      token: collaborationToken,
      expiresAt: Date.now() + (expiresIn || 3600000),
    });
  } catch (error) {
    console.error('Collaboration auth error:', error);
    return NextResponse.json(
      { error: 'Failed to generate collaboration token' },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('documentId');
    const permission = searchParams.get('permission');

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID required' },
        { status: 400 },
      );
    }

    // Get Firebase Auth token from headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing authorization token' },
        { status: 401 },
      );
    }

    const idToken = authHeader.substring(7);
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Check document access
    const hasAccess = await authorizeDocumentAccess(documentId, userId);

    let hasPermission = false;
    if (hasAccess && permission) {
      hasPermission = await checkPermission(userId, documentId, permission);
    }

    return NextResponse.json({
      hasAccess,
      hasPermission: permission ? hasPermission : undefined,
      userId,
    });
  } catch (error) {
    console.error('Collaboration auth check error:', error);
    return NextResponse.json(
      { error: 'Failed to check authorization' },
      { status: 500 },
    );
  }
}
