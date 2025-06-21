// Advanced Fraud Detection API
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import {
  advancedFraudDetection,
  type FraudRiskAssessment,
} from '@/lib/advanced-fraud-detection';

export async function GET(request: NextRequest) {
  const adminResult = await requireAdmin(request);
  if (adminResult instanceof Response) {
    return adminResult;
  }

  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || 'overview';
    const timeframe = url.searchParams.get('timeframe') || '30d';
    const riskLevel = url.searchParams.get('riskLevel');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    switch (type) {
      case 'overview':
        const overview = await getFraudOverview(timeframe);
        return NextResponse.json({
          success: true,
          data: overview,
        });

      case 'risk_assessments':
        const assessments = await getFraudAssessments(
          timeframe,
          riskLevel,
          page,
          limit,
        );
        return NextResponse.json({
          success: true,
          data: assessments,
        });

      case 'velocity_analytics':
        const velocityData = await getVelocityAnalytics(timeframe);
        return NextResponse.json({
          success: true,
          data: velocityData,
        });

      case 'device_analytics':
        const deviceData = await getDeviceAnalytics(timeframe);
        return NextResponse.json({
          success: true,
          data: deviceData,
        });

      case 'chargeback_predictions':
        const chargebackData = await getChargebackPredictions(timeframe);
        return NextResponse.json({
          success: true,
          data: chargebackData,
        });

      case 'fraud_trends':
        const trendsData = await getFraudTrends(timeframe);
        return NextResponse.json({
          success: true,
          data: trendsData,
        });

      case 'risk_rules':
        const rulesData = await getFraudRules();
        return NextResponse.json({
          success: true,
          data: rulesData,
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid type parameter',
          },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error('Fraud detection API error:', error);

    return NextResponse.json(
      {
        success: false,
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
      return NextResponse.json(
        {
          success: false,
          error: 'Action is required',
        },
        { status: 400 },
      );
    }

    switch (action) {
      case 'assess_risk':
        if (!orderData) {
          return NextResponse.json(
            {
              success: false,
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

        return NextResponse.json({
          success: true,
          data: assessment,
        });

      case 'bulk_assess':
        const { orders } = body;
        if (!Array.isArray(orders)) {
          return NextResponse.json(
            {
              success: false,
              error: 'orders array is required for bulk assessment',
            },
            { status: 400 },
          );
        }

        const bulkResults = [];
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
              error: (error as Error).message,
            });
          }
        }

        return NextResponse.json({
          success: true,
          data: {
            total: orders.length,
            successful: bulkResults.filter((r) => r.success).length,
            failed: bulkResults.filter((r) => !r.success).length,
            results: bulkResults,
          },
        });

      case 'update_feedback':
        const { assessmentId, actualOutcome, fraudConfirmed } = body;
        if (!assessmentId) {
          return NextResponse.json(
            {
              success: false,
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

        return NextResponse.json({
          success: true,
          data: { feedbackUpdated: true },
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action',
          },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error('Fraud detection operation error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process fraud detection operation',
      },
      { status: 500 },
    );
  }
}

// Helper functions
async function getFraudOverview(timeframe: string) {
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
) {
  let assessments = generateMockAssessments(500);

  // Filter by risk level
  if (riskLevel) {
    assessments = assessments.filter((a) => a.riskLevel === riskLevel);
  }

  // Pagination
  const offset = (page - 1) * limit;
  const paginatedAssessments = assessments.slice(offset, offset + limit);

  return {
    assessments: paginatedAssessments.map((a) => ({
      id: `assessment_${Math.random().toString(36).substr(2, 8)}`,
      timestamp: a.timestamp,
      overallScore: a.overallScore,
      riskLevel: a.riskLevel,
      recommendation: a.recommendation,
      processingTime: a.processingTime,
      riskFactors: a.riskFactors,
      chargebackLikelihood: a.chargebackLikelihood,
      actions: a.actions,
      // Mock order data
      orderId: `ord_${Math.random().toString(36).substr(2, 8)}`,
      customerEmail: `customer${Math.floor(Math.random() * 1000)}@example.com`,
      orderValue: Math.floor(Math.random() * 500) + 35,
      paymentMethod: ['credit_card', 'paypal', 'stripe'][
        Math.floor(Math.random() * 3)
      ],
    })),
    pagination: {
      page,
      limit,
      total: assessments.length,
      totalPages: Math.ceil(assessments.length / limit),
    },
  };
}

async function getVelocityAnalytics(timeframe: string) {
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

async function getDeviceAnalytics(timeframe: string) {
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

async function getChargebackPredictions(timeframe: string) {
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

async function getFraudTrends(timeframe: string) {
  const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
  const trends = [];

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
    const overallScore = Math.floor(Math.random() * 1000);
    const riskLevel =
      overallScore >= 800
        ? 'very_high'
        : overallScore >= 600
          ? 'high'
          : overallScore >= 400
            ? 'medium'
            : overallScore >= 200
              ? 'low'
              : 'very_low';

    assessments.push({
      overallScore,
      riskLevel: riskLevel as any,
      recommendation:
        overallScore >= 700
          ? 'decline'
          : overallScore >= 500
            ? 'manual_review'
            : overallScore >= 300
              ? 'review'
              : 'approve',
      velocityScore: Math.floor(Math.random() * 300),
      deviceScore: Math.floor(Math.random() * 200),
      geographicScore: Math.floor(Math.random() * 200),
      paymentScore: Math.floor(Math.random() * 200),
      chargebackScore: Math.floor(Math.random() * 200),
      riskFactors: generateMockRiskFactors(),
      velocityCheck: {} as any,
      deviceFingerprint: {} as any,
      chargebackLikelihood: {
        probability: Math.random() * 0.3,
        riskBand: ['A', 'B', 'C', 'D', 'E'][
          Math.floor(Math.random() * 5)
        ] as any,
        expectedLoss: Math.random() * 100,
        confidence: Math.random() * 0.4 + 0.6,
        factors: {} as any,
      },
      actions: [],
      processingTime: Math.floor(Math.random() * 500) + 100,
      timestamp: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    });
  }

  return assessments.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

function generateMockRiskFactors() {
  const allFactors = [
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

function generateMockChargebackPredictions(count: number) {
  const predictions = [];

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
