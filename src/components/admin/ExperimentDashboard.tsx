'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Play,
  Pause,
  BarChart3,
  Target,
  Users,
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Activity,
  Lightbulb,
} from 'lucide-react';
import {
  experimentEngine,
  type Experiment,
  type ExperimentResults,
} from '@/lib/ab-testing/experiment-engine';
import {
  abTestingIntegration,
  useExperimentRecommendations,
} from '@/lib/ab-testing/integration';

interface ExperimentDashboardProps {
  className?: string;
}

export function ExperimentDashboard({ className }: ExperimentDashboardProps) {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [selectedExperiment, setSelectedExperiment] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const {
    recommendations,
    loading: recsLoading,
    refresh: refreshRecommendations,
  } = useExperimentRecommendations();

  useEffect(() => {
    loadExperiments();
  }, []);

  const loadExperiments = async () => {
    try {
      const allExperiments = experimentEngine.getAllExperiments();
      setExperiments(allExperiments);
    } catch (error) {
      console.error('Error loading experiments:', error);
    } finally {
      setLoading(false);
    }
  };

  const runningExperiments = useMemo(
    () => experiments.filter((exp) => exp.status === 'running'),
    [experiments],
  );

  const completedExperiments = useMemo(
    () => experiments.filter((exp) => exp.status === 'completed'),
    [experiments],
  );

  const draftExperiments = useMemo(
    () => experiments.filter((exp) => exp.status === 'draft'),
    [experiments],
  );

  const handleStartExperiment = async (experimentId: string) => {
    try {
      await experimentEngine.startExperiment(experimentId);
      await loadExperiments();
    } catch (error) {
      console.error('Error starting experiment:', error);
    }
  };

  const handleStopExperiment = async (experimentId: string) => {
    try {
      await experimentEngine.stopExperiment(experimentId);
      await loadExperiments();
    } catch (error) {
      console.error('Error stopping experiment:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Running</p>
                <p className="text-2xl font-bold">
                  {runningExperiments.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold">
                  {completedExperiments.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Draft</p>
                <p className="text-2xl font-bold">{draftExperiments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Win Rate</p>
                <p className="text-2xl font-bold">
                  {completedExperiments.length > 0
                    ? Math.round(
                        (completedExperiments.filter(
                          (exp) => exp.results?.status === 'significant_winner',
                        ).length /
                          completedExperiments.length) *
                          100,
                      )
                    : 0}
                  %
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="running" className="space-y-4">
        <TabsList>
          <TabsTrigger value="running">Running Experiments</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="running" className="space-y-4">
          {runningExperiments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Running Experiments
                </h3>
                <p className="text-gray-600 mb-4">
                  Start an experiment from your drafts or create a new one to
                  begin optimizing.
                </p>
                <Button>Create New Experiment</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {runningExperiments.map((experiment) => (
                <ExperimentCard
                  key={experiment.id}
                  experiment={experiment}
                  onStop={() => handleStopExperiment(experiment.id)}
                  onViewDetails={() => setSelectedExperiment(experiment.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4">
            {completedExperiments.map((experiment) => (
              <CompletedExperimentCard
                key={experiment.id}
                experiment={experiment}
                onViewDetails={() => setSelectedExperiment(experiment.id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          <div className="grid gap-4">
            {draftExperiments.map((experiment) => (
              <DraftExperimentCard
                key={experiment.id}
                experiment={experiment}
                onStart={() => handleStartExperiment(experiment.id)}
                onViewDetails={() => setSelectedExperiment(experiment.id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <ExperimentRecommendations
            recommendations={recommendations}
            loading={recsLoading}
            onRefresh={refreshRecommendations}
          />
        </TabsContent>
      </Tabs>

      {/* Experiment Details Modal */}
      {selectedExperiment && (
        <ExperimentDetailsModal
          experimentId={selectedExperiment}
          onClose={() => setSelectedExperiment(null)}
        />
      )}
    </div>
  );
}

function ExperimentCard({
  experiment,
  onStop,
  onViewDetails,
}: {
  experiment: Experiment;
  onStop: () => void;
  onViewDetails: () => void;
}) {
  const daysRunning = Math.floor(
    (new Date().getTime() - new Date(experiment.startDate).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  const progress = Math.min(
    (daysRunning / experiment.estimatedDuration) * 100,
    100,
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{experiment.name}</CardTitle>
            <CardDescription>{experiment.description}</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="default">
              <Activity className="h-3 w-3 mr-1" />
              Running
            </Badge>
            <Button variant="outline" size="sm" onClick={onViewDetails}>
              <BarChart3 className="h-4 w-4 mr-1" />
              View Results
            </Button>
            <Button variant="outline" size="sm" onClick={onStop}>
              <Pause className="h-4 w-4 mr-1" />
              Stop
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Progress</p>
            <Progress value={progress} className="mb-2" />
            <p className="text-xs text-gray-500">
              {daysRunning} of {experiment.estimatedDuration} days
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Primary Metric
            </p>
            <p className="text-sm font-semibold">
              {experiment.primaryMetric.name}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              Goal: {experiment.primaryMetric.goal}{' '}
              {experiment.primaryMetric.type}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Traffic Split
            </p>
            <div className="space-y-1">
              {experiment.variants.map((variant) => (
                <div key={variant.id} className="flex justify-between text-xs">
                  <span className={variant.isControl ? 'font-semibold' : ''}>
                    {variant.name} {variant.isControl && '(Control)'}
                  </span>
                  <span>{variant.trafficAllocation}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {experiment.results && (
          <div className="mt-4 pt-4 border-t">
            <ExperimentResultsSummary results={experiment.results} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CompletedExperimentCard({
  experiment,
  onViewDetails,
}: {
  experiment: Experiment;
  onViewDetails: () => void;
}) {
  const results = experiment.results;
  const winnerVariant = results?.winningVariant
    ? experiment.variants.find((v) => v.id === results.winningVariant)
    : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{experiment.name}</CardTitle>
            <CardDescription>{experiment.description}</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant={
                results?.status === 'significant_winner'
                  ? 'default'
                  : 'secondary'
              }
            >
              {results?.status === 'significant_winner' && (
                <TrendingUp className="h-3 w-3 mr-1" />
              )}
              {results?.status === 'significant_loser' && (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {results?.status === 'no_significant_difference' && (
                <XCircle className="h-3 w-3 mr-1" />
              )}
              {results?.status === 'insufficient_data' && (
                <AlertTriangle className="h-3 w-3 mr-1" />
              )}
              {results?.status.replace('_', ' ').toUpperCase()}
            </Badge>
            <Button variant="outline" size="sm" onClick={onViewDetails}>
              <BarChart3 className="h-4 w-4 mr-1" />
              View Details
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Winner</p>
            <p className="text-sm font-semibold">
              {winnerVariant?.name || 'No significant difference'}
            </p>
            <p className="text-xs text-gray-500">
              {results?.confidence &&
                `${(results.confidence * 100).toFixed(1)}% confidence`}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Revenue Impact
            </p>
            {results?.estimatedRevenueImpact ? (
              <>
                <p className="text-sm font-semibold">
                  $
                  {results.estimatedRevenueImpact.monthlyImpact.toLocaleString()}
                  /mo
                </p>
                <p className="text-xs text-gray-500">
                  Estimated monthly impact
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-500">Not calculated</p>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Duration</p>
            <p className="text-sm">
              {experiment.startDate &&
                experiment.endDate &&
                Math.floor(
                  (new Date(experiment.endDate).getTime() -
                    new Date(experiment.startDate).getTime()) /
                    (1000 * 60 * 60 * 24),
                )}{' '}
              days
            </p>
            <p className="text-xs text-gray-500">
              {new Date(experiment.startDate).toLocaleDateString()} -{' '}
              {experiment.endDate &&
                new Date(experiment.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DraftExperimentCard({
  experiment,
  onStart,
  onViewDetails,
}: {
  experiment: Experiment;
  onStart: () => void;
  onViewDetails: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{experiment.name}</CardTitle>
            <CardDescription>{experiment.description}</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              <Clock className="h-3 w-3 mr-1" />
              Draft
            </Badge>
            <Button variant="outline" size="sm" onClick={onViewDetails}>
              Edit
            </Button>
            <Button size="sm" onClick={onStart}>
              <Play className="h-4 w-4 mr-1" />
              Start
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Hypothesis</p>
            <p className="text-sm">{experiment.hypothesis}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Target Audience
            </p>
            <p className="text-sm">
              {experiment.targetAudience.percentage}% of users
            </p>
            {experiment.targetAudience.roles && (
              <p className="text-xs text-gray-500">
                Roles: {experiment.targetAudience.roles.join(', ')}
              </p>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              Estimated Duration
            </p>
            <p className="text-sm">{experiment.estimatedDuration} days</p>
            <p className="text-xs text-gray-500">
              Min sample: {experiment.minSampleSize.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ExperimentResultsSummary({ results }: { results: ExperimentResults }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
      <div>
        <p className="font-medium text-gray-600 mb-1">Status</p>
        <div className="flex items-center space-x-1">
          {results.status === 'significant_winner' && (
            <TrendingUp className="h-4 w-4 text-green-600" />
          )}
          {results.status === 'significant_loser' && (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
          {results.status === 'no_significant_difference' && (
            <XCircle className="h-4 w-4 text-gray-600" />
          )}
          {results.status === 'insufficient_data' && (
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          )}
          <span className="capitalize">{results.status.replace('_', ' ')}</span>
        </div>
      </div>

      <div>
        <p className="font-medium text-gray-600 mb-1">Confidence</p>
        <p>{(results.confidence * 100).toFixed(1)}%</p>
      </div>

      <div>
        <p className="font-medium text-gray-600 mb-1">Sample Size</p>
        <p>
          {Object.values(results.sampleSizes)
            .reduce((sum, size) => sum + size, 0)
            .toLocaleString()}
        </p>
      </div>
    </div>
  );
}

function ExperimentRecommendations({
  recommendations,
  loading,
  onRefresh,
}: {
  recommendations: any[];
  loading: boolean;
  onRefresh: () => void;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Experiment Recommendations</h3>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <Lightbulb className="h-4 w-4 mr-1" />
          Refresh
        </Button>
      </div>

      {recommendations.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Recommendations
            </h3>
            <p className="text-gray-600">
              All key metrics are performing well. Check back later for new
              opportunities.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {recommendations.map((rec, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{rec.title}</CardTitle>
                    <CardDescription>{rec.description}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        rec.priority === 'high'
                          ? 'destructive'
                          : rec.priority === 'medium'
                            ? 'default'
                            : 'secondary'
                      }
                    >
                      {rec.priority} priority
                    </Badge>
                    <Badge variant="outline">
                      +{rec.estimatedImpact}% impact
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Hypothesis
                    </p>
                    <p className="text-sm">{rec.suggestedTest.hypothesis}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-600 mb-1">Variants</p>
                      <ul className="space-y-1">
                        {rec.suggestedTest.variants.map(
                          (variant: string, idx: number) => (
                            <li key={idx} className="text-gray-700">
                              • {variant}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>

                    <div>
                      <p className="font-medium text-gray-600 mb-1">Metrics</p>
                      <ul className="space-y-1">
                        {rec.suggestedTest.metrics.map(
                          (metric: string, idx: number) => (
                            <li key={idx} className="text-gray-700">
                              • {metric}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>

                    <div>
                      <p className="font-medium text-gray-600 mb-1">Effort</p>
                      <Badge variant="outline" className="capitalize">
                        {rec.effort}
                      </Badge>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <Button>Create Experiment</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ExperimentDetailsModal({
  experimentId,
  onClose,
}: {
  experimentId: string;
  onClose: () => void;
}) {
  const [experiment, setExperiment] = useState<Experiment | null>(null);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    const exp = experimentEngine.getExperiment(experimentId);
    setExperiment(exp || null);

    if (exp?.results) {
      abTestingIntegration
        .getExperimentResultsWithFunnelInsights(experimentId)
        .then(setResults)
        .catch(console.error);
    }
  }, [experimentId]);

  if (!experiment) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{experiment.name}</h2>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        <div className="p-6">
          {/* Experiment details and results would go here */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">
                Experiment Configuration
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>
                  <strong>Hypothesis:</strong> {experiment.hypothesis}
                </p>
                <p>
                  <strong>Status:</strong> {experiment.status}
                </p>
                <p>
                  <strong>Duration:</strong> {experiment.estimatedDuration} days
                </p>
              </div>
            </div>

            {experiment.results && (
              <div>
                <h3 className="text-lg font-medium mb-2">Results</h3>
                <ExperimentResultsSummary results={experiment.results} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
