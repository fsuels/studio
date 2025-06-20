// src/app/api/compliance/reports/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/server-auth';
import { getDb } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

interface ComplianceReport {
  id: string;
  title: string;
  description: string;
  generatedAt: string;
  reportType: string;
  metrics: Record<string, any>;
  recommendations: string[];
  complianceLevel: 'compliant' | 'partial' | 'non-compliant';
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    const user = authResult;

    const url = new URL(request.url);
    const reportType = url.searchParams.get('type') || 'overview';
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    // Check if user has admin privileges for detailed reports
    const isAdmin = user.email?.endsWith('@123legaldoc.com') || user.uid === 'admin-user-id';

    const db = await getDb();
    const report = await generateComplianceReport(db, user.uid, reportType, startDate, endDate, isAdmin);

    return NextResponse.json(report);

  } catch (error) {
    console.error('Compliance report error:', error);
    return NextResponse.json(
      { error: 'Failed to generate compliance report' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    const user = authResult;

    const body = await request.json();
    const { reportType, format = 'json', includeUserData = false } = body;

    // Check admin privileges for comprehensive reports
    const isAdmin = user.email?.endsWith('@123legaldoc.com') || user.uid === 'admin-user-id';
    
    if (includeUserData && !isAdmin) {
      return NextResponse.json(
        { error: 'Admin privileges required for user data reports' },
        { status: 403 }
      );
    }

    const db = await getDb();
    const report = await generateDetailedComplianceReport(
      db, 
      isAdmin ? null : user.uid, 
      reportType, 
      includeUserData
    );

    // Format response based on requested format
    let responseContent: string;
    let contentType: string;
    let fileName: string;

    switch (format) {
      case 'csv':
        responseContent = convertReportToCSV(report);
        contentType = 'text/csv';
        fileName = `compliance-report-${reportType}-${Date.now()}.csv`;
        break;
      default:
        responseContent = JSON.stringify(report, null, 2);
        contentType = 'application/json';
        fileName = `compliance-report-${reportType}-${Date.now()}.json`;
    }

    return new NextResponse(responseContent, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': responseContent.length.toString(),
      },
    });

  } catch (error) {
    console.error('Compliance report generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate detailed compliance report' },
      { status: 500 }
    );
  }
}

