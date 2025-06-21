// Ready-to-use A/B Test Templates for 123LegalDoc
// High-impact, low-effort experiments designed specifically for legal document SaaS

import { experimentEngine, type Experiment } from './experiment-engine';

export interface ExperimentTemplate {
  id: string;
  name: string;
  category: 'cta' | 'headline' | 'trust' | 'pricing' | 'form' | 'social_proof';
  priority: 'high' | 'medium' | 'low';
  estimatedImpact: number; // percentage lift expected
  implementationEffort: 'low' | 'medium' | 'high';
  description: string;
  hypothesis: string;
  variants: Array<{
    name: string;
    description: string;
    isControl: boolean;
    changes: Array<{
      element: string;
      property: string;
      value: string;
      description: string;
    }>;
  }>;
  targetElements: string[];
  successMetrics: string[];
  minimumSampleSize: number;
  estimatedDuration: number; // days
}

// High-Impact CTA Button Tests
export const CTA_BUTTON_TESTS: ExperimentTemplate[] = [
  {
    id: 'checkout_button_urgency',
    name: 'Checkout Button Urgency Language',
    category: 'cta',
    priority: 'high',
    estimatedImpact: 12,
    implementationEffort: 'low',
    description:
      'Test urgent vs standard language on checkout buttons to increase conversion',
    hypothesis:
      'Adding urgency language ("Get Document Now") will increase checkout conversion vs generic "Continue" button',
    variants: [
      {
        name: 'Control - Continue',
        description: 'Standard "Continue" button text',
        isControl: true,
        changes: [
          {
            element: 'checkout-button',
            property: 'text',
            value: 'Continue',
            description: 'Generic continue button',
          },
        ],
      },
      {
        name: 'Urgency - Get Document Now',
        description: 'Urgent action-oriented text',
        isControl: false,
        changes: [
          {
            element: 'checkout-button',
            property: 'text',
            value: 'Get My Document Now',
            description: 'Action-oriented urgent language',
          },
          {
            element: 'checkout-button',
            property: 'background-color',
            value: '#DC2626',
            description: 'Red background for urgency',
          },
        ],
      },
      {
        name: 'Value - Create Legal Document',
        description: 'Value-focused language',
        isControl: false,
        changes: [
          {
            element: 'checkout-button',
            property: 'text',
            value: 'Create Legal Document',
            description: 'Value-focused language',
          },
          {
            element: 'checkout-button',
            property: 'background-color',
            value: '#059669',
            description: 'Green background for positive action',
          },
        ],
      },
    ],
    targetElements: ['checkout-button', 'payment-form'],
    successMetrics: [
      'checkout_conversion',
      'time_to_convert',
      'abandonment_rate',
    ],
    minimumSampleSize: 1000,
    estimatedDuration: 7,
  },

  {
    id: 'homepage_cta_color',
    name: 'Homepage CTA Button Color & Text',
    category: 'cta',
    priority: 'high',
    estimatedImpact: 8,
    implementationEffort: 'low',
    description: 'Test different colors and copy for main homepage CTA',
    hypothesis:
      'Orange button with "Start My Document" will outperform blue "Get Started" button',
    variants: [
      {
        name: 'Control - Blue Get Started',
        description: 'Current blue button with generic text',
        isControl: true,
        changes: [
          {
            element: 'hero-cta-button',
            property: 'text',
            value: 'Get Started',
            description: 'Generic get started text',
          },
          {
            element: 'hero-cta-button',
            property: 'background-color',
            value: '#2563EB',
            description: 'Blue background',
          },
        ],
      },
      {
        name: 'Orange Action-Oriented',
        description: 'Orange button with specific action language',
        isControl: false,
        changes: [
          {
            element: 'hero-cta-button',
            property: 'text',
            value: 'Start My Document',
            description: 'Specific action-oriented text',
          },
          {
            element: 'hero-cta-button',
            property: 'background-color',
            value: '#EA580C',
            description: 'Orange background for attention',
          },
        ],
      },
    ],
    targetElements: ['hero-section', 'homepage-cta'],
    successMetrics: [
      'homepage_cta_click',
      'visit_to_draft',
      'session_duration',
    ],
    minimumSampleSize: 2000,
    estimatedDuration: 14,
  },
];

