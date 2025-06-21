// Advanced Funnel & Conversion Analytics Dashboard
// Step-drop analytics for "visit" → "draft" → "checkout" → "signed"
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
  TrendingDown,
  TrendingUp,
  Users,
  Clock,
  AlertTriangle,
  Target,
  BarChart3,
  Activity,
  Zap,
  ArrowRight,
  ArrowDown,
  RefreshCw,
  Download,
  Eye,
  Filter,
  Search,
  PlayCircle,
  StopCircle,
  Timer,
  Gauge,
  Settings,
  ExternalLink,
} from 'lucide-react';

interface FunnelAnalyticsProps {
  className?: string;
}

export default function FunnelAnalyticsDashboard({
  className,
}: FunnelAnalyticsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');
  const [documentFilter, setDocumentFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');

  // Data states
  const [overview, setOverview] = useState<any>(null);
  const [conversionMetrics, setConversionMetrics] = useState<any>(null);
  const [abandonmentAnalysis, setAbandonmentAnalysis] = useState<any>(null);
  const [stepDetails, setStepDetails] = useState<any>(null);
  const [realtimeSessions, setRealtimeSessions] = useState<any>(null);

  useEffect(() => {
    fetchData();

    // Set up real-time updates
    const interval = setInterval(fetchRealtimeData, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, [timeframe, documentFilter, sourceFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        timeframe,
        ...(documentFilter && { documentType: documentFilter }),
        ...(sourceFilter && { source: sourceFilter }),
      });

      const [overviewRes, metricsRes, abandonmentRes, stepDetailsRes] =
        await Promise.all([
          fetch(`/api/analytics/funnel?type=overview&${params}`),
          fetch(`/api/analytics/funnel?type=conversion_metrics&${params}`),
          fetch(`/api/analytics/funnel?type=abandonment_analysis&${params}`),
          fetch(`/api/analytics/funnel?type=step_details&${params}`),
        ]);

      const [overviewData, metricsData, abandonmentData, stepDetailsData] =
        await Promise.all([
          overviewRes.json(),
          metricsRes.json(),
          abandonmentRes.json(),
          stepDetailsRes.json(),
        ]);

      if (overviewData.success) setOverview(overviewData.data);
      if (metricsData.success) setConversionMetrics(metricsData.data);
      if (abandonmentData.success) setAbandonmentAnalysis(abandonmentData.data);
      if (stepDetailsData.success) setStepDetails(stepDetailsData.data);
    } catch (err) {
      setError('Failed to load funnel analytics data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRealtimeData = async () => {
    try {
      const response = await fetch(
        '/api/analytics/funnel?type=realtime_sessions',
      );
      const data = await response.json();

      if (data.success) {
        setRealtimeSessions(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch real-time data:', err);
    }
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds.toFixed(0)}s`;
    if (seconds < 3600) return `${(seconds / 60).toFixed(1)}m`;
    return `${(seconds / 3600).toFixed(1)}h`;
  };

  const getStepIcon = (step: string) => {
    const icons = {
      visit: <Eye className="h-4 w-4" />,
      draft: <Settings className="h-4 w-4" />,
      checkout: <Target className="h-4 w-4" />,
      signed: <PlayCircle className="h-4 w-4" />,
    };
    return (
      icons[step as keyof typeof icons] || <Activity className="h-4 w-4" />
    );
  };

  const getConversionColor = (rate: number) => {
    if (rate >= 70) return 'text-green-600 bg-green-50 border-green-200';
    if (rate >= 50) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (rate >= 30) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getDropoffSeverity = (rate: number) => {
    if (rate >= 50) return 'critical';
    if (rate >= 30) return 'high';
    if (rate >= 15) return 'medium';
    return 'low';
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
          <h1 className="text-3xl font-bold">Funnel & Conversion Analytics</h1>
          <p className="text-muted-foreground">
            Step-drop analytics for visit → draft → checkout → signed
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
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

      {/* Real-time Status */}
      {realtimeSessions && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Real-time Sessions</span>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold">
                    {realtimeSessions.activeSessions}
                  </span>
                  <span className="text-muted-foreground">active</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="font-semibold">
                    {realtimeSessions.atRiskSessions.length}
                  </span>
                  <span className="text-muted-foreground">at risk</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="h-4 w-4 text-green-600" />
                  <span className="font-semibold">
                    {realtimeSessions.recentConversions.length}
                  </span>
                  <span className="text-muted-foreground">
                    recent conversions
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="funnel">Funnel Flow</TabsTrigger>
          <TabsTrigger value="abandonment">Abandonment</TabsTrigger>
          <TabsTrigger value="optimization">UX Optimization</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Conversion Overview */}
          {overview && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Overall Conversion
                      </p>
                      <p className="text-2xl font-bold">
                        {formatPercentage(
                          overview.conversionRates.visitToSigned,
                        )}
                      </p>
                      <div className="text-sm text-muted-foreground">
                        Visit → Signed
                      </div>
                    </div>
                    <Target className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Highest Dropoff
                      </p>
                      <p className="text-2xl font-bold text-red-600">
                        {formatPercentage(
                          overview.abandonmentSummary.highestDropoff
                            ?.percentage || 0,
                        )}
                      </p>
                      <div className="text-sm text-muted-foreground capitalize">
                        {overview.abandonmentSummary.highestDropoff?.step ||
                          'N/A'}
                      </div>
                    </div>
                    <TrendingDown className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Avg Conversion Time
                      </p>
                      <p className="text-2xl font-bold">
                        {formatTime(
                          overview.timeMetrics?.avgTimeToConvert || 0,
                        )}
                      </p>
                      <div className="text-sm text-muted-foreground">
                        Visit to signed
                      </div>
                    </div>
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Recovery Potential
                      </p>
                      <p className="text-2xl font-bold text-purple-600">
                        {formatPercentage(
                          overview.abandonmentSummary.recoveryPotential || 0,
                        )}
                      </p>
                      <div className="text-sm text-muted-foreground">
                        Revenue recoverable
                      </div>
                    </div>
                    <Zap className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step-by-Step Conversion Rates */}
          {overview && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Conversion Rates by Step
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStepIcon('visit')}
                      <div>
                        <div className="font-medium">Visit → Draft</div>
                        <div className="text-sm text-muted-foreground">
                          Initial engagement
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        className={getConversionColor(
                          overview.conversionRates.visitToDraft,
                        )}
                      >
                        {formatPercentage(
                          overview.conversionRates.visitToDraft,
                        )}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStepIcon('draft')}
                      <div>
                        <div className="font-medium">Draft → Checkout</div>
                        <div className="text-sm text-muted-foreground">
                          Form completion
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        className={getConversionColor(
                          overview.conversionRates.draftToCheckout,
                        )}
                      >
                        {formatPercentage(
                          overview.conversionRates.draftToCheckout,
                        )}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStepIcon('checkout')}
                      <div>
                        <div className="font-medium">Checkout → Signed</div>
                        <div className="text-sm text-muted-foreground">
                          Payment completion
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        className={getConversionColor(
                          overview.conversionRates.checkoutToSigned,
                        )}
                      >
                        {formatPercentage(
                          overview.conversionRates.checkoutToSigned,
                        )}
                      </Badge>
                      <Target className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top UX Optimizations */}
          {overview && overview.topOptimizations && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Priority UX Optimizations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {overview.topOptimizations.map(
                    (optimization: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              optimization.priority === 'critical'
                                ? 'bg-red-100 text-red-600'
                                : optimization.priority === 'high'
                                  ? 'bg-orange-100 text-orange-600'
                                  : 'bg-yellow-100 text-yellow-600'
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">
                              {optimization.issue}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {optimization.step} step
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-sm font-semibold text-green-600">
                              +{optimization.estimatedImpact}% impact
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {optimization.implementationEffort} effort
                            </div>
                          </div>
                          <Badge
                            variant={
                              optimization.priority === 'critical'
                                ? 'destructive'
                                : optimization.priority === 'high'
                                  ? 'default'
                                  : 'secondary'
                            }
                          >
                            {optimization.priority}
                          </Badge>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="funnel" className="space-y-6">
          {stepDetails && (
            <Card>
              <CardHeader>
                <CardTitle>Detailed Funnel Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {stepDetails.steps.map((step: any, index: number) => (
                    <div key={index} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {getStepIcon(step.step)}
                          <div>
                            <h3 className="text-lg font-semibold capitalize">
                              {step.step}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {step.sessions.toLocaleString()} sessions •{' '}
                              {step.uniqueUsers.toLocaleString()} users
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-2xl font-bold">
                              {formatTime(step.avgTimeOnStep)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              avg time
                            </div>
                          </div>
                          <div className="text-right">
                            <div
                              className={`text-2xl font-bold ${
                                step.dropoffRate > 30
                                  ? 'text-red-600'
                                  : step.dropoffRate > 15
                                    ? 'text-yellow-600'
                                    : 'text-green-600'
                              }`}
                            >
                              {formatPercentage(step.dropoffRate)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              dropoff rate
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Common Issues</h4>
                          <ul className="space-y-1 text-sm">
                            {step.commonIssues.map(
                              (issue: string, i: number) => (
                                <li
                                  key={i}
                                  className="flex items-center gap-2 text-red-600"
                                >
                                  <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                                  {issue}
                                </li>
                              ),
                            )}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">
                            Conversion Factors
                          </h4>
                          <ul className="space-y-1 text-sm">
                            {step.conversionFactors.map(
                              (factor: string, i: number) => (
                                <li
                                  key={i}
                                  className="flex items-center gap-2 text-green-600"
                                >
                                  <div className="w-1 h-1 bg-green-600 rounded-full"></div>
                                  {factor}
                                </li>
                              ),
                            )}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Top Exit Pages</h4>
                          <ul className="space-y-1 text-sm">
                            {step.topExitPages
                              .slice(0, 3)
                              .map((page: string, i: number) => (
                                <li
                                  key={i}
                                  className="flex items-center gap-2 text-muted-foreground"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  {page}
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="abandonment" className="space-y-6">
          {abandonmentAnalysis && (
            <>
              {/* Abandonment Points */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5" />
                    Abandonment Analysis by Step
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {abandonmentAnalysis.abandonmentPoints.map(
                      (point: any, index: number) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {getStepIcon(point.step)}
                              <span className="font-medium capitalize">
                                {point.step}
                              </span>
                            </div>
                            <Badge
                              variant={
                                getDropoffSeverity(point.percentage) ===
                                'critical'
                                  ? 'destructive'
                                  : getDropoffSeverity(point.percentage) ===
                                      'high'
                                    ? 'default'
                                    : 'secondary'
                              }
                            >
                              {getDropoffSeverity(point.percentage)}
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Abandonment Rate
                              </span>
                              <span className="font-semibold">
                                {formatPercentage(point.percentage)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Count
                              </span>
                              <span className="font-semibold">
                                {point.count.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Avg Time Before
                              </span>
                              <span className="font-semibold">
                                {formatTime(point.avgTimeBeforeAbandon)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Recovery Potential
                              </span>
                              <span className="font-semibold text-green-600">
                                {formatPercentage(point.recoveryPotential)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Abandonment Factors */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Abandonment Factors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {abandonmentAnalysis.abandonmentFactors.map(
                      (factor: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <div className="font-medium">{factor.factor}</div>
                            <div className="text-sm text-muted-foreground">
                              {factor.description}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-sm font-semibold">
                                {formatPercentage(factor.impact * 100)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                impact
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold">
                                {formatPercentage(factor.correlation * 100)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                correlation
                              </div>
                            </div>
                            {factor.actionable && (
                              <Badge
                                variant="outline"
                                className="text-green-600 border-green-200"
                              >
                                Actionable
                              </Badge>
                            )}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          {abandonmentAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  UX Optimization Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {abandonmentAnalysis.uxOptimizations.map(
                    (optimization: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                optimization.priority === 'critical'
                                  ? 'bg-red-100 text-red-600'
                                  : optimization.priority === 'high'
                                    ? 'bg-orange-100 text-orange-600'
                                    : optimization.priority === 'medium'
                                      ? 'bg-yellow-100 text-yellow-600'
                                      : 'bg-blue-100 text-blue-600'
                              }`}
                            >
                              {index + 1}
                            </div>
                            <div>
                              <h3 className="font-semibold">
                                {optimization.issue}
                              </h3>
                              <p className="text-sm text-muted-foreground capitalize">
                                {optimization.step} step optimization
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant={
                              optimization.priority === 'critical'
                                ? 'destructive'
                                : optimization.priority === 'high'
                                  ? 'default'
                                  : 'secondary'
                            }
                          >
                            {optimization.priority}
                          </Badge>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm">
                            {optimization.recommendation}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4">
                            <div>
                              <span className="text-muted-foreground">
                                Impact:{' '}
                              </span>
                              <span className="font-semibold text-green-600">
                                +{optimization.estimatedImpact}%
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Effort:{' '}
                              </span>
                              <span className="font-semibold">
                                {optimization.implementationEffort}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {optimization.testingRequired && (
                              <Badge
                                variant="outline"
                                className="text-blue-600 border-blue-200"
                              >
                                A/B Test Required
                              </Badge>
                            )}
                            <Button size="sm" variant="outline">
                              Implement
                            </Button>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          {realtimeSessions && (
            <>
              {/* Current Session Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Current Session Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(
                      realtimeSessions.currentStepDistribution,
                    ).map(([step, count]: [string, any]) => (
                      <div
                        key={step}
                        className="text-center p-4 border rounded-lg"
                      >
                        <div className="flex items-center justify-center mb-2">
                          {getStepIcon(step)}
                        </div>
                        <div className="text-2xl font-bold">{count}</div>
                        <div className="text-sm text-muted-foreground capitalize">
                          {step}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* At-Risk Sessions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    High-Risk Sessions (Intervention Recommended)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {realtimeSessions.atRiskSessions.map(
                      (session: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg bg-red-50/50 border-red-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-red-600">
                                {(session.abandonmentRisk * 100).toFixed(0)}%
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">
                                {session.sessionId}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {session.documentType} •{' '}
                                {formatTime(session.timeOnStep)} on{' '}
                                {session.currentStep}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="destructive">High Risk</Badge>
                            <Button size="sm" variant="outline">
                              <Zap className="h-4 w-4 mr-1" />
                              Intervene
                            </Button>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Conversions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Recent Conversions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {realtimeSessions.recentConversions.map(
                      (conversion: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg bg-green-50/50 border-green-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <Target className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <div className="font-medium">
                                {conversion.sessionId}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {conversion.documentType} •{' '}
                                {formatTime(conversion.conversionTime)} to
                                convert
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <div className="font-semibold text-green-600">
                                ${conversion.value}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(
                                  conversion.completedAt,
                                ).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ),
                    )}
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
