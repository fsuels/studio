// Automated A/B Testing Lifecycle Management
// Intelligent experiment automation with performance-based decisions

import {
  experimentEngine,
  type Experiment,
  type ExperimentResults,
} from './experiment-engine';
import { monitoringService, type ExperimentHealth } from './monitoring-service';
import { alertSystem } from './alert-system';
import {
  ALL_EXPERIMENT_TEMPLATES,
  createExperimentFromTemplate,
} from './experiment-templates';
import {
  ALL_COMPLEX_FLOW_EXPERIMENTS,
  createComplexFlowExperiment,
} from './complex-flow-experiments';

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  trigger: {
    type:
      | 'time_based'
      | 'performance_based'
      | 'significance_based'
      | 'sample_size_based';
    conditions: Record<string, any>;
  };
  action: {
    type:
      | 'stop_experiment'
      | 'start_experiment'
      | 'reallocate_traffic'
      | 'create_followup'
      | 'implement_winner';
    parameters: Record<string, any>;
  };
  cooldownHours: number;
  lastExecuted?: string;
}

export interface AutomationPolicy {
  autoStopOnSignificance: boolean;
  autoStopOnTimeout: boolean;
  autoImplementWinners: boolean;
  autoCreateFollowups: boolean;
  minimumConfidenceLevel: number;
  maximumDurationMultiplier: number;
  minimumSampleSizeMultiplier: number;
  performanceThresholds: {
    criticalDropPercentage: number;
    warningDropPercentage: number;
  };
}

export interface ExperimentQueue {
  id: string;
  priority: number;
  templateId?: string;
  complexFlowId?: string;
  scheduledStart: string;
  dependencies?: string[]; // Experiment IDs that must complete first
  autoStart: boolean;
  reason: string;
}

class AutomationEngineService {
  private rules: AutomationRule[] = [];
  private policy: AutomationPolicy;
  private experimentQueue: ExperimentQueue[] = [];
  private automationInterval: NodeJS.Timeout | null = null;
  private running = false;

  constructor() {
    this.policy = this.getDefaultPolicy();
    this.initializeDefaultRules();
    this.startAutomation();
  }

  private getDefaultPolicy(): AutomationPolicy {
    return {
      autoStopOnSignificance: true,
      autoStopOnTimeout: true,
      autoImplementWinners: false, // Requires manual approval for safety
      autoCreateFollowups: true,
      minimumConfidenceLevel: 0.95,
      maximumDurationMultiplier: 2.0,
      minimumSampleSizeMultiplier: 1.0,
      performanceThresholds: {
        criticalDropPercentage: 25,
        warningDropPercentage: 15,
      },
    };
  }

