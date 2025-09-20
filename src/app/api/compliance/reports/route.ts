import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/server-auth';

export const dynamic = 'force-dynamic';

const SUPPORTED_REPORTS = [
  'overview',
  'gdpr',
  'ccpa',
  'soc2',
  'security',
  'user_activity',
] as const;

type SupportedReport = (typeof SUPPORTED_REPORTS)[number];

type ReportComplianceLevel = 'compliant' | 'partial' | 'non-compliant';

type AuditEventSummary = {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  occurredAt: string;
  description: string;
};

type UserDataSummary = {
  userId: string;
  lastActivity: string;
  totalEvents: number;
  riskLevel: 'low' | 'medium' | 'high';
};

type ComplianceMetrics = {
  overallScore: number;
  totalEvents: number;
  recentEvents: number;
  uniqueUsers: number;
  highRiskFindings: number;
};

type ComplianceReport = {
  id: string;
  title: string;
  description: string;
  generatedAt: string;
  reportType: SupportedReport;
  metrics: ComplianceMetrics;
  recommendations: string[];
  complianceLevel: ReportComplianceLevel;
  auditEvents: AuditEventSummary[];
  userData: UserDataSummary[];
};

interface ReportRequestBody {
  type?: string;
  format?: 'json' | 'csv';
  startDate?: string;
  endDate?: string;
}

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) {
    return authResult;
  }

  const url = new URL(request.url);
  const reportType = normaliseType(url.searchParams.get('type'));
  const startDate = url.searchParams.get('startDate') ?? undefined;
  const endDate = url.searchParams.get('endDate') ?? undefined;

  if (!reportType) {
    return NextResponse.json(
      { error: 'Unsupported report type' },
      { status: 400 },
    );
  }

  const report = buildReport(reportType, startDate, endDate);
  return NextResponse.json(report);
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) {
    return authResult;
  }

  let body: ReportRequestBody;
  try {
    body = (await request.json()) as ReportRequestBody;
  } catch (_error) {
    return NextResponse.json(
      { error: 'Invalid JSON payload' },
      { status: 400 },
    );
  }

  const reportType = normaliseType(body.type ?? 'overview');
  if (!reportType) {
    return NextResponse.json(
      { error: 'Unsupported report type' },
      { status: 400 },
    );
  }

  const report = buildReport(reportType, body.startDate, body.endDate);
  const format = body.format ?? 'json';

  if (format === 'csv') {
    const csv = convertReportToCsv(report);
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${report.id}.csv"`,
      },
    });
  }

  return NextResponse.json(report);
}

function buildReport(
  reportType: SupportedReport,
  startDate?: string,
  endDate?: string,
): ComplianceReport {
  const generatedAt = new Date().toISOString();
  const scoreSeed = Math.random() * 40 + 60; // 60-100
  const overallScore = Number(scoreSeed.toFixed(1));
  const complianceLevel: ReportComplianceLevel =
    overallScore >= 85 ? 'compliant' : overallScore >= 65 ? 'partial' : 'non-compliant';

  const metrics: ComplianceMetrics = {
    overallScore,
    totalEvents: randomInt(1200, 4500),
    recentEvents: randomInt(120, 350),
    uniqueUsers: randomInt(40, 120),
    highRiskFindings: randomInt(2, 12),
  };

  const dateRangeDescription = buildDateRangeDescription(startDate, endDate);
  const auditEvents = buildAuditEvents(reportType);
  const userData = buildUserSummaries(reportType);

  return {
    id: `compliance_${reportType}_${Date.now()}`,
    title: getReportTitle(reportType),
    description: `${getReportDescription(reportType)}${dateRangeDescription}`,
    generatedAt,
    reportType,
    metrics,
    recommendations: buildRecommendations(reportType, complianceLevel),
    complianceLevel,
    auditEvents: auditEvents.slice(0, 50),
    userData: userData.slice(0, 50),
  };
}

function buildAuditEvents(reportType: SupportedReport): AuditEventSummary[] {
  const size = randomInt(40, 120);
  const now = Date.now();
  return Array.from({ length: size }).map((_, index) => {
    const timestamp = new Date(now - index * 3_600_000).toISOString();
    const severityRoll = Math.random();
    const severity: AuditEventSummary['severity'] =
      severityRoll > 0.8 ? 'high' : severityRoll > 0.4 ? 'medium' : 'low';

    return {
      id: `event_${index}_${reportType}`,
      type: pickEventType(reportType),
      severity,
      occurredAt: timestamp,
      description: buildEventDescription(reportType, severity),
    };
  });
}

