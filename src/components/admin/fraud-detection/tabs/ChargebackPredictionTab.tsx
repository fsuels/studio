'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MetricsCard, ChartCard } from '../../shared';
import {
  Percent,
  AlertTriangle,
  TrendingDown,
  DollarSign,
  BarChart3,
  Target,
  Brain,
} from 'lucide-react';

interface ChargebackPredictionTabProps {
  data: any;
  loading?: boolean;
}

const formatPercentage = (value: number) => `${value.toFixed(1)}%`;
const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

const getRiskBandColor = (band: string) => {
  switch (band) {
    case 'A': return 'bg-green-500';
    case 'B': return 'bg-blue-500';
    case 'C': return 'bg-yellow-500';
    case 'D': return 'bg-orange-500';
    case 'E': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const getRiskBandLabel = (band: string) => {
  switch (band) {
    case 'A': return '<2%';
    case 'B': return '2-4%';
    case 'C': return '4-8%';
    case 'D': return '8-15%';
    case 'E': return '>15%';
    default: return 'Unknown';
  }
};

export function ChargebackPredictionTab({ data: chargebackPredictions, loading }: ChargebackPredictionTabProps) {
  if (loading || !chargebackPredictions) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
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
      {/* Chargeback Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricsCard
          title="Avg Chargeback Risk"
          value={`${chargebackPredictions.overview.avgChargebackRisk}%`}
          icon={Percent}
          iconColor="text-yellow-600"
        />
        
        <MetricsCard
          title="High Risk Transactions"
          value={chargebackPredictions.overview.highRiskTransactions}
          icon={AlertTriangle}
          iconColor="text-red-600"
        />
        
        <MetricsCard
          title="Estimated Chargebacks"
          value={chargebackPredictions.overview.estimatedChargebacks}
          icon={TrendingDown}
          iconColor="text-orange-600"
        />
        
        <MetricsCard
          title="Estimated Losses"
          value={formatCurrency(
            parseFloat(chargebackPredictions.overview.estimatedLosses),
          )}
          icon={DollarSign}
          iconColor="text-red-600"
        />
      </div>

      {/* Risk Bands & Top Risk Factors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard
          title="Chargeback Risk Bands"
          icon={BarChart3}
        >
          <div className="space-y-3">
            {Object.entries(chargebackPredictions.riskBands).map(
              ([band, count]) => (
                <div
                  key={band}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded ${getRiskBandColor(band)}`}
                    ></div>
                    <span className="text-sm font-medium">
                      Band {band}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({getRiskBandLabel(band)} risk)
                    </span>
                  </div>
                  <span className="font-semibold">
                    {count as number}
                  </span>
                </div>
              ),
            )}
          </div>
        </ChartCard>

        <ChartCard
          title="Top Chargeback Risk Factors"
          icon={Target}
        >
          <div className="space-y-3">
            {chargebackPredictions.topRiskFactors.map(
              (factor: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm font-medium">
                      {factor.factor}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {factor.frequency} occurrences
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-red-600">
                      +{formatPercentage(factor.impact * 100)} impact
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </ChartCard>
      </div>

      {/* High Risk Predictions */}
      <ChartCard
        title="High Risk Chargeback Predictions"
        icon={Brain}
      >
        <div className="space-y-3">
          {chargebackPredictions.highRiskPredictions
            .slice(0, 10)
            .map((prediction: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg bg-red-50/50 border-red-200"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      prediction.riskBand === 'E'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-orange-100 text-orange-600'
                    }`}
                  >
                    {prediction.riskBand}
                  </div>
                  <div>
                    <div className="font-medium">
                      {prediction.orderId}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {prediction.customerEmail} • {formatCurrency(prediction.amount)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-red-600">
                      {formatPercentage(prediction.riskScore)} risk
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {prediction.timeToChargeback} days
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    {prediction.isNewCustomer && (
                      <Badge variant="outline" className="text-xs">
                        New Customer
                      </Badge>
                    )}
                    {prediction.hasVelocityRisk && (
                      <Badge variant="destructive" className="text-xs">
                        Velocity Risk
                      </Badge>
                    )}
                    {prediction.hasDeviceRisk && (
                      <Badge variant="outline" className="text-orange-600 border-orange-200 text-xs">
                        Device Risk
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </ChartCard>
    </div>
  );
}