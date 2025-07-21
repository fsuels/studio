// Revenue Intelligence API - MRR/ARR trends, CLV, cohort analysis, churn prediction
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { generateMockOrders } from '@/lib/orders';
import { generateRevenueIntelligence } from '@/lib/revenue-intelligence';

// Mock database - in production, use your actual database
let ordersDB = generateMockOrders(500); // Larger dataset for better analytics

export async function GET(request: NextRequest) {
  // Require admin authentication
  const adminResult = await requireAdmin(request);
  if (adminResult instanceof Response) {
    return adminResult;
  }

  try {
    const url = new URL(request.url);
    const dataType = url.searchParams.get('type') || 'overview';
    const timeframe = url.searchParams.get('timeframe') || '12months';
    const cohortPeriod = url.searchParams.get('cohortPeriod') || '6months';

    // Filter orders based on timeframe
    const filteredOrders = filterOrdersByTimeframe(ordersDB, timeframe);

    // Generate comprehensive revenue intelligence
    const intelligence = generateRevenueIntelligence(filteredOrders);

    switch (dataType) {
      case 'overview':
        return NextResponse.json({
          success: true,
          data: {
            summary: {
              mrr: intelligence.revenueMetrics.mrr,
              arr: intelligence.revenueMetrics.arr,
              mrrGrowth: intelligence.revenueMetrics.growth.mrrGrowth,
              totalCustomers: intelligence.customerLTV.length,
              avgLTV:
                intelligence.customerLTV.reduce((sum, c) => sum + c.ltv, 0) /
                intelligence.customerLTV.length,
              churnRisk: intelligence.churnPredictions.filter(
                (c) => c.churnRisk === 'high' || c.churnRisk === 'critical',
              ).length,
              revenueLeakage: intelligence.revenueLeakage.reduce(
                (sum, leak) => sum + leak.amount,
                0,
              ),
            },
            trends: intelligence.revenueMetrics.trends.slice(-12), // Last 12 months
            topRisks: intelligence.churnPredictions.slice(0, 10), // Top 10 at-risk customers
            revenueLeakage: intelligence.revenueLeakage,
          },
        });

      case 'mrr_trends':
        return NextResponse.json({
          success: true,
          data: {
            metrics: intelligence.revenueMetrics,
            monthlyBreakdown: generateMonthlyMRRBreakdown(filteredOrders),
            growthFactors: analyzeGrowthFactors(filteredOrders),
            forecasting: generateMRRForecast(intelligence.revenueMetrics),
          },
        });

      case 'customer_ltv':
        return NextResponse.json({
          success: true,
          data: {
            customers: intelligence.customerLTV,
            segments: groupCustomersBySegment(intelligence.customerLTV),
            ltvDistribution: calculateLTVDistribution(intelligence.customerLTV),
            topCustomers: intelligence.customerLTV.slice(0, 50),
          },
        });

      case 'cohort_analysis':
        return NextResponse.json({
          success: true,
          data: {
            cohorts: intelligence.cohortAnalysis,
            retentionSummary: calculateRetentionSummary(
              intelligence.cohortAnalysis,
            ),
            revenueRetention: calculateRevenueRetentionSummary(
              intelligence.cohortAnalysis,
            ),
            cohortComparison: compareCohorts(intelligence.cohortAnalysis),
          },
        });

      case 'churn_prediction':
        return NextResponse.json({
          success: true,
          data: {
            predictions: intelligence.churnPredictions,
            riskDistribution: calculateChurnRiskDistribution(
              intelligence.churnPredictions,
            ),
            preventionStrategies: generatePreventionStrategies(
              intelligence.churnPredictions,
            ),
            expectedImpact: calculateChurnImpact(
              intelligence.churnPredictions,
              intelligence.customerLTV,
            ),
          },
        });

      case 'revenue_leakage':
        return NextResponse.json({
          success: true,
          data: {
            leakage: intelligence.revenueLeakage,
            recoveryOpportunities: identifyRecoveryOpportunities(
              intelligence.revenueLeakage,
            ),
            preventionPlan: generateLeakagePreventionPlan(
              intelligence.revenueLeakage,
            ),
            monthlyTrends: calculateLeakageTrends(filteredOrders),
          },
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid data type requested',
          },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error('Revenue Intelligence API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate revenue intelligence',
      },
      { status: 500 },
    );
  }
}

// Helper functions
function filterOrdersByTimeframe(orders: any[], timeframe: string) {
  const now = new Date();
  let cutoffDate = new Date();

  switch (timeframe) {
    case '3months':
      cutoffDate.setMonth(now.getMonth() - 3);
      break;
    case '6months':
      cutoffDate.setMonth(now.getMonth() - 6);
      break;
    case '12months':
      cutoffDate.setMonth(now.getMonth() - 12);
      break;
    case '24months':
      cutoffDate.setMonth(now.getMonth() - 24);
      break;
    default:
      cutoffDate.setMonth(now.getMonth() - 12);
  }

  return orders.filter((order) => new Date(order.createdAt) >= cutoffDate);
}

function generateMonthlyMRRBreakdown(orders: any[]) {
  const monthlyData = new Map();

  orders.forEach((order) => {
    const month = new Date(order.createdAt).toISOString().slice(0, 7);
    if (!monthlyData.has(month)) {
      monthlyData.set(month, {
        month,
        newMRR: 0,
        churnedMRR: 0,
        expansionMRR: 0,
        contractionMRR: 0,
        netMRR: 0,
      });
    }

    const data = monthlyData.get(month);
    // Simplified MRR calculation
    data.newMRR += order.payment.amount * 0.8; // Assume 80% is recurring
    data.netMRR += order.payment.amount * 0.8;
  });

  return Array.from(monthlyData.values()).sort((a, b) =>
    a.month.localeCompare(b.month),
  );
}

function analyzeGrowthFactors(orders: any[]) {
  return {
    newCustomerAcquisition: {
      rate: 15.2,
      trend: 'increasing',
      impact: 'high',
    },
    customerExpansion: {
      rate: 8.7,
      trend: 'stable',
      impact: 'medium',
    },
    churnReduction: {
      rate: 3.2,
      trend: 'improving',
      impact: 'high',
    },
    priceOptimization: {
      rate: 5.1,
      trend: 'stable',
      impact: 'medium',
    },
  };
}

function generateMRRForecast(metrics: any) {
  const currentMRR = metrics.mrr;
  const growthRate = metrics.growth.mrrGrowth / 100;

  const forecast = [];
  for (let i = 1; i <= 12; i++) {
    const projectedMRR = currentMRR * Math.pow(1 + growthRate, i);
    const month = new Date();
    month.setMonth(month.getMonth() + i);

    forecast.push({
      month: month.toISOString().slice(0, 7),
      projected: projectedMRR,
      conservative: projectedMRR * 0.85,
      optimistic: projectedMRR * 1.15,
      confidence: Math.max(50, 95 - i * 5), // Decreasing confidence over time
    });
  }

  return forecast;
}

function groupCustomersBySegment(customers: any[]) {
  const segments = {
    high_value: customers.filter((c) => c.segment === 'high_value'),
    medium_value: customers.filter((c) => c.segment === 'medium_value'),
    low_value: customers.filter((c) => c.segment === 'low_value'),
    at_risk: customers.filter((c) => c.segment === 'at_risk'),
  };

  return {
    high_value: {
      count: segments.high_value.length,
      totalLTV: segments.high_value.reduce((sum, c) => sum + c.ltv, 0),
      avgLTV:
        segments.high_value.length > 0
          ? segments.high_value.reduce((sum, c) => sum + c.ltv, 0) /
            segments.high_value.length
          : 0,
    },
    medium_value: {
      count: segments.medium_value.length,
      totalLTV: segments.medium_value.reduce((sum, c) => sum + c.ltv, 0),
      avgLTV:
        segments.medium_value.length > 0
          ? segments.medium_value.reduce((sum, c) => sum + c.ltv, 0) /
            segments.medium_value.length
          : 0,
    },
    low_value: {
      count: segments.low_value.length,
      totalLTV: segments.low_value.reduce((sum, c) => sum + c.ltv, 0),
      avgLTV:
        segments.low_value.length > 0
          ? segments.low_value.reduce((sum, c) => sum + c.ltv, 0) /
            segments.low_value.length
          : 0,
    },
    at_risk: {
      count: segments.at_risk.length,
      totalLTV: segments.at_risk.reduce((sum, c) => sum + c.ltv, 0),
      avgLTV:
        segments.at_risk.length > 0
          ? segments.at_risk.reduce((sum, c) => sum + c.ltv, 0) /
            segments.at_risk.length
          : 0,
    },
  };
}

function calculateLTVDistribution(customers: any[]) {
  const buckets = {
    '0-100': 0,
    '100-250': 0,
    '250-500': 0,
    '500-1000': 0,
    '1000+': 0,
  };

  customers.forEach((customer) => {
    if (customer.ltv < 100) buckets['0-100']++;
    else if (customer.ltv < 250) buckets['100-250']++;
    else if (customer.ltv < 500) buckets['250-500']++;
    else if (customer.ltv < 1000) buckets['500-1000']++;
    else buckets['1000+']++;
  });

  return buckets;
}

function calculateRetentionSummary(cohorts: any[]) {
  const summary = {
    avgMonth1: 0,
    avgMonth3: 0,
    avgMonth6: 0,
    avgMonth12: 0,
    avgMonth24: 0,
  };

  if (cohorts.length > 0) {
    summary.avgMonth1 =
      cohorts.reduce((sum, c) => sum + c.retentionRates.month1, 0) /
      cohorts.length;
    summary.avgMonth3 =
      cohorts.reduce((sum, c) => sum + c.retentionRates.month3, 0) /
      cohorts.length;
    summary.avgMonth6 =
      cohorts.reduce((sum, c) => sum + c.retentionRates.month6, 0) /
      cohorts.length;
    summary.avgMonth12 =
      cohorts.reduce((sum, c) => sum + c.retentionRates.month12, 0) /
      cohorts.length;
    summary.avgMonth24 =
      cohorts.reduce((sum, c) => sum + c.retentionRates.month24, 0) /
      cohorts.length;
  }

  return summary;
}

function calculateRevenueRetentionSummary(cohorts: any[]) {
  // Similar to calculateRetentionSummary but for revenue
  return calculateRetentionSummary(cohorts);
}

function compareCohorts(cohorts: any[]) {
  if (cohorts.length < 2) return null;

  const latest = cohorts[cohorts.length - 1];
  const previous = cohorts[cohorts.length - 2];

  return {
    latest: latest.cohortMonth,
    previous: previous.cohortMonth,
    sizeChange:
      ((latest.cohortSize - previous.cohortSize) / previous.cohortSize) * 100,
    revenueChange:
      ((latest.totalRevenue - previous.totalRevenue) / previous.totalRevenue) *
      100,
    retentionChange: {
      month1: latest.retentionRates.month1 - previous.retentionRates.month1,
      month3: latest.retentionRates.month3 - previous.retentionRates.month3,
      month6: latest.retentionRates.month6 - previous.retentionRates.month6,
    },
  };
}

function calculateChurnRiskDistribution(predictions: any[]) {
  const distribution = {
    low: predictions.filter((p) => p.churnRisk === 'low').length,
    medium: predictions.filter((p) => p.churnRisk === 'medium').length,
    high: predictions.filter((p) => p.churnRisk === 'high').length,
    critical: predictions.filter((p) => p.churnRisk === 'critical').length,
  };

  const total = predictions.length;
  return {
    counts: distribution,
    percentages: {
      low: (distribution.low / total) * 100,
      medium: (distribution.medium / total) * 100,
      high: (distribution.high / total) * 100,
      critical: (distribution.critical / total) * 100,
    },
  };
}

function generatePreventionStrategies(predictions: any[]) {
  const highRisk = predictions.filter(
    (p) => p.churnRisk === 'high' || p.churnRisk === 'critical',
  );

  return {
    immediate: {
      count: highRisk.length,
      actions: [
        'Personal outreach campaign',
        'Special retention offers',
        'Customer success calls',
      ],
    },
    proactive: {
      count: predictions.filter((p) => p.churnRisk === 'medium').length,
      actions: [
        'Email nurture sequences',
        'Product usage optimization',
        'Educational content delivery',
      ],
    },
    preventive: {
      count: predictions.filter((p) => p.churnRisk === 'low').length,
      actions: [
        'Regular satisfaction surveys',
        'Feature announcement campaigns',
        'Community engagement',
      ],
    },
  };
}

function calculateChurnImpact(churnPredictions: any[], customerLTV: any[]) {
  const atRiskCustomers = churnPredictions.filter(
    (p) => p.churnRisk === 'high' || p.churnRisk === 'critical',
  );

  const potentialLoss = atRiskCustomers.reduce((sum, prediction) => {
    const customer = customerLTV.find((c) => c.email === prediction.email);
    return sum + (customer ? customer.ltv * prediction.churnProbability : 0);
  }, 0);

  return {
    atRiskCustomers: atRiskCustomers.length,
    potentialRevenueLoss: potentialLoss,
    averageLossPerCustomer:
      atRiskCustomers.length > 0 ? potentialLoss / atRiskCustomers.length : 0,
    preventionROI: potentialLoss * 0.7, // Assume 70% can be saved with intervention
  };
}

function identifyRecoveryOpportunities(leakage: any[]) {
  return leakage.map((leak) => ({
    type: leak.type,
    recoveryPotential: leak.amount * 0.3, // Assume 30% recovery potential
    priority:
      leak.percentage > 5 ? 'high' : leak.percentage > 2 ? 'medium' : 'low',
    timeframe: leak.type === 'churn' ? '3-6 months' : '1-3 months',
    effortRequired: leak.affectedCustomers > 50 ? 'high' : 'medium',
  }));
}

function generateLeakagePreventionPlan(leakage: any[]) {
  return {
    shortTerm: [
      'Implement exit surveys',
      'Proactive customer success outreach',
      'Improved onboarding experience',
    ],
    mediumTerm: [
      'Advanced churn prediction models',
      'Automated retention campaigns',
      'Product usage analytics',
    ],
    longTerm: [
      'Customer success platform',
      'Predictive analytics integration',
      'Personalized retention strategies',
    ],
  };
}

function calculateLeakageTrends(orders: any[]) {
  const monthlyLeakage = new Map();

  // Calculate monthly churn and refunds
  orders.forEach((order) => {
    const month = new Date(order.createdAt).toISOString().slice(0, 7);
    if (!monthlyLeakage.has(month)) {
      monthlyLeakage.set(month, {
        month,
        churnRevenue: 0,
        refundRevenue: 0,
        totalRevenue: 0,
      });
    }

    const data = monthlyLeakage.get(month);
    data.totalRevenue += order.payment.amount;

    if (order.status === 'refunded') {
      data.refundRevenue += order.payment.amount;
    }
  });

  return Array.from(monthlyLeakage.values()).sort((a, b) =>
    a.month.localeCompare(b.month),
  );
}
