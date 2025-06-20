// Marketing attribution and campaign analytics data models
export interface UTMParameters {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

export interface MarketingAttribution {
  id: string;
  customerId: string;
  orderId?: string;
  sessionId: string;
  touchpoints: MarketingTouchpoint[];
  firstTouch: MarketingTouchpoint;
  lastTouch: MarketingTouchpoint;
  assistingTouches: MarketingTouchpoint[];
  attributionModel: 'first_touch' | 'last_touch' | 'linear' | 'time_decay' | 'position_based';
  revenueAttributed: number;
  conversionValue: number;
  conversionType: 'order' | 'signup' | 'download' | 'trial' | 'consultation';
  timeToConversion: number; // minutes
  createdAt: string;
  convertedAt?: string;
}

export interface MarketingTouchpoint {
  id: string;
  timestamp: string;
  channel: MarketingChannel;
  utm: UTMParameters;
  referrer?: string;
  landingPage: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  ipAddress: string;
  userAgent: string;
  attributionWeight: number; // 0-1 based on attribution model
  revenueCredit: number;
  sessionDuration?: number; // minutes
  pageViews?: number;
  engagementScore?: number; // 0-100
}

export interface MarketingChannel {
  id: string;
  name: string;
  category: 'paid_search' | 'organic_search' | 'social_media' | 'email' | 'direct' | 
           'referral' | 'display' | 'affiliate' | 'content' | 'other';
  subcategory?: string;
  platform?: string; // Google Ads, Facebook, LinkedIn, etc.
  costModel: 'cpc' | 'cpm' | 'cpa' | 'flat_rate' | 'revenue_share';
  isActive: boolean;
  trackingEnabled: boolean;
}

export interface CampaignPerformance {
  id: string;
  campaignId: string;
  campaignName: string;
  channel: MarketingChannel;
  utm: UTMParameters;
  timeframe: {
    startDate: string;
    endDate: string;
  };
  budget: {
    allocated: number;
    spent: number;
    remaining: number;
    currency: string;
  };
  metrics: {
    impressions: number;
    clicks: number;
    sessions: number;
    uniqueVisitors: number;
    newVisitors: number;
    bounceRate: number;
    avgSessionDuration: number;
    pageViewsPerSession: number;
  };
  conversions: {
    total: number;
    byType: Record<string, number>;
    conversionRate: number;
    costPerConversion: number;
    valuePerConversion: number;
  };
  revenue: {
    total: number;
    attributed: number;
    roas: number; // Return on Ad Spend
    roi: number; // Return on Investment
    ltv: number; // Lifetime Value
  };
  attribution: {
    firstTouch: number;
    lastTouch: number;
    linear: number;
    timeDecay: number;
    positionBased: number;
  };
  goals: CampaignGoal[];
  status: 'active' | 'paused' | 'completed' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface CampaignGoal {
  id: string;
  type: 'revenue' | 'conversions' | 'roas' | 'cpa' | 'impressions' | 'clicks';
  target: number;
  actual: number;
  achievement: number; // percentage
  priority: 'primary' | 'secondary';
}

export interface DiscountCodeAnalytics {
  id: string;
  code: string;
  campaignId?: string;
  type: 'percentage' | 'fixed_amount' | 'free_shipping' | 'buy_one_get_one';
  value: number;
  currency?: string;
  isActive: boolean;
  usage: {
    totalUses: number;
    maxUses?: number;
    usesRemaining?: number;
    uniqueUsers: number;
    repeatUsers: number;
  };
  performance: {
    revenueGenerated: number;
    revenueWithoutDiscount: number;
    discountAmount: number;
    averageOrderValue: number;
    incrementalRevenue: number; // revenue that wouldn't exist without discount
    cannibalizedRevenue: number; // revenue lost from customers who would have bought anyway
  };
  attribution: {
    acquisitionChannel: Record<string, number>;
    customerSegment: Record<string, number>;
    documentTypes: Record<string, number>;
  };
  timing: {
    createdAt: string;
    validFrom: string;
    validUntil?: string;
    firstUsed?: string;
    lastUsed?: string;
    peakUsageHour?: number;
    peakUsageDay?: string;
  };
  customerBehavior: {
    newCustomerRate: number;
    returningCustomerRate: number;
    averageTimeToUse: number; // minutes from creation to first use
    repeatPurchaseRate: number;
    churnRateAfterDiscount: number;
  };
  fraudRisk: {
    suspiciousUses: number;
    duplicateAttempts: number;
    riskScore: number; // 0-100
  };
}

export interface CustomerJourney {
  id: string;
  customerId: string;
  sessionIds: string[];
  touchpoints: JourneyTouchpoint[];
  stages: JourneyStage[];
  outcome: 'converted' | 'churned' | 'active' | 'dormant';
  conversionValue?: number;
  journeyDuration: number; // minutes from first touch to conversion/churn
  touchpointCount: number;
  channelMix: Record<string, number>;
  deviceMix: Record<string, number>;
  contentEngagement: {
    pagesViewed: string[];
    documentsDownloaded: string[];
    formsStarted: string[];
    formsCompleted: string[];
    timeOnSite: number;
    engagementScore: number;
  };
  funnelProgression: {
    awareness: boolean;
    consideration: boolean;
    intent: boolean;
    purchase: boolean;
    retention: boolean;
    advocacy: boolean;
  };
  startedAt: string;
  lastActivityAt: string;
  convertedAt?: string;
  churnedAt?: string;
}

export interface JourneyTouchpoint {
  id: string;
  timestamp: string;
  channel: string;
  touchpointType: 'paid' | 'organic' | 'direct' | 'social' | 'email' | 'referral';
  utm: UTMParameters;
  page: string;
  event: 'page_view' | 'form_start' | 'form_complete' | 'download' | 'signup' | 'purchase';
  value?: number;
  duration?: number;
  exitPage?: string;
  nextAction?: string;
  attributionWeight: number;
}

export interface JourneyStage {
  stage: 'awareness' | 'consideration' | 'intent' | 'purchase' | 'retention' | 'advocacy';
  enteredAt: string;
  exitedAt?: string;
  duration?: number;
  actions: string[];
  channels: string[];
  touchpoints: number;
  converted: boolean;
}

export interface ChannelROI {
  channelId: string;
  channelName: string;
  category: MarketingChannel['category'];
  timeframe: {
    startDate: string;
    endDate: string;
    period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  };
  investment: {
    adSpend: number;
    toolsCost: number;
    agencyCost: number;
    internalCost: number;
    totalInvestment: number;
  };
  performance: {
    impressions: number;
    clicks: number;
    sessions: number;
    newUsers: number;
    conversions: number;
    revenue: number;
    attributedRevenue: number;
  };
  efficiency: {
    cpm: number; // Cost per mille (thousand impressions)
    cpc: number; // Cost per click
    cpa: number; // Cost per acquisition
    roas: number; // Return on ad spend
    roi: number; // Return on investment
    ltv: number; // Customer lifetime value
    paybackPeriod: number; // months
  };
  trends: {
    revenueGrowth: number; // percentage
    conversionGrowth: number;
    efficiencyGrowth: number;
    competitivePosition: 'leading' | 'competitive' | 'lagging';
  };
  benchmarks: {
    industryAvgROAS: number;
    industryAvgCPA: number;
    performanceVsIndustry: number; // percentage above/below industry avg
  };
  recommendations: ChannelRecommendation[];
}

export interface ChannelRecommendation {
  type: 'increase_budget' | 'decrease_budget' | 'optimize_targeting' | 'test_creative' | 
        'pause_campaign' | 'expand_reach' | 'improve_landing_page';
  priority: 'high' | 'medium' | 'low';
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  description: string;
  expectedOutcome: string;
  estimatedLift: number; // percentage improvement
}

export interface MarketingDashboardData {
  overview: {
    totalRevenue: number;
    totalConversions: number;
    averageOrderValue: number;
    costPerAcquisition: number;
    returnOnAdSpend: number;
    customerLifetimeValue: number;
    marketingEfficiencyRatio: number;
  };
  channels: ChannelROI[];
  campaigns: CampaignPerformance[];
  attribution: {
    modelComparison: Record<string, { conversions: number; revenue: number }>;
    topPerformingChannels: Array<{ channel: string; revenue: number; growth: number }>;
    channelMix: Record<string, number>;
    conversionPaths: Array<{ path: string; conversions: number; revenue: number }>;
  };
  discounts: {
    totalCodesActive: number;
    totalRevenueWithDiscounts: number;
    averageDiscountPercentage: number;
    topPerformingCodes: DiscountCodeAnalytics[];
    incrementalRevenue: number;
  };
  timeframe: {
    current: { startDate: string; endDate: string };
    previous: { startDate: string; endDate: string };
    comparison: Record<string, { current: number; previous: number; change: number }>;
  };
  goals: {
    revenueTarget: number;
    revenueActual: number;
    roasTarget: number;
    roasActual: number;
    conversionTarget: number;
    conversionActual: number;
  };
  insights: MarketingInsight[];
}

export interface MarketingInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'achievement' | 'trend';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: number; // potential revenue impact
  confidence: number; // 0-100 confidence score
  dataPoints: Array<{ metric: string; value: number; trend: 'up' | 'down' | 'stable' }>;
  recommendations: string[];
  createdAt: string;
}

// Utility types for API responses
export interface MarketingAttributionResponse {
  success: boolean;
  data: MarketingDashboardData;
  metadata: {
    totalRecords: number;
    timeframe: string;
    lastUpdated: string;
    dataQuality: 'high' | 'medium' | 'low';
  };
}

export interface CampaignAnalyticsRequest {
  timeframe?: { startDate: string; endDate: string };
  channels?: string[];
  campaigns?: string[];
  attributionModel?: MarketingAttribution['attributionModel'];
  groupBy?: 'day' | 'week' | 'month' | 'channel' | 'campaign';
  metrics?: string[];
}

// Configuration for attribution models
export interface AttributionModelConfig {
  model: MarketingAttribution['attributionModel'];
  parameters: {
    decayRate?: number; // for time_decay model
    firstTouchWeight?: number; // for position_based model
    lastTouchWeight?: number; // for position_based model
    lookbackWindow?: number; // days to look back for touchpoints
    deduplicationWindow?: number; // minutes to deduplicate same-channel touches
  };
}