// Headline and Copy Tests
export const HEADLINE_TESTS: ExperimentTemplate[] = [
  {
    id: 'homepage_headline_value_prop',
    name: 'Homepage Value Proposition Headlines',
    category: 'headline',
    priority: 'high',
    estimatedImpact: 15,
    implementationEffort: 'low',
    description: 'Test different value propositions in main headline',
    hypothesis:
      'Focusing on speed/convenience vs legal accuracy will increase engagement',
    variants: [
      {
        name: 'Control - Legal Accuracy Focus',
        description: 'Current headline emphasizing legal correctness',
        isControl: true,
        changes: [
          {
            element: 'hero-headline',
            property: 'text',
            value: 'Legal Documents You Can Trust',
            description: 'Trust and accuracy focused',
          },
          {
            element: 'hero-subheadline',
            property: 'text',
            value: 'Professionally drafted legal forms for all your needs',
            description: 'Professional emphasis',
          },
        ],
      },
      {
        name: 'Speed & Convenience Focus',
        description: 'Headline emphasizing speed and ease',
        isControl: false,
        changes: [
          {
            element: 'hero-headline',
            property: 'text',
            value: 'Legal Documents in Minutes, Not Hours',
            description: 'Speed and efficiency focused',
          },
          {
            element: 'hero-subheadline',
            property: 'text',
            value:
              'Create legally-binding documents instantly with our simple wizard',
            description: 'Simplicity and speed emphasis',
          },
        ],
      },
      {
        name: 'Cost Savings Focus',
        description: 'Headline emphasizing money savings',
        isControl: false,
        changes: [
          {
            element: 'hero-headline',
            property: 'text',
            value: 'Save $500+ on Legal Fees',
            description: 'Cost savings focused',
          },
          {
            element: 'hero-subheadline',
            property: 'text',
            value: 'Get lawyer-quality documents without the lawyer prices',
            description: 'Money savings emphasis',
          },
        ],
      },
    ],
    targetElements: ['hero-section', 'homepage-headline'],
    successMetrics: ['time_on_page', 'scroll_depth', 'homepage_cta_click'],
    minimumSampleSize: 3000,
    estimatedDuration: 10,
  },
];

// Trust & Social Proof Tests
export const TRUST_TESTS: ExperimentTemplate[] = [
  {
    id: 'checkout_trust_signals',
    name: 'Checkout Page Trust Signals',
    category: 'trust',
    priority: 'high',
    estimatedImpact: 18,
    implementationEffort: 'medium',
    description: 'Test different trust signals on checkout page',
    hypothesis:
      'Security badges + money-back guarantee will reduce checkout abandonment',
    variants: [
      {
        name: 'Control - No Trust Signals',
        description: 'Current checkout without additional trust elements',
        isControl: true,
        changes: [],
      },
      {
        name: 'Security Badges',
        description: 'Add SSL and security certification badges',
        isControl: false,
        changes: [
          {
            element: 'checkout-trust-section',
            property: 'html',
            value:
              '<div class="flex items-center gap-2"><img src="/ssl-badge.svg" alt="SSL Secured" /><span class="text-sm text-gray-600">Your data is protected</span></div>',
            description: 'SSL security badge',
          },
        ],
      },
      {
        name: 'Money-Back Guarantee',
        description: 'Add prominent money-back guarantee',
        isControl: false,
        changes: [
          {
            element: 'checkout-guarantee',
            property: 'html',
            value:
              '<div class="bg-green-50 p-3 rounded border border-green-200"><strong>100% Money-Back Guarantee</strong><br />If you\'re not satisfied, we\'ll refund your purchase.</div>',
            description: 'Money-back guarantee banner',
          },
        ],
      },
      {
        name: 'Combined Trust Signals',
        description: 'Security badges + guarantee + testimonial',
        isControl: false,
        changes: [
          {
            element: 'checkout-trust-section',
            property: 'html',
            value:
              '<div class="space-y-2"><div class="flex items-center gap-2"><img src="/ssl-badge.svg" alt="SSL Secured" /><span class="text-sm text-gray-600">Secure & encrypted</span></div><div class="bg-green-50 p-2 rounded text-sm"><strong>Money-back guarantee</strong></div><div class="text-xs text-gray-500">"Saved me $800 in legal fees!" - Sarah M.</div></div>',
            description: 'Combined trust elements',
          },
        ],
      },
    ],
    targetElements: ['checkout-page', 'payment-form'],
    successMetrics: [
      'checkout_to_signed',
      'time_in_checkout',
      'support_contacts',
    ],
    minimumSampleSize: 1500,
    estimatedDuration: 14,
  },
];

