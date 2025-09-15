// Admin authentication API
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';
import {
  validateAdminCredentials,
  createAdminToken,
  verifyAdminToken,
  checkLoginRateLimit,
  createAdminSession,
} from '@/lib/admin-auth';
import { getClientIP } from '@/lib/geolocation';

// Admin login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, action } = body;
    const clientIP = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';

    if (action === 'login') {
      // Check rate limiting
      if (!checkLoginRateLimit(clientIP)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Too many login attempts. Please try again in 15 minutes.',
          },
          { status: 429 },
        );
      }

      // Validate credentials
      if (!validateAdminCredentials(username, password)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid username or password',
          },
          { status: 401 },
        );
      }

      // Create JWT token
      const token = await createAdminToken(username);

      // Create session
      const sessionId = createAdminSession(username, clientIP, userAgent);

      // Log successful login
      console.log(
        `Admin login successful: ${username} from ${clientIP} at ${new Date().toISOString()}`,
      );

      // Set HTTP-only cookie
      const response = NextResponse.json({
        success: true,
        user: {
          username,
          role: 'admin',
          loginTime: new Date().toISOString(),
          sessionId,
        },
        message: 'Login successful',
      });

      response.cookies.set('admin-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60, // 24 hours
        path: '/',
      });

      return response;
    }

    if (action === 'logout') {
      // Clear the cookie
      const response = NextResponse.json({
        success: true,
        message: 'Logged out successfully',
      });

      response.cookies.set('admin-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,
        path: '/',
      });

      console.log(
        `Admin logout: ${username} from ${clientIP} at ${new Date().toISOString()}`,
      );

      return response;
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 },
    );
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 },
    );
  }
}

// Check admin authentication status
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value;

    if (!token) {
      return NextResponse.json({
        success: false,
        authenticated: false,
        error: 'No token found',
      });
    }

    const adminUser = await verifyAdminToken(token);

    if (!adminUser) {
      return NextResponse.json({
        success: false,
        authenticated: false,
        error: 'Invalid token',
      });
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: adminUser,
    });
  } catch (error) {
    console.error('Admin auth check error:', error);
    return NextResponse.json({
      success: false,
      authenticated: false,
      error: 'Authentication check failed',
    });
  }
}
