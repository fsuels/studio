import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import {
  type FraudRiskAssessment,
  type VelocityCheck,
  type DeviceFingerprint,
  type ChargebackRiskFactors,
} from '@/lib/advanced-fraud-detection';

export const dynamic = 'force-dynamic';

type SuccessDoc =
  | 'fraud.overview'
  | 'fraud.assessments'
  | 'fraud.velocity'
  | 'fraud.devices'
  | 'fraud.chargeback'
  | 'fraud.trends'
  | 'fraud.rules';


type SuccessResponse<
  TDoc extends SuccessDoc,
  TData extends Record<string, unknown>,
> = {
  status: 'success';
  success: true;
  docType: TDoc;
  data: TData;
};

type ErrorResponse = {
  status: 'error';
  success: false;
  docType: 'fraud.error';
  error: string;
};

type PaymentMethod = 'credit_card' | 'paypal' | 'stripe';

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


const RISK_LEVELS: FraudRiskAssessment['riskLevel'][] = [
  'very_low',
  'low',
  'medium',
  'high',
  'very_high',
];

const DOC_TYPE_ALIASES: Record<string, SuccessDoc> = {
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
  devices: 'fraud.devices',
  device: 'fraud.devices',
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

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof Response) {
    return authResult;
  }

  const url = new URL(request.url);
  const docType = resolveDocType(
    url.searchParams.get('docType') ?? url.searchParams.get('type') ?? 'overview',
  );

  if (!docType) {
    return errorResponse('Invalid docType parameter', 400);
  }

  const timeframe = url.searchParams.get('timeframe') ?? '30d';
  const riskLevelParam = url.searchParams.get('riskLevel');
  const parsedPage = Number.parseInt(url.searchParams.get('page') ?? '1', 10);
  const parsedLimit = Number.parseInt(url.searchParams.get('limit') ?? '50', 10);
  const page = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
  const limitRaw = Number.isNaN(parsedLimit) || parsedLimit < 1 ? 50 : parsedLimit;
  const limit = Math.min(limitRaw, 100);

  switch (docType) {
    case 'fraud.overview':
      return successResponse(docType, buildOverview(timeframe));
    case 'fraud.assessments':
      return successResponse(
        docType,
        buildAssessments({
          timeframe,
          riskLevel: normaliseRiskLevel(riskLevelParam),
          page,
          limit,
        }),
      );
    case 'fraud.velocity':
      return successResponse(docType, buildVelocityAnalytics(timeframe));
    case 'fraud.devices':
      return successResponse(docType, buildDeviceAnalytics(timeframe));
    case 'fraud.chargeback':
      return successResponse(docType, buildChargebackInsights(timeframe));
    case 'fraud.trends':
      return successResponse(docType, buildFraudTrends(timeframe));
    case 'fraud.rules':
      return successResponse(docType, buildFraudRules());
    default:
      return errorResponse('Unsupported docType', 400);
  }
}

function resolveDocType(value: string | null): SuccessDoc | null {
  if (!value) {
    return null;
  }
  const key = value.trim().toLowerCase();
  return DOC_TYPE_ALIASES[key] ?? null;
}

function normaliseRiskLevel(value: string | null): FraudRiskAssessment['riskLevel'] | undefined {
  if (!value) {
    return undefined;
  }
  const candidate = value.trim().toLowerCase();
  return RISK_LEVELS.find((level) => level === candidate) ?? undefined;
}

function successResponse<TDoc extends SuccessDoc, TData extends Record<string, unknown>>(
  docType: TDoc,
  data: TData,
) {
  return NextResponse.json<SuccessResponse<TDoc, TData>>({
    status: 'success',
    success: true,
    docType,
    data,
  });
}

function errorResponse(message: string, status: number) {
  return NextResponse.json<ErrorResponse>(
    {
      status: 'error',
      success: false,
      docType: 'fraud.error',
      error: message,
    },
    { status },
  );
}

