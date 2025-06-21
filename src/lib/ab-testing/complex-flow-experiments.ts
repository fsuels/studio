// Complex User Flow Experiments for 123LegalDoc
// Multi-step user journey optimization with advanced tracking

import { experimentEngine, type Experiment } from './experiment-engine';
import { abTestingIntegration } from './integration';

export interface FlowExperiment {
  id: string;
  name: string;
  type:
    | 'funnel_optimization'
    | 'user_journey'
    | 'onboarding'
    | 'checkout_flow'
    | 'document_wizard';
  complexity: 'medium' | 'high' | 'very_high';
  estimatedImpact: number;
  implementationEffort: 'medium' | 'high' | 'very_high';
  testDuration: number; // days
  description: string;
  hypothesis: string;

  // Multi-step flow definition
  flowSteps: Array<{
    step: string;
    description: string;
    currentExperience: string;
    proposedChanges: string[];
    keyMetrics: string[];
  }>;

  variants: Array<{
    name: string;
    description: string;
    isControl: boolean;
    flowModifications: Array<{
      step: string;
      changes: Record<string, any>;
    }>;
  }>;

  // Advanced metrics
  primaryGoals: Array<{
    metric: string;
    target: number;
    priority: 'primary' | 'secondary';
  }>;

  funnelTracking: {
    steps: string[];
    dropoffPoints: string[];
    conversionEvents: string[];
  };

  // Success criteria
  successCriteria: {
    minimumLift: number;
    confidenceLevel: number;
    minimumSampleSize: number;
    maxTestDuration: number;
  };
}

// Document Creation Wizard Flow Optimization
export const DOCUMENT_WIZARD_EXPERIMENTS: FlowExperiment[] = [
  {
    id: 'wizard_progressive_disclosure',
    name: 'Document Wizard Progressive Disclosure',
    type: 'document_wizard',
    complexity: 'high',
    estimatedImpact: 25,
    implementationEffort: 'high',
    testDuration: 21,
    description:
      'Test progressive disclosure vs traditional form wizard for document creation',
    hypothesis:
      'Breaking complex legal forms into micro-steps with contextual help will increase completion rates and reduce abandonment',

    flowSteps: [
      {
        step: 'document_selection',
        description: 'User selects document type',
        currentExperience: 'Grid of document cards with basic descriptions',
        proposedChanges: [
          'Interactive document finder with questions',
          'Situation-based recommendations',
          'Preview of form complexity',
        ],
        keyMetrics: [
          'selection_time',
          'correct_document_selection',
          'help_requests',
        ],
      },
      {
        step: 'information_collection',
        description: 'User fills out document details',
        currentExperience: 'Multi-page form with all fields visible',
        proposedChanges: [
          'One question at a time with progress indicators',
          'Contextual legal explanations',
          'Smart field pre-filling',
        ],
        keyMetrics: ['form_completion_rate', 'time_per_field', 'error_rate'],
      },
      {
        step: 'review_and_customize',
        description: 'User reviews and customizes document',
        currentExperience: 'Traditional preview with edit mode',
        proposedChanges: [
          'Guided review with explanations',
          'Suggested customizations',
          'Real-time legal validity checks',
        ],
        keyMetrics: ['review_time', 'customization_rate', 'legal_help_usage'],
      },
      {
        step: 'finalization',
        description: 'User completes and downloads document',
        currentExperience: 'Standard checkout and download',
        proposedChanges: [
          'Value reinforcement messaging',
          'Upsell related documents',
          'Next steps guidance',
        ],
        keyMetrics: [
          'checkout_completion',
          'additional_purchases',
          'satisfaction_score',
        ],
      },
    ],

    variants: [
      {
        name: 'Control - Traditional Wizard',
        description: 'Current multi-page form approach',
        isControl: true,
        flowModifications: [],
      },
      {
        name: 'Progressive Disclosure',
        description: 'One question at a time with contextual help',
        isControl: false,
        flowModifications: [
          {
            step: 'information_collection',
            changes: {
              layout: 'single_question',
              help_type: 'contextual_explanations',
              progress_indicator: 'step_by_step',
            },
          },
        ],
      },
      {
        name: 'AI-Assisted Flow',
        description: 'AI-powered form filling with smart suggestions',
        isControl: false,
        flowModifications: [
          {
            step: 'document_selection',
            changes: {
              selection_method: 'ai_questionnaire',
              recommendations: 'situation_based',
            },
          },
          {
            step: 'information_collection',
            changes: {
              assistance: 'ai_powered',
              pre_filling: 'smart_suggestions',
              validation: 'real_time',
            },
          },
        ],
      },
    ],

    primaryGoals: [
      { metric: 'wizard_completion_rate', target: 20, priority: 'primary' },
      { metric: 'user_satisfaction', target: 15, priority: 'primary' },
      { metric: 'time_to_complete', target: -30, priority: 'secondary' },
    ],

    funnelTracking: {
      steps: [
        'wizard_start',
        'document_selected',
        'form_started',
        'form_completed',
        'review_started',
        'checkout_completed',
      ],
      dropoffPoints: ['form_abandon', 'review_abandon', 'checkout_abandon'],
      conversionEvents: [
        'wizard_complete',
        'document_purchase',
        'satisfaction_survey',
      ],
    },

    successCriteria: {
      minimumLift: 15,
      confidenceLevel: 95,
      minimumSampleSize: 2000,
      maxTestDuration: 28,
    },
  },
];

