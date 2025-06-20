// A/B Testing & Experimentation Engine for 123LegalDoc
// Integrated with existing feature toggles and funnel analytics
// Includes Bayesian statistical analysis and experiment lifecycle management

import { featureToggleService } from '@/lib/feature-toggles';
import { funnelAnalytics } from '@/lib/funnel-analytics';

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
  startDate: string;
  endDate?: string;
  estimatedDuration: number; // days
  minSampleSize: number;
  statisticalPower: number; // 0.8 = 80%
  significanceLevel: number; // 0.05 = 95% confidence
  
  // Feature Flag Integration
  featureFlag?: string; // Links to existing feature toggle
  
  // Results
  results?: ExperimentResults;
  
  // Metadata
  owner: string;
  team: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ExperimentVariant {
  id: string;
  name: string;
  description: string;
  trafficAllocation: number; // percentage of experiment traffic
  isControl: boolean;
  
  // Feature configuration for this variant
  featureConfig?: Record<string, any>;
  
  // UI/UX changes
  changes?: Array<{
    type: 'ui' | 'copy' | 'flow' | 'feature';
    target: string;
    description: string;
    value: any;
  }>;
}

export interface ExperimentResults {
  status: 'insufficient_data' | 'no_significant_difference' | 'significant_winner' | 'significant_loser';
  confidence: number;
  winningVariant?: string;
  
  // Statistical Analysis
  bayesianAnalysis: {
    probabilityToBeatControl: Record<string, number>; // variant_id -> probability
    expectedLift: Record<string, number>; // variant_id -> expected lift %
    credibleInterval: Record<string, [number, number]>; // variant_id -> [lower, upper]
  };
  
