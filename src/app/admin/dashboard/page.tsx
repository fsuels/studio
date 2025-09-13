// Admin dashboard page with compliance monitoring
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// Load non-default tabs lazily to keep initial JS small
const ComplianceDashboard = dynamic(
  () => import('@/components/compliance/ComplianceDashboard'),
  { ssr: false, loading: () => null },
);
import {
  LogOut,
  Shield,
  User,
  Clock,
  Loader2,
  Settings,
  Database,
  BarChart3,
  Users,
  AlertTriangle,
  TrendingUp,
  Globe,
  FileBarChart,
} from 'lucide-react';
const MarketingInsightsDashboard = dynamic(
  () => import('@/components/admin/MarketingInsightsDashboard'),
  { ssr: false, loading: () => null },
);
const WebhookDashboard = dynamic(
  () => import('@/components/admin/webhooks/WebhookDashboard').then(m => m.WebhookDashboard),
  { ssr: false, loading: () => null },
);
const ReportBuilder = dynamic(
  () => import('@/components/admin/reports/ReportBuilder').then(m => m.ReportBuilder),
  { ssr: false, loading: () => null },
);

interface AdminUser {
  username: string;
  role: string;
  loginTime: string;
}

export default function AdminDashboardPage() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const checkAuthentication = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/auth');
      const data = await response.json();

      if (data.authenticated) {
        setAdminUser(data.user);
      } else {
        router.push('/admin');
      }
    } catch (_err) {
      setError('Failed to verify authentication');
      router.push('/admin');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'logout',
          username: adminUser?.username,
        }),
      });

      router.push('/admin');
    } catch (_err) {
      setError('Logout failed');
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Authentication required. Redirecting to login...
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Logo & Title */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-semibold">123LegalDoc Admin</h1>
              </div>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                LIVE SYSTEM
              </Badge>
            </div>

            {/* Right side - User info & Logout */}
            <div className="flex items-center gap-4">
              <div className="text-right text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{adminUser.username}</span>
                  <Badge variant="secondary">{adminUser.role}</Badge>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Clock className="h-3 w-3" />
                  <span>
                    Since {new Date(adminUser.loginTime).toLocaleTimeString()}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <LogOut className="h-4 w-4 mr-2" />
                )}
                {loggingOut ? 'Signing Out...' : 'Sign Out'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs defaultValue="compliance" className="space-y-6">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-10">
            <TabsTrigger value="compliance" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Compliance
            </TabsTrigger>
            <TabsTrigger
              value="experiments"
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              A/B Tests
            </TabsTrigger>
            <TabsTrigger
              value="customer360"
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Customer 360
            </TabsTrigger>
            <TabsTrigger value="roleops" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Role Ops
            </TabsTrigger>
            <TabsTrigger value="marketing" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Marketing
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Webhooks
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileBarChart className="h-4 w-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="waitlist" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Waitlist
            </TabsTrigger>
            <TabsTrigger
              value="regulations"
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              Regulations
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Real-Time Compliance Monitoring
              </h2>
              <p className="text-muted-foreground">
                Monitor UPL compliance across all 50 states with real-time
                analytics and alerts.
              </p>
            </div>
            <ComplianceDashboard />
          </TabsContent>

          {/* A/B Testing Experiments Tab */}
          <TabsContent value="experiments" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                A/B Testing & Experimentation
              </h2>
              <p className="text-muted-foreground">
                Optimize conversion rates with statistical experiments and
                Bayesian impact analysis.
              </p>
            </div>
            <ExperimentsManagement />
          </TabsContent>

          {/* Customer 360 Tab */}
          <TabsContent value="customer360" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Customer 360 Intelligence
              </h2>
              <p className="text-muted-foreground">
                Complete customer insights with timeline, orders, support
                tickets, NPS, and churn risk analysis.
              </p>
            </div>
            <Customer360Management />
          </TabsContent>

          {/* Role Operations Tab */}
          <TabsContent value="roleops" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Team & Role Operations
              </h2>
              <p className="text-muted-foreground">
                Manage user roles, permissions, feature toggles, and
                impersonation capabilities.
              </p>
            </div>
            <RoleOperationsManagement />
          </TabsContent>

          {/* Marketing Insights Tab */}
          <TabsContent value="marketing" className="space-y-6">
            <MarketingInsightsDashboard />
          </TabsContent>

          {/* Webhooks Tab */}
          <TabsContent value="webhooks" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Webhook Management</h2>
              <p className="text-muted-foreground">
                Manage webhook subscriptions, monitor delivery status, and view
                event logs for real-time integrations.
              </p>
            </div>
            <WebhookDashboard />
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Report Builder</h2>
              <p className="text-muted-foreground">
                Create custom reports and visualizations from your data with
                low-code SQL→chart builder.
              </p>
            </div>
            <ReportBuilder />
          </TabsContent>

          {/* Waitlist Tab */}
          <TabsContent value="waitlist" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Waitlist Management</h2>
              <p className="text-muted-foreground">
                Manage signups from restricted states and track expansion
                opportunities.
              </p>
            </div>
            <WaitlistManagement />
          </TabsContent>

          {/* Regulations Tab */}
          <TabsContent value="regulations" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                State Regulations Editor
              </h2>
              <p className="text-muted-foreground">
                Update state risk classifications and compliance requirements.
              </p>
            </div>
            <RegulationsEditor />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">System Settings</h2>
              <p className="text-muted-foreground">
                Configure compliance thresholds, monitoring alerts, and system
                preferences.
              </p>
            </div>
            <SystemSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// Placeholder components for other tabs
function ExperimentsManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>A/B Testing & Conversion Optimization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Advanced experimentation platform with statistical significance
            testing, Bayesian analysis, and revenue impact measurement.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">
                Statistical Analysis
              </h3>
              <p className="text-sm text-muted-foreground">
                Bayesian and Frequentist analysis with automatic winner
                detection and confidence intervals.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Revenue Impact</h3>
              <p className="text-sm text-muted-foreground">
                Real-time revenue tracking with estimated monthly and annual
                impact calculations.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Funnel Integration</h3>
              <p className="text-sm text-muted-foreground">
                Seamless integration with existing funnel analytics and
                conversion tracking.
              </p>
            </div>
          </div>
          <div className="pt-4">
            <Button
              onClick={() => window.open('/admin/experiments', '_blank')}
              className="w-full"
            >
              Open A/B Testing Dashboard
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function WaitlistManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Waitlist Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Waitlist management interface will be displayed here. This includes
          signup analytics, priority management, and notification systems.
        </p>
      </CardContent>
    </Card>
  );
}

