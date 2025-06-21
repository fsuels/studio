'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Base skeleton element
export function SkeletonElement({
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse bg-gray-200 rounded', className)}
      {...props}
    />
  );
}

// Skeleton for table rows
export function TableRowSkeleton({ columns = 6 }: { columns?: number }) {
  return (
    <tr className="border-b border-gray-100">
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-4 py-3">
          <div className="space-y-2">
            <SkeletonElement className="h-4 w-full" />
            <SkeletonElement className="h-3 w-3/4" />
          </div>
        </td>
      ))}
    </tr>
  );
}

// Skeleton for orders table specifically
export function OrdersTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <SkeletonElement className="h-8 w-48" />
        <div className="flex gap-2">
          <SkeletonElement className="h-9 w-24" />
          <SkeletonElement className="h-9 w-24" />
        </div>
      </div>

      {/* Filters skeleton */}
      <div className="flex gap-4 mb-6">
        <SkeletonElement className="h-10 flex-1" />
        <SkeletonElement className="h-10 w-40" />
        <SkeletonElement className="h-10 w-40" />
      </div>

      {/* Table skeleton */}
      <Card>
        <CardContent className="p-0">
          <div className="rounded-lg border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  {[
                    'Order',
                    'Customer',
                    'Document',
                    'Amount',
                    'Status',
                    'Risk',
                    'Location',
                    'Date',
                    '',
                  ].map((header, index) => (
                    <th key={index} className="px-4 py-3 text-left">
                      <SkeletonElement className="h-4 w-20" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: rows }).map((_, index) => (
                  <TableRowSkeleton key={index} columns={9} />
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Skeleton for metric cards
export function MetricCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <SkeletonElement className="h-4 w-24" />
            <SkeletonElement className="h-8 w-16" />
          </div>
          <SkeletonElement className="h-8 w-8 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton for dashboard with metrics
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <SkeletonElement className="h-8 w-64" />
          <SkeletonElement className="h-4 w-96" />
        </div>
        <SkeletonElement className="h-10 w-24" />
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <MetricCardSkeleton key={index} />
        ))}
      </div>

      {/* Main content */}
      <OrdersTableSkeleton />
    </div>
  );
}

// Skeleton for customer 360 view
export function Customer360Skeleton() {
  return (
    <div className="space-y-6">
      {/* Customer header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <SkeletonElement className="h-16 w-16 rounded-full" />
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <SkeletonElement className="h-8 w-48" />
                <SkeletonElement className="h-6 w-20" />
                <SkeletonElement className="h-6 w-32" />
              </div>
              <div className="flex items-center gap-4">
                <SkeletonElement className="h-4 w-48" />
                <SkeletonElement className="h-4 w-32" />
                <SkeletonElement className="h-4 w-40" />
              </div>
              <div className="flex items-center gap-4">
                <SkeletonElement className="h-4 w-36" />
                <SkeletonElement className="h-4 w-28" />
              </div>
            </div>
            <div className="space-y-2">
              <SkeletonElement className="h-8 w-32" />
              <div className="flex gap-2">
                <SkeletonElement className="h-6 w-20" />
                <SkeletonElement className="h-6 w-24" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <MetricCardSkeleton key={index} />
        ))}
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <div className="flex gap-2">
          {['Overview', 'Timeline', 'Orders', 'Support'].map((tab, index) => (
            <SkeletonElement key={index} className="h-10 w-24" />
          ))}
        </div>

        {/* Tab content */}
        <Card>
          <CardContent className="p-6 space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-b-0"
              >
                <SkeletonElement className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <SkeletonElement className="h-4 w-3/4" />
                  <SkeletonElement className="h-3 w-1/2" />
                  <SkeletonElement className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Skeleton for session replay
export function SessionReplaySkeleton() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <SkeletonElement className="h-6 w-48" />
        <div className="flex gap-2">
          <SkeletonElement className="h-8 w-8" />
          <SkeletonElement className="h-8 w-8" />
          <SkeletonElement className="h-8 w-8" />
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <SkeletonElement className="h-4 w-32" />
          <SkeletonElement className="h-4 w-20" />
        </div>
        <SkeletonElement className="h-2 w-full" />
      </div>

      {/* Current event */}
      <Card>
        <CardHeader>
          <SkeletonElement className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <SkeletonElement className="h-4 w-20" />
                <SkeletonElement className="h-4 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <SkeletonElement className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <SkeletonElement className="h-4 w-20" />
                  <SkeletonElement className="h-4 w-32" />
                </div>
                <SkeletonElement className="h-3 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Skeleton for support toolkit
export function SupportToolkitSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <SkeletonElement className="h-8 w-48" />
          <SkeletonElement className="h-4 w-80" />
        </div>
        <SkeletonElement className="h-10 w-24" />
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <MetricCardSkeleton key={index} />
        ))}
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <div className="flex gap-2">
          {['Sessions', 'Refunds', 'Analytics'].map((tab, index) => (
            <SkeletonElement key={index} className="h-10 w-32" />
          ))}
        </div>

        {/* Session table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <SkeletonElement className="h-6 w-32" />
              <div className="flex gap-2">
                <SkeletonElement className="h-10 w-64" />
                <SkeletonElement className="h-10 w-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    {[
                      'Session ID',
                      'User',
                      'Duration',
                      'Documents',
                      'Errors',
                      'Created',
                      'Actions',
                    ].map((header, index) => (
                      <th key={index} className="px-4 py-3 text-left">
                        <SkeletonElement className="h-4 w-20" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <TableRowSkeleton key={index} columns={7} />
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Shimmer effect variant
export function ShimmerSkeleton({
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-gray-200 rounded',
        'before:absolute before:inset-0',
        'before:-translate-x-full before:animate-[shimmer_2s_infinite]',
        'before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent',
        className,
      )}
      {...props}
    />
  );
}

// Pulse skeleton variant
export function PulseSkeleton({
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 rounded',
        'animate-[pulse_1.5s_ease-in-out_infinite]',
        className,
      )}
      {...props}
    />
  );
}

// Wave skeleton variant
export function WaveSkeleton({
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-gray-200 rounded',
        'before:absolute before:inset-0',
        'before:-translate-x-full before:animate-[wave_1.5s_ease-in-out_infinite]',
        'before:bg-gradient-to-r before:from-transparent before:via-gray-300 before:to-transparent',
        className,
      )}
      {...props}
    />
  );
}
