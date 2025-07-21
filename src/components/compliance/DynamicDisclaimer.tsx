// Dynamic disclaimer component that adapts based on user's state and risk level
'use client';

import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Shield,
  AlertTriangle,
  Info,
  ExternalLink,
  CheckCircle,
  Scale,
} from 'lucide-react';

export interface DisclaimerProps {
  stateCode: string;
  stateName: string;
  riskLevel: 'green' | 'amber' | 'red';
  disclaimerLevel: 'basic' | 'enhanced' | 'strict';
  requirements?: string[];
  showMinimal?: boolean;
  placement?: 'checkout' | 'document' | 'footer' | 'inline';
}

export default function DynamicDisclaimer({
  stateCode,
  stateName,
  riskLevel,
  disclaimerLevel,
  requirements = [],
  showMinimal = false,
  placement = 'inline',
}: DisclaimerProps) {
  const getIcon = () => {
    switch (riskLevel) {
      case 'green':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'amber':
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case 'red':
        return <Shield className="h-4 w-4 text-red-600" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getAlertVariant = () => {
    switch (riskLevel) {
      case 'red':
        return 'destructive';
      case 'amber':
        return 'default';
      default:
        return 'default';
    }
  };

  const getDisclaimerText = () => {
    const baseText =
      '123LegalDoc provides self-help legal document templates and is not a law firm.';

    switch (disclaimerLevel) {
      case 'basic':
        return {
          primary: baseText,
          secondary:
            'These templates are provided for informational purposes only.',
          legal: 'Use is subject to our Terms of Service.',
        };

      case 'enhanced':
        return {
          primary: baseText,
          secondary: `These templates are for informational purposes only and should not substitute for advice from a licensed attorney. You are responsible for ensuring the document meets your specific needs and complies with ${stateName} state laws.`,
          legal:
            'Use is subject to our Terms of Service (Delaware law, arbitration clause applies).',
        };

      case 'strict':
        return {
          primary: baseText,
          secondary: `⚠️ WARNING: Legal document preparation without attorney supervision may constitute unauthorized practice of law in some jurisdictions. These templates are provided for informational purposes only and should not be used without consulting a licensed attorney in ${stateName}.`,
          legal:
            'You assume all risks associated with using these documents. Refunds available within 30 days. Use is subject to our Terms of Service (Delaware law, arbitration clause applies).',
        };

      default:
        return {
          primary: baseText,
          secondary: 'Use at your own discretion.',
          legal: '',
        };
    }
  };

  const disclaimerText = getDisclaimerText();

  // Minimal version for footers/inline use
  if (showMinimal) {
    return (
      <div className="text-xs text-muted-foreground space-y-1">
        <p className="flex items-center gap-1">
          {getIcon()}
          <span>{disclaimerText.primary}</span>
        </p>
        {placement === 'footer' && (
          <p className="italic">{disclaimerText.legal}</p>
        )}
      </div>
    );
  }

  // Full disclaimer for checkout/document pages
  return (
    <div className="space-y-3">
      {/* Risk Level Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={
              riskLevel === 'green'
                ? 'text-green-600 border-green-200 bg-green-50'
                : riskLevel === 'amber'
                  ? 'text-amber-600 border-amber-200 bg-amber-50'
                  : 'text-red-600 border-red-200 bg-red-50'
            }
          >
            {riskLevel.toUpperCase()} RISK
          </Badge>
          <span className="text-xs text-muted-foreground">
            {stateName} ({stateCode})
          </span>
        </div>

        {placement === 'checkout' && (
          <button className="text-xs text-primary hover:underline flex items-center gap-1">
            View State Requirements
            <ExternalLink className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Main Disclaimer */}
      <Alert variant={getAlertVariant()}>
        {getIcon()}
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium text-sm">{disclaimerText.primary}</p>
            <p className="text-xs leading-relaxed">
              {disclaimerText.secondary}
            </p>
          </div>
        </AlertDescription>
      </Alert>

      {/* State-Specific Requirements */}
      {requirements.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-2 mb-2">
              <Scale className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  Additional Requirements for {stateName}:
                </p>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  {requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-current rounded-full mt-2 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legal Notice */}
      {disclaimerText.legal && (
        <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded border border-dashed">
          <p className="italic">{disclaimerText.legal}</p>
        </div>
      )}

      {/* Special Warnings for High-Risk States */}
      {riskLevel === 'red' && placement === 'checkout' && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>Service Restricted:</strong> Due to strict regulatory
            requirements in {stateName}, this service is not currently
            available. We recommend consulting with a licensed attorney in your
            state for legal document preparation.
          </AlertDescription>
        </Alert>
      )}

      {/* Enhanced Protection Notice for Green States */}
      {riskLevel === 'green' && placement === 'checkout' && (
        <Alert>
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-xs">
            <strong>Enhanced Legal Protections:</strong> {stateName} has
            progressive regulations that provide additional protections for
            online legal services. You can use our service with confidence under
            regulatory oversight.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// Pre-configured disclaimer components for common use cases
export function CheckoutDisclaimer(props: Omit<DisclaimerProps, 'placement'>) {
  return <DynamicDisclaimer {...props} placement="checkout" />;
}

export function DocumentDisclaimer(props: Omit<DisclaimerProps, 'placement'>) {
  return <DynamicDisclaimer {...props} placement="document" />;
}

export function FooterDisclaimer(
  props: Omit<DisclaimerProps, 'placement' | 'showMinimal'>,
) {
  return <DynamicDisclaimer {...props} placement="footer" showMinimal />;
}

export function InlineDisclaimer(
  props: Omit<DisclaimerProps, 'placement' | 'showMinimal'>,
) {
  return <DynamicDisclaimer {...props} placement="inline" showMinimal />;
}
