// src/lib/server-auth.ts
import { NextRequest } from 'next/server';
import { getAdmin } from '@/lib/firebase-admin';

export interface AuthenticatedUser {
  uid: string;
  email?: string | null;
  name?: string | null;
}

/**
 * Extract and verify Firebase ID token from request headers
 * Returns authenticated user data or null if authentication fails
 */
export async function authenticateUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('[server-auth] No valid authorization header found');
      return null;
    }

    const idToken = authHeader.split('Bearer ')[1];
    if (!idToken) {
      console.warn('[server-auth] No token found in authorization header');
      return null;
    }

    // Verify the token using Firebase Admin SDK
    const admin = getAdmin();
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    return {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      name: decodedToken.name || null,
    };
  } catch (error) {
    console.error('[server-auth] Token verification failed:', error);
    return null;
  }
}

/**
 * Middleware helper that requires authentication
 * Returns authenticated user or throws an error response
 */
export async function requireAuth(request: NextRequest): Promise<AuthenticatedUser | Response> {
  const user = await authenticateUser(request);
  
  if (!user) {
    return new Response(
      JSON.stringify({ 
        error: 'Authentication required',
        message: 'Please provide a valid Firebase ID token in the Authorization header',
        code: 'UNAUTHORIZED'
      }),
      { 
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
  
  return user;
}

/**
 * Alternative authentication that falls back to mock for development
 * Use this during development/testing when you don't want to enforce real auth
 */
export async function authenticateUserWithFallback(request: NextRequest): Promise<AuthenticatedUser> {
  const user = await authenticateUser(request);
  
  if (user) {
    return user;
  }

  // Fallback to mock user in development
  if (process.env.NODE_ENV === 'development') {
    console.warn('[server-auth] Using mock user in development mode');
    return {
      uid: 'mock-user-dev',
      email: 'dev-user@example.com',
      name: 'Development User'
    };
  }

  throw new Error('Authentication required');
}