'use client';

import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { getUserDocuments, getUserPayments, getUserFolders } from '@/lib/firestore/dashboardData';

interface UseOptimizedDashboardDataOptions {
  enabled?: boolean;
  initialPageSize?: number;
  pageSize?: number;
}

export function useOptimizedDashboardData(
  userId?: string,
  options: UseOptimizedDashboardDataOptions = {},
) {
  const { enabled = !!userId } = options;

  const isOnline = typeof navigator === 'undefined' ? true : navigator.onLine;
  const queryEnabled = enabled && isOnline && !!userId;

  const documentsQuery = useQuery({
    queryKey: ['dashboardDocuments', userId],
    queryFn: async () => {
      if (!userId) {
        return [];
      }
      return await getUserDocuments(userId, 50);
    },
    enabled: queryEnabled && typeof userId === 'string' && userId.length > 0,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
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
    return documentsQuery.data || [];
  }, [documentsQuery.data]);

  const isInitialLoading = documentsQuery.isLoading;
  const isLoadingMore = false; // No pagination for now
  const hasNextPage = false; // No pagination for now
  const isSecondaryLoading = foldersQuery.isLoading || paymentsQuery.isLoading;

  const loadMore = useCallback(() => {
    // No pagination for now
  }, []);

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
    totalPages: 1,
    refetchDocuments: documentsQuery.refetch,
    refetchFolders: foldersQuery.refetch,
    refetchPayments: paymentsQuery.refetch,
  };
}
