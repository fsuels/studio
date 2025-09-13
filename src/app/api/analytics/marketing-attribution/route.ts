// Marketing Attribution API - UTM tracking, campaign ROI, and discount analytics
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import type {
  MarketingDashboardData,
  ChannelROI,
  CampaignPerformance,
  DiscountCodeAnalytics,
  MarketingInsight,
  CampaignAnalyticsRequest,
} from '@/types/marketing';

export async function GET(request: NextRequest) {
  const adminResult = await requireAdmin(request);
  if (adminResult instanceof Response) {
    return adminResult;
  }

  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || 'dashboard';
    const timeframe = url.searchParams.get('timeframe') || '30d';
    const attribution = url.searchParams.get('attribution') || 'last_touch';
    const channels = url.searchParams.get('channels')?.split(',');
    const campaigns = url.searchParams.get('campaigns')?.split(',');

    switch (type) {
      case 'dashboard': {
        const dashboardData = await generateMarketingDashboard({
          timeframe: getTimeframeFromString(timeframe),
          channels,
          campaigns,
          attributionModel: attribution as any,
          metrics: ['revenue', 'roas', 'conversions', 'cpa'],
        });

        return NextResponse.json({
          success: true,
          data: dashboardData,
          metadata: {
            totalRecords:
              dashboardData.channels.length + dashboardData.campaigns.length,
            timeframe,
            lastUpdated: new Date().toISOString(),
            dataQuality: 'high',
          },
        });
      }

      case 'channels': {
        const channelData = await getChannelROI(timeframe, attribution);
        return NextResponse.json({
          success: true,
          data: channelData,
        });
      }

      case 'campaigns': {
        const campaignData = await getCampaignPerformance(
          timeframe,
          channels,
          campaigns,
        );
        return NextResponse.json({
          success: true,
          data: campaignData,
        });
      }

      case 'discounts': {
        const discountData = await getDiscountAnalytics(timeframe);
        return NextResponse.json({
          success: true,
          data: discountData,
        });
      }

      case 'attribution_comparison': {
        const attributionComparison =
          await getAttributionModelComparison(timeframe);
        return NextResponse.json({
          success: true,
          data: attributionComparison,
        });
      }

      case 'conversion_paths': {
        const conversionPaths = await getTopConversionPaths(
          timeframe,
          attribution,
        );
        return NextResponse.json({
          success: true,
          data: conversionPaths,
        });
      }

      case 'insights': {
        const insights = await generateMarketingInsights(timeframe);
        return NextResponse.json({
          success: true,
          data: insights,
        });
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid analytics type',
          },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error('Marketing attribution API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve marketing attribution data',
      },
      { status: 500 },
    );
  }
}

// Track marketing events (UTM parameters, conversions, etc.)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      type,
      sessionId,
      customerId,
      utm,
      revenue,
      conversionType,
      metadata,
    } = body;

    if (!type || !sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: type, sessionId',
        },
        { status: 400 },
      );
    }

    // Create marketing touchpoint or conversion event
    const marketingEvent = {
      id: crypto.randomUUID(),
      type,
      sessionId,
      customerId,
      utm,
      revenue: revenue || 0,
      conversionType: conversionType || 'page_view',
      timestamp: new Date().toISOString(),
      ipAddress: getClientIP(request),
      userAgent: request.headers.get('user-agent') || 'unknown',
      metadata: {
        ...metadata,
        referrer: request.headers.get('referer'),
        origin: request.headers.get('origin'),
      },
    };

    // In production, save to database
    await trackMarketingEvent(marketingEvent);

    return NextResponse.json({
      success: true,
      data: { tracked: true, eventId: marketingEvent.id },
    });
  } catch (error) {
    console.error('Marketing tracking error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to track marketing event',
      },
      { status: 500 },
    );
  }
}

