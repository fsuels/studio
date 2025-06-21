// Advanced Document Lifecycle Dashboard
// Heat-map visualization and stalled document detection
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
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  PauseCircle,
  PlayCircle,
  Users,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Target,
  BarChart3,
  RefreshCw,
  Download,
  Search,
  Filter,
  ArrowRight,
  Timer,
  DollarSign,
  Mail,
  Phone,
  ExternalLink,
  Settings,
  Bell,
  AlertCircle,
} from 'lucide-react';
import {
  formatDuration,
  type DocumentStatus,
  type DocumentPriority,
} from '@/lib/document-lifecycle';

interface DocumentLifecycleDashboardProps {
  className?: string;
}

export default function DocumentLifecycleDashboard({
  className,
}: DocumentLifecycleDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Data states
  const [overview, setOverview] = useState<any>(null);
  const [heatmapData, setHeatmapData] = useState<any>(null);
  const [stalledAnalysis, setStalledAnalysis] = useState<any>(null);
  const [workflowMetrics, setWorkflowMetrics] = useState<any>(null);
  const [realtimeStatus, setRealtimeStatus] = useState<any>(null);

  useEffect(() => {
    fetchData();

    // Set up real-time updates
    const interval = setInterval(fetchRealtimeData, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, [timeframe, statusFilter, priorityFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        timeframe,
        ...(statusFilter && { status: statusFilter }),
        ...(priorityFilter && { priority: priorityFilter }),
      });

      const [overviewRes, heatmapRes, stalledRes, metricsRes] =
        await Promise.all([
          fetch(`/api/admin/document-lifecycle?type=overview&${params}`),
          fetch(`/api/admin/document-lifecycle?type=heatmap&${params}`),
          fetch(
            `/api/admin/document-lifecycle?type=stalled_analysis&${params}`,
          ),
          fetch(
            `/api/admin/document-lifecycle?type=workflow_metrics&${params}`,
          ),
        ]);

      const [overviewData, heatmapData, stalledData, metricsData] =
        await Promise.all([
          overviewRes.json(),
          heatmapRes.json(),
          stalledRes.json(),
          metricsRes.json(),
        ]);

      if (overviewData.success) setOverview(overviewData.data);
      if (heatmapData.success) setHeatmapData(heatmapData.data);
      if (stalledData.success) setStalledAnalysis(stalledData.data);
      if (metricsData.success) setWorkflowMetrics(metricsData.data);
    } catch (err) {
      setError('Failed to load document lifecycle data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRealtimeData = async () => {
    try {
      const response = await fetch(
        '/api/admin/document-lifecycle?type=realtime_status',
      );
      const data = await response.json();

      if (data.success) {
        setRealtimeStatus(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch real-time data:', err);
    }
  };

  const handleAutoUnblock = async () => {
    try {
      const response = await fetch('/api/admin/document-lifecycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'auto_unblock' }),
      });

      const result = await response.json();

      if (result.success) {
        // Refresh data after auto-unblock
        fetchData();
        // Show success message
        alert(
          `Auto-unblock completed: ${result.data.successful}/${result.data.attempted} documents unblocked`,
        );
      }
    } catch (err) {
      console.error('Auto-unblock failed:', err);
    }
  };

  const handleStatusUpdate = async (
    documentId: string,
    newStatus: DocumentStatus,
  ) => {
    try {
      const response = await fetch('/api/admin/document-lifecycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_status',
          documentId,
          newStatus,
          metadata: { reason: 'Manual admin update' },
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Refresh data after update
        fetchData();
      }
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getStatusIcon = (status: DocumentStatus) => {
    const icons = {
      draft: <FileText className="h-4 w-4" />,
      pending_review: <Clock className="h-4 w-4" />,
      pending_esign: <Settings className="h-4 w-4" />,
      pending_notarization: <CheckCircle className="h-4 w-4" />,
      pending_payment: <DollarSign className="h-4 w-4" />,
      completed: <CheckCircle className="h-4 w-4" />,
      archived: <FileText className="h-4 w-4" />,
      cancelled: <XCircle className="h-4 w-4" />,
      stalled: <PauseCircle className="h-4 w-4" />,
    };
    return icons[status] || <FileText className="h-4 w-4" />;
  };

  const getStatusColor = (status: DocumentStatus) => {
    const colors = {
      draft: 'bg-blue-100 text-blue-800 border-blue-200',
      pending_review: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      pending_esign: 'bg-purple-100 text-purple-800 border-purple-200',
      pending_notarization: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      pending_payment: 'bg-orange-100 text-orange-800 border-orange-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      archived: 'bg-gray-100 text-gray-800 border-gray-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      stalled: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getHeatmapIntensity = (score: number) => {
    if (score >= 80) return 'bg-red-500';
    if (score >= 60) return 'bg-red-400';
    if (score >= 40) return 'bg-yellow-400';
    if (score >= 20) return 'bg-yellow-300';
    return 'bg-green-300';
  };

  const getPriorityBadge = (priority: DocumentPriority) => {
    const variants = {
      low: 'bg-gray-100 text-gray-800 border-gray-200',
      medium: 'bg-blue-100 text-blue-800 border-blue-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      urgent: 'bg-red-100 text-red-800 border-red-200',
    };

    return (
      <Badge variant="outline" className={variants[priority]}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
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
          <h1 className="text-3xl font-bold">Document Lifecycle Management</h1>
          <p className="text-muted-foreground">
            Heat-map visualization and workflow optimization
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
          <Button variant="outline" onClick={handleAutoUnblock}>
            <Zap className="h-4 w-4 mr-2" />
            Auto-Unblock
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

      {/* Real-time Status Bar */}
      {realtimeStatus && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Live Status</span>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold">
                    {realtimeStatus.activeDocuments}
                  </span>
                  <span className="text-muted-foreground">active</span>
                </div>
                <div className="flex items-center gap-1">
                  <PauseCircle className="h-4 w-4 text-red-600" />
                  <span className="font-semibold">
                    {realtimeStatus.stalledDocuments}
                  </span>
                  <span className="text-muted-foreground">stalled</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="font-semibold">
                    {realtimeStatus.overDueDocuments}
                  </span>
                  <span className="text-muted-foreground">overdue</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="font-semibold">
                    {realtimeStatus.urgentDocuments.length}
                  </span>
                  <span className="text-muted-foreground">urgent</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="heatmap">Status Heat-Map</TabsTrigger>
          <TabsTrigger value="stalled">Stalled Docs</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overview Metrics */}
          {overview && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Active Documents
                      </p>
                      <p className="text-2xl font-bold">
                        {overview.overview.totalActiveDocuments}
                      </p>
                      <div className="text-sm text-muted-foreground">
                        ${overview.overview.totalValue?.toLocaleString() || '0'}{' '}
                        value
                      </div>
                    </div>
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Stalled Documents
                      </p>
                      <p className="text-2xl font-bold text-red-600">
                        {overview.overview.stalledDocuments}
                      </p>
                      <div className="text-sm text-muted-foreground">
                        Need immediate attention
                      </div>
                    </div>
                    <PauseCircle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Avg Completion Time
                      </p>
                      <p className="text-2xl font-bold">
                        {formatDuration(
                          overview.overview.averageCompletionTime || 0,
                        )}
                      </p>
                      <div className="text-sm text-muted-foreground">
                        Target: 5 days
                      </div>
                    </div>
                    <Timer className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Completion Rate
                      </p>
                      <p className="text-2xl font-bold">
                        {formatPercentage(
                          overview.overview.completionRate || 0,
                        )}
                      </p>
                      <div className="text-sm text-muted-foreground">
                        Last 30 days
                      </div>
                    </div>
                    <Target className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Status Distribution */}
          {overview && overview.statusDistribution && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Document Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {overview.statusDistribution.map(
                    (status: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(status.status)}
                            <span className="font-medium capitalize">
                              {status.status.replace('_', ' ')}
                            </span>
                          </div>
                          <Badge
                            variant="outline"
                            className={getStatusColor(status.status)}
                          >
                            {status.count}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Percentage
                            </span>
                            <span className="font-semibold">
                              {formatPercentage(status.percentage)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Avg Time
                            </span>
                            <span className="font-semibold">
                              {formatDuration(status.avgTimeInStatus)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Stalled
                            </span>
                            <span
                              className={`font-semibold ${status.stalledCount > 0 ? 'text-red-600' : 'text-green-600'}`}
                            >
                              {status.stalledCount}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Bottleneck Score
                            </span>
                            <span className="font-semibold">
                              {status.bottleneckScore.toFixed(0)}/100
                            </span>
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Bottleneck Risk</span>
                            <span>{status.bottleneckScore.toFixed(0)}%</span>
                          </div>
                          <Progress
                            value={status.bottleneckScore}
                            className="h-2"
                          />
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Critical Stalls */}
          {overview && overview.criticalStalls && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Critical Stalled Documents (Immediate Action Required)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {overview.criticalStalls.map((doc: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg bg-red-50/50 border-red-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-red-600">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{doc.documentType}</div>
                          <div className="text-sm text-muted-foreground">
                            {doc.customerEmail}
                          </div>
                          <div className="text-xs text-red-600">
                            Stalled for {formatDuration(doc.stalledFor)} in{' '}
                            {doc.currentStatus.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getPriorityBadge(doc.priority)}
                        {doc.value && (
                          <div className="text-right">
                            <div className="text-sm font-semibold">
                              ${doc.value}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              value
                            </div>
                          </div>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleStatusUpdate(doc.documentId, 'pending_review')
                          }
                        >
                          <Zap className="h-4 w-4 mr-1" />
                          Unblock
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top Bottlenecks */}
          {overview && overview.topBottlenecks && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5" />
                  Top Workflow Bottlenecks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {overview.topBottlenecks.map(
                    (bottleneck: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${getHeatmapIntensity(bottleneck.bottleneckScore)}`}
                          >
                            <span className="text-sm font-semibold text-white">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium capitalize">
                              {bottleneck.status.replace('_', ' ')}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {bottleneck.count} documents •{' '}
                              {formatDuration(bottleneck.avgTimeInStatus)} avg
                              time
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-sm font-semibold text-red-600">
                              {bottleneck.bottleneckScore.toFixed(0)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              bottleneck score
                            </div>
                          </div>
                          {bottleneck.stalledCount > 0 && (
                            <Badge variant="destructive">
                              {bottleneck.stalledCount} stalled
                            </Badge>
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="heatmap" className="space-y-6">
          {heatmapData && heatmapData.statusDistribution && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Document Status Heat-Map
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Color intensity indicates bottleneck severity (red = high
                  bottleneck, green = smooth flow)
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
                  {heatmapData.statusDistribution.map(
                    (status: any, index: number) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 ${getHeatmapIntensity(status.bottleneckScore)} text-white`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(status.status)}
                          <span className="font-medium text-sm capitalize">
                            {status.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-2xl font-bold">{status.count}</div>
                        <div className="text-sm opacity-90">
                          {formatPercentage(status.percentage)}
                        </div>
                        <div className="text-xs opacity-80 mt-1">
                          {formatDuration(status.avgTimeInStatus)} avg
                        </div>
                        {status.stalledCount > 0 && (
                          <div className="text-xs bg-white/20 rounded px-1 mt-1">
                            {status.stalledCount} stalled
                          </div>
                        )}
                      </div>
                    ),
                  )}
                </div>

                {/* Heat-map Legend */}
                <div className="flex items-center justify-center gap-2 text-sm">
                  <span>Bottleneck Intensity:</span>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-green-300 rounded"></div>
                    <span>Low</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-yellow-300 rounded"></div>
                    <span>Medium</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-red-400 rounded"></div>
                    <span>High</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>Critical</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Performance Metrics */}
          {heatmapData && heatmapData.performanceMetrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Average Time by Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(
                      heatmapData.performanceMetrics.avgTimeByStatus || {},
                    ).map(([status, time]: [string, any]) => (
                      <div
                        key={status}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {getStatusIcon(status as DocumentStatus)}
                          <span className="capitalize">
                            {status.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="font-semibold">
                          {formatDuration(time)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Completion Rate by Document Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(
                      heatmapData.performanceMetrics.completionRateByType || {},
                    ).map(([type, rate]: [string, any]) => (
                      <div key={type} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm">{type}</span>
                          <span className="text-sm font-semibold">
                            {formatPercentage(rate)}
                          </span>
                        </div>
                        <Progress value={rate} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="stalled" className="space-y-6">
          {stalledAnalysis && (
            <>
              {/* Stalled Documents List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PauseCircle className="h-5 w-5" />
                    Stalled Documents Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stalledAnalysis.stalledDocuments
                      .slice(0, 10)
                      .map((doc: any, index: number) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="font-medium">
                                {doc.documentType}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {doc.customerEmail}
                              </div>
                              <div className="text-xs text-red-600 mt-1">
                                Stalled for {formatDuration(doc.stalledFor)} in{' '}
                                {doc.currentStatus.replace('_', ' ')}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Reason: {doc.stallReason}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getPriorityBadge(doc.priority)}
                              {doc.escalationSuggested && (
                                <Badge variant="destructive">Escalate</Badge>
                              )}
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className="text-sm font-medium mb-2">
                              Recommended Actions:
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {doc.recommendedActions.map(
                                (action: string, i: number) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {action}
                                  </Badge>
                                ),
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm font-medium">
                              Unblocking Steps:
                            </div>
                            {doc.unblockingSteps.map((step: any, i: number) => (
                              <div
                                key={i}
                                className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded"
                              >
                                <span>{step.action}</span>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className={
                                      step.responsibility === 'customer'
                                        ? 'bg-blue-50'
                                        : step.responsibility === 'admin'
                                          ? 'bg-orange-50'
                                          : 'bg-green-50'
                                    }
                                  >
                                    {step.responsibility}
                                  </Badge>
                                  <span>
                                    {formatDuration(step.estimatedTime)}
                                  </span>
                                  {step.automated && (
                                    <Badge variant="secondary">Auto</Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Unblocking Opportunities */}
              {stalledAnalysis.unblockingOpportunities && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Automation Opportunities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {stalledAnalysis.unblockingOpportunities.automationOpportunities.map(
                          (opportunity: string, i: number) => (
                            <li
                              key={i}
                              className="flex items-center gap-2 text-sm"
                            >
                              <Zap className="h-4 w-4 text-green-600" />
                              {opportunity}
                            </li>
                          ),
                        )}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Process Improvements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {stalledAnalysis.unblockingOpportunities.processImprovements.map(
                          (improvement: string, i: number) => (
                            <li
                              key={i}
                              className="flex items-center gap-2 text-sm"
                            >
                              <TrendingUp className="h-4 w-4 text-blue-600" />
                              {improvement}
                            </li>
                          ),
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="workflow" className="space-y-6">
          {workflowMetrics && (
            <>
              {/* Workflow Performance */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Escalation Rate
                        </p>
                        <p className="text-2xl font-bold">
                          {formatPercentage(
                            workflowMetrics.performanceMetrics
                              ?.escalationRate || 0,
                          )}
                        </p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Automation Efficiency
                        </p>
                        <p className="text-2xl font-bold">
                          {formatPercentage(
                            workflowMetrics.performanceMetrics
                              ?.automationEfficiency || 0,
                          )}
                        </p>
                      </div>
                      <Zap className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Workflow Health
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          Good
                        </p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Workflow Trends */}
              {workflowMetrics.trends && (
                <Card>
                  <CardHeader>
                    <CardTitle>Workflow Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center text-muted-foreground py-8">
                      Workflow trends visualization would be implemented here
                      with charts
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          {realtimeStatus && (
            <>
              {/* Active Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Live Document Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(realtimeStatus.statusDistribution).map(
                      ([status, count]: [string, any]) => (
                        <div
                          key={status}
                          className="text-center p-4 border rounded-lg"
                        >
                          <div className="flex items-center justify-center mb-2">
                            {getStatusIcon(status as DocumentStatus)}
                          </div>
                          <div className="text-2xl font-bold">{count}</div>
                          <div className="text-sm text-muted-foreground capitalize">
                            {status.replace('_', ' ')}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Document Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {realtimeStatus.recentActivity.map(
                      (activity: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <ArrowRight className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium">
                                {activity.documentType}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {activity.customerEmail}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 text-sm">
                              <Badge
                                className={getStatusColor(
                                  activity.statusChange.from,
                                )}
                              >
                                {activity.statusChange.from.replace('_', ' ')}
                              </Badge>
                              <ArrowRight className="h-3 w-3" />
                              <Badge
                                className={getStatusColor(
                                  activity.statusChange.to,
                                )}
                              >
                                {activity.statusChange.to.replace('_', ' ')}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(
                                activity.timestamp,
                              ).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Urgent Documents */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Urgent Documents Requiring Immediate Attention
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {realtimeStatus.urgentDocuments.map(
                      (doc: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg bg-red-50/50 border-red-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            </div>
                            <div>
                              <div className="font-medium">
                                {doc.documentType}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {doc.customerEmail}
                              </div>
                              <div className="text-xs text-red-600">
                                Stalled for {formatDuration(doc.stalledFor)} • $
                                {doc.value?.toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="destructive">URGENT</Badge>
                            <Button size="sm" variant="outline">
                              <Mail className="h-4 w-4 mr-1" />
                              Contact
                            </Button>
                            <Button size="sm" variant="outline">
                              <Zap className="h-4 w-4 mr-1" />
                              Escalate
                            </Button>
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
