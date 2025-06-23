// src/app/[locale]/dashboard/page.tsx
import React from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load the heavy dashboard client content (1240+ lines)
const DashboardClientContent = dynamic(() => import('./dashboard-client-content'), {
  ssr: false,
  loading: () => (
    <div className="p-6 space-y-8">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-6 border rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </div>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>
      
      {/* Documents Table Skeleton */}
      <div className="border rounded-lg">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </div>
        <div className="p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
});

// Force dynamic rendering for user-specific dashboard content
export const runtime = 'nodejs';
export const revalidate = 0;

interface DashboardPageProps {
  params: {
    locale: 'en' | 'es';
  };
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  return <DashboardClientContent locale={locale} />;
}
