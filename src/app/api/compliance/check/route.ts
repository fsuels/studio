// API route for compliance checking
// Returns whether user can purchase based on their location

import { NextRequest, NextResponse } from 'next/server';
import { checkUserCompliance, complianceMonitor } from '@/lib/compliance';
import { getClientIP } from '@/lib/geolocation';
import { ratelimit } from '@/lib/ratelimit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting to prevent abuse
    const identifier = getClientIP(request);
    const { success } = await ratelimit.limit(identifier);

    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    // Get user information
    const userIP = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Get session ID from request body or generate one
    const body = await request.json();
    const sessionId = body.sessionId || crypto.randomUUID();
    const mockState = body.mockState; // For development/testing
    const bypassGeoblock = body.bypassGeoblock; // For admin use

    // Check compliance
    const result = await checkUserCompliance({
      userIP,
      sessionId,
      userAgent,
      bypassGeoblock,
      mockState,
    });

    // Log compliance event
    complianceMonitor.addEvent(result.complianceEvent);

    // Return compliance result
    return NextResponse.json({
      success: true,
      compliance: {
        allowed: result.allowed,
        riskLevel: result.riskLevel,
        disclaimerLevel: result.disclaimerLevel,
        reason: result.reason,
        requirements: result.requirements,
        recommendations: result.recommendations,
        waitlistEligible: result.waitlistEligible,
        location: {
          state: result.location.state,
          stateCode: result.location.stateCode,
          country: result.location.country,
          confidence: result.location.confidence,
        },
      },
    });
  } catch (error) {
    console.error('Compliance check error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Compliance check failed',
        compliance: {
          allowed: false,
          riskLevel: 'red',
          disclaimerLevel: 'strict',
          reason: 'System error - purchase blocked for safety',
          requirements: ['Contact support'],
          waitlistEligible: true,
        },
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Simple health check endpoint
    const userIP = getClientIP(request);

    return NextResponse.json({
      success: true,
      message: 'Compliance service operational',
      clientIP: userIP,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Service unavailable' },
      { status: 503 },
    );
  }
}