// Pricing & Value Tests
export const PRICING_TESTS: ExperimentTemplate[] = [
  {
    id: 'pricing_display_format',
    name: 'Pricing Display Format',
    category: 'pricing',
    priority: 'medium',
    estimatedImpact: 10,
    implementationEffort: 'low',
    description: 'Test different ways to display document pricing',
    hypothesis:
      'Showing "lawyer comparison" pricing will increase perceived value',
    variants: [
      {
        name: 'Control - Simple Price',
        description: 'Just show the document price',
        isControl: true,
        changes: [
          {
            element: 'document-price',
            property: 'html',
            value: '<span class="text-2xl font-bold">$29.99</span>',
            description: 'Simple price display',
          },
        ],
      },
      {
        name: 'Lawyer Comparison',
        description: 'Show price vs lawyer fees',
        isControl: false,
        changes: [
          {
            element: 'document-price',
            property: 'html',
            value:
              '<div><span class="text-xs text-gray-500 line-through">Lawyer: $500+</span><br/><span class="text-2xl font-bold text-green-600">$29.99</span><br/><span class="text-xs text-green-600">Save $470+</span></div>',
            description: 'Comparison pricing with savings',
          },
        ],
      },
      {
        name: 'Value Bundle',
        description: "Show what's included for the price",
        isControl: false,
        changes: [
          {
            element: 'document-price',
            property: 'html',
            value:
              '<div><span class="text-2xl font-bold">$29.99</span><div class="text-xs text-gray-600 mt-1">✓ Legal document<br/>✓ Step-by-step guide<br/>✓ 30-day support</div></div>',
            description: 'Value-focused pricing with inclusions',
          },
        ],
      },
    ],
    targetElements: ['document-pricing', 'checkout-summary'],
    successMetrics: [
      'pricing_page_conversion',
      'cart_abandonment',
      'avg_order_value',
    ],
    minimumSampleSize: 2000,
    estimatedDuration: 14,
  },
];

// Form Optimization Tests
export const FORM_TESTS: ExperimentTemplate[] = [
  {
    id: 'signup_form_length',
    name: 'Signup Form Field Reduction',
    category: 'form',
    priority: 'high',
    estimatedImpact: 22,
    implementationEffort: 'medium',
    description: 'Test reducing signup form fields to increase completion',
    hypothesis:
      'Requiring only email vs email+name+phone will increase signup conversion',
    variants: [
      {
        name: 'Control - Full Form',
        description: 'Current form with email, name, phone fields',
        isControl: true,
        changes: [
          {
            element: 'signup-form',
            property: 'fields',
            value: 'email,name,phone',
            description: 'Full signup form',
          },
        ],
      },
      {
        name: 'Email Only',
        description: 'Only require email address',
        isControl: false,
        changes: [
          {
            element: 'signup-form',
            property: 'fields',
            value: 'email',
            description: 'Email-only signup',
          },
          {
            element: 'signup-form-note',
            property: 'text',
            value: 'You can add more details later',
            description: 'Reassurance about adding details later',
          },
        ],
      },
    ],
    targetElements: ['signup-form', 'registration-page'],
    successMetrics: [
      'signup_conversion',
      'form_completion_time',
      'form_abandonment',
    ],
    minimumSampleSize: 1500,
    estimatedDuration: 10,
  },
];

// Social Proof Tests
export const SOCIAL_PROOF_TESTS: ExperimentTemplate[] = [
  {
    id: 'homepage_social_proof',
    name: 'Homepage Social Proof Elements',
    category: 'social_proof',
    priority: 'medium',
    estimatedImpact: 12,
    implementationEffort: 'low',
    description: 'Test different social proof elements on homepage',
    hypothesis:
      'Customer count + recent activity will increase trust and engagement',
    variants: [
      {
        name: 'Control - No Social Proof',
        description: 'Homepage without social proof elements',
        isControl: true,
        changes: [],
      },
      {
        name: 'Customer Count',
        description: 'Show total customers served',
        isControl: false,
        changes: [
          {
            element: 'hero-social-proof',
            property: 'html',
            value:
              '<div class="text-center text-sm text-gray-600 mt-4">Join 50,000+ customers who trust 123LegalDoc</div>',
            description: 'Customer count social proof',
          },
        ],
      },
      {
        name: 'Recent Activity',
        description: 'Show recent document creation activity',
        isControl: false,
        changes: [
          {
            element: 'hero-social-proof',
            property: 'html',
            value:
              '<div class="text-center text-sm text-gray-600 mt-4 animate-pulse">🟢 127 documents created in the last hour</div>',
            description: 'Real-time activity indicator',
          },
        ],
      },
      {
        name: 'Combined Social Proof',
        description: 'Customer count + testimonial + activity',
        isControl: false,
        changes: [
          {
            element: 'hero-social-proof',
            property: 'html',
            value:
              '<div class="text-center mt-4"><div class="text-sm text-gray-600">Trusted by 50,000+ customers</div><div class="text-xs text-gray-500 mt-1">"Saved me hours and hundreds of dollars!" - Mike T.</div><div class="text-xs text-green-600 mt-1 animate-pulse">🟢 Live: 127 documents created today</div></div>',
            description: 'Multiple social proof elements',
          },
        ],
      },
    ],
    targetElements: ['homepage', 'hero-section'],
    successMetrics: ['time_on_page', 'homepage_cta_click', 'pages_per_session'],
    minimumSampleSize: 3000,
    estimatedDuration: 14,
  },
];