// Helper functions
async function generateMarketingDashboard(
  request: CampaignAnalyticsRequest,
): Promise<MarketingDashboardData> {
  // In production, aggregate real data from marketing attribution tables
  // For demo, return comprehensive mock data

  return {
    overview: {
      totalRevenue: 125430,
      totalConversions: 856,
      averageOrderValue: 146.5,
      costPerAcquisition: 42.3,
      returnOnAdSpend: 4.2,
      customerLifetimeValue: 289.5,
      marketingEfficiencyRatio: 1.85,
    },
    channels: await getChannelROI(
      request.timeframe?.startDate || '30d',
      request.attributionModel || 'last_touch',
    ),
    campaigns: await getCampaignPerformance(
      request.timeframe?.startDate || '30d',
      request.channels,
      request.campaigns,
    ),
    attribution: {
      modelComparison: {
        first_touch: { conversions: 856, revenue: 98500 },
        last_touch: { conversions: 856, revenue: 125430 },
        linear: { conversions: 856, revenue: 112800 },
        time_decay: { conversions: 856, revenue: 118900 },
        position_based: { conversions: 856, revenue: 115600 },
      },
      topPerformingChannels: [
        { channel: 'Google Ads', revenue: 67500, growth: 15.2 },
        { channel: 'Facebook Ads', revenue: 32100, growth: 8.7 },
        { channel: 'Organic Search', revenue: 25830, growth: -2.3 },
        { channel: 'Email Marketing', revenue: 18900, growth: 22.1 },
        { channel: 'LinkedIn Ads', revenue: 12400, growth: 35.6 },
      ],
      channelMix: {
        paid_search: 45.2,
        social_media: 28.1,
        organic_search: 18.7,
        email: 6.2,
        direct: 1.8,
      },
      conversionPaths: [
        { path: 'Google Ads → Direct', conversions: 145, revenue: 35250 },
        {
          path: 'Facebook → Google Ads → Order',
          conversions: 89,
          revenue: 21500,
        },
        { path: 'Organic → Email → Order', conversions: 67, revenue: 16800 },
        {
          path: 'LinkedIn → Email → Google → Order',
          conversions: 45,
          revenue: 14200,
        },
        { path: 'Direct → Order', conversions: 156, revenue: 38500 },
      ],
    },
    discounts: {
      totalCodesActive: 12,
      totalRevenueWithDiscounts: 45200,
      averageDiscountPercentage: 15.5,
      topPerformingCodes: await getDiscountAnalytics('30d'),
      incrementalRevenue: 28500,
    },
    timeframe: {
      current: { startDate: '2024-01-01', endDate: '2024-01-31' },
      previous: { startDate: '2023-12-01', endDate: '2023-12-31' },
      comparison: {
        revenue: { current: 125430, previous: 108900, change: 15.2 },
        roas: { current: 4.2, previous: 3.8, change: 10.5 },
        conversions: { current: 856, previous: 789, change: 8.5 },
        cpa: { current: 42.3, previous: 48.5, change: -12.8 },
      },
    },
    goals: {
      revenueTarget: 120000,
      revenueActual: 125430,
      roasTarget: 4.0,
      roasActual: 4.2,
      conversionTarget: 800,
      conversionActual: 856,
    },
    insights: await generateMarketingInsights('30d'),
  };
}