function buildOverview(timeframe: string): OverviewPayload {
  const horizonDays = resolveHorizonDays(timeframe);
  const totalAssessments = randomInt(400, 800);
  const highRiskCount = randomInt(40, 120);
  const autoDeclined = Math.floor(highRiskCount * 0.35);
  const manualReviews = Math.floor(highRiskCount * 0.45);

  const riskDistribution = {
    very_low: randomInt(80, 120),
    low: randomInt(120, 180),
    medium: randomInt(90, 140),
    high: randomInt(40, 70),
    very_high: randomInt(15, 30),
  };

  const topRiskFactors = generateMockRiskFactors()
    .slice(0, 8)
    .map((factor, index) => ({
      factor: factor.factor,
      count: randomInt(12, 60),
      percentage: Number((randomFloat(2, 8) * (index + 1)).toFixed(1)),
    }));

  const recentHighRisk = Array.from({ length: 10 }, (_, idx) => {
    const assessment = generateMockAssessment({ seed: idx, level: 'high' });
    return {
      id: assessment.id,
      timestamp: assessment.timestamp,
      riskScore: assessment.overallScore,
      riskLevel: assessment.riskLevel,
      recommendation: assessment.recommendation,
      topFactors: assessment.riskFactors.slice(0, 3).map((factor) => factor.factor),
      chargebackRisk: Number((assessment.chargebackLikelihood.probability * 100).toFixed(1)),
    };
  });

  const performanceMetrics = {
    accuracy: Number(randomFloat(92, 97).toFixed(1)),
    precision: Number(randomFloat(88, 94).toFixed(1)),
    recall: Number(randomFloat(89, 95).toFixed(1)),
    falsePositiveRate: Number(randomFloat(2, 4).toFixed(1)),
    modelConfidence: Number(randomFloat(85, 92).toFixed(1)),
  };

  return {
    summary: {
      totalAssessments,
      highRiskCount,
      highRiskPercentage: Number(((highRiskCount / totalAssessments) * 100).toFixed(1)),
      autoDeclined,
      autoDeclineRate: Number(((autoDeclined / totalAssessments) * 100).toFixed(1)),
      manualReviews,
      manualReviewRate: Number(((manualReviews / totalAssessments) * 100).toFixed(1)),
      avgProcessingTime: randomInt(210, 360),
      avgRiskScore: randomInt(420, 610),
      avgChargebackRisk: Number(randomFloat(6, 14).toFixed(1)),
      highChargebackRisk: randomInt(18, 42),
      fraudPrevented: autoDeclined + Math.floor(manualReviews * 0.3),
      estimatedSavings: (autoDeclined + Math.floor(manualReviews * 0.3)) * 75,
    },
    riskDistribution,
    topRiskFactors,
    recentHighRisk,
    performanceMetrics,
    horizonDays,
  };
}

function buildAssessments(options: {
  timeframe: string;
  riskLevel?: FraudRiskAssessment['riskLevel'];
  page: number;
  limit: number;
}): FraudAssessmentsPayload {
  const poolSize = 180;
  const baseAssessments = Array.from({ length: poolSize }, (_, idx) =>
    generateMockAssessment({ seed: idx }),
  );

  const filtered = options.riskLevel
    ? baseAssessments.filter((assessment) => assessment.riskLevel === options.riskLevel)
    : baseAssessments;

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / options.limit));
  const offset = (options.page - 1) * options.limit;
  const assessments = filtered.slice(offset, offset + options.limit);

  return {
    assessments,
    pagination: {
      page: options.page,
      limit: options.limit,
      total,
      totalPages,
    },
  };
}

function buildVelocityAnalytics(_timeframe: string): VelocityPayload {
  return {
    emailVelocity: {
      highVelocityEmails: randomInt(20, 34),
      avgOrdersPerEmail: Number(randomFloat(1.1, 1.6).toFixed(2)),
      maxOrdersPerEmail: randomInt(6, 10),
      suspiciousPatterns: Array.from({ length: 4 }, () => ({
        email: `user${randomInt(1200, 9800)}@tempmail.org`,
        orderCount24h: randomInt(4, 9),
        distinctIPs: randomInt(2, 5),
        riskScore: Number(randomFloat(0.7, 0.95).toFixed(2)),
      })),
    },
    ipVelocity: {
      highVelocityIPs: randomInt(14, 26),
      avgOrdersPerIP: Number(randomFloat(1.4, 2.2).toFixed(2)),
      maxOrdersPerIP: randomInt(10, 18),
      vpnDetections: randomInt(18, 35),
      proxyDetections: randomInt(10, 24),
      suspiciousPatterns: Array.from({ length: 3 }, () => ({
        ip: `${randomInt(10, 240)}.${randomInt(0, 255)}.${randomInt(0, 255)}.${randomInt(1, 254)}`,
        orderCount24h: randomInt(6, 12),
        distinctEmails: randomInt(4, 9),
        vpnDetected: Math.random() > 0.5,
        riskScore: Number(randomFloat(0.75, 0.96).toFixed(2)),
      })),
    },
    deviceVelocity: {
      highVelocityDevices: randomInt(10, 18),
      avgOrdersPerDevice: Number(randomFloat(1.0, 1.3).toFixed(2)),
      newDeviceRate: Number(randomFloat(68, 82).toFixed(1)),
      suspiciousPatterns: Array.from({ length: 3 }, () => ({
        deviceId: `fp_${Math.random().toString(36).slice(2, 10)}`,
        orderCount24h: randomInt(4, 7),
        locationChanges: randomInt(5, 11),
        riskScore: Number(randomFloat(0.68, 0.9).toFixed(2)),
      })),
    },
    cardVelocity: {
      highVelocityCards: randomInt(7, 12),
      avgOrdersPerCard: Number(randomFloat(1.2, 1.6).toFixed(2)),
      chargebackCards: randomInt(2, 5),
      suspiciousPatterns: Array.from({ length: 3 }, () => ({
        cardLast4: `${randomInt(1000, 9999)}`,
        orderCount24h: randomInt(5, 9),
        distinctEmails: randomInt(3, 6),
        chargebackHistory: randomInt(0, 2),
        riskScore: Number(randomFloat(0.72, 0.93).toFixed(2)),
      })),
    },
  };
}

function buildDeviceAnalytics(_timeframe: string): DeviceAnalyticsPayload {
  return {
    overview: {
      totalDevices: randomInt(2400, 3100),
      newDevices: randomInt(1400, 1900),
      returningDevices: randomInt(900, 1200),
      highRiskDevices: randomInt(120, 190),
      blockedDevices: randomInt(35, 70),
    },
    fingerprinting: {
      uniqueFingerprints: randomInt(2300, 2800),
      duplicateFingerprints: randomInt(18, 36),
      incompleteFingerprints: randomInt(140, 210),
      fingerprintQuality: {
        high: randomInt(1800, 2200),
        medium: randomInt(380, 520),
        low: randomInt(120, 180),
      },
    },
    patterns: {
      multipleLocations: randomInt(70, 110),
      rapidLocationChanges: randomInt(32, 58),
      suspiciousUserAgents: randomInt(18, 35),
      tamperingAttempts: randomInt(10, 22),
    },
    topRiskyDevices: Array.from({ length: 5 }, (_, idx) => ({
      deviceId: `fp_${Math.random().toString(36).slice(2, 10)}`,
      riskScore: randomInt(780, 980),
      orderCount: randomInt(5, 11),
      locations: randomInt(3, 8),
      countries: randomInt(2, 4),
      lastSeen: new Date(Date.now() - idx * 15 * 60 * 1000).toISOString(),
    })),
  };
}

function buildChargebackInsights(_timeframe: string): ChargebackPayload {
  const riskBands: Record<'A' | 'B' | 'C' | 'D' | 'E', number> = {
    A: randomInt(40, 60),
    B: randomInt(30, 50),
    C: randomInt(20, 40),
    D: randomInt(15, 25),
    E: randomInt(8, 18),
  };
  const totalPredictions = Object.values(riskBands).reduce((sum, count) => sum + count, 0);
  const highRiskTransactions = riskBands.D + riskBands.E;

  return {
    overview: {
      totalPredictions,
      avgChargebackRisk: Number(randomFloat(6, 14).toFixed(2)),
      highRiskTransactions,
      estimatedChargebacks: Number(randomFloat(12, 28).toFixed(1)),
      estimatedLosses: Number(randomFloat(1800, 3600).toFixed(2)),
    },
    riskBands,
    topRiskFactors: [
      { factor: 'High order value', impact: 0.08, frequency: randomInt(20, 38) },
      { factor: 'New customer', impact: 0.06, frequency: randomInt(30, 48) },
      { factor: 'Geographic distance', impact: 0.05, frequency: randomInt(22, 34) },
      { factor: 'Unusual time of day', impact: 0.04, frequency: randomInt(18, 28) },
      { factor: 'VPN usage', impact: 0.07, frequency: randomInt(14, 22) },
    ],
    highRiskPredictions: Array.from({ length: 20 }, (_, idx) => ({
      orderId: `ord_${Math.random().toString(36).slice(2, 10)}`,
      probability: Number(randomFloat(12, 28).toFixed(1)),
      riskBand: idx % 2 === 0 ? 'D' : 'E',
      expectedLoss: Number(randomFloat(120, 480).toFixed(2)),
      confidence: Number(randomFloat(68, 92).toFixed(1)),
      orderValue: Number(randomFloat(80, 620).toFixed(2)),
      customerEmail: `customer${randomInt(1000, 9999)}@example.com`,
    })),
  };
}

