// Integration layer between A/B Testing Engine and existing Feature Toggles + Funnel Analytics
// Enhances existing systems with experimentation capabilities

import { experimentEngine, type Experiment, type ExperimentEvent } from './experiment-engine';
import { featureToggleService, type FeatureContext } from '@/lib/feature-toggles';
import { funnelAnalytics, type FunnelStep, type FunnelSession } from '@/lib/funnel-analytics';

// Enhanced Feature Toggle with A/B Testing Support
export interface ExperimentAwareFeatureContext extends FeatureContext {
  experiments?: Record<string, string>; // experimentId -> variantId
}

// Enhanced Funnel Session with Experiment Data
export interface ExperimentAwareFunnelSession extends FunnelSession {
  experiments: Record<string, {
    experimentId: string;
    variantId: string;
    assignedAt: string;
  }>;
  abTestMetrics?: {
    experimentConversions: Record<string, number>;
    variantPerformance: Record<string, any>;
  };
}

class ABTestingIntegrationService {
  constructor() {
    this.initializeIntegration();
  }

  // Enhanced Feature Toggle Evaluation with A/B Testing
  isFeatureEnabledWithExperiments(
    featureKey: string, 
    context: ExperimentAwareFeatureContext
  ): boolean {
    // First check if this feature is part of an active experiment
    const experiment = this.getExperimentForFeature(featureKey);
    
    if (experiment && experiment.status === 'running') {
      const variantId = experimentEngine.assignUserToExperiment(experiment.id, context.userId);
      
      if (variantId) {
        // Store experiment assignment in context
        if (!context.experiments) {
          context.experiments = {};
        }
        context.experiments[experiment.id] = variantId;
        
        // Get feature configuration for this variant
        const variant = experiment.variants.find(v => v.id === variantId);
        if (variant?.featureConfig && variant.featureConfig[featureKey] !== undefined) {
          return variant.featureConfig[featureKey];
        }
      }
    }
    
    // Fall back to regular feature toggle evaluation
    return featureToggleService.isFeatureEnabled(featureKey, context);
  }

  // Enhanced Funnel Tracking with A/B Test Data
  trackFunnelStepWithExperiments(
    step: FunnelStep,
    userId: string
  ): void {
    // Get user's experiment assignments
    const userExperiments = experimentEngine.getExperimentForUser(userId);
    
    // Enhance funnel step with experiment data
    const enhancedStep: FunnelStep = {
      ...step,
      metadata: {
        ...step.metadata,
        experiments: userExperiments,
        abTestCohort: this.determineABTestCohort(userExperiments)
      }
    };

    // Track in funnel analytics
    funnelAnalytics.trackStep(enhancedStep);

    // Track experiment events for conversions
    this.trackExperimentConversions(step, userId, userExperiments);
  }

  // Automatic A/B Test Event Tracking from Funnel Events
  private trackExperimentConversions(
    step: FunnelStep,
    userId: string,
    userExperiments: Record<string, string>
  ): void {
    for (const [experimentId, variantId] of Object.entries(userExperiments)) {
      // Map funnel steps to experiment metrics
      const metricMapping = this.getFunnelToExperimentMetricMapping(step.step);
      
      for (const metric of metricMapping) {
        const event: ExperimentEvent = {
          experimentId,
          variantId,
          userId,
          sessionId: step.sessionId,
          eventType: 'conversion',
          eventData: {
            metric,
            value: 1,
            timestamp: step.timestamp,
            metadata: {
              funnelStep: step.step,
              stepOrder: step.stepOrder,
              documentType: step.metadata.documentType,
              source: step.metadata.source
            }
          }
        };

        experimentEngine.trackEvent(event);
      }
    }
  }

