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
  const {
    enabled = !!userId,
    initialPageSize = 3,
    pageSize = 8,
  } = options;

  const isOnline = typeof navigator === 'undefined' ? true : navigator.onLine;
  const queryEnabled = enabled && isOnline && !!userId;

  const documentsQuery = useInfiniteQuery({
    queryKey: ['dashboardDocuments', userId],
    queryFn: async ({ pageParam }) => {
      if (!userId)
        return { documents: [], hasMore: false, lastDocId: undefined };
      const size = pageParam === undefined ? initialPageSize : pageSize;
      return getUserDocumentsPaginated(userId, size, pageParam);
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.lastDocId : undefined,
    enabled: queryEnabled,
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    initialPageParam: undefined,
  });

  const foldersQuery = useQuery({
    queryKey: ['dashboardFolders', userId],
    queryFn: () => (userId ? getUserFolders(userId) : Promise.resolve([])),
    enabled: queryEnabled && documentsQuery.data !== undefined,
    staleTime: 10 * 60 * 1000,
    cacheTime: 20 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const paymentsQuery = useQuery({
    queryKey: ['dashboardPayments', userId],
    queryFn: () => (userId ? getUserPayments(userId, 3) : Promise.resolve([])),
    enabled: queryEnabled && documentsQuery.data !== undefined,
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const documents = useMemo(
    () => documentsQuery.data?.pages.flatMap((p) => p.documents) || [],
    [documentsQuery.data],
  );

  const isInitialLoading = documentsQuery.isLoading;
  const isLoadingMore = documentsQuery.isFetchingNextPage;
  const hasNextPage = documentsQuery.hasNextPage;
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
    isInitialLoading,
    isLoadingMore,
    isSecondaryLoading,
    isFetching:
      documentsQuery.isFetching ||
      foldersQuery.isFetching ||
      paymentsQuery.isFetching,
    hasNextPage: !!hasNextPage,
    loadMore,
    errors,
    hasDocumentError,
    hasAnyError,
    documentsStatus: documentsQuery.status,
    foldersStatus: foldersQuery.status,
    paymentsStatus: paymentsQuery.status,
    loadingStage: getLoadingStage(),
    documentCount: documents.length,
    totalPages: documentsQuery.data?.pages.length || 0,
    refetchDocuments: documentsQuery.refetch,
    refetchFolders: foldersQuery.refetch,
    refetchPayments: paymentsQuery.refetch,
  };
}
