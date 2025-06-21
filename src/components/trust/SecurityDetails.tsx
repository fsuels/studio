'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Lock, 
  Shield, 
  Key, 
  Server, 
  Eye, 
  EyeOff,
  Copy,
  Check,
  ExternalLink,
  Download,
  AlertTriangle,
  Clock,
  Globe,
  Database
} from 'lucide-react';

interface SecurityDetail {
  category: string;
  title: string;
  description: string;
  technical: string;
  compliance: string[];
  icon: React.ElementType;
  color: string;
}

const securityDetails: SecurityDetail[] = [
  {
    category: 'Data Encryption',
    title: 'AES-256 Encryption',
    description: 'All data is encrypted at rest and in transit using industry-standard AES-256 encryption',
    technical: 'AES-256-GCM with PBKDF2 key derivation (100,000 iterations), TLS 1.3 for transport',
    compliance: ['SOC 2', 'GDPR', 'CCPA'],
    icon: Lock,
    color: 'green'
  },
  {
    category: 'Access Control',
    title: 'Multi-Factor Authentication',
    description: 'Role-based access control with mandatory 2FA for all administrative functions',
    technical: 'RBAC with OAuth 2.0, SAML 2.0, TOTP/SMS 2FA, privilege escalation monitoring',
    compliance: ['SOC 2', 'ISO 27001'],
    icon: Key,
    color: 'blue'
  },
  {
    category: 'Infrastructure',
    title: 'Secure Cloud Architecture',
    description: 'Multi-region deployment with automated failover and disaster recovery',
    technical: 'Firebase/GCP infrastructure, auto-scaling, load balancing, 99.9% SLA',
    compliance: ['SOC 2', 'ISO 27001', 'GDPR'],
    icon: Server,
    color: 'purple'
  },
  {
    category: 'Monitoring',
    title: 'Real-time Security Monitoring',
    description: '24/7 security monitoring with automated threat detection and response',
    technical: 'SIEM integration, anomaly detection, automated incident response workflows',
    compliance: ['SOC 2', 'GDPR'],
    icon: Eye,
    color: 'orange'
  },
  {
    category: 'Data Privacy',
    title: 'Privacy by Design',
    description: 'Data minimization, purpose limitation, and automated retention policies',
    technical: 'Automated data classification, retention policies, deletion workflows',
    compliance: ['GDPR', 'CCPA', 'SOC 2'],
    icon: Shield,
    color: 'indigo'
  },
  {
    category: 'Backups',
    title: 'Encrypted Backups',
    description: 'Automated encrypted backups with point-in-time recovery capabilities',
    technical: 'Continuous backup to geographically distributed locations, AES-256 encryption',
    compliance: ['SOC 2', 'GDPR'],
    icon: Database,
    color: 'teal'
  }
];

export function SecurityDetails() {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [copiedItems, setCopiedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const copyToClipboard = async (text: string, itemTitle: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => [...prev, itemTitle]);
      setTimeout(() => {
        setCopiedItems(prev => prev.filter(item => item !== itemTitle));
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getColorClasses = (color: string) => {
    const colors = {
      green: 'text-green-600 bg-green-100',
      blue: 'text-blue-600 bg-blue-100',
      purple: 'text-purple-600 bg-purple-100',
      orange: 'text-orange-600 bg-orange-100',
      indigo: 'text-indigo-600 bg-indigo-100',
      teal: 'text-teal-600 bg-teal-100'
    };
    return colors[color as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  const getIconColor = (color: string) => {
    const colors = {
      green: 'text-green-600',
      blue: 'text-blue-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600',
      indigo: 'text-indigo-600',
      teal: 'text-teal-600'
    };
    return colors[color as keyof typeof colors] || 'text-gray-600';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          <CardTitle>Security & Encryption Details</CardTitle>
        </div>
        <CardDescription>
          Comprehensive technical security measures and compliance standards
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Security Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">256-bit</div>
            <div className="text-sm text-muted-foreground">AES Encryption</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">99.9%</div>
            <div className="text-sm text-muted-foreground">Uptime SLA</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">24/7</div>
            <div className="text-sm text-muted-foreground">Monitoring</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">SOC 2</div>
            <div className="text-sm text-muted-foreground">Certified</div>
          </div>
        </div>

        {/* Security Details */}
        <div className="space-y-4">
          {securityDetails.map((detail, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <detail.icon className={`h-6 w-6 mt-1 ${getIconColor(detail.color)}`} />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{detail.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {detail.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {detail.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {detail.compliance.map((standard, i) => (
                        <Badge key={i} className={getColorClasses(detail.color)}>
                          {standard}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(detail.title)}
                >
                  {expandedItems.includes(detail.title) ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {expandedItems.includes(detail.title) && (
                <div className="bg-muted/30 rounded-lg p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-sm">Technical Implementation</h5>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(detail.technical, detail.title)}
                    >
                      {copiedItems.includes(detail.title) ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm font-mono bg-background p-2 rounded border">
                    {detail.technical}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Security Information */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Security Practices
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h5 className="font-medium mb-2">Incident Response</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 24/7 security operations center</li>
                <li>• Automated threat detection</li>
                <li>• &lt;1 hour incident response time</li>
                <li>• Customer notification within 72 hours</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-4">
              <h5 className="font-medium mb-2">Data Protection</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• End-to-end encryption pipeline</li>
                <li>• Zero-knowledge architecture options</li>
                <li>• Automated data retention policies</li>
                <li>• Secure data deletion protocols</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Vulnerability Disclosure */}
        <div className="border border-orange-200 bg-orange-50 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <h5 className="font-medium text-orange-800">Responsible Disclosure</h5>
              <p className="text-sm text-orange-700 mt-1">
                Found a security vulnerability? We appreciate responsible disclosure through our 
                security contact or bug bounty program.
              </p>
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-3 w-3" />
                  Report Vulnerability
                </Button>
                <Button variant="outline" size="sm">
                  <Globe className="h-3 w-3" />
                  Security Contact
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Download Security Documentation */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="flex-1">
            <Download className="h-4 w-4" />
            Security Whitepaper
          </Button>
          <Button variant="outline" className="flex-1">
            <Download className="h-4 w-4" />
            Penetration Test Report
          </Button>
          <Button variant="outline" className="flex-1">
            <Download className="h-4 w-4" />
            Encryption Specification
          </Button>
        </div>

        {/* Contact Information */}
        <div className="text-center pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            For technical security questions, contact our security team at{' '}
            <a href="mailto:security@123legaldoc.com" className="text-primary hover:underline">
              security@123legaldoc.com
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}