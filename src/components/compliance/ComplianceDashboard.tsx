// Compliance monitoring dashboard for admin use
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Shield,
  Users,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  MapPin,
  RefreshCw,
  Download,
} from 'lucide-react';

interface ComplianceStats {
  totalChecks: number;
  allowedPurchases: number;
  blockedPurchases: number;
  byRiskLevel: Record<'green' | 'amber' | 'red', number>;
  byState: Record<string, number>;
  geolocationFailures: number;
  lastUpdated: string;
}

interface WaitlistStats {
  total: number;
  byState: Record<
    string,
    {
      stateName: string;
      count: number;
      urgent: number;
      recent: number;
    }
  >;
  topDocuments: Array<{ document: string; count: number }>;
  recentSignups: number;
}

export default function ComplianceDashboard() {
  const [complianceStats, setComplianceStats] =
    useState<ComplianceStats | null>(null);
  const [waitlistStats, setWaitlistStats] = useState<WaitlistStats | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch compliance stats (you'd implement this endpoint)
      // const complianceResponse = await fetch('/api/compliance/stats');
      // const complianceData = await complianceResponse.json();

      // Fetch waitlist stats
      const waitlistResponse = await fetch('/api/compliance/waitlist');
      const waitlistData = await waitlistResponse.json();

      if (waitlistData.success) {
        setWaitlistStats(waitlistData.stats);
      }

      // Mock compliance stats for demo
      setComplianceStats({
        totalChecks: 1247,
        allowedPurchases: 1089,
        blockedPurchases: 158,
        byRiskLevel: { green: 45, amber: 1044, red: 158 },
        byState: {
          CA: 234,
          TX: 89,
          NY: 156,
          FL: 123,
          WA: 67,
          NC: 45,
          MO: 24,
          AZ: 34,
          UT: 12,
        },
        geolocationFailures: 12,
        lastUpdated: new Date().toISOString(),
      });

      setLastRefresh(new Date());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5 * 60 * 1000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const getConversionRate = () => {
    if (!complianceStats) return 0;
    return (
      (complianceStats.allowedPurchases / complianceStats.totalChecks) *
      100
    ).toFixed(1);
  };

  const getRiskColors = () => ({
    green: '#10b981',
    amber: '#f59e0b',
    red: '#ef4444',
  });

  const formatStateData = () => {
    if (!complianceStats) return [];

    return Object.entries(complianceStats.byState)
      .map(([state, count]) => ({ state, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  const formatRiskData = () => {
    if (!complianceStats) return [];

    const colors = getRiskColors();
    return Object.entries(complianceStats.byRiskLevel).map(([risk, value]) => ({
      name: risk.toUpperCase(),
      value,
      color: colors[risk as keyof typeof colors],
    }));
  };

  if (loading && !complianceStats) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Compliance Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStats}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Checks</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {complianceStats?.totalChecks.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getConversionRate()}%</div>
            <p className="text-xs text-muted-foreground">
              Allowed purchases / total checks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Blocked Requests
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {complianceStats?.blockedPurchases.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              From restricted states
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Waitlist Signups
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {waitlistStats?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {waitlistStats?.recentSignups || 0} in last 24h
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Level Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Risk Level Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={formatRiskData()}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {formatRiskData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top States by Volume */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Top States by Check Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={formatStateData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="state" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Waitlist Analysis */}
      {waitlistStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Blocked States */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Waitlist by State</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {Object.entries(waitlistStats.byState).map(([state, data]) => (
                  <div
                    key={state}
                    className="flex items-center justify-between p-2 rounded border"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{data.stateName}</span>
                      <Badge variant="outline">{state}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{data.count}</span>
                      {data.urgent > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {data.urgent} urgent
                        </Badge>
                      )}
                      {data.recent > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {data.recent} recent
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Most Requested Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Most Requested Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {waitlistStats.topDocuments.slice(0, 8).map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2"
                  >
                    <span className="text-sm">{doc.document}</span>
                    <Badge variant="outline">{doc.count} requests</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Geolocation Service</span>
              <Badge variant="outline" className="text-xs">
                Online
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Compliance API</span>
              <Badge variant="outline" className="text-xs">
                Online
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span className="text-sm">Geo Failures</span>
              <Badge variant="outline" className="text-xs">
                {complianceStats?.geolocationFailures || 0} today
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
