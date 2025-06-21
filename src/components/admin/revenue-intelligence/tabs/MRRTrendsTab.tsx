'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MetricsCard, ChartCard } from '../../shared';
import {
  TrendingUp,
  DollarSign,
  Target,
} from 'lucide-react';

interface MRRTrendsTabProps {
  data: any;
  loading?: boolean;
}

const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

export function MRRTrendsTab({ data: mrrTrends, loading }: MRRTrendsTabProps) {
  if (loading || !mrrTrends) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* MRR Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricsCard
          title="Current MRR"
          value={formatCurrency(mrrTrends.metrics.currentMRR)}
          icon={TrendingUp}
          iconColor="text-blue-600"
        />
        
        <MetricsCard
          title="Net New MRR"
          value={formatCurrency(mrrTrends.metrics.netNewMRR)}
          icon={DollarSign}
          iconColor="text-green-600"
        />
        
        <MetricsCard
          title="ARR Target"
          value={formatCurrency(mrrTrends.metrics.arr)}
          icon={Target}
          iconColor="text-purple-600"
        />
      </div>

      {/* Monthly MRR Breakdown */}
      <ChartCard title="Monthly MRR Breakdown">
        <div className="space-y-3">
          {mrrTrends.monthlyBreakdown.map(
            (month: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <div className="font-medium">{month.month}</div>
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="text-green-600">
                    +{formatCurrency(month.newMRR)} New
                  </div>
                  <div className="text-blue-600">
                    +{formatCurrency(month.expansionMRR)} Expansion
                  </div>
                  <div className="text-red-600">
                    -{formatCurrency(month.churnedMRR)} Churn
                  </div>
                  <div className="font-semibold">
                    {formatCurrency(month.netMRR)} Net
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </ChartCard>

      {/* MRR Forecast */}
      {mrrTrends.forecasting && (
        <ChartCard title="12-Month MRR Forecast">
          <div className="space-y-3">
            {mrrTrends.forecasting.map(
              (forecast: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="font-medium">{forecast.month}</div>
                  <div className="flex gap-4 text-sm">
                    <div className="text-gray-600">
                      {formatCurrency(forecast.conservative)} Conservative
                    </div>
                    <div className="font-semibold">
                      {formatCurrency(forecast.projected)} Projected
                    </div>
                    <div className="text-green-600">
                      {formatCurrency(forecast.optimistic)} Optimistic
                    </div>
                    <Badge variant="outline">
                      {forecast.confidence}% confidence
                    </Badge>
                  </div>
                </div>
              ),
            )}
          </div>
        </ChartCard>
      )}
    </div>
  );
}