'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Award, 
  Shield, 
  Lock, 
  FileText, 
  Download,
  ExternalLink,
  Calendar,
  CheckCircle2
} from 'lucide-react';

interface Certification {
  name: string;
  description: string;
  status: 'active' | 'pending' | 'renewal';
  validUntil: string;
  icon: React.ElementType;
  color: string;
  reportAvailable: boolean;
}

const certifications: Certification[] = [
  {
    name: 'SOC 2 Type II',
    description: 'Security, availability, processing integrity, confidentiality, and privacy controls',
    status: 'active',
    validUntil: '2024-12-31',
    icon: Award,
    color: 'blue',
    reportAvailable: true
  },
  {
    name: 'GDPR Compliance',
    description: 'General Data Protection Regulation compliance framework',
    status: 'active',
    validUntil: 'Ongoing',
    icon: Shield,
    color: 'green',
    reportAvailable: true
  },
  {
    name: 'CCPA Compliance',
    description: 'California Consumer Privacy Act compliance',
    status: 'active',
    validUntil: 'Ongoing',
    icon: Lock,
    color: 'purple',
    reportAvailable: true
  },
  {
    name: 'ISO 27001',
    description: 'Information security management systems standard',
    status: 'pending',
    validUntil: '2024-06-30',
    icon: FileText,
    color: 'orange',
    reportAvailable: false
  }
];

export function SecurityCertifications() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'renewal':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCertificationColor = (color: string) => {
    const colors = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600'
    };
    return colors[color as keyof typeof colors] || 'text-gray-600';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          <CardTitle>Security Certifications</CardTitle>
        </div>
        <CardDescription>
          Our comprehensive security and compliance certifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {certifications.map((cert, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <cert.icon className={`h-6 w-6 ${getCertificationColor(cert.color)}`} />
                <div>
                  <h4 className="font-semibold">{cert.name}</h4>
                  <p className="text-sm text-muted-foreground">{cert.description}</p>
                </div>
              </div>
              <Badge className={getStatusColor(cert.status)}>
                {cert.status === 'active' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                {cert.status}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Valid until: {cert.validUntil}</span>
              </div>
              
              {cert.reportAvailable && (
                <Button variant="outline" size="sm">
                  <Download className="h-3 w-3" />
                  View Report
                </Button>
              )}
            </div>
          </div>
        ))}

        {/* Certification Summary */}
        <div className="border-t pt-4 mt-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">4</div>
              <div className="text-sm text-muted-foreground">Active Certifications</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">100%</div>
              <div className="text-sm text-muted-foreground">Compliance Score</div>
            </div>
          </div>
        </div>

        {/* Request Custom Reports */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Need custom compliance reports?</h4>
              <p className="text-sm text-muted-foreground">
                We can provide additional compliance documentation for your specific requirements
              </p>
            </div>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-3 w-3" />
              Request
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}