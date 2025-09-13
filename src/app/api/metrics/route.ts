// Metrics API endpoint for ChartCard widgets
// Supports churn rate, conversion rates, revenue metrics, and more
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { funnelAnalytics } from '@/lib/funnel-analytics';

// Request validation schema
const MetricQuerySchema = z.object({
  metric: z.string(),
  period: z.string().optional().default('30d'),
  granularity: z
    .enum(['hour', 'day', 'week', 'month'])
    .optional()
    .default('day'),
  segment: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

// Response schema (matches ChartCard expectations)
const MetricResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    current: z.number(),
    previous: z.number().optional(),
    change: z.number().optional(),
    changeType: z.enum(['increase', 'decrease', 'stable']).optional(),
    chartData: z.array(
      z.object({
        name: z.string(),
        value: z.number(),
        date: z.string().optional(),
        category: z.string().optional(),
        color: z.string().optional(),
        timestamp: z.string().optional(),
      }),
    ),
    unit: z.string().optional(),
    format: z.enum(['number', 'percentage', 'currency', 'duration']).optional(),
  }),
  error: z.string().optional(),
});

type MetricResponse = z.infer<typeof MetricResponseSchema>;

// Touch schema at runtime to avoid "used only as a type" warning
void MetricResponseSchema;

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());

    // Validate query parameters
    const validatedParams = MetricQuerySchema.parse(queryParams);
    const { metric, period, granularity, segment } = validatedParams;

    // Route to appropriate metric handler
    let response: MetricResponse;

    switch (metric) {
      case 'churn_rate':
        response = await getChurnRate(period, granularity, segment);
        break;
      case 'conversion_rate':
        response = await getConversionRate(period, granularity, segment);
        break;
      case 'revenue':
        response = await getRevenue(period, granularity, segment);
        break;
      case 'document_completion_rate':
        response = await getDocumentCompletionRate(
          period,
          granularity,
          segment,
        );
        break;
      case 'user_acquisition':
        response = await getUserAcquisition(period, granularity, segment);
        break;
      case 'avg_order_value':
        response = await getAvgOrderValue(period, granularity, segment);
        break;
      case 'customer_lifetime_value':
        response = await getCustomerLifetimeValue(period, granularity, segment);
        break;
      case 'document_types_popularity':
        response = await getDocumentTypesPopularity(
          period,
          granularity,
          segment,
        );
        break;
      case 'user_retention':
        response = await getUserRetention(period, granularity, segment);
        break;
      case 'payment_success_rate':
        response = await getPaymentSuccessRate(period, granularity, segment);
        break;
      case 'session_duration':
        response = await getSessionDuration(period, granularity, segment);
        break;
      case 'fraud_prevention_savings':
        response = await getFraudPreventionSavings(
          period,
          granularity,
          segment,
        );
        break;
      default:
        return NextResponse.json(
          {
            success: false,
            error: `Unknown metric: ${metric}`,
          },
          { status: 400 },
        );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Metrics API error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid query parameters',
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 },
    );
  }
}

// Metric calculation functions

async function getChurnRate(
  period: string,
  granularity: string,
  _segment?: string,
): Promise<MetricResponse> {
  // In production, calculate from actual user data
  const daysCount = parsePeriodToDays(period);
  const intervals = generateTimeIntervals(daysCount, granularity);

  // Mock churn rate calculation (replace with real logic)
  const current = Math.random() * 0.05 + 0.02; // 2-7% churn
  const previous = current + (Math.random() - 0.5) * 0.01;
  const change = current - previous;

  const chartData = intervals.map((interval) => ({
    name: interval.label,
    value: Math.random() * 0.06 + 0.02,
    date: interval.date,
  }));

  return {
    success: true,
    data: {
      current: current * 100,
      previous: previous * 100,
      change: change * 100,
      changeType:
        change > 0.001 ? 'increase' : change < -0.001 ? 'decrease' : 'stable',
      chartData,
      format: 'percentage',
      unit: '',
    },
  };
}