  private initializeDefaultRules(): void {
    // Auto-stop on statistical significance
    this.addRule({
      id: 'auto_stop_significance',
      name: 'Auto-stop Significant Experiments',
      description:
        'Automatically stop experiments that reach statistical significance',
      enabled: true,
      trigger: {
        type: 'significance_based',
        conditions: {
          minimumConfidence: 0.95,
          minimumSampleSize: 1000,
          minimumDaysRunning: 3,
        },
      },
      action: {
        type: 'stop_experiment',
        parameters: {
          reason: 'Statistical significance achieved',
          notifyStakeholders: true,
        },
      },
      cooldownHours: 0,
    });

    // Auto-stop on timeout
    this.addRule({
      id: 'auto_stop_timeout',
      name: 'Auto-stop Timed-out Experiments',
      description: 'Stop experiments running too long without significance',
      enabled: true,
      trigger: {
        type: 'time_based',
        conditions: {
          durationMultiplier: 2.0,
          noSignificance: true,
        },
      },
      action: {
        type: 'stop_experiment',
        parameters: {
          reason: 'Maximum duration exceeded',
          notifyStakeholders: true,
        },
      },
      cooldownHours: 24,
    });

    // Auto-reallocate traffic from poor performers
    this.addRule({
      id: 'auto_reallocate_traffic',
      name: 'Reallocate Traffic from Poor Performers',
      description: 'Reduce traffic to variants performing significantly worse',
      enabled: true,
      trigger: {
        type: 'performance_based',
        conditions: {
          performanceDropPercentage: 20,
          minimumSampleSize: 500,
          confidenceLevel: 0.9,
        },
      },
      action: {
        type: 'reallocate_traffic',
        parameters: {
          reduceTrafficTo: 10,
          redistributeToOthers: true,
        },
      },
      cooldownHours: 12,
    });

    // Auto-create follow-up experiments
    this.addRule({
      id: 'auto_create_followups',
      name: 'Create Follow-up Experiments',
      description: 'Automatically queue follow-up experiments for winners',
      enabled: true,
      trigger: {
        type: 'significance_based',
        conditions: {
          minimumConfidence: 0.95,
          minimumImpact: 10,
        },
      },
      action: {
        type: 'create_followup',
        parameters: {
          basedOnWinner: true,
          queueForLater: true,
        },
      },
      cooldownHours: 0,
    });

    // Emergency stop for critical performance drops
    this.addRule({
      id: 'emergency_stop_critical',
      name: 'Emergency Stop Critical Performance',
      description: 'Immediately stop variants with critical performance issues',
      enabled: true,
      trigger: {
        type: 'performance_based',
        conditions: {
          performanceDropPercentage: 30,
          minimumSampleSize: 100,
          emergencyLevel: true,
        },
      },
      action: {
        type: 'stop_experiment',
        parameters: {
          reason: 'Critical performance degradation',
          emergencyStop: true,
          notifyStakeholders: true,
        },
      },
      cooldownHours: 0,
    });

    // Auto-start queued experiments
    this.addRule({
      id: 'auto_start_queued',
      name: 'Auto-start Queued Experiments',
      description: 'Start experiments from queue when capacity allows',
      enabled: true,
      trigger: {
        type: 'time_based',
        conditions: {
          maxConcurrentExperiments: 5,
          checkInterval: 60, // minutes
        },
      },
      action: {
        type: 'start_experiment',
        parameters: {
          fromQueue: true,
        },
      },
      cooldownHours: 1,
    });
  }

  addRule(rule: AutomationRule): void {
    this.rules.push(rule);
  }

  updateRule(ruleId: string, updates: Partial<AutomationRule>): void {
    const index = this.rules.findIndex((r) => r.id === ruleId);
    if (index !== -1) {
      this.rules[index] = { ...this.rules[index], ...updates };
    }
  }

  getRules(): AutomationRule[] {
    return this.rules;
  }

  updatePolicy(policy: Partial<AutomationPolicy>): void {
    this.policy = { ...this.policy, ...policy };
  }

  getPolicy(): AutomationPolicy {
    return this.policy;
  }

  // Main automation loop
  startAutomation(): void {
    if (this.automationInterval) {
      clearInterval(this.automationInterval);
    }

    this.running = true;
    console.log('🤖 A/B Testing Automation Engine started');

    // Run automation checks every 5 minutes
    this.automationInterval = setInterval(
      async () => {
        if (this.running) {
          await this.runAutomationCycle();
        }
      },
      5 * 60 * 1000,
    );

    // Initial run
    setTimeout(() => this.runAutomationCycle(), 1000);
  }

  stopAutomation(): void {
    this.running = false;
    if (this.automationInterval) {
      clearInterval(this.automationInterval);
      this.automationInterval = null;
    }
    console.log('🤖 A/B Testing Automation Engine stopped');
  }

  private async runAutomationCycle(): Promise<void> {
    try {
      console.log('🔄 Running automation cycle...');

      // Get all running experiments
      const runningExperiments = await experimentEngine.getRunningExperiments();

      // Process each experiment against automation rules
      for (const experiment of runningExperiments) {
        await this.processExperimentAutomation(experiment);
      }

      // Process experiment queue
      await this.processExperimentQueue();

      // Generate insights and recommendations
      await this.generateAutomationInsights();
    } catch (error) {
      console.error('❌ Automation cycle failed:', error);
    }
  }

  private async processExperimentAutomation(
    experiment: Experiment,
  ): Promise<void> {
    const results = await experimentEngine.calculateResults(experiment.id);
    const health = monitoringService.getExperimentHealth(experiment.id);

    for (const rule of this.rules.filter((r) => r.enabled)) {
      if (this.isRuleOnCooldown(rule)) {
        continue;
      }

      if (await this.shouldTriggerRule(rule, experiment, results, health)) {
        await this.executeRule(rule, experiment, results);
        rule.lastExecuted = new Date().toISOString();
      }
    }
  }