function buildFraudTrends(timeframe: string): FraudTrendsPayload {
  const days = resolveHorizonDays(timeframe);
  const trends = Array.from({ length: days }, (_, index) => {
    const dayOffset = days - index;
    const date = new Date(Date.now() - dayOffset * 24 * 60 * 60 * 1000);
    return {
      date: date.toISOString().split('T')[0],
      totalAssessments: randomInt(55, 140),
      highRisk: randomInt(8, 24),
      declined: randomInt(4, 16),
      avgRiskScore: randomInt(380, 620),
      chargebackPredictions: randomInt(6, 18),
      avgProcessingTime: randomInt(180, 360),
    };
  });

  const recent = trends.slice(-7);
  const previous = trends.slice(-14, -7);
  const riskScoreChange = calculatePercentageChange(
    recent.reduce((sum, item) => sum + item.avgRiskScore, 0) / recent.length,
    previous.length
      ? previous.reduce((sum, item) => sum + item.avgRiskScore, 0) / previous.length
      : undefined,
  );
  const declineRateChange = calculatePercentageChange(
    recent.reduce((sum, item) => sum + item.declined, 0),
    previous.length ? previous.reduce((sum, item) => sum + item.declined, 0) : undefined,
  );

  return {
    trends,
    insights: {
      riskScoreChange,
      declineRateChange,
      seasonalPatterns: [
        'Fraud attempts increase 35% on weekends',
        'Higher risk scores during 2-6 AM hours',
        'Geographic distance fraud peaks on Fridays',
      ],
      emergingThreats: [
        'Increase in VPN-based fraud attempts (+23%)',
        'New device fingerprinting evasion techniques',
        'Coordinated attack pattern observed across three regions',
      ],
    },
  };
}

function buildFraudRules(): FraudRulesPayload {
  return {
    velocityRules: [
      {
        id: 'velocity_email_24h',
        name: 'Email 24h Velocity',
        description: 'Decline if email used more than five times in 24 hours',
        threshold: 5,
        action: 'decline',
        enabled: true,
        triggeredCount: randomInt(20, 42),
      },
      {
        id: 'velocity_ip_1h',
        name: 'IP 1h Velocity',
        description: 'Review if IP used more than three times in one hour',
        threshold: 3,
        action: 'review',
        enabled: true,
        triggeredCount: randomInt(38, 64),
      },
    ],
    geographicRules: [
      {
        id: 'geo_distance_500',
        name: 'High Geographic Distance',
        description: 'Review if IP is more than 500km from billing address',
        threshold: 500,
        action: 'review',
        enabled: true,
        triggeredCount: randomInt(28, 44),
      },
    ],
    paymentRules: [
      {
        id: 'payment_prepaid',
        name: 'Prepaid Card Block',
        description: 'Decline transactions using prepaid cards for orders over $250',
        threshold: 250,
        action: 'decline',
        enabled: false,
        triggeredCount: randomInt(6, 12),
      },
    ],
    deviceRules: [
      {
        id: 'device_vpn',
        name: 'VPN Detection',
        description: 'Review transactions when VPN or proxy usage is detected',
        threshold: null,
        action: 'review',
        enabled: true,
        triggeredCount: randomInt(48, 82),
      },
    ],
  };
}

