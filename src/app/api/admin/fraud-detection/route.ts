// Advanced Fraud Detection API
import { NextRequest, NextResponse } from 'next/server';

// Run dynamically at request time (SSR)
export const dynamic = 'force-dynamic';
import { requireAdmin } from '@/lib/admin-auth';
import {
  advancedFraudDetection,
  type FraudRiskAssessment,
  type VelocityCheck,
  type DeviceFingerprint,
  type ChargebackRiskFactors,
} from '@/lib/advanced-fraud-detection';

type BulkAssessmentResult = {
  orderId: string;
  success: boolean;
  assessment?: FraudRiskAssessment;
  error?: string;
};

type FraudTrendPoint = {
  date: string;
  totalAssessments: number;
  highRisk: number;
  declined: number;
  avgRiskScore: number;
  chargebackPredictions: number;
  avgProcessingTime: number;
};

type ChargebackPrediction = {
  probability: number;
  riskBand: 'A' | 'B' | 'C' | 'D' | 'E';
  expectedLoss: number;
  confidence: number;
};

const PAYMENT_METHODS = ['credit_card', 'paypal', 'stripe'] as const;
type PaymentMethod = (typeof PAYMENT_METHODS)[number];

type FraudDocType =
  | 'fraud.overview'
  | 'fraud.assessments'
  | 'fraud.velocity'
  | 'fraud.devices'
  | 'fraud.chargeback'
  | 'fraud.trends'
  | 'fraud.rules'
  | 'fraud.assessment.single'
  | 'fraud.assessment.bulk'
  | 'fraud.assessment.feedback'
  | 'fraud.error';

type FraudApiSuccess<
  TDoc extends FraudDocType,
  TPayload extends Record<string, unknown>,
> = {
  status: 'success';
  docType: TDoc;
} & TPayload;

type FraudApiError<TDoc extends FraudDocType> = {
  status: 'error';
  docType: TDoc;
  error: string;
};

type FraudApiResponse<
  TDoc extends FraudDocType,
  TPayload extends Record<string, unknown>,
> = FraudApiSuccess<TDoc, TPayload> | FraudApiError<TDoc>;

type DashboardFraudAssessment = FraudRiskAssessment & {
  id: string;
  orderId: string;
  customerEmail: string;
  orderValue: number;
  paymentMethod: PaymentMethod;
};

