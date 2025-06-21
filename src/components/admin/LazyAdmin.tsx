'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Shared loading component for admin dashboards
const AdminLoadingFallback = ({ title }: { title?: string }) => (
  <div className="container mx-auto py-6">
    <div className="animate-pulse space-y-6">
      {title && (
        <div className="border-b border-gray-200 pb-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-100 rounded w-1/2 mt-2"></div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
      <div className="h-64 bg-gray-200 rounded"></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-48 bg-gray-200 rounded"></div>
        <div className="h-48 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

// Factory function for creating lazy admin components
export const createLazyAdminComponent = (
  importPath: string,
  componentName: string,
  title?: string
) => {
  return dynamic(() => import(importPath), {
    loading: () => <AdminLoadingFallback title={title} />,
    ssr: false,
  });
};

// Pre-configured lazy admin components
export const LazyFraudDetectionDashboard = createLazyAdminComponent(
  '@/components/admin/FraudDetectionDashboard',
  'FraudDetectionDashboard',
  'Fraud Detection Dashboard'
);

export const LazyRevenueIntelligenceDashboard = createLazyAdminComponent(
  '@/components/admin/RevenueIntelligenceDashboard',
  'RevenueIntelligenceDashboard',
  'Revenue Intelligence Dashboard'
);

export const LazyDocumentLifecycleDashboard = createLazyAdminComponent(
  '@/components/admin/DocumentLifecycleDashboard',
  'DocumentLifecycleDashboard',
  'Document Lifecycle Dashboard'
);

export const LazyAIUsageDashboard = createLazyAdminComponent(
  '@/components/admin/AIUsageDashboard',
  'AIUsageDashboard',
  'AI Usage Dashboard'
);

export const LazySupportToolkitDashboard = createLazyAdminComponent(
  '@/components/admin/SupportToolkitDashboard',
  'SupportToolkitDashboard',
  'Support Toolkit Dashboard'
);

export const LazyFunnelAnalyticsDashboard = createLazyAdminComponent(
  '@/components/admin/FunnelAnalyticsDashboard',
  'FunnelAnalyticsDashboard',
  'Funnel Analytics Dashboard'
);

export const LazyMarketingInsightsDashboard = createLazyAdminComponent(
  '@/components/admin/MarketingInsightsDashboard',
  'MarketingInsightsDashboard',
  'Marketing Insights Dashboard'
);

export const LazyEnhancedOrdersTable = createLazyAdminComponent(
  '@/components/admin/EnhancedOrdersTable',
  'EnhancedOrdersTable',
  'Enhanced Orders'
);

export const LazyReportBuilder = createLazyAdminComponent(
  '@/components/admin/reports/ReportBuilder',
  'ReportBuilder',
  'Report Builder'
);