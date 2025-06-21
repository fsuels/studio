'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MetricsCard, ChartCard } from '../../shared';
import {
  Shield,
  XCircle,
  Eye,
  DollarSign,
  PieChart,
  Flag,
  Gauge,
} from 'lucide-react';

interface FraudOverviewTabProps {
  data: any;
  loading?: boolean;
}

const formatPercentage = (value: number) => `${value.toFixed(1)}%`;
const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

const getRiskLevelColor = (level: string) => {
  switch (level) {
    case 'very_low':
      return 'bg-green-50 border-green-200';
    case 'low':
      return 'bg-blue-50 border-blue-200';
    case 'medium':
      return 'bg-yellow-50 border-yellow-200';
    case 'high':
      return 'bg-orange-50 border-orange-200';
    case 'very_high':
      return 'bg-red-50 border-red-200';
    default:
      return 'bg-gray-50 border-gray-200';
  }
};

export function FraudOverviewTab({ data: overview, loading }: FraudOverviewTabProps) {
  if (loading || !overview) {
    return (
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
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricsCard
          title="Total Assessments"
          value={overview.summary.totalAssessments}
          subtitle={`${formatPercentage(overview.summary.highRiskPercentage)} high risk`}
          icon={Shield}
          iconColor="text-blue-600"
        />
        
        <MetricsCard
          title="Auto Declined"
          value={overview.summary.autoDeclined}
          subtitle={`${formatPercentage(overview.summary.autoDeclineRate)} decline rate`}
          icon={XCircle}
          iconColor="text-red-600"
        />
        
        <MetricsCard
          title="Manual Reviews"
          value={overview.summary.manualReviews}
          subtitle={`${formatPercentage(overview.summary.manualReviewRate)} review rate`}
          icon={Eye}
          iconColor="text-yellow-600"
        />
        
        <MetricsCard
          title="Fraud Prevented"
          value={overview.summary.fraudPrevented}
          subtitle={`${formatCurrency(overview.summary.estimatedSavings)} saved`}
          icon={DollarSign}
          iconColor="text-green-600"
        />
      </div>

      {/* Risk Distribution */}
      <ChartCard
        title="Risk Level Distribution"
        icon={PieChart}
      >
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(overview.riskDistribution).map(
            ([level, count]) => (
              <div key={level} className="text-center">
                <div
                  className={`p-4 rounded-lg border ${getRiskLevelColor(level)}`}
                >
                  <div className="text-2xl font-bold">
                    {count as number}
                  </div>
                  <div className="text-sm font-medium capitalize">
                    {level.replace('_', ' ')}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatPercentage(
                      ((count as number) /
                        overview.summary.totalAssessments) *
                        100,
                    )}
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </ChartCard>

      {/* Top Risk Factors & Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Risk Factors */}
        {overview.topRiskFactors && (
          <ChartCard
            title="Top Risk Factors"
            icon={Flag}
          >
            <div className="space-y-3">
              {overview.topRiskFactors
                .slice(0, 8)
                .map((factor: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-semibold flex items-center justify-center">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium">
                        {factor.factor.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">
                        {factor.count}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {formatPercentage(factor.percentage)}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </ChartCard>
        )}

        {/* Performance Metrics */}
        {overview.performanceMetrics && (
          <ChartCard
            title="Model Performance"
            icon={Gauge}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Accuracy
                </span>
                <span className="font-semibold">
                  {formatPercentage(overview.performanceMetrics.accuracy)}
                </span>
              </div>
              <Progress
                value={overview.performanceMetrics.accuracy}
                className="h-2"
              />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Precision
                </span>
                <span className="font-semibold">
                  {formatPercentage(overview.performanceMetrics.precision)}
                </span>
              </div>
              <Progress
                value={overview.performanceMetrics.precision}
                className="h-2"
              />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Recall
                </span>
                <span className="font-semibold">
                  {formatPercentage(overview.performanceMetrics.recall)}
                </span>
              </div>
              <Progress
                value={overview.performanceMetrics.recall}
                className="h-2"
              />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  F1 Score
                </span>
                <span className="font-semibold">
                  {formatPercentage(overview.performanceMetrics.f1Score)}
                </span>
              </div>
              <Progress
                value={overview.performanceMetrics.f1Score}
                className="h-2"
              />
            </div>
          </ChartCard>
        )}
      </div>
    </div>
  );
}