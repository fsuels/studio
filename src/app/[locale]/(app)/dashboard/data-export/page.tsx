// src/app/[locale]/(app)/dashboard/data-export/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, Shield, FileText, Database, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ExportInfo {
  userId: string;
  availableData: {
    documents: number;
    auditTrail: boolean;
    profile: boolean;
  };
  supportedFormats: string[];
  retentionPolicy: string;
  estimatedExportSize: string;
}

export default function DataExportPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [exportInfo, setExportInfo] = useState<ExportInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [requestType, setRequestType] = useState<
    'full_export' | 'audit_trail_only' | 'documents_only'
  >('full_export');
  const [format, setFormat] = useState<'json' | 'csv'>('json');
  const [includeDeleted, setIncludeDeleted] = useState(false);

  useEffect(() => {
    fetchExportInfo();
  }, []);

  const fetchExportInfo = async () => {
    try {
      const response = await fetch('/api/compliance/data-export');
      if (response.ok) {
        const info = await response.json();
        setExportInfo(info);
      } else {
        throw new Error('Failed to fetch export information');
      }
    } catch (error) {
      console.error('Error fetching export info:', error);
      toast({
        title: 'Error',
        description: 'Failed to load export information',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    if (!user) return;

    setIsExporting(true);
    try {
      const response = await fetch('/api/compliance/data-export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          requestType,
          format,
          includeDeleted,
        }),
      });

      if (response.ok) {
        // Get the filename from Content-Disposition header
        const contentDisposition = response.headers.get('content-disposition');
        const filename = contentDisposition
          ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
          : `data-export-${user.uid}-${Date.now()}.${format}`;

        // Create download link
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
          title: 'Export Complete',
          description:
            'Your data has been exported and downloaded successfully.',
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Export Failed',
        description:
          error instanceof Error ? error.message : 'Failed to export data',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center space-x-2">
        <Shield className="h-6 w-6 text-blue-600" />
        <h1 className="text-3xl font-bold">Export Your Data</h1>
      </div>

      <p className="text-muted-foreground">
        Download a copy of your personal data stored in our system. This export
        is provided in compliance with data protection regulations including
        GDPR and CCPA.
      </p>

      {exportInfo && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Available Data Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Available Data</span>
              </CardTitle>
              <CardDescription>
                Summary of your data available for export
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Documents</span>
                </span>
                <span className="font-semibold">
                  {exportInfo.availableData.documents}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Audit Trail</span>
                </span>
                <span className="font-semibold">
                  {exportInfo.availableData.auditTrail ? 'Available' : 'None'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Estimated Size</span>
                </span>
                <span className="font-semibold">
                  {exportInfo.estimatedExportSize}
                </span>
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                  <strong>Retention Policy:</strong>{' '}
                  {exportInfo.retentionPolicy}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
              <CardDescription>
                Choose what data to include and export format
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Request Type */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">What to export</Label>
                <RadioGroup
                  value={requestType}
                  onValueChange={(value: any) => setRequestType(value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="full_export" id="full" />
                    <Label htmlFor="full">Complete data export</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="documents_only" id="docs" />
                    <Label htmlFor="docs">Documents only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="audit_trail_only" id="audit" />
                    <Label htmlFor="audit">Audit trail only</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Format */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Export format</Label>
                <RadioGroup
                  value={format}
                  onValueChange={(value: any) => setFormat(value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="json" id="json" />
                    <Label htmlFor="json">JSON (structured data)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="csv" id="csv" />
                    <Label htmlFor="csv">CSV (spreadsheet compatible)</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Include Deleted */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="deleted"
                  checked={includeDeleted}
                  onCheckedChange={(checked) =>
                    setIncludeDeleted(checked as boolean)
                  }
                />
                <Label htmlFor="deleted" className="text-sm">
                  Include deleted documents
                </Label>
              </div>

              {/* Export Button */}
              <Button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? 'Preparing Export...' : 'Download Data Export'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Legal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Data Rights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong>Right to Access:</strong> You have the right to obtain a
            copy of your personal data we process.
          </p>
          <p>
            <strong>Data Portability:</strong> You can receive your data in a
            structured, commonly used format.
          </p>
          <p>
            <strong>Audit Trail:</strong> Your audit trail contains a complete
            record of actions taken on your data for security and compliance
            purposes.
          </p>
          <p>
            <strong>Questions?</strong> Contact us at privacy@123legaldoc.com
            for any data-related inquiries.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
