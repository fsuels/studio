// src/app/[locale]/(app)/dashboard/compliance-reports/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield,
  Download,
  FileText,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  Users,
  Database,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ComplianceReport {
  id: string;
  title: string;
  description: string;
  generatedAt: string;
  reportType: string;
  metrics: {
    totalEvents: number;
    recentEvents: number;
    weeklyEvents: number;
    uniqueUsers: number;
    eventTypeCounts: Record<string, number>;
    complianceEvents: {
      authentication: number;
      dataAccess: number;
      policyInteraction: number;
      documentOperations: number;
    };
    integrityChecks: {
      eventsWithHashes: number;
      integrityScore: number;
    };
  };
  recommendations: string[];
  complianceLevel: 'compliant' | 'partial' | 'non-compliant';
}

export default function ComplianceReportsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [report, setReport] = useState<ComplianceReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState('overview');
  const [selectedFormat, setSelectedFormat] = useState('json');

  const reportTypes = [
    {
      id: 'overview',
      name: 'Compliance Overview',
      description: 'General compliance status across all frameworks',
    },
    {
      id: 'gdpr',
      name: 'GDPR Report',
      description: 'GDPR-specific compliance analysis',
    },
    {
      id: 'ccpa',
      name: 'CCPA Report',
      description: 'California Consumer Privacy Act compliance',
    },
    {
      id: 'soc2',
      name: 'SOC 2 Report',
      description: 'SOC 2 audit trail analysis',
    },
    {
      id: 'security',
      name: 'Security Audit',
      description: 'Security events and access controls',
    },
    {
      id: 'user_activity',
      name: 'User Activity',
      description: 'User behavior and system interactions',
    },
  ];

  useEffect(() => {
    generateReport();
  }, []);

  const generateReport = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/compliance/reports?type=${selectedReportType}`,
      );
      if (response.ok) {
        const reportData = await response.json();
        setReport(reportData);
      } else {
        throw new Error('Failed to generate report');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate compliance report',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadDetailedReport = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/compliance/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportType: selectedReportType,
          format: selectedFormat,
          includeUserData: false,
        }),
      });

      if (response.ok) {
        const contentDisposition = response.headers.get('content-disposition');
        const filename = contentDisposition
          ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
          : `compliance-report-${selectedReportType}-${Date.now()}.${selectedFormat}`;

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({
          title: 'Report Downloaded',
          description: 'Detailed compliance report has been downloaded',
        });
      } else {
        throw new Error('Failed to download report');
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      toast({
        title: 'Download Failed',
        description: 'Failed to download detailed report',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getComplianceLevelColor = (level: string) => {
    switch (level) {
      case 'compliant':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'non-compliant':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplianceLevelIcon = (level: string) => {
    switch (level) {
      case 'compliant':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'partial':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'non-compliant':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />;
    }
  };

  if (isLoading && !report) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-blue-600" />
          <h1 className="text-3xl font-bold">Compliance Reports</h1>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={generateReport}
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Refresh Report'}
          </Button>
          <Button onClick={downloadDetailedReport} disabled={isGenerating}>
            <Download className="h-4 w-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Download Detailed'}
          </Button>
        </div>
      </div>

      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
          <CardDescription>
            Choose report type and format for detailed analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select
                value={selectedReportType}
                onValueChange={setSelectedReportType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {
                  reportTypes.find((t) => t.id === selectedReportType)
                    ?.description
                }
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Export Format</label>
              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON (Detailed)</SelectItem>
                  <SelectItem value="csv">CSV (Spreadsheet)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {report && (
        <>
          {/* Compliance Status */}
          <Card
            className={`border-l-4 ${
              report.complianceLevel === 'compliant'
                ? 'border-green-500'
                : report.complianceLevel === 'partial'
                  ? 'border-yellow-500'
                  : 'border-red-500'
            }`}
          >
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {getComplianceLevelIcon(report.complianceLevel)}
                <span>Compliance Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{report.title}</span>
                <Badge
                  className={getComplianceLevelColor(report.complianceLevel)}
                >
                  {report.complianceLevel.toUpperCase().replace('_', ' ')}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">
                {report.description}
              </p>

              <div className="text-xs text-muted-foreground">
                Generated: {new Date(report.generatedAt).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Key Metrics */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <Database className="h-8 w-8 text-blue-600" />
                      <div>
                        <div className="text-2xl font-bold">
                          {report.metrics.totalEvents}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Total Events
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-8 w-8 text-green-600" />
                      <div>
                        <div className="text-2xl font-bold">
                          {report.metrics.recentEvents}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Recent Events
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <Users className="h-8 w-8 text-purple-600" />
                      <div>
                        <div className="text-2xl font-bold">
                          {report.metrics.uniqueUsers}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Active Users
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-8 w-8 text-orange-600" />
                      <div>
                        <div className="text-2xl font-bold">
                          {Math.round(
                            report.metrics.integrityChecks.integrityScore,
                          )}
                          %
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Integrity Score
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Compliance Events */}
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Events Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Authentication Events</span>
                        <span className="font-semibold">
                          {report.metrics.complianceEvents.authentication}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Data Access Events</span>
                        <span className="font-semibold">
                          {report.metrics.complianceEvents.dataAccess}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Policy Interactions</span>
                        <span className="font-semibold">
                          {report.metrics.complianceEvents.policyInteraction}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Document Operations</span>
                        <span className="font-semibold">
                          {report.metrics.complianceEvents.documentOperations}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4">
              {/* Event Types Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Event Types Distribution</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(report.metrics.eventTypeCounts)
                      .sort(([, a], [, b]) => (b as number) - (a as number))
                      .slice(0, 8)
                      .map(([type, count]) => (
                        <div
                          key={type}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm">
                            {type.replace(/_/g, ' ')}
                          </span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 h-2 bg-gray-200 rounded">
                              <div
                                className="h-2 bg-blue-500 rounded"
                                style={{
                                  width: `${((count as number) / Math.max(...Object.values(report.metrics.eventTypeCounts))) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm font-semibold w-8 text-right">
                              {count as number}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Integrity Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Data Integrity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Events with Cryptographic Hashes</span>
                    <span className="font-semibold">
                      {report.metrics.integrityChecks.eventsWithHashes}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Integrity Score</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 h-2 bg-gray-200 rounded">
                        <div
                          className="h-2 bg-green-500 rounded"
                          style={{
                            width: `${report.metrics.integrityChecks.integrityScore}%`,
                          }}
                        />
                      </div>
                      <span className="font-semibold">
                        {Math.round(
                          report.metrics.integrityChecks.integrityScore,
                        )}
                        %
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Recommendations</CardTitle>
                  <CardDescription>
                    Suggestions for maintaining and improving compliance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {report.recommendations.length > 0 ? (
                    <ul className="space-y-3">
                      {report.recommendations.map((recommendation, index) => (
                        <li
                          key={index}
                          className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-shrink-0 mt-1">
                            {recommendation.startsWith('✅') ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : recommendation.startsWith('⚠️') ||
                              recommendation.startsWith('🚨') ? (
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            ) : (
                              <Shield className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                          <span className="text-sm">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No specific recommendations at this time.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
