// src/app/api/marketplace/revenue/reports/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revenueShareSystem } from '@/lib/marketplace/revenue-sharing-system';

/**
 * GET /api/marketplace/revenue/reports
 * Generate revenue reports for creators and admins
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication
    // const user = await getCurrentUser(request);
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const url = new URL(request.url);
    const creatorId = url.searchParams.get('creatorId');
    const period = url.searchParams.get('period') || 'current_month'; // 'current_month', 'last_month', 'quarter', 'year', 'all_time', 'custom'
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const includeBreakdown =
      url.searchParams.get('includeBreakdown') === 'true';
    const reportType = url.searchParams.get('type') || 'summary'; // 'summary', 'detailed', 'analytics'

    const userId = 'user-id'; // TODO: Get from auth

    // Check permissions
    // if (creatorId && creatorId !== userId && !user.isAdmin) {
    //   return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    // }

    // Calculate date range
    const dateRange = calculateDateRange(period, startDate, endDate);

    // Generate revenue report
    const report = await revenueShareSystem.generateRevenueReport({
      creatorId: creatorId || undefined,
      period: dateRange,
      includeBreakdown: includeBreakdown || reportType === 'detailed',
    });

    // Add additional analytics if requested
    let analytics = null;
    if (reportType === 'analytics') {
      analytics = await generateAdvancedAnalytics({
        creatorId,
        period: dateRange,
        summary: report.summary,
      });
    }

    // Format the response based on report type
    let responseData: any = {
      summary: report.summary,
      period: {
        type: period,
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString(),
      },
      generatedAt: new Date().toISOString(),
    };

    if (report.breakdown) {
      responseData.breakdown = report.breakdown;
    }

    if (analytics) {
      responseData.analytics = analytics;
    }

    // Add creator-specific insights
    if (creatorId) {
      const creatorEarnings = await revenueShareSystem.getCreatorEarnings(
        creatorId,
        dateRange,
      );
      responseData.creatorInsights = {
        totalEarnings: creatorEarnings.totalEarnings,
        pendingEarnings: creatorEarnings.pendingEarnings,
        averageTransactionValue: creatorEarnings.averageTransactionValue,
        topTemplates: creatorEarnings.topTemplates,
        nextPayoutDate: creatorEarnings.nextPayoutDate,
        nextPayoutAmount: creatorEarnings.nextPayoutAmount,
      };
    }

    return NextResponse.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error('Generate revenue report error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate revenue report',
      },
      { status: 500 },
    );
  }
}

/**
 * Helper function to calculate date range based on period
 */
function calculateDateRange(
  period: string,
  startDate?: string | null,
  endDate?: string | null,
) {
  const now = new Date();

  if (period === 'custom' && startDate && endDate) {
    return {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    };
  }

  switch (period) {
    case 'current_month':
      return {
        startDate: new Date(now.getFullYear(), now.getMonth(), 1),
        endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      };

    case 'last_month':
      return {
        startDate: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        endDate: new Date(now.getFullYear(), now.getMonth(), 0),
      };

    case 'quarter':
      const quarter = Math.floor(now.getMonth() / 3);
      return {
        startDate: new Date(now.getFullYear(), quarter * 3, 1),
        endDate: new Date(now.getFullYear(), (quarter + 1) * 3, 0),
      };

    case 'year':
      return {
        startDate: new Date(now.getFullYear(), 0, 1),
        endDate: new Date(now.getFullYear(), 11, 31),
      };

    case 'all_time':
      return {
        startDate: new Date(2020, 0, 1), // Platform launch date
        endDate: now,
      };

    default:
      // Default to current month
      return {
        startDate: new Date(now.getFullYear(), now.getMonth(), 1),
        endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      };
  }
}

/**
 * Generate advanced analytics for revenue report
 */
