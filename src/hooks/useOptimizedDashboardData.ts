'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import {
  getUserDocumentsPaginated,
  getUserPayments,
  getUserFolders,
  type DashboardDocument,
} from '@/lib/firestore/dashboardData';

interface UseOptimizedDashboardDataOptions {
  enabled?: boolean;
  initialPageSize?: number;
  pageSize?: number;
}

export function useOptimizedDashboardData(
  userId?: string,
  options: UseOptimizedDashboardDataOptions = {},
) {
  const { enabled = !!userId, initialPageSize = 3, pageSize = 8 } = options;

  const isOnline = typeof navigator === 'undefined' ? true : navigator.onLine;
  const queryEnabled = enabled && isOnline && !!userId;

  const documentsQuery = useInfiniteQuery({
    queryKey: ['dashboardDocuments', userId],
    queryFn: async ({ pageParam }) => {
      
      if (!userId) {
        console.warn('No userId provided to query function');
        return { documents: [], hasMore: false, lastDocId: undefined };
      }

      try {
        const size = pageParam === undefined ? initialPageSize : pageSize;
        const result = await getUserDocumentsPaginated(userId, size, pageParam);
        

        // Ensure the result has the expected shape
        if (!result || typeof result !== 'object') {
          console.error(
            'getUserDocumentsPaginated returned invalid result:',
            result,
          );
          return { documents: [], hasMore: false, lastDocId: undefined };
        }

        // If result is an array, wrap it in the expected object structure
        if (Array.isArray(result)) {
          console.warn('Result is an array, wrapping in object structure');
          return {
            documents: result,
            hasMore: false,
            lastDocId: undefined,
          };
        }

        // Ensure result has required properties with explicit validation
        const normalizedResult = {
          documents: Array.isArray(result.documents) ? result.documents : [],
          hasMore: Boolean(result.hasMore),
          lastDocId: result.lastDocId || undefined,
        };
        
        return normalizedResult;
      } catch (error) {
        console.error('Error in getUserDocumentsPaginated:', error);
        return { documents: [], hasMore: false, lastDocId: undefined };
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      try {
        // Extra defensive checks
        if (!lastPage) {
          console.warn('getNextPageParam: lastPage is null/undefined');
          return undefined;
        }

        // If lastPage is somehow an array (shouldn't happen with our queryFn)
        if (Array.isArray(lastPage)) {
          console.warn('getNextPageParam received array instead of object');
          return undefined;
        }

        // Check for expected shape
        if (
          typeof lastPage !== 'object' ||
          lastPage === null ||
          !('hasMore' in lastPage)
        ) {
          console.warn('getNextPageParam: invalid lastPage structure:', lastPage);
          return undefined;
        }

        // Additional safety check for hasMore property
        if (typeof lastPage.hasMore !== 'boolean') {
          console.warn(
            'getNextPageParam: hasMore is not a boolean:',
            lastPage.hasMore,
          );
          return undefined;
        }

        return lastPage.hasMore ? lastPage.lastDocId : undefined;
      } catch (error) {
        console.error('Error in getNextPageParam:', error);
        return undefined;
      }
    },
    enabled: queryEnabled && typeof userId === 'string' && userId.length > 0,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    initialPageParam: undefined,
    getPreviousPageParam: () => undefined,
    placeholderData: queryEnabled ? {
      pages: [{ documents: [], hasMore: false, lastDocId: undefined }],
      pageParams: [undefined],
    } : undefined,
  });

  const foldersQuery = useQuery({
    queryKey: ['dashboardFolders', userId],
    queryFn: () => (userId ? getUserFolders(userId) : Promise.resolve([])),
    enabled: queryEnabled && documentsQuery.data !== undefined,
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const paymentsQuery = useQuery({
    queryKey: ['dashboardPayments', userId],
    queryFn: () => (userId ? getUserPayments(userId, 3) : Promise.resolve([])),
    enabled: queryEnabled && documentsQuery.data !== undefined,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const documents = useMemo(() => {
    
    // Return empty array if no data
    if (!documentsQuery.data) {
      return [];
    }

    // Check if pages exist and is an array
    if (
      !documentsQuery.data.pages ||
      !Array.isArray(documentsQuery.data.pages)
    ) {
      console.warn(
        'documents useMemo: pages is not a valid array:',
        documentsQuery.data,
      );
      return [];
    }

    // Safely process pages
    const result = documentsQuery.data.pages
      .filter((page): page is NonNullable<typeof page> => {
        if (!page) {
          console.warn('Found null/undefined page');
          return false;
        }

        // Handle if page is an array (backward compatibility)
        if (Array.isArray(page)) {
          console.warn(
            'Page is an array, expected object with documents property',
          );
          return false;
        }

        const isValid = (
          typeof page === 'object' &&
          'documents' in page &&
          Array.isArray(page.documents)
        );
        
        if (!isValid) {
          console.warn('Invalid page structure:', page);
        }
        
        return isValid;
      })
      .flatMap((page) => {
        const docs = page.documents || [];
        return docs;
      });
      
    return result;
  }, [documentsQuery.data]);

  const isInitialLoading = documentsQuery.isLoading;
  const isLoadingMore = documentsQuery.isFetchingNextPage;
  const hasNextPage = documentsQuery.hasNextPage || false;
  const isSecondaryLoading = foldersQuery.isLoading || paymentsQuery.isLoading;

  const loadMore = useCallback(() => {
    if (hasNextPage && !isLoadingMore && documentsQuery.status === 'success') {
      documentsQuery.fetchNextPage();
    }
  }, [hasNextPage, isLoadingMore, documentsQuery]);

  const errors = {
    documents: documentsQuery.error,
    folders: foldersQuery.error,
    payments: paymentsQuery.error,
  };

  const hasDocumentError = !!documentsQuery.error;
  const hasAnyError =
    hasDocumentError || !!foldersQuery.error || !!paymentsQuery.error;

  const getLoadingStage = () => {
    if (isInitialLoading) return 'documents';
    if (foldersQuery.isLoading) return 'folders';
    if (paymentsQuery.isLoading) return 'payments';
    return 'complete';
  };

  return {
    documents,
    folders: foldersQuery.data || [],
    payments: paymentsQuery.data || [],
    isLoading: isInitialLoading || isSecondaryLoading,
    isInitialLoading,
    isLoadingMore,
    isSecondaryLoading,
    isFetching:
      documentsQuery.isFetching ||
      foldersQuery.isFetching ||
      paymentsQuery.isFetching,
    hasNextPage,
    loadMore,
    errors,
    hasDocumentError,
    hasAnyError,
    documentsStatus: documentsQuery.status,
    foldersStatus: foldersQuery.status,
    paymentsStatus: paymentsQuery.status,
    loadingStage: getLoadingStage(),
    documentCount: documents.length,
    totalPages: documentsQuery.data?.pages?.length || 0,
    refetchDocuments: documentsQuery.refetch,
    refetchFolders: foldersQuery.refetch,
    refetchPayments: paymentsQuery.refetch,
  };
}
