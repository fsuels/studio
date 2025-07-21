// src/components/layout/Header/CategoryNavigationSkeleton.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface CategoryNavigationSkeletonProps {
  className?: string;
}

export default function CategoryNavigationSkeleton({ className }: CategoryNavigationSkeletonProps) {
  return (
    <div className={cn("bg-background border-b border-border/40", className)}>
      <div className="container mx-auto px-4">
        {/* Search Bar Skeleton */}
        <div className="py-4">
          <div className="relative max-w-2xl mx-auto">
            <div className="w-full h-12 bg-muted/50 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Categories Bar Skeleton */}
        <div className="flex items-center justify-center gap-1 pb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-32 bg-muted/50 rounded-md animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}