async function getChannelROI(
  _timeframe: string,
  _attribution: string,
): Promise<ChannelROI[]> {
  // In production, calculate from marketing attribution data
  // For demo, return realistic channel performance data

  return [
    {
      channelId: 'google-ads',
      channelName: 'Google Ads',
      category: 'paid_search',
      timeframe: {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        period: 'month',
      },
      investment: {
        adSpend: 15000,
        toolsCost: 500,
        agencyCost: 0,
        internalCost: 2000,
        totalInvestment: 17500,
      },
      performance: {
        impressions: 125000,
        clicks: 3250,
        sessions: 3100,
        newUsers: 2800,
        conversions: 245,
        revenue: 67500,
        attributedRevenue: 65000,
      },
      efficiency: {
        cpm: 12.5,
        cpc: 4.62,
        cpa: 71.43,
        roas: 4.5,
        roi: 3.86,
        ltv: 285,
        paybackPeriod: 3.2,
      },
      trends: {
        revenueGrowth: 15.2,
        conversionGrowth: 8.7,
        efficiencyGrowth: 12.1,
        competitivePosition: 'leading',
      },
      benchmarks: {
        industryAvgROAS: 3.2,
        industryAvgCPA: 85.5,
        performanceVsIndustry: 40.8,
      },
      recommendations: [
        {
          type: 'increase_budget',
          priority: 'high',
          impact: 'high',
          effort: 'low',
          description: 'Increase budget for top-performing keywords',
          expectedOutcome: 'Additional $15k monthly revenue',
          estimatedLift: 25.3,
        },
        {
          type: 'optimize_targeting',
          priority: 'medium',
          impact: 'medium',
          effort: 'medium',
          description: 'Refine audience targeting based on conversion data',
          expectedOutcome: 'Improved conversion rates',
          estimatedLift: 12.8,
        },
      ],
    },
    {
      channelId: 'facebook-ads',
      channelName: 'Facebook Ads',
      category: 'social_media',
      timeframe: {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        period: 'month',
      },
      investment: {
        adSpend: 8500,
        toolsCost: 200,
        agencyCost: 1500,
        internalCost: 1000,
        totalInvestment: 11200,
      },
      performance: {
        impressions: 89000,
        clicks: 1950,
        sessions: 1850,
        newUsers: 1650,
        conversions: 142,
        revenue: 32100,
        attributedRevenue: 30800,
      },
      efficiency: {
        cpm: 9.55,
        cpc: 4.36,
        cpa: 78.87,
        roas: 3.78,
        roi: 2.75,
        ltv: 275,
        paybackPeriod: 4.1,
      },
      trends: {
        revenueGrowth: 8.7,
        conversionGrowth: 12.3,
        efficiencyGrowth: 5.9,
        competitivePosition: 'competitive',
      },
      benchmarks: {
        industryAvgROAS: 3.5,
        industryAvgCPA: 82.3,
        performanceVsIndustry: 8.0,
      },
      recommendations: [
        {
          type: 'test_creative',
          priority: 'high',
          impact: 'medium',
          effort: 'medium',
          description: 'Test video creative formats to improve engagement',
          expectedOutcome: 'Higher click-through rates',
          estimatedLift: 18.5,
        },
      ],
    },
    {
      channelId: 'organic-search',
      channelName: 'Organic Search',
      category: 'organic_search',
      timeframe: {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        period: 'month',
      },
      investment: {
        adSpend: 0,
        toolsCost: 400,
        agencyCost: 0,
        internalCost: 3000,
        totalInvestment: 3400,
      },
      performance: {
        impressions: 185000,
        clicks: 4200,
        sessions: 4000,
        newUsers: 3600,
        conversions: 168,
        revenue: 25830,
        attributedRevenue: 25830,
      },
      efficiency: {
        cpm: 0,
        cpc: 0,
        cpa: 20.24,
        roas: 7.6,
        roi: 6.6,
        ltv: 265,
        paybackPeriod: 1.8,
      },
      trends: {
        revenueGrowth: -2.3,
        conversionGrowth: 3.1,
        efficiencyGrowth: -5.2,
        competitivePosition: 'competitive',
      },
      benchmarks: {
        industryAvgROAS: 8.2,
        industryAvgCPA: 18.5,
        performanceVsIndustry: -7.3,
      },
      recommendations: [
        {
          type: 'improve_landing_page',
          priority: 'medium',
          impact: 'medium',
          effort: 'high',
          description: 'Optimize landing pages for better conversion rates',
          expectedOutcome: 'Improved organic conversions',
          estimatedLift: 15.2,
        },
      ],
    },
  ];
}

async function getCampaignPerformance(
  _timeframe: string,
  _channels?: string[],
  _campaigns?: string[],
): Promise<CampaignPerformance[]> {
  // In production, query campaign performance data
  // For demo, return realistic campaign data

  return [
    {
      id: 'camp-1',
      campaignId: 'camp-google-1',
      campaignName: 'Legal Documents - Branded',
      channel: {
        id: 'google',
        name: 'Google Ads',
        category: 'paid_search',
        subcategory: 'search',
        platform: 'Google Ads',
        costModel: 'cpc',
        isActive: true,
        trackingEnabled: true,
      },
      utm: {
        source: 'google',
        medium: 'cpc',
        campaign: 'branded_legal_docs',
        term: 'legal documents',
        content: 'ad_variant_a',
      },
      timeframe: {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      },
      budget: {
        allocated: 8000,
        spent: 7250,
        remaining: 750,
        currency: 'USD',
      },
      metrics: {
        impressions: 65000,
        clicks: 1850,
        sessions: 1750,
        uniqueVisitors: 1680,
        newVisitors: 1420,
        bounceRate: 0.35,
        avgSessionDuration: 180,
        pageViewsPerSession: 2.8,
      },
      conversions: {
        total: 142,
        byType: { order: 125, signup: 17 },
        conversionRate: 0.081,
        costPerConversion: 51.06,
        valuePerConversion: 285.5,
      },
      revenue: {
        total: 40500,
        attributed: 38250,
        roas: 5.28,
        roi: 4.58,
        ltv: 285,
      },
      attribution: {
        firstTouch: 28500,
        lastTouch: 38250,
        linear: 32100,
        timeDecay: 35800,
        positionBased: 34200,
      },
      goals: [
        {
          id: 'goal-1',
          type: 'roas',
          target: 4.0,
          actual: 5.28,
          achievement: 132,
          priority: 'primary',
        },
      ],
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-31T23:59:59Z',
    },
    {
      id: 'camp-2',
      campaignId: 'camp-facebook-1',
      campaignName: 'Small Business Legal - Lookalike',
      channel: {
        id: 'facebook',
        name: 'Facebook Ads',
        category: 'social_media',
        subcategory: 'social',
        platform: 'Meta',
        costModel: 'cpm',
        isActive: true,
        trackingEnabled: true,
      },
      utm: {
        source: 'facebook',
        medium: 'cpc',
        campaign: 'small_business_legal',
        content: 'lookalike_audience',
      },
      timeframe: {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      },
      budget: {
        allocated: 5500,
        spent: 5200,
        remaining: 300,
        currency: 'USD',
      },
      metrics: {
        impressions: 89000,
        clicks: 1250,
        sessions: 1180,
        uniqueVisitors: 1120,
        newVisitors: 980,
        bounceRate: 0.42,
        avgSessionDuration: 145,
        pageViewsPerSession: 2.3,
      },
      conversions: {
        total: 78,
        byType: { order: 65, signup: 13 },
        conversionRate: 0.066,
        costPerConversion: 66.67,
        valuePerConversion: 275.2,
      },
      revenue: {
        total: 21465,
        attributed: 20100,
        roas: 3.87,
        roi: 3.13,
        ltv: 275,
      },
      attribution: {
        firstTouch: 18200,
        lastTouch: 20100,
        linear: 19150,
        timeDecay: 19800,
        positionBased: 19500,
      },
      goals: [
        {
          id: 'goal-2',
          type: 'cpa',
          target: 70.0,
          actual: 66.67,
          achievement: 105,
          priority: 'primary',
        },
      ],
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-31T23:59:59Z',
    },
  ];
}

