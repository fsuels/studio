// Example usage of ChartCard widgets
// Shows how to create a metrics dashboard with various chart types

'use client';

import React from 'react';
import { ChartCard } from '@/components/widgets/ChartCard';

export function MetricsDashboardExample() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground">
          Real-time metrics for your legal document platform
        </p>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ChartCard
          queryKey="conversion_rate"
          title="Conversion Rate"
          description="Percentage of visitors who complete document creation"
          chartType="line"
          height={200}
          refreshInterval={30000}
        />

        <ChartCard
          queryKey="revenue"
          title="Revenue"
          description="Total revenue from document sales"
          chartType="bar"
          height={200}
          refreshInterval={60000}
        />

        <ChartCard
          queryKey="churn_rate"
          title="Churn Rate"
          description="Percentage of customers who stopped using the service"
          chartType="line"
          height={200}
          refreshInterval={300000} // 5 minutes
        />
      </div>

      {/* Business Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          queryKey="document_completion_rate"
          title="Document Completion Rate"
          description="Percentage of started documents that are completed"
          chartType="line"
          height={300}
        />

        <ChartCard
          queryKey="avg_order_value"
          title="Average Order Value"
          description="Average revenue per transaction"
          chartType="bar"
          height={300}
        />
      </div>

      {/* Customer Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          queryKey="user_acquisition"
          title="User Acquisition"
          description="New users signing up daily"
          chartType="bar"
          height={300}
        />

        <ChartCard
          queryKey="user_retention"
          title="User Retention"
          description="Cohort-based user retention rates"
          chartType="line"
          height={300}
        />
      </div>

      {/* Document Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          queryKey="document_types_popularity"
          title="Popular Document Types"
          description="Most frequently created document types"
          chartType="pie"
          height={350}
        />

        <ChartCard
          queryKey="session_duration"
          title="Average Session Duration"
          description="How long users spend on the platform"
          chartType="line"
          height={350}
        />
      </div>

      {/* Performance & Security */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          queryKey="payment_success_rate"
          title="Payment Success Rate"
          description="Percentage of successful payment transactions"
          chartType="line"
          height={300}
        />

        <ChartCard
          queryKey="fraud_prevention_savings"
          title="Fraud Prevention Savings"
          description="Amount saved by blocking fraudulent transactions"
          chartType="bar"
          height={300}
        />
      </div>

      {/* Advanced Metrics */}
      <div className="grid grid-cols-1 gap-6">
        <ChartCard
          queryKey="customer_lifetime_value"
          title="Customer Lifetime Value"
          description="Average revenue generated per customer over their lifetime"
          chartType="bar"
          height={400}
          refreshInterval={600000} // 10 minutes
        />
      </div>

      {/* Implementation Notes */}
      <div className="mt-12 p-6 bg-muted rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Implementation Guide</h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong>ChartCard Usage:</strong> Each ChartCard automatically
            fetches data from
            <code className="mx-1 px-1 bg-background rounded">
              /api/metrics?metric=QUERY_KEY
            </code>
          </p>
          <p>
            <strong>Data Validation:</strong> All responses are validated using
            Zod schemas for type safety
          </p>
          <p>
            <strong>Real-time Updates:</strong> SWR handles caching,
            revalidation, and automatic refreshing
          </p>
          <p>
            <strong>Responsive Design:</strong> Charts automatically resize and
            are mobile-friendly
          </p>
          <p>
            <strong>Error Handling:</strong> Built-in error states and retry
            mechanisms
          </p>
        </div>
      </div>
    </div>
  );
}
