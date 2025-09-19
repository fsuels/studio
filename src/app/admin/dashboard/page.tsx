// Admin dashboard page with compliance monitoring
'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  BarChart3,
  Clock,
  Database,
  FileBarChart,
  Globe,
  Loader2,
  LogOut,
  Settings,
  Shield,
  TrendingUp,
  User,
  Users,
} from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const ComplianceDashboard = dynamic(
  () => import('@/components/compliance/ComplianceDashboard'),
  {
    ssr: false,
    loading: () => <DashboardSectionSkeleton lines={7} />,
  },
);

const MarketingInsightsDashboard = dynamic(
  () => import('@/components/admin/MarketingInsightsDashboard'),
  {
    ssr: false,
    loading: () => <DashboardSectionSkeleton lines={9} />,
  },
);

const WebhookDashboard = dynamic(
  () =>
    import('@/components/admin/webhooks/WebhookDashboard').then(
      module => module.WebhookDashboard,
    ),
  {
    ssr: false,
    loading: () => <DashboardSectionSkeleton lines={10} />,
  },
);

const ReportBuilder = dynamic(
  () =>
    import('@/components/admin/reports/ReportBuilder').then(
      module => module.ReportBuilder,
    ),
  {
    ssr: false,
    loading: () => <DashboardSectionSkeleton lines={12} />,
  },
);

interface AdminUser {
  username: string;
  role: string;
  loginTime: string;
}

type TabValue =
  | 'compliance'
  | 'experiments'
  | 'customer360'
  | 'roleops'
  | 'marketing'
  | 'webhooks'
  | 'reports'
  | 'waitlist'
  | 'regulations'
  | 'settings';

interface TabDefinition {
  value: TabValue;
  label: string;
  description?: string;
  icon: LucideIcon;
  panelTitle?: string;
  panelDescription?: string;
}

const TAB_DEFINITIONS: readonly TabDefinition[] = [
  {
    value: 'compliance',
    label: 'Compliance',
    description: 'Risk tracking & waitlists',
    icon: BarChart3,
  },
  {
    value: 'experiments',
    label: 'A/B Tests',
    description: 'Experiments & lift',
    icon: TrendingUp,
    panelTitle: 'A/B Testing & Experimentation',
    panelDescription:
      'Optimize conversion rates with statistical experiments and Bayesian impact analysis.',
  },
  {
    value: 'customer360',
    label: 'Customer 360',
    description: 'Lifecycle intelligence',
    icon: Users,
    panelTitle: 'Customer 360 Intelligence',
    panelDescription:
      'Complete customer insights with timeline, orders, support tickets, NPS, and churn risk analysis.',
  },
  {
    value: 'roleops',
    label: 'Role Ops',
    description: 'Permissions & toggles',
    icon: Shield,
    panelTitle: 'Team & Role Operations',
    panelDescription:
      'Manage user roles, permissions, feature toggles, and impersonation capabilities.',
  },
  {
    value: 'marketing',
    label: 'Marketing',
    description: 'Campaign analytics',
    icon: TrendingUp,
  },
  {
    value: 'webhooks',
    label: 'Webhooks',
    description: 'Integrations & logs',
    icon: Globe,
  },
  {
    value: 'reports',
    label: 'Reports',
    description: 'Custom reporting',
    icon: FileBarChart,
  },
  {
    value: 'waitlist',
    label: 'Waitlist',
    description: 'Expansion pipeline',
    icon: Users,
    panelTitle: 'Waitlist Management',
    panelDescription:
      'Manage signups from restricted states and track expansion opportunities.',
  },
  {
    value: 'regulations',
    label: 'Regulations',
    description: 'State policies',
    icon: Database,
    panelTitle: 'State Regulations Editor',
    panelDescription:
      'Update state risk classifications and compliance requirements.',
  },
  {
    value: 'settings',
    label: 'Settings',
    description: 'System preferences',
    icon: Settings,
    panelTitle: 'System Settings',
    panelDescription:
      'Configure compliance thresholds, monitoring alerts, and system preferences.',
  },
] as const;

const DEFAULT_TAB: TabValue = 'compliance';

type PlaceholderTab = Extract<
  TabValue,
  'experiments' | 'customer360' | 'roleops' | 'waitlist' | 'regulations' | 'settings'
>;

interface PlaceholderFeature {
  title: string;
  description: string;
  icon?: LucideIcon;
}

interface PlaceholderConfig {
  description: string;
  features?: PlaceholderFeature[];
  cta?: { label: string; href: string; target?: '_blank' | '_self' };
}