async function getDiscountAnalytics(
  _timeframe: string,
): Promise<DiscountCodeAnalytics[]> {
  // In production, analyze discount code performance
  // For demo, return realistic discount analytics

  return [
    {
      id: 'disc-1',
      code: 'WELCOME20',
      type: 'percentage',
      value: 20,
      isActive: true,
      usage: {
        totalUses: 245,
        uniqueUsers: 230,
        repeatUsers: 15,
        maxUses: 1000,
        usesRemaining: 755,
      },
      performance: {
        revenueGenerated: 18500,
        revenueWithoutDiscount: 23125,
        discountAmount: 4625,
        averageOrderValue: 75.51,
        incrementalRevenue: 12000,
        cannibalizedRevenue: 6500,
      },
      attribution: {
        acquisitionChannel: {
          google_ads: 140,
          facebook: 65,
          organic: 40,
        },
        customerSegment: {
          new: 220,
          returning: 25,
        },
        documentTypes: {
          llc: 89,
          lease: 76,
          nda: 80,
        },
      },
      timing: {
        createdAt: '2024-01-01T00:00:00Z',
        validFrom: '2024-01-01T00:00:00Z',
        validUntil: '2024-12-31T23:59:59Z',
        firstUsed: '2024-01-01T14:23:15Z',
        lastUsed: '2024-01-30T18:45:32Z',
        peakUsageHour: 14,
        peakUsageDay: 'Monday',
      },
      customerBehavior: {
        newCustomerRate: 0.89,
        returningCustomerRate: 0.11,
        averageTimeToUse: 125,
        repeatPurchaseRate: 0.15,
        churnRateAfterDiscount: 0.12,
      },
      fraudRisk: {
        suspiciousUses: 2,
        duplicateAttempts: 8,
        riskScore: 15,
      },
    },
    {
      id: 'disc-2',
      code: 'LEGAL15',
      type: 'percentage',
      value: 15,
      isActive: true,
      usage: {
        totalUses: 156,
        uniqueUsers: 149,
        repeatUsers: 7,
        maxUses: 500,
        usesRemaining: 344,
      },
      performance: {
        revenueGenerated: 12800,
        revenueWithoutDiscount: 15060,
        discountAmount: 2260,
        averageOrderValue: 82.05,
        incrementalRevenue: 8500,
        cannibalizedRevenue: 4300,
      },
      attribution: {
        acquisitionChannel: {
          email: 89,
          google_ads: 42,
          organic: 25,
        },
        customerSegment: {
          new: 134,
          returning: 22,
        },
        documentTypes: {
          llc: 62,
          promissory_note: 48,
          lease: 46,
        },
      },
      timing: {
        createdAt: '2024-01-15T00:00:00Z',
        validFrom: '2024-01-15T00:00:00Z',
        validUntil: '2024-06-15T23:59:59Z',
        firstUsed: '2024-01-15T09:12:33Z',
        lastUsed: '2024-01-31T16:28:47Z',
        peakUsageHour: 11,
        peakUsageDay: 'Wednesday',
      },
      customerBehavior: {
        newCustomerRate: 0.86,
        returningCustomerRate: 0.14,
        averageTimeToUse: 89,
        repeatPurchaseRate: 0.18,
        churnRateAfterDiscount: 0.09,
      },
      fraudRisk: {
        suspiciousUses: 1,
        duplicateAttempts: 3,
        riskScore: 8,
      },
    },
  ];
}

