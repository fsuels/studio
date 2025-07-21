// Real-time A/B Testing Monitoring Dashboard
// Live experiment health monitoring, alerts, and growth tracking

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  useExperimentMonitoring,
  monitoringService,
  type MonitoringAlert,
  type ExperimentHealth,
  type GrowthMetrics,
} from '@/lib/ab-testing/monitoring-service';

// Alert priority colors
const alertColors = {
  low: 'bg-blue-50 border-blue-200',
  medium: 'bg-yellow-50 border-yellow-200',
  high: 'bg-orange-50 border-orange-200',
  critical: 'bg-red-50 border-red-200',
};

const alertIcons = {
  significance_reached: '🎯',
  sample_size_reached: '📊',
  duration_exceeded: '⏰',
  performance_drop: '📉',
  error_rate_high: '⚠️',
};

// Health status indicators
const healthColors = {
  healthy: 'text-green-600 bg-green-100',
  warning: 'text-yellow-600 bg-yellow-100',
  critical: 'text-red-600 bg-red-100',
};

function AlertsPanel() {
  const { alerts, acknowledgeAlert } = useExperimentMonitoring();

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔔 Active Alerts
            <Badge variant="secondary">0</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <div className="text-2xl mb-2">✅</div>
            <div>No active alerts</div>
            <div className="text-sm">All experiments are running smoothly</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔔 Active Alerts
          <Badge variant="destructive">{alerts.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.slice(0, 5).map((alert) => (
          <Alert key={alert.id} className={alertColors[alert.priority]}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span>{alertIcons[alert.type] || '📢'}</span>
                  <span className="font-medium capitalize">
                    {alert.type.replace('_', ' ')}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {alert.priority}
                  </Badge>
                </div>
                <AlertDescription className="text-sm">
                  {alert.message}
                </AlertDescription>
                {alert.data.recommendation && (
                  <div className="mt-2 text-xs text-gray-600 italic">
                    💡 {alert.data.recommendation}
                  </div>
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => acknowledgeAlert(alert.id)}
                className="ml-3"
              >
                Acknowledge
              </Button>
            </div>
          </Alert>
        ))}
        {alerts.length > 5 && (
          <div className="text-center">
            <Button variant="ghost" size="sm">
              View {alerts.length - 5} more alerts
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ExperimentHealthOverview() {
  const { healthData } = useExperimentMonitoring();

  const healthCounts = healthData.reduce(
    (counts, health) => {
      counts[health.status] = (counts[health.status] || 0) + 1;
      return counts;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {healthCounts.healthy || 0}
              </div>
              <div className="text-sm text-gray-600">Healthy</div>
            </div>
            <div className="text-2xl">✅</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {healthCounts.warning || 0}
              </div>
              <div className="text-sm text-gray-600">Warning</div>
            </div>
            <div className="text-2xl">⚠️</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-600">
                {healthCounts.critical || 0}
              </div>
              <div className="text-sm text-gray-600">Critical</div>
            </div>
            <div className="text-2xl">🚨</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ExperimentHealthTable() {
  const { healthData } = useExperimentMonitoring();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Experiment Health Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {healthData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No experiments currently running
            </div>
          ) : (
            healthData.map((health) => (
              <div key={health.experimentId} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">
                    Experiment {health.experimentId.slice(0, 8)}...
                  </div>
                  <Badge className={healthColors[health.status]}>
                    {health.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <div className="text-gray-600">Sample Size</div>
                    <div className="font-medium">
                      {health.metrics.sampleSize.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Conversion Rate</div>
                    <div className="font-medium">
                      {(health.metrics.conversionRate * 100).toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Days Running</div>
                    <div className="font-medium">
                      {health.metrics.daysRunning}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Confidence</div>
                    <div className="font-medium">
                      {(health.metrics.confidenceLevel * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                {health.metrics.estimatedTimeToSignificance && (
                  <div className="mt-2 text-sm text-gray-600">
                    📅 Estimated {health.metrics.estimatedTimeToSignificance}{' '}
                    days to significance
                  </div>
                )}

                {health.issues.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {health.issues.map((issue, index) => (
                      <div key={index} className="text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            issue.severity === 'high'
                              ? 'bg-red-100 text-red-700'
                              : issue.severity === 'medium'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {issue.severity}
                        </span>
                        <span className="ml-2">{issue.message}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function GrowthMetricsPanel() {
  const [growthMetrics, setGrowthMetrics] =
    React.useState<GrowthMetrics | null>(null);
  const [timeframe, setTimeframe] = React.useState<'24h' | '7d' | '30d'>('7d');
  const [loading, setLoading] = React.useState(false);

  const loadGrowthMetrics = React.useCallback(async () => {
    setLoading(true);
    try {
      const metrics = await monitoringService.calculateGrowthMetrics(timeframe);
      setGrowthMetrics(metrics);
    } catch (error) {
      console.error('Failed to load growth metrics:', error);
    } finally {
      setLoading(false);
    }
  }, [timeframe]);

  React.useEffect(() => {
    loadGrowthMetrics();
  }, [loadGrowthMetrics]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Growth Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
            <div className="text-gray-500">Loading growth metrics...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!growthMetrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Growth Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Unable to load growth metrics
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Growth Impact
          <div className="flex gap-1">
            {(['24h', '7d', '30d'] as const).map((period) => (
              <Button
                key={period}
                size="sm"
                variant={timeframe === period ? 'default' : 'outline'}
                onClick={() => setTimeframe(period)}
              >
                {period}
              </Button>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              ${growthMetrics.revenueImpact.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Revenue Impact</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              +{growthMetrics.conversionLift.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Avg Conversion Lift</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {growthMetrics.experimentsRunning}
            </div>
            <div className="text-sm text-gray-600">Running</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {growthMetrics.statisticallySignificantWins}
            </div>
            <div className="text-sm text-gray-600">Significant Wins</div>
          </div>
        </div>

        {growthMetrics.topPerformingExperiments.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Top Performing Experiments</h4>
            <div className="space-y-2">
              {growthMetrics.topPerformingExperiments.map(
                (experiment, index) => (
                  <div
                    key={experiment.experimentId}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div>
                      <div className="font-medium text-sm">
                        {experiment.name}
                      </div>
                      <div className="text-xs text-gray-600">
                        {(experiment.confidence * 100).toFixed(1)}% confidence
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">
                        +{experiment.impact.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-600">impact</div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PerformanceReport() {
  const [report, setReport] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  const loadReport = async () => {
    setLoading(true);
    try {
      const reportData = await monitoringService.generatePerformanceReport();
      setReport(reportData);
    } catch (error) {
      console.error('Failed to load performance report:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadReport();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
        <div className="text-gray-500">Generating performance report...</div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-8 text-gray-500">
        Unable to generate performance report
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">
              {report.summary.totalExperiments}
            </div>
            <div className="text-sm text-gray-600">Total Experiments</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {report.summary.activeExperiments}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {report.summary.completedExperiments}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {report.summary.successRate.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              +{report.summary.avgImpact.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Avg Impact</div>
          </CardContent>
        </Card>
      </div>

      <GrowthMetricsPanel />
    </div>
  );
}

export default function ExperimentMonitoringDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">A/B Testing Monitor</h1>
          <p className="text-gray-600">
            Real-time experiment health and performance tracking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Live monitoring active</span>
        </div>
      </div>

      <ExperimentHealthOverview />

      <Tabs defaultValue="alerts" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="health">Health Status</TabsTrigger>
          <TabsTrigger value="growth">Growth Impact</TabsTrigger>
          <TabsTrigger value="reports">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="mt-6">
          <AlertsPanel />
        </TabsContent>

        <TabsContent value="health" className="mt-6">
          <ExperimentHealthTable />
        </TabsContent>

        <TabsContent value="growth" className="mt-6">
          <GrowthMetricsPanel />
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <PerformanceReport />
        </TabsContent>
      </Tabs>
    </div>
  );
}