async function getConversionRate(
  period: string,
  granularity: string,
  _segment?: string,
): Promise<MetricResponse> {
  // Use existing funnel analytics
  const metrics = funnelAnalytics.calculateConversionMetrics(period);
  const daysCount = parsePeriodToDays(period);
  const intervals = generateTimeIntervals(daysCount, granularity);

  const current = metrics.overall.visitToSigned;
  const previous = current + (Math.random() - 0.5) * 5; // Mock previous period
  const change = current - previous;

  const chartData = intervals.map((interval) => ({
    name: interval.label,
    value: Math.random() * 10 + current - 5,
    date: interval.date,
  }));

  return {
    success: true,
    data: {
      current,
      previous,
      change,
      changeType:
        change > 0.5 ? 'increase' : change < -0.5 ? 'decrease' : 'stable',
      chartData,
      format: 'percentage',
      unit: '',
    },
  };
}

async function getRevenue(
  period: string,
  granularity: string,
  _segment?: string,
): Promise<MetricResponse> {
  const daysCount = parsePeriodToDays(period);
  const intervals = generateTimeIntervals(daysCount, granularity);

  // Mock revenue calculation
  const baseRevenue = daysCount * 1250; // $1250 per day average
  const current = baseRevenue + (Math.random() - 0.5) * baseRevenue * 0.3;
  const previous = current + (Math.random() - 0.5) * current * 0.2;
  const change = current - previous;

  const chartData = intervals.map((interval) => ({
    name: interval.label,
    value: Math.random() * 2000 + 800, // $800-$2800 per interval
    date: interval.date,
  }));

  return {
    success: true,
    data: {
      current,
      previous,
      change,
      changeType:
        change > 100 ? 'increase' : change < -100 ? 'decrease' : 'stable',
      chartData,
      format: 'currency',
      unit: '',
    },
  };
}

async function getDocumentCompletionRate(
  period: string,
  granularity: string,
  _segment?: string,
): Promise<MetricResponse> {
  const daysCount = parsePeriodToDays(period);
  const intervals = generateTimeIntervals(daysCount, granularity);

  const current = 78.5 + Math.random() * 10; // 78-88% completion rate
  const previous = current + (Math.random() - 0.5) * 5;
  const change = current - previous;

  const chartData = intervals.map((interval) => ({
    name: interval.label,
    value: Math.random() * 15 + 75, // 75-90% range
    date: interval.date,
  }));

  return {
    success: true,
    data: {
      current,
      previous,
      change,
      changeType: change > 1 ? 'increase' : change < -1 ? 'decrease' : 'stable',
      chartData,
      format: 'percentage',
      unit: '',
    },
  };
}

async function getUserAcquisition(
  period: string,
  granularity: string,
  _segment?: string,
): Promise<MetricResponse> {
  const daysCount = parsePeriodToDays(period);
  const intervals = generateTimeIntervals(daysCount, granularity);

  const dailyAvg = 45; // 45 new users per day
  const current =
    daysCount * dailyAvg + Math.random() * dailyAvg * daysCount * 0.3;
  const previous = current + (Math.random() - 0.5) * current * 0.25;
  const change = current - previous;

  const chartData = intervals.map((interval) => ({
    name: interval.label,
    value: Math.floor(Math.random() * 80 + 20), // 20-100 users per interval
    date: interval.date,
  }));

  return {
    success: true,
    data: {
      current: Math.round(current),
      previous: Math.round(previous),
      change: Math.round(change),
      changeType:
        change > 10 ? 'increase' : change < -10 ? 'decrease' : 'stable',
      chartData,
      format: 'number',
      unit: 'users',
    },
  };
}

