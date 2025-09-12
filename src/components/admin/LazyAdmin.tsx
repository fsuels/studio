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

// Pre-configured lazy admin components, using literal import paths to avoid webpack context warnings
export const LazyFraudDetectionDashboard = dynamic(
  () => import('@/components/admin/fraud-detection/FraudDetectionDashboard'),
  { loading: () => <AdminLoadingFallback title={'Fraud Detection Dashboard'} />, ssr: false },
);

export const LazyRevenueIntelligenceDashboard = dynamic(
  () => import('@/components/admin/revenue-intelligence/RevenueIntelligenceDashboard'),
  { loading: () => <AdminLoadingFallback title={'Revenue Intelligence Dashboard'} />, ssr: false },
);

export const LazyDocumentLifecycleDashboard = dynamic(
  () => import('@/components/admin/DocumentLifecycleDashboard'),
  { loading: () => <AdminLoadingFallback title={'Document Lifecycle Dashboard'} />, ssr: false },
);

export const LazyAIUsageDashboard = dynamic(
  () => import('@/components/admin/AIUsageDashboard'),
  { loading: () => <AdminLoadingFallback title={'AI Usage Dashboard'} />, ssr: false },
);

export const LazySupportToolkitDashboard = dynamic(
  () => import('@/components/admin/SupportToolkitDashboard'),
  { loading: () => <AdminLoadingFallback title={'Support Toolkit Dashboard'} />, ssr: false },
);

export const LazyFunnelAnalyticsDashboard = dynamic(
  () => import('@/components/admin/FunnelAnalyticsDashboard'),
  { loading: () => <AdminLoadingFallback title={'Funnel Analytics Dashboard'} />, ssr: false },
);

export const LazyMarketingInsightsDashboard = dynamic(
  () => import('@/components/admin/MarketingInsightsDashboard'),
  { loading: () => <AdminLoadingFallback title={'Marketing Insights Dashboard'} />, ssr: false },
);

export const LazyEnhancedOrdersTable = dynamic(
  () => import('@/components/admin/EnhancedOrdersTable'),
  { loading: () => <AdminLoadingFallback title={'Enhanced Orders'} />, ssr: false },
);

export const LazyReportBuilder = dynamic(
  () => import('@/components/admin/reports/ReportBuilder'),
  { loading: () => <AdminLoadingFallback title={'Report Builder'} />, ssr: false },
);
