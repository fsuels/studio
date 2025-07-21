'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Shared loading fallback for complex components
const ComplexComponentFallback = ({ height = 'h-64' }: { height?: string }) => (
  <div className={`${height} bg-gray-100 rounded-lg animate-pulse flex items-center justify-center`}>
    <div className="text-gray-400">Loading...</div>
  </div>
);

// Chart loading fallback
const ChartLoadingFallback = () => (
  <div className="h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 animate-pulse flex items-center justify-center">
    <div className="text-center">
      <div className="w-8 h-8 bg-gray-200 rounded mx-auto mb-2"></div>
      <div className="text-gray-400 text-sm">Loading chart...</div>
    </div>
  </div>
);

// Document collaboration (1154 lines)
export const LazyDocumentCollaboration = dynamic(
  () => import('@/components/collaboration/DocumentCollaboration'),
  {
    loading: () => <ComplexComponentFallback height="h-96" />,
    ssr: false,
  }
);

// Translation review workflow (913 lines)
export const LazyTranslationReviewWorkflow = dynamic(
  () => import('@/components/translation/TranslationReviewWorkflow'),
  {
    loading: () => <ComplexComponentFallback height="h-80" />,
    ssr: false,
  }
);

// Semantic search interface (719 lines)
export const LazySemanticSearchInterface = dynamic(
  () => import('@/components/search/SemanticSearchInterface'),
  {
    loading: () => (
      <div className="h-16 bg-gray-100 rounded-lg animate-pulse flex items-center px-4">
        <div className="w-6 h-6 bg-gray-200 rounded mr-3"></div>
        <div className="h-4 bg-gray-200 rounded flex-1"></div>
      </div>
    ),
    ssr: false,
  }
);

// Chart components that are heavy
export const LazyChart = dynamic(
  () => import('@/components/ui/chart').then(mod => ({ default: mod.ChartContainer })),
  {
    loading: () => <ChartLoadingFallback />,
    ssr: false,
  }
);

// Dashboard client content (1240 lines)
export const LazyDashboardContent = dynamic(
  () => import('@/app/[locale]/(app)/dashboard/dashboard-client-content'),
  {
    loading: () => (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
          <div className="h-64 bg-gray-200 rounded mt-6"></div>
        </div>
      </div>
    ),
    ssr: false,
  }
);

// SignWell client content (918 lines)
export const LazySignWellContent = dynamic(
  () => import('@/app/[locale]/(marketing)/signwell/signwell-client-content'),
  {
    loading: () => (
      <div className="animate-pulse space-y-8">
        <div className="h-64 bg-gray-200 rounded"></div>
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-48 bg-gray-200 rounded"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    ),
    ssr: false,
  }
);

// Heavy form components
export const LazyWizardForm = dynamic(
  () => import('@/components/forms/WizardForm'),
  {
    loading: () => (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-2 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    ),
    ssr: false,
  }
);

// Report builder (854 lines)
export const LazyReportBuilder = dynamic(
  () => import('@/components/admin/reports/ReportBuilder'),
  {
    loading: () => (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="col-span-2 h-64 bg-gray-200 rounded"></div>
          </div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    ),
    ssr: false,
  }
);

// Enhanced orders table (890 lines)
export const LazyEnhancedOrdersTable = dynamic(
  () => import('@/components/admin/EnhancedOrdersTable'),
  {
    loading: () => (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded mb-2"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded mb-1"></div>
          ))}
        </div>
      </div>
    ),
    ssr: false,
  }
);

// Preload critical components for better UX
export function preloadCriticalComponents() {
  // Preload commonly used components
  LazyWizardForm.preload?.();
  LazySemanticSearchInterface.preload?.();
}

// Preload admin components when user accesses admin area
export function preloadAdminComponents() {
  LazyReportBuilder.preload?.();
  LazyEnhancedOrdersTable.preload?.();
  LazyDashboardContent.preload?.();
}