// Onboarding Flow Optimization
export const ONBOARDING_EXPERIMENTS: FlowExperiment[] = [
  {
    id: 'user_onboarding_personalization',
    name: 'Personalized User Onboarding Journey',
    type: 'onboarding',
    complexity: 'very_high',
    estimatedImpact: 35,
    implementationEffort: 'very_high',
    testDuration: 30,
    description:
      'Test personalized onboarding flows based on user type and legal needs',
    hypothesis:
      'Tailoring onboarding experience to user type (individual vs business) and legal expertise will increase engagement and first document creation',

    flowSteps: [
      {
        step: 'welcome_and_profiling',
        description: 'Welcome user and determine their profile',
        currentExperience: 'Generic welcome with basic signup',
        proposedChanges: [
          'User type identification (individual/business)',
          'Legal experience assessment',
          'Goal-based customization',
        ],
        keyMetrics: [
          'profile_completion',
          'accuracy_of_profiling',
          'engagement_score',
        ],
      },
      {
        step: 'personalized_tour',
        description: 'Product tour based on user profile',
        currentExperience: 'Generic product tour for all users',
        proposedChanges: [
          'Role-specific feature highlights',
          'Use case demonstrations',
          'Complexity level adjustment',
        ],
        keyMetrics: [
          'tour_completion',
          'feature_interaction',
          'tour_skip_rate',
        ],
      },
      {
        step: 'first_document_guidance',
        description: 'Guided creation of first document',
        currentExperience: 'User browses document library independently',
        proposedChanges: [
          'Curated document recommendations',
          'Guided first-time creation',
          'Success celebration and next steps',
        ],
        keyMetrics: [
          'first_document_created',
          'guided_completion_rate',
          'time_to_first_value',
        ],
      },
    ],

    variants: [
      {
        name: 'Control - Generic Onboarding',
        description: 'Current one-size-fits-all onboarding',
        isControl: true,
        flowModifications: [],
      },
      {
        name: 'Basic Personalization',
        description: 'Simple user type detection with customized content',
        isControl: false,
        flowModifications: [
          {
            step: 'welcome_and_profiling',
            changes: {
              profiling_questions: 'basic_user_type',
              customization_level: 'content_only',
            },
          },
        ],
      },
      {
        name: 'Advanced Personalization',
        description: 'Deep profiling with AI-powered customization',
        isControl: false,
        flowModifications: [
          {
            step: 'welcome_and_profiling',
            changes: {
              profiling_questions: 'comprehensive',
              ai_analysis: 'user_intent_detection',
            },
          },
          {
            step: 'personalized_tour',
            changes: {
              tour_type: 'adaptive',
              content_level: 'expertise_matched',
            },
          },
        ],
      },
    ],

    primaryGoals: [
      { metric: 'first_document_creation', target: 35, priority: 'primary' },
      { metric: 'day_7_retention', target: 25, priority: 'primary' },
      { metric: 'onboarding_completion', target: 20, priority: 'secondary' },
    ],

    funnelTracking: {
      steps: [
        'signup_complete',
        'profile_created',
        'tour_started',
        'tour_completed',
        'first_doc_started',
        'first_doc_completed',
      ],
      dropoffPoints: ['profile_abandon', 'tour_abandon', 'first_doc_abandon'],
      conversionEvents: [
        'profile_complete',
        'tour_complete',
        'first_doc_success',
        'day_7_active',
      ],
    },

    successCriteria: {
      minimumLift: 20,
      confidenceLevel: 95,
      minimumSampleSize: 3000,
      maxTestDuration: 35,
    },
  },
];

