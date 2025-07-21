import { Skeleton } from './skeleton';
import { cn } from '@/lib/utils';

export function HeaderSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center space-x-4', className)}>
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

export function DocumentCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-3', className)}>
      <Skeleton className="h-48 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function FormFieldSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-full rounded-md" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

export function WizardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Progress bar */}
      <div className="space-y-2">
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-3 w-20" />
      </div>

      {/* Form fields */}
      <div className="space-y-4">
        <FormFieldSkeleton />
        <FormFieldSkeleton />
        <FormFieldSkeleton />
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Skeleton className="h-10 w-20 rounded-md" />
        <Skeleton className="h-10 w-20 rounded-md" />
      </div>
    </div>
  );
}

export function SearchResultsSkeleton({
  count = 5,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="flex items-center space-x-3 p-3 border rounded-lg"
        >
          <Skeleton className="h-12 w-12 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Table header */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }, (_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>

      {/* Table rows */}
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex space-x-4">
          {Array.from({ length: columns }, (_, j) => (
            <Skeleton key={j} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function NavigationSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center space-x-6', className)}>
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-6 w-18" />
      <Skeleton className="h-6 w-22" />
    </div>
  );
}

export function MegaMenuSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('grid grid-cols-3 gap-8 p-6', className)}>
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-5 w-24" />
          <div className="space-y-2">
            {Array.from({ length: 4 }, (_, j) => (
              <Skeleton key={j} className="h-4 w-32" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function UserMenuSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-4 w-16" />
    </div>
  );
}