  frequentistAnalysis: {
    pValue: Record<string, number>; // variant_id -> p-value
    confidenceInterval: Record<string, [number, number]>; // variant_id -> [lower, upper]
    statisticalPower: number;
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
  private experiments: Map<string, Experiment> = new Map();
  private userAssignments: Map<string, Record<string, string>> = new Map(); // userId -> experimentId -> variantId
  private events: ExperimentEvent[] = [];

  constructor() {
    this.initializeFromStorage();
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

    this.experiments.set(id, newExperiment);
    this.persistExperiments();
    
    return newExperiment;
  }

  async startExperiment(experimentId: string): Promise<void> {
    const experiment = this.experiments.get(experimentId);
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

    experiment.status = 'running';
    experiment.startDate = new Date().toISOString();
    experiment.updatedAt = new Date().toISOString();
    
    this.experiments.set(experimentId, experiment);
    this.persistExperiments();
  }

  async stopExperiment(experimentId: string, reason?: string): Promise<void> {
    const experiment = this.experiments.get(experimentId);
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

    experiment.status = 'completed';
    experiment.endDate = new Date().toISOString();
    experiment.updatedAt = new Date().toISOString();
    
    // Calculate final results
    experiment.results = await this.calculateResults(experimentId);
    
    this.experiments.set(experimentId, experiment);
    this.persistExperiments();
  }

  // User Assignment & Variant Selection
  assignUserToExperiment(experimentId: string, userId: string): string | null {
    const experiment = this.experiments.get(experimentId);
    if (!experiment || experiment.status !== 'running') {
      return null;
    }

    // Check if user already assigned
    const userExperiments = this.userAssignments.get(userId) || {};
    if (userExperiments[experimentId]) {
      return userExperiments[experimentId];
    }

    // Check if user qualifies for experiment
    if (!this.isUserEligible(userId, experiment)) {
      return null;
    }

    // Assign variant using consistent hashing
    const variantId = this.selectVariant(userId, experiment);
    
    // Store assignment
    userExperiments[experimentId] = variantId;
    this.userAssignments.set(userId, userExperiments);
    
    // Track assignment event
    this.trackEvent({
      experimentId,
      variantId,
      userId,
      sessionId: this.getCurrentSessionId(userId),
      eventType: 'assignment',
      eventData: {
        timestamp: new Date().toISOString()
      }
    });

    this.persistAssignments();
    return variantId;
  }

  // Event Tracking
  trackEvent(event: ExperimentEvent): void {
    this.events.push(event);
    this.persistEvents();
    
    // Real-time analysis trigger
    if (this.events.length % 100 === 0) {
      this.updateExperimentResults(event.experimentId);
    }
  }

  trackConversion(experimentId: string, userId: string, metric: string, value: number = 1): void {
    const assignment = this.getUserAssignment(experimentId, userId);
    if (!assignment) return;

    this.trackEvent({
      experimentId,
      variantId: assignment,
      userId,
      sessionId: this.getCurrentSessionId(userId),
      eventType: 'conversion',
      eventData: {
        metric,
        value,
        timestamp: new Date().toISOString()
      }
    });
  }

  trackRevenue(experimentId: string, userId: string, amount: number, metric: string = 'revenue'): void {
    const assignment = this.getUserAssignment(experimentId, userId);
    if (!assignment) return;

    this.trackEvent({
      experimentId,
      variantId: assignment,
      userId,
      sessionId: this.getCurrentSessionId(userId),
      eventType: 'revenue',
      eventData: {
        metric,
        value: amount,
        timestamp: new Date().toISOString()
      }
    });
  }

  // Statistical Analysis
  async calculateResults(experimentId: string): Promise<ExperimentResults> {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) {
      throw new Error(`Experiment ${experimentId} not found`);
    }

    const experimentEvents = this.events.filter(e => e.experimentId === experimentId);
    
    // Calculate sample sizes
    const sampleSizes = this.calculateSampleSizes(experimentEvents);
    
    // Calculate conversion rates for primary metric
    const conversionRates = this.calculateConversionRates(experimentEvents, experiment.primaryMetric.name);
    
    // Bayesian Analysis
    const bayesianAnalysis = this.performBayesianAnalysis(conversionRates, sampleSizes);
    
    // Frequentist Analysis
    const frequentistAnalysis = this.performFrequentistAnalysis(conversionRates, sampleSizes);
    
    // Primary Metric Results
    const primaryMetricResults = this.calculateMetricResults(
      experimentEvents, 
      experiment.primaryMetric.name,
      experiment.variants
    );
    
    // Secondary Metrics
    const secondaryMetricResults: Record<string, MetricResults> = {};
    for (const metric of experiment.secondaryMetrics) {
      secondaryMetricResults[metric.name] = this.calculateMetricResults(
        experimentEvents,
        metric.name,
        experiment.variants
      );
    }

    // Determine status and winner
    const { status, winningVariant, confidence } = this.determineExperimentStatus(
      bayesianAnalysis,
      frequentistAnalysis,
      experiment
    );

    // Revenue Impact Estimation
    const estimatedRevenueImpact = this.estimateRevenueImpact(
      experimentEvents,
      experiment,
      winningVariant
    );

    // Generate Recommendations
    const recommendation = this.generateRecommendation(
      status,
      confidence,
      winningVariant,
      experiment,
      estimatedRevenueImpact
    );

    return {
      status,
      confidence,
      winningVariant,
      bayesianAnalysis,
      frequentistAnalysis,
      primaryMetricResults,
      secondaryMetricResults,
      estimatedRevenueImpact,
      sampleSizes,
      conversionRates,
      recommendation,
      lastUpdated: new Date().toISOString()
    };
  }