function calculatePercentageChange(current: number, previous?: number) {
  if (!previous || previous === 0) {
    return { value: 0, direction: 'stable' as const };
  }
  const value = Number((((current - previous) / previous) * 100).toFixed(1));
  return {
    value,
    direction: value > 0 ? ('increasing' as const) : ('decreasing' as const),
  };
}

function resolveHorizonDays(timeframe: string): number {
  switch (timeframe) {
    case '7d':
      return 7;
    case '90d':
      return 90;
    case '1y':
      return 365;
    default:
      return 30;
  }
}

interface AssessmentOptions {
  seed: number;
  level?: FraudRiskAssessment['riskLevel'];
}

function generateMockAssessment({ seed, level }: AssessmentOptions): DashboardFraudAssessment {
  const riskLevel = level ?? pick(RISK_LEVELS);
  const overallScore = deriveOverallScore(riskLevel);
  const velocityCheck = generateMockVelocityCheck(seed);
  const deviceFingerprint = generateMockDeviceFingerprint(seed);
  const chargebackLikelihood = generateMockChargebackLikelihood();
  const riskFactors = generateMockRiskFactors();
  const recommendation = deriveRecommendation(riskLevel, overallScore);
  const actions = generateMockActions(riskLevel);
  const timestamp = new Date(Date.now() - seed * 45 * 60 * 1000).toISOString();
  const assessment: FraudRiskAssessment = {
    overallScore,
    riskLevel,
    recommendation,
    velocityScore: randomInt(150, 320),
    deviceScore: randomInt(120, 260),
    geographicScore: randomInt(110, 240),
    paymentScore: randomInt(120, 260),
    chargebackScore: Math.round(chargebackLikelihood.probability * 1000),
    riskFactors,
    velocityCheck,
    deviceFingerprint,
    chargebackLikelihood,
    actions,
    processingTime: randomInt(180, 420),
    timestamp,
  };

  return {
    ...assessment,
    id: `assessment_${seed.toString().padStart(4, '0')}`,
    orderId: `ord_${Math.random().toString(36).slice(2, 10)}`,
    customerEmail: `customer${randomInt(1000, 9999)}@example.com`,
    orderValue: Number(randomFloat(45, 620).toFixed(2)),
    paymentMethod: pick(['credit_card', 'paypal', 'stripe'] as const),
  };
}

function deriveOverallScore(level: FraudRiskAssessment['riskLevel']) {
  switch (level) {
    case 'very_low':
      return randomInt(120, 240);
    case 'low':
      return randomInt(240, 420);
    case 'medium':
      return randomInt(420, 620);
    case 'high':
      return randomInt(620, 820);
    case 'very_high':
    default:
      return randomInt(820, 980);
  }
}

function deriveRecommendation(
  level: FraudRiskAssessment['riskLevel'],
  score: number,
): FraudRiskAssessment['recommendation'] {
  if (level === 'very_high' || score >= 820) {
    return 'decline';
  }
  if (level === 'high' || score >= 680) {
    return 'manual_review';
  }
  if (level === 'medium') {
    return 'review';
  }
  return 'approve';
}

function generateMockRiskFactors() {
  const catalog = [
    {
      category: 'velocity',
      factor: 'high_email_velocity',
      severity: 'high',
      impact: randomInt(140, 210),
      description: 'Email observed across multiple orders in short interval',
    },
    {
      category: 'velocity',
      factor: 'ip_velocity_spike',
      severity: 'medium',
      impact: randomInt(110, 180),
      description: 'IP address used for numerous orders this week',
    },
    {
      category: 'device',
      factor: 'vpn_detected',
      severity: 'medium',
      impact: randomInt(90, 150),
      description: 'VPN or proxy usage detected during checkout',
    },
    {
      category: 'geographic',
      factor: 'country_mismatch',
      severity: 'high',
      impact: randomInt(160, 220),
      description: 'IP country differs from billing country',
    },
    {
      category: 'payment',
      factor: 'prepaid_card_usage',
      severity: 'medium',
      impact: randomInt(100, 170),
      description: 'Prepaid card detected for high-value order',
    },
    {
      category: 'behavioral',
      factor: 'rapid_form_completion',
      severity: 'low',
      impact: randomInt(60, 120),
      description: 'Form submitted significantly faster than average customer',
    },
  ] as const;
  return Array.from({ length: randomInt(3, 5) }, () => pick(catalog));
}

