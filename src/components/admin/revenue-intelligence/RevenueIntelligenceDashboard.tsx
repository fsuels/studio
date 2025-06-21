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
  AlertTriangle,
} from 'lucide-react';

// Lazy load the tab components
const RevenueOverviewTab = React.lazy(() => 
  import('./tabs/RevenueOverviewTab').then(m => ({ default: m.RevenueOverviewTab }))
);
const MRRTrendsTab = React.lazy(() => 
  import('./tabs/MRRTrendsTab').then(m => ({ default: m.MRRTrendsTab }))
);
const CustomerLTVTab = React.lazy(() => 
  import('./tabs/CustomerLTVTab').then(m => ({ default: m.CustomerLTVTab }))
);
const CohortAnalysisTab = React.lazy(() => 
  import('./tabs/CohortAnalysisTab').then(m => ({ default: m.CohortAnalysisTab }))
);
const ChurnPredictionTab = React.lazy(() => 
  import('./tabs/ChurnPredictionTab').then(m => ({ default: m.ChurnPredictionTab }))
);
const RevenueLeakageTab = React.lazy(() => 
  import('./tabs/RevenueLeakageTab').then(m => ({ default: m.RevenueLeakageTab }))
);

interface RevenueIntelligenceProps {
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
  </div>
);

export default function RevenueIntelligenceDashboard({
  className,
}: RevenueIntelligenceProps) {
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
      const [overviewRes, mrrRes, ltvRes, cohortRes, churnRes, leakageRes] =
        await Promise.all([
          fetch(
            `/api/admin/revenue-intelligence?type=overview&timeframe=${timeframe}`,
          ),
          fetch(
            `/api/admin/revenue-intelligence?type=mrr_trends&timeframe=${timeframe}`,
          ),
          fetch(
            `/api/admin/revenue-intelligence?type=customer_ltv&timeframe=${timeframe}`,
          ),
          fetch(
            `/api/admin/revenue-intelligence?type=cohort_analysis&timeframe=${timeframe}`,
          ),
          fetch(
            `/api/admin/revenue-intelligence?type=churn_prediction&timeframe=${timeframe}`,
          ),
          fetch(
            `/api/admin/revenue-intelligence?type=revenue_leakage&timeframe=${timeframe}`,
          ),
        ]);

      const [
        overviewData,
        mrrData,
        ltvData,
        cohortData,
        churnData,
        leakageData,
      ] = await Promise.all([
        overviewRes.json(),
        mrrRes.json(),
        ltvRes.json(),
        cohortRes.json(),
        churnRes.json(),
        leakageRes.json(),
      ]);

      setOverview(overviewData);
      setMrrTrends(mrrData);
      setCustomerLTV(ltvData);
      setCohortAnalysis(cohortData);
      setChurnPrediction(churnData);
      setRevenueLeakage(leakageData);
    } catch (err) {
      console.error('Failed to fetch revenue intelligence data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    console.log('Exporting revenue intelligence data...');
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
              Revenue Intelligence Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              MRR/ARR analytics, customer lifetime value, and churn prediction
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6months">6 months</SelectItem>
                <SelectItem value="12months">12 months</SelectItem>
                <SelectItem value="24months">24 months</SelectItem>
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
          </div>
        </div>
      </div>

      {/* Main Content */}
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
          <Suspense fallback={<TabLoadingFallback />}>
            <RevenueOverviewTab data={overview} loading={loading} />
          </Suspense>
        </TabsContent>

        <TabsContent value="mrr" className="space-y-6">
          <Suspense fallback={<TabLoadingFallback />}>
            <MRRTrendsTab data={mrrTrends} loading={loading} />
          </Suspense>
        </TabsContent>

        <TabsContent value="ltv" className="space-y-6">
          <Suspense fallback={<TabLoadingFallback />}>
            <CustomerLTVTab data={customerLTV} loading={loading} />
          </Suspense>
        </TabsContent>

        <TabsContent value="cohorts" className="space-y-6">
          <Suspense fallback={<TabLoadingFallback />}>
            <CohortAnalysisTab data={cohortAnalysis} loading={loading} />
          </Suspense>
        </TabsContent>

        <TabsContent value="churn" className="space-y-6">
          <Suspense fallback={<TabLoadingFallback />}>
            <ChurnPredictionTab data={churnPrediction} loading={loading} />
          </Suspense>
        </TabsContent>

        <TabsContent value="leakage" className="space-y-6">
          <Suspense fallback={<TabLoadingFallback />}>
            <RevenueLeakageTab data={revenueLeakage} loading={loading} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}