// Complete Checkout Flow Optimization
export const CHECKOUT_FLOW_EXPERIMENTS: FlowExperiment[] = [
  {
    id: 'streamlined_checkout_trust',
    name: 'Streamlined Checkout with Trust Building',
    type: 'checkout_flow',
    complexity: 'high',
    estimatedImpact: 28,
    implementationEffort: 'high',
    testDuration: 14,
    description:
      'Optimize entire checkout flow with trust signals and reduced friction',
    hypothesis:
      'Streamlined single-page checkout with progressive trust building will reduce abandonment and increase conversion',

    flowSteps: [
      {
        step: 'cart_review',
        description: 'User reviews items in cart',
        currentExperience: 'Separate cart page with minimal information',
        proposedChanges: [
          'Inline cart with document preview',
          'Value reinforcement messaging',
          'Related document suggestions',
        ],
        keyMetrics: [
          'cart_engagement',
          'upsell_acceptance',
          'proceed_to_checkout',
        ],
      },
      {
        step: 'customer_information',
        description: 'User enters contact and billing info',
        currentExperience: 'Multi-step form with separate pages',
        proposedChanges: [
          'Single-page adaptive form',
          'Smart address completion',
          'Progressive trust indicators',
        ],
        keyMetrics: [
          'form_completion_speed',
          'error_rate',
          'abandonment_point',
        ],
      },
      {
        step: 'payment_processing',
        description: 'User completes payment',
        currentExperience: 'Basic payment form',
        proposedChanges: [
          'Multiple payment options',
          'Security badge prominence',
          'Real-time validation',
        ],
        keyMetrics: [
          'payment_completion',
          'payment_errors',
          'security_confidence',
        ],
      },
      {
        step: 'confirmation_and_delivery',
        description: 'Order confirmation and document delivery',
        currentExperience: 'Simple confirmation email',
        proposedChanges: [
          'Immediate document preview',
          'Next steps guidance',
          'Satisfaction survey',
        ],
        keyMetrics: [
          'satisfaction_score',
          'document_download',
          'support_contact_rate',
        ],
      },
    ],

    variants: [
      {
        name: 'Control - Multi-Step Checkout',
        description: 'Current multi-page checkout process',
        isControl: true,
        flowModifications: [],
      },
      {
        name: 'Single-Page Streamlined',
        description: 'Single-page checkout with trust signals',
        isControl: false,
        flowModifications: [
          {
            step: 'customer_information',
            changes: {
              layout: 'single_page',
              trust_signals: 'progressive',
              form_type: 'adaptive',
            },
          },
        ],
      },
      {
        name: 'Express Checkout',
        description: 'Minimal fields with guest option',
        isControl: false,
        flowModifications: [
          {
            step: 'customer_information',
            changes: {
              guest_option: 'prominent',
              required_fields: 'minimal',
              payment_integration: 'express',
            },
          },
        ],
      },
    ],

    primaryGoals: [
      { metric: 'checkout_conversion', target: 28, priority: 'primary' },
      { metric: 'checkout_abandonment', target: -35, priority: 'primary' },
      {
        metric: 'time_to_complete_purchase',
        target: -40,
        priority: 'secondary',
      },
    ],

    funnelTracking: {
      steps: [
        'cart_view',
        'checkout_start',
        'info_completed',
        'payment_submitted',
        'order_confirmed',
      ],
      dropoffPoints: ['cart_abandon', 'info_abandon', 'payment_abandon'],
      conversionEvents: [
        'checkout_complete',
        'payment_success',
        'document_delivered',
      ],
    },

    successCriteria: {
      minimumLift: 20,
      confidenceLevel: 95,
      minimumSampleSize: 1500,
      maxTestDuration: 21,
    },
  },
];

