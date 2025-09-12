'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import dynamic from 'next/dynamic';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TrustBadges from '@/components/shared/TrustBadges';
// Lazily load heavy trust widgets to keep initial bundle light
const UptimeStatus = dynamic(() => import('./UptimeStatus').then(m => m.UptimeStatus), { ssr: false, loading: () => null });
const SecurityCertifications = dynamic(() => import('./SecurityCertifications').then(m => m.SecurityCertifications), { ssr: false, loading: () => null });
const ComplianceDocuments = dynamic(() => import('./ComplianceDocuments').then(m => m.ComplianceDocuments), { ssr: false, loading: () => null });
const SOC2RequestForm = dynamic(() => import('./SOC2RequestForm').then(m => m.SOC2RequestForm), { ssr: false, loading: () => null });
const DataProcessingAgreement = dynamic(() => import('./DataProcessingAgreement').then(m => m.DataProcessingAgreement), { ssr: false, loading: () => null });
const SecurityDetails = dynamic(() => import('./SecurityDetails').then(m => m.SecurityDetails), { ssr: false, loading: () => null });
const BugBountyProgram = dynamic(() => import('./BugBountyProgram').then(m => m.BugBountyProgram), { ssr: false, loading: () => null });
import {
  Shield,
  Lock,
  FileText,
  Award,
  Globe,
  Zap,
  CheckCircle2,
  ExternalLink,
  Download,
} from 'lucide-react';

interface TrustCenterProps {
  locale: 'en' | 'es';
}

export function TrustCenter({ locale }: TrustCenterProps) {
  const { user } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const logTrustCenterView = async () => {
      try {
        const { auditService } = await import('@/services/firebase-audit-service');
        await auditService.logComplianceEvent('trust_center_viewed', {
          locale,
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          timestamp: new Date().toISOString(),
          pageUrl: window.location.href,
          userId: user?.uid || 'anonymous',
        });
      } catch (error) {
        console.error('Failed to log trust center view:', error);
      }
    };

    logTrustCenterView();
    setIsLoaded(true);
  }, [locale, user?.uid]);

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-muted rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="h-8 w-8 text-green-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Trust & Compliance Center
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Enterprise-grade security, compliance certifications, and transparency
          for legal professionals. Proactively addressing your security
          questionnaires and due diligence requirements.
        </p>
        <TrustBadges className="mt-6" />
      </div>

      {/* Trust Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <CardTitle className="text-lg">99.9% Uptime</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Operational
            </Badge>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-center gap-2">
              <Award className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-lg">SOC 2 Type II</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Certified
            </Badge>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-center gap-2">
              <Globe className="h-6 w-6 text-purple-600" />
              <CardTitle className="text-lg">GDPR Ready</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-800"
            >
              Compliant
            </Badge>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-center gap-2">
              <Lock className="h-6 w-6 text-orange-600" />
              <CardTitle className="text-lg">AES-256</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Badge
              variant="secondary"
              className="bg-orange-100 text-orange-800"
            >
              Encrypted
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          <UptimeStatus />
          <SecurityCertifications />
          <ComplianceDocuments locale={locale} />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <SOC2RequestForm />
          <DataProcessingAgreement />
          <SecurityDetails />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <BugBountyProgram />

        {/* Contact for Custom Compliance */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <CardTitle>Custom Compliance Requirements</CardTitle>
            </div>
            <CardDescription>
              Need specific compliance documentation or have custom security
              requirements?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Our compliance team can provide custom documentation, additional
              certifications, and work with your security team to meet specific
              requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex-1">
                <ExternalLink className="h-4 w-4" />
                Contact Compliance Team
              </Button>
              <Button variant="outline" className="flex-1">
                <Download className="h-4 w-4" />
                Security Questionnaire
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center pt-8 border-t">
        <p className="text-sm text-muted-foreground">
          All compliance documents and certifications are updated in real-time.
          Questions? Contact our compliance team at{' '}
          <a
            href="mailto:compliance@123legaldoc.com"
            className="text-primary hover:underline"
          >
            compliance@123legaldoc.com
          </a>
        </p>
      </div>
    </div>
  );
}