  private isRuleOnCooldown(rule: AutomationRule): boolean {
    if (!rule.lastExecuted || rule.cooldownHours === 0) {
      return false;
    }

    const lastExecuted = new Date(rule.lastExecuted);
    const cooldownEnd = new Date(
      lastExecuted.getTime() + rule.cooldownHours * 60 * 60 * 1000,
    );

    return new Date() < cooldownEnd;
  }

  private async shouldTriggerRule(
    rule: AutomationRule,
    experiment: Experiment,
    results: ExperimentResults,
    health: ExperimentHealth | null,
  ): Promise<boolean> {
    const { trigger } = rule;

    switch (trigger.type) {
      case 'significance_based':
        return (
          results.isStatisticallySignificant &&
          results.confidence >=
            (trigger.conditions.minimumConfidence || 0.95) &&
          this.getSampleSize(results) >=
            (trigger.conditions.minimumSampleSize || 1000) &&
          this.getDaysRunning(experiment) >=
            (trigger.conditions.minimumDaysRunning || 1)
        );

      case 'time_based':
        const daysRunning = this.getDaysRunning(experiment);
        const maxDuration =
          experiment.estimatedDuration *
          (trigger.conditions.durationMultiplier || 2);
        const exceededDuration = daysRunning > maxDuration;
        const noSignificance = trigger.conditions.noSignificance
          ? !results.isStatisticallySignificant
          : true;

        return exceededDuration && noSignificance;

      case 'performance_based':
        return this.hasPerformanceIssue(results, trigger.conditions);

      case 'sample_size_based':
        const sampleSize = this.getSampleSize(results);
        const targetSize =
          experiment.minSampleSize *
          (trigger.conditions.sampleSizeMultiplier || 1);
        return sampleSize >= targetSize;

      default:
        return false;
    }
  }

  private async executeRule(
    rule: AutomationRule,
    experiment: Experiment,
    results: ExperimentResults,
  ): Promise<void> {
    const { action } = rule;

    console.log(
      `🤖 Executing automation rule: ${rule.name} for experiment ${experiment.name}`,
    );

    switch (action.type) {
      case 'stop_experiment':
        await this.autoStopExperiment(experiment, results, action.parameters);
        break;

      case 'start_experiment':
        await this.autoStartExperiment(action.parameters);
        break;

      case 'reallocate_traffic':
        await this.autoReallocateTraffic(
          experiment,
          results,
          action.parameters,
        );
        break;

      case 'create_followup':
        await this.autoCreateFollowup(experiment, results, action.parameters);
        break;

      case 'implement_winner':
        await this.autoImplementWinner(experiment, results, action.parameters);
        break;
    }
  }

  private async autoStopExperiment(
    experiment: Experiment,
    results: ExperimentResults,
    parameters: Record<string, any>,
  ): Promise<void> {
    await experimentEngine.stopExperiment(experiment.id);

    console.log(
      `⏹️ Auto-stopped experiment: ${experiment.name} - ${parameters.reason}`,
    );

    if (parameters.notifyStakeholders) {
      await alertSystem.processAlert(
        {
          id: `auto_stop_${experiment.id}_${Date.now()}`,
          experimentId: experiment.id,
          type: 'significance_reached',
          priority: parameters.emergencyStop ? 'critical' : 'medium',
          message: `Experiment "${experiment.name}" automatically stopped: ${parameters.reason}`,
          data: {
            reason: parameters.reason,
            isEmergency: parameters.emergencyStop || false,
            results: {
              isSignificant: results.isStatisticallySignificant,
              confidence: results.confidence,
              winningVariant: results.winningVariant,
            },
          },
          createdAt: new Date().toISOString(),
          acknowledged: false,
        },
        experiment,
        results,
      );
    }
  }

  private async autoStartExperiment(
    parameters: Record<string, any>,
  ): Promise<void> {
    if (parameters.fromQueue) {
      const readyExperiments = this.getReadyQueuedExperiments();
      const currentRunning = await experimentEngine.getRunningExperiments();
      const maxConcurrent = parameters.maxConcurrentExperiments || 5;

      if (
        currentRunning.length < maxConcurrent &&
        readyExperiments.length > 0
      ) {
        const nextExperiment = readyExperiments[0];
        await this.startQueuedExperiment(nextExperiment);
      }
    }
  }

