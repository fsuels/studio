import { getFirestore } from '@/lib/firebase-admin-optimized';
import { securityAuditLogger } from '@/lib/security-audit-logger';
import { dispatchCspAlert } from '@/lib/security/csp-alerts';

export type NormalizedCspReport = Record<string, unknown> & {
  'blocked-uri'?: string;
  'document-uri'?: string;
  'effective-directive'?: string;
  'violated-directive'?: string;
  'original-policy'?: string;
  'source-file'?: string;
  'line-number'?: unknown;
  'column-number'?: unknown;
  disposition?: unknown;
  'status-code'?: unknown;
  referrer?: string;
};

export type CspRiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type CspSeverity = 'info' | 'warning' | 'error' | 'critical';

interface PersistCspReportOptions {
  mode: 'report-only' | 'enforce';
  report: NormalizedCspReport;
  ipAddress: string;
  userAgent: string;
  referer?: string;
  userAuthenticated?: boolean;
}

interface PersistResult {
  stored: boolean;
  firestoreId?: string;
  riskLevel: CspRiskLevel;
  severity: CspSeverity;
  alertDelivered: boolean;
  alertReason?: string;
  reason?: string;
}

const RISK_KEYWORDS: Record<CspRiskLevel, string[]> = {
  critical: ['default-src', 'script-src', 'worker-src', 'object-src'],
  high: ['frame-ancestors', 'connect-src', 'frame-src'],
  medium: ['style-src', 'img-src', 'font-src'],
  low: [],
};

function pickHighestRisk(directive?: string): CspRiskLevel {
  if (!directive) return 'low';
  const normalized = directive.toLowerCase();
  if (RISK_KEYWORDS.critical.some((token) => normalized.includes(token))) {
    return 'critical';
  }
  if (RISK_KEYWORDS.high.some((token) => normalized.includes(token))) {
    return 'high';
  }
  if (RISK_KEYWORDS.medium.some((token) => normalized.includes(token))) {
    return 'medium';
  }
  return 'low';
}

function mapRiskToSeverity(riskLevel: CspRiskLevel): CspSeverity {
  switch (riskLevel) {
    case 'critical':
      return 'critical';
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    default:
      return 'info';
  }
}

async function writeToFirestore(
  data: Omit<PersistCspReportOptions, 'report'> & {
    report: NormalizedCspReport;
    riskLevel: CspRiskLevel;
    severity: CspSeverity;
  },
): Promise<string | undefined> {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON) {
    return undefined;
  }

  try {
    const firestore = await getFirestore();
    const doc = await firestore.collection('security_csp_reports').add({
      ...data.report,
      riskLevel: data.riskLevel,
      severity: data.severity,
      mode: data.mode,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      referer: data.referer ?? null,
      userAuthenticated: data.userAuthenticated ?? false,
      receivedAt: new Date().toISOString(),
      environment:
        process.env.NEXT_PUBLIC_APP_ENV ?? process.env.NODE_ENV ?? 'development',
    });
    return doc.id;
  } catch (error) {
    console.error('[csp-report] failed to persist to Firestore', { error });
    return undefined;
  }
}

function deriveThreatIndicators(report: NormalizedCspReport): string[] {
  const indicators: string[] = [];
  const blocked = report['blocked-uri'];
  if (blocked && typeof blocked === 'string') {
    if (blocked.startsWith('data:')) {
      indicators.push('blocked-data-uri');
    }
    if (blocked.startsWith('http:')) {
      indicators.push('blocked-insecure-uri');
    }
    if (blocked.includes('third-party')) {
      indicators.push('blocked-third-party');
    }
  }
  return indicators;
}

export async function persistCspReport(
  options: PersistCspReportOptions,
): Promise<PersistResult> {
  const riskLevel = pickHighestRisk(options.report['violated-directive']);
  const severity = mapRiskToSeverity(riskLevel);
  const threatIndicators = deriveThreatIndicators(options.report);

  let firestoreId: string | undefined;
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON) {
    firestoreId = await writeToFirestore({
      ...options,
      riskLevel,
      severity,
      report: options.report,
    });
  }

  await securityAuditLogger.logEvent({
    eventType: 'security_incident',
    severity,
    category: 'security',
    actor: {
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
    },
    action: 'csp_violation_reported',
    resource: {
      type: 'system',
      name: options.report['document-uri'] as string | undefined,
      path: options.report['blocked-uri'] as string | undefined,
    },
    context: {
      method: 'POST',
      endpoint: '/api/security/csp-report',
      statusCode: 204,
    },
    security: {
      riskLevel,
      threatIndicators,
      mitigationActions: ['investigate_csp_report'],
      complianceFlags:
        options.mode === 'enforce' && severity !== 'info'
          ? ['enforced-csp-violation']
          : undefined,
    },
    result: 'success',
    metadata: {
      sourceSystem: 'security-middleware',
      dataClassification: 'internal',
    },
  });

  const alertResult = await dispatchCspAlert({
    riskLevel,
    severity,
    mode: options.mode,
    blockedUri: options.report['blocked-uri'] as string | undefined,
    documentUri: options.report['document-uri'] as string | undefined,
    violatedDirective: options.report['violated-directive'] as string | undefined,
    userAgent: options.userAgent,
    ipAddress: options.ipAddress,
    firestoreId,
    environment:
      process.env.NEXT_PUBLIC_APP_ENV ?? process.env.NODE_ENV ?? 'development',
  });

  return {
    stored: Boolean(firestoreId),
    firestoreId,
    riskLevel,
    severity,
    alertDelivered: alertResult.delivered,
    alertReason: alertResult.reason,
    reason: firestoreId ? undefined : 'firestore-unavailable-or-disabled',
  };
}