type FraudAssessmentsPayload = {
  assessments: DashboardFraudAssessment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

const DOC_TYPE_ALIASES: Record<string, FraudDocType> = {
  overview: 'fraud.overview',
  'fraud.overview': 'fraud.overview',
  'fraud/overview': 'fraud.overview',
  assessments: 'fraud.assessments',
  'risk_assessments': 'fraud.assessments',
  'fraud.assessments': 'fraud.assessments',
  'fraud/assessments': 'fraud.assessments',
  velocity: 'fraud.velocity',
  'velocity_analytics': 'fraud.velocity',
  'fraud.velocity': 'fraud.velocity',
  'fraud/velocity': 'fraud.velocity',
  device: 'fraud.devices',
  devices: 'fraud.devices',
  'device_analytics': 'fraud.devices',
  'fraud.devices': 'fraud.devices',
  'fraud/device': 'fraud.devices',
  chargeback: 'fraud.chargeback',
  'chargeback_predictions': 'fraud.chargeback',
  'fraud.chargeback': 'fraud.chargeback',
  'fraud/chargeback': 'fraud.chargeback',
  trends: 'fraud.trends',
  'fraud_trends': 'fraud.trends',
  'fraud.trends': 'fraud.trends',
  'fraud/trends': 'fraud.trends',
  rules: 'fraud.rules',
  'risk_rules': 'fraud.rules',
  'fraud.rules': 'fraud.rules',
  'fraud/rules': 'fraud.rules',
};

function resolveDocType(value: string | null): FraudDocType | null {
  if (!value) {
    return null;
  }
  const key = value.trim().toLowerCase();
  return DOC_TYPE_ALIASES[key] ?? null;
}

export async function GET(request: NextRequest) {
  const adminResult = await requireAdmin(request);
  if (adminResult instanceof Response) {
    return adminResult;
  }

  try {
    const url = new URL(request.url);
    const docTypeParam =
      url.searchParams.get('docType') ?? url.searchParams.get('type') ?? 'overview';
    const docType = resolveDocType(docTypeParam);

    if (!docType) {
      return NextResponse.json<FraudApiError<'fraud.error'>>(
        {
          status: 'error',
          docType: 'fraud.error',
          error: 'Invalid docType parameter',
        },
        { status: 400 },
      );
    }

    const timeframe = url.searchParams.get('timeframe') || '30d';
    const riskLevel = url.searchParams.get('riskLevel') || undefined;
    const parsedPage = parseInt(url.searchParams.get('page') || '1', 10);
    const parsedLimit = parseInt(url.searchParams.get('limit') || '50', 10);
    const page = Number.isNaN(parsedPage) ? 1 : Math.max(parsedPage, 1);
    const limit = Number.isNaN(parsedLimit) ? 50 : Math.max(parsedLimit, 1);

    switch (docType) {
      case 'fraud.overview': {
        const overview = await getFraudOverview(timeframe);
        return NextResponse.json<
          FraudApiResponse<
            'fraud.overview',
            Awaited<ReturnType<typeof getFraudOverview>>
          >
        >({
          status: 'success',
          docType,
          ...overview,
        });
      }

      case 'fraud.assessments': {
        const assessments = await getFraudAssessments(
          timeframe,
          riskLevel,
          page,
          limit,
        );
        return NextResponse.json<
          FraudApiResponse<
            'fraud.assessments',
            Awaited<ReturnType<typeof getFraudAssessments>>
          >
        >({
          status: 'success',
          docType,
          ...assessments,
        });
      }

      case 'fraud.velocity': {
        const velocityData = await getVelocityAnalytics(timeframe);
        return NextResponse.json<
          FraudApiResponse<
            'fraud.velocity',
            Awaited<ReturnType<typeof getVelocityAnalytics>>
          >
        >({
          status: 'success',
          docType,
          ...velocityData,
        });
      }

      case 'fraud.devices': {
        const deviceData = await getDeviceAnalytics(timeframe);
        return NextResponse.json<
          FraudApiResponse<
            'fraud.devices',
            Awaited<ReturnType<typeof getDeviceAnalytics>>
          >
        >({
          status: 'success',
          docType,
          ...deviceData,
        });
      }

      case 'fraud.chargeback': {
        const chargebackData = await getChargebackPredictions(timeframe);
        return NextResponse.json<
          FraudApiResponse<
            'fraud.chargeback',
            Awaited<ReturnType<typeof getChargebackPredictions>>
          >
        >({
          status: 'success',
          docType,
          ...chargebackData,
        });
      }

      case 'fraud.trends': {
        const trendsData = await getFraudTrends(timeframe);
        return NextResponse.json<
          FraudApiResponse<
            'fraud.trends',
            Awaited<ReturnType<typeof getFraudTrends>>
          >
        >({
          status: 'success',
          docType,
          ...trendsData,
        });
      }

      case 'fraud.rules': {
        const rulesData = await getFraudRules();
        return NextResponse.json<
          FraudApiResponse<
            'fraud.rules',
            Awaited<ReturnType<typeof getFraudRules>>
          >
        >({
          status: 'success',
          docType,
          ...rulesData,
        });
      }

      default: {
        return NextResponse.json<FraudApiError<'fraud.error'>>(
          {
            status: 'error',
            docType: 'fraud.error',
            error: 'Unsupported docType parameter',
          },
          { status: 400 },
        );
      }
    }
  } catch (error) {
    console.error('Fraud detection API error:', error);

    return NextResponse.json<FraudApiError<'fraud.error'>>(
      {
        status: 'error',
        docType: 'fraud.error',
        error: 'Failed to retrieve fraud detection data',
      },
      { status: 500 },
    );
  }
}

// Assess fraud risk for a specific order
export async function POST(request: NextRequest) {
  const adminResult = await requireAdmin(request);
  if (adminResult instanceof Response) {
    return adminResult;
  }

  try {
    const body = await request.json();
    const { action, orderData, deviceData, requestMetadata } = body;

    if (!action) {
      return NextResponse.json<FraudApiError<'fraud.error'>>(
        {
          status: 'error',
          docType: 'fraud.error',
          error: 'Action is required',
        },
        { status: 400 },
      );
    }

    switch (action) {
      case 'assess_risk': {
        if (!orderData) {
          return NextResponse.json<
            FraudApiError<'fraud.assessment.single'>
          >(
            {
              status: 'error',
              docType: 'fraud.assessment.single',
              error: 'orderData is required for risk assessment',
            },
            { status: 400 },
          );
        }

        const assessment = await advancedFraudDetection.assessFraudRisk(
          orderData,
          deviceData || {},
          requestMetadata || {},
        );

        return NextResponse.json<
          FraudApiResponse<
            'fraud.assessment.single',
            { assessment: FraudRiskAssessment }
          >
        >({
          status: 'success',
          docType: 'fraud.assessment.single',
          assessment,
        });
      }

      case 'bulk_assess': {
        const { orders } = body;
        if (!Array.isArray(orders)) {
          return NextResponse.json<
            FraudApiError<'fraud.assessment.bulk'>
          >(
            {
              status: 'error',
              docType: 'fraud.assessment.bulk',
              error: 'orders array is required for bulk assessment',
            },
            { status: 400 },
          );
        }

        const bulkResults: BulkAssessmentResult[] = [];
        for (const order of orders) {
          try {
            const result = await advancedFraudDetection.assessFraudRisk(
              order.orderData,
              order.deviceData || {},
              order.requestMetadata || {},
            );
            bulkResults.push({
              orderId: order.orderId,
              success: true,
              assessment: result,
            });
          } catch (error) {
            bulkResults.push({
              orderId: order.orderId,
              success: false,
              error:
                error instanceof Error ? error.message : 'Unknown error',
            });
          }
        }

        return NextResponse.json<
          FraudApiResponse<
            'fraud.assessment.bulk',
            {
              total: number;
              successful: number;
              failed: number;
              results: BulkAssessmentResult[];
            }
          >
        >({
          status: 'success',
          docType: 'fraud.assessment.bulk',
          total: orders.length,
          successful: bulkResults.filter((r) => r.success).length,
          failed: bulkResults.filter((r) => !r.success).length,
          results: bulkResults,
        });
      }

      case 'update_feedback': {
        const { assessmentId, actualOutcome, fraudConfirmed } = body;
        if (!assessmentId) {
          return NextResponse.json<
            FraudApiError<'fraud.assessment.feedback'>
          >(
            {
              status: 'error',
              docType: 'fraud.assessment.feedback',
              error: 'assessmentId is required',
            },
            { status: 400 },
          );
        }

        await updateAssessmentFeedback(
          assessmentId,
          actualOutcome,
          fraudConfirmed,
        );

        return NextResponse.json<
          FraudApiResponse<
            'fraud.assessment.feedback',
            { feedbackUpdated: true }
          >
        >({
          status: 'success',
          docType: 'fraud.assessment.feedback',
          feedbackUpdated: true,
        });
      }

      default:
        return NextResponse.json<FraudApiError<'fraud.error'>>(
          {
            status: 'error',
            docType: 'fraud.error',
            error: 'Invalid action',
          },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error('Fraud detection operation error:', error);

    return NextResponse.json<FraudApiError<'fraud.error'>>(
      {
        status: 'error',
        docType: 'fraud.error',
        error: 'Failed to process fraud detection operation',
      },
      { status: 500 },
    );
  }
}

// Helper functions
async function getFraudOverview(_timeframe: string) {
  // In production, fetch from actual database
  const assessments = generateMockAssessments(1000);

  const totalAssessments = assessments.length;
  const highRiskCount = assessments.filter(
    (a) => a.riskLevel === 'high' || a.riskLevel === 'very_high',
  ).length;
  const autoDeclined = assessments.filter(
    (a) => a.recommendation === 'decline',
  ).length;
  const manualReviews = assessments.filter(
    (a) =>
      a.recommendation === 'manual_review' || a.recommendation === 'review',
  ).length;

  const avgProcessingTime =
    assessments.reduce((sum, a) => sum + a.processingTime, 0) /
    totalAssessments;
  const avgRiskScore =
    assessments.reduce((sum, a) => sum + a.overallScore, 0) / totalAssessments;

  // Risk distribution
  const riskDistribution = {
    very_low: assessments.filter((a) => a.riskLevel === 'very_low').length,
    low: assessments.filter((a) => a.riskLevel === 'low').length,
    medium: assessments.filter((a) => a.riskLevel === 'medium').length,
    high: assessments.filter((a) => a.riskLevel === 'high').length,
    very_high: assessments.filter((a) => a.riskLevel === 'very_high').length,
  };

  // Top risk factors
  const allFactors = assessments.flatMap((a) => a.riskFactors);
  const factorCounts = allFactors.reduce(
    (acc, factor) => {
      acc[factor.factor] = (acc[factor.factor] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const topRiskFactors = Object.entries(factorCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([factor, count]) => ({
      factor,
      count,
      percentage: (count / totalAssessments) * 100,
    }));

  // Chargeback predictions
  const chargebackPredictions = assessments.map((a) => a.chargebackLikelihood);
  const avgChargebackRisk =
    chargebackPredictions.reduce((sum, p) => sum + p.probability, 0) /
    chargebackPredictions.length;
  const highChargebackRisk = chargebackPredictions.filter(
    (p) => p.riskBand === 'D' || p.riskBand === 'E',
  ).length;

  return {
    summary: {
      totalAssessments,
      highRiskCount,
      highRiskPercentage: (highRiskCount / totalAssessments) * 100,
      autoDeclined,
      autoDeclineRate: (autoDeclined / totalAssessments) * 100,
      manualReviews,
      manualReviewRate: (manualReviews / totalAssessments) * 100,
      avgProcessingTime: Math.round(avgProcessingTime),
      avgRiskScore: Math.round(avgRiskScore),
      avgChargebackRisk: (avgChargebackRisk * 100).toFixed(2),
      highChargebackRisk,
      fraudPrevented: autoDeclined + Math.floor(manualReviews * 0.3), // Estimate
      estimatedSavings: (autoDeclined + Math.floor(manualReviews * 0.3)) * 75, // $75 avg loss per fraud
    },
    riskDistribution,
    topRiskFactors,
    recentHighRisk: assessments
      .filter((a) => a.riskLevel === 'high' || a.riskLevel === 'very_high')
      .slice(0, 10)
      .map((a) => ({
        id: `assessment_${Math.random().toString(36).substr(2, 8)}`,
        timestamp: a.timestamp,
        riskScore: a.overallScore,
        riskLevel: a.riskLevel,
        recommendation: a.recommendation,
        topFactors: a.riskFactors.slice(0, 3).map((f) => f.factor),
        chargebackRisk: (a.chargebackLikelihood.probability * 100).toFixed(1),
      })),
    performanceMetrics: {
      accuracy: 94.5, // Model accuracy %
      precision: 89.2, // Precision %
      recall: 91.8, // Recall %
      falsePositiveRate: 2.1, // False positive %
      modelConfidence: 87.3, // Avg model confidence %
    },
  };
}

async function getFraudAssessments(
  timeframe: string,
  riskLevel?: string,
  page: number = 1,
  limit: number = 50,
): Promise<FraudAssessmentsPayload> {
  let assessments = generateMockAssessments(500);

  if (riskLevel) {
    assessments = assessments.filter((a) => a.riskLevel === riskLevel);
  }

  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 50;
  const offset = (safePage - 1) * safeLimit;

  const paginatedAssessments: DashboardFraudAssessment[] = assessments
    .slice(offset, offset + safeLimit)
    .map((assessment, index) => ({
      ...assessment,
      id: `assessment_${(offset + index + 1).toString().padStart(4, '0')}`,
      orderId: `ord_${Math.random().toString(36).slice(2, 10)}`,
      customerEmail: `customer${offset + index + 1}@example.com`,
      orderValue: Number((Math.random() * 500 + 35).toFixed(2)),
      paymentMethod: randomChoice(PAYMENT_METHODS),
    }));

  return {
    assessments: paginatedAssessments,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total: assessments.length,
      totalPages: Math.max(1, Math.ceil(assessments.length / safeLimit)),
    },
  };
}

async function getVelocityAnalytics(_timeframe: string) {
  return {
    emailVelocity: {
      highVelocityEmails: 23,
      avgOrdersPerEmail: 1.2,
      maxOrdersPerEmail: 8,
      suspiciousPatterns: [
        {
          email: 'user***@tempmail.org',
          orderCount24h: 5,
          distinctIPs: 3,
          riskScore: 850,
        },
        {
          email: 'test***@10minutemail.com',
          orderCount24h: 4,
          distinctIPs: 2,
          riskScore: 720,
        },
      ],
    },
    ipVelocity: {
      highVelocityIPs: 18,
      avgOrdersPerIP: 1.8,
      maxOrdersPerIP: 12,
      vpnDetections: 45,
      proxyDetections: 23,
      suspiciousPatterns: [
        {
          ip: '192.168.***.*',
          orderCount24h: 8,
          distinctEmails: 6,
          vpnDetected: true,
          riskScore: 950,
        },
      ],
    },
    deviceVelocity: {
      highVelocityDevices: 12,
      avgOrdersPerDevice: 1.1,
      newDeviceRate: 78.5, // % of orders from new devices
      suspiciousPatterns: [
        {
          deviceId: 'fp_abc123',
          orderCount24h: 4,
          locationChanges: 8,
          riskScore: 780,
        },
      ],
    },
    cardVelocity: {
      highVelocityCards: 8,
      avgOrdersPerCard: 1.3,
      chargebackCards: 3,
      suspiciousPatterns: [
        {
          cardLast4: '****1234',
          orderCount24h: 6,
          distinctEmails: 4,
          chargebackHistory: 1,
          riskScore: 900,
        },
      ],
    },
  };
}

async function getDeviceAnalytics(_timeframe: string) {
  return {
    overview: {
      totalDevices: 2847,
      newDevices: 1756,
      returningDevices: 1091,
      highRiskDevices: 127,
      blockedDevices: 45,
    },
    fingerprinting: {
      uniqueFingerprints: 2847,
      duplicateFingerprints: 23,
      incompleteFingerprints: 156,
      fingerprintQuality: {
        high: 2156,
        medium: 534,
        low: 157,
      },
    },
    patterns: {
      multipleLocations: 78,
      rapidLocationChanges: 34,
      suspiciousUserAgents: 23,
      tamperingAttempts: 12,
    },
    topRiskyDevices: [
      {
        deviceId: 'fp_xyz789',
        riskScore: 950,
        orderCount: 8,
        locations: 5,
        countries: 3,
        lastSeen: new Date(Date.now() - 300000).toISOString(),
      },
      {
        deviceId: 'fp_abc456',
        riskScore: 880,
        orderCount: 6,
        locations: 4,
        countries: 2,
        lastSeen: new Date(Date.now() - 600000).toISOString(),
      },
    ],
  };
}

async function getChargebackPredictions(_timeframe: string) {
  const predictions = generateMockChargebackPredictions(100);

  return {
    overview: {
      totalPredictions: predictions.length,
      avgChargebackRisk: (
        (predictions.reduce((sum, p) => sum + p.probability, 0) /
          predictions.length) *
        100
      ).toFixed(2),
      highRiskTransactions: predictions.filter(
        (p) => p.riskBand === 'D' || p.riskBand === 'E',
      ).length,
      estimatedChargebacks: predictions
        .reduce((sum, p) => sum + p.probability, 0)
        .toFixed(1),
      estimatedLosses: predictions
        .reduce((sum, p) => sum + p.expectedLoss, 0)
        .toFixed(2),
    },
    riskBands: {
      A: predictions.filter((p) => p.riskBand === 'A').length,
      B: predictions.filter((p) => p.riskBand === 'B').length,
      C: predictions.filter((p) => p.riskBand === 'C').length,
      D: predictions.filter((p) => p.riskBand === 'D').length,
      E: predictions.filter((p) => p.riskBand === 'E').length,
    },
    topRiskFactors: [
      { factor: 'High order value', impact: 0.08, frequency: 23 },
      { factor: 'New customer', impact: 0.06, frequency: 156 },
      { factor: 'Geographic distance', impact: 0.05, frequency: 89 },
      { factor: 'Unusual time of day', impact: 0.04, frequency: 67 },
      { factor: 'VPN usage', impact: 0.07, frequency: 34 },
    ],
    highRiskPredictions: predictions
      .filter((p) => p.riskBand === 'D' || p.riskBand === 'E')
      .slice(0, 20)
      .map((p) => ({
        orderId: `ord_${Math.random().toString(36).substr(2, 8)}`,
        probability: (p.probability * 100).toFixed(1),
        riskBand: p.riskBand,
        expectedLoss: p.expectedLoss.toFixed(2),
        confidence: (p.confidence * 100).toFixed(1),
        orderValue: (Math.random() * 500 + 35).toFixed(2),
        customerEmail: `customer${Math.floor(Math.random() * 1000)}@example.com`,
      })),
  };
}

async function getFraudTrends(_timeframe: string) {
  const days = _timeframe === '7d' ? 7 : _timeframe === '30d' ? 30 : 90;
  const trends: FraudTrendPoint[] = [];

  for (let i = days; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    trends.push({
      date: date.toISOString().split('T')[0],
      totalAssessments: Math.floor(Math.random() * 100) + 50,
      highRisk: Math.floor(Math.random() * 20) + 5,
      declined: Math.floor(Math.random() * 15) + 2,
      avgRiskScore: Math.floor(Math.random() * 200) + 200,
      chargebackPredictions: Math.floor(Math.random() * 10) + 2,
      avgProcessingTime: Math.floor(Math.random() * 50) + 100,
    });
  }

  // Calculate percentage changes
  const recent = trends.slice(-7);
  const previous = trends.slice(-14, -7);

  const recentAvg =
    recent.reduce((sum, t) => sum + t.avgRiskScore, 0) / recent.length;
  const previousAvg =
    previous.reduce((sum, t) => sum + t.avgRiskScore, 0) / previous.length;
  const riskScoreChange = (
    ((recentAvg - previousAvg) / previousAvg) *
    100
  ).toFixed(1);

  const recentDeclined = recent.reduce((sum, t) => sum + t.declined, 0);
  const previousDeclined = previous.reduce((sum, t) => sum + t.declined, 0);
  const declineRateChange = (
    ((recentDeclined - previousDeclined) / previousDeclined) *
    100
  ).toFixed(1);

  return {
    trends,
    insights: {
      riskScoreChange: {
        value: riskScoreChange,
        direction:
          parseFloat(riskScoreChange) > 0 ? 'increasing' : 'decreasing',
      },
      declineRateChange: {
        value: declineRateChange,
        direction:
          parseFloat(declineRateChange) > 0 ? 'increasing' : 'decreasing',
      },
      seasonalPatterns: [
        'Fraud attempts increase 35% on weekends',
        'Higher risk scores during 2-6 AM hours',
        'Geographic distance fraud peaks on Fridays',
      ],
      emergingThreats: [
        'Increase in VPN-based fraud attempts (+23%)',
        'New device fingerprinting evasion techniques',
        'Coordinated attack pattern from Eastern Europe',
      ],
    },
  };
}

async function getFraudRules() {
  return {
    velocityRules: [
      {
        id: 'velocity_email_24h',
        name: 'Email 24h Velocity',
        description: 'Decline if email used >5 times in 24h',
        threshold: 5,
        action: 'decline',
        enabled: true,
        triggeredCount: 23,
      },
      {
        id: 'velocity_ip_1h',
        name: 'IP 1h Velocity',
        description: 'Review if IP used >3 times in 1h',
        threshold: 3,
        action: 'review',
        enabled: true,
        triggeredCount: 45,
      },
    ],
    geographicRules: [
      {
        id: 'geo_distance_500',
        name: 'High Geographic Distance',
        description: 'Review if IP >500km from billing address',
        threshold: 500,
        action: 'review',
        enabled: true,
        triggeredCount: 67,
      },
    ],
    paymentRules: [
      {
        id: 'payment_prepaid',
        name: 'Prepaid Card Block',
        description: 'Decline all prepaid card transactions',
        threshold: null,
        action: 'decline',
        enabled: false,
        triggeredCount: 12,
      },
    ],
    deviceRules: [
      {
        id: 'device_vpn',
        name: 'VPN Detection',
        description: 'Review transactions from VPN/Proxy',
        threshold: null,
        action: 'review',
        enabled: true,
        triggeredCount: 89,
      },
    ],
  };
}

async function updateAssessmentFeedback(
  assessmentId: string,
  actualOutcome: string,
  fraudConfirmed: boolean,
) {
  // In production, update the assessment with actual outcome for ML training
  console.log(
    `Updated assessment ${assessmentId}: outcome=${actualOutcome}, fraud=${fraudConfirmed}`,
  );
}

// Mock data generators
function generateMockAssessments(count: number): FraudRiskAssessment[] {
  const assessments: FraudRiskAssessment[] = [];

  for (let i = 0; i < count; i++) {
    const overallScore = randomInt(120, 980);
    const riskLevel: FraudRiskAssessment['riskLevel'] =
      overallScore >= 800
        ? 'very_high'
        : overallScore >= 600
          ? 'high'
          : overallScore >= 400
            ? 'medium'
            : overallScore >= 200
              ? 'low'
              : 'very_low';

    const deviceFingerprint = generateMockDeviceFingerprint(i);
    const velocityCheck = generateMockVelocityCheck(deviceFingerprint.id);
    const chargebackLikelihood = generateMockChargebackLikelihood();

    assessments.push({
      overallScore,
      riskLevel,
      recommendation:
        overallScore >= 700
          ? 'decline'
          : overallScore >= 500
            ? 'manual_review'
            : overallScore >= 300
              ? 'review'
              : 'approve',
      velocityScore: randomInt(80, 320),
      deviceScore: randomInt(60, 240),
      geographicScore: randomInt(60, 240),
      paymentScore: randomInt(60, 240),
      chargebackScore: Math.round(chargebackLikelihood.probability * 1000),
      riskFactors: generateMockRiskFactors(),
      velocityCheck,
      deviceFingerprint,
      chargebackLikelihood,
      actions: generateMockActions(riskLevel),
      processingTime: randomInt(120, 620),
      timestamp: new Date(
        Date.now() - randomInt(0, 30) * 24 * 60 * 60 * 1000 - randomInt(0, 23) * 60 * 60 * 1000,
      ).toISOString(),
    });
  }

  return assessments.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

type RiskFactor = {
  category: 'velocity' | 'device' | 'geographic' | 'payment' | 'behavioral';
  factor: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  impact: number;
  description: string;
};

function generateMockRiskFactors(): RiskFactor[] {
  const allFactors: RiskFactor[] = [
    {
      category: 'velocity',
      factor: 'high_email_velocity',
      severity: 'high',
      impact: 200,
      description: 'Email used in 5 orders in 24h',
    },
    {
      category: 'velocity',
      factor: 'high_ip_velocity',
      severity: 'medium',
      impact: 150,
      description: 'IP used in 8 orders this week',
    },
    {
      category: 'device',
      factor: 'vpn_detected',
      severity: 'medium',
      impact: 100,
      description: 'VPN or proxy usage detected',
    },
    {
      category: 'device',
      factor: 'new_device',
      severity: 'low',
      impact: 50,
      description: 'First time seeing this device',
    },
    {
      category: 'geographic',
      factor: 'country_mismatch',
      severity: 'medium',
      impact: 120,
      description: 'IP country differs from billing',
    },
    {
      category: 'geographic',
      factor: 'high_distance',
      severity: 'high',
      impact: 180,
      description: 'IP 800km from billing address',
    },
    {
      category: 'payment',
      factor: 'high_value_first_order',
      severity: 'medium',
      impact: 130,
      description: 'High-value first-time purchase',
    },
    {
      category: 'behavioral',
      factor: 'unusual_time',
      severity: 'low',
      impact: 60,
      description: 'Order placed at unusual hour',
    },
  ];

  const count = Math.floor(Math.random() * 4) + 1;
  return allFactors.sort(() => Math.random() - 0.5).slice(0, count);
}

function generateMockVelocityCheck(fingerprintId: string): VelocityCheck {
  const now = Date.now();
  const indicatorSets: readonly string[][] = [
    ['velocity_spike'],
    ['location_mismatch'],
    ['device_change'],
    ['velocity_spike', 'location_mismatch'],
    [],
  ];

  const randomEmail = `customer${Math.floor(Math.random() * 10000)}@example.com`;
  const randomIp = `192.168.${randomInt(0, 254)}.${randomInt(1, 254)}`;

  return {
    email: {
      address: randomEmail,
      orderCount24h: randomInt(0, 6),
      orderCountWeek: randomInt(1, 25),
      firstOrderDate: new Date(
        now - randomInt(30, 360) * 24 * 60 * 60 * 1000,
      ).toISOString(),
      lastOrderDate: new Date(
        now - randomInt(0, 72) * 60 * 60 * 1000,
      ).toISOString(),
      distinctIPs: randomInt(1, 7),
      distinctDevices: randomInt(1, 6),
      failedAttempts: randomInt(0, 3),
    },
    ip: {
      address: randomIp,
      orderCount24h: randomInt(0, 10),
      orderCountWeek: randomInt(1, 40),
      distinctEmails: randomInt(1, 12),
      distinctCards: randomInt(1, 10),
      firstSeen: new Date(
        now - randomInt(60, 360) * 24 * 60 * 60 * 1000,
      ).toISOString(),
      lastSeen: new Date(now - randomInt(0, 24) * 60 * 60 * 1000).toISOString(),
      vpnDetected: Math.random() < 0.25,
      proxyDetected: Math.random() < 0.2,
      riskLevel: randomChoice(['low', 'medium', 'high'] as const),
    },
    device: {
      fingerprintId,
      orderCount24h: randomInt(0, 5),
      orderCountWeek: randomInt(1, 18),
      distinctEmails: randomInt(1, 8),
      distinctCards: randomInt(1, 6),
      locationChanges: randomInt(0, 10),
      riskIndicators: [...randomChoice(indicatorSets)],
    },
    card: {
      last4: randomInt(1000, 9999).toString(),
      bin: randomInt(100000, 999999).toString(),
      orderCount24h: randomInt(0, 4),
      orderCountWeek: randomInt(1, 12),
      distinctEmails: randomInt(1, 6),
      distinctIPs: randomInt(1, 5),
      chargebackHistory: randomInt(0, 2),
      issuerCountry: randomChoice(['US', 'CA', 'GB', 'DE', 'AU']),
      cardType: randomChoice(['credit', 'debit', 'prepaid'] as const),
    },
  };
}

function generateMockDeviceFingerprint(seed: string | number): DeviceFingerprint {
  const seedString = String(seed);
  const now = Date.now();
  const fonts = ['Arial', 'Times New Roman', 'Helvetica', 'Georgia', 'Verdana', 'Courier New'];
  const plugins = ['Chrome PDF Plugin', 'Widevine CDM', 'QuickTime'];
  const locationCount = randomInt(1, 3);
  const locations = Array.from({ length: locationCount }).map((_, index) => ({
    ip: `192.168.${(seedString.length + index) % 255}.${randomInt(2, 254)}`,
    country: randomChoice(['US', 'CA', 'GB', 'DE', 'AU']),
    city: randomChoice(['New York', 'Los Angeles', 'London', 'Berlin', 'Sydney']),
    timestamp: new Date(now - index * 6 * 60 * 60 * 1000).toISOString(),
  }));

  const firstSeen = new Date(now - randomInt(1, 30) * 24 * 60 * 60 * 1000).toISOString();
  const lastSeen = new Date(now - randomInt(0, 12) * 60 * 60 * 1000).toISOString();

  return {
    id: `fp_${seedString}_${Math.random().toString(36).slice(2, 10)}`,
    userAgent: randomChoice([
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      'Mozilla/5.0 (X11; Linux x86_64)',
    ]),
    screen: {
      width: randomInt(1280, 2560),
      height: randomInt(720, 1440),
      colorDepth: 24,
      pixelRatio: randomChoice([1, 1.5, 2]),
    },
    timezone: randomChoice(['UTC', 'America/New_York', 'Europe/Berlin', 'Asia/Singapore']),
    language: randomChoice(['en-US', 'en-GB', 'de-DE']),
    platform: randomChoice(['Win32', 'MacIntel', 'Linux x86_64']),
    cookiesEnabled: true,
    localStorage: true,
    sessionStorage: true,
    canvas: Math.random().toString(36).slice(-16),
    webgl: Math.random().toString(36).slice(-16),
    fonts: fonts.slice(0, randomInt(2, fonts.length)),
    plugins: plugins.slice(0, randomInt(1, plugins.length)),
    firstSeen,
    lastSeen,
    useCount: randomInt(1, 25),
    locations,
    riskScore: randomInt(200, 900),
  };
}

function generateMockChargebackLikelihood(): FraudRiskAssessment['chargebackLikelihood'] {
  const probability = Number((Math.random() * 0.3).toFixed(3));
  const riskBand: FraudRiskAssessment['chargebackLikelihood']['riskBand'] =
    probability >= 0.2
      ? 'E'
      : probability >= 0.12
        ? 'D'
        : probability >= 0.07
          ? 'C'
          : probability >= 0.03
            ? 'B'
            : 'A';

  return {
    probability,
    riskBand,
    expectedLoss: Number((probability * (Math.random() * 600 + 50)).toFixed(2)),
    confidence: Number((0.6 + Math.random() * 0.4).toFixed(2)),
    factors: generateMockChargebackFactors(),
  };
}

function generateMockActions(
  riskLevel: FraudRiskAssessment['riskLevel'],
): FraudRiskAssessment['actions'] {
  const actions: FraudRiskAssessment['actions'] = [
    {
      type: 'monitor',
      reason: 'Baseline monitoring',
      priority: 'low',
      automated: true,
    },
  ];

  if (riskLevel === 'high' || riskLevel === 'very_high') {
    actions.push(
      {
        type: 'review',
        reason: 'Requires manual analyst review',
        priority: 'high',
        automated: false,
      },
      {
        type: 'flag',
        reason: 'Flag for future velocity checks',
        priority: 'medium',
        automated: true,
      },
    );

    if (riskLevel === 'very_high') {
      actions.push({
        type: 'decline',
        reason: 'Risk exceeds acceptable threshold',
        priority: 'high',
        automated: false,
      });
    }
  } else if (riskLevel === 'medium') {
    actions.push({
      type: 'verify',
      reason: 'Request additional verification evidence',
      priority: 'medium',
      automated: false,
    });
  } else {
    actions.push({
      type: 'approve',
      reason: 'Low risk assessment',
      priority: 'low',
      automated: true,
    });
  }

  return actions;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice<T>(items: readonly T[]): T {
  return items[randomInt(0, items.length - 1)];
}

function generateMockChargebackPredictions(count: number): ChargebackPrediction[] {
  const predictions: ChargebackPrediction[] = [];

  for (let i = 0; i < count; i++) {
    const probability = Math.random() * 0.3;
    const riskBand =
      probability >= 0.15
        ? 'E'
        : probability >= 0.08
          ? 'D'
          : probability >= 0.04
            ? 'C'
            : probability >= 0.02
              ? 'B'
              : 'A';

    predictions.push({
      probability,
      riskBand,
      expectedLoss: probability * (Math.random() * 500 + 35) * 2,
      confidence: Math.random() * 0.4 + 0.6,
    });
  }

  return predictions;
}