// Advanced Funnel Optimization
export const FUNNEL_OPTIMIZATION_EXPERIMENTS: FlowExperiment[] = [
  {
    id: 'complete_user_journey_optimization',
    name: 'End-to-End User Journey Optimization',
    type: 'funnel_optimization',
    complexity: 'very_high',
    estimatedImpact: 40,
    implementationEffort: 'very_high',
    testDuration: 45,
    description:
      'Comprehensive optimization of entire user journey from landing to document completion',
    hypothesis:
      'Coordinated optimization across all touchpoints will create compounding conversion improvements',

    flowSteps: [
      {
        step: 'landing_and_discovery',
        description: 'User lands on site and discovers value',
        currentExperience: 'Generic landing page with basic value prop',
        proposedChanges: [
          'Dynamic landing pages by traffic source',
          'Personalized value propositions',
          'Interactive document finder',
        ],
        keyMetrics: ['bounce_rate', 'page_depth', 'cta_engagement'],
      },
      {
        step: 'document_exploration',
        description: 'User explores documents and options',
        currentExperience: 'Static document library',
        proposedChanges: [
          'AI-powered document recommendations',
          'Visual document complexity indicators',
          'Social proof integration',
        ],
        keyMetrics: [
          'documents_viewed',
          'preview_engagement',
          'selection_accuracy',
        ],
      },
      {
        step: 'document_creation',
        description: 'User creates their document',
        currentExperience: 'Standard form wizard',
        proposedChanges: [
          'Adaptive complexity based on user skill',
          'Real-time help and validation',
          'Progress gamification',
        ],
        keyMetrics: [
          'creation_completion',
          'help_usage',
          'satisfaction_during_creation',
        ],
      },
      {
        step: 'purchase_and_delivery',
        description: 'User purchases and receives document',
        currentExperience: 'Basic checkout and email delivery',
        proposedChanges: [
          'Value-reinforced checkout',
          'Instant preview and download',
          'Proactive follow-up support',
        ],
        keyMetrics: [
          'purchase_conversion',
          'delivery_satisfaction',
          'repeat_intent',
        ],
      },
    ],

    variants: [
      {
        name: 'Control - Current Experience',
        description: 'Existing user journey without optimization',
        isControl: true,
        flowModifications: [],
      },
      {
        name: 'Coordinated Optimization',
        description: 'Optimizations applied across all steps',
        isControl: false,
        flowModifications: [
          {
            step: 'landing_and_discovery',
            changes: {
              personalization: 'traffic_source_based',
              value_prop: 'dynamic',
              interaction: 'enhanced',
            },
          },
          {
            step: 'document_creation',
            changes: {
              complexity_adaptation: 'user_based',
              assistance: 'ai_powered',
              motivation: 'gamified',
            },
          },
        ],
      },
    ],

    primaryGoals: [
      { metric: 'overall_conversion_rate', target: 40, priority: 'primary' },
      { metric: 'customer_lifetime_value', target: 25, priority: 'primary' },
      { metric: 'user_satisfaction_score', target: 20, priority: 'secondary' },
    ],

    funnelTracking: {
      steps: [
        'landing',
        'document_browse',
        'creation_start',
        'creation_complete',
        'purchase',
        'delivery',
      ],
      dropoffPoints: [
        'bounce',
        'browse_abandon',
        'creation_abandon',
        'checkout_abandon',
      ],
      conversionEvents: [
        'deep_engagement',
        'creation_success',
        'purchase_complete',
        'satisfaction_high',
      ],
    },

    successCriteria: {
      minimumLift: 25,
      confidenceLevel: 95,
      minimumSampleSize: 5000,
      maxTestDuration: 60,
    },
  },
];

