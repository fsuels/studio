// src/app/api/compliance/test-integrity/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/server-auth';
import { auditService } from '@/services/firebase-audit-service';
import { AuditEventManager } from '@/lib/immutable-audit-trail';

interface IntegrityTestResult {
  testName: string;
  passed: boolean;
  message: string;
  details?: any;
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    const user = authResult;

    const body = await request.json();
    const { testType = 'full' } = body;

    console.log(
      `Running integrity tests for user ${user.uid}, type: ${testType}`,
    );

    const results: IntegrityTestResult[] = [];

    // Test 1: Create test events
    if (testType === 'full' || testType === 'creation') {
      try {
        await auditService.logComplianceEvent('consent_given', {
          consentType: 'integrity_test',
          testData: 'test_event_' + Date.now(),
          userId: user.uid,
        });

        results.push({
          testName: 'Event Creation',
          passed: true,
          message: 'Successfully created test audit event',
        });
      } catch (error) {
        results.push({
          testName: 'Event Creation',
          passed: false,
          message: 'Failed to create test audit event',
          details: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Test 2: Retrieve and verify user events
    if (testType === 'full' || testType === 'retrieval') {
      try {
        const events = await auditService.getUserAuditTrail(user.uid, 10);

        results.push({
          testName: 'Event Retrieval',
          passed: events.length > 0,
          message: `Retrieved ${events.length} events from audit trail`,
          details: { eventCount: events.length },
        });
      } catch (error) {
        results.push({
          testName: 'Event Retrieval',
          passed: false,
          message: 'Failed to retrieve audit events',
          details: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Test 3: Verify integrity
    if (testType === 'full' || testType === 'verification') {
      try {
        const events = await auditService.getUserAuditTrail(user.uid, 50);

        if (events.length > 0) {
          const isValid = await auditService.verifyIntegrity(events);

          results.push({
            testName: 'Integrity Verification',
            passed: isValid,
            message: isValid
              ? 'Audit trail integrity verified successfully'
              : 'Integrity verification failed - potential tampering detected',
            details: {
              eventsVerified: events.length,
              integrityValid: isValid,
            },
          });
        } else {
          results.push({
            testName: 'Integrity Verification',
            passed: false,
            message: 'No events available for integrity verification',
          });
        }
      } catch (error) {
        results.push({
          testName: 'Integrity Verification',
          passed: false,
          message: 'Failed to verify integrity',
          details: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Test 4: Hash consistency
    if (testType === 'full' || testType === 'hashing') {
      try {
        const auditManager = new AuditEventManager();

        // Create a test event and verify its hash
        const testEvent = auditManager.createEvent(
          'SYSTEM_TEST' as any,
          user.uid,
          { testData: 'hash_test_' + Date.now() },
        );

        const hasValidHash =
          testEvent.hash &&
          typeof testEvent.hash === 'string' &&
          testEvent.hash.length > 0;

        results.push({
          testName: 'Hash Generation',
          passed: hasValidHash,
          message: hasValidHash
            ? 'Event hash generated successfully'
            : 'Event hash generation failed',
          details: {
            hashPresent: !!testEvent.hash,
            hashLength: testEvent.hash?.length || 0,
          },
        });
      } catch (error) {
        results.push({
          testName: 'Hash Generation',
          passed: false,
          message: 'Failed to test hash generation',
          details: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Test 5: Export functionality
    if (testType === 'full' || testType === 'export') {
      try {
        const exportData = await auditService.exportUserData(user.uid);

        const hasData =
          exportData && typeof exportData === 'string' && exportData.length > 0;

        results.push({
          testName: 'Data Export',
          passed: hasData,
          message: hasData
            ? 'User data export successful'
            : 'User data export failed or returned empty',
          details: {
            exportSize: exportData?.length || 0,
            hasContent: hasData,
          },
        });
      } catch (error) {
        results.push({
          testName: 'Data Export',
          passed: false,
          message: 'Failed to test data export',
          details: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Calculate overall test results
    const totalTests = results.length;
    const passedTests = results.filter((r) => r.passed).length;
    const overallPassed = passedTests === totalTests;

    const response = {
      testSuite: 'Audit Trail Integrity Tests',
      executedAt: new Date().toISOString(),
      userId: user.uid,
      testType,
      summary: {
        totalTests,
        passedTests,
        failedTests: totalTests - passedTests,
        overallPassed,
        successRate: `${Math.round((passedTests / totalTests) * 100)}%`,
      },
      results,
      recommendations: generateRecommendations(results),
    };

    // Log the test execution
    await auditService.logComplianceEvent('consent_given', {
      consentType: 'integrity_test_completed',
      testType,
      totalTests,
      passedTests,
      overallPassed,
      testResults: results.map((r) => ({ name: r.testName, passed: r.passed })),
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Integrity test error:', error);
    return NextResponse.json(
      {
        error: 'Failed to run integrity tests',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

function generateRecommendations(results: IntegrityTestResult[]): string[] {
  const recommendations: string[] = [];

  const failedTests = results.filter((r) => !r.passed);

  if (failedTests.length === 0) {
    recommendations.push(
      '✅ All integrity tests passed - your audit trail is functioning correctly',
    );
    return recommendations;
  }

  failedTests.forEach((test) => {
    switch (test.testName) {
      case 'Event Creation':
        recommendations.push(
          '🔧 Check Firestore permissions and audit service configuration',
        );
        break;
      case 'Event Retrieval':
        recommendations.push(
          '🔧 Verify database connectivity and query permissions',
        );
        break;
      case 'Integrity Verification':
        recommendations.push(
          '⚠️ Critical: Audit trail integrity compromised - investigate immediately',
        );
        break;
      case 'Hash Generation':
        recommendations.push(
          '🔧 Check cryptographic functions and audit event manager',
        );
        break;
      case 'Data Export':
        recommendations.push(
          '🔧 Verify export functionality and data access permissions',
        );
        break;
    }
  });

  if (failedTests.length > 2) {
    recommendations.push(
      '🚨 Multiple critical failures detected - contact system administrator',
    );
  }

  return recommendations;
}

// GET endpoint for test status/information
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;

    return NextResponse.json({
      availableTests: [
        {
          id: 'full',
          name: 'Full Integrity Test Suite',
          description: 'Runs all available integrity tests',
        },
        {
          id: 'creation',
          name: 'Event Creation Test',
          description: 'Tests audit event creation',
        },
        {
          id: 'retrieval',
          name: 'Event Retrieval Test',
          description: 'Tests audit event retrieval',
        },
        {
          id: 'verification',
          name: 'Integrity Verification Test',
          description: 'Tests cryptographic integrity',
        },
        {
          id: 'hashing',
          name: 'Hash Generation Test',
          description: 'Tests event hash generation',
        },
        {
          id: 'export',
          name: 'Data Export Test',
          description: 'Tests data export functionality',
        },
      ],
      recommendations: [
        'Run integrity tests regularly (weekly or monthly)',
        'Monitor test results for any failures',
        'Contact support if integrity verification fails',
        'Keep audit trail export functionality tested',
      ],
    });
  } catch (error) {
    console.error('Test info error:', error);
    return NextResponse.json(
      { error: 'Failed to get test information' },
      { status: 500 },
    );
  }
}
