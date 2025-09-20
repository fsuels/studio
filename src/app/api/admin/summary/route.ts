// API endpoint for sticky summary bar real-time metrics
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

type SummaryAlertType = 'info' | 'warning' | 'error';

type SummaryAlertAction =
  | 'Review support queue'
  | 'Escalate to manager'
  | 'Process refund queue';

interface SummaryAlert {
  type: SummaryAlertType;
  message: string;
  action: SummaryAlertAction;
}

interface SummaryMetrics {
  totalSales: number;
  openIssues: number;
  todayRevenue: number;
  todayOrders: number;
  pendingRefunds: number;
  avgResponseTime: number;
  conversionRate: number;
  revenueChange: number;
  ordersChange: number;
  lastUpdated: number;
}

type TrendDirection = 'up' | 'down' | 'stable';

interface SummaryTrends {
  revenueDirection: Exclude<TrendDirection, 'stable'>;
  ordersDirection: Exclude<TrendDirection, 'stable'>;
  issuesDirection: TrendDirection;
}

interface SummaryRecommendation {
  message: string;
  priority: 'low' | 'medium' | 'high';
}

interface SummaryData extends SummaryMetrics {
  alerts: SummaryAlert[];
  healthScore: number;
  trends: SummaryTrends;
  recommendations: string[];
  lastSync: number;
}

type SummarySuccessResponse = {
  success: true;
  data: SummaryData;
};

type SummaryErrorResponse = {
  success: false;
  error: string;
};

type SummaryApiResponse = SummarySuccessResponse | SummaryErrorResponse;

