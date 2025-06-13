import { useQuery } from '@tanstack/react-query';
import {
  getUserDocuments,
  getUserPayments,
  getUserFolders,
} from '@/lib/firestore/dashboardData';

export function useDashboardData(
  userId?: string,
  options?: { enabled?: boolean },
) {
  const isOnline =
    typeof navigator === 'undefined' ? true : navigator.onLine;
  const enabled = (options?.enabled ?? !!userId) && isOnline;

  const docsQuery = useQuery({
    queryKey: ['dashboardDocuments', userId],
    queryFn: () => (userId ? getUserDocuments(userId) : Promise.resolve([])),
    enabled,
  });

  const paymentsQuery = useQuery({
    queryKey: ['dashboardPayments', userId],
    queryFn: () => (userId ? getUserPayments(userId) : Promise.resolve([])),
    enabled,
  });

  const foldersQuery = useQuery({
    queryKey: ['dashboardFolders', userId],
    queryFn: () => (userId ? getUserFolders(userId) : Promise.resolve([])),
    enabled,
  });

  return {
    documents: docsQuery.data || [],
    payments: paymentsQuery.data || [],
    folders: foldersQuery.data || [],
    isLoading: docsQuery.isLoading || paymentsQuery.isLoading || foldersQuery.isLoading,
    isFetching: docsQuery.isFetching || paymentsQuery.isFetching || foldersQuery.isFetching,
    error: docsQuery.error || paymentsQuery.error || foldersQuery.error,
  };
}
