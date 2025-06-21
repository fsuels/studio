'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
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
  RefreshCw,
  Download,
  Settings,
  AlertTriangle,
} from 'lucide-react';

// Lazy load the tab components for better performance
const FraudOverviewTab = React.lazy(() => 
  import('./tabs/FraudOverviewTab').then(m => ({ default: m.FraudOverviewTab }))
);
const VelocityAnalysisTab = React.lazy(() => 
  import('./tabs/VelocityAnalysisTab').then(m => ({ default: m.VelocityAnalysisTab }))
);
const DeviceAnalyticsTab = React.lazy(() => 
  import('./tabs/DeviceAnalyticsTab').then(m => ({ default: m.DeviceAnalyticsTab }))
);
const ChargebackPredictionTab = React.lazy(() => 
  import('./tabs/ChargebackPredictionTab').then(m => ({ default: m.ChargebackPredictionTab }))
);
const RiskAssessmentsTab = React.lazy(() => 
  import('./tabs/RiskAssessmentsTab').then(m => ({ default: m.RiskAssessmentsTab }))
);
const FraudTrendsTab = React.lazy(() => 
  import('./tabs/FraudTrendsTab').then(m => ({ default: m.FraudTrendsTab }))
);

interface FraudDetectionDashboardProps {
  className?: string;
}

// Loading component for tab content
const TabLoadingFallback = () => (
  <div className="animate-pulse space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-32 bg-gray-200 rounded"></div>
      ))}
    </div>
    <div className="h-64 bg-gray-200 rounded"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="h-48 bg-gray-200 rounded"></div>
      <div className="h-48 bg-gray-200 rounded"></div>
    </div>
  </div>
);

export default function FraudDetectionDashboard({
  className,
}: FraudDetectionDashboardProps) {
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
        ...(riskFilter && { riskLevel: riskFilter }),
      });

      const [
        overviewRes,
        assessmentsRes,
        velocityRes,
        deviceRes,
        chargebackRes,
        trendsRes,
      ] = await Promise.all([
        fetch(`/api/admin/fraud-detection?type=overview&${params}`),
        fetch(`/api/admin/fraud-detection?type=assessments&${params}`),
        fetch(`/api/admin/fraud-detection?type=velocity&${params}`),
        fetch(`/api/admin/fraud-detection?type=device&${params}`),
        fetch(`/api/admin/fraud-detection?type=chargeback&${params}`),
        fetch(`/api/admin/fraud-detection?type=trends&${params}`),
      ]);

      const [
        overviewData,
        assessmentsData,
        velocityData,
        deviceData,
        chargebackData,
        trendsData,
      ] = await Promise.all([
        overviewRes.json(),
        assessmentsRes.json(),
        velocityRes.json(),
        deviceRes.json(),
        chargebackRes.json(),
        trendsRes.json(),
      ]);

      setOverview(overviewData);
      setRiskAssessments(assessmentsData);
      setVelocityAnalytics(velocityData);
      setDeviceAnalytics(deviceData);
      setChargebackPredictions(chargebackData);
      setFraudTrends(trendsData);
    } catch (err) {
      console.error('Failed to fetch fraud detection data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // Export functionality
    console.log('Exporting fraud detection data...');
  };

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className={`container mx-auto py-6 ${className || ''}`}>
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Fraud Detection Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Advanced fraud prevention and risk scoring analytics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 days</SelectItem>
                <SelectItem value="30d">30 days</SelectItem>
                <SelectItem value="90d">90 days</SelectItem>
                <SelectItem value="1y">1 year</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
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
          <Suspense fallback={<TabLoadingFallback />}>
            <FraudOverviewTab data={overview} loading={loading} />
          </Suspense>
        </TabsContent>

        <TabsContent value="velocity" className="space-y-6">
          <Suspense fallback={<TabLoadingFallback />}>
            <VelocityAnalysisTab data={velocityAnalytics} loading={loading} />
          </Suspense>
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          <Suspense fallback={<TabLoadingFallback />}>
            <DeviceAnalyticsTab data={deviceAnalytics} loading={loading} />
          </Suspense>
        </TabsContent>

        <TabsContent value="chargeback" className="space-y-6">
          <Suspense fallback={<TabLoadingFallback />}>
            <ChargebackPredictionTab data={chargebackPredictions} loading={loading} />
          </Suspense>
        </TabsContent>

        <TabsContent value="assessments" className="space-y-6">
          <Suspense fallback={<TabLoadingFallback />}>
            <RiskAssessmentsTab 
              data={riskAssessments} 
              loading={loading}
              riskFilter={riskFilter}
              onRiskFilterChange={setRiskFilter}
            />
          </Suspense>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Suspense fallback={<TabLoadingFallback />}>
            <FraudTrendsTab data={fraudTrends} loading={loading} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}