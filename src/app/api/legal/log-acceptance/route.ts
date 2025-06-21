// src/app/api/legal/log-acceptance/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auditService } from '@/services/firebase-audit-service';

interface TermsAcceptance {
  userId?: string;
  ip?: string;
  termsVersion: string;
  state?: string;
  timestamp: Date;
  scrolledToBottom: boolean;
  documentType: string;
  userAgent?: string;
  sessionId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      ip,
      termsVersion,
      state,
      timestamp,
      scrolledToBottom,
      documentType,
    } = body;

    // Get additional tracking data
    const userAgent = request.headers.get('user-agent') || '';
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = forwardedFor?.split(',')[0] || realIp || ip || 'unknown';

    const acceptanceRecord: TermsAcceptance = {
      userId: userId || 'anonymous',
      ip: clientIp,
      termsVersion,
      state,
      timestamp: new Date(timestamp),
      scrolledToBottom,
      documentType,
      userAgent,
      sessionId: generateSessionId(),
    };

    // Log the acceptance for legal compliance
    await logTermsAcceptance(acceptanceRecord);

    // Additional compliance checks
    const complianceChecks = await performComplianceChecks(acceptanceRecord);

    return NextResponse.json({
      success: true,
      acceptanceId: acceptanceRecord.sessionId,
      complianceStatus: complianceChecks,
      message: 'Terms acceptance logged successfully',
    });
  } catch (error) {
    console.error('Failed to log terms acceptance:', error);
    return NextResponse.json(
      { error: 'Failed to log acceptance' },
      { status: 500 },
    );
  }
}

async function logTermsAcceptance(acceptance: TermsAcceptance): Promise<void> {
  try {
    // Log to our immutable audit trail
    await auditService.logComplianceEvent('terms_accepted', {
      termsVersion: acceptance.termsVersion,
      documentType: acceptance.documentType,
      state: acceptance.state,
      scrolledToBottom: acceptance.scrolledToBottom,
      ipAddress: acceptance.ip,
      userAgent: acceptance.userAgent,
      sessionId: acceptance.sessionId,
      timestamp: acceptance.timestamp.toISOString(),
      compliantLogging: true,
    });

    console.log('Terms Acceptance Logged to Audit Trail:', {
      userId: acceptance.userId,
      termsVersion: acceptance.termsVersion,
      documentType: acceptance.documentType,
      timestamp: acceptance.timestamp,
    });
  } catch (error) {
    console.error('Failed to log to audit trail:', error);
    // Fallback to console logging
    const logEntry = {
      ...acceptance,
      loggedAt: new Date().toISOString(),
      compliantLogging: true,
    };
    console.log(
      'Fallback Terms Acceptance Log:',
      JSON.stringify(logEntry, null, 2),
    );
  }
}

async function performComplianceChecks(acceptance: TermsAcceptance): Promise<{
  uplCompliant: boolean;
  ncCompliant: boolean;
  ftcCompliant: boolean;
  issues: string[];
}> {
  const issues: string[] = [];
  let uplCompliant = true;
  let ncCompliant = true;
  let ftcCompliant = true;

  // UPL Compliance Check
  if (!acceptance.termsVersion || acceptance.termsVersion.length === 0) {
    issues.push('Missing terms version for UPL compliance');
    uplCompliant = false;
  }

  // North Carolina Specific Compliance
  if (acceptance.state === 'NC') {
    // Check for NC-specific requirements
    if (
      acceptance.documentType &&
      isLegalAdviceDocument(acceptance.documentType)
    ) {
      issues.push(
        'NC residents require additional disclaimers for legal advice documents',
      );
      ncCompliant = false;
    }
  }

  // FTC Compliance Check
  if (!acceptance.scrolledToBottom) {
    issues.push(
      'User may not have had reasonable opportunity to read terms (FTC requirement)',
    );
    ftcCompliant = false;
  }

  // IP and User Agent Check
  if (!acceptance.ip || acceptance.ip === 'unknown') {
    issues.push(
      'Unable to verify user location for jurisdiction-specific compliance',
    );
  }

  return {
    uplCompliant,
    ncCompliant,
    ftcCompliant,
    issues,
  };
}

function isLegalAdviceDocument(documentType: string): boolean {
  // Documents that might be considered "legal advice" requiring extra disclaimers
  const legalAdviceDocuments = [
    'contract',
    'agreement',
    'legal_opinion',
    'legal_brief',
    'court_filing',
    'will',
    'trust',
    'power_of_attorney',
  ];

  return legalAdviceDocuments.some((type) =>
    documentType.toLowerCase().includes(type.toLowerCase()),
  );
}

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Optional: File-based logging fallback
async function logToFile(logEntry: any): Promise<void> {
  // In production environment, you might want to log to a file
  // This is a placeholder for file-based logging
  console.log('Fallback file logging would save:', logEntry);
}
