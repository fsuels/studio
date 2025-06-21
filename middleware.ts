import { NextRequest, NextResponse } from 'next/server';
import { tenantMiddleware } from '@/middleware/tenant';

export async function middleware(request: NextRequest) {
  // Handle tenant routing first
  const tenantResponse = await tenantMiddleware(request);
  
  // If tenant middleware returned a redirect or rewrite, use it
  if (tenantResponse.headers.get('x-middleware-rewrite') || 
      tenantResponse.headers.get('x-middleware-redirect') ||
      tenantResponse.status !== 200) {
    return tenantResponse;
  }

  // Add security headers for all requests
  const response = tenantResponse;
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // CSP header (adjust based on your needs)
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googletagmanager.com *.google-analytics.com *.stripe.com *.intercom.io",
    "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
    "font-src 'self' fonts.gstatic.com",
    "img-src 'self' data: blob: *.googleusercontent.com *.stripe.com *.intercom.io",
    "connect-src 'self' *.firebase.googleapis.com *.stripe.com *.intercom.io wss://*.intercom.io",
    "frame-src 'self' *.stripe.com *.intercom.io",
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', cspHeader);
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes - these are handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};