// Combined experiment templates
export const ALL_EXPERIMENT_TEMPLATES: ExperimentTemplate[] = [
  ...CTA_BUTTON_TESTS,
  ...HEADLINE_TESTS,
  ...TRUST_TESTS,
  ...PRICING_TESTS,
  ...FORM_TESTS,
  ...SOCIAL_PROOF_TESTS,
];

// Function to create experiment from template
export async function createExperimentFromTemplate(
  templateId: string,
  overrides?: {
    targetAudience?: { percentage: number };
    duration?: number;
    owner?: string;
  },
): Promise<string> {
  const template = ALL_EXPERIMENT_TEMPLATES.find((t) => t.id === templateId);
  if (!template) {
    throw new Error(`Template ${templateId} not found`);
  }

  const variants = template.variants.map((variant, index) => ({
    id: `variant_${index}`,
    name: variant.name,
    description: variant.description,
    trafficAllocation: Math.floor(100 / template.variants.length),
    isControl: variant.isControl,
    featureConfig: variant.changes.reduce(
      (config, change) => ({
        ...config,
        [change.element]: change.value,
      }),
      {} as Record<string, any>,
    ),
  }));

  const experiment = await experimentEngine.createExperiment({
    name: template.name,
    description: template.description,
    hypothesis: template.hypothesis,
    targetAudience: {
      percentage: overrides?.targetAudience?.percentage || 50,
    },
    variants,
    primaryMetric: {
      name: template.successMetrics[0],
      type: 'conversion',
      goal: 'increase',
      minimumDetectableEffect: 5,
    },
    secondaryMetrics: template.successMetrics.slice(1).map((metric) => ({
      name: metric,
      type: 'conversion' as const,
      goal: 'increase' as const,
    })),
    startDate: new Date().toISOString(),
    estimatedDuration: overrides?.duration || template.estimatedDuration,
    minSampleSize: template.minimumSampleSize,
    statisticalPower: 0.8,
    significanceLevel: 0.05,
    owner: overrides?.owner || 'product_team',
    team: 'growth',
    tags: [template.category, 'template', template.priority],
  });

  return experiment.id;
}

// Quick setup function for high-priority experiments
export async function setupHighPriorityExperiments(): Promise<string[]> {
  const highPriorityTemplates = ALL_EXPERIMENT_TEMPLATES.filter(
    (t) => t.priority === 'high',
  ).sort((a, b) => b.estimatedImpact - a.estimatedImpact);

  const experimentIds: string[] = [];

  for (const template of highPriorityTemplates.slice(0, 3)) {
    // Start with top 3
    try {
      const experimentId = await createExperimentFromTemplate(template.id);
      experimentIds.push(experimentId);
      console.log(`Created experiment: ${template.name} (${experimentId})`);
    } catch (error) {
      console.error(
        `Failed to create experiment for template ${template.id}:`,
        error,
      );
    }
  }

  return experimentIds;
}

// Experiment recommendation engine
export function getRecommendedExperiments(constraints?: {
  maxEffort?: 'low' | 'medium' | 'high';
  categories?: string[];
  minImpact?: number;
}): ExperimentTemplate[] {
  let filtered = ALL_EXPERIMENT_TEMPLATES;

  if (constraints?.maxEffort) {
    const effortOrder = { low: 1, medium: 2, high: 3 };
    const maxLevel = effortOrder[constraints.maxEffort];
    filtered = filtered.filter(
      (t) => effortOrder[t.implementationEffort] <= maxLevel,
    );
  }

  if (constraints?.categories) {
    filtered = filtered.filter((t) =>
      constraints.categories!.includes(t.category),
    );
  }

  if (constraints?.minImpact) {
    filtered = filtered.filter(
      (t) => t.estimatedImpact >= constraints.minImpact,
    );
  }

  return filtered.sort((a, b) => {
    // Sort by impact/effort ratio
    const aRatio =
      a.estimatedImpact /
      { low: 1, medium: 2, high: 3 }[a.implementationEffort];
    const bRatio =
      b.estimatedImpact /
      { low: 1, medium: 2, high: 3 }[b.implementationEffort];
    return bRatio - aRatio;
  });
}
