// API endpoint for sticky summary bar real-time metrics
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  // Require admin authentication
  const adminResult = await requireAdmin(request);
  if (adminResult instanceof Response) {
    return adminResult;
  }

  try {
    // In a real implementation, these would come from your database
    // For now, generating realistic demo data based on time of day
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const todayMs = now.getTime() - todayStart.getTime();

    // Time-based variation for realistic demo data
    const timeOfDayMultiplier =
      Math.sin((todayMs / (24 * 60 * 60 * 1000)) * Math.PI) * 0.3 + 0.7;
    const weekdayMultiplier = [1, 0.9, 0.95, 1.1, 1.2, 0.8, 0.6][now.getDay()];

    // Mock data with realistic variations
    const baseMetrics = {
      totalSales: 2847392,
      openIssues: Math.floor(Math.random() * 8) + 2, // 2-10 issues
      todayRevenue: Math.floor(18500 * timeOfDayMultiplier * weekdayMultiplier),
      todayOrders: Math.floor(156 * timeOfDayMultiplier * weekdayMultiplier),
      pendingRefunds: Math.floor(Math.random() * 5) + 1, // 1-6 refunds
      avgResponseTime: Math.floor(85 + Math.random() * 30), // 85-115 minutes
      conversionRate: 3.2 + (Math.random() - 0.5) * 0.8, // 2.8-3.6%
      revenueChange: -2.1 + Math.random() * 8, // -2% to +6%
      ordersChange: -1.5 + Math.random() * 7, // -1% to +5.5%
      lastUpdated: Date.now(),
    };

    // Add some realistic business logic
    if (now.getHours() < 9 || now.getHours() > 18) {
      // Outside business hours - fewer issues
      baseMetrics.openIssues = Math.floor(baseMetrics.openIssues * 0.3);
      baseMetrics.avgResponseTime = Math.floor(
        baseMetrics.avgResponseTime * 1.8,
      ); // Slower response
    }

    // Weekend adjustments
    if (now.getDay() === 0 || now.getDay() === 6) {
      baseMetrics.openIssues = Math.floor(baseMetrics.openIssues * 0.4);
      baseMetrics.pendingRefunds = Math.floor(baseMetrics.pendingRefunds * 0.5);
    }

    // Simulate some daily patterns
    const dailyPatterns = {
      // Morning rush
      ...(now.getHours() >= 9 &&
        now.getHours() <= 11 && {
          openIssues: baseMetrics.openIssues + 2,
          avgResponseTime: Math.floor(baseMetrics.avgResponseTime * 1.2),
        }),

      // Lunch dip
      ...(now.getHours() >= 12 &&
        now.getHours() <= 13 && {
          avgResponseTime: Math.floor(baseMetrics.avgResponseTime * 1.4),
        }),

      // End of day spike
      ...(now.getHours() >= 16 &&
        now.getHours() <= 18 && {
          openIssues: baseMetrics.openIssues + 1,
          pendingRefunds: baseMetrics.pendingRefunds + 1,
        }),
    };

    const finalMetrics = {
      ...baseMetrics,
      ...dailyPatterns,
    };

    // Add some alerts based on thresholds
    const alerts = [];

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

    // Calculate health score based on various factors
    let healthScore = 100;

    // Deduct points for issues
    healthScore -= finalMetrics.openIssues * 3;
    healthScore -= Math.max(0, finalMetrics.avgResponseTime - 60) * 0.5;
    healthScore -= finalMetrics.pendingRefunds * 2;

    // Add points for good performance
    if (finalMetrics.conversionRate > 3.5) healthScore += 5;
    if (finalMetrics.revenueChange > 5) healthScore += 10;

    healthScore = Math.max(0, Math.min(100, Math.floor(healthScore)));

    return NextResponse.json({
      success: true,
      data: {
        ...finalMetrics,
        alerts,
        healthScore,
        trends: {
          revenueDirection: finalMetrics.revenueChange > 0 ? 'up' : 'down',
          ordersDirection: finalMetrics.ordersChange > 0 ? 'up' : 'down',
          issuesDirection: finalMetrics.openIssues > 5 ? 'up' : 'stable',
        },
        recommendations: generateRecommendations(finalMetrics),
        lastSync: Date.now(),
      },
    });
  } catch (error) {
    console.error('Summary metrics API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve summary metrics',
      },
      { status: 500 },
    );
  }
}

function generateRecommendations(metrics: any): string[] {
  const recommendations = [];

  if (metrics.openIssues > 5) {
    recommendations.push(
      'Consider adding more support agents during peak hours',
    );
  }

  if (metrics.avgResponseTime > 100) {
    recommendations.push('Review support workflow efficiency');
  }

  if (metrics.pendingRefunds > 3) {
    recommendations.push('Enable auto-approval for small refund amounts');
  }

  if (metrics.conversionRate < 3.0) {
    recommendations.push(
      'Analyze checkout flow for optimization opportunities',
    );
  }

  if (metrics.revenueChange < 0) {
    recommendations.push('Review recent pricing or product changes');
  }

  // Add positive recommendations too
  if (metrics.revenueChange > 5) {
    recommendations.push(
      'Great revenue growth! Consider scaling successful initiatives',
    );
  }

  if (metrics.openIssues < 3 && metrics.avgResponseTime < 60) {
    recommendations.push(
      'Excellent support performance! Maintain current standards',
    );
  }

  return recommendations.slice(0, 3); // Limit to top 3 recommendations
}
