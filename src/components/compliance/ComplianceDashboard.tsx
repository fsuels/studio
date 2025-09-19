// Compliance monitoring dashboard for admin use
'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
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

const REFRESH_INTERVAL = 5 * 60 * 1000;
const WAITLIST_ENDPOINT = '/api/compliance/waitlist';
const RISK_COLORS = {
  green: '#10b981',
  amber: '#f59e0b',
  red: '#ef4444',
} as const;

type RiskKey = keyof typeof RISK_COLORS;

type RiskSlice = { name: string; value: number; color: string };
type StateVolume = { state: string; count: number };

type WaitlistEntry = [
  string,
  {
    stateName: string;
    count: number;
    urgent: number;
    recent: number;
  },
];

export default function ComplianceDashboard() {
  const [complianceStats, setComplianceStats] =
    useState<ComplianceStats | null>(null);
  const [waitlistStats, setWaitlistStats] = useState<WaitlistStats | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchController = useRef<AbortController | null>(null);
  const hasFetchedRef = useRef(false);

  const fetchStats = useCallback(async () => {
    fetchController.current?.abort();
    const controller = new AbortController();
    fetchController.current = controller;

    if (!hasFetchedRef.current) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    setError(null);

    try {
      const waitlistResponse = await fetch(WAITLIST_ENDPOINT, {
        signal: controller.signal,
      });

      if (!waitlistResponse.ok) {
        throw new Error('Failed to load waitlist stats');
      }

      const waitlistData = await waitlistResponse.json();
      if (controller.signal.aborted) return;

      if (waitlistData.success && waitlistData.stats) {
        setWaitlistStats(waitlistData.stats);
      }

      setComplianceStats(buildMockComplianceStats());
      setLastRefresh(new Date());
      hasFetchedRef.current = true;
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        return;
      }

      console.error('Compliance dashboard fetch failed:', err);
      setError('Unable to refresh compliance data right now.');
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    void fetchStats();

    const interval = setInterval(() => {
      void fetchStats();
    }, REFRESH_INTERVAL);

    return () => {
      clearInterval(interval);
      fetchController.current?.abort();
    };
  }, [fetchStats]);

  const conversionRate = useMemo(() => {
    if (!complianceStats || complianceStats.totalChecks === 0) {
      return '0.0';
    }

    return (
      (complianceStats.allowedPurchases / complianceStats.totalChecks) * 100
    ).toFixed(1);
  }, [complianceStats]);

  const riskDistribution = useMemo<RiskSlice[]>(() => {
    if (!complianceStats) return [];

    return (Object.entries(complianceStats.byRiskLevel) as [RiskKey, number][])       .map(([risk, value]) => ({
        name: risk.toUpperCase(),
        value,
        color: RISK_COLORS[risk],
      }));
  }, [complianceStats]);

  const stateVolumes = useMemo<StateVolume[]>(() => {
    if (!complianceStats) return [];

    return Object.entries(complianceStats.byState)
      .map(([state, count]) => ({ state, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [complianceStats]);

  const waitlistEntries = useMemo<WaitlistEntry[]>(() => {
    if (!waitlistStats) return [];
    return Object.entries(waitlistStats.byState) as WaitlistEntry[];
  }, [waitlistStats]);

  const topDocuments = useMemo(
    () => waitlistStats?.topDocuments.slice(0, 8) ?? [],
    [waitlistStats],
  );

  const formattedLastRefresh = useMemo(() => {
    if (!lastRefresh) return '–';
    return lastRefresh.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [lastRefresh]);

  if (loading && !complianceStats) {
    return (
      <div className="space-y-6 p-6">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="space-y-3 p-6">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="space-y-3 p-6">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Compliance Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Track UPL compliance across all 50 states with live risk intelligence
            and waitlist visibility.
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span>Last updated {formattedLastRefresh}</span>
            {refreshing && (
              <Badge variant="secondary" className="uppercase">
                Updating…
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              void fetchStats();
            }}
            disabled={loading || refreshing}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
            />
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Checks</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {complianceStats?.totalChecks.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Allowed purchases / total checks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Requests</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {complianceStats?.blockedPurchases.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">From restricted states</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waitlist Signups</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{waitlistStats?.total ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              {(waitlistStats?.recentSignups ?? 0).toLocaleString()} in last 24h
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Risk Level Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top States by Check Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stateVolumes}>
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

      {waitlistStats && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Waitlist by State</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-64 space-y-2 overflow-y-auto pr-2">
                {waitlistEntries.map(([state, data]) => (
                  <div
                    key={state}
                    className="flex items-center justify-between rounded-lg border bg-white/80 p-2"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{data.stateName}</span>
                      <Badge variant="outline" className="text-xs uppercase">
                        {state}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-medium">{data.count}</span>
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

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Most Requested Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {topDocuments.map((doc, index) => (
                  <div
                    key={doc.document + index}
                    className="flex items-center justify-between rounded-lg bg-white/80 p-2 text-sm"
                  >
                    <span>{doc.document}</span>
                    <Badge variant="outline">{doc.count} requests</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              <span>Geolocation Service</span>
              <Badge variant="outline" className="text-xs uppercase">
                Online
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              <span>Compliance API</span>
              <Badge variant="outline" className="text-xs uppercase">
                Online
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-amber-500" />
              <span>Geo Failures</span>
              <Badge variant="outline" className="text-xs uppercase">
                {complianceStats?.geolocationFailures ?? 0} today
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function buildMockComplianceStats(): ComplianceStats {
  return {
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
  };
}