async function getAvgOrderValue(
  period: string,
  granularity: string,
  _segment?: string,
): Promise<MetricResponse> {
  const daysCount = parsePeriodToDays(period);
  const intervals = generateTimeIntervals(daysCount, granularity);

  const current = 67.5 + Math.random() * 20; // $67-87 AOV
  const previous = current + (Math.random() - 0.5) * 10;
  const change = current - previous;

  const chartData = intervals.map((interval) => ({
    name: interval.label,
    value: Math.random() * 30 + 55, // $55-85 range
    date: interval.date,
  }));

  return {
    success: true,
    data: {
      current,
      previous,
      change,
      changeType: change > 2 ? 'increase' : change < -2 ? 'decrease' : 'stable',
      chartData,
      format: 'currency',
      unit: '',
    },
  };
}

async function getCustomerLifetimeValue(
  _period: string,
  _granularity: string,
  _segment?: string,
): Promise<MetricResponse> {
  const current = 156.75 + Math.random() * 50; // $156-206 CLV
  const previous = current + (Math.random() - 0.5) * 25;
  const change = current - previous;

  // CLV by cohort
  const chartData = [
    { name: 'Q1 2024', value: 145.32, category: 'cohort' },
    { name: 'Q2 2024', value: 167.89, category: 'cohort' },
    { name: 'Q3 2024', value: 178.45, category: 'cohort' },
    { name: 'Q4 2024', value: 192.33, category: 'cohort' },
  ];

  return {
    success: true,
    data: {
      current,
      previous,
      change,
      changeType: change > 5 ? 'increase' : change < -5 ? 'decrease' : 'stable',
      chartData,
      format: 'currency',
      unit: '',
    },
  };
}

async function getDocumentTypesPopularity(
  period: string,
  granularity: string,
  _segment?: string,
): Promise<MetricResponse> {
  const chartData = [
    {
      name: 'Bill of Sale',
      value: 2845,
      category: 'document_type',
      color: '#3b82f6',
    },
    {
      name: 'Promissory Note',
      value: 1967,
      category: 'document_type',
      color: '#ef4444',
    },
    {
      name: 'Lease Agreement',
      value: 1543,
      category: 'document_type',
      color: '#10b981',
    },
    {
      name: 'Employment Contract',
      value: 1234,
      category: 'document_type',
      color: '#f59e0b',
    },
    { name: 'NDA', value: 987, category: 'document_type', color: '#8b5cf6' },
    {
      name: 'Power of Attorney',
      value: 756,
      category: 'document_type',
      color: '#f97316',
    },
  ];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  const topDocument = chartData[0];
  const current = (topDocument.value / total) * 100;

  return {
    success: true,
    data: {
      current,
      chartData,
      format: 'percentage',
      unit: `${topDocument.name}`,
    },
  };
}

async function getUserRetention(
  period: string,
  granularity: string,
  _segment?: string,
): Promise<MetricResponse> {
  const retentionRates = [
    { name: 'Day 1', value: 89.5, date: '2024-06-20' },
    { name: 'Day 7', value: 67.3, date: '2024-06-26' },
    { name: 'Day 30', value: 45.8, date: '2024-07-20' },
    { name: 'Day 90', value: 32.1, date: '2024-09-20' },
    { name: 'Day 180', value: 24.7, date: '2024-12-20' },
  ];

  const current = retentionRates[2].value; // 30-day retention
  const previous = current + (Math.random() - 0.5) * 5;
  const change = current - previous;

  return {
    success: true,
    data: {
      current,
      previous,
      change,
      changeType: change > 1 ? 'increase' : change < -1 ? 'decrease' : 'stable',
      chartData: retentionRates,
      format: 'percentage',
      unit: '30-day retention',
    },
  };
}

