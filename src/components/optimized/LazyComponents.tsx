// Lazy-loaded component wrappers for performance optimization
// These components are loaded only when needed, reducing initial bundle size

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Loading component shown while lazy components load
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Heavy document components - lazy loaded
export const SmartDocumentWizard = dynamic(
  () => import('@/components/document/SmartDocumentWizard'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

export const UniversalDocumentWizard = dynamic(
  () => import('@/components/document/UniversalDocumentWizard'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

export const DirectFormFillingInterface = dynamic(
  () => import('@/components/document/DirectFormFillingInterface'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

export const InteractivePDFFormFiller = dynamic(
  () => import('@/components/document/InteractivePDFFormFiller'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

export const FilledPDFViewer = dynamic(
  () => import('@/components/document/FilledPDFViewer'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

export const StatePDFPreview = dynamic(
  () => import('@/components/document/StatePDFPreview'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

export const SimplePDFViewer = dynamic(
  () => import('@/components/document/SimplePDFViewer'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

// Discovery and search components
export const DiscoverySearch = dynamic(
  () => import('@/components/discovery/DiscoverySearch'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

// Dashboard components
export const DashboardView = dynamic(
  () => import('@/app/[locale]/(app)/dashboard/dashboard-view'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

// Marketplace components
export const MarketplaceView = dynamic(
  () => import('@/components/marketplace/MarketplaceView'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

// Admin components
export const AdminDashboard = dynamic(
  () => import('@/components/admin/AdminDashboard'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

export const AuditTrailView = dynamic(
  () => import('@/components/admin/AuditTrailView'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

// Form components
export const DynamicForm = dynamic(
  () => import('@/components/forms/DynamicForm'),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

// Re-engagement components
export const ReEngagementTools = dynamic(
  () => import('@/components/reengagement/ReEngagementTools.client'),
  {
    loading: () => null, // No loading indicator for this one
    ssr: false,
  }
);