const PLACEHOLDER_CONTENT: Record<PlaceholderTab, PlaceholderConfig> = {
  experiments: {
    description:
      'Advanced experimentation tooling with statistical significance testing, Bayesian lifts, and revenue impact measurement.',
    features: [
      {
        title: 'Statistical Analysis',
        description:
          'Bayesian and frequentist analysis with automatic winner detection and confidence intervals.',
        icon: BarChart3,
      },
      {
        title: 'Revenue Impact',
        description:
          'Track incremental revenue impact with projected monthly and annual uplift calculations.',
        icon: TrendingUp,
      },
      {
        title: 'Funnel Integration',
        description:
          'Connect experiments to funnel analytics, cohorts, and conversion tracking for always-on insights.',
        icon: Settings,
      },
    ],
    cta: {
      label: 'Open experiments workspace',
      href: '/admin/experiments',
    },
  },
  customer360: {
    description:
      'Advanced customer intelligence dashboard with timeline views, churn risk analysis, and lifetime value tracking.',
    features: [
      {
        title: 'Customer Timeline',
        description:
          'Orders, support tickets, NPS responses, and document interactions in a unified timeline.',
        icon: Clock,
      },
      {
        title: 'Churn Risk Analysis',
        description:
          'AI-powered churn prediction with health scores and proactive intervention recommendations.',
        icon: AlertTriangle,
      },
      {
        title: 'LTV & Plan Tiers',
        description:
          'Lifetime value calculations with upgrade signals and plan tier opportunities.',
        icon: TrendingUp,
      },
    ],
    cta: {
      label: 'Launch Customer 360',
      href: '/admin/customer-360',
    },
  },
  roleops: {
    description:
      'Complete role-based access control with user impersonation, feature toggles, and team management.',
    features: [
      {
        title: 'Role-Based Permissions',
        description:
          'Granular access controls and permission sets for every internal team.',
        icon: Shield,
      },
      {
        title: 'User Impersonation',
        description:
          'Login-as tooling for support teams with audit logs and safeguards.',
        icon: User,
      },
      {
        title: 'Feature Toggles',
        description:
          'Targeted feature flags for controlled rollouts and experiment cohorts.',
        icon: Settings,
      },
    ],
    cta: {
      label: 'Open role operations',
      href: '/admin/role-operations',
    },
  },
  waitlist: {
    description:
      'Waitlist management interface covering signup analytics, priority management, and notification systems.',
    features: [
      {
        title: 'Signup Analytics',
        description:
          'Monitor waitlist growth across restricted states to sequence market expansion.',
        icon: Users,
      },
      {
        title: 'Priority Management',
        description:
          'Use urgency signals to focus outreach on high-value applicants first.',
        icon: TrendingUp,
      },
      {
        title: 'Automated Notifications',
        description:
          'Trigger onboarding nudges and status updates as states unlock or regulations change.',
        icon: Clock,
      },
    ],
  },
  regulations: {
    description:
      'State regulations editor for maintaining risk classifications and compliance requirements.',
    features: [
      {
        title: 'Risk Classifications',
        description: 'Adjust state-level risk tiers with built-in version history.',
        icon: Shield,
      },
      {
        title: 'Requirement Updates',
        description:
          'Capture statutory requirements, source documentation, and review context.',
        icon: Database,
      },
      {
        title: 'Collaboration',
        description:
          'Coordinate legal and compliance reviews before publishing regulatory changes.',
        icon: Globe,
      },
    ],
  },
  settings: {
    description:
      'System settings interface for compliance thresholds, alert configurations, and API preferences.',
    features: [
      {
        title: 'Compliance Thresholds',
        description:
          'Tune automated alerts and tolerance levels per jurisdiction or segment.',
        icon: AlertTriangle,
      },
      {
        title: 'Notification Routing',
        description:
          'Configure escalation paths, on-call rotations, and incident communication.',
        icon: Globe,
      },
      {
        title: 'API Controls',
        description:
          'Manage credentials, webhook secrets, and environment-wide preferences.',
        icon: Settings,
      },
    ],
  },
};

interface HighlightCard {
  label: string;
  value: string;
  icon: LucideIcon;
}