function generateMockVelocityCheck(seed: number): VelocityCheck {
  const now = Date.now();
  return {
    email: {
      address: `customer${seed}@example.com`,
      orderCount24h: randomInt(1, 6),
      orderCountWeek: randomInt(3, 18),
      firstOrderDate: new Date(now - randomInt(15, 180) * 24 * 60 * 60 * 1000).toISOString(),
      lastOrderDate: new Date(now - randomInt(1, 72) * 60 * 60 * 1000).toISOString(),
      distinctIPs: randomInt(1, 5),
      distinctDevices: randomInt(1, 4),
      failedAttempts: randomInt(0, 3),
    },
    ip: {
      address: `${randomInt(10, 240)}.${randomInt(0, 255)}.${randomInt(0, 255)}.${randomInt(1, 254)}`,
      orderCount24h: randomInt(1, 12),
      orderCountWeek: randomInt(3, 32),
      distinctEmails: randomInt(1, 8),
      distinctCards: randomInt(1, 6),
      firstSeen: new Date(now - randomInt(30, 300) * 24 * 60 * 60 * 1000).toISOString(),
      lastSeen: new Date(now - randomInt(1, 48) * 60 * 60 * 1000).toISOString(),
      vpnDetected: Math.random() > 0.7,
      proxyDetected: Math.random() > 0.6,
      riskLevel: pick(['low', 'medium', 'high'] as const),
    },
    device: {
      fingerprintId: `fp_${Math.random().toString(36).slice(2, 10)}`,
      orderCount24h: randomInt(0, 5),
      orderCountWeek: randomInt(1, 16),
      distinctEmails: randomInt(1, 7),
      distinctCards: randomInt(1, 5),
      locationChanges: randomInt(0, 6),
      riskIndicators: ['velocity_spike', 'location_mismatch', 'device_change'].filter(
        () => Math.random() > 0.5,
      ),
    },
    card: {
      last4: `${randomInt(1000, 9999)}`,
      bin: `${randomInt(100000, 999999)}`,
      orderCount24h: randomInt(0, 4),
      orderCountWeek: randomInt(1, 10),
      distinctEmails: randomInt(1, 5),
      distinctIPs: randomInt(1, 4),
      chargebackHistory: randomInt(0, 3),
      issuerCountry: pick(['US', 'CA', 'GB', 'DE', 'AU'] as const),
      cardType: pick(['credit', 'debit', 'prepaid'] as const),
    },
  };
}

function generateMockDeviceFingerprint(seed: number): DeviceFingerprint {
  const now = Date.now();
  return {
    id: `fp_${seed}_${Math.random().toString(36).slice(2, 8)}`,
    userAgent: pick([
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      'Mozilla/5.0 (X11; Linux x86_64)',
    ] as const),
    screen: {
      width: pick([1280, 1440, 1920, 2560] as const),
      height: pick([720, 900, 1080, 1440] as const),
      colorDepth: 24,
      pixelRatio: pick([1, 1.5, 2] as const),
    },
    timezone: pick(['UTC', 'America/New_York', 'Europe/Berlin', 'Asia/Singapore'] as const),
    language: pick(['en-US', 'en-GB', 'de-DE'] as const),
    platform: pick(['Win32', 'MacIntel', 'Linux x86_64'] as const),
    cookiesEnabled: true,
    localStorage: true,
    sessionStorage: true,
    canvas: Math.random().toString(36).slice(-16),
    webgl: Math.random().toString(36).slice(-16),
    fonts: pick([
      ['Arial', 'Helvetica', 'Georgia'],
      ['Roboto', 'Open Sans', 'Lato'],
      ['Times New Roman', 'Calibri', 'Verdana'],
    ] as const),
    plugins: pick([
      ['Chrome PDF Plugin', 'Widevine CDM'],
      ['QuickTime', 'Shockwave Flash'],
      ['Java Applet Plug-in', 'Unity Player'],
    ] as const),
    firstSeen: new Date(now - randomInt(60, 180) * 24 * 60 * 60 * 1000).toISOString(),
    lastSeen: new Date(now - randomInt(1, 10) * 24 * 60 * 60 * 1000).toISOString(),
    useCount: randomInt(1, 24),
    locations: Array.from({ length: randomInt(1, 3) }, (_, idx) => ({
      ip: `${randomInt(10, 240)}.${randomInt(0, 255)}.${randomInt(0, 255)}.${randomInt(1, 254)}`,
      country: pick(['US', 'CA', 'GB', 'DE', 'AU'] as const),
      city: pick(['New York', 'Los Angeles', 'London', 'Berlin', 'Sydney'] as const),
      timestamp: new Date(now - idx * 6 * 60 * 60 * 1000).toISOString(),
    })),
    riskScore: Number(randomFloat(120, 880).toFixed(2)),
  };
}

