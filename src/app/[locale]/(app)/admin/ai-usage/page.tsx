// AI Usage & Cost Analytics Page
import { requireAdminAuth } from '@/lib/admin-auth';
import AIUsageDashboard from '@/components/admin/AIUsageDashboard';

export default async function AIUsagePage() {
  await requireAdminAuth();

  return (
    <div className="container mx-auto py-6">
      <AIUsageDashboard />
    </div>
  );
}

export const metadata = {
  title: 'AI Usage & Cost Analytics | Admin Dashboard',
  description: 'Track AI model usage, token consumption, costs, and optimize spending',
};