  // Bayesian Statistical Analysis
  private performBayesianAnalysis(
    conversionRates: Record<string, number>,
    sampleSizes: Record<string, number>
  ) {
    const variants = Object.keys(conversionRates);
    const controlVariant = variants.find(v => v.includes('control')) || variants[0];
    
    const probabilityToBeatControl: Record<string, number> = {};
    const expectedLift: Record<string, number> = {};
    const credibleInterval: Record<string, [number, number]> = {};

    for (const variant of variants) {
      if (variant === controlVariant) {
        probabilityToBeatControl[variant] = 0.5;
        expectedLift[variant] = 0;
        credibleInterval[variant] = [0, 0];
        continue;
      }

      // Beta distribution parameters (Bayesian approach)
      const controlSuccesses = conversionRates[controlVariant] * sampleSizes[controlVariant];
      const controlFailures = sampleSizes[controlVariant] - controlSuccesses;
      
      const variantSuccesses = conversionRates[variant] * sampleSizes[variant];
      const variantFailures = sampleSizes[variant] - variantSuccesses;

      // Monte Carlo simulation for Bayesian analysis
      const simulations = 10000;
      let variantWins = 0;
      const liftSamples: number[] = [];

      for (let i = 0; i < simulations; i++) {
        const controlRate = this.betaRandom(controlSuccesses + 1, controlFailures + 1);
        const variantRate = this.betaRandom(variantSuccesses + 1, variantFailures + 1);
        
        if (variantRate > controlRate) {
          variantWins++;
        }
        
        const lift = controlRate > 0 ? (variantRate - controlRate) / controlRate : 0;
        liftSamples.push(lift);
      }

      probabilityToBeatControl[variant] = variantWins / simulations;
      
      liftSamples.sort((a, b) => a - b);
      expectedLift[variant] = liftSamples.reduce((sum, val) => sum + val, 0) / liftSamples.length;
      credibleInterval[variant] = [
        liftSamples[Math.floor(simulations * 0.025)],
        liftSamples[Math.floor(simulations * 0.975)]
      ];
    }

    return {
      probabilityToBeatControl,
      expectedLift,
      credibleInterval
    };
  }

  // Frequentist Statistical Analysis
  private performFrequentistAnalysis(
    conversionRates: Record<string, number>,
    sampleSizes: Record<string, number>
  ) {
    const variants = Object.keys(conversionRates);
    const controlVariant = variants.find(v => v.includes('control')) || variants[0];
    
    const pValue: Record<string, number> = {};
    const confidenceInterval: Record<string, [number, number]> = {};

    for (const variant of variants) {
      if (variant === controlVariant) {
        pValue[variant] = 1;
        confidenceInterval[variant] = [0, 0];
        continue;
      }

      // Two-proportion z-test
      const p1 = conversionRates[controlVariant];
      const n1 = sampleSizes[controlVariant];
      const p2 = conversionRates[variant];
      const n2 = sampleSizes[variant];

      const pooledP = (p1 * n1 + p2 * n2) / (n1 + n2);
      const se = Math.sqrt(pooledP * (1 - pooledP) * (1/n1 + 1/n2));
      const z = (p2 - p1) / se;
      
      // Two-tailed p-value
      pValue[variant] = 2 * (1 - this.standardNormalCDF(Math.abs(z)));
      
      // 95% confidence interval for difference
      const seDiff = Math.sqrt(p1 * (1 - p1) / n1 + p2 * (1 - p2) / n2);
      const margin = 1.96 * seDiff; // 95% CI
      confidenceInterval[variant] = [
        (p2 - p1) - margin,
        (p2 - p1) + margin
      ];
    }

    return {
      pValue,
      confidenceInterval,
      statisticalPower: 0.8 // Simplified - should be calculated based on effect size
    };
  }

