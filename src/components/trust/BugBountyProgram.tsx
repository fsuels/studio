'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bug, 
  Award, 
  DollarSign, 
  ExternalLink, 
  Shield, 
  Target,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  Trophy,
  Mail
} from 'lucide-react';

interface VulnerabilityType {
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  reward: string;
  color: string;
  examples: string[];
}

const vulnerabilityTypes: VulnerabilityType[] = [
  {
    severity: 'Critical',
    description: 'Remote code execution, SQL injection, authentication bypass',
    reward: '$2,000 - $5,000',
    color: 'red',
    examples: [
      'Remote code execution vulnerabilities',
      'SQL injection leading to data access',
      'Authentication bypass mechanisms',
      'Complete account takeover scenarios'
    ]
  },
  {
    severity: 'High',
    description: 'Privilege escalation, sensitive data exposure, XSS with impact',
    reward: '$500 - $2,000',
    color: 'orange',
    examples: [
      'Privilege escalation vulnerabilities',
      'Unauthorized sensitive data access',
      'Cross-site scripting with significant impact',
      'Business logic flaws affecting security'
    ]
  },
  {
    severity: 'Medium',
    description: 'CSRF, information disclosure, security misconfigurations',
    reward: '$100 - $500',
    color: 'yellow',
    examples: [
      'Cross-site request forgery (CSRF)',
      'Information disclosure vulnerabilities',
      'Security misconfigurations',
      'Session management issues'
    ]
  },
  {
    severity: 'Low',
    description: 'Security improvements, minor information leaks',
    reward: '$50 - $100',
    color: 'blue',
    examples: [
      'Minor information leakage',
      'Security improvement suggestions',
      'Low-impact vulnerabilities',
      'Security hardening opportunities'
    ]
  }
];

const programStats = {
  totalResearchers: 150,
  vulnerabilitiesFixed: 23,
  totalPayouts: '$45,000',
  averageResponseTime: '24 hours'
};

const excludedFindings = [
  'Social engineering attacks',
  'Physical security issues',
  'Denial of service attacks',
  'Rate limiting bypass',
  'Self-XSS without impact',
  'CSRF on logout functionality',
  'Issues requiring user interaction'
];

export function BugBountyProgram() {
  const getSeverityColor = (color: string) => {
    const colors = {
      red: 'bg-red-100 text-red-800',
      orange: 'bg-orange-100 text-orange-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      blue: 'bg-blue-100 text-blue-800'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bug className="h-5 w-5" />
          <CardTitle>Bug Bounty Program</CardTitle>
        </div>
        <CardDescription>
          Responsible disclosure program with rewards for security researchers
        </CardDescription>
        <div className="flex gap-2 mt-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Shield className="h-3 w-3 mr-1" />
            Active Program
          </Badge>
          <Badge variant="outline">Rewards Available</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Program Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="h-4 w-4 text-blue-600" />
              <div className="text-lg font-bold text-blue-600">{programStats.totalResearchers}</div>
            </div>
            <div className="text-xs text-muted-foreground">Security Researchers</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <div className="text-lg font-bold text-green-600">{programStats.vulnerabilitiesFixed}</div>
            </div>
            <div className="text-xs text-muted-foreground">Vulnerabilities Fixed</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <DollarSign className="h-4 w-4 text-purple-600" />
              <div className="text-lg font-bold text-purple-600">{programStats.totalPayouts}</div>
            </div>
            <div className="text-xs text-muted-foreground">Total Payouts</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="h-4 w-4 text-orange-600" />
              <div className="text-lg font-bold text-orange-600">{programStats.averageResponseTime}</div>
            </div>
            <div className="text-xs text-muted-foreground">Response Time</div>
          </div>
        </div>

        {/* Vulnerability Types & Rewards */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Reward Structure
          </h4>
          
          {vulnerabilityTypes.map((type, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(type.color)}>
                      {type.severity}
                    </Badge>
                    <span className="font-semibold text-green-600">{type.reward}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {type.description}
                  </p>
                </div>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-3">
                <h5 className="font-medium text-sm mb-2">Examples:</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {type.examples.map((example, i) => (
                    <li key={i}>• {example}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Scope & Guidelines */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Target className="h-4 w-4" />
            Program Scope
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h5 className="font-medium mb-2 text-green-600">In Scope</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 123legaldoc.com (production)</li>
                <li>• Document generation API</li>
                <li>• User authentication system</li>
                <li>• Payment processing flows</li>
                <li>• Mobile applications</li>
                <li>• Admin dashboard</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-4">
              <h5 className="font-medium mb-2 text-red-600">Out of Scope</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                {excludedFindings.map((finding, i) => (
                  <li key={i}>• {finding}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Submission Guidelines */}
        <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
          <h5 className="font-medium text-blue-800 mb-2">Submission Guidelines</h5>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Provide detailed steps to reproduce the vulnerability</li>
            <li>• Include proof-of-concept code or screenshots</li>
            <li>• Do not access user data or disrupt our services</li>
            <li>• Report only one vulnerability per submission</li>
            <li>• Allow up to 90 days for remediation before disclosure</li>
            <li>• Do not publicly disclose findings until resolution</li>
          </ul>
        </div>

        {/* Legal Safe Harbor */}
        <div className="border border-green-200 bg-green-50 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Shield className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h5 className="font-medium text-green-800">Legal Safe Harbor</h5>
              <p className="text-sm text-green-700 mt-1">
                We provide legal safe harbor for security research conducted under this program. 
                Good faith testing will not result in legal action, provided you follow our guidelines 
                and do not violate applicable laws.
              </p>
            </div>
          </div>
        </div>

        {/* Hall of Fame */}
        <div className="border rounded-lg p-4">
          <h5 className="font-medium mb-3 flex items-center gap-2">
            <Award className="h-4 w-4" />
            Hall of Fame
          </h5>
          <p className="text-sm text-muted-foreground mb-3">
            We recognize and thank security researchers who help make 123LegalDoc more secure:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            <div className="p-2 bg-muted/30 rounded">@security_researcher1</div>
            <div className="p-2 bg-muted/30 rounded">@whitehat_hacker</div>
            <div className="p-2 bg-muted/30 rounded">@bug_hunter_pro</div>
            <div className="p-2 bg-muted/30 rounded">@ethical_hacker</div>
            <div className="p-2 bg-muted/30 rounded">@sec_researcher</div>
            <div className="p-2 bg-muted/30 rounded">@vulnerability_finder</div>
          </div>
        </div>

        {/* Contact & Submission */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1">
              <Mail className="h-4 w-4" />
              Submit Vulnerability
            </Button>
            <Button variant="outline" className="flex-1">
              <ExternalLink className="h-4 w-4" />
              Program Guidelines
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Questions about our bug bounty program? Contact{' '}
              <a href="mailto:security@123legaldoc.com" className="text-primary hover:underline">
                security@123legaldoc.com
              </a>
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> Testing must be conducted against your own accounts or with 
                explicit permission. Unauthorized access to user accounts or data is prohibited and 
                may result in legal action.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}