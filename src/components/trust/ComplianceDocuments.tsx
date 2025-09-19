'use client';

import React from 'react';
import { track } from '@/lib/analytics';
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
  FileText,
  Download,
  ExternalLink,
  Globe,
  Scale,
  Lock,
  Calendar,
  Eye,
  FileCode,
} from 'lucide-react';

interface ComplianceDocument {
  title: string;
  description: string;
  type: 'policy' | 'agreement' | 'report' | 'guide';
  lastUpdated: string;
  language: 'en' | 'es' | 'both';
  size: string;
  sourcePath?: string;
  downloadUrl?: string;
  viewUrl?: string;
}

interface ComplianceDocumentsProps {
  locale: 'en' | 'es';
}

export function ComplianceDocuments({ locale }: ComplianceDocumentsProps) {
  const documents: ComplianceDocument[] = [
    {
      title: 'Privacy Notice',
      description: 'Comprehensive data handling and privacy practices.',
      type: 'policy',
      lastUpdated: '2025-09-19',
      language: 'both',
      size: '45 KB',
      sourcePath: 'docs/legal/privacy-notice.md',
      viewUrl: `/${locale}/privacy-policy`,
    },
    {
      title: 'Terms of Service',
      description: 'Legal terms and conditions for service usage.',
      type: 'agreement',
      lastUpdated: '2025-09-19',
      language: 'both',
      size: '38 KB',
      sourcePath: 'docs/legal/terms-of-service.md',
      viewUrl: `/${locale}/terms-of-service`,
    },
    {
      title: 'Service Disclaimer',
      description: 'Clarifies no attorney-client relationship and platform scope.',
      type: 'policy',
      lastUpdated: '2025-09-19',
      language: 'both',
      size: '32 KB',
      sourcePath: 'docs/legal/disclaimer.md',
      viewUrl: `/${locale}/disclaimer`,
    },
    {
      title: 'Refund Policy',
      description: 'Eligibility rules and workflow for refund requests.',
      type: 'policy',
      lastUpdated: '2025-09-19',
      language: 'both',
      size: '29 KB',
      sourcePath: 'docs/legal/refund-policy.md',
      viewUrl: `/${locale}/refund-policy`,
    },
    {
      title: 'GDPR Data Subject Rights Guide',
      description: 'How to exercise your rights under GDPR.',
      type: 'guide',
      lastUpdated: '2024-01-20',
      language: 'both',
      size: '125 KB',
      downloadUrl: '/documents/gdpr-rights-guide.pdf',
    },
    {
      title: 'CCPA Privacy Rights Notice',
      description: 'California Consumer Privacy Act compliance notice.',
      type: 'policy',
      lastUpdated: '2024-01-18',
      language: 'both',
      size: '89 KB',
      downloadUrl: '/documents/ccpa-notice.pdf',
    },
    {
      title: 'Incident Response Policy',
      description: 'Our procedures for handling security incidents.',
      type: 'policy',
      lastUpdated: '2023-12-15',
      language: 'en',
      size: '76 KB',
      downloadUrl: '/documents/incident-response-policy.pdf',
    },
    {
      title: 'Subprocessor List',
      description: 'Third-party service providers and their roles.',
      type: 'report',
      lastUpdated: '2024-01-25',
      language: 'en',
      size: '52 KB',
      downloadUrl: '/documents/subprocessor-list.pdf',
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'policy':
        return <Scale className="h-4 w-4" />;
      case 'agreement':
        return <FileText className="h-4 w-4" />;
      case 'report':
        return <Globe className="h-4 w-4" />;
      case 'guide':
        return <Lock className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'policy':
        return 'bg-blue-100 text-blue-800';
      case 'agreement':
        return 'bg-green-100 text-green-800';
      case 'report':
        return 'bg-purple-100 text-purple-800';
      case 'guide':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLanguageBadge = (language: string) => {
    switch (language) {
      case 'en':
        return <Badge variant="outline">English</Badge>;
      case 'es':
        return <Badge variant="outline">Español</Badge>;
      case 'both':
        return <Badge variant="outline">EN/ES</Badge>;
      default:
        return null;
    }
  };

  const emitComplianceClick = (action: string, meta: Record<string, unknown> = {}) => {
    track('compliance_cta_click', {
      locale,
      action,
      ...meta,
    });
  };

  const filteredDocuments = documents.filter(
    (doc) => doc.language === 'both' || doc.language === locale,
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <CardTitle>Compliance Documents</CardTitle>
        </div>
        <CardDescription>
          Legal policies, agreements, and compliance documentation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {filteredDocuments.map((document, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-1">{getTypeIcon(document.type)}</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{document.title}</h4>
                    <Badge className={getTypeColor(document.type)}>
                      {document.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {document.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Updated:{' '}
                      {new Date(document.lastUpdated).toLocaleDateString()}
                    </div>
                    <span>{document.size}</span>
                    {document.sourcePath && (
                      <div className="flex items-center gap-1 text-[11px]">
                        <FileCode className="h-3 w-3" aria-hidden />
                        <span>{document.sourcePath}</span>
                      </div>
                    )}
                    {getLanguageBadge(document.language)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {document.viewUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={document.viewUrl}
                    onClick={() => emitComplianceClick('view_policy', { title: document.title, destination: document.viewUrl })}
                  >
                    <Eye className="h-3 w-3" />
                    View
                  </a>
                </Button>
              )}
              {document.downloadUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={document.downloadUrl}
                    download
                    onClick={() => emitComplianceClick('download_policy', { title: document.title, destination: document.downloadUrl })}
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </a>
                </Button>
              )}
            </div>
          </div>
        ))}

        {/* Quick Actions */}
        <div className="border-t pt-4 space-y-3">
          <h4 className="font-medium">Quick Actions</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="sm"
              className="justify-start"
              onClick={() => emitComplianceClick('download_all_policies')}
            >
              <Download className="h-4 w-4" />
              Download All Policies
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="justify-start"
              onClick={() => emitComplianceClick('request_data_export')}
            >
              <ExternalLink className="h-4 w-4" />
              Request Data Export
            </Button>
          </div>
        </div>

        {/* Data Subject Rights */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium mb-2">Data Subject Rights</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Under GDPR and CCPA, you have the right to access, correct, delete,
            or port your data.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => emitComplianceClick('exercise_rights')}
          >
            <ExternalLink className="h-3 w-3" />
            Exercise Your Rights
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
