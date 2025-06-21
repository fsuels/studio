// Compliance gate component - checks user state and blocks/allows checkout
'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Loader2,
  ExternalLink,
  Users,
} from 'lucide-react';

export interface ComplianceResult {
  allowed: boolean;
  riskLevel: 'green' | 'amber' | 'red';
  disclaimerLevel: 'basic' | 'enhanced' | 'strict';
  reason: string;
  requirements: string[];
  recommendations?: string[];
  waitlistEligible: boolean;
  location: {
    state: string;
    stateCode: string;
    country: string;
    confidence: string;
  };
}

interface ComplianceGateProps {
  children: React.ReactNode;
  onComplianceResult?: (result: ComplianceResult) => void;
  mockState?: string; // For development/testing
  sessionId?: string;
}

export default function ComplianceGate({
  children,
  onComplianceResult,
  mockState,
  sessionId,
}: ComplianceGateProps) {
  const [loading, setLoading] = useState(true);
  const [compliance, setCompliance] = useState<ComplianceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const checkCompliance = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/compliance/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionId || crypto.randomUUID(),
          mockState,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Compliance check failed');
      }

      setCompliance(data.compliance);
      onComplianceResult?.(data.compliance);
    } catch (err) {
      console.error('Compliance check error:', err);
      setError((err as Error).message);

      // Fallback to blocked state for safety
      const fallbackCompliance: ComplianceResult = {
        allowed: false,
        riskLevel: 'red',
        disclaimerLevel: 'strict',
        reason: 'Unable to verify compliance - access temporarily restricted',
        requirements: ['Contact support for assistance'],
        recommendations: [
          'Try refreshing the page',
          'Check your internet connection',
        ],
        waitlistEligible: true,
        location: {
          state: 'Unknown',
          stateCode: 'UNK',
          country: 'Unknown',
          confidence: 'low',
        },
      };

      setCompliance(fallbackCompliance);
      onComplianceResult?.(fallbackCompliance);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkCompliance();
  }, [mockState]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    checkCompliance();
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'green':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'amber':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'red':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'green':
        return <CheckCircle className="h-5 w-5" />;
      case 'amber':
        return <AlertTriangle className="h-5 w-5" />;
      case 'red':
        return <Shield className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">
            Checking compliance for your location...
          </p>
        </div>
      </div>
    );
  }

  if (!compliance) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Service Unavailable
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Unable to verify service availability in your location.
          </p>
          {error && (
            <Alert>
              <AlertDescription className="text-xs">
                Error: {error}
              </AlertDescription>
            </Alert>
          )}
          <Button
            onClick={handleRetry}
            disabled={retryCount >= 3}
            className="w-full"
          >
            {retryCount >= 3 ? 'Contact Support' : 'Try Again'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // User is compliant - show checkout
  if (compliance.allowed) {
    return (
      <div className="space-y-4">
        {/* Location indicator */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>
            {compliance.location.state}, {compliance.location.country}
          </span>
          <Badge
            variant="outline"
            className={getRiskColor(compliance.riskLevel)}
          >
            {compliance.riskLevel.toUpperCase()}
          </Badge>
        </div>

        {/* Compliance disclaimer */}
        {compliance.disclaimerLevel !== 'basic' && (
          <Alert className={getRiskColor(compliance.riskLevel)}>
            <Shield className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {getDisclaimerText(
                compliance.disclaimerLevel,
                compliance.location.stateCode,
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Show requirements if any */}
        {compliance.requirements.length > 0 && (
          <div className="text-xs space-y-1">
            <p className="font-medium">
              Requirements for {compliance.location.state}:
            </p>
            <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
              {compliance.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {children}
      </div>
    );
  }

  // User is blocked - show waitlist
  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getRiskIcon(compliance.riskLevel)}
          Service Not Available in {compliance.location.state}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className={getRiskColor(compliance.riskLevel)}>
          <AlertDescription>{compliance.reason}</AlertDescription>
        </Alert>

        {compliance.requirements.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Current Requirements:</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              {compliance.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-current rounded-full mt-2 flex-shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {compliance.recommendations &&
          compliance.recommendations.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">What You Can Do:</p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                {compliance.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0 text-green-500" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        {compliance.waitlistEligible && (
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <span className="font-medium">Join the Waitlist</span>
            </div>
            <p className="text-xs text-muted-foreground">
              We&apos;re working to expand service to{' '}
              {compliance.location.state}. Join our waitlist to be notified when
              it becomes available.
            </p>
            <Button className="w-full" variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Join Waitlist for {compliance.location.state}
            </Button>
          </div>
        )}

        <div className="text-xs text-center text-muted-foreground pt-2 border-t">
          Location: {compliance.location.state}, {compliance.location.country}
          {compliance.location.confidence === 'low' && (
            <span className="block mt-1 text-amber-600">
              ⚠ Location detection confidence is low
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Get disclaimer text based on level
function getDisclaimerText(
  level: 'basic' | 'enhanced' | 'strict',
  stateCode: string,
): string {
  const baseText =
    '123LegalDoc provides self-help legal document templates and is not a law firm.';

  switch (level) {
    case 'enhanced':
      return `${baseText} These templates are for informational purposes only. You are responsible for ensuring compliance with ${stateCode} state laws.`;
    case 'strict':
      return `${baseText} Legal document preparation may require attorney supervision in ${stateCode}. Use at your own risk and consult with a licensed attorney.`;
    default:
      return baseText;
  }
}
