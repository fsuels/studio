// src/components/translation/TranslationQualityDashboard.tsx
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Brain,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Shield,
  Scale,
  Globe,
  BookOpen,
  Settings,
  Download,
  RefreshCw,
  Target,
  Zap,
  Award,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QualityMetrics {
  overall: number;
  breakdown: {
    linguisticAccuracy: number;
    legalTerminology: number;
    contextualRelevance: number;
    structuralIntegrity: number;
    jurisdictionalCompliance: number;
  };
  factors: QualityFactor[];
  recommendations: string[];
  riskAssessment: RiskAssessment;
  benchmarks: QualityBenchmarks;
  trends: QualityTrends;
}

interface QualityFactor {
  category: string;
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
  score: number;
  description: string;
}

interface RiskAssessment {
  level: 'low' | 'medium' | 'high' | 'critical';
  factors: string[];
  mitigationStrategies: string[];
  reviewRequirements: string[];
}

interface QualityBenchmarks {
  industryAverage: number;
  topPerformer: number;
  minimumAcceptable: number;
  targetScore: number;
}

interface QualityTrends {
  improvement: number;
  consistencyScore: number;
  recentTranslations: Array<{
    date: Date;
    score: number;
    documentType: string;
  }>;
}

interface TranslationQualityDashboardProps {
  translationId: string;
  qualityMetrics: QualityMetrics;
  onRefresh?: () => void;
  onExportReport?: () => void;
  className?: string;
}

const TranslationQualityDashboard: React.FC<
  TranslationQualityDashboardProps
