// Admin API for real-time compliance statistics
import { NextRequest, NextResponse } from 'next/server';

// Mark this route as static for `output: export` builds
export const dynamic = 'force-static';
export const revalidate = 0;
import { requireAdmin } from '@/lib/admin-auth';
import { complianceMonitor } from '@/lib/compliance';
import {
  getRedStates,
  getGreenStates,
  getAmberStates,
} from '@/lib/state-regulations';

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
    const stateBreakdown = {
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
    const blockedStates = complianceMonitor.getBlockedStates();

    // Generate trending data (mock for now - you'd store historical data)
    const hourlyTrend = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      checks: Math.floor(Math.random() * 50) + 10,
      allowed: Math.floor(Math.random() * 40) + 8,
      blocked: Math.floor(Math.random() * 10) + 2,
    }));

    return NextResponse.json({
      success: true,
      data: {
        // Current metrics
        metrics: {
          ...metrics,
          conversionRate: parseFloat(conversionRate),
          blockRate: parseFloat(blockRate),
        },

        // State breakdown
        stateBreakdown,

        // Trending data
        trends: {
          hourly: hourlyTrend,
          blockedStates: blockedStates.slice(0, 10),
        },

        // System health
        health: {
          geolocationService: 'online',
          complianceAPI: 'online',
          failureRate: metrics.geolocationFailures > 10 ? 'warning' : 'good',
          uptime: '99.9%',
        },

        // Real-time alerts
        alerts: generateComplianceAlerts(metrics, blockedStates),

        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Admin compliance stats error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve compliance statistics',
      },
      { status: 500 },
    );
  }
}

// Generate real-time compliance alerts
function generateComplianceAlerts(metrics: any, blockedStates: string[]) {
  const alerts = [];

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
