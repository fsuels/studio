// src/app/api/legal-updates/email/route.ts
import { NextRequest, NextResponse } from 'next/server';

type LegalUpdateEmailService = (typeof import('@/lib/legal-updates/email-service'))['legalUpdateEmailService'];
type AuditServiceInstance = (typeof import('@/services/firebase-audit-service'))['auditService'];

const DIGEST_FREQUENCIES = ['immediate', 'daily', 'weekly'] as const;
type LegalUpdateDigestFrequency = (typeof DIGEST_FREQUENCIES)[number];
const DEFAULT_DIGEST_FREQUENCY: LegalUpdateDigestFrequency = 'daily';
const DIGEST_FREQUENCY_SET = new Set<string>(DIGEST_FREQUENCIES);

const LEGAL_UPDATE_SERVICE = {
  EMAIL_DIGEST: 'legal-updates-email',
} as const;

const LEGAL_UPDATE_EMAIL_EVENTS = {
  DIGEST_TRIGGERED: 'legal_update_digest_triggered',
  DIGEST_COMPLETED: 'legal_update_digest_completed',
  DIGEST_FAILED: 'legal_update_digest_failed',
  DIGEST_TEST_SENT: 'legal_update_digest_test_sent',
} as const;
type LegalUpdateEmailEvent =
  (typeof LEGAL_UPDATE_EMAIL_EVENTS)[keyof typeof LEGAL_UPDATE_EMAIL_EVENTS];

let emailServicePromise: Promise<LegalUpdateEmailService> | null = null;
async function getEmailService(): Promise<LegalUpdateEmailService> {
  if (!emailServicePromise) {
    emailServicePromise = import('@/lib/legal-updates/email-service').then(
      (mod) => mod.legalUpdateEmailService,
    );
  }
  return emailServicePromise;
}

let auditServicePromise: Promise<AuditServiceInstance> | null = null;
async function getAuditService(): Promise<AuditServiceInstance> {
  if (!auditServicePromise) {
    auditServicePromise = import('@/services/firebase-audit-service').then(
      (mod) => mod.auditService,
    );
  }
  return auditServicePromise;
}

function resolveDigestFrequency(
  value: string | null,
): LegalUpdateDigestFrequency {
  if (value && DIGEST_FREQUENCY_SET.has(value)) {
    return value as LegalUpdateDigestFrequency;
  }
  return DEFAULT_DIGEST_FREQUENCY;
}

async function logEmailDigestEvent(
  event: LegalUpdateEmailEvent,
  metadata: Record<string, unknown>,
): Promise<void> {
  try {
    const audit = await getAuditService();
    await audit.logEvent(event, {
      ...metadata,
      service: LEGAL_UPDATE_SERVICE.EMAIL_DIGEST,
      timestamp: new Date().toISOString(),
    });
  } catch (loggingError) {
    console.error('Failed to log legal update email event:', loggingError);
  }
}

// Authentication helper
function validateSchedulerRequest(request: NextRequest): boolean {
  // For Cloud Scheduler requests, validate the header
  const schedulerToken = request.headers.get('x-scheduler-token');
  const expectedToken = process.env.CLOUD_SCHEDULER_TOKEN;

  if (expectedToken && schedulerToken === expectedToken) {
    return true;
  }

  // For manual admin requests, validate admin token
  const authHeader = request.headers.get('authorization');
  const adminToken = authHeader?.replace('Bearer ', '');
  const expectedAdminToken = process.env.ADMIN_API_TOKEN;

  return adminToken === expectedAdminToken;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const searchParams = request.nextUrl.searchParams;
  const frequency = resolveDigestFrequency(searchParams.get('frequency'));

  try {
    // Validate authentication
    if (!validateSchedulerRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log(`Starting ${frequency} legal update email digest...`);

    await logEmailDigestEvent(LEGAL_UPDATE_EMAIL_EVENTS.DIGEST_TRIGGERED, {
      frequency,
    });

    const emailService = await getEmailService();
    const results = await emailService.sendLegalUpdateDigest(frequency);

    await logEmailDigestEvent(LEGAL_UPDATE_EMAIL_EVENTS.DIGEST_COMPLETED, {
      frequency,
      emailsSent: results.sent,
      emailsFailed: results.failed,
      processingTime: Date.now() - startTime,
    });

    console.log(
      `${frequency} email digest complete: ${results.sent} sent, ${results.failed} failed`,
    );

    return NextResponse.json({
      success: true,
      frequency,
      timestamp: new Date().toISOString(),
      results: {
        sent: results.sent,
        failed: results.failed,
        total: results.sent + results.failed,
      },
      processingTime: Date.now() - startTime,
    });
  } catch (error) {
    console.error('Legal update email API error:', error);

    await logEmailDigestEvent(LEGAL_UPDATE_EMAIL_EVENTS.DIGEST_FAILED, {
      error: error instanceof Error ? error.message : 'Unknown error',
      frequency,
      processingTime: Date.now() - startTime,
    });

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');
    const adminToken = searchParams.get('admin_token');

    if (adminToken !== process.env.ADMIN_API_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    switch (action) {
      case 'status':
        return NextResponse.json({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          service: 'legal-updates-email',
          sendgridConfigured: !!process.env.SENDGRID_API_KEY,
        });

      case 'stats': {
        // Return email statistics
        const { getAdmin } = await import('@/lib/firebase-admin');
        const { COLLECTIONS } = await import('@/lib/legal-updates/schema');
        const db = getAdmin().firestore();

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const [totalUsers, emailEnabledUsers, recentEmails] = await Promise.all([
          db.collection(COLLECTIONS.USER_PREFERENCES).count().get(),
          db
            .collection(COLLECTIONS.USER_PREFERENCES)
            .where('emailNotifications', '==', true)
            .count()
            .get(),
          db
            .collection(COLLECTIONS.PROCESSED_LEGAL_UPDATES)
            .where('notificationStatus.emailSent', '==', true)
            .where('notificationStatus.emailSentAt', '>=', sevenDaysAgo)
            .count()
            .get(),
        ]);

        return NextResponse.json({
          statistics: {
            totalUsersWithPreferences: totalUsers.data().count,
            emailEnabledUsers: emailEnabledUsers.data().count,
            emailsSentLast7Days: recentEmails.data().count,
            timestamp: new Date().toISOString(),
          },
        });
      }

      case 'test': {
        // Send test email to admin
        const testEmail = searchParams.get('email');
        if (!testEmail) {
          return NextResponse.json(
            { error: 'Test email address required' },
            { status: 400 },
          );
        }

        // Create test email content
        const testResult =
          await legalUpdateEmailService.sendLegalUpdateDigest('daily');

        return NextResponse.json({
          message: 'Test email functionality executed',
          testResult,
          timestamp: new Date().toISOString(),
        });
      }

      default:
        return NextResponse.json({
          message: 'Legal Updates Email API',
          actions: ['status', 'stats', 'test'],
          endpoints: {
            'POST /': 'Send email digest (requires scheduler token)',
            'GET /?action=status': 'Health check',
            'GET /?action=stats': 'Email statistics',
            'GET /?action=test&email=test@example.com':
              'Test email functionality',
          },
          timestamp: new Date().toISOString(),
        });
    }
  } catch (error) {
    console.error('Legal updates email API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