  // Create A/B Test from Feature Flag
  async createExperimentFromFeatureFlag(
    featureKey: string,
    experimentConfig: {
      name: string;
      hypothesis: string;
      variants: Array<{
        name: string;
        description: string;
        trafficAllocation: number;
        isControl: boolean;
        featureValue: boolean;
      }>;
      targetAudience: {
        percentage: number;
        roles?: string[];
      };
      primaryMetric: {
        name: string;
        type: 'conversion' | 'revenue' | 'engagement';
        goal: 'increase' | 'decrease';
      };
      duration: number; // days
    }
  ): Promise<Experiment> {
    
    const variants = experimentConfig.variants.map((v, index) => ({
      id: `variant_${index}`,
      name: v.name,
      description: v.description,
      trafficAllocation: v.trafficAllocation,
      isControl: v.isControl,
      featureConfig: {
        [featureKey]: v.featureValue
      }
    }));

    const experiment = await experimentEngine.createExperiment({
      name: experimentConfig.name,
      description: `A/B test for feature: ${featureKey}`,
      hypothesis: experimentConfig.hypothesis,
      status: 'draft',
      targetAudience: experimentConfig.targetAudience,
      variants,
      primaryMetric: {
        ...experimentConfig.primaryMetric,
        minimumDetectableEffect: 5 // Default 5% MDE
      },
      secondaryMetrics: [
        {
          name: 'visit_to_draft',
          type: 'conversion',
          goal: 'increase'
        },
        {
          name: 'draft_to_checkout',
          type: 'conversion',
          goal: 'increase'
        },
        {
          name: 'checkout_to_signed',
          type: 'conversion',
          goal: 'increase'
        }
      ],
      startDate: new Date().toISOString(),
      estimatedDuration: experimentConfig.duration,
      minSampleSize: 1000,
      statisticalPower: 0.8,
      significanceLevel: 0.05,
      featureFlag: featureKey,
      owner: 'product_team',
      team: 'growth',
      tags: ['feature_test', 'conversion']
    });

    return experiment;
  }

  // Revenue Tracking Integration
  trackRevenueForExperiments(
    userId: string,
    amount: number,
    orderId: string,
    metadata?: Record<string, any>
  ): void {
    const userExperiments = experimentEngine.getExperimentForUser(userId);
    
    for (const [experimentId, variantId] of Object.entries(userExperiments)) {
      experimentEngine.trackRevenue(experimentId, userId, amount, 'revenue');
      
      // Also track as funnel conversion
      const event: ExperimentEvent = {
        experimentId,
        variantId,
        userId,
        sessionId: `sess_${userId}_${Date.now()}`,
        eventType: 'revenue',
        eventData: {
          metric: 'revenue',
          value: amount,
          timestamp: new Date().toISOString(),
          metadata: {
            orderId,
            ...metadata
          }
        }
      };

      experimentEngine.trackEvent(event);
    }
  }

  // Get Experiment Results with Funnel Insights
  async getExperimentResultsWithFunnelInsights(experimentId: string) {
    const experiment = experimentEngine.getExperiment(experimentId);
    if (!experiment || !experiment.results) {
      return null;
    }

    // Get funnel analytics for experiment period
    const funnelInsights = await this.getFunnelInsightsForExperiment(experiment);
    
    return {
      ...experiment.results,
      funnelInsights: {
        conversionByStep: funnelInsights.conversionByStep,
        dropoffAnalysis: funnelInsights.dropoffAnalysis,
        timeToConvert: funnelInsights.timeToConvert,
        userJourney: funnelInsights.userJourney
      }
    };
  }

