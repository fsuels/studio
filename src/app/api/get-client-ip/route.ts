// src/app/api/get-client-ip/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get client IP from various headers (in order of preference)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare
    const xVercelForwardedFor = request.headers.get('x-vercel-forwarded-for'); // Vercel

    // Parse the IP address
    let clientIp = 'unknown';

    if (cfConnectingIp) {
      clientIp = cfConnectingIp;
    } else if (xVercelForwardedFor) {
      clientIp = xVercelForwardedFor;
    } else if (forwardedFor) {
      // X-Forwarded-For can contain multiple IPs, take the first one
      clientIp = forwardedFor.split(',')[0].trim();
    } else if (realIp) {
      clientIp = realIp;
    }

    // Additional metadata for compliance logging
    const metadata = {
      userAgent: request.headers.get('user-agent') || '',
      acceptLanguage: request.headers.get('accept-language') || '',
      referer: request.headers.get('referer') || '',
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      ip: clientIp,
      metadata,
      success: true,
    });
  } catch (error) {
    console.error('Failed to get client IP:', error);
    return NextResponse.json(
      {
        ip: 'unknown',
        error: 'Failed to determine client IP',
        success: false,
      },
      { status: 500 },
    );
  }
}