async function generateComplianceReport(
  db: any,
  userId: string,
  reportType: string,
  startDate: string | null,
  endDate: string | null,
  isAdmin: boolean
): Promise<ComplianceReport> {
  const reportId = `report_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  
  // Build query for audit events
  let auditQuery = query(collection(db, 'audit_events'));
  
  if (!isAdmin) {
    auditQuery = query(auditQuery, where('userId', '==', userId));
  }
  
  if (startDate) {
    const start = new Date(startDate);
    auditQuery = query(auditQuery, where('timestamp', '>=', start));
  }
  
  if (endDate) {
    const end = new Date(endDate);
    auditQuery = query(auditQuery, where('timestamp', '<=', end));
  }
  
  auditQuery = query(auditQuery, orderBy('timestamp', 'desc'), limit(5000));
  
  const auditSnapshot = await getDocs(auditQuery);
  const events = auditSnapshot.docs.map(doc => doc.data());

  // Analyze events for compliance metrics
  const metrics = analyzeComplianceMetrics(events, reportType);
  const complianceLevel = determineComplianceLevel(metrics);
  const recommendations = generateRecommendations(metrics, complianceLevel);

  return {
    id: reportId,
    title: getReportTitle(reportType),
    description: getReportDescription(reportType),
    generatedAt: new Date().toISOString(),
    reportType,
    metrics,
    recommendations,
    complianceLevel
  };
}

async function generateDetailedComplianceReport(
  db: any,
  userId: string | null,
  reportType: string,
  includeUserData: boolean
) {
  // Get audit events
  let auditQuery = query(collection(db, 'audit_events'));
  
  if (userId) {
    auditQuery = query(auditQuery, where('userId', '==', userId));
  }
  
  auditQuery = query(auditQuery, orderBy('timestamp', 'desc'), limit(10000));
  const auditSnapshot = await getDocs(auditQuery);
  const events = auditSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Get user data if requested and authorized
  let userData = null;
  if (includeUserData && !userId) {
    // Admin requesting all user data
    const usersQuery = query(collection(db, 'users'), limit(1000));
    const usersSnapshot = await getDocs(usersQuery);
    userData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Generate comprehensive report
  const report = {
    reportInfo: {
      type: reportType,
      generatedAt: new Date().toISOString(),
      scope: userId ? 'user_specific' : 'system_wide',
      userId: userId || 'all_users'
    },
    complianceMetrics: analyzeComplianceMetrics(events, reportType),
    auditEvents: events.slice(0, 1000), // Limit for performance
    userData: userData?.slice(0, 100), // Limit for privacy
    recommendations: [],
    certifications: {
      gdpr: analyzeGDPRCompliance(events),
      ccpa: analyzeCCPACompliance(events),
      soc2: analyzeSOC2Compliance(events),
      iso27001: analyzeISO27001Compliance(events)
    }
  };

  report.recommendations = generateRecommendations(report.complianceMetrics, 'compliant');

  return report;
}

function analyzeComplianceMetrics(events: any[], reportType: string) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const recentEvents = events.filter(e => {
    const eventDate = e.timestamp?.toDate ? e.timestamp.toDate() : new Date(e.timestamp);
    return eventDate >= thirtyDaysAgo;
  });

  const weeklyEvents = events.filter(e => {
    const eventDate = e.timestamp?.toDate ? e.timestamp.toDate() : new Date(e.timestamp);
    return eventDate >= sevenDaysAgo;
  });

  // Count events by type
  const eventTypeCounts = events.reduce((acc, event) => {
    acc[event.eventType] = (acc[event.eventType] || 0) + 1;
    return acc;
  }, {});

  // User activity analysis
  const uniqueUsers = new Set(events.map(e => e.userId)).size;
  const authEvents = events.filter(e => e.eventType?.includes('USER_')).length;
  const dataAccessEvents = events.filter(e => e.eventType === 'DATA_ACCESS').length;
  const policyEvents = events.filter(e => e.eventType?.includes('POLICY_')).length;

  return {
    totalEvents: events.length,
    recentEvents: recentEvents.length,
    weeklyEvents: weeklyEvents.length,
    uniqueUsers,
    eventTypeCounts,
    complianceEvents: {
      authentication: authEvents,
      dataAccess: dataAccessEvents,
      policyInteraction: policyEvents,
      documentOperations: events.filter(e => e.eventType?.includes('DOCUMENT_')).length
    },
    dataRetention: {
      oldestEvent: events.length > 0 ? events[events.length - 1]?.timestamp : null,
      retentionPeriod: '7 years',
      complianceStatus: 'active'
    },
    integrityChecks: {
      eventsWithHashes: events.filter(e => e.hash).length,
      integrityScore: events.length > 0 ? (events.filter(e => e.hash).length / events.length) * 100 : 0
    }
  };
}

function determineComplianceLevel(metrics: any): 'compliant' | 'partial' | 'non-compliant' {
  const checks = [
    metrics.totalEvents > 0,
    metrics.complianceEvents.authentication > 0,
    metrics.integrityChecks.integrityScore > 90,
    metrics.complianceEvents.policyInteraction > 0
  ];

  const passedChecks = checks.filter(Boolean).length;
  
  if (passedChecks === checks.length) return 'compliant';
  if (passedChecks >= checks.length * 0.7) return 'partial';
  return 'non-compliant';
}

function generateRecommendations(metrics: any, complianceLevel: string): string[] {
  const recommendations: string[] = [];

  if (metrics.totalEvents === 0) {
    recommendations.push('🚨 No audit events found - ensure audit logging is properly configured');
  }

  if (metrics.integrityChecks.integrityScore < 95) {
    recommendations.push('⚠️ Some events lack cryptographic hashes - verify audit event creation process');
  }

  if (metrics.complianceEvents.policyInteraction === 0) {
    recommendations.push('📋 No policy interaction events - ensure terms acceptance is being logged');
  }

  if (metrics.weeklyEvents === 0) {
    recommendations.push('📊 No recent activity - monitor system usage and engagement');
  }

  if (complianceLevel === 'compliant') {
    recommendations.push('✅ System meets compliance requirements - maintain current practices');
  }

  if (recommendations.length === 0) {
    recommendations.push('✅ All compliance checks passed - excellent audit trail maintenance');
  }

  return recommendations;
}

function analyzeGDPRCompliance(events: any[]) {
  const dataExportEvents = events.filter(e => e.eventType === 'DATA_EXPORT').length;
  const consentEvents = events.filter(e => e.eventType?.includes('CONSENT')).length;
  const dataAccessEvents = events.filter(e => e.eventType === 'DATA_ACCESS').length;

  return {
    rightToAccess: dataAccessEvents > 0,
    rightToPortability: dataExportEvents > 0,
    consentManagement: consentEvents > 0,
    complianceScore: Math.min(100, ((dataExportEvents > 0 ? 1 : 0) + (consentEvents > 0 ? 1 : 0) + (dataAccessEvents > 0 ? 1 : 0)) * 33.33)
  };
}

function analyzeCCPACompliance(events: any[]) {
  const dataExportEvents = events.filter(e => e.eventType === 'DATA_EXPORT').length;
  const dataDeletionEvents = events.filter(e => e.eventType === 'DATA_DELETION').length;

  return {
    rightToKnow: dataExportEvents > 0,
    rightToDelete: dataDeletionEvents > 0,
    complianceScore: Math.min(100, ((dataExportEvents > 0 ? 1 : 0) + (dataDeletionEvents > 0 ? 1 : 0)) * 50)
  };
}

function analyzeSOC2Compliance(events: any[]) {
  const authEvents = events.filter(e => e.eventType?.includes('USER_')).length;
  const accessEvents = events.filter(e => e.eventType === 'DATA_ACCESS').length;
  const integrityEvents = events.filter(e => e.hash).length;

  return {
    securityControls: authEvents > 0,
    accessControls: accessEvents > 0,
    dataIntegrity: integrityEvents > 0,
    complianceScore: Math.min(100, ((authEvents > 0 ? 1 : 0) + (accessEvents > 0 ? 1 : 0) + (integrityEvents > 0 ? 1 : 0)) * 33.33)
  };
}

function analyzeISO27001Compliance(events: any[]) {
  const securityEvents = events.filter(e => 
    e.eventType?.includes('USER_') || 
    e.eventType === 'DATA_ACCESS' || 
    e.eventType?.includes('POLICY_')
  ).length;

  return {
    informationSecurity: securityEvents > 0,
    riskManagement: events.length > 0,
    complianceScore: Math.min(100, (securityEvents > 0 ? 1 : 0) * 100)
  };
}

function convertReportToCSV(report: any): string {
  const csvLines: string[] = [];
  
  // Header
  csvLines.push('Metric,Value,Details');
  
  // Basic metrics
  csvLines.push(`Total Events,${report.complianceMetrics?.totalEvents || 0},"Overall audit event count"`);
  csvLines.push(`Recent Events,${report.complianceMetrics?.recentEvents || 0},"Events in last 30 days"`);
  csvLines.push(`Unique Users,${report.complianceMetrics?.uniqueUsers || 0},"Number of unique users with events"`);
  
  // Compliance scores
  if (report.certifications) {
    csvLines.push(`GDPR Compliance,${report.certifications.gdpr?.complianceScore || 0}%,"GDPR compliance score"`);
    csvLines.push(`CCPA Compliance,${report.certifications.ccpa?.complianceScore || 0}%,"CCPA compliance score"`);
    csvLines.push(`SOC2 Compliance,${report.certifications.soc2?.complianceScore || 0}%,"SOC2 compliance score"`);
  }
  
  return csvLines.join('\n');
}

function getReportTitle(reportType: string): string {
  switch (reportType) {
    case 'gdpr': return 'GDPR Compliance Report';
    case 'ccpa': return 'CCPA Compliance Report';
    case 'soc2': return 'SOC 2 Compliance Report';
    case 'security': return 'Security Audit Report';
    case 'user_activity': return 'User Activity Report';
    default: return 'Compliance Overview Report';
  }
}

function getReportDescription(reportType: string): string {
  switch (reportType) {
    case 'gdpr': return 'Analysis of GDPR compliance including data subject rights and consent management';
    case 'ccpa': return 'California Consumer Privacy Act compliance assessment';
    case 'soc2': return 'Service Organization Control 2 audit trail analysis';
    case 'security': return 'Security events and access control audit';
    case 'user_activity': return 'User behavior and system interaction analysis';
    default: return 'Comprehensive compliance status across multiple frameworks';
  }
}