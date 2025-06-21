'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MetricsCard, ChartCard } from '../../shared';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Users,
  AlertTriangle,
  Activity,
  Shield,
  ArrowUp,
  ArrowDown,
  Minus,
  Mail,
  Phone,
} from 'lucide-react';

interface RevenueOverviewTabProps {
  data: any;
  loading?: boolean;
}

const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

const getGrowthColor = (growth: number) => {
  if (growth > 0) return 'text-green-600';
  if (growth < 0) return 'text-red-600';
  return 'text-gray-600';
};

const getGrowthIcon = (growth: number) => {
  if (growth > 0) return <ArrowUp className="h-4 w-4" />;
  if (growth < 0) return <ArrowDown className="h-4 w-4" />;
  return <Minus className="h-4 w-4" />;
};

export function RevenueOverviewTab({ data: overview, loading }: RevenueOverviewTabProps) {
  if (loading || !overview) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricsCard
          title="Monthly Recurring Revenue"
          value={formatCurrency(overview.summary.mrr)}
          trend={{
            value: overview.summary.mrrGrowth,
            isPositive: overview.summary.mrrGrowth > 0,
            label: "from last month"
          }}
          icon={TrendingUp}
          iconColor="text-blue-600"
        />
        
        <MetricsCard
          title="Annual Recurring Revenue"
          value={formatCurrency(overview.summary.arr)}
          subtitle={`${formatCurrency(overview.summary.arr / 12)}/month run rate`}
          icon={BarChart3}
          iconColor="text-green-600"
        />
        
        <MetricsCard
          title="Average Customer LTV"
          value={formatCurrency(overview.summary.avgLTV)}
          subtitle={`${overview.summary.totalCustomers} total customers`}
          icon={Users}
          iconColor="text-purple-600"
        />
        
        <MetricsCard
          title="Churn Risk Alerts"
          value={overview.summary.churnRisk}
          subtitle="High/Critical risk customers"
          icon={AlertTriangle}
          iconColor="text-red-600"
          badge={{
            text: "Action Required",
            variant: "destructive"
          }}
        />
      </div>

      {/* Revenue Trends Chart */}
      {overview.trends && (
        <ChartCard
          title="Revenue Trends (Last 12 Months)"
          icon={Activity}
        >
          <div className="space-y-4">
            {overview.trends.map((trend: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <div className="font-medium">{trend.period}</div>
                  <div className="text-sm text-muted-foreground">
                    {trend.newCustomers} new customers
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {formatCurrency(trend.revenue)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {trend.expansionRevenue > 0 &&
                      `+${formatCurrency(trend.expansionRevenue)} expansion`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      )}

      {/* Top At-Risk Customers */}
      {overview.topRisks && (
        <ChartCard
          title="High-Risk Customers (Immediate Action Required)"
          icon={Shield}
        >
          <div className="space-y-3">
            {overview.topRisks
              .slice(0, 10)
              .map((customer: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg bg-red-50/50 border-red-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-red-600">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{customer.email}</div>
                      <div className="text-sm text-muted-foreground">
                        LTV: {formatCurrency(customer.ltv)} • 
                        Joined: {new Date(customer.joinDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <Badge variant="destructive" className="mb-1">
                        {formatPercentage(customer.churnProbability)} churn risk
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        Risk Score: {customer.riskScore}/100
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Mail className="h-4 w-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Phone className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </ChartCard>
      )}
    </div>
  );
}