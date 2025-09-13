// src/app/[locale]/(app)/admin/operational-health/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  
  Wifi,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OperationalMetrics {
  errorRate: {
    current: number;
    p95: number;
    trend: 'up' | 'down' | 'stable';
  };
  latency: {
    p50: number;
    p95: number;
    p99: number;
    avg: number;
  };
  throughput: {
    requestsPerMinute: number;
    successfulRequests: number;
    failedRequests: number;
  };
  queueDepth: {
    current: number;
    max: number;
    processing: number;
  };
  systemHealth: {
    score: number;
    status: 'healthy' | 'degraded' | 'critical';
    uptime: number;
  };
}

interface HealthAlert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: number;
  resolved: boolean;
  metadata: Record<string, any>;
}

interface HealthData {
  metrics: OperationalMetrics;
  alerts: HealthAlert[];
  timestamp: string;
  summary: {
    healthy: boolean;
    score: number;
    activeAlerts: number;
    criticalAlerts: number;
  };
}

export default function OperationalHealthPage() {
  const { toast } = useToast();
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchHealthData = useCallback(async () => {
    try {
      const response = await fetch('/api/health/metrics');
      if (response.ok) {
        const data = await response.json();
        setHealthData(data);
        setLastUpdated(new Date());
      } else if (response.status === 403) {
        toast({
          title: 'Access Denied',
          description: 'Admin privileges required to view operational health',
          variant: 'destructive',
        });
      } else {
        throw new Error('Failed to fetch health data');
      }
    } catch (_error) {
      console.error('Error fetching health data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load operational health data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchHealthData();

    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchHealthData, 30000); // Refresh every 30 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, fetchHealthData]);


  const resolveAlert = async (alertId: string) => {
    try {
      const response = await fetch('/api/health/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resolve_alert', alertId }),
      });

      if (response.ok) {
        toast({
          title: 'Alert Resolved',
          description: 'Alert has been marked as resolved',
        });
        fetchHealthData(); // Refresh data
      } else {
        throw new Error('Failed to resolve alert');
      }
    } catch (_error) {
      toast({
        title: 'Error',
        description: 'Failed to resolve alert',
        variant: 'destructive',
      });
    }
  };

  const testAlert = async () => {
    try {
      const response = await fetch('/api/health/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test_alert' }),
      });

      if (response.ok) {
        toast({
          title: 'Test Alert Triggered',
          description:
            'A test alert has been created to verify notification systems',
        });
        setTimeout(fetchHealthData, 2000); // Refresh after 2 seconds
      } else {
        throw new Error('Failed to trigger test alert');
      }
    } catch (_error) {
      toast({
        title: 'Error',
        description: 'Failed to trigger test alert',
        variant: 'destructive',
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'border-green-500 bg-green-50';
      case 'degraded':
        return 'border-yellow-500 bg-yellow-50';
      case 'critical':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-red-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-green-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatLatency = (ms: number) => {
    if (ms > 1000) return `${(ms / 1000).toFixed(2)}s`;
    return `${Math.round(ms)}ms`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!healthData) {
    return (
      <div className="container mx-auto py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Unable to Load Health Data</AlertTitle>
          <AlertDescription>
            Failed to retrieve operational health metrics. Please check your
            permissions and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="h-6 w-6 text-blue-600" />
          <h1 className="text-3xl font-bold">Operational Health</h1>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Wifi
              className={`h-4 w-4 mr-2 ${autoRefresh ? 'text-green-600' : 'text-gray-400'}`}
            />
            Auto Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={testAlert}>
            Test Alert
          </Button>
          <Button size="sm" onClick={fetchHealthData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Status Banner */}
      <Card
        className={`border-l-4 ${getStatusColor(healthData.metrics.systemHealth.status)}`}
      >
        <CardContent className="flex items-center justify-between pt-6">
          <div className="flex items-center space-x-4">
            {getStatusIcon(healthData.metrics.systemHealth.status)}
            <div>
              <h3 className="text-lg font-semibold capitalize">
                System {healthData.metrics.systemHealth.status}
              </h3>
              <p className="text-sm text-muted-foreground">
                Health Score: {healthData.metrics.systemHealth.score}/100
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold">
              {healthData.metrics.systemHealth.uptime}%
            </div>
            <div className="text-sm text-muted-foreground">Uptime</div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Error Rate */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div>
                  <div className="text-2xl font-bold">
                    {(healthData.metrics.errorRate.current * 100).toFixed(2)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Error Rate</p>
                </div>
              </div>
              {getTrendIcon(healthData.metrics.errorRate.trend)}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              P95: {(healthData.metrics.errorRate.p95 * 100).toFixed(2)}%
            </div>
          </CardContent>
        </Card>

        {/* Latency */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">
                    {formatLatency(healthData.metrics.latency.p95)}
                  </div>
                  <p className="text-sm text-muted-foreground">P95 Latency</p>
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Avg: {formatLatency(healthData.metrics.latency.avg)}
            </div>
          </CardContent>
        </Card>

        {/* Throughput */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(healthData.metrics.throughput.requestsPerMinute)}
                </div>
                <p className="text-sm text-muted-foreground">Requests/min</p>
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Success: {healthData.metrics.throughput.successfulRequests} |
              Failed: {healthData.metrics.throughput.failedRequests}
            </div>
          </CardContent>
        </Card>

        {/* Queue Depth */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Database className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">
                  {healthData.metrics.queueDepth.current}
                </div>
                <p className="text-sm text-muted-foreground">Queue Depth</p>
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Max: {healthData.metrics.queueDepth.max} | Processing:{' '}
              {healthData.metrics.queueDepth.processing}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="alerts">
            Alerts
            {healthData.summary.activeAlerts > 0 && (
              <Badge className="ml-2 bg-red-100 text-red-800">
                {healthData.summary.activeAlerts}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Detailed Metrics */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Latency Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>P50 (Median)</span>
                  <span className="font-semibold">
                    {formatLatency(healthData.metrics.latency.p50)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>P95</span>
                  <span className="font-semibold">
                    {formatLatency(healthData.metrics.latency.p95)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>P99</span>
                  <span className="font-semibold">
                    {formatLatency(healthData.metrics.latency.p99)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average</span>
                  <span className="font-semibold">
                    {formatLatency(healthData.metrics.latency.avg)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Health Score</span>
                  <span className="font-semibold">
                    {healthData.metrics.systemHealth.score}/100
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Uptime</span>
                  <span className="font-semibold">
                    {healthData.metrics.systemHealth.uptime}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Last Updated</span>
                  <span className="font-semibold text-sm">
                    {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {healthData.alerts.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
                  <p>No active alerts - system is healthy!</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {healthData.alerts.map((alert) => (
                <Card key={alert.id} className="border-l-4 border-red-500">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {alert.type.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="font-medium">{alert.message}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                        {alert.metadata &&
                          Object.keys(alert.metadata).length > 0 && (
                            <details className="text-sm text-muted-foreground">
                              <summary className="cursor-pointer">
                                View details
                              </summary>
                              <pre className="mt-2 p-2 bg-gray-50 rounded text-xs">
                                {JSON.stringify(alert.metadata, null, 2)}
                              </pre>
                            </details>
                          )}
                      </div>

                      {!alert.resolved && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resolveAlert(alert.id)}
                        >
                          Resolve
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
              <CardDescription>
                Detailed performance metrics and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {(healthData.metrics.errorRate.current * 100).toFixed(3)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Current Error Rate
                  </div>
                  <div className="flex items-center justify-center mt-1">
                    {getTrendIcon(healthData.metrics.errorRate.trend)}
                    <span className="text-xs ml-1">
                      {healthData.metrics.errorRate.trend}
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {Math.round(
                      healthData.metrics.throughput.requestsPerMinute,
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Requests per Minute
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {formatLatency(healthData.metrics.latency.p95)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    95th Percentile Latency
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
