'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getUserDocuments,
  getUserPayments,
  getUserFolders,
} from '@/lib/firestore/dashboardData';

export function useDashboardData(
  userId?: string,
  options?: { enabled?: boolean; priorityLoad?: boolean },
) {
  const isOnline = typeof navigator === 'undefined' ? true : navigator.onLine;
  const enabled = (options?.enabled ?? !!userId) && isOnline;
  const priorityLoad = options?.priorityLoad ?? true;

  const documentsQuery = useQuery({
    queryKey: ['dashboardDocuments', userId],
    queryFn: () =>
      userId ? getUserDocuments(userId, 5) : Promise.resolve([]),
    enabled,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
    retryDelay: 1000,
  });

  const foldersQuery = useQuery({
    queryKey: ['dashboardFolders', userId],
    queryFn: () => (userId ? getUserFolders(userId) : Promise.resolve([])),
    enabled: enabled && (priorityLoad ? documentsQuery.isSuccess : true),
    staleTime: 15 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });

  const paymentsQuery = useQuery({
    queryKey: ['dashboardPayments', userId],
    queryFn: () =>
      userId ? getUserPayments(userId, 3) : Promise.resolve([]),
    enabled: enabled && (priorityLoad ? documentsQuery.isSuccess : true),
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });

  const isPrimaryLoading = documentsQuery.isLoading;
  const isSecondaryLoading =
    paymentsQuery.isLoading || foldersQuery.isLoading;
  const isFetching =
    documentsQuery.isFetching ||
    paymentsQuery.isFetching ||
    foldersQuery.isFetching;

  return {
    documents: documentsQuery.data || [],
    payments: paymentsQuery.data || [],
    folders: foldersQuery.data || [],
    isLoading: isPrimaryLoading,
    isSecondaryLoading,
    isFetching,
    error:
      documentsQuery.error || paymentsQuery.error || foldersQuery.error,
    documentsStatus: documentsQuery.status,
    paymentsStatus: paymentsQuery.status,
    foldersStatus: foldersQuery.status,
  };
}
