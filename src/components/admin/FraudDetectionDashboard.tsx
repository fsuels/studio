// Advanced Fraud & Risk Scoring Dashboard
// Velocity checks, device fingerprinting, chargeback prediction
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Shield,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Zap,
  Eye,
  Globe,
  CreditCard,
  Users,
  Target,
  Activity,
  BarChart3,
  RefreshCw,
  Download,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Smartphone,
  Wifi,
  DollarSign,
  Brain,
  Filter,
  Search,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Percent,
  Timer,
  Gauge,
  Flag,
  Lock,
  Unlock,
  ExternalLink,
  Database,
  LineChart,
  PieChart
} from 'lucide-react';

interface FraudDetectionDashboardProps {
  className?: string;
}

export default function FraudDetectionDashboard({ className }: FraudDetectionDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');
  const [riskFilter, setRiskFilter] = useState('');
  
  // Data states
  const [overview, setOverview] = useState<any>(null);
  const [riskAssessments, setRiskAssessments] = useState<any>(null);
  const [velocityAnalytics, setVelocityAnalytics] = useState<any>(null);
  const [deviceAnalytics, setDeviceAnalytics] = useState<any>(null);
  const [chargebackPredictions, setChargebackPredictions] = useState<any>(null);
  const [fraudTrends, setFraudTrends] = useState<any>(null);

  useEffect(() => {
    fetchData();
    
    // Set up real-time updates
    const interval = setInterval(fetchData, 60000); // Every minute
    return () => clearInterval(interval);
  }, [timeframe, riskFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        timeframe,
        ...(riskFilter && { riskLevel: riskFilter })
      });

      const [
        overviewRes,
        assessmentsRes,
        velocityRes,
        deviceRes,
        chargebackRes,
        trendsRes
      ] = await Promise.all([
        fetch(`/api/admin/fraud-detection?type=overview&${params}`),
        fetch(`/api/admin/fraud-detection?type=risk_assessments&${params}`),
        fetch(`/api/admin/fraud-detection?type=velocity_analytics&${params}`),
        fetch(`/api/admin/fraud-detection?type=device_analytics&${params}`),
        fetch(`/api/admin/fraud-detection?type=chargeback_predictions&${params}`),
        fetch(`/api/admin/fraud-detection?type=fraud_trends&${params}`)
      ]);

      const [
        overviewData,
        assessmentsData,
        velocityData,
        deviceData,
        chargebackData,
        trendsData
      ] = await Promise.all([
        overviewRes.json(),
        assessmentsRes.json(),
        velocityRes.json(),
        deviceRes.json(),
        chargebackRes.json(),
        trendsRes.json()
      ]);

      if (overviewData.success) setOverview(overviewData.data);
      if (assessmentsData.success) setRiskAssessments(assessmentsData.data);
      if (velocityData.success) setVelocityAnalytics(velocityData.data);
      if (deviceData.success) setDeviceAnalytics(deviceData.data);
      if (chargebackData.success) setChargebackPredictions(chargebackData.data);
      if (trendsData.success) setFraudTrends(trendsData.data);

    } catch (err) {
      setError('Failed to load fraud detection data');
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'very_high': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'very_low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'approve': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'review': return <Eye className="h-4 w-4 text-yellow-600" />;
      case 'manual_review': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'decline': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
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
          <h1 className="text-3xl font-bold">Fraud & Risk Scoring</h1>
          <p className="text-muted-foreground">
            Advanced fraud detection with velocity checks and device fingerprinting
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
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Real-time Fraud Protection</span>
              <Badge variant="outline" className="text-green-600 border-green-200">
                ACTIVE
              </Badge>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="font-semibold">94.5%</span>
                <span className="text-muted-foreground">accuracy</span>
              </div>
              <div className="flex items-center gap-1">
                <Timer className="h-4 w-4 text-yellow-600" />
                <span className="font-semibold">143ms</span>
                <span className="text-muted-foreground">avg time</span>
              </div>
              <div className="flex items-center gap-1">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="font-semibold">2.1%</span>
                <span className="text-muted-foreground">false positive</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="velocity">Velocity</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="chargeback">Chargeback</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          {overview && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Assessments</p>
                      <p className="text-2xl font-bold">{overview.summary.totalAssessments.toLocaleString()}</p>
                      <div className="text-sm text-muted-foreground">
                        {formatPercentage(overview.summary.highRiskPercentage)} high risk
                      </div>
                    </div>
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Auto Declined</p>
                      <p className="text-2xl font-bold">{overview.summary.autoDeclined}</p>
                      <div className="text-sm text-muted-foreground">
                        {formatPercentage(overview.summary.autoDeclineRate)} decline rate
                      </div>
                    </div>
                    <XCircle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Manual Reviews</p>
                      <p className="text-2xl font-bold">{overview.summary.manualReviews}</p>
                      <div className="text-sm text-muted-foreground">
                        {formatPercentage(overview.summary.manualReviewRate)} review rate
                      </div>
                    </div>
                    <Eye className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Fraud Prevented</p>
                      <p className="text-2xl font-bold">{overview.summary.fraudPrevented}</p>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(overview.summary.estimatedSavings)} saved
                      </div>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Risk Distribution */}
          {overview && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Risk Level Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-4">
                  {Object.entries(overview.riskDistribution).map(([level, count]) => (
                    <div key={level} className="text-center">
                      <div className={`p-4 rounded-lg border ${getRiskLevelColor(level)}`}>
                        <div className="text-2xl font-bold">{count as number}</div>
                        <div className="text-sm font-medium capitalize">{level.replace('_', ' ')}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatPercentage((count as number / overview.summary.totalAssessments) * 100)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top Risk Factors & Performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Risk Factors */}
            {overview && overview.topRiskFactors && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flag className="h-5 w-5" />
                    Top Risk Factors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {overview.topRiskFactors.slice(0, 8).map((factor: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-semibold flex items-center justify-center">
                            {index + 1}
                          </div>
                          <span className="text-sm font-medium">{factor.factor.replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{factor.count}</span>
                          <Badge variant="outline" className="text-xs">
                            {formatPercentage(factor.percentage)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Performance Metrics */}
            {overview && overview.performanceMetrics && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gauge className="h-5 w-5" />
                    Model Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Accuracy</span>
                      <span className="font-semibold">{formatPercentage(overview.performanceMetrics.accuracy)}</span>
                    </div>
                    <Progress value={overview.performanceMetrics.accuracy} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Precision</span>
                      <span className="font-semibold">{formatPercentage(overview.performanceMetrics.precision)}</span>
                    </div>
                    <Progress value={overview.performanceMetrics.precision} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Recall</span>
                      <span className="font-semibold">{formatPercentage(overview.performanceMetrics.recall)}</span>
                    </div>
                    <Progress value={overview.performanceMetrics.recall} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">False Positive Rate</span>
                      <span className="font-semibold text-green-600">{formatPercentage(overview.performanceMetrics.falsePositiveRate)}</span>
                    </div>
                    <Progress value={100 - overview.performanceMetrics.falsePositiveRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recent High Risk Transactions */}
          {overview && overview.recentHighRisk && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Recent High Risk Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {overview.recentHighRisk.map((transaction: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-red-50/50 border-red-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                          <span className="text-red-600 font-semibold text-sm">
                            {transaction.riskScore}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">Risk Score: {transaction.riskScore}/1000</div>
                          <div className="text-sm text-muted-foreground">
                            {transaction.topFactors.slice(0, 2).join(', ')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getRiskLevelColor(transaction.riskLevel)}>
                          {transaction.riskLevel.replace('_', ' ')}
                        </Badge>
                        <div className="text-right">
                          <div className="text-sm font-semibold">
                            {formatPercentage(parseFloat(transaction.chargebackRisk))} CB risk
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(transaction.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="velocity" className="space-y-6">
          {velocityAnalytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email Velocity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Email Velocity Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">High Velocity Emails</span>
                      <span className="font-semibold">{velocityAnalytics.emailVelocity.highVelocityEmails}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Avg Orders per Email</span>
                      <span className="font-semibold">{velocityAnalytics.emailVelocity.avgOrdersPerEmail}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Max Orders per Email</span>
                      <span className="font-semibold text-red-600">{velocityAnalytics.emailVelocity.maxOrdersPerEmail}</span>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Suspicious Patterns</h4>
                      <div className="space-y-2">
                        {velocityAnalytics.emailVelocity.suspiciousPatterns.map((pattern: any, index: number) => (
                          <div key={index} className="p-2 bg-red-50 rounded border border-red-200">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{pattern.email}</span>
                              <Badge variant="destructive">{pattern.riskScore}</Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {pattern.orderCount24h} orders, {pattern.distinctIPs} IPs
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* IP Velocity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    IP Velocity Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">High Velocity IPs</span>
                      <span className="font-semibold">{velocityAnalytics.ipVelocity.highVelocityIPs}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">VPN Detections</span>
                      <span className="font-semibold text-orange-600">{velocityAnalytics.ipVelocity.vpnDetections}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Proxy Detections</span>
                      <span className="font-semibold text-red-600">{velocityAnalytics.ipVelocity.proxyDetections}</span>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Suspicious Patterns</h4>
                      <div className="space-y-2">
                        {velocityAnalytics.ipVelocity.suspiciousPatterns.map((pattern: any, index: number) => (
                          <div key={index} className="p-2 bg-red-50 rounded border border-red-200">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{pattern.ip}</span>
                              <div className="flex items-center gap-2">
                                {pattern.vpnDetected && (
                                  <Badge variant="outline" className="text-orange-600 border-orange-200 text-xs">
                                    VPN
                                  </Badge>
                                )}
                                <Badge variant="destructive">{pattern.riskScore}</Badge>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {pattern.orderCount24h} orders, {pattern.distinctEmails} emails
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Device Velocity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Device Velocity Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">High Velocity Devices</span>
                      <span className="font-semibold">{velocityAnalytics.deviceVelocity.highVelocityDevices}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">New Device Rate</span>
                      <span className="font-semibold">{formatPercentage(velocityAnalytics.deviceVelocity.newDeviceRate)}</span>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Suspicious Patterns</h4>
                      <div className="space-y-2">
                        {velocityAnalytics.deviceVelocity.suspiciousPatterns.map((pattern: any, index: number) => (
                          <div key={index} className="p-2 bg-yellow-50 rounded border border-yellow-200">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{pattern.deviceId}</span>
                              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">{pattern.riskScore}</Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {pattern.orderCount24h} orders, {pattern.locationChanges} location changes
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card Velocity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Card Velocity Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">High Velocity Cards</span>
                      <span className="font-semibold">{velocityAnalytics.cardVelocity.highVelocityCards}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Chargeback Cards</span>
                      <span className="font-semibold text-red-600">{velocityAnalytics.cardVelocity.chargebackCards}</span>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Suspicious Patterns</h4>
                      <div className="space-y-2">
                        {velocityAnalytics.cardVelocity.suspiciousPatterns.map((pattern: any, index: number) => (
                          <div key={index} className="p-2 bg-red-50 rounded border border-red-200">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{pattern.cardLast4}</span>
                              <div className="flex items-center gap-2">
                                {pattern.chargebackHistory > 0 && (
                                  <Badge variant="destructive" className="text-xs">CB History</Badge>
                                )}
                                <Badge variant="destructive">{pattern.riskScore}</Badge>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {pattern.orderCount24h} orders, {pattern.distinctEmails} emails
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          {deviceAnalytics && (
            <>
              {/* Device Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Devices</p>
                        <p className="text-2xl font-bold">{deviceAnalytics.overview.totalDevices.toLocaleString()}</p>
                      </div>
                      <Smartphone className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">New Devices</p>
                        <p className="text-2xl font-bold">{deviceAnalytics.overview.newDevices.toLocaleString()}</p>
                        <div className="text-sm text-muted-foreground">
                          {formatPercentage((deviceAnalytics.overview.newDevices / deviceAnalytics.overview.totalDevices) * 100)}
                        </div>
                      </div>
                      <Activity className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">High Risk Devices</p>
                        <p className="text-2xl font-bold">{deviceAnalytics.overview.highRiskDevices}</p>
                        <div className="text-sm text-muted-foreground">
                          {formatPercentage((deviceAnalytics.overview.highRiskDevices / deviceAnalytics.overview.totalDevices) * 100)}
                        </div>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Blocked Devices</p>
                        <p className="text-2xl font-bold">{deviceAnalytics.overview.blockedDevices}</p>
                        <div className="text-sm text-muted-foreground">
                          Auto-blocked
                        </div>
                      </div>
                      <Lock className="h-8 w-8 text-gray-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Fingerprinting Quality & Risk Patterns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Fingerprint Quality
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">High Quality</span>
                        <span className="font-semibold text-green-600">
                          {deviceAnalytics.fingerprinting.fingerprintQuality.high.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Medium Quality</span>
                        <span className="font-semibold text-yellow-600">
                          {deviceAnalytics.fingerprinting.fingerprintQuality.medium.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Low Quality</span>
                        <span className="font-semibold text-red-600">
                          {deviceAnalytics.fingerprinting.fingerprintQuality.low.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Duplicate Fingerprints</span>
                        <span className="font-semibold text-orange-600">
                          {deviceAnalytics.fingerprinting.duplicateFingerprints}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Flag className="h-5 w-5" />
                      Risk Patterns
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Multiple Locations</span>
                        <span className="font-semibold">{deviceAnalytics.patterns.multipleLocations}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Rapid Location Changes</span>
                        <span className="font-semibold text-red-600">{deviceAnalytics.patterns.rapidLocationChanges}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Suspicious User Agents</span>
                        <span className="font-semibold text-orange-600">{deviceAnalytics.patterns.suspiciousUserAgents}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Tampering Attempts</span>
                        <span className="font-semibold text-red-600">{deviceAnalytics.patterns.tamperingAttempts}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Risky Devices */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Top Risky Devices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {deviceAnalytics.topRiskyDevices.map((device: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                            <span className="text-red-600 font-semibold text-sm">
                              {device.riskScore}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{device.deviceId}</div>
                            <div className="text-sm text-muted-foreground">
                              {device.orderCount} orders • {device.locations} locations • {device.countries} countries
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">Risk: {device.riskScore}/1000</div>
                          <div className="text-xs text-muted-foreground">
                            Last seen: {new Date(device.lastSeen).toLocaleTimeString()}
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

        <TabsContent value="chargeback" className="space-y-6">
          {chargebackPredictions && (
            <>
              {/* Chargeback Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Avg Chargeback Risk</p>
                        <p className="text-2xl font-bold">{chargebackPredictions.overview.avgChargebackRisk}%</p>
                      </div>
                      <Percent className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">High Risk Transactions</p>
                        <p className="text-2xl font-bold">{chargebackPredictions.overview.highRiskTransactions}</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Estimated Chargebacks</p>
                        <p className="text-2xl font-bold">{chargebackPredictions.overview.estimatedChargebacks}</p>
                      </div>
                      <TrendingDown className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Estimated Losses</p>
                        <p className="text-2xl font-bold">{formatCurrency(parseFloat(chargebackPredictions.overview.estimatedLosses))}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Risk Bands & Top Risk Factors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Chargeback Risk Bands
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(chargebackPredictions.riskBands).map(([band, count]) => (
                        <div key={band} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded ${
                              band === 'A' ? 'bg-green-500' :
                              band === 'B' ? 'bg-blue-500' :
                              band === 'C' ? 'bg-yellow-500' :
                              band === 'D' ? 'bg-orange-500' : 'bg-red-500'
                            }`}></div>
                            <span className="text-sm font-medium">Band {band}</span>
                            <span className="text-xs text-muted-foreground">
                              ({band === 'A' ? '<2%' : band === 'B' ? '2-4%' : band === 'C' ? '4-8%' : band === 'D' ? '8-15%' : '>15%'} risk)
                            </span>
                          </div>
                          <span className="font-semibold">{count as number}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Top Chargeback Risk Factors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {chargebackPredictions.topRiskFactors.map((factor: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium">{factor.factor}</div>
                            <div className="text-xs text-muted-foreground">
                              {factor.frequency} occurrences
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-red-600">
                              +{formatPercentage(factor.impact * 100)} impact
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* High Risk Predictions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    High Risk Chargeback Predictions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {chargebackPredictions.highRiskPredictions.slice(0, 10).map((prediction: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-red-50/50 border-red-200">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            prediction.riskBand === 'E' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                          }`}>
                            {prediction.riskBand}
                          </div>
                          <div>
                            <div className="font-medium">{prediction.orderId}</div>
                            <div className="text-sm text-muted-foreground">
                              {prediction.customerEmail} • {formatCurrency(parseFloat(prediction.orderValue))}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-red-600">
                            {prediction.probability}% risk
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Est. loss: {formatCurrency(parseFloat(prediction.expectedLoss))}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {prediction.confidence}% confidence
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

        <TabsContent value="assessments" className="space-y-6">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by risk level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Risk Levels</SelectItem>
                <SelectItem value="very_high">Very High</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="very_low">Very Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Risk Assessments Table */}
          {riskAssessments && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Recent Risk Assessments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {riskAssessments.assessments.map((assessment: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="font-semibold text-sm">
                            {assessment.overallScore}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{assessment.orderId}</div>
                          <div className="text-sm text-muted-foreground">
                            {assessment.customerEmail} • {formatCurrency(assessment.orderValue)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(assessment.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <Badge className={getRiskLevelColor(assessment.riskLevel)}>
                            {assessment.riskLevel.replace('_', ' ')}
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-1">
                            {assessment.processingTime}ms
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getRecommendationIcon(assessment.recommendation)}
                          <span className="text-sm font-medium capitalize">
                            {assessment.recommendation.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {fraudTrends && (
            <>
              {/* Trend Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Trend Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Risk Score Trend</span>
                        <div className="flex items-center gap-1">
                          {fraudTrends.insights.riskScoreChange.direction === 'increasing' ? (
                            <ArrowUp className="h-4 w-4 text-red-600" />
                          ) : (
                            <ArrowDown className="h-4 w-4 text-green-600" />
                          )}
                          <span className={`font-semibold ${
                            fraudTrends.insights.riskScoreChange.direction === 'increasing' ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {fraudTrends.insights.riskScoreChange.value}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Decline Rate Trend</span>
                        <div className="flex items-center gap-1">
                          {fraudTrends.insights.declineRateChange.direction === 'increasing' ? (
                            <ArrowUp className="h-4 w-4 text-red-600" />
                          ) : (
                            <ArrowDown className="h-4 w-4 text-green-600" />
                          )}
                          <span className={`font-semibold ${
                            fraudTrends.insights.declineRateChange.direction === 'increasing' ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {fraudTrends.insights.declineRateChange.value}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Seasonal Patterns
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {fraudTrends.insights.seasonalPatterns.map((pattern: string, index: number) => (
                        <div key={index} className="text-sm p-2 bg-blue-50 rounded border border-blue-200">
                          {pattern}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Emerging Threats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Emerging Threats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {fraudTrends.insights.emergingThreats.map((threat: string, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-red-50 rounded border border-red-200">
                        <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
                        <span className="text-sm">{threat}</span>
                      </div>
                    ))}
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