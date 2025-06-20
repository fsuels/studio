// Marketing Insights Dashboard - UTM attribution, campaign ROI, and discount analytics
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Users,
  MousePointer,
  Eye,
  Calendar,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  PieChart,
  LineChart,
  Zap,
  Gift
} from 'lucide-react';
import type { 
  MarketingDashboardData, 
  ChannelROI, 
  CampaignPerformance, 
  DiscountCodeAnalytics,
  MarketingInsight
} from '@/types/marketing';

interface MarketingInsightsDashboardProps {
  onRefresh?: () => void;
  isLoading?: boolean;
}

export default function MarketingInsightsDashboard({
  onRefresh,
  isLoading = false
}: MarketingInsightsDashboardProps) {
  const [data, setData] = useState<MarketingDashboardData | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [selectedAttribution, setSelectedAttribution] = useState('last_touch');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMarketingData();
  }, [selectedTimeframe, selectedAttribution]);

  const fetchMarketingData = async () => {
    try {
      const response = await fetch(`/api/analytics/marketing-attribution?timeframe=${selectedTimeframe}&attribution=${selectedAttribution}`);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
        setError(null);
      } else {
        setError(result.error || 'Failed to load marketing data');
      }
    } catch (err) {
      setError('Network error loading marketing insights');
      console.error('Marketing data fetch error:', err);
      
      // Set mock data for demo
      setData(generateMockMarketingData());
    }
  };

  const handleRefresh = () => {
    fetchMarketingData();
    onRefresh?.();
  };

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Marketing Insights</h2>
            <p className="text-muted-foreground">Loading attribution dashboard...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Marketing Insights</h2>
          <p className="text-muted-foreground">
            UTM attribution, campaign ROI, and discount code performance analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedAttribution} onValueChange={setSelectedAttribution}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="first_touch">First Touch</SelectItem>
              <SelectItem value="last_touch">Last Touch</SelectItem>
              <SelectItem value="linear">Linear</SelectItem>
              <SelectItem value="time_decay">Time Decay</SelectItem>
              <SelectItem value="position_based">Position Based</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={`$${data.overview.totalRevenue.toLocaleString()}`}
          change={data.timeframe.comparison.revenue?.change || 0}
          icon={DollarSign}
        />
        <MetricCard
          title="ROAS"
          value={`${data.overview.returnOnAdSpend.toFixed(2)}x`}
          change={data.timeframe.comparison.roas?.change || 0}
          icon={TrendingUp}
        />
        <MetricCard
          title="Conversions"
          value={data.overview.totalConversions.toLocaleString()}
          change={data.timeframe.comparison.conversions?.change || 0}
          icon={Target}
        />
        <MetricCard
          title="Cost per Acquisition"
          value={`$${data.overview.costPerAcquisition.toFixed(2)}`}
          change={-data.timeframe.comparison.cpa?.change || 0}
          icon={Users}
          isInverted
        />
      </div>

      {/* Insights Cards */}
      {data.insights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.insights.slice(0, 3).map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      )}

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="attribution" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="attribution">Attribution</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="discounts">Discounts</TabsTrigger>
        </TabsList>

        {/* Attribution Analysis */}
        <TabsContent value="attribution" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Attribution Model Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(data.attribution.modelComparison).map(([model, metrics]) => (
                    <div key={model} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium capitalize">{model.replace('_', ' ')}</p>
                        <p className="text-sm text-muted-foreground">
                          {metrics.conversions} conversions
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${metrics.revenue.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Conversion Paths</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.attribution.conversionPaths.slice(0, 5).map((path, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{path.path}</p>
                        <p className="text-xs text-muted-foreground">
                          {path.conversions} conversions
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">${path.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Channel Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.attribution.topPerformingChannels.map((channel, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{channel.channel}</p>
                        <div className="flex items-center gap-1">
                          {channel.growth > 0 ? (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                          ) : channel.growth < 0 ? (
                            <TrendingDown className="h-3 w-3 text-red-500" />
                          ) : (
                            <Minus className="h-3 w-3 text-gray-500" />
                          )}
                          <span className={`text-xs ${
                            channel.growth > 0 ? 'text-green-600' : 
                            channel.growth < 0 ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {channel.growth > 0 ? '+' : ''}{channel.growth.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${channel.revenue.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Channel ROI */}
        <TabsContent value="channels" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {data.channels.slice(0, 6).map((channel) => (
              <ChannelCard key={channel.channelId} channel={channel} />
            ))}
          </div>
        </TabsContent>

        {/* Campaign Performance */}
        <TabsContent value="campaigns" className="space-y-6">
          <div className="space-y-4">
            {data.campaigns.slice(0, 5).map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </TabsContent>

        {/* Discount Analytics */}
        <TabsContent value="discounts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Active Codes</span>
                </div>
                <p className="text-2xl font-bold mt-2">{data.discounts.totalCodesActive}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">Revenue with Discounts</span>
                </div>
                <p className="text-2xl font-bold mt-2">${data.discounts.totalRevenueWithDiscounts.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">Incremental Revenue</span>
                </div>
                <p className="text-2xl font-bold mt-2">${data.discounts.incrementalRevenue.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Top Performing Discount Codes</h3>
            {data.discounts.topPerformingCodes.map((discount) => (
              <DiscountCard key={discount.id} discount={discount} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper Components
function MetricCard({ 
  title, 
  value, 
  change, 
  icon: Icon,
  isInverted = false 
}: { 
  title: string; 
  value: string; 
  change: number; 
  icon: any;
  isInverted?: boolean;
}) {
  const isPositive = isInverted ? change < 0 : change > 0;
  const isNegative = isInverted ? change > 0 : change < 0;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <div className="flex items-center gap-1 mt-1">
              {change !== 0 && (
                <>
                  {isPositive ? (
                    <ArrowUpRight className="h-3 w-3 text-green-600" />
                  ) : isNegative ? (
                    <ArrowDownRight className="h-3 w-3 text-red-600" />
                  ) : (
                    <Minus className="h-3 w-3 text-gray-500" />
                  )}
                  <span className={`text-xs ${
                    isPositive ? 'text-green-600' : 
                    isNegative ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {Math.abs(change).toFixed(1)}%
                  </span>
                </>
              )}
            </div>
          </div>
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}

function InsightCard({ insight }: { insight: MarketingInsight }) {
  const iconMap = {
    opportunity: TrendingUp,
    warning: AlertTriangle,
    achievement: CheckCircle,
    trend: BarChart3
  };
  
  const Icon = iconMap[insight.type];
  
  const colorMap = {
    opportunity: 'text-green-600 bg-green-50 border-green-200',
    warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    achievement: 'text-blue-600 bg-blue-50 border-blue-200',
    trend: 'text-purple-600 bg-purple-50 border-purple-200'
  };

  return (
    <Card className={`border ${colorMap[insight.type]}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Icon className="h-5 w-5 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-sm">{insight.title}</h4>
              <Badge variant={insight.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                {insight.priority}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{insight.description}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium">Impact: ${insight.impact.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">{insight.confidence}% confidence</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ChannelCard({ channel }: { channel: ChannelROI }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{channel.channelName}</CardTitle>
          <Badge variant="outline" className="text-xs">
            {channel.category.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">ROAS</p>
            <p className="text-lg font-bold">{channel.efficiency.roas.toFixed(2)}x</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Revenue</p>
            <p className="text-lg font-bold">${channel.performance.revenue.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">CPA</p>
            <p className="text-sm font-medium">${channel.efficiency.cpa.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Conversions</p>
            <p className="text-sm font-medium">{channel.performance.conversions}</p>
          </div>
        </div>
        
        {channel.recommendations.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs font-medium mb-1">Top Recommendation:</p>
            <p className="text-xs text-muted-foreground">
              {channel.recommendations[0].description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CampaignCard({ campaign }: { campaign: CampaignPerformance }) {
  const progressPercent = (campaign.budget.spent / campaign.budget.allocated) * 100;
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold">{campaign.campaignName}</h3>
            <p className="text-sm text-muted-foreground">{campaign.channel.name}</p>
          </div>
          <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
            {campaign.status}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-xs text-muted-foreground">ROAS</p>
            <p className="text-lg font-bold">{campaign.revenue.roas.toFixed(2)}x</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Revenue</p>
            <p className="text-lg font-bold">${campaign.revenue.total.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Conversions</p>
            <p className="text-lg font-bold">{campaign.conversions.total}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Conv. Rate</p>
            <p className="text-lg font-bold">{(campaign.conversions.conversionRate * 100).toFixed(1)}%</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Budget Utilization</span>
            <span>${campaign.budget.spent.toLocaleString()} / ${campaign.budget.allocated.toLocaleString()}</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}

function DiscountCard({ discount }: { discount: DiscountCodeAnalytics }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold">{discount.code}</h3>
            <p className="text-sm text-muted-foreground">
              {discount.type === 'percentage' ? `${discount.value}% off` : `$${discount.value} off`}
            </p>
          </div>
          <Badge variant={discount.isActive ? 'default' : 'secondary'}>
            {discount.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Total Uses</p>
            <p className="text-lg font-bold">{discount.usage.totalUses}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Revenue</p>
            <p className="text-lg font-bold">${discount.performance.revenueGenerated.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Incremental</p>
            <p className="text-lg font-bold">${discount.performance.incrementalRevenue.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">New Customers</p>
            <p className="text-lg font-bold">{(discount.customerBehavior.newCustomerRate * 100).toFixed(0)}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Mock data generator for demo
function generateMockMarketingData(): MarketingDashboardData {
  return {
    overview: {
      totalRevenue: 125430,
      totalConversions: 856,
      averageOrderValue: 146.50,
      costPerAcquisition: 42.30,
      returnOnAdSpend: 4.2,
      customerLifetimeValue: 289.50,
      marketingEfficiencyRatio: 1.85
    },
    channels: [
      {
        channelId: 'google-ads',
        channelName: 'Google Ads',
        category: 'paid_search',
        timeframe: { startDate: '2024-01-01', endDate: '2024-01-31', period: 'month' },
        investment: { adSpend: 15000, toolsCost: 500, agencyCost: 0, internalCost: 2000, totalInvestment: 17500 },
        performance: { impressions: 125000, clicks: 3250, sessions: 3100, newUsers: 2800, conversions: 245, revenue: 67500, attributedRevenue: 65000 },
        efficiency: { cpm: 12.50, cpc: 4.62, cpa: 71.43, roas: 4.5, roi: 3.86, ltv: 285, paybackPeriod: 3.2 },
        trends: { revenueGrowth: 15.2, conversionGrowth: 8.7, efficiencyGrowth: 12.1, competitivePosition: 'leading' },
        benchmarks: { industryAvgROAS: 3.2, industryAvgCPA: 85.50, performanceVsIndustry: 40.8 },
        recommendations: [
          {
            type: 'increase_budget',
            priority: 'high',
            impact: 'high',
            effort: 'low',
            description: 'Increase budget for top-performing keywords',
            expectedOutcome: 'Additional $15k monthly revenue',
            estimatedLift: 25.3
          }
        ]
      }
    ],
    campaigns: [
      {
        id: 'camp-1',
        campaignId: 'camp-google-1',
        campaignName: 'Legal Documents - Branded',
        channel: { id: 'google', name: 'Google Ads', category: 'paid_search', subcategory: 'search', platform: 'Google Ads', costModel: 'cpc', isActive: true, trackingEnabled: true },
        utm: { source: 'google', medium: 'cpc', campaign: 'branded_legal_docs', term: 'legal documents', content: 'ad_variant_a' },
        timeframe: { startDate: '2024-01-01', endDate: '2024-01-31' },
        budget: { allocated: 8000, spent: 7250, remaining: 750, currency: 'USD' },
        metrics: { impressions: 65000, clicks: 1850, sessions: 1750, uniqueVisitors: 1680, newVisitors: 1420, bounceRate: 0.35, avgSessionDuration: 180, pageViewsPerSession: 2.8 },
        conversions: { total: 142, byType: { order: 125, signup: 17 }, conversionRate: 0.081, costPerConversion: 51.06, valuePerConversion: 285.50 },
        revenue: { total: 40500, attributed: 38250, roas: 5.28, roi: 4.58, ltv: 285 },
        attribution: { firstTouch: 28500, lastTouch: 38250, linear: 32100, timeDecay: 35800, positionBased: 34200 },
        goals: [
          { id: 'goal-1', type: 'roas', target: 4.0, actual: 5.28, achievement: 132, priority: 'primary' }
        ],
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-31T23:59:59Z'
      }
    ],
    attribution: {
      modelComparison: {
        first_touch: { conversions: 856, revenue: 98500 },
        last_touch: { conversions: 856, revenue: 125430 },
        linear: { conversions: 856, revenue: 112800 },
        time_decay: { conversions: 856, revenue: 118900 },
        position_based: { conversions: 856, revenue: 115600 }
      },
      topPerformingChannels: [
        { channel: 'Google Ads', revenue: 67500, growth: 15.2 },
        { channel: 'Facebook Ads', revenue: 32100, growth: 8.7 },
        { channel: 'Organic Search', revenue: 25830, growth: -2.3 }
      ],
      channelMix: {
        'paid_search': 45.2,
        'social_media': 28.1,
        'organic_search': 18.7,
        'direct': 8.0
      },
      conversionPaths: [
        { path: 'Google Ads → Direct', conversions: 145, revenue: 35250 },
        { path: 'Facebook → Google Ads → Order', conversions: 89, revenue: 21500 },
        { path: 'Organic → Email → Order', conversions: 67, revenue: 16800 }
      ]
    },
    discounts: {
      totalCodesActive: 12,
      totalRevenueWithDiscounts: 45200,
      averageDiscountPercentage: 15.5,
      topPerformingCodes: [
        {
          id: 'disc-1',
          code: 'WELCOME20',
          type: 'percentage',
          value: 20,
          isActive: true,
          usage: { totalUses: 245, uniqueUsers: 230, repeatUsers: 15, maxUses: 1000, usesRemaining: 755 },
          performance: { revenueGenerated: 18500, revenueWithoutDiscount: 23125, discountAmount: 4625, averageOrderValue: 75.51, incrementalRevenue: 12000, cannibalizedRevenue: 6500 },
          attribution: { acquisitionChannel: { 'google_ads': 140, 'facebook': 65, 'organic': 40 }, customerSegment: { 'new': 220, 'returning': 25 }, documentTypes: { 'llc': 89, 'lease': 76, 'nda': 80 } },
          timing: { createdAt: '2024-01-01T00:00:00Z', validFrom: '2024-01-01T00:00:00Z', validUntil: '2024-12-31T23:59:59Z', firstUsed: '2024-01-01T14:23:15Z', lastUsed: '2024-01-30T18:45:32Z', peakUsageHour: 14, peakUsageDay: 'Monday' },
          customerBehavior: { newCustomerRate: 0.89, returningCustomerRate: 0.11, averageTimeToUse: 125, repeatPurchaseRate: 0.15, churnRateAfterDiscount: 0.12 },
          fraudRisk: { suspiciousUses: 2, duplicateAttempts: 8, riskScore: 15 }
        }
      ],
      incrementalRevenue: 28500
    },
    timeframe: {
      current: { startDate: '2024-01-01', endDate: '2024-01-31' },
      previous: { startDate: '2023-12-01', endDate: '2023-12-31' },
      comparison: {
        revenue: { current: 125430, previous: 108900, change: 15.2 },
        roas: { current: 4.2, previous: 3.8, change: 10.5 },
        conversions: { current: 856, previous: 789, change: 8.5 },
        cpa: { current: 42.30, previous: 48.50, change: -12.8 }
      }
    },
    goals: {
      revenueTarget: 120000,
      revenueActual: 125430,
      roasTarget: 4.0,
      roasActual: 4.2,
      conversionTarget: 800,
      conversionActual: 856
    },
    insights: [
      {
        id: 'insight-1',
        type: 'opportunity',
        priority: 'high',
        title: 'Google Ads Performance Spike',
        description: 'Google Ads ROAS increased 40% above industry average. Consider budget reallocation.',
        impact: 15000,
        confidence: 87,
        dataPoints: [
          { metric: 'ROAS', value: 5.28, trend: 'up' },
          { metric: 'CPA', value: 51.06, trend: 'down' }
        ],
        recommendations: ['Increase Google Ads budget by 30%', 'Test similar keywords in other channels'],
        createdAt: '2024-01-31T12:00:00Z'
      }
    ]
  };
}