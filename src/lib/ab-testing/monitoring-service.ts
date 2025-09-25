// Real-time A/B Testing Monitoring and Alerting System
// Automated experiment tracking with statistical significance alerts

import React from 'react';
import {
  experimentEngine,
  type Experiment,
  type ExperimentResults,
} from './experiment-engine';
import { abTestingIntegration } from './integration';

export interface MonitoringAlert {
  id: string;
  experimentId: string;
  type:
    | 'significance_reached'
    | 'sample_size_reached'
    | 'duration_exceeded'
    | 'performance_drop'
    | 'error_rate_high';
  priority: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  data: Record<string, any>;
  createdAt: string;
  acknowledged: boolean;
}

export interface ExperimentHealth {
  experimentId: string;
  status: 'healthy' | 'warning' | 'critical';
  issues: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    message: string;
    recommendation: string;
  }>;
  metrics: {
    sampleSize: number;
    conversionRate: number;
    statisticalPower: number;
    confidenceLevel: number;
    daysRunning: number;
    estimatedTimeToSignificance: number | null;
  };
  lastChecked: string;
}

export interface GrowthMetrics {
  timeframe: '24h' | '7d' | '30d';
  totalRevenue: number;
  revenueImpact: number;
  conversionLift: number;
  experimentsRunning: number;
  experimentsCompleted: number;
  statisticallySignificantWins: number;
  customerLifetimeValueImpact: number;
  topPerformingExperiments: Array<{
    experimentId: string;
    name: string;
    impact: number;
    confidence: number;
  }>;
}

