// Virtualized List Components for High Performance Large Lists
// Renders only visible items, dramatically improving performance for 1000+ items

'use client';

import React, { memo, useCallback, useMemo, useState } from 'react';
import { FixedSizeList as List, VariableSizeList, type ListChildComponentProps } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface VirtualizedItem {
  id: string;
  [key: string]: any;
}

export interface VirtualizedListProps<T extends VirtualizedItem> {
  items: T[];
  itemHeight?: number | ((index: number) => number);
  height?: number;
  width?: string | number;
  itemCount?: number;
  hasNextPage?: boolean;
  isNextPageLoading?: boolean;
  loadNextPage?: () => Promise<void>;
  renderItem: (props: {
    item: T;
    index: number;
    style: React.CSSProperties;
    isVisible: boolean;
  }) => React.ReactNode;
  className?: string;
  overscan?: number;
  threshold?: number;
  // Performance options
  useIsScrolling?: boolean;
  direction?: 'ltr' | 'rtl';
  layout?: 'vertical' | 'horizontal';
}

/**
 * High-performance virtualized list component
 */
export function VirtualizedList<T extends VirtualizedItem>({
  items,
  itemHeight = 80,
  height = 400,
  width = '100%',
  itemCount,
  hasNextPage = false,
  isNextPageLoading = false,
  loadNextPage,
  renderItem,
  className,
  overscan = 5,
  threshold = 15,
  useIsScrolling = false,
  direction = 'ltr',
  layout = 'vertical',
}: VirtualizedListProps<T>) {
  const [isScrolling, setIsScrolling] = useState(false);

  const isFixedHeight = useMemo(() => typeof itemHeight === 'number', [itemHeight]);
  const numericItemHeight = useMemo(() => (typeof itemHeight === 'number' ? itemHeight : undefined), [itemHeight]);

  const getItemSize = useCallback((index: number) => {
    if (typeof itemHeight === 'function') {
      return itemHeight(index);
    }
    if (isFixedHeight && numericItemHeight !== undefined) {
      return numericItemHeight;
    }
    return 80;
  }, [itemHeight, isFixedHeight, numericItemHeight]);

  // Calculate total item count including loading states
  const totalItemCount = useMemo(() => {
    return itemCount || items.length + (hasNextPage ? 1 : 0);
  }, [items.length, hasNextPage, itemCount]);

  // Check if item is loaded
  const isItemLoaded = useCallback((index: number) => {
    return index < items.length;
  }, [items.length]);

  // Item renderer for react-window
  const ItemRenderer = memo(({ index, style }: ListChildComponentProps) => {
    const item = items[index];

    // Loading state for infinite loading
    if (!item) {
      return (
        <div style={style} className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
        </div>
      );
    }

    // Render the actual item
    return renderItem({
      item,
      index,
      style,
      isVisible: !useIsScrolling || !isScrolling,
    });
  });

  ItemRenderer.displayName = 'VirtualizedListItem';

  const handleScroll = useCallback(() => {
    if (useIsScrolling) {
      setIsScrolling(true);
      const timeoutId = setTimeout(() => setIsScrolling(false), 150);
      return () => clearTimeout(timeoutId);
    }
  }, [useIsScrolling]);

  // Fixed height list
  if (isFixedHeight) {
    const ListComponent = hasNextPage && loadNextPage ? (
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={totalItemCount}
        loadMoreItems={loadNextPage}
        threshold={threshold}
      >
        {({ onItemsRendered, ref }) => (
          <List
            ref={ref}
            height={height}
            width={width}
            itemCount={totalItemCount}
            itemSize={numericItemHeight ?? 80}
            onItemsRendered={onItemsRendered}
            onScroll={handleScroll}
            overscanCount={overscan}
            direction={direction}
            layout={layout}
            className={cn('scrollbar-thin scrollbar-thumb-muted', className)}
          >
            {ItemRenderer}
          </List>
        )}
      </InfiniteLoader>
    ) : (
      <List
        height={height}
        width={width}
        itemCount={items.length}
        itemSize={numericItemHeight ?? 80}
        onScroll={handleScroll}
        overscanCount={overscan}
        direction={direction}
        layout={layout}
        className={cn('scrollbar-thin scrollbar-thumb-muted', className)}
      >
        {ItemRenderer}
      </List>
    );

    return <div className="virtualized-list-container">{ListComponent}</div>;
  }
  // Variable height list

  const VariableListComponent = hasNextPage && loadNextPage ? (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={totalItemCount}
      loadMoreItems={loadNextPage}
      threshold={threshold}
    >
      {({ onItemsRendered, ref }) => (
        <VariableSizeList
          ref={ref}
          height={height}
          width={width}
          itemCount={totalItemCount}
          itemSize={getItemSize}
          onItemsRendered={onItemsRendered}
          onScroll={handleScroll}
          overscanCount={overscan}
          direction={direction}
          layout={layout}
          className={cn('scrollbar-thin scrollbar-thumb-muted', className)}
        >
          {ItemRenderer}
        </VariableSizeList>
      )}
    </InfiniteLoader>
  ) : (
    <VariableSizeList
      height={height}
      width={width}
      itemCount={items.length}
      itemSize={getItemSize}
      onScroll={handleScroll}
      overscanCount={overscan}
      direction={direction}
      layout={layout}
      className={cn('scrollbar-thin scrollbar-thumb-muted', className)}
    >
      {ItemRenderer}
    </VariableSizeList>
  );

  return <div className="virtualized-list-container">{VariableListComponent}</div>;
}

