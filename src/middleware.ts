// Enhanced middleware for admin route protection + i18n routing
import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/admin-auth';

const supportedLocales = ['en', 'es'] as const;
const defaultLocale = 'en' as const;

function getLocaleFromRequest(request: NextRequest): string {
  // Extract locale from pathname
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = supportedLocales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    // Try to detect from Accept-Language header
    const acceptLanguage = request.headers.get('accept-language');
    if (acceptLanguage) {
      for (const locale of supportedLocales) {
        if (acceptLanguage.includes(locale)) {
          return locale;
        }
      }
    }
    return defaultLocale;
  }

  // Extract locale from path
  const locale = pathname.split('/')[1];
  return supportedLocales.includes(locale as any) ? locale : defaultLocale;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Handle i18n routing for non-admin, non-API routes
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api') && !pathname.startsWith('/_next')) {
    const pathnameIsMissingLocale = supportedLocales.every(
      (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
      const locale = getLocaleFromRequest(request);
      const redirectUrl = new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url);
      
      // Preserve query parameters
      redirectUrl.search = request.nextUrl.search;
      
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Admin route protection
  if (pathname.startsWith('/admin')) {
    // Allow access to the login page
    if (pathname === '/admin') {
      return NextResponse.next();
    }

    // Check authentication for all other admin routes
    const adminUser = await getAdminUser(request);
    
    if (!adminUser) {
      // Redirect to admin login
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    // Add admin user info to headers for downstream use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-admin-user', JSON.stringify(adminUser));
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, _vercel)
    '/((?!_next|_vercel|.*\\..*).*)',
    // Include admin paths
    '/admin/:path*',
  ],
};