// A/B Testing & Experimentation Management Page
import { requireAdminAuth } from '@/lib/admin-auth';
import { ExperimentDashboard } from '@/components/admin/ExperimentDashboard';

export default async function ExperimentsPage() {
  await requireAdminAuth();

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          A/B Testing & Experimentation
        </h1>
        <p className="text-muted-foreground">
          Manage conversion optimization experiments with statistical analysis
          and revenue impact measurement.
        </p>
      </div>
      <ExperimentDashboard />
    </div>
  );
}

export const metadata = {
  title: 'A/B Testing & Experiments | Admin Dashboard',
  description:
    'Manage conversion optimization experiments with statistical analysis and Bayesian impact measurement',
};
