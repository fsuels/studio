// Updated A/B Testing Engine with Firestore Integration
// This file will replace the existing experiment-engine.ts

import { featureToggleService } from '@/lib/feature-toggles';
import { funnelAnalytics } from '@/lib/funnel-analytics';
import { firestoreABTesting } from './firestore-integration';

// Re-export interfaces from the original file
export interface Experiment {
  id: string;
  name: string;
  description: string;
  hypothesis: string;
  status: 'draft' | 'running' | 'paused' | 'completed' | 'archived';
  
  // Experiment Configuration
  targetAudience: {
    percentage: number; // 0-100, percentage of users to include
    roles?: string[];
    locations?: string[];
    devices?: string[];
    newUsersOnly?: boolean;
    returningUsersOnly?: boolean;
  };
  
  variants: ExperimentVariant[];
  
  // Success Metrics
  primaryMetric: {
    name: string;
    type: 'conversion' | 'revenue' | 'engagement' | 'retention';
    goal: 'increase' | 'decrease';
    minimumDetectableEffect: number; // percentage
  };
  
  secondaryMetrics: Array<{
    name: string;
    type: 'conversion' | 'revenue' | 'engagement' | 'retention';
    goal: 'increase' | 'decrease';
  }>;
  
  // Timing & Statistical Configuration
  startDate?: string;
  endDate?: string;
  estimatedDuration: number; // days
  minSampleSize: number;
  statisticalPower: number; // 0.8 = 80%
  significanceLevel: number; // 0.05 = 95% confidence
  
  // Feature Flag Integration
  featureFlag?: string; // Links to existing feature toggle
  
  // Metadata
  owner: string;
  team: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  
  // Results (populated after completion)
  results?: ExperimentResults;
}

export interface ExperimentVariant {
  id: string;
  name: string;
  description: string;
  trafficAllocation: number; // percentage 0-100
  isControl: boolean;
  featureConfig: Record<string, any>; // Feature flag overrides
}

export interface ExperimentResults {
  // Statistical Analysis
  isStatisticallySignificant: boolean;
  confidence: number; // 0-1 (0.95 = 95% confidence)
  pValue: number;
  effectSize: number; // percentage lift
  statisticalPower: number;
  
  // Winner Analysis
  winningVariant?: string;
  controlPerformance: number;
  bestVariantPerformance: number;
  
  // Bayesian Analysis
  bayesianResults: {
    posteriorDistributions: Record<string, {
      alpha: number;
      beta: number;
      mean: number;
      variance: number;
    }>;
    probabilityOfBeingBest: Record<string, number>;
    expectedLoss: Record<string, number>;
    recommendedAction: 'ship' | 'continue' | 'stop';
  };
  
  // Metrics Results
  primaryMetricResults: MetricResults;
  secondaryMetricResults: Record<string, MetricResults>;
  
  // Business Impact
  estimatedRevenueImpact?: {
    dailyImpact: number;
    monthlyImpact: number;
    annualImpact: number;
    confidenceInterval: [number, number];
  };
  
  // Sample Size & Traffic
  sampleSizes: Record<string, number>; // variant_id -> sample size
  conversionRates: Record<string, number>; // variant_id -> conversion rate
  
  // Recommendations
  recommendation: {
    action: 'ship_winner' | 'ship_control' | 'continue_test' | 'stop_inconclusive';
    reasoning: string;
    confidence: number;
    nextSteps: string[];
  };
  
  lastUpdated: string;
}

export interface MetricResults {
  control: {
    value: number;
    sampleSize: number;
    standardError: number;
  };
  variants: Record<string, {
    value: number;
    sampleSize: number;
    standardError: number;
    lift: number;
    liftConfidenceInterval: [number, number];
  }>;
}

export interface ExperimentEvent {
  experimentId: string;
  variantId: string;
  userId: string;
  sessionId: string;
  eventType: 'assignment' | 'conversion' | 'revenue' | 'engagement';
  eventData: {
    metric?: string;
    value?: number;
    timestamp: string;
    metadata?: Record<string, any>;
  };
}

