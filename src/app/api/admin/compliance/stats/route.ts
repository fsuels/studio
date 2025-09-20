// Admin API for real-time compliance statistics
import { NextRequest, NextResponse } from 'next/server';

// Run dynamically at request time (SSR)
export const dynamic = 'force-dynamic';
import { requireAdmin } from '@/lib/admin-auth';
import { complianceMonitor, type ComplianceMetrics } from '@/lib/compliance';
import {
  getRedStates,
  getGreenStates,
  getAmberStates,
} from '@/lib/state-regulations';

type ComplianceAlertType = 'warning' | 'error' | 'info';

type ComplianceAlertAction =
  | 'Review Regulations'
  | 'Check Service Status'
  | 'View Waitlist'
  | 'Boost Marketing';

type ServiceStatus = 'online' | 'offline' | 'maintenance';

type HealthRating = 'good' | 'warning' | 'critical';

interface ComplianceAlert {
  type: ComplianceAlertType;
  title: string;
  message: string;
  action: ComplianceAlertAction;
  timestamp: string;
}

interface HourlyTrendPoint {
  hour: number;
  checks: number;
  allowed: number;
  blocked: number;
}

interface ComplianceStateBreakdown {
  green: string[];
  amber: string[];
  red: string[];
}

interface ComplianceTrends {
  hourly: HourlyTrendPoint[];
  blockedStates: string[];
}

interface ComplianceHealthSnapshot {
  geolocationService: ServiceStatus;
  complianceAPI: ServiceStatus;
  failureRate: HealthRating;
  uptime: string;
}

interface ComplianceData {
  metrics: ComplianceMetrics & {
    conversionRate: number;
    blockRate: number;
  };
  stateBreakdown: ComplianceStateBreakdown;
  trends: ComplianceTrends;
  health: ComplianceHealthSnapshot;
  alerts: ComplianceAlert[];
  lastUpdated: string;
}

type ComplianceSuccessResponse = {
  success: true;
  data: ComplianceData;
};

type ComplianceErrorResponse = {
  success: false;
  error: string;
};

type ComplianceApiResponse = ComplianceSuccessResponse | ComplianceErrorResponse;

export async function GET(request: NextRequest) {
  // Require admin authentication
  const adminResult = await requireAdmin(request);
  if (adminResult instanceof Response) {
    return adminResult;
  }

  try {
    // Get compliance metrics from monitor
    const metrics = complianceMonitor.getMetrics();

    // Get state classifications
    const stateBreakdown: ComplianceStateBreakdown = {
      green: getGreenStates(),
      amber: getAmberStates(),
      red: getRedStates(),
    };

    // Calculate additional stats
    const conversionRate =
      metrics.totalChecks > 0
        ? ((metrics.allowedPurchases / metrics.totalChecks) * 100).toFixed(1)
        : '0.0';

    const blockRate =
      metrics.totalChecks > 0
        ? ((metrics.blockedPurchases / metrics.totalChecks) * 100).toFixed(1)
        : '0.0';

    // Get top blocked states
    const blockedStates: string[] = complianceMonitor.getBlockedStates();

    // Generate trending data (mock for now - you'd store historical data)
    const hourlyTrend: HourlyTrendPoint[] = Array.from(
      { length: 24 },
      (_: unknown, hour) => ({
        hour,
        checks: Math.floor(Math.random() * 50) + 10,
        allowed: Math.floor(Math.random() * 40) + 8,
        blocked: Math.floor(Math.random() * 10) + 2,
      }),
    );

    const response: ComplianceSuccessResponse = {
      success: true,
      data: {
        metrics: {
          ...metrics,
          conversionRate: parseFloat(conversionRate),
          blockRate: parseFloat(blockRate),
        },
        stateBreakdown,
        trends: {
          hourly: hourlyTrend,
          blockedStates: blockedStates.slice(0, 10),
        },
        health: {
          geolocationService: 'online',
          complianceAPI: 'online',
          failureRate: metrics.geolocationFailures > 10 ? 'warning' : 'good',
          uptime: '99.9%',
        },
        alerts: generateComplianceAlerts(metrics, blockedStates),
        lastUpdated: new Date().toISOString(),
      },
    };

    return NextResponse.json<ComplianceApiResponse>(response);
  } catch (error) {
    console.error('Admin compliance stats error:', error);

    const errorResponse: ComplianceErrorResponse = {
      success: false,
      error: 'Failed to retrieve compliance statistics',
    };

    return NextResponse.json<ComplianceApiResponse>(errorResponse, {
      status: 500,
    });
  }
}

// Generate real-time compliance alerts
function generateComplianceAlerts(
  metrics: ComplianceMetrics,
  blockedStates: string[],
): ComplianceAlert[] {
  const alerts: ComplianceAlert[] = [];

  // High block rate alert
  if (metrics.totalChecks > 100) {
    const blockRate = (metrics.blockedPurchases / metrics.totalChecks) * 100;
    if (blockRate > 20) {
      alerts.push({
        type: 'warning',
        title: 'High Block Rate Detected',
        message: `${blockRate.toFixed(1)}% of requests are being blocked. Consider reviewing state classifications.`,
        action: 'Review Regulations',
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Geolocation failures alert
  if (metrics.geolocationFailures > 10) {
    alerts.push({
      type: 'error',
      title: 'Geolocation Service Issues',
      message: `${metrics.geolocationFailures} geolocation failures detected. Service degradation possible.`,
      action: 'Check Service Status',
      timestamp: new Date().toISOString(),
    });
  }

  // New blocked state alert
  if (blockedStates.length > 3) {
    alerts.push({
      type: 'info',
      title: 'Expansion Opportunity',
      message: `${blockedStates.length} states generating waitlist signups. Consider attorney partnerships.`,
      action: 'View Waitlist',
      timestamp: new Date().toISOString(),
    });
  }

  // Low conversion in green states
  if (metrics.byRiskLevel.green > 0) {
    const greenConversion =
      (metrics.byRiskLevel.green / metrics.totalChecks) * 100;
    if (greenConversion < 5) {
      alerts.push({
        type: 'info',
        title: 'Low Green State Traffic',
        message: `Only ${greenConversion.toFixed(1)}% of traffic from green states. Marketing opportunity.`,
        action: 'Boost Marketing',
        timestamp: new Date().toISOString(),
      });
    }
  }

  return alerts;
}