// All complex flow experiments
export const ALL_COMPLEX_FLOW_EXPERIMENTS: FlowExperiment[] = [
  ...DOCUMENT_WIZARD_EXPERIMENTS,
  ...ONBOARDING_EXPERIMENTS,
  ...CHECKOUT_FLOW_EXPERIMENTS,
  ...FUNNEL_OPTIMIZATION_EXPERIMENTS,
];

// Advanced experiment creation with flow tracking
export async function createComplexFlowExperiment(
  flowExperimentId: string,
  options?: {
    testDuration?: number;
    targetAudience?: { percentage: number };
    owner?: string;
  },
): Promise<string> {
  const flowExperiment = ALL_COMPLEX_FLOW_EXPERIMENTS.find(
    (e) => e.id === flowExperimentId,
  );
  if (!flowExperiment) {
    throw new Error(`Flow experiment ${flowExperimentId} not found`);
  }

  // Convert flow experiment to standard experiment format
  const variants = flowExperiment.variants.map((variant, index) => ({
    id: `variant_${index}`,
    name: variant.name,
    description: variant.description,
    trafficAllocation: Math.floor(100 / flowExperiment.variants.length),
    isControl: variant.isControl,
    featureConfig: variant.flowModifications.reduce(
      (config, mod) => ({
        ...config,
        [`${mod.step}_config`]: mod.changes,
      }),
      {} as Record<string, any>,
    ),
  }));

  const experiment = await experimentEngine.createExperiment({
    name: flowExperiment.name,
    description: flowExperiment.description,
    hypothesis: flowExperiment.hypothesis,
    targetAudience: {
      percentage: options?.targetAudience?.percentage || 50,
    },
    variants,
    primaryMetric: {
      name: flowExperiment.primaryGoals[0].metric,
      type: 'conversion',
      goal: 'increase',
      minimumDetectableEffect: flowExperiment.successCriteria.minimumLift,
    },
    secondaryMetrics: flowExperiment.primaryGoals.slice(1).map((goal) => ({
      name: goal.metric,
      type: 'conversion' as const,
      goal: goal.target > 0 ? ('increase' as const) : ('decrease' as const),
    })),
    startDate: new Date().toISOString(),
    estimatedDuration: options?.testDuration || flowExperiment.testDuration,
    minSampleSize: flowExperiment.successCriteria.minimumSampleSize,
    statisticalPower: 0.8,
    significanceLevel: 0.05,
    owner: options?.owner || 'product_team',
    team: 'growth',
    tags: [flowExperiment.type, 'complex_flow', flowExperiment.complexity],
  });

  return experiment.id;
}

// Flow experiment tracking utilities
export class FlowExperimentTracker {
  private flowExperiment: FlowExperiment;
  private experimentId: string;

  constructor(flowExperimentId: string, experimentId: string) {
    const flowExperiment = ALL_COMPLEX_FLOW_EXPERIMENTS.find(
      (e) => e.id === flowExperimentId,
    );
    if (!flowExperiment) {
      throw new Error(`Flow experiment ${flowExperimentId} not found`);
    }
    this.flowExperiment = flowExperiment;
    this.experimentId = experimentId;
  }

