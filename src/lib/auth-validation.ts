// src/lib/auth-validation.ts
import { NextRequest } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';

export interface ValidatedUser {
  uid: string;
  email?: string;
  role?: string;
  organizationId?: string;
}

export async function validateRequest(request: NextRequest): Promise<{
  user: ValidatedUser | null;
  error: string | null;
}> {
  try {
    // Get token from Authorization header or cookies
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || getCookieToken();

    if (!token) {
      return { user: null, error: 'No authentication token provided' };
    }

    // Verify Firebase ID token
    const decodedToken = await getAuth().verifyIdToken(token);

    if (!decodedToken) {
      return { user: null, error: 'Invalid authentication token' };
    }

    // Get user data from Firebase Auth
    const userRecord = await getAuth().getUser(decodedToken.uid);

    const user: ValidatedUser = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role || userRecord.customClaims?.role || 'user',
      organizationId:
        decodedToken.organizationId || userRecord.customClaims?.organizationId,
    };

    return { user, error: null };
  } catch (error: any) {
    console.error('Auth validation error:', error);

    if (error.code === 'auth/id-token-expired') {
      return { user: null, error: 'Authentication token expired' };
    }

    if (error.code === 'auth/id-token-revoked') {
      return { user: null, error: 'Authentication token revoked' };
    }

    return { user: null, error: 'Authentication failed' };
  }
}

function getCookieToken(): string | null {
  try {
    const cookieStore = cookies();
    return cookieStore.get('auth-token')?.value || null;
  } catch {
    return null;
  }
}

export function requireRole(allowedRoles: string[]) {
  return async (
    request: NextRequest,
  ): Promise<{
    user: ValidatedUser | null;
    error: string | null;
  }> => {
    const { user, error } = await validateRequest(request);

    if (error || !user) {
      return { user: null, error: error || 'Authentication required' };
    }

    if (!allowedRoles.includes(user.role || 'user')) {
      return {
        user: null,
        error: `Insufficient permissions. Required roles: ${allowedRoles.join(', ')}`,
      };
    }

    return { user, error: null };
  };
}

export const requireAdmin = requireRole(['admin', 'super_admin']);
export const requireSupport = requireRole(['admin', 'super_admin', 'support']);
export const requireQA = requireRole(['admin', 'super_admin', 'qa', 'support']);
