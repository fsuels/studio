// Admin authentication system
import { NextRequest } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

// Admin credentials - In production, use environment variables
const ADMIN_CREDENTIALS = {
  username: 'Fsuels',
  password: 'F$uels15394600!'
};

// JWT secret - In production, use a strong environment variable
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
);

export interface AdminUser {
  username: string;
  role: 'admin';
  loginTime: string;
}

// Authenticate admin credentials
export function validateAdminCredentials(username: string, password: string): boolean {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
}

// Create admin JWT token
export async function createAdminToken(username: string): Promise<string> {
  const payload = {
    username,
    role: 'admin',
    loginTime: new Date().toISOString(),
  };

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h') // Token expires in 24 hours
    .sign(JWT_SECRET);

  return token;
}

// Verify admin JWT token
export async function verifyAdminToken(token: string): Promise<AdminUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    if (payload.role === 'admin' && payload.username === ADMIN_CREDENTIALS.username) {
      return {
        username: payload.username as string,
        role: 'admin',
        loginTime: payload.loginTime as string,
      };
    }
    
    return null;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

// Get admin user from request cookies
export async function getAdminUser(request?: NextRequest): Promise<AdminUser | null> {
  try {
    let token: string | undefined;
    
    if (request) {
      // Server-side: get from request cookies
      token = request.cookies.get('admin-token')?.value;
    } else {
      // Client-side: get from document cookies
      if (typeof document !== 'undefined') {
        const cookies = document.cookie.split(';');
        const adminCookie = cookies.find(cookie => cookie.trim().startsWith('admin-token='));
        token = adminCookie?.split('=')[1];
      }
    }

    if (!token) {
      return null;
    }

    return await verifyAdminToken(token);
  } catch (error) {
    console.error('Failed to get admin user:', error);
    return null;
  }
}

// Set admin token in cookies
export function setAdminCookie(token: string): void {
  if (typeof document !== 'undefined') {
    document.cookie = `admin-token=${token}; path=/; max-age=86400; secure; samesite=strict`;
  }
}

// Clear admin token from cookies
export function clearAdminCookie(): void {
  if (typeof document !== 'undefined') {
    document.cookie = 'admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}

// Middleware helper to protect admin routes
export async function requireAdmin(request: NextRequest): Promise<AdminUser | Response> {
  const adminUser = await getAdminUser(request);
  
  if (!adminUser) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized - Admin access required' }),
      { 
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
  
  return adminUser;
}

// Security helpers
export function generateSecureSession(): string {
  return crypto.randomUUID();
}

export function hashPassword(password: string): string {
  // In production, use bcrypt or similar
  // This is a simple hash for demo purposes
  return btoa(password);
}

// Rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

export function checkLoginRateLimit(ip: string): boolean {
  const now = Date.now();
  const attempts = loginAttempts.get(ip);
  
  if (!attempts) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now });
    return true;
  }
  
  // Reset counter if more than 15 minutes have passed
  if (now - attempts.lastAttempt > 15 * 60 * 1000) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now });
    return true;
  }
  
  // Allow up to 5 attempts per 15 minutes
  if (attempts.count >= 5) {
    return false;
  }
  
  attempts.count++;
  attempts.lastAttempt = now;
  return true;
}

// Admin session tracking
export interface AdminSession {
  username: string;
  ip: string;
  userAgent: string;
  loginTime: string;
  lastActivity: string;
  sessionId: string;
}

const activeSessions = new Map<string, AdminSession>();

export function createAdminSession(username: string, ip: string, userAgent: string): string {
  const sessionId = generateSecureSession();
  const now = new Date().toISOString();
  
  const session: AdminSession = {
    username,
    ip,
    userAgent,
    loginTime: now,
    lastActivity: now,
    sessionId
  };
  
  activeSessions.set(sessionId, session);
  return sessionId;
}

export function updateSessionActivity(sessionId: string): void {
  const session = activeSessions.get(sessionId);
  if (session) {
    session.lastActivity = new Date().toISOString();
  }
}

export function getActiveSessions(): AdminSession[] {
  return Array.from(activeSessions.values());
}

export function removeSession(sessionId: string): void {
  activeSessions.delete(sessionId);
}

// Clean up old sessions (call periodically)
export function cleanupOldSessions(): void {
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours
  
  for (const [sessionId, session] of activeSessions.entries()) {
    const sessionTime = new Date(session.lastActivity).getTime();
    if (now - sessionTime > maxAge) {
      activeSessions.delete(sessionId);
    }
  }
}