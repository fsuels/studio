// src/lib/client-auth.ts
import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';

/**
 * Get the current user's Firebase ID token for API requests
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (!user) {
      console.warn('[client-auth] No authenticated user found');
      return null;
    }

    const idToken = await user.getIdToken();
    return idToken;
  } catch (error) {
    console.error('[client-auth] Failed to get auth token:', error);
    return null;
  }
}

/**
 * Make an authenticated API request with automatic token attachment
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = await getAuthToken();

  if (!token) {
    throw new Error('User not authenticated');
  }

  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${token}`);

  return fetch(url, {
    ...options,
    headers,
  });
}

/**
 * Make an authenticated POST request with JSON body
 */
export async function authenticatedPost<T>(
  url: string,
  data: T,
): Promise<Response> {
  return authenticatedFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

/**
 * Generate PDF with authentication
 */
export async function generateAuthenticatedPdf(params: {
  documentType: string;
  answers: Record<string, unknown>;
  state?: string;
}): Promise<Blob> {
  const response = await authenticatedPost('/api/generate-pdf', params);

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: 'Unknown error' }));
    throw new Error(
      errorData.error || `HTTP ${response.status}: ${response.statusText}`,
    );
  }

  return response.blob();
}
