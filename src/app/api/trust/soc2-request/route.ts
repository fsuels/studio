import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { auditService } from '@/services/firebase-audit-service';
import { z } from 'zod';

const soc2RequestSchema = z.object({
  companyName: z.string().min(2),
  contactName: z.string().min(2),
  email: z.string().email(),
  jobTitle: z.string().min(2),
  phone: z.string().optional(),
  requestReason: z.string().min(10),
  intendedUse: z.enum([
    'vendor_assessment',
    'compliance_audit',
    'security_review',
    'other',
  ]),
  recaptchaToken: z.string(),
  timestamp: z.string(),
  userAgent: z.string(),
});

async function verifyRecaptcha(
  token: string,
  action: string,
): Promise<boolean> {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      console.error('RECAPTCHA_SECRET_KEY not configured');
      return false;
    }

    const response = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          secret: secretKey,
          response: token,
        }),
      },
    );

    const data = await response.json();

    // Check if verification was successful and score is above threshold
    if (!data.success) {
      console.error('reCAPTCHA verification failed:', data['error-codes']);
      return false;
    }

    // For reCAPTCHA v3, check the score and action
    if (data.score < 0.5) {
      console.warn('reCAPTCHA score too low:', data.score);
      return false;
    }

    if (data.action !== action) {
      console.error('reCAPTCHA action mismatch:', data.action);
      return false;
    }

    return true;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
}

async function generateRequestId(): Promise<string> {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `SOC2-${timestamp}-${random.toUpperCase()}`;
}

async function sendNotificationEmail(requestData: any): Promise<void> {
  // In production, integrate with your email service (SendGrid, SES, etc.)
  console.log('SOC 2 request notification:', {
    requestId: requestData.requestId,
    companyName: requestData.companyName,
    email: requestData.email,
  });

  // TODO: Send notification to compliance team
  // TODO: Send confirmation email to requester
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request data
    const validatedData = soc2RequestSchema.parse(body);

    // Verify reCAPTCHA
    const isRecaptchaValid = await verifyRecaptcha(
      validatedData.recaptchaToken,
      'soc2_request',
    );

    if (!isRecaptchaValid) {
      return NextResponse.json(
        { error: 'reCAPTCHA verification failed' },
        { status: 400 },
      );
    }

    // Generate unique request ID
    const requestId = await generateRequestId();

    // Prepare request data for storage
    const requestData = {
      requestId,
      companyName: validatedData.companyName,
      contactName: validatedData.contactName,
      email: validatedData.email,
      jobTitle: validatedData.jobTitle,
      phone: validatedData.phone || null,
      requestReason: validatedData.requestReason,
      intendedUse: validatedData.intendedUse,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      ipAddress:
        request.ip || request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: validatedData.userAgent,
      metadata: {
        requestSource: 'trust_center',
        version: '1.0',
      },
    };

    // Store in Firestore
    const docRef = await adminDb.collection('soc2_requests').add(requestData);

    // Log audit event
    await auditService.logComplianceEvent('soc2_request_submitted', {
      requestId,
      companyName: validatedData.companyName,
      email: validatedData.email,
      intendedUse: validatedData.intendedUse,
      firestoreDocId: docRef.id,
      ipAddress: requestData.ipAddress,
      userAgent: validatedData.userAgent,
    });

    // Send notifications (async, don't wait)
    sendNotificationEmail({ ...requestData, firestoreDocId: docRef.id }).catch(
      (error) => console.error('Failed to send notification email:', error),
    );

    return NextResponse.json({
      success: true,
      requestId,
      message: 'SOC 2 report request submitted successfully',
      estimatedDelivery: '24 hours',
    });
  } catch (error) {
    console.error('SOC 2 request API error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  // Get SOC 2 request statistics for admin dashboard
  try {
    const searchParams = request.nextUrl.searchParams;
    const adminToken = searchParams.get('admin_token');

    // Simple admin authentication (in production, use proper auth)
    if (adminToken !== process.env.ADMIN_API_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentRequestsSnapshot = await adminDb
      .collection('soc2_requests')
      .where('createdAt', '>=', thirtyDaysAgo)
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get();

    const requests = recentRequestsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate().toISOString(),
      updatedAt: doc.data().updatedAt.toDate().toISOString(),
    }));

    const stats = {
      totalRequests: requests.length,
      pendingRequests: requests.filter((r) => r.status === 'pending').length,
      completedRequests: requests.filter((r) => r.status === 'completed')
        .length,
      topCompanies: getTopCompanies(requests),
      requestsByIntendedUse: getRequestsByIntendedUse(requests),
    };

    return NextResponse.json({
      success: true,
      stats,
      recentRequests: requests.slice(0, 10), // Return 10 most recent
    });
  } catch (error) {
    console.error('SOC 2 request stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 },
    );
  }
}

function getTopCompanies(
  requests: any[],
): { companyName: string; count: number }[] {
  const companyCounts = requests.reduce(
    (acc, request) => {
      acc[request.companyName] = (acc[request.companyName] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.entries(companyCounts)
    .map(([companyName, count]) => ({ companyName, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

function getRequestsByIntendedUse(
  requests: any[],
): { use: string; count: number }[] {
  const useCounts = requests.reduce(
    (acc, request) => {
      acc[request.intendedUse] = (acc[request.intendedUse] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.entries(useCounts)
    .map(([use, count]) => ({ use, count }))
    .sort((a, b) => b.count - a.count);
}