  private async autoReallocateTraffic(
    experiment: Experiment,
    results: ExperimentResults,
    parameters: Record<string, any>,
  ): Promise<void> {
    // Identify poor-performing variants
    const conversionRates = results.conversionRates;
    const avgConversionRate =
      Object.values(conversionRates).reduce((sum, rate) => sum + rate, 0) /
      Object.keys(conversionRates).length;

    const poorPerformers = Object.entries(conversionRates).filter(
      ([_, rate]) => rate < avgConversionRate * 0.8,
    );

    // This would integrate with your experiment engine to update traffic allocation
    console.log(
      `🔄 Auto-reallocating traffic for experiment ${experiment.name}`,
    );
    console.log(
      `Poor performers: ${poorPerformers.map(([id]) => id).join(', ')}`,
    );

    // Log the action
    await alertSystem.processAlert(
      {
        id: `traffic_realloc_${experiment.id}_${Date.now()}`,
        experimentId: experiment.id,
        type: 'performance_drop',
        priority: 'medium',
        message: `Traffic automatically reallocated for experiment "${experiment.name}" due to poor performance`,
        data: {
          poorPerformers: poorPerformers.map(([id]) => id),
          newAllocation: parameters.reduceTrafficTo || 10,
        },
        createdAt: new Date().toISOString(),
        acknowledged: false,
      },
      experiment,
      results,
    );
  }