function generateMockChargebackFactors(): ChargebackRiskFactors {
  return {
    customerAge: randomInt(10, 1200),
    totalOrders: randomInt(1, 120),
    totalSpent: Number(randomFloat(120, 16000).toFixed(2)),
    chargebackHistory: randomInt(0, 5),
    disputeHistory: randomInt(0, 4),
    orderValue: Number(randomFloat(25, 900).toFixed(2)),
    avgOrderValue: Number(randomFloat(40, 520).toFixed(2)),
    orderValueStdDev: Number(randomFloat(12, 140).toFixed(2)),
    timeOfDay: randomInt(0, 23),
    dayOfWeek: randomInt(0, 6),
    ipCountry: pick(['US', 'CA', 'GB', 'DE', 'AU', 'FR'] as const),
    billingCountry: pick(['US', 'CA', 'GB', 'DE', 'AU', 'FR'] as const),
    shippingCountry: Math.random() > 0.7 ? pick(['US', 'CA', 'GB', 'DE', 'AU', 'FR'] as const) : undefined,
    distanceKm: Number(randomFloat(20, 4500).toFixed(2)),
    highRiskCountry: Math.random() > 0.85,
    paymentMethod: pick(['credit_card', 'paypal', 'bank_transfer'] as const),
    cardCountry: pick(['US', 'CA', 'GB', 'DE', 'AU', 'FR'] as const),
    cardType: pick(['credit', 'debit', 'prepaid'] as const),
    binRiskLevel: pick(['low', 'medium', 'high'] as const),
    emailVelocity: Number(randomFloat(0.5, 8.2).toFixed(2)),
    ipVelocity: Number(randomFloat(0.5, 6.5).toFixed(2)),
    deviceVelocity: Number(randomFloat(0.3, 5.1).toFixed(2)),
    deviceRisk: Number(randomFloat(10, 98).toFixed(2)),
    emailRisk: Number(randomFloat(10, 98).toFixed(2)),
    vpnUsage: Math.random() > 0.75,
    proxyUsage: Math.random() > 0.7,
  };
}

function generateMockChargebackLikelihood(): FraudRiskAssessment['chargebackLikelihood'] {
  const probability = Number(randomFloat(0.02, 0.28).toFixed(3));
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
    expectedLoss: Number((probability * randomFloat(80, 720)).toFixed(2)),
    confidence: Number(randomFloat(0.62, 0.94).toFixed(2)),
    factors: generateMockChargebackFactors(),
  };
}

function generateMockActions(
  level: FraudRiskAssessment['riskLevel'],
): FraudRiskAssessment['actions'] {
  const base: FraudRiskAssessment['actions'] = [
    {
      type: 'monitor',
      reason: 'Baseline monitoring',
      priority: 'low',
      automated: true,
    },
  ];
  if (level === 'very_high') {
    base.push(
      {
        type: 'decline',
        reason: 'Risk exceeds acceptable threshold',
        priority: 'high',
        automated: false,
      },
      {
        type: 'flag',
        reason: 'Flag for manual investigation',
        priority: 'high',
        automated: false,
      },
    );
  } else if (level === 'high') {
    base.push(
      {
        type: 'review',
        reason: 'Requires manual analyst review',
        priority: 'high',
        automated: false,
      },
      {
        type: 'flag',
        reason: 'Add to velocity watchlist',
        priority: 'medium',
        automated: true,
      },
    );
  } else if (level === 'medium') {
    base.push({
      type: 'verify',
      reason: 'Request additional verification evidence',
      priority: 'medium',
      automated: false,
    });
  } else {
    base.push({
      type: 'approve',
      reason: 'Low risk assessment',
      priority: 'low',
      automated: true,
    });
  }
  return base;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}





