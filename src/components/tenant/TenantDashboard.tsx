'use client';

import React, { useState, useEffect } from 'react';
import { Tenant } from '@/types/tenant';
import { useTenant } from '@/contexts/TenantContext';
import {
  useTenantBranding,
  useCompanyInfo,
} from '@/contexts/TenantBrandingContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Users,
  Clock,
  TrendingUp,
  Star,
  ArrowRight,
  BookOpen,
  MessageCircle,
  Shield,
} from 'lucide-react';

interface TenantDashboardProps {
  tenant: Tenant;
}

export function TenantDashboard({ tenant }: TenantDashboardProps) {
  const { tenantUser, hasPermission } = useTenant();
  const { companyName } = useCompanyInfo();
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [stats, setStats] = useState({
    totalDocuments: 0,
    documentsThisMonth: 0,
    teamMembers: 0,
    templatesAvailable: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, [tenant.id]);

  const loadDashboardData = async () => {
    try {
      const [documentsRes, statsRes] = await Promise.all([
        fetch(`/api/tenants/${tenant.id}/documents/recent`),
        fetch(`/api/tenants/${tenant.id}/stats`),
      ]);

      if (documentsRes.ok) {
        const documents = await documentsRes.json();
        setRecentDocuments(documents);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const quickActions = [
    {
      title: 'Create New Document',
      description: 'Start with a template or create from scratch',
      icon: Plus,
      href: `/tenant/${tenant.slug}/documents/create`,
      color: 'bg-blue-500',
    },
    {
      title: 'Browse Templates',
      description: 'Explore our library of legal templates',
      icon: BookOpen,
      href: `/tenant/${tenant.slug}/templates`,
      color: 'bg-green-500',
    },
    ...(hasPermission('tenant.manage_users')
      ? [
          {
            title: 'Invite Team Members',
            description: 'Add colleagues to collaborate',
            icon: Users,
            href: `/tenant/${tenant.slug}/team/invite`,
            color: 'bg-purple-500',
          },
        ]
      : []),
    {
      title: 'Get Support',
      description: 'Chat with our legal document experts',
      icon: MessageCircle,
      href: `/tenant/${tenant.slug}/support`,
      color: 'bg-orange-500',
    },
  ];

  const popularTemplates = [
    { name: 'Non-Disclosure Agreement', category: 'Business', uses: 1247 },
    { name: 'Employment Contract', category: 'HR', uses: 892 },
    { name: 'Service Agreement', category: 'Business', uses: 756 },
    { name: 'Rental Agreement', category: 'Real Estate', uses: 634 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to {companyName}
        </h1>
        <p className="text-lg text-gray-600">
          {tenantUser
            ? `Create professional legal documents for your business needs.`
            : "You've been invited to collaborate on legal documents. Sign in to get started."}
        </p>
      </div>

      {/* Stats Overview */}
      {tenantUser && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Documents
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDocuments}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.documentsThisMonth} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Team Members
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.teamMembers}</div>
              <p className="text-xs text-muted-foreground">
                Active collaborators
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Templates</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.templatesAvailable}
              </div>
              <p className="text-xs text-muted-foreground">Ready to use</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Success Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98%</div>
              <p className="text-xs text-muted-foreground">
                Document completion
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div
                    className={`inline-flex p-2 rounded-lg ${action.color} w-fit`}
                  >
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-base">{action.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {action.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Documents */}
        {tenantUser && (
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Documents
              </h2>
              <Link href={`/tenant/${tenant.slug}/documents`}>
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {recentDocuments.length > 0 ? (
              <div className="space-y-3">
                {recentDocuments.slice(0, 5).map((doc: any, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-sm transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <FileText className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {doc.title}
                            </h3>
                            <p className="text-sm text-gray-500">{doc.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              doc.status === 'completed'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {doc.status}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(doc.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No documents yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Get started by creating your first legal document.
                  </p>
                  <Link href={`/tenant/${tenant.slug}/documents/create`}>
                    <Button>
                      Create Document
                      <Plus className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Popular Templates */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Popular Templates
          </h2>
          <Card>
            <CardContent className="p-0">
              {popularTemplates.map((template, index) => (
                <div
                  key={index}
                  className="p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {template.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {template.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="h-3 w-3 mr-1" />
                        {template.uses}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Security & Trust */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <Shield className="h-5 w-5 mr-2 text-green-600" />
                Security & Trust
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Bank-level encryption
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Attorney-reviewed templates
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  GDPR compliant
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Audit trail tracking
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
