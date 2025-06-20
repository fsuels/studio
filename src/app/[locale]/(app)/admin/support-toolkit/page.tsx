// Support Toolkit admin page
import { Metadata } from 'next';
import SupportToolkitDashboard from '@/components/admin/SupportToolkitDashboard';

export const metadata: Metadata = {
  title: 'Support Toolkit - Admin Dashboard',
  description: 'Session replay, refund management, and faster issue resolution tools for customer support',
};

export default function SupportToolkitPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <SupportToolkitDashboard />
      </div>
    </div>
  );
}