import { NextRequest, NextResponse } from 'next/server';
import { tenantMiddleware } from '@/middleware/tenant';
import { getAdminUser } from '@/lib/admin-auth';

const supportedLocales = ['en', 'es'] as const;
const defaultLocale = 'en' as const;
type SupportedLocale = typeof supportedLocales[number];

function isSupportedLocale(locale: string): locale is SupportedLocale {
  return (supportedLocales as readonly string[]).includes(locale);
}

function detectLocale(request: NextRequest): SupportedLocale {
  const pathname = request.nextUrl.pathname;
  const acceptLanguage = request.headers.get('accept-language');

  if (acceptLanguage) {
    for (const locale of supportedLocales) {
      if (acceptLanguage.includes(locale)) {
        return locale;
      }
    }
  }

  const firstSegment = pathname.split('/')[1];
  if (firstSegment && isSupportedLocale(firstSegment)) {
    return firstSegment;
  }

  return defaultLocale;
}

function ensureLocaleRedirect(request: NextRequest): NextResponse | null {
  const pathname = request.nextUrl.pathname || '/';

  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.startsWith('/admin') ||
    pathname.includes('.')
  ) {
    return null;
  }

  const missingLocale = supportedLocales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  if (!missingLocale) {
    return null;
  }

  const locale = detectLocale(request);
  const redirectUrl = new URL(
    `/${locale}${pathname === '/' ? '' : pathname}`,
    request.url,
  );

  redirectUrl.search = request.nextUrl.search;

  const response = NextResponse.redirect(redirectUrl);
  applySecurityHeaders(request, response);
  return response;
}

async function handleAdminRoute(request: NextRequest): Promise<NextResponse | null> {
  const pathname = request.nextUrl.pathname;

  if (!pathname.startsWith('/admin')) {
    return null;
  }

  if (pathname === '/admin') {
    const response = NextResponse.next();
    applySecurityHeaders(request, response);
    return response;
  }

  const adminUser = await getAdminUser(request);

  if (!adminUser) {
    const redirectResponse = NextResponse.redirect(new URL('/admin', request.url));
    applySecurityHeaders(request, redirectResponse);
    return redirectResponse;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-admin-user', JSON.stringify(adminUser));

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  applySecurityHeaders(request, response);
  return response;
}

const SECURITY_MODE = (process.env.SECURITY_HEADER_MODE ?? 'report-only').toLowerCase();
const REPORT_GROUP = 'csp-endpoint';
const VALID_MODES = new Set(['report-only', 'enforce']);

function resolveSecurityMode(): 'report-only' | 'enforce' {
  if (VALID_MODES.has(SECURITY_MODE)) {
    return SECURITY_MODE as 'report-only' | 'enforce';
  }
  return 'report-only';
}

function buildReportEndpoint(request: NextRequest): string {
  const configured = process.env.NEXT_PUBLIC_CSP_REPORT_URL ?? '/api/security/csp-report';
  if (configured.startsWith('http://') || configured.startsWith('https://')) {
    return configured;
  }

  const hasLeadingSlash = configured.startsWith('/');
  const path = hasLeadingSlash ? configured : `/${configured}`;
  return `${request.nextUrl.origin}${path}`;
}

function applySecurityHeaders(request: NextRequest, response: NextResponse) {
  const mode = resolveSecurityMode();
  const isEnforce = mode === 'enforce';
  const reportEndpoint = buildReportEndpoint(request);

  const baseHeaders: Record<string, string> = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-XSS-Protection': '1; mode=block',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'X-DNS-Prefetch-Control': 'off',
    'X-Permitted-Cross-Domain-Policies': 'none',
    'X-Download-Options': 'noopen',
    'Origin-Agent-Cluster': '?1',
  };

  Object.entries(baseHeaders).forEach(([header, value]) => {
    response.headers.set(header, value);
  });

  if (isEnforce) {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload',
    );
  } else {
    response.headers.delete('Strict-Transport-Security');
  }

  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data: *.googletagmanager.com *.google-analytics.com *.stripe.com *.intercom.io *.googleapis.com *.gstatic.com",
    "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
    "font-src 'self' fonts.gstatic.com data:",
    "img-src 'self' data: blob: *.googleusercontent.com *.stripe.com *.intercom.io cdn.simpleicons.org picsum.photos",
    "connect-src 'self' blob: data: *.firebase.googleapis.com *.firebaseapp.com *.googleapis.com identitytoolkit.googleapis.com securetoken.googleapis.com www.googleapis.com *.stripe.com *.intercom.io wss://*.intercom.io",
    "frame-src 'self' blob: data: *.stripe.com *.intercom.io *.firebaseapp.com *.googleapis.com",
    "object-src 'none'",
    "worker-src 'self' blob: data:",
    `report-uri ${reportEndpoint}`,
    `report-to ${REPORT_GROUP}`,
  ];

  const cspValue = cspDirectives.join('; ');

  if (isEnforce) {
    response.headers.set('Content-Security-Policy', cspValue);
    response.headers.delete('Content-Security-Policy-Report-Only');
    response.headers.delete('Report-To');
    response.headers.delete('NEL');
  } else {
    response.headers.set('Content-Security-Policy-Report-Only', cspValue);
    response.headers.set(
      'Report-To',
      JSON.stringify({
        group: REPORT_GROUP,
        max_age: 108864,
        endpoints: [{ url: reportEndpoint }],
        include_subdomains: true,
      }),
    );
    response.headers.set(
      'NEL',
      JSON.stringify({
        report_to: REPORT_GROUP,
        max_age: 108864,
        failure_fraction: 0.05,
        success_fraction: 0,
      }),
    );
    response.headers.delete('Content-Security-Policy');
  }
}

export async function middleware(request: NextRequest) {
  const localeRedirect = ensureLocaleRedirect(request);
  if (localeRedirect) {
    return localeRedirect;
  }

  const adminResponse = await handleAdminRoute(request);
  if (adminResponse) {
    return adminResponse;
  }

  const tenantResponse = await tenantMiddleware(request);

  if (
    tenantResponse.headers.get('x-middleware-rewrite') ||
    tenantResponse.headers.get('x-middleware-redirect')
  ) {
    applySecurityHeaders(request, tenantResponse);
    return tenantResponse;
  }

  if (tenantResponse.status !== 200) {
    applySecurityHeaders(request, tenantResponse);
    return tenantResponse;
  }

  const response = tenantResponse;
  applySecurityHeaders(request, response);

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|_vercel|favicon.ico|forms|images|templates).*)',
  ],
};