async function generateMarketingInsights(
  _timeframe: string,
): Promise<MarketingInsight[]> {
  // In production, use ML/AI to generate insights from marketing data
  // For demo, return realistic insights

  return [
    {
      id: 'insight-1',
      type: 'opportunity',
      priority: 'high',
      title: 'Google Ads Performance Spike',
      description:
        'Google Ads ROAS increased 40% above industry average. Consider budget reallocation.',
      impact: 15000,
      confidence: 87,
      dataPoints: [
        { metric: 'ROAS', value: 5.28, trend: 'up' },
        { metric: 'CPA', value: 51.06, trend: 'down' },
        { metric: 'Conversion Rate', value: 8.1, trend: 'up' },
      ],
      recommendations: [
        'Increase Google Ads budget by 30%',
        'Test similar keywords in other channels',
        'Expand successful ad groups',
      ],
      createdAt: '2024-01-31T12:00:00Z',
    },
    {
      id: 'insight-2',
      type: 'warning',
      priority: 'medium',
      title: 'Organic Traffic Decline',
      description:
        'Organic search traffic dropped 12% compared to last month. SEO optimization needed.',
      impact: -8500,
      confidence: 73,
      dataPoints: [
        { metric: 'Organic Sessions', value: 4000, trend: 'down' },
        { metric: 'Keyword Rankings', value: 85, trend: 'down' },
        { metric: 'Page Load Speed', value: 3.2, trend: 'down' },
      ],
      recommendations: [
        'Conduct technical SEO audit',
        'Optimize page loading speeds',
        'Update content for target keywords',
      ],
      createdAt: '2024-01-30T15:30:00Z',
    },
    {
      id: 'insight-3',
      type: 'achievement',
      priority: 'low',
      title: 'Discount Code Success',
      description:
        'WELCOME20 discount code generated $12k in incremental revenue this month.',
      impact: 12000,
      confidence: 95,
      dataPoints: [
        { metric: 'Incremental Revenue', value: 12000, trend: 'up' },
        { metric: 'New Customer Rate', value: 89, trend: 'up' },
        { metric: 'Usage Rate', value: 24.5, trend: 'up' },
      ],
      recommendations: [
        'Create similar discount campaigns',
        'Test different discount percentages',
        'Expand discount distribution channels',
      ],
      createdAt: '2024-01-29T10:15:00Z',
    },
  ];
}

// Utility functions
function getTimeframeFromString(timeframe: string): {
  startDate: string;
  endDate: string;
} {
  const now = new Date();
  const endDate = now.toISOString().split('T')[0];
  let startDate: string;

  switch (timeframe) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      break;
    case '90d':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      break;
    case '1y':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
  }

  return { startDate, endDate };
}

async function getAttributionModelComparison(_timeframe: string) {
  // In production, calculate revenue attribution using different models
  return {
    first_touch: { conversions: 856, revenue: 98500 },
    last_touch: { conversions: 856, revenue: 125430 },
    linear: { conversions: 856, revenue: 112800 },
    time_decay: { conversions: 856, revenue: 118900 },
    position_based: { conversions: 856, revenue: 115600 },
  };
}

async function getTopConversionPaths(_timeframe: string, _attribution: string) {
  // In production, analyze customer journey paths
  return [
    { path: 'Google Ads → Direct', conversions: 145, revenue: 35250 },
    { path: 'Facebook → Google Ads → Order', conversions: 89, revenue: 21500 },
    { path: 'Organic → Email → Order', conversions: 67, revenue: 16800 },
    {
      path: 'LinkedIn → Email → Google → Order',
      conversions: 45,
      revenue: 14200,
    },
    { path: 'Direct → Order', conversions: 156, revenue: 38500 },
  ];
}

async function trackMarketingEvent(event: any) {
  // In production, save to marketing attribution database
  console.log('Marketing event tracked:', event);
  return true;
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0];
  }

  if (realIp) {
    return realIp;
  }

  return 'unknown';
}