class ExperimentMonitoringService {
  private alerts: MonitoringAlert[] = [];
  private healthChecks: Map<string, ExperimentHealth> = new Map();
  private monitoringInterval: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window === 'undefined') {
      return;
    }
    this.startMonitoring();
  }

  // Real-time monitoring loop
  startMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    // Check experiments every 5 minutes
    this.monitoringInterval = setInterval(
      async () => {
        await this.checkAllExperiments();
      },
      5 * 60 * 1000,
    );

    // Initial check
    this.checkAllExperiments();
  }

  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  async checkAllExperiments(): Promise<void> {
    const runningExperiments = await experimentEngine.getRunningExperiments();

    for (const experiment of runningExperiments) {
      await this.checkExperimentHealth(experiment);
    }
  }

  async checkExperimentHealth(
    experiment: Experiment,
  ): Promise<ExperimentHealth> {
    const results = await experimentEngine.calculateResults(experiment.id);
    const health = await this.analyzeExperimentHealth(experiment, results);

    this.healthChecks.set(experiment.id, health);

    // Generate alerts based on health status
    await this.generateHealthAlerts(experiment, health);

    return health;
  }

  private async analyzeExperimentHealth(
    experiment: Experiment,
    results: ExperimentResults,
  ): Promise<ExperimentHealth> {
    const issues: ExperimentHealth['issues'] = [];
    let status: ExperimentHealth['status'] = 'healthy';

    const daysRunning = Math.floor(
      (Date.now() - new Date(experiment.startDate!).getTime()) /
        (1000 * 60 * 60 * 24),
    );

    // Check sample size
    const totalSampleSize = Object.values(results.sampleSizes).reduce(
      (sum, size) => sum + size,
      0,
    );
    if (totalSampleSize < experiment.minSampleSize) {
      const completionRate = totalSampleSize / experiment.minSampleSize;
      if (completionRate < 0.5 && daysRunning > 7) {
        issues.push({
          type: 'low_sample_size',
          severity: 'medium',
          message: `Sample size is ${Math.round(completionRate * 100)}% of target after ${daysRunning} days`,
          recommendation:
            'Consider increasing traffic allocation or extending duration',
        });
        status = 'warning';
      }
    }

    // Check for statistical significance
    if (results.isStatisticallySignificant && results.confidence >= 0.95) {
      issues.push({
        type: 'significance_reached',
        severity: 'low',
        message: `Experiment has reached statistical significance (${Math.round(results.confidence * 100)}% confidence)`,
        recommendation:
          'Consider stopping experiment and implementing winning variant',
      });
    }

    // Check experiment duration
    if (daysRunning > experiment.estimatedDuration * 1.5) {
      issues.push({
        type: 'duration_exceeded',
        severity: 'medium',
        message: `Experiment running ${Math.round((daysRunning / experiment.estimatedDuration) * 100)}% longer than estimated`,
        recommendation: 'Review experiment design or consider stopping',
      });
      status = 'warning';
    }

    // Check conversion rates for anomalies
    const conversionRates = Object.values(results.conversionRates);
    const avgConversionRate =
      conversionRates.reduce((sum, rate) => sum + rate, 0) /
      conversionRates.length;
    const hasLowPerformingVariant = conversionRates.some(
      (rate) => rate < avgConversionRate * 0.7,
    );

    if (
      hasLowPerformingVariant &&
      totalSampleSize > experiment.minSampleSize * 0.5
    ) {
      issues.push({
        type: 'performance_concern',
        severity: 'high',
        message:
          'One or more variants showing significantly lower conversion rates',
        recommendation: 'Consider stopping underperforming variants',
      });
      status = 'critical';
    }

    // Estimate time to significance
    const estimatedTimeToSignificance = this.estimateTimeToSignificance(
      experiment,
      results,
      totalSampleSize,
      daysRunning,
    );

    return {
      experimentId: experiment.id,
      status,
      issues,
      metrics: {
        sampleSize: totalSampleSize,
        conversionRate: avgConversionRate,
        statisticalPower: results.statisticalPower || 0.8,
        confidenceLevel: results.confidence,
        daysRunning,
        estimatedTimeToSignificance,
      },
      lastChecked: new Date().toISOString(),
    };
  }

  private estimateTimeToSignificance(
    experiment: Experiment,
    results: ExperimentResults,
    currentSampleSize: number,
    daysRunning: number,
  ): number | null {
    if (results.isStatisticallySignificant) return 0;

    const dailySampleRate = currentSampleSize / Math.max(daysRunning, 1);
    const remainingSampleNeeded = Math.max(
      0,
      experiment.minSampleSize - currentSampleSize,
    );

    if (dailySampleRate > 0) {
      return Math.ceil(remainingSampleNeeded / dailySampleRate);
    }

    return null;
  }

  private async generateHealthAlerts(
    experiment: Experiment,
    health: ExperimentHealth,
  ): Promise<void> {
    for (const issue of health.issues) {
      const alertId = `${experiment.id}_${issue.type}_${Date.now()}`;

      const alert: MonitoringAlert = {
        id: alertId,
        experimentId: experiment.id,
        type: issue.type as MonitoringAlert['type'],
        priority:
          issue.severity === 'high'
            ? 'high'
            : issue.severity === 'medium'
              ? 'medium'
              : 'low',
        message: `${experiment.name}: ${issue.message}`,
        data: {
          experiment: experiment.name,
          issue: issue.type,
          recommendation: issue.recommendation,
          health: health.status,
        },
        createdAt: new Date().toISOString(),
        acknowledged: false,
      };

      // Only add if this type of alert doesn't already exist for this experiment
      const existingAlert = this.alerts.find(
        (a) =>
          a.experimentId === experiment.id &&
          a.type === alert.type &&
          !a.acknowledged,
      );

      if (!existingAlert) {
        this.alerts.push(alert);
        await this.sendAlert(alert);
      }
    }
  }

  private async sendAlert(alert: MonitoringAlert): Promise<void> {
    // In a real implementation, this would send emails, Slack notifications, etc.
    console.log(`🚨 A/B Testing Alert: ${alert.message}`);

    // Log to admin dashboard
    if (typeof window !== 'undefined') {
      // Client-side notification
      const event = new CustomEvent('ab-testing-alert', {
        detail: alert,
      });
      window.dispatchEvent(event);
    }
  }

  // Growth tracking and reporting
  async calculateGrowthMetrics(
    timeframe: GrowthMetrics['timeframe'],
  ): Promise<GrowthMetrics> {
    const days = timeframe === '24h' ? 1 : timeframe === '7d' ? 7 : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const experiments = await experimentEngine.getExperimentsByDateRange(
      startDate.toISOString(),
      new Date().toISOString(),
    );

    let totalRevenue = 0;
    let revenueImpact = 0;
    let conversionLift = 0;
    let experimentsRunning = 0;
    let experimentsCompleted = 0;
    let statisticallySignificantWins = 0;
    const topPerformingExperiments: GrowthMetrics['topPerformingExperiments'] =
      [];

    for (const experiment of experiments) {
      const results = await experimentEngine.calculateResults(experiment.id);

      if (experiment.status === 'running') {
        experimentsRunning++;
      } else if (experiment.status === 'completed') {
        experimentsCompleted++;

        if (results.isStatisticallySignificant && results.winningVariant) {
          statisticallySignificantWins++;

          // Calculate revenue impact
          const baselineRevenue = this.calculateBaselineRevenue(
            experiment,
            timeframe,
          );
          const liftPercentage = results.effectSize || 0;
          const experimentRevenueImpact =
            baselineRevenue * (liftPercentage / 100);

          revenueImpact += experimentRevenueImpact;
          totalRevenue += baselineRevenue + experimentRevenueImpact;
          conversionLift += liftPercentage;

          topPerformingExperiments.push({
            experimentId: experiment.id,
            name: experiment.name,
            impact: liftPercentage,
            confidence: results.confidence,
          });
        }
      }
    }

    // Sort top performing experiments
    topPerformingExperiments.sort((a, b) => b.impact - a.impact);

    return {
      timeframe,
      totalRevenue,
      revenueImpact,
      conversionLift:
        conversionLift / Math.max(statisticallySignificantWins, 1),
      experimentsRunning,
      experimentsCompleted,
      statisticallySignificantWins,
      customerLifetimeValueImpact: revenueImpact * 3, // Estimate 3x CLV multiplier
      topPerformingExperiments: topPerformingExperiments.slice(0, 5),
    };
  }

  private calculateBaselineRevenue(
    experiment: Experiment,
    timeframe: GrowthMetrics['timeframe'],
  ): number {
    // Simplified revenue calculation - in practice, this would integrate with analytics
    const avgOrderValue = 35; // Average document price
    const dailyConversions = 50; // Estimated daily conversions
    const days = timeframe === '24h' ? 1 : timeframe === '7d' ? 7 : 30;

    return avgOrderValue * dailyConversions * days;
  }

  // Alert management
  getUnacknowledgedAlerts(): MonitoringAlert[] {
    return this.alerts.filter((alert) => !alert.acknowledged);
  }

  acknowledgeAlert(alertId: string): void {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
    }
  }

  getExperimentHealth(experimentId: string): ExperimentHealth | null {
    return this.healthChecks.get(experimentId) || null;
  }

  getAllExperimentHealth(): ExperimentHealth[] {
    return Array.from(this.healthChecks.values());
  }

  // Automated experiment lifecycle management
  async autoManageExperiments(): Promise<void> {
    const runningExperiments = await experimentEngine.getRunningExperiments();

    for (const experiment of runningExperiments) {
      const results = await experimentEngine.calculateResults(experiment.id);
      const health = this.getExperimentHealth(experiment.id);

      // Auto-stop experiments that have reached significance
      if (
        results.isStatisticallySignificant &&
        results.confidence >= 0.95 &&
        health?.metrics.sampleSize! >= experiment.minSampleSize
      ) {
        await this.autoStopExperiment(experiment, results);
      }

      // Auto-stop experiments running too long without significance
      const daysRunning = Math.floor(
        (Date.now() - new Date(experiment.startDate!).getTime()) /
          (1000 * 60 * 60 * 24),
      );

      if (
        daysRunning > experiment.estimatedDuration * 2 &&
        !results.isStatisticallySignificant
      ) {
        await this.autoStopExperiment(experiment, results, 'timeout');
      }
    }
  }

  private async autoStopExperiment(
    experiment: Experiment,
    results: ExperimentResults,
    reason: 'significance' | 'timeout' = 'significance',
  ): Promise<void> {
    await experimentEngine.stopExperiment(experiment.id);

    const alert: MonitoringAlert = {
      id: `auto_stop_${experiment.id}_${Date.now()}`,
      experimentId: experiment.id,
      type:
        reason === 'significance'
          ? 'significance_reached'
          : 'duration_exceeded',
      priority: 'medium',
      message: `Experiment "${experiment.name}" automatically stopped: ${reason === 'significance' ? 'Statistical significance reached' : 'Maximum duration exceeded'}`,
      data: {
        experiment: experiment.name,
        reason,
        results: {
          isSignificant: results.isStatisticallySignificant,
          confidence: results.confidence,
          winningVariant: results.winningVariant,
        },
      },
      createdAt: new Date().toISOString(),
      acknowledged: false,
    };

    this.alerts.push(alert);
    await this.sendAlert(alert);
  }

  // Performance reporting
  async generatePerformanceReport(): Promise<{
    summary: {
      totalExperiments: number;
      activeExperiments: number;
      completedExperiments: number;
      successRate: number;
      avgImpact: number;
    };
    recentAlerts: MonitoringAlert[];
    healthOverview: {
      healthy: number;
      warning: number;
      critical: number;
    };
    growthMetrics: GrowthMetrics;
  }> {
    const allExperiments = await experimentEngine.getAllExperiments();
    const runningExperiments = allExperiments.filter(
      (e) => e.status === 'running',
    );
    const completedExperiments = allExperiments.filter(
      (e) => e.status === 'completed',
    );

    let totalImpact = 0;
    let significantExperiments = 0;

    for (const experiment of completedExperiments) {
      const results = await experimentEngine.calculateResults(experiment.id);
      if (results.isStatisticallySignificant) {
        significantExperiments++;
        totalImpact += results.effectSize || 0;
      }
    }

    const healthCounts = {
      healthy: 0,
      warning: 0,
      critical: 0,
    };

    this.getAllExperimentHealth().forEach((health) => {
      healthCounts[health.status]++;
    });

    return {
      summary: {
        totalExperiments: allExperiments.length,
        activeExperiments: runningExperiments.length,
        completedExperiments: completedExperiments.length,
        successRate:
          completedExperiments.length > 0
            ? (significantExperiments / completedExperiments.length) * 100
            : 0,
        avgImpact:
          significantExperiments > 0 ? totalImpact / significantExperiments : 0,
      },
      recentAlerts: this.alerts.slice(-10).reverse(),
      healthOverview: healthCounts,
      growthMetrics: await this.calculateGrowthMetrics('7d'),
    };
  }
}

// Singleton instance
export const monitoringService = new ExperimentMonitoringService();

// React hook for monitoring integration
export function useExperimentMonitoring() {
  const [alerts, setAlerts] = React.useState<MonitoringAlert[]>([]);
  const [healthData, setHealthData] = React.useState<ExperimentHealth[]>([]);

  React.useEffect(() => {
    const updateData = () => {
      setAlerts(monitoringService.getUnacknowledgedAlerts());
      setHealthData(monitoringService.getAllExperimentHealth());
    };

    // Initial load
    updateData();

    // Listen for alerts
    const handleAlert = () => updateData();
    if (typeof window !== 'undefined') {
      window.addEventListener('ab-testing-alert', handleAlert);
    }

    // Periodic updates
    const interval = setInterval(updateData, 30000); // Every 30 seconds

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('ab-testing-alert', handleAlert);
      }
      clearInterval(interval);
    };
  }, []);

  const acknowledgeAlert = (alertId: string) => {
    monitoringService.acknowledgeAlert(alertId);
    setAlerts(monitoringService.getUnacknowledgedAlerts());
  };

  return {
    alerts,
    healthData,
    acknowledgeAlert,
  };
}

export type { MonitoringAlert, ExperimentHealth, GrowthMetrics };
