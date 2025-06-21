// Advanced Fraud & Risk Scoring Page
import { requireAdminAuth } from '@/lib/admin-auth';
import FraudDetectionDashboard from '@/components/admin/FraudDetectionDashboard';

export default async function FraudDetectionPage() {
  await requireAdminAuth();

  return (
    <div className="container mx-auto py-6">
      <FraudDetectionDashboard />
    </div>
  );
}

export const metadata = {
  title: 'Fraud Detection & Risk Scoring | Admin Dashboard',
  description:
    'Advanced fraud detection with velocity checks, device fingerprinting, and chargeback prediction',
};
