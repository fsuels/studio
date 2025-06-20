// Advanced Revenue Intelligence Dashboard - MRR/ARR, CLV, Cohort Analysis, Churn Prediction
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  AlertTriangle,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Clock,
  RefreshCw,
  Download,
  Eye,
  Mail,
  Phone,
  Shield,
  Zap,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

interface RevenueIntelligenceProps {
  className?: string;
}

export default function RevenueIntelligenceDashboard({ className }: RevenueIntelligenceProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState('12months');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data states
  const [overview, setOverview] = useState<any>(null);
  const [mrrTrends, setMrrTrends] = useState<any>(null);
  const [customerLTV, setCustomerLTV] = useState<any>(null);
  const [cohortAnalysis, setCohortAnalysis] = useState<any>(null);
  const [churnPrediction, setChurnPrediction] = useState<any>(null);
  const [revenueLeakage, setRevenueLeakage] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [timeframe]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all revenue intelligence data
      const [overviewRes, mrrRes, ltvRes, cohortRes, churnRes, leakageRes] = await Promise.all([
        fetch(`/api/admin/revenue-intelligence?type=overview&timeframe=${timeframe}`),
        fetch(`/api/admin/revenue-intelligence?type=mrr_trends&timeframe=${timeframe}`),
        fetch(`/api/admin/revenue-intelligence?type=customer_ltv&timeframe=${timeframe}`),
        fetch(`/api/admin/revenue-intelligence?type=cohort_analysis&timeframe=${timeframe}`),
        fetch(`/api/admin/revenue-intelligence?type=churn_prediction&timeframe=${timeframe}`),
        fetch(`/api/admin/revenue-intelligence?type=revenue_leakage&timeframe=${timeframe}`)
      ]);

      const [overviewData, mrrData, ltvData, cohortData, churnData, leakageData] = await Promise.all([
        overviewRes.json(),
        mrrRes.json(),
        ltvRes.json(),
        cohortRes.json(),
        churnRes.json(),
        leakageRes.json()
      ]);

      if (overviewData.success) setOverview(overviewData.data);
      if (mrrData.success) setMrrTrends(mrrData.data);
      if (ltvData.success) setCustomerLTV(ltvData.data);
      if (cohortData.success) setCohortAnalysis(cohortData.data);
      if (churnData.success) setChurnPrediction(churnData.data);
      if (leakageData.success) setRevenueLeakage(leakageData.data);

    } catch (err) {
      setError('Failed to load revenue intelligence data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getGrowthIcon = (value: number) => {
    if (value > 0) return <ArrowUp className="h-4 w-4 text-green-600" />;
    if (value < 0) return <ArrowDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getGrowthColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChurnRiskBadge = (risk: string) => {
    const variants = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      critical: 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <Badge variant="outline" className={variants[risk as keyof typeof variants] || 'bg-gray-100'}>
        {risk.charAt(0).toUpperCase() + risk.slice(1)}
      </Badge>
    );
  };

  if (loading && !overview) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Revenue Intelligence</h1>
          <p className="text-muted-foreground">
            MRR/ARR trends, customer lifetime value, cohort retention, and churn prediction
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="12months">Last 12 Months</SelectItem>
              <SelectItem value="24months">Last 24 Months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="mrr">MRR/ARR</TabsTrigger>
          <TabsTrigger value="ltv">Customer LTV</TabsTrigger>
          <TabsTrigger value="cohorts">Cohort Analysis</TabsTrigger>
          <TabsTrigger value="churn">Churn Prediction</TabsTrigger>
          <TabsTrigger value="leakage">Revenue Leakage</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPI Summary Cards */}
          {overview && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Monthly Recurring Revenue</p>
                      <p className="text-2xl font-bold">{formatCurrency(overview.summary.mrr)}</p>
                      <div className={`flex items-center gap-1 text-sm ${getGrowthColor(overview.summary.mrrGrowth)}`}>
                        {getGrowthIcon(overview.summary.mrrGrowth)}
                        {formatPercentage(overview.summary.mrrGrowth)} from last month
                      </div>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Annual Recurring Revenue</p>
                      <p className="text-2xl font-bold">{formatCurrency(overview.summary.arr)}</p>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(overview.summary.arr / 12)}/month run rate
                      </div>
                    </div>
                    <BarChart3 className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Average Customer LTV</p>
                      <p className="text-2xl font-bold">{formatCurrency(overview.summary.avgLTV)}</p>
                      <div className="text-sm text-muted-foreground">
                        {overview.summary.totalCustomers} total customers
                      </div>
                    </div>
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Churn Risk Alerts</p>
                      <p className="text-2xl font-bold text-red-600">{overview.summary.churnRisk}</p>
                      <div className="text-sm text-muted-foreground">
                        High/Critical risk customers
                      </div>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Revenue Trends Chart */}
          {overview && overview.trends && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Revenue Trends (Last 12 Months)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {overview.trends.map((trend: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{trend.period}</div>
                        <div className="text-sm text-muted-foreground">
                          {trend.newCustomers} new customers
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(trend.revenue)}</div>
                        <div className="text-xs text-muted-foreground">
                          {trend.expansionRevenue > 0 && `+${formatCurrency(trend.expansionRevenue)} expansion`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top At-Risk Customers */}
          {overview && overview.topRisks && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  High-Risk Customers (Immediate Action Required)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {overview.topRisks.slice(0, 10).map((customer: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-red-600">{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium">{customer.email}</div>
                          <div className="text-sm text-muted-foreground">
                            {customer.daysSinceLastOrder} days since last order
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-semibold">{(customer.churnProbability * 100).toFixed(0)}%</div>
                          <div className="text-xs text-muted-foreground">churn risk</div>
                        </div>
                        {getChurnRiskBadge(customer.churnRisk)}
                        <Button variant="ghost" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Revenue Leakage Summary */}
          {overview && overview.revenueLeakage && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5" />
                  Revenue Leakage Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {overview.revenueLeakage.map((leakage: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium capitalize">{leakage.type.replace('_', ' ')}</div>
                        <Badge variant={leakage.percentage > 5 ? 'destructive' : 'secondary'}>
                          {leakage.percentage.toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold text-red-600 mb-1">
                        {formatCurrency(leakage.amount)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {leakage.affectedCustomers} customers affected
                      </div>
                      <div className="mt-2">
                        <div className={`text-xs px-2 py-1 rounded ${
                          leakage.trend === 'increasing' ? 'bg-red-100 text-red-700' :
                          leakage.trend === 'decreasing' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {leakage.trend.charAt(0).toUpperCase() + leakage.trend.slice(1)} trend
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="mrr" className="space-y-6">
          {mrrTrends && (
            <>
              {/* MRR Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Current MRR</p>
                        <p className="text-2xl font-bold">{formatCurrency(mrrTrends.metrics.mrr)}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">MRR Growth Rate</p>
                        <p className="text-2xl font-bold">{formatPercentage(mrrTrends.metrics.growth.mrrGrowth)}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ARR Target</p>
                        <p className="text-2xl font-bold">{formatCurrency(mrrTrends.metrics.arr)}</p>
                      </div>
                      <Target className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Monthly MRR Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly MRR Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mrrTrends.monthlyBreakdown.map((month: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{month.month}</div>
                        </div>
                        <div className="flex gap-4 text-sm">
                          <div className="text-green-600">
                            +{formatCurrency(month.newMRR)} New
                          </div>
                          <div className="text-blue-600">
                            +{formatCurrency(month.expansionMRR)} Expansion
                          </div>
                          <div className="text-red-600">
                            -{formatCurrency(month.churnedMRR)} Churn
                          </div>
                          <div className="font-semibold">
                            {formatCurrency(month.netMRR)} Net
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* MRR Forecast */}
              {mrrTrends.forecasting && (
                <Card>
                  <CardHeader>
                    <CardTitle>12-Month MRR Forecast</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mrrTrends.forecasting.map((forecast: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="font-medium">{forecast.month}</div>
                          <div className="flex gap-4 text-sm">
                            <div className="text-gray-600">
                              {formatCurrency(forecast.conservative)} Conservative
                            </div>
                            <div className="font-semibold">
                              {formatCurrency(forecast.projected)} Projected
                            </div>
                            <div className="text-green-600">
                              {formatCurrency(forecast.optimistic)} Optimistic
                            </div>
                            <Badge variant="outline">
                              {forecast.confidence}% confidence
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="ltv" className="space-y-6">
          {customerLTV && (
            <>
              {/* LTV Segments */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Object.entries(customerLTV.segments).map(([segment, data]: [string, any]) => (
                  <Card key={segment}>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm font-medium text-muted-foreground capitalize">
                          {segment.replace('_', ' ')} Customers
                        </p>
                        <p className="text-2xl font-bold">{data.count}</p>
                        <p className="text-sm text-muted-foreground">
                          Avg LTV: {formatCurrency(data.avgLTV)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Total: {formatCurrency(data.totalLTV)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* LTV Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer LTV Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(customerLTV.ltvDistribution).map(([range, count]: [string, any]) => (
                      <div key={range} className="text-center p-3 border rounded-lg">
                        <div className="text-2xl font-bold">{count}</div>
                        <div className="text-sm text-muted-foreground">${range}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Customers by LTV */}
              <Card>
                <CardHeader>
                  <CardTitle>Top 20 Customers by Lifetime Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {customerLTV.topCustomers.slice(0, 20).map((customer: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <div className="font-medium">{customer.email}</div>
                            <div className="text-sm text-muted-foreground">
                              {customer.purchaseFrequency.toFixed(1)} orders/month • {formatCurrency(customer.avgOrderValue)} AOV
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-semibold">{formatCurrency(customer.ltv)}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatCurrency(customer.totalRevenue)} spent
                            </div>
                          </div>
                          <Badge variant={
                            customer.segment === 'high_value' ? 'default' :
                            customer.segment === 'at_risk' ? 'destructive' : 'secondary'
                          }>
                            {customer.segment.replace('_', ' ')}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="cohorts" className="space-y-6">
          {cohortAnalysis && (
            <>
              {/* Retention Summary */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm font-medium text-muted-foreground">Month 1</p>
                    <p className="text-2xl font-bold">{cohortAnalysis.retentionSummary.avgMonth1.toFixed(1)}%</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm font-medium text-muted-foreground">Month 3</p>
                    <p className="text-2xl font-bold">{cohortAnalysis.retentionSummary.avgMonth3.toFixed(1)}%</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm font-medium text-muted-foreground">Month 6</p>
                    <p className="text-2xl font-bold">{cohortAnalysis.retentionSummary.avgMonth6.toFixed(1)}%</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm font-medium text-muted-foreground">Month 12</p>
                    <p className="text-2xl font-bold">{cohortAnalysis.retentionSummary.avgMonth12.toFixed(1)}%</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm font-medium text-muted-foreground">Month 24</p>
                    <p className="text-2xl font-bold">{cohortAnalysis.retentionSummary.avgMonth24.toFixed(1)}%</p>
                  </CardContent>
                </Card>
              </div>

              {/* Cohort Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Cohort Retention Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {cohortAnalysis.cohorts.map((cohort: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="font-semibold">{cohort.cohortMonth}</div>
                            <div className="text-sm text-muted-foreground">
                              {cohort.cohortSize} customers • {formatCurrency(cohort.averageRevenue)} avg revenue
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{formatCurrency(cohort.totalRevenue)}</div>
                            <div className="text-xs text-muted-foreground">total revenue</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="text-sm font-medium">{cohort.retentionRates.month1.toFixed(0)}%</div>
                            <div className="text-xs text-muted-foreground">Month 1</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="text-sm font-medium">{cohort.retentionRates.month3.toFixed(0)}%</div>
                            <div className="text-xs text-muted-foreground">Month 3</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="text-sm font-medium">{cohort.retentionRates.month6.toFixed(0)}%</div>
                            <div className="text-xs text-muted-foreground">Month 6</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="text-sm font-medium">{cohort.retentionRates.month12.toFixed(0)}%</div>
                            <div className="text-xs text-muted-foreground">Month 12</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <div className="text-sm font-medium">{cohort.retentionRates.month24.toFixed(0)}%</div>
                            <div className="text-xs text-muted-foreground">Month 24</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="churn" className="space-y-6">
          {churnPrediction && (
            <>
              {/* Churn Risk Distribution */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Object.entries(churnPrediction.riskDistribution.counts).map(([risk, count]: [string, any]) => (
                  <Card key={risk}>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm font-medium text-muted-foreground capitalize">{risk} Risk</p>
                      <p className="text-2xl font-bold">{count}</p>
                      <p className="text-sm text-muted-foreground">
                        {churnPrediction.riskDistribution.percentages[risk].toFixed(1)}% of customers
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Expected Impact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Churn Impact Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {churnPrediction.expectedImpact.atRiskCustomers}
                      </div>
                      <div className="text-sm text-muted-foreground">At-Risk Customers</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {formatCurrency(churnPrediction.expectedImpact.potentialRevenueLoss)}
                      </div>
                      <div className="text-sm text-muted-foreground">Potential Revenue Loss</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold">
                        {formatCurrency(churnPrediction.expectedImpact.averageLossPerCustomer)}
                      </div>
                      <div className="text-sm text-muted-foreground">Avg Loss per Customer</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(churnPrediction.expectedImpact.preventionROI)}
                      </div>
                      <div className="text-sm text-muted-foreground">Prevention ROI</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* High-Risk Customers */}
              <Card>
                <CardHeader>
                  <CardTitle>High-Risk Customers (Action Required)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {churnPrediction.predictions
                      .filter((p: any) => p.churnRisk === 'high' || p.churnRisk === 'critical')
                      .slice(0, 20)
                      .map((prediction: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            prediction.churnRisk === 'critical' ? 'bg-red-100' : 'bg-orange-100'
                          }`}>
                            <span className={`text-sm font-semibold ${
                              prediction.churnRisk === 'critical' ? 'text-red-600' : 'text-orange-600'
                            }`}>
                              {(prediction.churnProbability * 100).toFixed(0)}%
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{prediction.email}</div>
                            <div className="text-sm text-muted-foreground">
                              {prediction.daysSinceLastOrder} days since last order
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getChurnRiskBadge(prediction.churnRisk)}
                          <div className="text-right text-xs text-muted-foreground">
                            {prediction.factors.length} risk factors
                          </div>
                          <Button variant="ghost" size="sm">
                            <Mail className="h-4 w-4 mr-2" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Prevention Strategies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Recommended Prevention Strategies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="font-semibold text-red-600 mb-2">
                        Immediate Action ({churnPrediction.preventionStrategies.immediate.count} customers)
                      </div>
                      <ul className="space-y-1 text-sm">
                        {churnPrediction.preventionStrategies.immediate.actions.map((action: string, i: number) => (
                          <li key={i} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="font-semibold text-orange-600 mb-2">
                        Proactive Measures ({churnPrediction.preventionStrategies.proactive.count} customers)
                      </div>
                      <ul className="space-y-1 text-sm">
                        {churnPrediction.preventionStrategies.proactive.actions.map((action: string, i: number) => (
                          <li key={i} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-orange-600 rounded-full"></div>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="font-semibold text-green-600 mb-2">
                        Preventive Care ({churnPrediction.preventionStrategies.preventive.count} customers)
                      </div>
                      <ul className="space-y-1 text-sm">
                        {churnPrediction.preventionStrategies.preventive.actions.map((action: string, i: number) => (
                          <li key={i} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-green-600 rounded-full"></div>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="leakage" className="space-y-6">
          {revenueLeakage && (
            <>
              {/* Leakage Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {revenueLeakage.leakage.map((leak: any, index: number) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold capitalize">{leak.type.replace('_', ' ')}</div>
                        <Badge variant={leak.percentage > 5 ? 'destructive' : 'secondary'}>
                          {leak.percentage.toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold text-red-600 mb-1">
                        {formatCurrency(leak.amount)}
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {leak.affectedCustomers} customers affected
                      </div>
                      <div className="space-y-1">
                        {leak.recommendations.map((rec: string, i: number) => (
                          <div key={i} className="text-xs text-muted-foreground">
                            • {rec}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recovery Opportunities */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Recovery Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {revenueLeakage.recoveryOpportunities.map((opportunity: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium capitalize">{opportunity.type.replace('_', ' ')}</div>
                          <div className="text-sm text-muted-foreground">
                            {opportunity.timeframe} • {opportunity.effortRequired} effort required
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-semibold text-green-600">
                              {formatCurrency(opportunity.recoveryPotential)}
                            </div>
                            <div className="text-xs text-muted-foreground">recovery potential</div>
                          </div>
                          <Badge variant={
                            opportunity.priority === 'high' ? 'destructive' :
                            opportunity.priority === 'medium' ? 'default' : 'secondary'
                          }>
                            {opportunity.priority} priority
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Prevention Plan */}
              <Card>
                <CardHeader>
                  <CardTitle>Leakage Prevention Roadmap</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="font-semibold text-blue-600 mb-3">Short Term (1-3 months)</div>
                      <ul className="space-y-2">
                        {revenueLeakage.preventionPlan.shortTerm.map((item: string, i: number) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <Clock className="h-3 w-3 text-blue-600" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="font-semibold text-purple-600 mb-3">Medium Term (3-6 months)</div>
                      <ul className="space-y-2">
                        {revenueLeakage.preventionPlan.mediumTerm.map((item: string, i: number) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <Calendar className="h-3 w-3 text-purple-600" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="font-semibold text-green-600 mb-3">Long Term (6+ months)</div>
                      <ul className="space-y-2">
                        {revenueLeakage.preventionPlan.longTerm.map((item: string, i: number) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <Target className="h-3 w-3 text-green-600" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}