async function getPaymentSuccessRate(
  period: string,
  granularity: string,
  _segment?: string,
): Promise<MetricResponse> {
  const daysCount = parsePeriodToDays(period);
  const intervals = generateTimeIntervals(daysCount, granularity);

  const current = 94.2 + Math.random() * 3; // 94-97% success rate
  const previous = current + (Math.random() - 0.5) * 2;
  const change = current - previous;

  const chartData = intervals.map((interval) => ({
    name: interval.label,
    value: Math.random() * 5 + 92, // 92-97% range
    date: interval.date,
  }));

  return {
    success: true,
    data: {
      current,
      previous,
      change,
      changeType:
        change > 0.5 ? 'increase' : change < -0.5 ? 'decrease' : 'stable',
      chartData,
      format: 'percentage',
      unit: '',
    },
  };
}

async function getSessionDuration(
  period: string,
  granularity: string,
  _segment?: string,
): Promise<MetricResponse> {
  const daysCount = parsePeriodToDays(period);
  const intervals = generateTimeIntervals(daysCount, granularity);

  const current = 247.5 + Math.random() * 60; // 4-5 minutes average
  const previous = current + (Math.random() - 0.5) * 30;
  const change = current - previous;

  const chartData = intervals.map((interval) => ({
    name: interval.label,
    value: Math.random() * 100 + 200, // 200-300 seconds
    date: interval.date,
  }));

  return {
    success: true,
    data: {
      current,
      previous,
      change,
      changeType:
        change > 10 ? 'increase' : change < -10 ? 'decrease' : 'stable',
      chartData,
      format: 'duration',
      unit: '',
    },
  };
}

async function getFraudPreventionSavings(
  period: string,
  granularity: string,
  _segment?: string,
): Promise<MetricResponse> {
  const daysCount = parsePeriodToDays(period);
  const intervals = generateTimeIntervals(daysCount, granularity);

  // Based on fraud detection stats: declined + manual reviews prevented
  const current = daysCount * 125; // ~$125 per day in prevented fraud
  const previous = current + (Math.random() - 0.5) * current * 0.2;
  const change = current - previous;

  const chartData = intervals.map((interval) => ({
    name: interval.label,
    value: Math.random() * 200 + 50, // $50-250 per interval
    date: interval.date,
  }));

  return {
    success: true,
    data: {
      current,
      previous,
      change,
      changeType:
        change > 50 ? 'increase' : change < -50 ? 'decrease' : 'stable',
      chartData,
      format: 'currency',
      unit: 'saved',
    },
  };
}

// Helper functions

function parsePeriodToDays(period: string): number {
  switch (period) {
    case '7d':
      return 7;
    case '30d':
      return 30;
    case '90d':
      return 90;
    case '1y':
      return 365;
    default:
      return 30;
  }
}

function generateTimeIntervals(days: number, granularity: string) {
  const intervals = [];
  const now = new Date();

  let intervalCount: number;
  let intervalDays: number;

  switch (granularity) {
    case 'hour':
      intervalCount = Math.min(24, days * 24);
      intervalDays = 1 / 24;
      break;
    case 'day':
      intervalCount = Math.min(30, days);
      intervalDays = 1;
      break;
    case 'week':
      intervalCount = Math.ceil(days / 7);
      intervalDays = 7;
      break;
    case 'month':
      intervalCount = Math.ceil(days / 30);
      intervalDays = 30;
      break;
    default:
      intervalCount = days;
      intervalDays = 1;
  }

  for (let i = intervalCount - 1; i >= 0; i--) {
    const date = new Date(
      now.getTime() - i * intervalDays * 24 * 60 * 60 * 1000,
    );
    intervals.push({
      date: date.toISOString().split('T')[0],
      label: formatIntervalLabel(date, granularity),
    });
  }

  return intervals;
}

function formatIntervalLabel(date: Date, granularity: string): string {
  switch (granularity) {
    case 'hour':
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    case 'day':
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    case 'week': {
      const weekStart = new Date(
        date.getTime() - date.getDay() * 24 * 60 * 60 * 1000,
      );
      return `Week of ${weekStart.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })}`;
    }
    case 'month':
      return date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
    default:
      return date.toLocaleDateString('en-US');
  }
}