/**
 * Optimized document list component
 */
export interface DocumentListItem extends VirtualizedItem {
  title: string;
  description?: string;
  type: string;
  updatedAt: string;
  status?: 'draft' | 'completed' | 'published';
  thumbnail?: string;
}

export function VirtualizedDocumentList({
  documents,
  onDocumentClick,
  hasNextPage = false,
  isLoading = false,
  onLoadMore,
  className,
}: {
  documents: DocumentListItem[];
  onDocumentClick: (document: DocumentListItem) => void;
  hasNextPage?: boolean;
  isLoading?: boolean;
  onLoadMore?: () => Promise<void>;
  className?: string;
}) {
  const renderDocumentItem = useCallback(({ item, style, isVisible }: {
    item: DocumentListItem;
    style: React.CSSProperties;
    isVisible: boolean;
  }) => (
    <div
      style={style}
      className={cn(
        'flex items-center p-4 border-b border-border hover:bg-muted/50 cursor-pointer transition-colors',
        !isVisible && 'opacity-50'
      )}
      onClick={() => onDocumentClick(item)}
    >
      {/* Document thumbnail */}
      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mr-4 flex-shrink-0">
        {item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <span className="text-xs font-medium text-muted-foreground">
            {item.type.slice(0, 3).toUpperCase()}
          </span>
        )}
      </div>

      {/* Document info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate">{item.title}</h3>
        {item.description && (
          <p className="text-sm text-muted-foreground truncate mt-1">
            {item.description}
          </p>
        )}
        <div className="flex items-center mt-2 text-xs text-muted-foreground">
          <span>{item.type}</span>
          <span className="mx-2">•</span>
          <span>{new Date(item.updatedAt).toLocaleDateString()}</span>
          {item.status && (
            <>
              <span className="mx-2">•</span>
              <span className={cn(
                'px-2 py-1 rounded-full text-xs font-medium',
                item.status === 'completed' && 'bg-green-100 text-green-800',
                item.status === 'draft' && 'bg-yellow-100 text-yellow-800',
                item.status === 'published' && 'bg-blue-100 text-blue-800'
              )}>
                {item.status}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  ), [onDocumentClick]);

  return (
    <VirtualizedList
      items={documents}
      itemHeight={96} // Fixed height for consistent layout
      height={600}
      hasNextPage={hasNextPage}
      isNextPageLoading={isLoading}
      loadNextPage={onLoadMore}
      renderItem={renderDocumentItem}
      className={className}
      overscan={3}
      threshold={10}
      useIsScrolling
    />
  );
}

/**
 * Optimized search results list
 */
export interface SearchResultItem extends VirtualizedItem {
  title: string;
  excerpt: string;
  url: string;
  category: string;
  relevance: number;
}

export function VirtualizedSearchResults({
  results,
  onResultClick,
  isLoading = false,
  className,
}: {
  results: SearchResultItem[];
  onResultClick: (result: SearchResultItem) => void;
  isLoading?: boolean;
  className?: string;
}) {
  const renderSearchResult = useCallback(({ item, style }: {
    item: SearchResultItem;
    style: React.CSSProperties;
  }) => (
    <div
      style={style}
      className="p-4 border-b border-border hover:bg-muted/30 cursor-pointer transition-colors"
      onClick={() => onResultClick(item)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-blue-600 hover:text-blue-800 truncate">
            {item.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {item.excerpt}
          </p>
          <div className="flex items-center mt-2 text-xs text-muted-foreground">
            <span className="px-2 py-1 bg-muted rounded-full">{item.category}</span>
            <span className="ml-2">{item.url}</span>
          </div>
        </div>
        <div className="ml-4 flex-shrink-0">
          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${item.relevance * 100}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground mt-1 block text-center">
            {Math.round(item.relevance * 100)}%
          </span>
        </div>
      </div>
    </div>
  ), [onResultClick]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Searching...</span>
      </div>
    );
  }

  return (
    <VirtualizedList
      items={results}
      itemHeight={120}
      height={500}
      renderItem={renderSearchResult}
      className={className}
      overscan={2}
      useIsScrolling
    />
  );
}

/**
 * Hook for managing virtualized list state
 */
export function useVirtualizedList<T extends VirtualizedItem>({
  initialItems = [],
  pageSize = 50,
  loadMore,
}: {
  initialItems?: T[];
  pageSize?: number;
  loadMore?: (page: number) => Promise<T[]>;
}) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);

  const loadNextPage = useCallback(async () => {
    if (!loadMore || isLoading || !hasNextPage) return;

    setIsLoading(true);
    try {
      const newItems = await loadMore(page + 1);
      setItems(prev => [...prev, ...newItems]);
      setPage(prev => prev + 1);
      setHasNextPage(newItems.length === pageSize);
    } catch (error) {
      console.error('Failed to load more items:', error);
    } finally {
      setIsLoading(false);
    }
  }, [loadMore, isLoading, hasNextPage, page, pageSize]);

  const reset = useCallback((newItems: T[] = []) => {
    setItems(newItems);
    setPage(0);
    setHasNextPage(true);
    setIsLoading(false);
  }, []);

  return {
    items,
    hasNextPage,
    isLoading,
    loadNextPage,
    reset,
  };
}

export default VirtualizedList;