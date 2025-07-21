'use client';

import React from 'react';
import { StatCard, ChartCard } from '../../shared';
import { Users, Star, TrendingUp } from 'lucide-react';

interface CustomerLTVTabProps {
  data: any;
  loading?: boolean;
}

const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

export function CustomerLTVTab({ data: customerLTV, loading }: CustomerLTVTabProps) {
  if (loading || !customerLTV) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-48 bg-gray-200 rounded"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="LTV by Segment"
          icon={Users}
          stats={customerLTV.segments.map((segment: any) => ({
            label: segment.name,
            value: formatCurrency(segment.avgLTV),
            className: segment.name === 'Enterprise' ? 'text-green-600' : undefined
          }))}
        />
        
        <StatCard
          title="Top Value Customers"
          icon={Star}
          stats={customerLTV.topCustomers.slice(0, 5).map((customer: any) => ({
            label: customer.email,
            value: formatCurrency(customer.ltv)
          }))}
        />
      </div>

      <ChartCard
        title="LTV Distribution"
        icon={TrendingUp}
      >
        <div className="grid grid-cols-4 gap-4">
          {customerLTV.distribution.map((bucket: any, index: number) => (
            <div key={index} className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">{bucket.count}</div>
              <div className="text-sm font-medium">{bucket.range}</div>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}