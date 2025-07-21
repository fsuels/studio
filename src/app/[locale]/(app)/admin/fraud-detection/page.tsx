// Advanced Fraud & Risk Scoring Page
import { requireAdminAuth } from '@/lib/admin-auth';
import { LazyFraudDetectionDashboard } from '@/components/admin/LazyAdmin';

export default async function FraudDetectionPage() {
  await requireAdminAuth();

  return <LazyFraudDetectionDashboard />;
}

export const metadata = {
  title: 'Fraud Detection & Risk Scoring | Admin Dashboard',
  description:
    'Advanced fraud detection with velocity checks, device fingerprinting, and chargeback prediction',
};