// Run dynamically at request time (SSR)
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Require admin authentication
  const adminResult = await requireAdmin(request);
  if (adminResult instanceof Response) {
    return adminResult;
  }

  try {
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const todayMs = now.getTime() - todayStart.getTime();

    const timeOfDayMultiplier =
      Math.sin((todayMs / (24 * 60 * 60 * 1000)) * Math.PI) * 0.3 + 0.7;
    const weekdayMultiplier = [1, 0.9, 0.95, 1.1, 1.2, 0.8, 0.6][now.getDay()];

    const baseMetrics: SummaryMetrics = {
      totalSales: 2847392,
      openIssues: Math.floor(Math.random() * 8) + 2,
      todayRevenue: Math.floor(18500 * timeOfDayMultiplier * weekdayMultiplier),
      todayOrders: Math.floor(156 * timeOfDayMultiplier * weekdayMultiplier),
      pendingRefunds: Math.floor(Math.random() * 5) + 1,
      avgResponseTime: Math.floor(85 + Math.random() * 30),
      conversionRate: 3.2 + (Math.random() - 0.5) * 0.8,
      revenueChange: -2.1 + Math.random() * 8,
      ordersChange: -1.5 + Math.random() * 7,
      lastUpdated: Date.now(),
    };

    const finalMetrics: SummaryMetrics = { ...baseMetrics };

    const outsideBusinessHours = now.getHours() < 9 || now.getHours() > 18;
    if (outsideBusinessHours) {
      finalMetrics.openIssues = Math.floor(finalMetrics.openIssues * 0.3);
      finalMetrics.avgResponseTime = Math.floor(
        finalMetrics.avgResponseTime * 1.8,
      );
    }

    const isWeekend = now.getDay() === 0 || now.getDay() === 6;
    if (isWeekend) {
      finalMetrics.openIssues = Math.floor(finalMetrics.openIssues * 0.4);
      finalMetrics.pendingRefunds = Math.floor(
        finalMetrics.pendingRefunds * 0.5,
      );
    }

    const hour = now.getHours();
    if (hour >= 9 && hour <= 11) {
      finalMetrics.openIssues += 2;
      finalMetrics.avgResponseTime = Math.floor(
        finalMetrics.avgResponseTime * 1.2,
      );
    }

    if (hour >= 12 && hour <= 13) {
      finalMetrics.avgResponseTime = Math.floor(
        finalMetrics.avgResponseTime * 1.4,
      );
    }

    if (hour >= 16 && hour <= 18) {
      finalMetrics.openIssues += 1;
      finalMetrics.pendingRefunds += 1;
    }

    const alerts: SummaryAlert[] = [];

    if (finalMetrics.openIssues > 8) {
      alerts.push({
        type: 'warning',
        message: 'High number of open support issues',
        action: 'Review support queue',
      });
    }

    if (finalMetrics.avgResponseTime > 120) {
      alerts.push({
        type: 'error',
        message: 'Support response time above SLA',
        action: 'Escalate to manager',
      });
    }

    if (finalMetrics.pendingRefunds > 5) {
      alerts.push({
        type: 'warning',
        message: 'Multiple refunds pending approval',
        action: 'Process refund queue',
      });
    }

    let healthScore = 100;

    healthScore -= finalMetrics.openIssues * 3;
    healthScore -= Math.max(0, finalMetrics.avgResponseTime - 60) * 0.5;
    healthScore -= finalMetrics.pendingRefunds * 2;

    if (finalMetrics.conversionRate > 3.5) healthScore += 5;
    if (finalMetrics.revenueChange > 5) healthScore += 10;

    healthScore = Math.max(0, Math.min(100, Math.floor(healthScore)));

    const trends: SummaryTrends = {
      revenueDirection: finalMetrics.revenueChange > 0 ? 'up' : 'down',
      ordersDirection: finalMetrics.ordersChange > 0 ? 'up' : 'down',
      issuesDirection: finalMetrics.openIssues > 5 ? 'up' : 'stable',
    };

    const recommendations = generateRecommendations(finalMetrics);

    const response: SummarySuccessResponse = {
      success: true,
      data: {
        ...finalMetrics,
        alerts,
        healthScore,
        trends,
        recommendations: recommendations.map(
          (recommendation) => recommendation.message,
        ),
        lastSync: Date.now(),
      },
    };

    return NextResponse.json<SummaryApiResponse>(response);
  } catch (error) {
    console.error('Summary metrics API error:', error);

    const errorResponse: SummaryErrorResponse = {
      success: false,
      error: 'Failed to retrieve summary metrics',
    };

    return NextResponse.json<SummaryApiResponse>(errorResponse, {
      status: 500,
    });
  }
}

function generateRecommendations(
  metrics: SummaryMetrics,
): SummaryRecommendation[] {
  const recommendations: SummaryRecommendation[] = [];

  if (metrics.openIssues > 5) {
    recommendations.push({
      message: 'Consider adding more support agents during peak hours',
      priority: 'high',
    });
  }

  if (metrics.avgResponseTime > 100) {
    recommendations.push({
      message: 'Review support workflow efficiency',
      priority: 'medium',
    });
  }

  if (metrics.pendingRefunds > 3) {
    recommendations.push({
      message: 'Enable auto-approval for small refund amounts',
      priority: 'medium',
    });
  }

  if (metrics.conversionRate < 3.0) {
    recommendations.push({
      message: 'Analyze checkout flow for optimization opportunities',
      priority: 'medium',
    });
  }

  if (metrics.revenueChange < 0) {
    recommendations.push({
      message: 'Review recent pricing or product changes',
      priority: 'high',
    });
  }

  if (metrics.revenueChange > 5) {
    recommendations.push({
      message: 'Great revenue growth! Consider scaling successful initiatives',
      priority: 'low',
    });
  }

  if (metrics.openIssues < 3 && metrics.avgResponseTime < 60) {
    recommendations.push({
      message: 'Excellent support performance! Maintain current standards',
      priority: 'low',
    });
  }

  const priorityOrder: Record<SummaryRecommendation['priority'], number> = {
    high: 0,
    medium: 1,
    low: 2,
  };

  return recommendations
    .sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
    )
    .slice(0, 3);
}