  // Automated Experiment Recommendations
  generateExperimentRecommendations(): Array<{
    type: string;
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    estimatedImpact: number;
    effort: 'low' | 'medium' | 'high';
    suggestedTest: {
      hypothesis: string;
      variants: string[];
      metrics: string[];
      audience: string;
    };
  }> {
    // Analyze funnel data to recommend experiments
    const funnelMetrics = funnelAnalytics.calculateConversionMetrics('30d');
    const abandonmentAnalysis = funnelAnalytics.analyzeAbandonment();
    
    const recommendations = [];

    // High-impact conversion optimization recommendations
    if (funnelMetrics.overall.visitToDraft < 30) {
      recommendations.push({
        type: 'landing_page_optimization',
        priority: 'high' as const,
        title: 'Landing Page Value Proposition Test',
        description: 'Low visit-to-draft conversion suggests landing page optimization opportunity',
        estimatedImpact: 15,
        effort: 'medium' as const,
        suggestedTest: {
          hypothesis: 'Clearer value proposition and social proof will increase draft starts',
          variants: ['Current', 'Enhanced Headlines + Testimonials', 'Video Demo'],
          metrics: ['visit_to_draft', 'time_on_page', 'scroll_depth'],
          audience: 'All new visitors'
        }
      });
    }

    if (funnelMetrics.overall.draftToCheckout < 60) {
      recommendations.push({
        type: 'form_optimization',
        priority: 'high' as const,
        title: 'Document Creation Form Simplification',
        description: 'Poor draft-to-checkout conversion indicates form friction',
        estimatedImpact: 20,
        effort: 'low' as const,
        suggestedTest: {
          hypothesis: 'Reducing form fields and adding progress indicators will improve completion',
          variants: ['Current Form', 'Simplified Form', 'Multi-step with Progress'],
          metrics: ['draft_to_checkout', 'form_completion_time', 'field_errors'],
          audience: 'Users who start document creation'
        }
      });
    }

    if (funnelMetrics.overall.checkoutToSigned < 80) {
      recommendations.push({
        type: 'checkout_optimization',
        priority: 'high' as const,
        title: 'Checkout Trust & Security Enhancement',
        description: 'Checkout abandonment suggests trust or pricing concerns',
        estimatedImpact: 12,
        effort: 'medium' as const,
        suggestedTest: {
          hypothesis: 'Enhanced security badges and transparent pricing will reduce checkout abandonment',
          variants: ['Current Checkout', 'Security Badges + Guarantees', 'Price Breakdown + FAQ'],
          metrics: ['checkout_to_signed', 'time_in_checkout', 'support_contacts'],
          audience: 'Users who reach checkout'
        }
      });
    }

    // Feature-specific recommendations
    const runningExperiments = experimentEngine.getRunningExperiments();
    if (runningExperiments.length < 3) {
      recommendations.push({
        type: 'ai_feature_test',
        priority: 'medium' as const,
        title: 'AI Document Suggestions A/B Test',
        description: 'Test impact of AI-powered document recommendations',
        estimatedImpact: 8,
        effort: 'low' as const,
        suggestedTest: {
          hypothesis: 'AI-powered document suggestions will improve user engagement and conversion',
          variants: ['No AI Suggestions', 'Basic Suggestions', 'Contextual AI Recommendations'],
          metrics: ['engagement_time', 'documents_viewed', 'conversion_rate'],
          audience: 'New users browsing documents'
        }
      });
    }

    return recommendations.sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      return priorityWeight[b.priority] - priorityWeight[a.priority] || 
             b.estimatedImpact - a.estimatedImpact;
    });
  }

  // Helper Methods
  private getExperimentForFeature(featureKey: string): Experiment | null {
    const runningExperiments = experimentEngine.getRunningExperiments();
    return runningExperiments.find(exp => exp.featureFlag === featureKey) || null;
  }

  private determineABTestCohort(userExperiments: Record<string, string>): string {
    if (Object.keys(userExperiments).length === 0) {
      return 'control';
    }
    
    const cohortParts = Object.entries(userExperiments)
      .map(([expId, variantId]) => `${expId.split('_')[1]}-${variantId.split('_')[1]}`)
      .sort()
      .join('_');
    
    return `exp_${cohortParts}`;
  }

  private getFunnelToExperimentMetricMapping(funnelStep: string): string[] {
    const mapping: Record<string, string[]> = {
      'visit': ['page_view', 'landing_engagement'],
      'draft': ['draft_started', 'form_engagement'],
      'checkout': ['checkout_initiated', 'payment_intent'],
      'signed': ['conversion', 'purchase_completed']
    };
    
    return mapping[funnelStep] || [];
  }

  private async getFunnelInsightsForExperiment(experiment: Experiment) {
    // This would integrate with the existing funnel analytics to get
    // experiment-specific insights
    return {
      conversionByStep: {
        visit_to_draft: 0.25,
        draft_to_checkout: 0.65,
        checkout_to_signed: 0.82
      },
      dropoffAnalysis: {
        primaryDropoff: 'visit_to_draft',
        dropoffRate: 0.75,
        commonReasons: ['Unclear value prop', 'Price concerns', 'Trust issues']
      },
      timeToConvert: {
        average: 1800, // seconds
        median: 1200,
        p95: 3600
      },
      userJourney: {
        avgStepsToConversion: 4.2,
        commonPaths: [
          'visit -> draft -> checkout -> signed',
          'visit -> browse -> draft -> checkout -> signed'
        ]
      }
    };
  }

  private initializeIntegration(): void {
    // Set up event listeners and integrations
    this.setupFunnelAnalyticsIntegration();
    this.setupFeatureToggleIntegration();
  }

  private setupFunnelAnalyticsIntegration(): void {
    // In a real implementation, you'd hook into funnel analytics events
    console.log('A/B Testing integration with Funnel Analytics initialized');
  }

  private setupFeatureToggleIntegration(): void {
    // In a real implementation, you'd enhance the feature toggle service
    console.log('A/B Testing integration with Feature Toggles initialized');
  }
}

