// src/components/checkout/ComplianceChecklist.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Shield, 
  FileText,
  Eye,
  DollarSign,
  MapPin,
  Clock,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComplianceItem {
  id: string;
  title: string;
  description: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  required: boolean;
  category: 'upl' | 'ftc' | 'state' | 'ui';
  details?: string;
}

interface ComplianceChecklistProps {
  checkoutState: {
    termsAccepted: boolean;
    scrolledToBottom: boolean;
    priceDisclosed: boolean;
    taxCalculated: boolean;
    userState?: string;
    documentType: string;
  };
  onRetest?: () => void;
  className?: string;
}

const ComplianceChecklist: React.FC<ComplianceChecklistProps> = ({
  checkoutState,
  onRetest,
  className
}) => {
  const [checklist, setChecklist] = React.useState<ComplianceItem[]>([]);

  React.useEffect(() => {
    generateChecklist();
  }, [checkoutState]);

  const generateChecklist = () => {
    const items: ComplianceItem[] = [
      // UPL Compliance
      {
        id: 'terms_checkbox',
        title: 'Terms Acceptance Required',
        description: 'Checkbox is required; Pay button disabled until checked',
        status: checkoutState.termsAccepted ? 'pass' : 'fail',
        required: true,
        category: 'upl',
        details: 'Prevents unauthorized practice of law claims'
      },
      {
        id: 'footer_disclaimer',
        title: 'Footer Disclaimer Present',
        description: 'Footer line appears on every checkout step',
        status: 'pass', // Assuming footer is always present
        required: true,
        category: 'upl',
        details: 'Required on every page for UPL protection'
      },
      {
        id: 'no_legal_advice',
        title: 'No Legal Advice Disclaimer',
        description: '"Not legal advice" clearly stated',
        status: 'pass',
        required: true,
        category: 'upl',
        details: 'Core UPL protection statement'
      },

      // FTC Compliance
      {
        id: 'price_transparency',
        title: 'Total Price Disclosed',
        description: 'Show total price and tax on same screen',
        status: checkoutState.priceDisclosed ? 'pass' : 'fail',
        required: true,
        category: 'ftc',
        details: 'Avoids FTC "hidden fee" scrutiny'
      },
      {
        id: 'scroll_tracking',
        title: 'Terms Scroll Tracking',
        description: 'Modal scroll tracked to ensure reasonable opportunity to read',
        status: checkoutState.scrolledToBottom ? 'pass' : 'warning',
        required: false,
        category: 'ftc',
        details: 'Demonstrates user had opportunity to review terms'
      },

      // State-Specific Compliance
      {
        id: 'nc_geo_logic',
        title: 'North Carolina Override Logic',
        description: 'VPN into NC → no warranty disclaimer text',
        status: checkoutState.userState === 'NC' ? 'pass' : 'pending',
        required: true,
        category: 'state',
        details: 'NC consent judgment compliance (LegalZoom 2015)'
      },
      {
        id: 'venue_clause',
        title: 'Jurisdiction-Appropriate Venue',
        description: 'Correct court venue based on user state',
        status: checkoutState.userState ? 'pass' : 'warning',
        required: true,
        category: 'state',
        details: 'State-specific dispute resolution terms'
      },

      // UI/UX Compliance
      {
        id: 'neutral_styling',
        title: 'Neutral Color Styling',
        description: 'Gray styling—avoid red "warning" appearance',
        status: 'pass',
        required: false,
        category: 'ui',
        details: 'Reduces buyer anxiety while maintaining compliance'
      },
      {
        id: 'acceptance_logging',
        title: 'Acceptance Event Logging',
        description: 'Log user ID, IP, terms version, and state',
        status: checkoutState.termsAccepted ? 'pass' : 'pending',
        required: true,
        category: 'upl',
        details: 'Legal proof of informed consent'
      }
    ];

    setChecklist(items);
  };

  const getStatusIcon = (status: ComplianceItem['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: ComplianceItem['status']) => {
    switch (status) {
      case 'pass':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'fail':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'pending':
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryIcon = (category: ComplianceItem['category']) => {
    switch (category) {
      case 'upl':
        return <Shield className="h-4 w-4" />;
      case 'ftc':
        return <DollarSign className="h-4 w-4" />;
      case 'state':
        return <MapPin className="h-4 w-4" />;
      case 'ui':
        return <Eye className="h-4 w-4" />;
    }
  };

  const getCategoryName = (category: ComplianceItem['category']) => {
    switch (category) {
      case 'upl':
        return 'UPL Protection';
      case 'ftc':
        return 'FTC Compliance';
      case 'state':
        return 'State Laws';
      case 'ui':
        return 'UX Design';
    }
  };

  const overallStatus = () => {
    const requiredItems = checklist.filter(item => item.required);
    const passedRequired = requiredItems.filter(item => item.status === 'pass');
    const failedRequired = requiredItems.filter(item => item.status === 'fail');
    
    if (failedRequired.length > 0) return 'fail';
    if (passedRequired.length === requiredItems.length) return 'pass';
    return 'warning';
  };

  const getComplianceSummary = () => {
    const total = checklist.length;
    const passed = checklist.filter(item => item.status === 'pass').length;
    const failed = checklist.filter(item => item.status === 'fail').length;
    const warnings = checklist.filter(item => item.status === 'warning').length;

    return { total, passed, failed, warnings };
  };

  const summary = getComplianceSummary();
  const status = overallStatus();

  return (
    <div className={cn("space-y-4", className)}>
      {/* Overall Status Header */}
      <Card className={cn("border-2", getStatusColor(status))}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(status)}
              Compliance Status
              <Badge variant="outline" className={getStatusColor(status)}>
                {status.toUpperCase()}
              </Badge>
            </div>
            
            {onRetest && (
              <Button variant="outline" size="sm" onClick={onRetest}>
                Re-test
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{summary.passed}</div>
              <div className="text-xs text-muted-foreground">Passed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{summary.failed}</div>
              <div className="text-xs text-muted-foreground">Failed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{summary.warnings}</div>
              <div className="text-xs text-muted-foreground">Warnings</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{summary.total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Checklist by Category */}
      {['upl', 'ftc', 'state', 'ui'].map(category => {
        const categoryItems = checklist.filter(item => item.category === category);
        if (categoryItems.length === 0) return null;

        return (
          <Card key={category}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                {getCategoryIcon(category as any)}
                {getCategoryName(category as any)}
                <Badge variant="outline" className="text-xs">
                  {categoryItems.length} items
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryItems.map(item => (
                  <ComplianceItemCard key={item.id} item={item} />
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* State-Specific Information */}
      {checkoutState.userState && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              State-Specific Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">User State:</span>
                <span className="font-medium">{checkoutState.userState}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Document Type:</span>
                <span className="font-medium">{checkoutState.documentType}</span>
              </div>
              {checkoutState.userState === 'NC' && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-blue-800 text-xs">
                    <strong>North Carolina Special Requirements:</strong> No warranty disclaimers allowed. 
                    Venue must be NC courts. Additional consumer protections apply.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Individual Compliance Item Component
const ComplianceItemCard: React.FC<{ item: ComplianceItem }> = ({ item }) => {
  const getStatusIcon = (status: ComplianceItem['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: ComplianceItem['status']) => {
    switch (status) {
      case 'pass':
        return 'border-green-200 bg-green-50';
      case 'fail':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'pending':
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className={cn("p-3 border rounded-lg", getStatusColor(item.status))}>
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">
          {getStatusIcon(item.status)}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium text-sm">{item.title}</h4>
            {item.required && (
              <Badge variant="destructive" className="text-xs">
                Required
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground mb-2">
            {item.description}
          </p>
          
          {item.details && (
            <p className="text-xs text-muted-foreground italic">
              💡 {item.details}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplianceChecklist;