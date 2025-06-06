import { useQuery } from '@tanstack/react-query';
import {
  getUserDocuments,
  getUserPayments,
} from '@/lib/firestore/dashboardData';

export function useDashboardData(
  userId?: string,
  options?: { enabled?: boolean },
) {
  const enabled = options?.enabled ?? !!userId;

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

  return {
    documents: docsQuery.data || [],
    payments: paymentsQuery.data || [],
    isLoading: docsQuery.isLoading || paymentsQuery.isLoading,
    error: docsQuery.error || paymentsQuery.error,
  };
}
