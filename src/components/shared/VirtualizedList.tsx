'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { useVirtual } from '@tanstack/react-virtual';
import {
  BaseComponentProps,
  ListComponentProps,
  ClassNameHelpers,
} from '@/lib/component-standards';

export interface VirtualizedListProps<T> extends ListComponentProps<T> {
  itemHeight?: number | ((index: number) => number);
  overscan?: number;
  containerHeight?: number | string;
  containerClassName?: string;
  itemClassName?: string | ((item: T, index: number) => string);
}

export const VirtualizedList = React.memo(function VirtualizedList<T>({
  items,
  renderItem,
  keyExtractor,
  emptyMessage = 'No items to display',
  loading = false,
  error,
  onItemClick,
  itemHeight = 60,
  overscan = 5,
  containerHeight = 400,
  containerClassName,
  itemClassName,
  className,
  'data-testid': testId,
}: VirtualizedListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtual({
    size: items.length,
    parentRef,
    estimateSize: useCallback(
      (index: number) => {
        if (typeof itemHeight === 'function') {
          return itemHeight(index);
        }
        return itemHeight;
      },
      [itemHeight],
    ),
    overscan,
  });

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, item: T, index: number) => {
      if (onItemClick && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        onItemClick(item, index);
      }
    },
    [onItemClick],
  );

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-red-600 p-4 text-center">
        <p>Error: {error}</p>
      </div>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <div className="text-gray-500 p-4 text-center">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  const containerClasses = ClassNameHelpers.cn(
    'overflow-auto',
    containerClassName,
    className,
  );

  return (
    <div
      ref={parentRef}
      className={containerClasses}
      style={{
        height:
          typeof containerHeight === 'number'
            ? `${containerHeight}px`
            : containerHeight,
      }}
      data-testid={testId || 'virtualized-list'}
      role="list"
      aria-label="Virtualized list"
    >
      <div
        style={{
          height: `${rowVirtualizer.totalSize}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.virtualItems.map((virtualRow) => {
          const item = items[virtualRow.index];
          const key = keyExtractor
            ? keyExtractor(item, virtualRow.index)
            : virtualRow.index;

          const itemClasses =
            typeof itemClassName === 'function'
              ? itemClassName(item, virtualRow.index)
              : itemClassName;

          return (
            <div
              key={key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
              className={itemClasses}
              onClick={() => onItemClick?.(item, virtualRow.index)}
              onKeyDown={(e) => handleKeyDown(e, item, virtualRow.index)}
              tabIndex={onItemClick ? 0 : undefined}
              role="listitem"
              aria-posinset={virtualRow.index + 1}
              aria-setsize={items.length}
            >
              {renderItem(item, virtualRow.index)}
            </div>
          );
        })}
      </div>
    </div>
  );
}) as <T>(props: VirtualizedListProps<T>) => JSX.Element;

// Optimized grid version for card layouts
export interface VirtualizedGridProps<T>
  extends Omit<VirtualizedListProps<T>, 'itemHeight'> {
  columns?: number;
  gap?: number;
  itemHeight?: number;
  responsive?: boolean;
}

export const VirtualizedGrid = React.memo(function VirtualizedGrid<T>({
  items,
  renderItem,
  keyExtractor,
  emptyMessage = 'No items to display',
  loading = false,
  error,
  onItemClick,
  columns = 3,
  gap = 16,
  itemHeight = 200,
  responsive = true,
  overscan = 5,
  containerHeight = 600,
  containerClassName,
  itemClassName,
  className,
  'data-testid': testId,
}: VirtualizedGridProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [actualColumns, setActualColumns] = React.useState(columns);

  // Handle responsive columns
  useEffect(() => {
    if (!responsive || !parentRef.current) return;

    const updateColumns = () => {
      const width = parentRef.current?.offsetWidth || 0;
      if (width < 640) setActualColumns(1);
      else if (width < 768) setActualColumns(2);
      else if (width < 1024) setActualColumns(columns > 3 ? 3 : columns);
      else setActualColumns(columns);
    };

    updateColumns();
    const resizeObserver = new ResizeObserver(updateColumns);
    resizeObserver.observe(parentRef.current);

    return () => resizeObserver.disconnect();
  }, [columns, responsive]);

  // Calculate rows based on columns
  const rows = Math.ceil(items.length / actualColumns);

  const rowVirtualizer = useVirtual({
    size: rows,
    parentRef,
    estimateSize: useCallback(() => itemHeight + gap, [itemHeight, gap]),
    overscan,
  });

  // Loading/Error/Empty states (same as VirtualizedList)
  if (loading || error || items.length === 0) {
    return (
      <VirtualizedList
        items={items}
        renderItem={renderItem}
        loading={loading}
        error={error}
        emptyMessage={emptyMessage}
      />
    );
  }

  const containerClasses = ClassNameHelpers.cn(
    'overflow-auto',
    containerClassName,
    className,
  );

  return (
    <div
      ref={parentRef}
      className={containerClasses}
      style={{
        height:
          typeof containerHeight === 'number'
            ? `${containerHeight}px`
            : containerHeight,
      }}
      data-testid={testId || 'virtualized-grid'}
      role="grid"
      aria-label="Virtualized grid"
    >
      <div
        style={{
          height: `${rowVirtualizer.totalSize}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.virtualItems.map((virtualRow) => {
          const startIndex = virtualRow.index * actualColumns;
          const endIndex = Math.min(startIndex + actualColumns, items.length);
          const rowItems = items.slice(startIndex, endIndex);

          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
                display: 'grid',
                gridTemplateColumns: `repeat(${actualColumns}, 1fr)`,
                gap: `${gap}px`,
              }}
              role="row"
            >
              {rowItems.map((item, colIndex) => {
                const itemIndex = startIndex + colIndex;
                const key = keyExtractor
                  ? keyExtractor(item, itemIndex)
                  : itemIndex;

                const itemClasses =
                  typeof itemClassName === 'function'
                    ? itemClassName(item, itemIndex)
                    : itemClassName;

                return (
                  <div
                    key={key}
                    className={itemClasses}
                    onClick={() => onItemClick?.(item, itemIndex)}
                    onKeyDown={(e) => {
                      if (onItemClick && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        onItemClick(item, itemIndex);
                      }
                    }}
                    tabIndex={onItemClick ? 0 : undefined}
                    role="gridcell"
                    aria-colindex={colIndex + 1}
                    aria-rowindex={virtualRow.index + 1}
                  >
                    {renderItem(item, itemIndex)}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}) as <T>(props: VirtualizedGridProps<T>) => JSX.Element;

// Hook for infinite scrolling
export function useInfiniteScroll(
  callback: () => void,
  options?: {
    threshold?: number;
    enabled?: boolean;
  },
) {
  const { threshold = 0.9, enabled = true } = options || {};
  const observerRef = useRef<IntersectionObserver>();
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const target = targetRef.current;
    if (!target) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callback();
        }
      },
      { threshold },
    );

    observerRef.current.observe(target);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [callback, threshold, enabled]);

  return targetRef;
}
