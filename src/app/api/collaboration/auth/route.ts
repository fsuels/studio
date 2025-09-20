// src/app/api/collaboration/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  generateCollaborationToken,
  authorizeDocumentAccess,
  checkPermission,
} from '@/lib/collaboration/auth';
import type { CollaborationToken } from '@/lib/collaboration/auth';
import { auth as adminAuth } from '@/lib/firebase-admin';

type CollaborationRole = CollaborationToken['role'];

interface CollaborationTokenRequestBody {
  documentId: string;
  role?: CollaborationRole;
  expiresIn?: number;
}

const FALLBACK_EXPIRATION_MS = 3_600_000; // 1 hour
const MIN_EXPIRATION_MS = 1_000;
const MAX_EXPIRATION_MS = 86_400_000; // 24 hours

function isCollaborationRole(value: unknown): value is CollaborationRole {
  return value === 'owner' || value === 'editor' || value === 'reviewer' || value === 'viewer';
}

function parseRequestBody(value: unknown): CollaborationTokenRequestBody | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const body = value as Record<string, unknown>;
  if (typeof body.documentId !== 'string' || body.documentId.trim().length === 0) {
    return null;
  }

  if (body.role !== undefined && !isCollaborationRole(body.role)) {
    return null;
  }

  if (body.expiresIn !== undefined && typeof body.expiresIn !== 'number') {
    return null;
  }

  return {
    documentId: body.documentId,
    role: body.role as CollaborationRole | undefined,
    expiresIn: body.expiresIn as number | undefined,
  };
}

function normalizeExpiration(expiresIn?: number): number {
  if (typeof expiresIn !== 'number' || !Number.isFinite(expiresIn)) {
    return FALLBACK_EXPIRATION_MS;
  }

  return Math.min(Math.max(expiresIn, MIN_EXPIRATION_MS), MAX_EXPIRATION_MS);
}

async function verifyAuthenticatedUser(
  request: NextRequest,
): Promise<{ userId: string } | NextResponse> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing authorization token' }, { status: 401 });
  }

  const idToken = authHeader.substring(7);

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return { userId: decodedToken.uid };
  } catch (error) {
    console.error('Failed to verify Firebase ID token for collaboration auth:', error);
    return NextResponse.json({ error: 'Invalid authorization token' }, { status: 401 });
  }
}

function ensureAdminSdkConfigured(): NextResponse | undefined {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON;
  if (!serviceAccountKey) {
    console.error('[collaboration/auth] Firebase Admin SDK is not configured');
    return NextResponse.json(
      { error: 'Collaboration service is not configured' },
      { status: 503 },
    );
  }
  return undefined;
}

export async function POST(request: NextRequest) {
  const configError = ensureAdminSdkConfigured();
  if (configError) {
    return configError;
  }

  try {
    const body = parseRequestBody(await request.json());
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const authResult = await verifyAuthenticatedUser(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { documentId, role = 'editor', expiresIn } = body;
    const normalizedExpiresIn = normalizeExpiration(expiresIn);

    const hasAccess = await authorizeDocumentAccess(documentId, authResult.userId);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const collaborationToken = await generateCollaborationToken(
      authResult.userId,
      documentId,
      role,
      normalizedExpiresIn,
    );

    if (typeof collaborationToken !== 'string') {
      console.error('[collaboration/auth] Generated token is invalid', {
        documentId,
        userId: authResult.userId,
      });
      return NextResponse.json(
        { error: 'Failed to generate collaboration token' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      token: collaborationToken,
      expiresAt: Date.now() + normalizedExpiresIn,
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
  const configError = ensureAdminSdkConfigured();
  if (configError) {
    return configError;
  }

  try {
    const authResult = await verifyAuthenticatedUser(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('documentId');
    const permission = searchParams.get('permission');

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 });
    }

    const hasAccess = await authorizeDocumentAccess(documentId, authResult.userId);

    let hasPermission: boolean | undefined;
    if (hasAccess && permission) {
      hasPermission = await checkPermission(authResult.userId, documentId, permission);
    }

    return NextResponse.json({
      hasAccess,
      hasPermission,
      userId: authResult.userId,
    });
  } catch (error) {
    console.error('Collaboration auth check error:', error);
    return NextResponse.json(
      { error: 'Failed to check authorization' },
      { status: 500 },
    );
  }
}
