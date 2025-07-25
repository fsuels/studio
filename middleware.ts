import { NextRequest, NextResponse } from 'next/server';
import { tenantMiddleware } from '@/middleware/tenant';

export async function middleware(request: NextRequest) {
  // Handle Firebase Auth action redirects first
  if (request.nextUrl.pathname === '/__/auth/action') {
    const mode = request.nextUrl.searchParams.get('mode');
    const oobCode = request.nextUrl.searchParams.get('oobCode');
    const continueUrl = request.nextUrl.searchParams.get('continueUrl');
    const lang = request.nextUrl.searchParams.get('lang') || 'en';
    
    // Determine locale
    const locale = lang === 'es' ? 'es' : 'en';
    
    // Build redirect URL
    const redirectUrl = new URL(`/${locale}/auth/action`, request.url);
    if (mode) redirectUrl.searchParams.set('mode', mode);
    if (oobCode) redirectUrl.searchParams.set('oobCode', oobCode);
    if (continueUrl) redirectUrl.searchParams.set('continueUrl', continueUrl);
    
    console.log('🔥 Firebase Auth Action Redirect:', {
      from: request.nextUrl.href,
      to: redirectUrl.href,
      mode,
      locale
    });
    
    return NextResponse.redirect(redirectUrl);
  }

  // Handle tenant routing
  const tenantResponse = await tenantMiddleware(request);

  // If tenant middleware returned a redirect or rewrite, use it
  if (
    tenantResponse.headers.get('x-middleware-rewrite') ||
    tenantResponse.headers.get('x-middleware-redirect') ||
    tenantResponse.status !== 200
  ) {
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
  // More permissive CSP for Firebase Auth and PDF.js compatibility
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data: *.googletagmanager.com *.google-analytics.com *.stripe.com *.intercom.io *.googleapis.com *.gstatic.com",
    "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
    "font-src 'self' fonts.gstatic.com data:",
    "img-src 'self' data: blob: *.googleusercontent.com *.stripe.com *.intercom.io cdn.simpleicons.org picsum.photos",
    "connect-src 'self' blob: data: *.firebase.googleapis.com *.firebaseapp.com *.googleapis.com identitytoolkit.googleapis.com securetoken.googleapis.com www.googleapis.com *.stripe.com *.intercom.io wss://*.intercom.io",
    "frame-src 'self' blob: data: *.stripe.com *.intercom.io *.firebaseapp.com *.googleapis.com",
    "object-src 'self' blob: data:",
    "worker-src 'self' blob: data:",
  ].join('; ');

  // Only apply CSP in production or when explicitly enabled (and not explicitly disabled for dev)
  // TEMPORARY: Disable CSP for PDF rendering compatibility
  const shouldApplyCSP = false; // Disable CSP temporarily for PDF.js compatibility
  // const shouldApplyCSP = (process.env.NODE_ENV === 'production' || process.env.ENABLE_CSP === 'true') && 
  //                        process.env.DISABLE_CSP_DEV !== 'true';
  
  console.log('🔒 CSP Middleware:', { 
    path: request.nextUrl.pathname, 
    shouldApplyCSP, 
    nodeEnv: process.env.NODE_ENV 
  });
  
  if (shouldApplyCSP) {
    response.headers.set('Content-Security-Policy', cspHeader);
    console.log('🔒 CSP Header applied');
  } else {
    console.log('🔓 CSP Header NOT applied (disabled for PDF compatibility)');
  }

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
     * - forms (PDF forms)
     * - images (image files)
     * - templates (template files)
     * Files with extensions are also handled by tenant middleware
     */
    '/((?!api|_next/static|_next/image|favicon.ico|forms|images|templates).*)',
  ],
};