// Singleton instance
export const abTestingIntegration = new ABTestingIntegrationService();

// Enhanced React Hooks
export function useExperimentAwareFeature(
  featureKey: string,
  context: ExperimentAwareFeatureContext
): {
  isEnabled: boolean;
  variant: string | null;
  experimentId: string | null;
  trackConversion: (metric?: string, value?: number) => void;
} {
  const [state, setState] = React.useState({
    isEnabled: false,
    variant: null as string | null,
    experimentId: null as string | null
  });

  React.useEffect(() => {
    const isEnabled = abTestingIntegration.isFeatureEnabledWithExperiments(featureKey, context);
    const userExperiments = context.experiments || {};
    
    // Find experiment for this feature
    const experiment = Object.keys(userExperiments).find(expId => {
      const exp = experimentEngine.getExperiment(expId);
      return exp?.featureFlag === featureKey;
    });

    setState({
      isEnabled,
      variant: experiment ? userExperiments[experiment] : null,
      experimentId: experiment || null
    });
  }, [featureKey, context]);

  const trackConversion = React.useCallback((metric: string = 'conversion', value: number = 1) => {
    if (state.experimentId) {
      experimentEngine.trackConversion(state.experimentId, context.userId, metric, value);
    }
  }, [state.experimentId, context.userId]);

  return {
    ...state,
    trackConversion
  };
}

// Funnel tracking with experiments
export function useFunnelTrackingWithExperiments() {
  const trackStep = React.useCallback((
    step: FunnelStep['step'],
    sessionId: string,
    userId: string,
    metadata?: Partial<FunnelStep['metadata']>
  ) => {
    const funnelStep: FunnelStep = {
      step,
      stepOrder: { visit: 1, draft: 2, checkout: 3, signed: 4 }[step],
      timestamp: new Date().toISOString(),
      sessionId,
      userId,
      deviceId: `dev_${Math.random().toString(36).substr(2, 12)}`,
      metadata: metadata || {}
    };

    abTestingIntegration.trackFunnelStepWithExperiments(funnelStep, userId);
  }, []);

  const trackRevenue = React.useCallback((
    userId: string,
    amount: number,
    orderId: string,
    metadata?: Record<string, any>
  ) => {
    abTestingIntegration.trackRevenueForExperiments(userId, amount, orderId, metadata);
  }, []);

  return {
    trackStep,
    trackRevenue
  };
}

// Experiment recommendations hook
export function useExperimentRecommendations() {
  const [recommendations, setRecommendations] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    try {
      const recs = abTestingIntegration.generateExperimentRecommendations();
      setRecommendations(recs);
    } catch (error) {
      console.error('Error generating experiment recommendations:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    recommendations,
    loading,
    refresh: () => {
      setLoading(true);
      const recs = abTestingIntegration.generateExperimentRecommendations();
      setRecommendations(recs);
      setLoading(false);
    }
  };
}

import React from 'react';