'use client';

import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MetricsCard, ChartCard } from '../../shared';
import { AlertTriangle, DollarSign, TrendingDown, Zap } from 'lucide-react';

interface RevenueLeakageTabProps {
  data: any;
  loading?: boolean;
}

const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

export function RevenueLeakageTab({ data: revenueLeakage, loading }: RevenueLeakageTabProps) {
  if (loading || !revenueLeakage) {
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
      {/* Leakage Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricsCard
          title="Total Revenue Leakage"
          value={formatCurrency(revenueLeakage.metrics.totalLeakage)}
          icon={AlertTriangle}
          iconColor="text-red-600"
        />
        
        <MetricsCard
          title="Monthly Lost Revenue"
          value={formatCurrency(revenueLeakage.metrics.monthlyLoss)}
          icon={TrendingDown}
          iconColor="text-orange-600"
        />
        
        <MetricsCard
          title="Recovery Potential"
          value={formatCurrency(revenueLeakage.metrics.recoveryPotential)}
          icon={DollarSign}
          iconColor="text-green-600"
        />
      </div>

      {/* Leakage Sources */}
      <ChartCard
        title="Revenue Leakage Sources"
        icon={Zap}
      >
        <div className="space-y-3">
          {revenueLeakage.sources.map((source: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div>
                <div className="font-medium">{source.source}</div>
                <div className="text-sm text-muted-foreground">
                  {source.affectedCustomers} customers affected
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-red-600">
                  -{formatCurrency(source.monthlyImpact)}
                </div>
                <div className="text-xs text-muted-foreground">
                  per month
                </div>
              </div>
            </div>
          ))}
        </div>
      </ChartCard>

      {/* Action Items */}
      <ChartCard
        title="Immediate Action Items"
        icon={AlertTriangle}
      >
        <div className="space-y-3">
          {revenueLeakage.actionItems.map((item: string, index: number) => (
            <Alert key={index} className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                {item}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}