> = ({
  translationId,
  qualityMetrics,
  onRefresh,
  onExportReport,
  className,
}) => {
  const { t } = useTranslation('quality');
  const [activeTab, setActiveTab] = React.useState<
    'overview' | 'breakdown' | 'factors' | 'recommendations'
  >('overview');

  const getScoreColor = (score: number) => {
    if (score >= 0.85) return 'text-green-600';
    if (score >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 0.85) return 'bg-green-100 border-green-200';
    if (score >= 0.7) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (improvement: number) => {
    if (improvement > 0.05)
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (improvement < -0.05)
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <BarChart3 className="h-4 w-4 text-gray-600" />;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'linguistic':
        return <Globe className="h-4 w-4" />;
      case 'terminology':
        return <BookOpen className="h-4 w-4" />;
      case 'contextual':
        return <Target className="h-4 w-4" />;
      case 'structural':
        return <Settings className="h-4 w-4" />;
      case 'jurisdictional':
        return <Scale className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Translation Quality Analysis
              <Badge variant="outline" className="ml-2">
                ID: {translationId.slice(-8)}
              </Badge>
            </CardTitle>

            <div className="flex items-center gap-2">
              {onRefresh && (
                <Button variant="outline" size="sm" onClick={onRefresh}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
              {onExportReport && (
                <Button variant="outline" size="sm" onClick={onExportReport}>
                  <Download className="h-4 w-4 mr-1" />
                  Export Report
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Overview Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Score */}
        <Card
          className={cn('col-span-1', getScoreBgColor(qualityMetrics.overall))}
        >
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {Math.round(qualityMetrics.overall * 100)}%
              </div>
              <div className="text-sm font-medium mb-4">
                Overall Quality Score
              </div>

              <div className="relative w-32 h-32 mx-auto">
                <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                <div
                  className={cn(
                    'absolute inset-0 rounded-full border-8 border-transparent',
                    qualityMetrics.overall >= 0.85
                      ? 'border-t-green-500 border-r-green-500'
                      : qualityMetrics.overall >= 0.7
                        ? 'border-t-yellow-500 border-r-yellow-500'
                        : 'border-t-red-500 border-r-red-500',
                  )}
                  style={{
                    transform: `rotate(${qualityMetrics.overall * 360}deg)`,
                    transition: 'transform 1s ease-in-out',
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Award
                    className={cn(
                      'h-8 w-8',
                      getScoreColor(qualityMetrics.overall),
                    )}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Assessment */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Risk Level</span>
              <Badge
                className={getRiskColor(qualityMetrics.riskAssessment.level)}
              >
                {qualityMetrics.riskAssessment.level.toUpperCase()}
              </Badge>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="text-sm font-medium">Key Risk Factors:</div>
              {qualityMetrics.riskAssessment.factors
                .slice(0, 3)
                .map((factor, index) => (
                  <div key={index} className="flex items-start gap-2 text-xs">
                    <AlertTriangle className="h-3 w-3 text-amber-500 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{factor}</span>
                  </div>
                ))}
            </div>

            {qualityMetrics.riskAssessment.reviewRequirements.length > 0 && (
              <>
                <Separator />
                <div className="space-y-1">
                  <div className="text-sm font-medium">Review Required:</div>
                  <div className="text-xs text-muted-foreground">
                    {qualityMetrics.riskAssessment.reviewRequirements[0]}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Performance Trends */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Improvement</span>
              <div className="flex items-center gap-1">
                {getTrendIcon(qualityMetrics.trends.improvement)}
                <span
                  className={cn(
                    'text-sm font-medium',
                    qualityMetrics.trends.improvement > 0
                      ? 'text-green-600'
                      : qualityMetrics.trends.improvement < 0
                        ? 'text-red-600'
                        : 'text-gray-600',
                  )}
                >
                  {qualityMetrics.trends.improvement > 0 ? '+' : ''}
                  {Math.round(qualityMetrics.trends.improvement * 100)}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Consistency</span>
              <div className="flex items-center gap-2">
                <Progress
                  value={qualityMetrics.trends.consistencyScore * 100}
                  className="w-16 h-2"
                />
                <span className="text-sm text-muted-foreground">
                  {Math.round(qualityMetrics.trends.consistencyScore * 100)}%
                </span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="text-sm font-medium">Recent Translations:</div>
              {qualityMetrics.trends.recentTranslations
                .slice(0, 3)
                .map((translation, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-muted-foreground">
                      {translation.documentType}
                    </span>
                    <span className={getScoreColor(translation.score)}>
                      {Math.round(translation.score * 100)}%
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quality Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quality Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(qualityMetrics.breakdown).map(
              ([category, score]) => (
                <QualityMetricCard
                  key={category}
                  category={category}
                  score={score}
                  benchmark={qualityMetrics.benchmarks.industryAverage}
                  icon={getCategoryIcon(category.toLowerCase())}
                />
              ),
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detailed Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {/* Quality Factors */}
            <AccordionItem value="factors">
              <AccordionTrigger className="text-sm font-medium">
                Quality Factors ({qualityMetrics.factors.length})
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  {qualityMetrics.factors.map((factor, index) => (
                    <QualityFactorItem key={index} factor={factor} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Recommendations */}
            <AccordionItem value="recommendations">
              <AccordionTrigger className="text-sm font-medium">
                Recommendations ({qualityMetrics.recommendations.length})
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {qualityMetrics.recommendations.map(
                    (recommendation, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <Zap className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                        <span>{recommendation}</span>
                      </div>
                    ),
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Benchmarks */}
            <AccordionItem value="benchmarks">
              <AccordionTrigger className="text-sm font-medium">
                Industry Benchmarks
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <BenchmarkCard
                    title="Industry Average"
                    value={qualityMetrics.benchmarks.industryAverage}
                    comparison={
                      qualityMetrics.overall -
                      qualityMetrics.benchmarks.industryAverage
                    }
                  />
                  <BenchmarkCard
                    title="Top Performer"
                    value={qualityMetrics.benchmarks.topPerformer}
                    comparison={
                      qualityMetrics.overall -
                      qualityMetrics.benchmarks.topPerformer
                    }
                  />
                  <BenchmarkCard
                    title="Target Score"
                    value={qualityMetrics.benchmarks.targetScore}
                    comparison={
                      qualityMetrics.overall -
                      qualityMetrics.benchmarks.targetScore
                    }
                  />
                  <BenchmarkCard
                    title="Minimum Required"
                    value={qualityMetrics.benchmarks.minimumAcceptable}
                    comparison={
                      qualityMetrics.overall -
                      qualityMetrics.benchmarks.minimumAcceptable
                    }
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

// Quality Metric Card Component
const QualityMetricCard: React.FC<{
  category: string;
  score: number;
  benchmark: number;
  icon: React.ReactNode;
}> = ({ category, score, benchmark, icon }) => {
  const getScoreColor = (score: number) => {
    if (score >= 0.85) return 'text-green-600';
    if (score >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatCategoryName = (category: string) => {
    return category
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="h-24 cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">{icon}</div>
                <div className={cn('text-lg font-bold', getScoreColor(score))}>
                  {Math.round(score * 100)}%
                </div>
              </div>
              <div className="text-xs font-medium text-center">
                {formatCategoryName(category)}
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-center">
            <div className="font-medium">{formatCategoryName(category)}</div>
            <div className="text-sm">Score: {Math.round(score * 100)}%</div>
            <div className="text-sm">
              Benchmark: {Math.round(benchmark * 100)}%
            </div>
            <div
              className={cn(
                'text-sm',
                score >= benchmark ? 'text-green-600' : 'text-red-600',
              )}
            >
              {score >= benchmark ? '↑' : '↓'}{' '}
              {Math.abs(score - benchmark).toFixed(2)}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Quality Factor Item Component
const QualityFactorItem: React.FC<{ factor: QualityFactor }> = ({ factor }) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive':
        return 'text-green-600 bg-green-100';
      case 'negative':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <CheckCircle className="h-3 w-3" />;
      case 'negative':
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return <BarChart3 className="h-3 w-3" />;
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 border rounded-lg">
      <div className="shrink-0 mt-0.5">{getCategoryIcon(factor.category)}</div>

      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="font-medium text-sm">
            {factor.factor.replace(/_/g, ' ')}
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn('text-xs', getImpactColor(factor.impact))}
            >
              <div className="flex items-center gap-1">
                {getImpactIcon(factor.impact)}
                {factor.impact}
              </div>
            </Badge>
            <span className="text-sm font-medium">
              {Math.round(factor.score * 100)}%
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{factor.description}</p>
        <div className="flex items-center gap-2">
          <Progress value={factor.score * 100} className="flex-1 h-2" />
          <span className="text-xs text-muted-foreground">
            Weight: {Math.round(factor.weight * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

// Benchmark Card Component
const BenchmarkCard: React.FC<{
  title: string;
  value: number;
  comparison: number;
}> = ({ title, value, comparison }) => {
  return (
    <Card>
      <CardContent className="p-3 text-center">
        <div className="text-lg font-bold">{Math.round(value * 100)}%</div>
        <div className="text-xs text-muted-foreground mb-2">{title}</div>
        <div
          className={cn(
            'text-xs font-medium',
            comparison >= 0 ? 'text-green-600' : 'text-red-600',
          )}
        >
          {comparison >= 0 ? '+' : ''}
          {Math.round(comparison * 100)}%
        </div>
      </CardContent>
    </Card>
  );
};

export default TranslationQualityDashboard;
