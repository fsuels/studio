// Advanced AI Usage & Cost Analytics Dashboard
// Track token usage by model, success rate, latency, cost per doc
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
  Brain,
  DollarSign,
  Zap,
  Clock,
  Target,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Activity,
  BarChart3,
  RefreshCw,
  Download,
  Settings,
  Eye,
  Cpu,
  Database,
  Gauge,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Lightbulb,
  Sparkles,
  Timer,
  Users,
  FileText,
  MessageSquare,
  Search,
  Filter,
  ExternalLink,
  PieChart,
  LineChart,
  Percent,
  Calendar,
  AlertCircle,
  Info,
  Wallet,
  CreditCard,
  TrendingUpIcon,
} from 'lucide-react';
import {
  formatCurrency,
  formatTokens,
  type AIModel,
  type AIEndpoint,
} from '@/lib/ai-usage-analytics';

interface AIUsageDashboardProps {
  className?: string;
}

export default function AIUsageDashboard({ className }: AIUsageDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');
  const [modelFilter, setModelFilter] = useState('');
  const [endpointFilter, setEndpointFilter] = useState('');

  // Data states
  const [overview, setOverview] = useState<any>(null);
  const [modelAnalysis, setModelAnalysis] = useState<any>(null);
  const [endpointAnalysis, setEndpointAnalysis] = useState<any>(null);
  const [costOptimization, setCostOptimization] = useState<any>(null);
  const [budgetMonitoring, setBudgetMonitoring] = useState<any>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const [realtimeStatus, setRealtimeStatus] = useState<any>(null);

  useEffect(() => {
    fetchData();

    // Set up real-time updates
    const interval = setInterval(fetchRealtimeData, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, [timeframe, modelFilter, endpointFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        timeframe,
        ...(modelFilter && { model: modelFilter }),
        ...(endpointFilter && { endpoint: endpointFilter }),
      });

      const [
        overviewRes,
        modelRes,
        endpointRes,
        optimizationRes,
        budgetRes,
        performanceRes,
      ] = await Promise.all([
        fetch(`/api/admin/ai-usage?type=overview&${params}`),
        fetch(`/api/admin/ai-usage?type=model_analysis&${params}`),
        fetch(`/api/admin/ai-usage?type=endpoint_analysis&${params}`),
        fetch(`/api/admin/ai-usage?type=cost_optimization&${params}`),
        fetch(`/api/admin/ai-usage?type=budget_monitoring&${params}`),
        fetch(`/api/admin/ai-usage?type=performance_metrics&${params}`),
      ]);

      const [
        overviewData,
        modelData,
        endpointData,
        optimizationData,
        budgetData,
        performanceData,
      ] = await Promise.all([
        overviewRes.json(),
        modelRes.json(),
        endpointRes.json(),
        optimizationRes.json(),
        budgetRes.json(),
        performanceRes.json(),
      ]);

      if (overviewData.success) setOverview(overviewData.data);
      if (modelData.success) setModelAnalysis(modelData.data);
      if (endpointData.success) setEndpointAnalysis(endpointData.data);
      if (optimizationData.success) setCostOptimization(optimizationData.data);
      if (budgetData.success) setBudgetMonitoring(budgetData.data);
      if (performanceData.success) setPerformanceMetrics(performanceData.data);
    } catch (err) {
      setError('Failed to load AI usage analytics');
    } finally {
      setLoading(false);
    }
  };

  const fetchRealtimeData = async () => {
    try {
      const response = await fetch('/api/admin/ai-usage?type=realtime_status');
      const data = await response.json();

      if (data.success) {
        setRealtimeStatus(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch real-time data:', err);
    }
  };

  const getModelIcon = (model: AIModel) => {
    const icons = {
      'gpt-4': <Brain className="h-4 w-4" />,
      'gpt-4-turbo': <Zap className="h-4 w-4" />,
      'gpt-3.5-turbo': <MessageSquare className="h-4 w-4" />,
      'claude-3-opus': <Sparkles className="h-4 w-4" />,
      'claude-3-sonnet': <Activity className="h-4 w-4" />,
      'claude-3-haiku': <Timer className="h-4 w-4" />,
      'gemini-pro': <Eye className="h-4 w-4" />,
      custom: <Settings className="h-4 w-4" />,
    };
    return icons[model] || <Brain className="h-4 w-4" />;
  };

  const getEndpointIcon = (endpoint: AIEndpoint) => {
    const icons = {
      document_generation: <FileText className="h-4 w-4" />,
      legal_review: <Search className="h-4 w-4" />,
      clause_explanation: <MessageSquare className="h-4 w-4" />,
      content_summarization: <BarChart3 className="h-4 w-4" />,
      form_validation: <CheckCircle className="h-4 w-4" />,
      document_analysis: <Database className="h-4 w-4" />,
      customer_support: <Users className="h-4 w-4" />,
      translation: <ArrowRight className="h-4 w-4" />,
      template_creation: <Settings className="h-4 w-4" />,
    };
    return icons[endpoint] || <Activity className="h-4 w-4" />;
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (efficiency >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (efficiency >= 40)
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500 bg-red-50';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50';
      case 'info':
        return 'border-blue-500 bg-blue-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const formatLatency = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
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
          <h1 className="text-3xl font-bold">AI Usage & Cost Analytics</h1>
          <p className="text-muted-foreground">
            Track token usage, model performance, and optimize AI spending
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
      {realtimeStatus && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Real-time AI Status</span>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold">
                    {realtimeStatus.activeRequests}
                  </span>
                  <span className="text-muted-foreground">active</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="font-semibold">
                    {formatLatency(realtimeStatus.avgLatency)}
                  </span>
                  <span className="text-muted-foreground">avg latency</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-semibold">
                    {formatCurrency(realtimeStatus.costPerHour)}
                  </span>
                  <span className="text-muted-foreground">per hour</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="font-semibold">
                    {formatPercentage(realtimeStatus.errorRate)}
                  </span>
                  <span className="text-muted-foreground">error rate</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Critical Alerts */}
      {overview &&
        overview.criticalAlerts &&
        overview.criticalAlerts.length > 0 && (
          <div className="space-y-3">
            {overview.criticalAlerts.map((alert: any, index: number) => (
              <Alert
                key={index}
                className={getAlertSeverityColor(alert.severity)}
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>{alert.message}</span>
                  {alert.value && (
                    <span className="font-semibold">
                      {alert.type.includes('budget')
                        ? formatCurrency(alert.value)
                        : alert.value}
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          {overview && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Cost
                      </p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(overview.overview.totalCost)}
                      </p>
                      <div className="text-sm text-muted-foreground">
                        {formatTokens(overview.overview.totalTokens)} tokens
                      </div>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Requests
                      </p>
                      <p className="text-2xl font-bold">
                        {overview.overview.totalRequests.toLocaleString()}
                      </p>
                      <div className="text-sm text-muted-foreground">
                        {formatPercentage(overview.overview.successRate)}{' '}
                        success
                      </div>
                    </div>
                    <Activity className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Avg Latency
                      </p>
                      <p className="text-2xl font-bold">
                        {formatLatency(overview.overview.avgLatency)}
                      </p>
                      <div className="text-sm text-muted-foreground">
                        Per request
                      </div>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Cost per Document
                      </p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(overview.overview.costPerDocument)}
                      </p>
                      <div className="text-sm text-muted-foreground">
                        Avg AI cost
                      </div>
                    </div>
                    <FileText className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Budget Status */}
          {overview && overview.budgetTracking && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Monthly Budget Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">
                        {formatCurrency(overview.budgetTracking.currentSpend)} /{' '}
                        {formatCurrency(overview.budgetTracking.monthlyBudget)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {overview.budgetTracking.daysRemaining} days remaining
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">
                        {formatPercentage(
                          overview.budgetTracking.budgetUtilization,
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        utilized
                      </div>
                    </div>
                  </div>

                  <Progress
                    value={overview.budgetTracking.budgetUtilization}
                    className="h-3"
                  />

                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-muted-foreground">
                        Daily burn rate:{' '}
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(overview.budgetTracking.burnRate)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Projected: </span>
                      <span
                        className={`font-semibold ${
                          overview.budgetTracking.projectedSpend >
                          overview.budgetTracking.monthlyBudget
                            ? 'text-red-600'
                            : 'text-green-600'
                        }`}
                      >
                        {formatCurrency(overview.budgetTracking.projectedSpend)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top Models and Endpoints */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Models */}
            {overview && overview.topModels && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Top Models by Cost
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {overview.topModels.map((model: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {getModelIcon(model.model)}
                          <div>
                            <div className="font-medium">{model.model}</div>
                            <div className="text-sm text-muted-foreground">
                              {model.requests.toLocaleString()} requests
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            {formatCurrency(model.cost)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatPercentage(model.successRate)} success
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Top Endpoints */}
            {overview && overview.topEndpoints && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Top Endpoints by Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {overview.topEndpoints.map(
                      (endpoint: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {getEndpointIcon(endpoint.endpoint)}
                            <div>
                              <div className="font-medium capitalize">
                                {endpoint.endpoint.replace('_', ' ')}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {endpoint.requests.toLocaleString()} requests
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              {formatCurrency(endpoint.cost)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {formatLatency(endpoint.avgLatency)}
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          {modelAnalysis && (
            <>
              {/* Model Performance Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Model Performance Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {modelAnalysis.modelBreakdown.map(
                      (model: any, index: number) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              {getModelIcon(model.model)}
                              <div>
                                <h3 className="font-semibold">{model.model}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {model.requests.toLocaleString()} requests •{' '}
                                  {formatTokens(model.tokens)} tokens
                                </p>
                              </div>
                            </div>
                            <Badge
                              className={getEfficiencyColor(model.efficiency)}
                            >
                              Efficiency: {model.efficiency.toFixed(1)}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">
                                Total Cost
                              </span>
                              <div className="font-semibold">
                                {formatCurrency(model.cost)}
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Avg Latency
                              </span>
                              <div className="font-semibold">
                                {formatLatency(model.avgLatency)}
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Success Rate
                              </span>
                              <div className="font-semibold">
                                {formatPercentage(model.successRate)}
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Cost per Request
                              </span>
                              <div className="font-semibold">
                                {formatCurrency(model.costPerRequest)}
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

        <TabsContent value="endpoints" className="space-y-6">
          {endpointAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Endpoint Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {endpointAnalysis.endpointAnalysis.map(
                    (endpoint: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {getEndpointIcon(endpoint.endpoint)}
                            <div>
                              <h3 className="font-semibold capitalize">
                                {endpoint.endpoint.replace('_', ' ')}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {endpoint.requests.toLocaleString()} requests •
                                Top model: {endpoint.topModel}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">
                              {formatCurrency(endpoint.cost)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              total cost
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Avg Latency
                            </span>
                            <div className="font-semibold">
                              {formatLatency(endpoint.avgLatency)}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Success Rate
                            </span>
                            <div className="font-semibold">
                              {formatPercentage(endpoint.successRate)}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Conversion Impact
                            </span>
                            <div className="font-semibold">
                              {formatPercentage(endpoint.conversionImpact)}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Revenue Attribution
                            </span>
                            <div className="font-semibold">
                              {formatCurrency(endpoint.revenueAttribution)}
                            </div>
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

        <TabsContent value="optimization" className="space-y-6">
          {costOptimization && (
            <>
              {/* Cost Saving Opportunities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Cost Saving Opportunities
                    <Badge variant="outline" className="ml-2">
                      {formatCurrency(costOptimization.totalPotentialSaving)}{' '}
                      potential saving
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {costOptimization.costSavingOpportunities.map(
                      (opportunity: any, index: number) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  opportunity.impact === 'high'
                                    ? 'bg-red-100 text-red-600'
                                    : opportunity.impact === 'medium'
                                      ? 'bg-yellow-100 text-yellow-600'
                                      : 'bg-blue-100 text-blue-600'
                                }`}
                              >
                                {index + 1}
                              </div>
                              <div>
                                <h3 className="font-semibold">
                                  {opportunity.description}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {opportunity.recommendation}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-600">
                                {formatCurrency(opportunity.potentialSaving)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                savings
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4">
                              <div>
                                <span className="text-muted-foreground">
                                  Current Cost:{' '}
                                </span>
                                <span className="font-semibold">
                                  {formatCurrency(opportunity.currentCost)}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Effort:{' '}
                                </span>
                                <Badge
                                  variant={
                                    opportunity.effort === 'high'
                                      ? 'destructive'
                                      : opportunity.effort === 'medium'
                                        ? 'default'
                                        : 'secondary'
                                  }
                                >
                                  {opportunity.effort}
                                </Badge>
                              </div>
                            </div>
                            <Badge
                              variant={
                                opportunity.impact === 'high'
                                  ? 'destructive'
                                  : opportunity.impact === 'medium'
                                    ? 'default'
                                    : 'secondary'
                              }
                            >
                              {opportunity.impact} impact
                            </Badge>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Model Recommendations */}
              {costOptimization.modelRecommendations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ArrowRight className="h-5 w-5" />
                      Model Switch Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {costOptimization.modelRecommendations.map(
                        (rec: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div>
                                <div className="font-medium">
                                  {rec.endpoint.replace('_', ' ')} endpoint
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Switch from {rec.currentModel} to{' '}
                                  {rec.recommendedModel}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="text-sm font-semibold text-green-600">
                                  {formatCurrency(rec.costSaving)} saving
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {rec.performanceImpact}
                                </div>
                              </div>
                              <Button size="sm" variant="outline">
                                Implement
                              </Button>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="budget" className="space-y-6">
          {budgetMonitoring && (
            <>
              {/* Budget Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Monthly Budget
                        </p>
                        <p className="text-2xl font-bold">
                          {formatCurrency(
                            budgetMonitoring.budgetTracking.monthlyBudget,
                          )}
                        </p>
                      </div>
                      <CreditCard className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Current Spend
                        </p>
                        <p className="text-2xl font-bold">
                          {formatCurrency(
                            budgetMonitoring.budgetTracking.currentSpend,
                          )}
                        </p>
                        <div className="text-sm text-muted-foreground">
                          {formatPercentage(
                            budgetMonitoring.budgetTracking.budgetUtilization,
                          )}{' '}
                          utilized
                        </div>
                      </div>
                      <Wallet className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Projected Spend
                        </p>
                        <p
                          className={`text-2xl font-bold ${
                            budgetMonitoring.budgetTracking.projectedSpend >
                            budgetMonitoring.budgetTracking.monthlyBudget
                              ? 'text-red-600'
                              : 'text-green-600'
                          }`}
                        >
                          {formatCurrency(
                            budgetMonitoring.budgetTracking.projectedSpend,
                          )}
                        </p>
                        <div className="text-sm text-muted-foreground">
                          {budgetMonitoring.budgetTracking.daysRemaining} days
                          remaining
                        </div>
                      </div>
                      <TrendingUpIcon className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Daily Spending Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5" />
                    Daily Spending Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {budgetMonitoring.dailyCosts
                      .slice(-7)
                      .map((day: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <div className="font-medium">
                              {new Date(day.date).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {day.requests.toLocaleString()} requests •{' '}
                              {formatTokens(day.tokens)} tokens
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              {formatCurrency(day.cost)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              daily cost
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

        <TabsContent value="performance" className="space-y-6">
          {performanceMetrics && (
            <>
              {/* Performance Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Avg Latency
                        </p>
                        <p className="text-2xl font-bold">
                          {performanceMetrics.latencyTrends.length > 0
                            ? formatLatency(
                                performanceMetrics.latencyTrends[
                                  performanceMetrics.latencyTrends.length - 1
                                ].avgLatency,
                              )
                            : '0ms'}
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Quality Score
                        </p>
                        <p className="text-2xl font-bold">
                          {performanceMetrics.qualityTrends.length > 0
                            ? formatPercentage(
                                performanceMetrics.qualityTrends[
                                  performanceMetrics.qualityTrends.length - 1
                                ].avgQuality,
                              )
                            : '0%'}
                        </p>
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
                          User Rating
                        </p>
                        <p className="text-2xl font-bold">
                          {performanceMetrics.qualityTrends.length > 0
                            ? `${performanceMetrics.qualityTrends[performanceMetrics.qualityTrends.length - 1].userRating.toFixed(1)}/5`
                            : '0/5'}
                        </p>
                      </div>
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Alerts */}
              {performanceMetrics.performanceAlerts &&
                performanceMetrics.performanceAlerts.length > 0 && (
                  <div className="space-y-3">
                    {performanceMetrics.performanceAlerts.map(
                      (alert: any, index: number) => (
                        <Alert
                          key={index}
                          className={getAlertSeverityColor(alert.severity)}
                        >
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription className="flex items-center justify-between">
                            <span>{alert.message}</span>
                            <span className="font-semibold">
                              {alert.type === 'high_latency'
                                ? formatLatency(alert.value)
                                : formatPercentage(alert.value)}
                            </span>
                          </AlertDescription>
                        </Alert>
                      ),
                    )}
                  </div>
                )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