  // Helper Methods
  private generateExperimentId(): string {
    return `exp_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
  }

  private validateExperiment(experiment: Experiment): void {
    // Validate traffic allocation adds up to 100%
    const totalAllocation = experiment.variants.reduce((sum, v) => sum + v.trafficAllocation, 0);
    if (Math.abs(totalAllocation - 100) > 0.01) {
      throw new Error('Variant traffic allocations must sum to 100%');
    }

    // Ensure one control variant
    const controlVariants = experiment.variants.filter(v => v.isControl);
    if (controlVariants.length !== 1) {
      throw new Error('Experiment must have exactly one control variant');
    }

    // Validate minimum sample size
    if (experiment.minSampleSize < 100) {
      throw new Error('Minimum sample size must be at least 100 per variant');
    }
  }

  private isUserEligible(userId: string, experiment: Experiment): boolean {
    // Check if user should be included based on experiment targeting
    const hash = this.hashUserId(userId + experiment.id);
    return hash < experiment.targetAudience.percentage / 100;
  }

  private selectVariant(userId: string, experiment: Experiment): string {
    const hash = this.hashUserId(userId + experiment.id + 'variant');
    let cumulative = 0;
    
    for (const variant of experiment.variants) {
      cumulative += variant.trafficAllocation;
      if (hash * 100 <= cumulative) {
        return variant.id;
      }
    }
    
    return experiment.variants[experiment.variants.length - 1].id;
  }

  private hashUserId(input: string): number {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash) / Math.pow(2, 31);
  }

  private getUserAssignment(experimentId: string, userId: string): string | null {
    const userExperiments = this.userAssignments.get(userId);
    return userExperiments?.[experimentId] || null;
  }

  private getCurrentSessionId(userId: string): string {
    // Integration with existing session management
    return `sess_${userId}_${Date.now()}`;
  }

  private calculateSampleSizes(events: ExperimentEvent[]): Record<string, number> {
    const assignments = events.filter(e => e.eventType === 'assignment');
    const sampleSizes: Record<string, number> = {};
    
    for (const event of assignments) {
      sampleSizes[event.variantId] = (sampleSizes[event.variantId] || 0) + 1;
    }
    
    return sampleSizes;
  }

  private calculateConversionRates(events: ExperimentEvent[], metric: string): Record<string, number> {
    const assignments = events.filter(e => e.eventType === 'assignment');
    const conversions = events.filter(e => 
      e.eventType === 'conversion' && e.eventData.metric === metric
    );
    
    const sampleSizes: Record<string, number> = {};
    const conversionCounts: Record<string, number> = {};
    
    // Count assignments (sample sizes)
    for (const event of assignments) {
      sampleSizes[event.variantId] = (sampleSizes[event.variantId] || 0) + 1;
    }
    
    // Count conversions
    for (const event of conversions) {
      conversionCounts[event.variantId] = (conversionCounts[event.variantId] || 0) + 1;
    }
    
    // Calculate rates
    const rates: Record<string, number> = {};
    for (const variantId of Object.keys(sampleSizes)) {
      rates[variantId] = (conversionCounts[variantId] || 0) / sampleSizes[variantId];
    }
    
    return rates;
  }

  private calculateMetricResults(
    events: ExperimentEvent[], 
    metric: string, 
    variants: ExperimentVariant[]
  ): MetricResults {
    const conversionRates = this.calculateConversionRates(events, metric);
    const sampleSizes = this.calculateSampleSizes(events);
    
    const controlVariant = variants.find(v => v.isControl);
    if (!controlVariant) {
      throw new Error('No control variant found');
    }
    
    const control = {
      value: conversionRates[controlVariant.id] || 0,
      sampleSize: sampleSizes[controlVariant.id] || 0,
      standardError: this.calculateStandardError(
        conversionRates[controlVariant.id] || 0,
        sampleSizes[controlVariant.id] || 0
      )
    };
    
    const variantResults: Record<string, any> = {};
    
    for (const variant of variants) {
      if (variant.isControl) continue;
      
      const rate = conversionRates[variant.id] || 0;
      const size = sampleSizes[variant.id] || 0;
      const lift = control.value > 0 ? (rate - control.value) / control.value : 0;
      
      variantResults[variant.id] = {
        value: rate,
        sampleSize: size,
        standardError: this.calculateStandardError(rate, size),
        lift: lift,
        liftConfidenceInterval: this.calculateLiftConfidenceInterval(
          control.value, control.sampleSize, rate, size
        )
      };
    }
    
    return {
      control,
      variants: variantResults
    };
  }

  private calculateStandardError(rate: number, sampleSize: number): number {
    if (sampleSize === 0) return 0;
    return Math.sqrt(rate * (1 - rate) / sampleSize);
  }

  private calculateLiftConfidenceInterval(
    controlRate: number, controlSize: number,
    variantRate: number, variantSize: number
  ): [number, number] {
    if (controlSize === 0 || variantSize === 0 || controlRate === 0) {
      return [0, 0];
    }
    
    const se = Math.sqrt(
      controlRate * (1 - controlRate) / controlSize +
      variantRate * (1 - variantRate) / variantSize
    );
    
    const diff = variantRate - controlRate;
    const lift = diff / controlRate;
    const liftSE = se / controlRate;
    
    return [
      lift - 1.96 * liftSE,
      lift + 1.96 * liftSE
    ];
  }

  private determineExperimentStatus(
    bayesian: any,
    frequentist: any,
    experiment: Experiment
  ): { status: ExperimentResults['status'], winningVariant?: string, confidence: number } {
    
    // Find variant with highest probability to beat control
    let bestVariant = '';
    let bestProbability = 0;
    
    for (const [variant, probability] of Object.entries(bayesian.probabilityToBeatControl)) {
      if (typeof probability === 'number' && probability > bestProbability) {
        bestProbability = probability;
        bestVariant = variant;
      }
    }
    
    // Decision criteria
    if (bestProbability > 0.95) {
      return {
        status: 'significant_winner',
        winningVariant: bestVariant,
        confidence: bestProbability
      };
    } else if (bestProbability < 0.05) {
      return {
        status: 'significant_loser',
        winningVariant: bestVariant,
        confidence: 1 - bestProbability
      };
    } else if (bestProbability > 0.1 && bestProbability < 0.9) {
      return {
        status: 'no_significant_difference',
        confidence: Math.max(bestProbability, 1 - bestProbability)
      };
    } else {
      return {
        status: 'insufficient_data',
        confidence: bestProbability
      };
    }
  }

  private estimateRevenueImpact(
    events: ExperimentEvent[],
    experiment: Experiment,
    winningVariant?: string
  ) {
    if (!winningVariant) return undefined;
    
    const revenueEvents = events.filter(e => e.eventType === 'revenue');
    
    // Calculate average revenue per user for control and winning variant
    const controlVariant = experiment.variants.find(v => v.isControl);
    if (!controlVariant) return undefined;
    
    const controlRevenue = revenueEvents
      .filter(e => e.variantId === controlVariant.id)
      .reduce((sum, e) => sum + (e.eventData.value || 0), 0);
    
    const winningRevenue = revenueEvents
      .filter(e => e.variantId === winningVariant)
      .reduce((sum, e) => sum + (e.eventData.value || 0), 0);
    
    const controlUsers = this.calculateSampleSizes(events)[controlVariant.id] || 0;
    const winningUsers = this.calculateSampleSizes(events)[winningVariant] || 0;
    
    if (controlUsers === 0 || winningUsers === 0) return undefined;
    
    const controlARPU = controlRevenue / controlUsers;
    const winningARPU = winningRevenue / winningUsers;
    
    const lift = controlARPU > 0 ? (winningARPU - controlARPU) / controlARPU : 0;
    
    // Estimate daily/monthly/annual impact based on typical traffic
    const estimatedDailyUsers = 1000; // This should come from actual analytics
    const dailyImpact = estimatedDailyUsers * controlARPU * lift;
    
    return {
      dailyImpact,
      monthlyImpact: dailyImpact * 30,
      annualImpact: dailyImpact * 365,
      confidenceInterval: [dailyImpact * 0.8, dailyImpact * 1.2] as [number, number]
    };
  }

  private generateRecommendation(
    status: ExperimentResults['status'],
    confidence: number,
    winningVariant: string | undefined,
    experiment: Experiment,
    revenueImpact: any
  ) {
    switch (status) {
      case 'significant_winner':
        return {
          action: 'ship_winner' as const,
          reasoning: `Variant ${winningVariant} shows significant improvement with ${(confidence * 100).toFixed(1)}% confidence`,
          confidence,
          nextSteps: [
            'Implement winning variant for all users',
            'Monitor key metrics post-launch',
            'Document learnings for future experiments'
          ]
        };
        
      case 'significant_loser':
        return {
          action: 'ship_control' as const,
          reasoning: `Winning variant shows significant negative impact with ${(confidence * 100).toFixed(1)}% confidence`,
          confidence,
          nextSteps: [
            'Keep current implementation',
            'Analyze why variant performed poorly',
            'Design follow-up experiments'
          ]
        };
        
      case 'no_significant_difference':
        return {
          action: 'stop_inconclusive' as const,
          reasoning: 'No significant difference detected between variants',
          confidence,
          nextSteps: [
            'Stop experiment and maintain current implementation',
            'Consider testing larger changes',
            'Analyze qualitative feedback'
          ]
        };
        
      default:
        return {
          action: 'continue_test' as const,
          reasoning: 'Insufficient data to make a decision',
          confidence,
          nextSteps: [
            'Continue collecting data',
            'Monitor sample size requirements',
            'Consider extending experiment duration'
          ]
        };
    }
  }

  // Statistical utility functions
  private betaRandom(alpha: number, beta: number): number {
    // Simplified beta distribution sampling
    const u = Math.random();
    const v = Math.random();
    
    const x = Math.pow(u, 1 / alpha);
    const y = Math.pow(v, 1 / beta);
    
    return x / (x + y);
  }

  private standardNormalCDF(x: number): number {
    // Approximation of standard normal CDF
    return 0.5 * (1 + this.erf(x / Math.sqrt(2)));
  }

  private erf(x: number): number {
    // Approximation of error function
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  }

  private async updateExperimentResults(experimentId: string): Promise<void> {
    const experiment = this.experiments.get(experimentId);
    if (!experiment || experiment.status !== 'running') return;

    experiment.results = await this.calculateResults(experimentId);
    experiment.updatedAt = new Date().toISOString();
    
    this.experiments.set(experimentId, experiment);
    this.persistExperiments();
  }

  // Data Persistence
  private persistExperiments(): void {
    localStorage.setItem('ab_experiments', JSON.stringify(Array.from(this.experiments.entries())));
  }

  private persistAssignments(): void {
    localStorage.setItem('ab_assignments', JSON.stringify(Array.from(this.userAssignments.entries())));
  }

  private persistEvents(): void {
    localStorage.setItem('ab_events', JSON.stringify(this.events));
  }

  private initializeFromStorage(): void {
    try {
      const experimentsData = localStorage.getItem('ab_experiments');
      if (experimentsData) {
        this.experiments = new Map(JSON.parse(experimentsData));
      }

      const assignmentsData = localStorage.getItem('ab_assignments');
      if (assignmentsData) {
        this.userAssignments = new Map(JSON.parse(assignmentsData));
      }

      const eventsData = localStorage.getItem('ab_events');
      if (eventsData) {
        this.events = JSON.parse(eventsData);
      }
    } catch (error) {
      console.error('Error loading A/B testing data from storage:', error);
    }
  }

  // Public API Methods
  getExperiment(id: string): Experiment | undefined {
    return this.experiments.get(id);
  }

  getAllExperiments(): Experiment[] {
    return Array.from(this.experiments.values());
  }

  getRunningExperiments(): Experiment[] {
    return this.getAllExperiments().filter(exp => exp.status === 'running');
  }

  getExperimentForUser(userId: string): Record<string, string> {
    return this.userAssignments.get(userId) || {};
  }
}

// Singleton instance
export const experimentEngine = new ExperimentEngine();

// React Hooks for A/B Testing
export function useExperiment(experimentId: string): {
  variant: string | null;
  isLoading: boolean;
  trackConversion: (metric?: string, value?: number) => void;
  trackRevenue: (amount: number, metric?: string) => void;
} {
  const [variant, setVariant] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Get current user ID (this should come from your auth system)
    const userId = getCurrentUserId(); // You'll need to implement this
    
    if (userId) {
      const assignedVariant = experimentEngine.assignUserToExperiment(experimentId, userId);
      setVariant(assignedVariant);
    }
    
    setIsLoading(false);
  }, [experimentId]);

  const trackConversion = React.useCallback((metric: string = 'conversion', value: number = 1) => {
    const userId = getCurrentUserId();
    if (userId) {
      experimentEngine.trackConversion(experimentId, userId, metric, value);
    }
  }, [experimentId]);

  const trackRevenue = React.useCallback((amount: number, metric: string = 'revenue') => {
    const userId = getCurrentUserId();
    if (userId) {
      experimentEngine.trackRevenue(experimentId, userId, amount, metric);
    }
  }, [experimentId]);

  return {
    variant,
    isLoading,
    trackConversion,
    trackRevenue
  };
}

// Utility function to get current user ID - you'll need to implement this
function getCurrentUserId(): string | null {
  // This should integrate with your existing auth system
  return 'user_' + Math.random().toString(36).substr(2, 9);
}

// Export the React import for the hook
import React from 'react';