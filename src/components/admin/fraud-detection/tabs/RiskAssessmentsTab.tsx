'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Shield,
  CheckCircle,
  Eye,
  AlertTriangle,
  XCircle,
  Activity,
} from 'lucide-react';

interface RiskAssessmentsTabProps {
  data: any;
  loading?: boolean;
  riskFilter: string;
  onRiskFilterChange: (value: string) => void;
}

const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

const getRiskLevelColor = (level: string) => {
  switch (level) {
    case 'very_low':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'low':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'very_high':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getRecommendationIcon = (recommendation: string) => {
  switch (recommendation) {
    case 'approve':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'review':
      return <Eye className="h-4 w-4 text-yellow-600" />;
    case 'investigate':
      return <AlertTriangle className="h-4 w-4 text-orange-600" />;
    case 'decline':
      return <XCircle className="h-4 w-4 text-red-600" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
};

export function RiskAssessmentsTab({ 
  data: riskAssessments, 
  loading, 
  riskFilter, 
  onRiskFilterChange 
}: RiskAssessmentsTabProps) {
  if (loading || !riskAssessments) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-10 bg-gray-200 rounded w-48"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={riskFilter} onValueChange={onRiskFilterChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by risk level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Risk Levels</SelectItem>
            <SelectItem value="very_high">Very High</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="very_low">Very Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Risk Assessments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Recent Risk Assessments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {riskAssessments.assessments.map(
              (assessment: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="font-semibold text-sm">
                        {assessment.overallScore}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">
                        {assessment.orderId}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {assessment.customerEmail} •{' '}
                        {formatCurrency(assessment.orderValue)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(assessment.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <Badge
                        className={getRiskLevelColor(assessment.riskLevel)}
                      >
                        {assessment.riskLevel.replace('_', ' ')}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        {assessment.processingTime}ms
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getRecommendationIcon(assessment.recommendation)}
                      <span className="text-sm font-medium capitalize">
                        {assessment.recommendation.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}