  trackFlowStep(
    userId: string,
    step: string,
    metadata?: Record<string, any>,
  ): void {
    if (!this.flowExperiment.funnelTracking.steps.includes(step)) {
      console.warn(
        `Step ${step} not defined in flow experiment ${this.flowExperiment.id}`,
      );
      return;
    }

    experimentEngine.trackEvent({
      experimentId: this.experimentId,
      variantId: this.getUserVariant(userId) || 'unknown',
      userId,
      sessionId: `sess_${userId}_${Date.now()}`,
      eventType: 'conversion',
      eventData: {
        metric: `flow_step_${step}`,
        value: 1,
        timestamp: new Date().toISOString(),
        metadata: {
          flowStep: step,
          flowExperiment: this.flowExperiment.id,
          ...metadata,
        },
      },
    });
  }

  trackDropoff(userId: string, dropoffPoint: string, reason?: string): void {
    experimentEngine.trackEvent({
      experimentId: this.experimentId,
      variantId: this.getUserVariant(userId) || 'unknown',
      userId,
      sessionId: `sess_${userId}_${Date.now()}`,
      eventType: 'conversion',
      eventData: {
        metric: `dropoff_${dropoffPoint}`,
        value: 1,
        timestamp: new Date().toISOString(),
        metadata: {
          dropoffPoint,
          reason,
          flowExperiment: this.flowExperiment.id,
        },
      },
    });
  }

  trackFlowCompletion(
    userId: string,
    completionMetrics?: Record<string, number>,
  ): void {
    experimentEngine.trackEvent({
      experimentId: this.experimentId,
      variantId: this.getUserVariant(userId) || 'unknown',
      userId,
      sessionId: `sess_${userId}_${Date.now()}`,
      eventType: 'conversion',
      eventData: {
        metric: 'flow_completion',
        value: 1,
        timestamp: new Date().toISOString(),
        metadata: {
          flowExperiment: this.flowExperiment.id,
          completionMetrics,
        },
      },
    });
  }

  private getUserVariant(userId: string): string | null {
    const userExperiments = experimentEngine.getExperimentForUser(userId);
    return userExperiments[this.experimentId] || null;
  }
}

// Utility function to get recommended complex experiments
export function getRecommendedComplexExperiments(constraints?: {
  maxComplexity?: 'medium' | 'high' | 'very_high';
  maxImplementationEffort?: 'medium' | 'high' | 'very_high';
  minImpact?: number;
  maxDuration?: number;
}): FlowExperiment[] {
  let filtered = ALL_COMPLEX_FLOW_EXPERIMENTS;

  if (constraints?.maxComplexity) {
    const complexityOrder = { medium: 1, high: 2, very_high: 3 };
    const maxLevel = complexityOrder[constraints.maxComplexity];
    filtered = filtered.filter(
      (e) => complexityOrder[e.complexity] <= maxLevel,
    );
  }

  if (constraints?.maxImplementationEffort) {
    const effortOrder = { medium: 1, high: 2, very_high: 3 };
    const maxLevel = effortOrder[constraints.maxImplementationEffort];
    filtered = filtered.filter(
      (e) => effortOrder[e.implementationEffort] <= maxLevel,
    );
  }

  if (constraints?.minImpact) {
    filtered = filtered.filter(
      (e) => e.estimatedImpact >= constraints.minImpact,
    );
  }

  if (constraints?.maxDuration) {
    filtered = filtered.filter(
      (e) => e.testDuration <= constraints.maxDuration,
    );
  }

  return filtered.sort((a, b) => {
    // Sort by impact/complexity ratio
    const aRatio =
      a.estimatedImpact / { medium: 1, high: 2, very_high: 3 }[a.complexity];
    const bRatio =
      b.estimatedImpact / { medium: 1, high: 2, very_high: 3 }[b.complexity];
    return bRatio - aRatio;
  });
}
