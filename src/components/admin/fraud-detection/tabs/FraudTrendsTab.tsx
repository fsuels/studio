'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChartCard } from '../../shared';
import {
  TrendingUp,
  Clock,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface FraudTrendsTabProps {
  data: any;
  loading?: boolean;
}

export function FraudTrendsTab({ data: fraudTrends, loading }: FraudTrendsTabProps) {
  if (loading || !fraudTrends) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-48 bg-gray-200 rounded"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Trend Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard
          title="Trend Analysis"
          icon={TrendingUp}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Risk Score Trend
              </span>
              <div className="flex items-center gap-1">
                {fraudTrends.insights.riskScoreChange.direction ===
                'increasing' ? (
                  <ArrowUp className="h-4 w-4 text-red-600" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-green-600" />
                )}
                <span
                  className={`font-semibold ${
                    fraudTrends.insights.riskScoreChange.direction ===
                    'increasing'
                      ? 'text-red-600'
                      : 'text-green-600'
                  }`}
                >
                  {fraudTrends.insights.riskScoreChange.value}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Decline Rate Trend
              </span>
              <div className="flex items-center gap-1">
                {fraudTrends.insights.declineRateChange.direction ===
                'increasing' ? (
                  <ArrowUp className="h-4 w-4 text-red-600" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-green-600" />
                )}
                <span
                  className={`font-semibold ${
                    fraudTrends.insights.declineRateChange
                      .direction === 'increasing'
                      ? 'text-red-600'
                      : 'text-green-600'
                  }`}
                >
                  {fraudTrends.insights.declineRateChange.value}%
                </span>
              </div>
            </div>
          </div>
        </ChartCard>

        <ChartCard
          title="Seasonal Patterns"
          icon={Clock}
        >
          <div className="space-y-2">
            {fraudTrends.insights.seasonalPatterns.map(
              (pattern: string, index: number) => (
                <div
                  key={index}
                  className="text-sm p-2 bg-blue-50 rounded border border-blue-200"
                >
                  {pattern}
                </div>
              ),
            )}
          </div>
        </ChartCard>
      </div>

      {/* Emerging Threats */}
      <ChartCard
        title="Emerging Threats"
        icon={AlertTriangle}
      >
        <div className="space-y-3">
          {fraudTrends.insights.emergingThreats.map(
            (threat: string, index: number) => (
              <Alert key={index} className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  {threat}
                </AlertDescription>
              </Alert>
            ),
          )}
        </div>
      </ChartCard>
    </div>
  );
}