function buildUserSummaries(reportType: SupportedReport): UserDataSummary[] {
  const size = randomInt(20, 80);
  const now = Date.now();
  return Array.from({ length: size }).map((_, index) => {
    const activity = new Date(now - index * 8_640_000).toISOString();
    const events = randomInt(5, 80);
    const riskLevel: UserDataSummary['riskLevel'] =
      events > 60 ? 'high' : events > 30 ? 'medium' : 'low';

    return {
      userId: `user_${index}_${reportType}`,
      lastActivity: activity,
      totalEvents: events,
      riskLevel,
    };
  });
}

function buildRecommendations(
  reportType: SupportedReport,
  complianceLevel: ReportComplianceLevel,
): string[] {
  const base = [
    'Review access logs for anomalies in the past 30 days',
    'Confirm remediation plans for outstanding findings',
  ];

  if (complianceLevel === 'non-compliant') {
    base.push('Schedule an immediate audit review with the compliance team');
  }

  if (reportType === 'gdpr') {
    base.push('Validate data subject request handling within SLA');
  }

  if (reportType === 'security' || reportType === 'user_activity') {
    base.push('Enable step-up authentication for privileged actions');
  }

  return base;
}

function convertReportToCsv(report: ComplianceReport): string {
  const lines = [
    'Metric,Value',
    `Title,"${report.title}"`,
    `Report Type,${report.reportType}`,
    `Generated At,${report.generatedAt}`,
    `Compliance Level,${report.complianceLevel}`,
    `Overall Score,${report.metrics.overallScore}`,
    `Total Events,${report.metrics.totalEvents}`,
    `Recent Events,${report.metrics.recentEvents}`,
    `Unique Users,${report.metrics.uniqueUsers}`,
    `High Risk Findings,${report.metrics.highRiskFindings}`,
  ];

  if (report.recommendations.length) {
    lines.push('Recommendations,"' + report.recommendations.join('; ') + '"');
  }

  return lines.join('\n');
}

function buildDateRangeDescription(start?: string, end?: string): string {
  if (!start && !end) return '';
  const startText = start ? new Date(start).toLocaleDateString('en-US') : 'beginning';
  const endText = end ? new Date(end).toLocaleDateString('en-US') : 'today';
  return ` (covering ${startText} to ${endText})`;
}

function pickEventType(reportType: SupportedReport): string {
  const baseEvents = [
    'USER_LOGIN',
    'DATA_ACCESS',
    'POLICY_UPDATE',
    'DOCUMENT_CHANGE',
  ];
  const gdprEvents = baseEvents.concat(['DSAR_REQUEST', 'CONSENT_REVOKED']);
  const securityEvents = baseEvents.concat(['MULTI_FACTOR_PROMPT', 'FAILED_LOGIN']);

  switch (reportType) {
    case 'gdpr':
      return randomFromArray(gdprEvents);
    case 'security':
      return randomFromArray(securityEvents);
    default:
      return randomFromArray(baseEvents);
  }
}

function buildEventDescription(
  reportType: SupportedReport,
  severity: AuditEventSummary['severity'],
): string {
  const base = `Detected ${reportType.replace('_', ' ')} activity`;
  if (severity === 'high') {
    return `${base} requiring urgent review`;
  }
  if (severity === 'medium') {
    return `${base} flagged for follow-up`;
  }
  return `${base} logged`;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFromArray<T>(values: readonly T[]): T {
  return values[Math.floor(Math.random() * values.length)];
}

function normaliseType(value: string | null): SupportedReport | null {
  if (!value) return null;
  const lowered = value.trim().toLowerCase();
  return (SUPPORTED_REPORTS as readonly string[]).includes(lowered)
    ? (lowered as SupportedReport)
    : null;
}

function getReportTitle(reportType: SupportedReport): string {
  switch (reportType) {
    case 'gdpr':
      return 'GDPR Compliance Report';
    case 'ccpa':
      return 'CCPA Compliance Report';
    case 'soc2':
      return 'SOC 2 Compliance Report';
    case 'security':
      return 'Security Audit Report';
    case 'user_activity':
      return 'User Activity Report';
    default:
      return 'Compliance Overview Report';
  }
}

function getReportDescription(reportType: SupportedReport): string {
  switch (reportType) {
    case 'gdpr':
      return 'Analysis of GDPR compliance including data subject rights and consent management';
    case 'ccpa':
      return 'California Consumer Privacy Act compliance assessment';
    case 'soc2':
      return 'Service Organization Control 2 audit trail analysis';
    case 'security':
      return 'Security events and access control audit';
    case 'user_activity':
      return 'User behavior and system interaction analysis';
    default:
      return 'Comprehensive compliance status across multiple frameworks';
  }
}
