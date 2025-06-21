// src/app/api/legal-updates/email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { legalUpdateEmailService } from '@/lib/legal-updates/email-service';
import { auditService } from '@/services/firebase-audit-service';

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

  try {
    // Validate authentication
    if (!validateSchedulerRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const frequency =
      (searchParams.get('frequency') as 'immediate' | 'daily' | 'weekly') ||
      'daily';

    console.log(`Starting ${frequency} legal update email digest...`);

    // Send email digest
    const results =
      await legalUpdateEmailService.sendLegalUpdateDigest(frequency);

    // Log audit event
    await auditService.logComplianceEvent('legal_update_emails_sent', {
      frequency,
      emailsSent: results.sent,
      emailsFailed: results.failed,
      processingTime: Date.now() - startTime,
      timestamp: new Date().toISOString(),
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

    // Log error event
    await auditService.logComplianceEvent('legal_update_email_error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      processingTime: Date.now() - startTime,
      timestamp: new Date().toISOString(),
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

      case 'stats':
        // Return email statistics
        const { adminDb } = await import('@/lib/firebase-admin');
        const { COLLECTIONS } = await import('@/lib/legal-updates/schema');

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const [totalUsers, emailEnabledUsers, recentEmails] = await Promise.all(
          [
            adminDb.collection(COLLECTIONS.USER_PREFERENCES).count().get(),
            adminDb
              .collection(COLLECTIONS.USER_PREFERENCES)
              .where('emailNotifications', '==', true)
              .count()
              .get(),
            adminDb
              .collection(COLLECTIONS.PROCESSED_LEGAL_UPDATES)
              .where('notificationStatus.emailSent', '==', true)
              .where('notificationStatus.emailSentAt', '>=', sevenDaysAgo)
              .count()
              .get(),
          ],
        );

        return NextResponse.json({
          statistics: {
            totalUsersWithPreferences: totalUsers.data().count,
            emailEnabledUsers: emailEnabledUsers.data().count,
            emailsSentLast7Days: recentEmails.data().count,
            timestamp: new Date().toISOString(),
          },
        });

      case 'test':
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