function RegulationsEditor() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>State Regulations Database</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          State regulations editor will be displayed here. This includes risk
          level adjustments, requirement updates, and source documentation.
        </p>
      </CardContent>
    </Card>
  );
}

function Customer360Management() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer 360 Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Advanced customer intelligence dashboard with timeline views, churn
            risk analysis, and lifetime value tracking.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Customer Timeline</h3>
              <p className="text-sm text-muted-foreground">
                Complete customer journey with orders, support tickets, NPS
                responses, and document interactions.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">
                Churn Risk Analysis
              </h3>
              <p className="text-sm text-muted-foreground">
                AI-powered churn prediction with health scores and proactive
                intervention recommendations.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">LTV & Plan Tiers</h3>
              <p className="text-sm text-muted-foreground">
                Lifetime value calculations with plan tier badges and upgrade
                opportunities.
              </p>
            </div>
          </div>
          <div className="pt-4">
            <Button
              onClick={() => window.open('/admin/customer-360', '_blank')}
              className="w-full"
            >
              Open Customer 360 Dashboard
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RoleOperationsManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team & Role Operations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Complete role-based access control with user impersonation, feature
            toggles, and team management.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">
                Role-Based Permissions
              </h3>
              <p className="text-sm text-muted-foreground">
                Manage user roles, permissions, and access controls with
                granular security settings.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">User Impersonation</h3>
              <p className="text-sm text-muted-foreground">
                Login-as functionality for support teams with full audit trails
                and security controls.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Feature Toggles</h3>
              <p className="text-sm text-muted-foreground">
                Role-based feature flags for controlled rollouts and A/B testing
                capabilities.
              </p>
            </div>
          </div>
          <div className="pt-4">
            <Button
              onClick={() => window.open('/admin/role-operations', '_blank')}
              className="w-full"
            >
              Open Role Operations Dashboard
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SystemSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          System settings interface will be displayed here. This includes
          compliance thresholds, alert configurations, and API settings.
        </p>
      </CardContent>
    </Card>
  );
}