export default function AdminDashboardPage() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabValue>(DEFAULT_TAB);
  const router = useRouter();

  const checkAuthentication = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/admin/auth', { signal });
        if (!response.ok) {
          throw new Error('Failed to verify authentication');
        }

        const data = await response.json();
        if (signal?.aborted) return;

        if (data.authenticated) {
          setAdminUser(data.user);
        } else {
          router.push('/admin');
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          return;
        }

        setError('Failed to verify authentication');
        router.push('/admin');
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [router],
  );

  useEffect(() => {
    const controller = new AbortController();
    void checkAuthentication(controller.signal);

    return () => controller.abort();
  }, [checkAuthentication]);

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'logout',
          username: adminUser?.username,
        }),
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      router.push('/admin');
    } catch (err) {
      console.error('Logout failed', err);
      setError('Logout failed. Please try again.');
    } finally {
      setLoggingOut(false);
    }
  }, [adminUser?.username, router]);

  const sessionStartTime = useMemo(() => {
    if (!adminUser?.loginTime) {
      return 'Just now';
    }

    const parsed = new Date(adminUser.loginTime);
    if (Number.isNaN(parsed.getTime())) {
      return 'Just now';
    }

    return parsed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [adminUser?.loginTime]);

  const sessionHighlights = useMemo<HighlightCard[]>(
    () =>
      adminUser
        ? [
            { label: 'Current Role', value: adminUser.role, icon: Shield },
            { label: 'Session Started', value: sessionStartTime, icon: Clock },
            { label: 'Environment', value: 'Live production', icon: Globe },
          ]
        : [],
    [adminUser, sessionStartTime],
  );

  const activeTabMeta = useMemo(
    () => TAB_DEFINITIONS.find(tab => tab.value === activeTab),
    [activeTab],
  );

  const renderTabContent = useCallback((tab: TabValue) => {
    if (isPlaceholderTab(tab)) {
      return <PlaceholderSection config={PLACEHOLDER_CONTENT[tab]} />;
    }

    switch (tab) {
      case 'compliance':
        return <ComplianceDashboard />;
      case 'marketing':
        return <MarketingInsightsDashboard />;
      case 'webhooks':
        return <WebhookDashboard />;
      case 'reports':
        return <ReportBuilder />;
      default:
        return null;
    }
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="space-y-4 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Checking admin credentials…</p>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Authentication required. Redirecting to login…
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-white">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Shield className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Admin Console
              </p>
              <h1 className="text-lg font-semibold text-slate-900">
                123LegalDoc Control Center
              </h1>
            </div>
            <Badge
              variant="outline"
              className="hidden border-green-200 bg-green-50 text-xs font-medium tracking-wide text-green-700 sm:inline-flex"
            >
              Live
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right text-sm sm:block">
              <div className="flex items-center justify-end gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold text-slate-900">
                  {adminUser.username}
                </span>
                <Badge variant="secondary" className="uppercase">
                  {adminUser.role}
                </Badge>
              </div>
              <div className="mt-1 flex items-center justify-end gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Since {sessionStartTime}</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="mr-2 h-4 w-4" />
              )}
              {loggingOut ? 'Signing out…' : 'Sign out'}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {sessionHighlights.length > 0 && (
          <section className="grid gap-4 sm:grid-cols-3">
            {sessionHighlights.map(highlight => (
              <Card
                key={highlight.label}
                className="border-none bg-white/80 shadow-sm ring-1 ring-slate-200"
              >
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <highlight.icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {highlight.label}
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      {highlight.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        )}

        <div aria-live="polite" className="sr-only">
          {activeTabMeta ? `Viewing ${activeTabMeta.label} panel` : ''}
        </div>

        <Tabs
          value={activeTab}
          onValueChange={value => setActiveTab(value as TabValue)}
          className="space-y-6"
        >
          <TabsList
            aria-label="Admin dashboard sections"
            className="flex w-full flex-wrap justify-start gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white/80 p-2 text-muted-foreground shadow-sm"
          >
            {TAB_DEFINITIONS.map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  'group flex min-w-[140px] flex-1 basis-[140px] items-center gap-3 rounded-xl border border-transparent bg-transparent px-3 py-2 text-left text-sm font-medium transition sm:min-w-[160px]',
                  'hover:border-slate-200 hover:bg-slate-100/60 data-[state=active]:border-primary/30 data-[state=active]:bg-primary/10 data-[state=active]:text-primary',
                )}
              >
                <tab.icon className="h-4 w-4 shrink-0 opacity-80 transition group-data-[state=active]:opacity-100" />
                <div className="flex flex-col">
                  <span>{tab.label}</span>
                  {tab.description ? (
                    <span className="hidden text-xs font-normal text-muted-foreground/80 lg:inline">
                      {tab.description}
                    </span>
                  ) : null}
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {TAB_DEFINITIONS.map(tab => (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className="space-y-6"
            >
              {tab.panelTitle ? (
                <PanelIntro
                  title={tab.panelTitle}
                  description={tab.panelDescription}
                />
              ) : null}
              {renderTabContent(tab.value)}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}

function PanelIntro({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-1">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
        {title}
      </h2>
      {description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

function PlaceholderSection({ config }: { config: PlaceholderConfig }) {
  return (
    <Card className="border border-dashed border-slate-200 bg-gradient-to-br from-white via-white to-slate-50/80 shadow-sm">
      <CardContent className="space-y-5 p-6">
        <p className="text-sm text-muted-foreground">{config.description}</p>

        {config.features && config.features.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {config.features.map(feature => (
              <div
                key={feature.title}
                className="flex h-full flex-col gap-2 rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm"
              >
                {feature.icon ? (
                  <feature.icon className="h-4 w-4 text-primary" />
                ) : null}
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-900">
                    {feature.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {config.cta ? (
          <div className="pt-2">
            <Button
              onClick={() => window.open(config.cta?.href, config.cta?.target ?? '_blank')}
            >
              {config.cta.label}
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function DashboardSectionSkeleton({ lines = 6 }: { lines?: number }) {
  return (
    <Card className="border border-dashed border-slate-200 bg-white/70 shadow-sm">
      <CardContent className="space-y-4 p-6">
        <Skeleton className="h-6 w-40" />
        <div className="space-y-3">
          {Array.from({ length: lines }).map((_, index) => (
            <Skeleton key={index} className="h-4 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function isPlaceholderTab(tab: TabValue): tab is PlaceholderTab {
  return (
    tab === 'experiments' ||
    tab === 'customer360' ||
    tab === 'roleops' ||
    tab === 'waitlist' ||
    tab === 'regulations' ||
    tab === 'settings'
  );
}