  private async autoCreateFollowup(
    experiment: Experiment,
    results: ExperimentResults,
    parameters: Record<string, any>,
  ): Promise<void> {
    if (!results.winningVariant) return;

    // Generate follow-up experiment based on the winning variant
    const followupId = await this.generateFollowupExperiment(
      experiment,
      results,
    );

    if (followupId && parameters.queueForLater) {
      this.queueExperiment({
        id: followupId,
        priority: 2,
        templateId: followupId,
        scheduledStart: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000,
        ).toISOString(), // Start in 1 week
        dependencies: [experiment.id],
        autoStart: true,
        reason: `Follow-up to successful experiment: ${experiment.name}`,
      });
    }
  }

  private async autoImplementWinner(
    experiment: Experiment,
    results: ExperimentResults,
    parameters: Record<string, any>,
  ): Promise<void> {
    if (!results.winningVariant || !this.policy.autoImplementWinners) {
      return;
    }

    // This would integrate with your deployment system
    console.log(
      `🚀 Auto-implementing winner for experiment ${experiment.name}: ${results.winningVariant}`,
    );

    // Log the implementation
    await alertSystem.processAlert(
      {
        id: `auto_implement_${experiment.id}_${Date.now()}`,
        experimentId: experiment.id,
        type: 'significance_reached',
        priority: 'high',
        message: `Winning variant automatically implemented for experiment "${experiment.name}"`,
        data: {
          winningVariant: results.winningVariant,
          impact: results.effectSize,
          confidence: results.confidence,
        },
        createdAt: new Date().toISOString(),
        acknowledged: false,
      },
      experiment,
      results,
    );
  }

  // Utility methods
  private getSampleSize(results: ExperimentResults): number {
    return Object.values(results.sampleSizes).reduce(
      (sum, size) => sum + size,
      0,
    );
  }

  private getDaysRunning(experiment: Experiment): number {
    if (!experiment.startDate) return 0;
    return Math.floor(
      (Date.now() - new Date(experiment.startDate).getTime()) /
        (1000 * 60 * 60 * 24),
    );
  }

  private hasPerformanceIssue(
    results: ExperimentResults,
    conditions: Record<string, any>,
  ): boolean {
    const conversionRates = Object.values(results.conversionRates);
    const avgRate =
      conversionRates.reduce((sum, rate) => sum + rate, 0) /
      conversionRates.length;
    const minRate = Math.min(...conversionRates);

    const dropPercentage = ((avgRate - minRate) / avgRate) * 100;

    return dropPercentage >= (conditions.performanceDropPercentage || 20);
  }

  // Experiment Queue Management
  queueExperiment(queueItem: ExperimentQueue): void {
    this.experimentQueue.push(queueItem);
    this.experimentQueue.sort((a, b) => b.priority - a.priority);

    console.log(`📋 Queued experiment: ${queueItem.reason}`);
  }

  getExperimentQueue(): ExperimentQueue[] {
    return this.experimentQueue;
  }

  private getReadyQueuedExperiments(): ExperimentQueue[] {
    const now = new Date();

    return this.experimentQueue.filter((item) => {
      const scheduledTime = new Date(item.scheduledStart);
      const isTimeReady = scheduledTime <= now;

      // Check dependencies
      const dependenciesCompleted =
        !item.dependencies ||
        item.dependencies.every((depId) => {
          // This would check if the dependency experiment is completed
          return true; // Simplified for now
        });

      return isTimeReady && dependenciesCompleted;
    });
  }

  private async startQueuedExperiment(
    queueItem: ExperimentQueue,
  ): Promise<void> {
    try {
      let experimentId: string;

      if (queueItem.templateId) {
        experimentId = await createExperimentFromTemplate(queueItem.templateId);
      } else if (queueItem.complexFlowId) {
        experimentId = await createComplexFlowExperiment(
          queueItem.complexFlowId,
        );
      } else {
        throw new Error('No template or complex flow ID specified');
      }

      if (queueItem.autoStart) {
        await experimentEngine.startExperiment(experimentId);
      }

      // Remove from queue
      this.experimentQueue = this.experimentQueue.filter(
        (item) => item.id !== queueItem.id,
      );

      console.log(`🚀 Started queued experiment: ${experimentId}`);
    } catch (error) {
      console.error(`❌ Failed to start queued experiment:`, error);
    }
  }

  private async generateFollowupExperiment(
    experiment: Experiment,
    results: ExperimentResults,
  ): Promise<string | null> {
    // Generate intelligent follow-up based on results
    // This is a simplified version - in practice, you'd use AI/ML to generate optimal follow-ups

    const impact = results.effectSize || 0;
    const tags = experiment.tags || [];

    if (tags.includes('cta') && impact > 10) {
      return 'checkout_button_urgency'; // Follow-up CTA test
    } else if (tags.includes('pricing') && impact > 15) {
      return 'pricing_display_format'; // Follow-up pricing test
    } else if (tags.includes('headline') && impact > 20) {
      return 'homepage_headline_value_prop'; // Follow-up headline test
    }

    return null;
  }

  // Analytics and Insights
  private async generateAutomationInsights(): Promise<void> {
    const rules = this.rules.filter((r) => r.enabled);
    const recentlyExecuted = rules.filter(
      (r) =>
        r.lastExecuted &&
        new Date(r.lastExecuted).getTime() > Date.now() - 24 * 60 * 60 * 1000,
    );

    if (recentlyExecuted.length > 0) {
      console.log(
        `🔍 Automation insights: ${recentlyExecuted.length} rules executed in last 24h`,
      );
    }
  }

  async getAutomationReport(): Promise<{
    summary: {
      rulesExecuted24h: number;
      experimentsAutoStopped: number;
      experimentsAutoStarted: number;
      trafficReallocations: number;
      followupsCreated: number;
    };
    queueStatus: {
      totalQueued: number;
      readyToStart: number;
      waitingForDependencies: number;
    };
    policy: AutomationPolicy;
    activeRules: number;
  }> {
    const recent24h = this.rules.filter(
      (r) =>
        r.lastExecuted &&
        new Date(r.lastExecuted).getTime() > Date.now() - 24 * 60 * 60 * 1000,
    );

    const readyExperiments = this.getReadyQueuedExperiments();
    const waitingExperiments = this.experimentQueue.filter(
      (item) => !readyExperiments.includes(item),
    );

    return {
      summary: {
        rulesExecuted24h: recent24h.length,
        experimentsAutoStopped: recent24h.filter(
          (r) => r.action.type === 'stop_experiment',
        ).length,
        experimentsAutoStarted: recent24h.filter(
          (r) => r.action.type === 'start_experiment',
        ).length,
        trafficReallocations: recent24h.filter(
          (r) => r.action.type === 'reallocate_traffic',
        ).length,
        followupsCreated: recent24h.filter(
          (r) => r.action.type === 'create_followup',
        ).length,
      },
      queueStatus: {
        totalQueued: this.experimentQueue.length,
        readyToStart: readyExperiments.length,
        waitingForDependencies: waitingExperiments.length,
      },
      policy: this.policy,
      activeRules: this.rules.filter((r) => r.enabled).length,
    };
  }
}

// Singleton instance
export const automationEngine = new AutomationEngineService();

export type { AutomationRule, AutomationPolicy, ExperimentQueue };