async function generateAdvancedAnalytics(params: {
  creatorId?: string | null;
  period: { startDate: Date; endDate: Date };
  summary: any;
}) {
  // Calculate growth metrics
  const previousPeriod = calculatePreviousPeriod(params.period);

  // Get previous period data for comparison
  const previousReport = await revenueShareSystem.generateRevenueReport({
    creatorId: params.creatorId || undefined,
    period: previousPeriod,
    includeBreakdown: false,
  });

  // Calculate growth rates
  const revenueGrowth = calculateGrowthRate(
    params.summary.totalRevenue,
    previousReport.summary.totalRevenue,
  );

  const transactionGrowth = calculateGrowthRate(
    params.summary.transactionCount,
    previousReport.summary.transactionCount,
  );

  const avgTransactionGrowth = calculateGrowthRate(
    params.summary.averageTransactionValue,
    previousReport.summary.averageTransactionValue,
  );

  // Performance metrics
  const analytics = {
    growth: {
      revenue: {
        current: params.summary.totalRevenue,
        previous: previousReport.summary.totalRevenue,
        growth: revenueGrowth,
        trend: revenueGrowth > 0 ? 'up' : revenueGrowth < 0 ? 'down' : 'flat',
      },
      transactions: {
        current: params.summary.transactionCount,
        previous: previousReport.summary.transactionCount,
        growth: transactionGrowth,
        trend:
          transactionGrowth > 0
            ? 'up'
            : transactionGrowth < 0
              ? 'down'
              : 'flat',
      },
      averageValue: {
        current: params.summary.averageTransactionValue,
        previous: previousReport.summary.averageTransactionValue,
        growth: avgTransactionGrowth,
        trend:
          avgTransactionGrowth > 0
            ? 'up'
            : avgTransactionGrowth < 0
              ? 'down'
              : 'flat',
      },
    },

    performance: {
      conversionRate: calculateConversionRate(params.summary),
      customerRetention: calculateRetentionRate(params.summary),
      marketShare: calculateMarketShare(params.summary, params.creatorId),
      profitMargin: calculateProfitMargin(params.summary),
    },

    insights: generateInsights(params.summary, previousReport.summary),

    forecasting: generateForecast(params.summary, previousReport.summary),
  };

  return analytics;
}

/**
 * Calculate previous period for comparison
 */
function calculatePreviousPeriod(period: { startDate: Date; endDate: Date }) {
  const periodLength = period.endDate.getTime() - period.startDate.getTime();

  return {
    startDate: new Date(period.startDate.getTime() - periodLength),
    endDate: new Date(period.startDate.getTime() - 1),
  };
}

/**
 * Calculate growth rate percentage
 */
function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100 * 100) / 100;
}

/**
 * Calculate conversion rate (simplified)
 */
function calculateConversionRate(summary: any): number {
  // This is a simplified calculation
  // In reality, you'd need page view/template view data
  return Math.random() * 5 + 2; // 2-7% mock conversion rate
}

/**
 * Calculate retention rate (simplified)
 */
function calculateRetentionRate(summary: any): number {
  // Simplified calculation
  return Math.random() * 30 + 60; // 60-90% mock retention rate
}

/**
 * Calculate market share (if creator specified)
 */
function calculateMarketShare(
  summary: any,
  creatorId?: string | null,
): number | null {
  if (!creatorId) return null;

  // This would require total marketplace revenue data
  // For now, return a mock percentage
  return Math.random() * 10 + 1; // 1-11% mock market share
}

/**
 * Calculate profit margin
 */
function calculateProfitMargin(summary: any): number {
  if (summary.totalRevenue === 0) return 0;

  // Platform profit = platform revenue minus operational costs
  // Simplified calculation assuming 20% operational costs
  const operationalCosts = summary.platformRevenue * 0.2;
  const profit = summary.platformRevenue - operationalCosts;

  return Math.round((profit / summary.totalRevenue) * 100 * 100) / 100;
}

/**
 * Generate insights based on data
 */
function generateInsights(current: any, previous: any) {
  const insights = [];

  const revenueGrowth = calculateGrowthRate(
    current.totalRevenue,
    previous.totalRevenue,
  );

  if (revenueGrowth > 20) {
    insights.push({
      type: 'positive',
      title: 'Strong Revenue Growth',
      description: `Revenue increased by ${revenueGrowth}% compared to previous period`,
      impact: 'high',
    });
  } else if (revenueGrowth < -10) {
    insights.push({
      type: 'warning',
      title: 'Revenue Decline',
      description: `Revenue decreased by ${Math.abs(revenueGrowth)}% compared to previous period`,
      impact: 'high',
    });
  }

  if (
    current.averageTransactionValue >
    previous.averageTransactionValue * 1.15
  ) {
    insights.push({
      type: 'positive',
      title: 'Higher Value Transactions',
      description: 'Average transaction value has increased significantly',
      impact: 'medium',
    });
  }

  return insights;
}

/**
 * Generate simple forecast
 */
function generateForecast(current: any, previous: any) {
  const revenueGrowth = calculateGrowthRate(
    current.totalRevenue,
    previous.totalRevenue,
  );
  const transactionGrowth = calculateGrowthRate(
    current.transactionCount,
    previous.transactionCount,
  );

  // Simple linear projection for next period
  const nextPeriodRevenue = current.totalRevenue * (1 + revenueGrowth / 100);
  const nextPeriodTransactions =
    current.transactionCount * (1 + transactionGrowth / 100);

  return {
    nextPeriod: {
      estimatedRevenue: Math.round(nextPeriodRevenue),
      estimatedTransactions: Math.round(nextPeriodTransactions),
      confidence: revenueGrowth > -50 && revenueGrowth < 200 ? 'medium' : 'low',
    },
    assumptions: [
      'Based on linear growth projection',
      'Does not account for seasonality',
      'External factors may affect actual results',
    ],
  };
}