class ExperimentEngine {
  // Cache for performance (Firestore is source of truth)
  private experimentsCache: Map<string, Experiment> = new Map();
  private userAssignmentsCache: Map<string, Record<string, string>> = new Map();

  constructor() {
    this.initializeFromFirestore();
  }

  private async initializeFromFirestore(): Promise<void> {
    try {
      const experiments = await firestoreABTesting.getAllExperiments();
      experiments.forEach(exp => {
        this.experimentsCache.set(exp.id, exp);
      });
    } catch (error) {
      console.error('Failed to load experiments from Firestore:', error);
    }
  }

  // Experiment Lifecycle Management
  async createExperiment(experiment: Omit<Experiment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Experiment> {
    const id = this.generateExperimentId();
    const now = new Date().toISOString();
    
    const newExperiment: Experiment = {
      ...experiment,
      id,
      createdAt: now,
      updatedAt: now,
      status: 'draft'
    };

    // Validate experiment configuration
    this.validateExperiment(newExperiment);
    
    // Create associated feature flag if needed
    if (!newExperiment.featureFlag) {
      const featureKey = `experiment_${id}`;
      await featureToggleService.createFeature({
        name: `Experiment: ${newExperiment.name}`,
        description: `Feature flag for A/B test: ${newExperiment.description}`,
        enabled: false,
        rolloutStrategy: {
          type: 'percentage',
          percentage: 0
        },
        owner: newExperiment.owner,
        tags: ['experiment', 'ab_test', ...newExperiment.tags]
      });
      newExperiment.featureFlag = featureKey;
    }

    // Save to Firestore
    await firestoreABTesting.saveExperiment(newExperiment);
    this.experimentsCache.set(id, newExperiment);
    
    return newExperiment;
  }

  async getExperiment(experimentId: string): Promise<Experiment | null> {
    // Check cache first
    if (this.experimentsCache.has(experimentId)) {
      return this.experimentsCache.get(experimentId)!;
    }

    // Load from Firestore
    const experiment = await firestoreABTesting.getExperiment(experimentId);
    if (experiment) {
      this.experimentsCache.set(experimentId, experiment);
    }
    
    return experiment;
  }

  async startExperiment(experimentId: string): Promise<void> {
    const experiment = await this.getExperiment(experimentId);
    if (!experiment) {
      throw new Error(`Experiment ${experimentId} not found`);
    }

    if (experiment.status !== 'draft') {
      throw new Error(`Cannot start experiment in ${experiment.status} status`);
    }

    // Activate feature flag
    if (experiment.featureFlag) {
      await featureToggleService.toggleFeature(
        experiment.featureFlag, 
        true, 
        experiment.owner
      );
      
      await featureToggleService.updateFeature(experiment.featureFlag, {
        rolloutStrategy: {
          type: 'percentage',
          percentage: experiment.targetAudience.percentage
        }
      });
    }

    // Update experiment status
    const updates = {
      status: 'running' as const,
      startDate: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await firestoreABTesting.updateExperiment(experimentId, updates);
    
    // Update cache
    const updatedExperiment = { ...experiment, ...updates };
    this.experimentsCache.set(experimentId, updatedExperiment);
  }

  async stopExperiment(experimentId: string, reason?: string): Promise<void> {
    const experiment = await this.getExperiment(experimentId);
    if (!experiment) {
      throw new Error(`Experiment ${experimentId} not found`);
    }

    // Deactivate feature flag
    if (experiment.featureFlag) {
      await featureToggleService.toggleFeature(
        experiment.featureFlag, 
        false, 
        experiment.owner
      );
    }

    // Calculate final results
    const results = await this.calculateResults(experimentId);

    const updates = {
      status: 'completed' as const,
      endDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      results
    };

    await firestoreABTesting.updateExperiment(experimentId, updates);
    
    // Update cache
    const updatedExperiment = { ...experiment, ...updates };
    this.experimentsCache.set(experimentId, updatedExperiment);
  }

  // User Assignment & Variant Selection
  async assignUserToExperiment(experimentId: string, userId: string): Promise<string | null> {
    // Check existing assignment first
    const existingAssignment = await firestoreABTesting.getUserAssignment(userId, experimentId);
    if (existingAssignment) {
      return existingAssignment;
    }

    const experiment = await this.getExperiment(experimentId);
    if (!experiment || experiment.status !== 'running') {
      return null;
    }

    // Check if user qualifies for experiment
    if (!this.isUserEligible(userId, experiment)) {
      return null;
    }

    // Assign variant using consistent hashing
    const variantId = this.selectVariant(userId, experiment);
    
    // Store assignment in Firestore
    await firestoreABTesting.assignUserToExperiment(
      userId, 
      experimentId, 
      variantId,
      this.getCurrentDeviceId(userId),
      this.getCurrentSessionId(userId)
    );
    
    // Update cache
    const userExperiments = this.userAssignmentsCache.get(userId) || {};
    userExperiments[experimentId] = variantId;
    this.userAssignmentsCache.set(userId, userExperiments);
    
    // Track assignment event
    await this.trackEvent({
      experimentId,
      variantId,
      userId,
      sessionId: this.getCurrentSessionId(userId),
      eventType: 'assignment',
      eventData: {
        timestamp: new Date().toISOString()
      }
    });
    
    return variantId;
  }

  async getUserExperiments(userId: string): Promise<Record<string, string>> {
    // Check cache first
    if (this.userAssignmentsCache.has(userId)) {
      return this.userAssignmentsCache.get(userId)!;
    }

    // Load from Firestore
    const assignments = await firestoreABTesting.getUserExperiments(userId);
    this.userAssignmentsCache.set(userId, assignments);
    
    return assignments;
  }

  getExperimentForUser(userId: string): Record<string, string> {
    return this.userAssignmentsCache.get(userId) || {};
  }

  // Event Tracking
  async trackEvent(event: ExperimentEvent): Promise<void> {
    // Store in Firestore
    await firestoreABTesting.trackEvent(event);
    
    // Update funnel analytics if applicable
    if (event.eventType === 'conversion' && event.eventData.metric) {
      funnelAnalytics.track(event.userId, event.eventData.metric, {
        experiment: event.experimentId,
        variant: event.variantId,
        value: event.eventData.value
      });
    }
  }

  // Statistical Analysis & Results
  async calculateResults(experimentId: string): Promise<ExperimentResults> {
    // Check if results are cached in Firestore
    const cachedResults = await firestoreABTesting.getExperimentResults(experimentId);
    if (cachedResults && this.isResultsCurrent(cachedResults)) {
      return cachedResults;
    }

    const experiment = await this.getExperiment(experimentId);
    if (!experiment) {
      throw new Error(`Experiment ${experimentId} not found`);
    }

    // Get events from Firestore
    const events = await firestoreABTesting.getExperimentEvents(experimentId);
    
    // Calculate sample sizes and conversion rates
    const sampleSizes: Record<string, number> = {};
    const conversions: Record<string, number> = {};
    const conversionRates: Record<string, number> = {};

    // Initialize counters
    experiment.variants.forEach(variant => {
      sampleSizes[variant.id] = 0;
      conversions[variant.id] = 0;
      conversionRates[variant.id] = 0;
    });

    // Count assignments and conversions
    events.forEach(event => {
      if (event.eventType === 'assignment') {
        sampleSizes[event.variantId] = (sampleSizes[event.variantId] || 0) + 1;
      } else if (event.eventType === 'conversion' && event.eventData.metric === experiment.primaryMetric.name) {
        conversions[event.variantId] = (conversions[event.variantId] || 0) + 1;
      }
    });

    // Calculate conversion rates
    Object.keys(sampleSizes).forEach(variantId => {
      if (sampleSizes[variantId] > 0) {
        conversionRates[variantId] = conversions[variantId] / sampleSizes[variantId];
      }
    });

    // Find control and best variant
    const controlVariant = experiment.variants.find(v => v.isControl);
    const controlVariantId = controlVariant?.id || experiment.variants[0].id;
    const controlPerformance = conversionRates[controlVariantId] || 0;

    const bestVariantId = Object.entries(conversionRates)
      .reduce((best, [id, rate]) => rate > best.rate ? { id, rate } : best, 
              { id: controlVariantId, rate: controlPerformance }).id;
    const bestVariantPerformance = conversionRates[bestVariantId] || 0;

    // Calculate effect size
    const effectSize = controlPerformance > 0 
      ? ((bestVariantPerformance - controlPerformance) / controlPerformance) * 100 
      : 0;

    // Simplified statistical significance (in practice, use proper statistical tests)
    const totalSampleSize = Object.values(sampleSizes).reduce((sum, size) => sum + size, 0);
    const isStatisticallySignificant = totalSampleSize >= experiment.minSampleSize && Math.abs(effectSize) >= experiment.primaryMetric.minimumDetectableEffect;

    // Bayesian analysis (simplified)
    const bayesianResults = this.performBayesianAnalysis(conversionRates, sampleSizes);

    // Primary metric results
    const primaryMetricResults: MetricResults = {
      control: {
        value: controlPerformance,
        sampleSize: sampleSizes[controlVariantId] || 0,
        standardError: this.calculateStandardError(controlPerformance, sampleSizes[controlVariantId] || 0)
      },
      variants: {}
    };

    experiment.variants.filter(v => !v.isControl).forEach(variant => {
      primaryMetricResults.variants[variant.id] = {
        value: conversionRates[variant.id] || 0,
        sampleSize: sampleSizes[variant.id] || 0,
        standardError: this.calculateStandardError(conversionRates[variant.id] || 0, sampleSizes[variant.id] || 0),
        lift: controlPerformance > 0 ? ((conversionRates[variant.id] || 0) - controlPerformance) / controlPerformance * 100 : 0,
        liftConfidenceInterval: [0, 0] // Simplified
      };
    });

    // Generate recommendation
    const recommendation = this.generateRecommendation(
      isStatisticallySignificant,
      effectSize,
      bestVariantId,
      controlVariantId,
      experiment
    );

    const results: ExperimentResults = {
      isStatisticallySignificant,
      confidence: 0.95, // Simplified
      pValue: 0.05, // Simplified
      effectSize,
      statisticalPower: experiment.statisticalPower,
      winningVariant: isStatisticallySignificant ? bestVariantId : undefined,
      controlPerformance,
      bestVariantPerformance,
      bayesianResults,
      primaryMetricResults,
      secondaryMetricResults: {}, // Would calculate secondary metrics similarly
      sampleSizes,
      conversionRates,
      recommendation,
      lastUpdated: new Date().toISOString()
    };

    // Cache results in Firestore
    await firestoreABTesting.saveExperimentResults(experimentId, results);

    return results;
  }

  // Experiment Management
  async getAllExperiments(): Promise<Experiment[]> {
    return await firestoreABTesting.getAllExperiments();
  }

  async getRunningExperiments(): Promise<Experiment[]> {
    return await firestoreABTesting.getRunningExperiments();
  }

  async getExperimentsByDateRange(startDate: string, endDate: string): Promise<Experiment[]> {
    return await firestoreABTesting.getExperimentsByDateRange(startDate, endDate);
  }

  // Utility Methods
  private generateExperimentId(): string {
    return `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private validateExperiment(experiment: Experiment): void {
    if (!experiment.name || experiment.name.trim().length === 0) {
      throw new Error('Experiment name is required');
    }

    if (!experiment.variants || experiment.variants.length < 2) {
      throw new Error('Experiment must have at least 2 variants');
    }

    const totalAllocation = experiment.variants.reduce((sum, v) => sum + v.trafficAllocation, 0);
    if (Math.abs(totalAllocation - 100) > 0.01) {
      throw new Error('Variant traffic allocation must sum to 100%');
    }

    const controlVariants = experiment.variants.filter(v => v.isControl);
    if (controlVariants.length !== 1) {
      throw new Error('Experiment must have exactly one control variant');
    }
  }

  private isUserEligible(userId: string, experiment: Experiment): boolean {
    // Hash user ID to determine if they're in the target percentage
    const hash = this.hashString(userId + experiment.id);
    const userPercentile = (hash % 10000) / 100; // 0-99.99
    
    return userPercentile < experiment.targetAudience.percentage;
  }

  private selectVariant(userId: string, experiment: Experiment): string {
    const hash = this.hashString(userId + experiment.id + 'variant');
    const randomValue = (hash % 10000) / 100; // 0-99.99
    
    let cumulativeAllocation = 0;
    for (const variant of experiment.variants) {
      cumulativeAllocation += variant.trafficAllocation;
      if (randomValue < cumulativeAllocation) {
        return variant.id;
      }
    }
    
    // Fallback to first variant
    return experiment.variants[0].id;
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private getCurrentSessionId(userId: string): string {
    return `session_${userId}_${Date.now()}`;
  }

  private getCurrentDeviceId(userId: string): string {
    return `device_${userId}`;
  }

  private isResultsCurrent(results: ExperimentResults): boolean {
    const lastUpdated = new Date(results.lastUpdated);
    const now = new Date();
    const hoursSinceUpdate = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
    
    return hoursSinceUpdate < 1; // Results are current if updated within last hour
  }

  private performBayesianAnalysis(
    conversionRates: Record<string, number>,
    sampleSizes: Record<string, number>
  ): ExperimentResults['bayesianResults'] {
    const posteriorDistributions: Record<string, any> = {};
    const probabilityOfBeingBest: Record<string, number> = {};
    const expectedLoss: Record<string, number> = {};

    // Simplified Bayesian analysis with Beta distributions
    Object.entries(conversionRates).forEach(([variantId, rate]) => {
      const sampleSize = sampleSizes[variantId] || 0;
      const successes = Math.round(rate * sampleSize);
      const failures = sampleSize - successes;
      
      // Beta(α, β) where α = successes + 1, β = failures + 1 (uniform prior)
      const alpha = successes + 1;
      const beta = failures + 1;
      
      posteriorDistributions[variantId] = {
        alpha,
        beta,
        mean: alpha / (alpha + beta),
        variance: (alpha * beta) / ((alpha + beta) ** 2 * (alpha + beta + 1))
      };
    });

    // Calculate probability of being best (simplified)
    Object.keys(conversionRates).forEach(variantId => {
      probabilityOfBeingBest[variantId] = 1 / Object.keys(conversionRates).length; // Simplified
      expectedLoss[variantId] = 0; // Simplified
    });

    return {
      posteriorDistributions,
      probabilityOfBeingBest,
      expectedLoss,
      recommendedAction: 'continue' // Simplified
    };
  }

  private calculateStandardError(rate: number, sampleSize: number): number {
    if (sampleSize === 0) return 0;
    return Math.sqrt((rate * (1 - rate)) / sampleSize);
  }

  private generateRecommendation(
    isSignificant: boolean,
    effectSize: number,
    bestVariantId: string,
    controlVariantId: string,
    experiment: Experiment
  ): ExperimentResults['recommendation'] {
    if (!isSignificant) {
      return {
        action: 'continue_test',
        reasoning: 'Experiment has not yet reached statistical significance. Continue running to gather more data.',
        confidence: 0.6,
        nextSteps: [
          'Continue running the experiment',
          'Monitor for statistical significance',
          'Ensure sufficient sample size is being collected'
        ]
      };
    }

    if (bestVariantId === controlVariantId) {
      return {
        action: 'ship_control',
        reasoning: 'Control variant is performing best with statistical significance.',
        confidence: 0.9,
        nextSteps: [
          'Maintain current implementation',
          'Document learnings from the experiment',
          'Consider testing alternative approaches'
        ]
      };
    }

    if (effectSize >= experiment.primaryMetric.minimumDetectableEffect) {
      return {
        action: 'ship_winner',
        reasoning: `Winning variant shows significant improvement of ${effectSize.toFixed(1)}% over control.`,
        confidence: 0.95,
        nextSteps: [
          'Implement the winning variant',
          'Monitor post-implementation metrics',
          'Plan follow-up experiments to optimize further'
        ]
      };
    }

    return {
      action: 'stop_inconclusive',
      reasoning: 'While statistically significant, the effect size is below the minimum detectable effect threshold.',
      confidence: 0.7,
      nextSteps: [
        'Stop the experiment',
        'Analyze why effect size was smaller than expected',
        'Design follow-up experiments with larger potential impact'
      ]
    };
  }
}

// Singleton instance
export const experimentEngine = new ExperimentEngine();