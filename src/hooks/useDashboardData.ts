import { useQuery } from '@tanstack/react-query';
import {
  getUserDocuments,
  getUserPayments,
  getUserDrafts,
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

  const draftsQuery = useQuery({
    queryKey: ['dashboardDrafts', userId],
    queryFn: () => (userId ? getUserDrafts(userId) : Promise.resolve([])),
    enabled,
  });

  const paymentsQuery = useQuery({
    queryKey: ['dashboardPayments', userId],
    queryFn: () => (userId ? getUserPayments(userId) : Promise.resolve([])),
    enabled,
  });

  const parseDate = (d: any) => {
    if (!d) return 0;
    if (typeof d === 'object' && 'seconds' in d) return d.seconds * 1000;
    return new Date(d).getTime();
  };

  const documents = [...(docsQuery.data || []), ...(draftsQuery.data || [])].sort(
    (a, b) => parseDate(b.date) - parseDate(a.date),
  );

  return {
    documents,
    payments: paymentsQuery.data || [],
    isLoading:
      docsQuery.isLoading || draftsQuery.isLoading || paymentsQuery.isLoading,
    error: docsQuery.error || draftsQuery.error || paymentsQuery.error,
  };
}
