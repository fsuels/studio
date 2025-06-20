// Enhanced Orders Page with Quick-Win UI Polish
import { Metadata } from 'next';
import { StickySummaryBar } from '@/components/ui/StickySummaryBar';
import EnhancedOrdersTable from '@/components/admin/EnhancedOrdersTable';

export const metadata: Metadata = {
  title: 'Enhanced Orders - Admin Dashboard',
  description: 'Advanced order management with inline actions, optimistic updates, and real-time metrics',
};

export default function EnhancedOrdersPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Enhanced Orders Dashboard</h1>
          <p className="text-gray-600">
            Advanced order management with inline actions, optimistic updates, and real-time performance metrics
          </p>
        </div>

        {/* Enhanced Orders Table */}
        <EnhancedOrdersTable />

        {/* Sticky Summary Bar - appears when scrolling */}
        <StickySummaryBar />
      </div>
    </div>
  );
}