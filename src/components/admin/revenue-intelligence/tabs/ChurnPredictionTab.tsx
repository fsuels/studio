'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MetricsCard, ChartCard } from '../../shared';
import { AlertTriangle, Users, Target, Brain } from 'lucide-react';

interface ChurnPredictionTabProps {
  data: any;
  loading?: boolean;
}

const formatPercentage = (value: number) => `${value.toFixed(1)}%`;
const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

export function ChurnPredictionTab({ data: churnPrediction, loading }: ChurnPredictionTabProps) {
  if (loading || !churnPrediction) {
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
      {/* Churn Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricsCard
          title="Overall Churn Rate"
          value={formatPercentage(churnPrediction.metrics.overallChurnRate)}
          icon={AlertTriangle}
          iconColor="text-red-600"
        />
        
        <MetricsCard
          title="At-Risk Customers"
          value={churnPrediction.metrics.atRiskCustomers}
          icon={Users}
          iconColor="text-orange-600"
        />
        
        <MetricsCard
          title="Revenue at Risk"
          value={formatCurrency(churnPrediction.metrics.revenueAtRisk)}
          icon={Target}
          iconColor="text-red-600"
        />
      </div>

      {/* High Risk Customers */}
      <ChartCard
        title="High-Risk Churn Predictions"
        icon={Brain}
      >
        <div className="space-y-3">
          {churnPrediction.predictions
            .filter((pred: any) => pred.riskLevel === 'high' || pred.riskLevel === 'critical')
            .slice(0, 10)
            .map((prediction: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg bg-red-50/50 border-red-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-red-600">
                      {formatPercentage(prediction.churnProbability).replace('%', '')}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{prediction.customerEmail}</div>
                    <div className="text-sm text-muted-foreground">
                      LTV: {formatCurrency(prediction.ltv)} • 
                      Last Activity: {new Date(prediction.lastActivity).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <Badge 
                      variant={prediction.riskLevel === 'critical' ? 'destructive' : 'secondary'}
                      className="mb-1"
                    >
                      {prediction.riskLevel}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      Predicted in {prediction.daysToChurn} days
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </ChartCard>
    </div>
  );
}