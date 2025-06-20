// Middleware for admin route protection
import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/admin-auth';

export async function middleware(request: NextRequest) {
  // Only protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to the login page
    if (request.nextUrl.pathname === '/admin') {
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
    '/admin/:path*',
  ],
};