// A/B Testing & Experimentation System for 123LegalDoc
// Complete experimentation platform with statistical analysis and Firestore integration

export {
  experimentEngine,
  useExperiment,
  type Experiment,
  type ExperimentVariant,
  type ExperimentResults,
  type ExperimentEvent,
  type MetricResults,
} from './experiment-engine';

export {
  abTestingIntegration,
  useExperimentAwareFeature,
  useFunnelTrackingWithExperiments,
  useExperimentRecommendations,
  type ExperimentAwareFeatureContext,
  type ExperimentAwareFunnelSession,
} from './integration';

export {
  useExperimentWithAuth,
  useFeatureFlagWithExperiments,
  useFunnelTrackingWithAuth,
  getCurrentUserId,
  generateSessionId,
  createExperimentUserContext,
  type ExperimentUserContext,
} from './auth-integration';

export { ExperimentDashboard } from '@/components/admin/ExperimentDashboard';

// Quick Start Guide for Implementation:

/*
1. BASIC A/B TEST SETUP:

import { experimentEngine } from '@/lib/ab-testing';

// Create experiment
const experiment = await experimentEngine.createExperiment({
  name: 'Checkout Button Color Test',
  hypothesis: 'Green checkout button will increase conversions vs blue',
  targetAudience: { percentage: 50 },
  variants: [
    {
      id: 'control',
      name: 'Blue Button',
      trafficAllocation: 50,
      isControl: true,
      featureConfig: { checkoutButtonColor: 'blue' }
    },
    {
      id: 'treatment',
      name: 'Green Button', 
      trafficAllocation: 50,
      isControl: false,
      featureConfig: { checkoutButtonColor: 'green' }
    }
  ],
  primaryMetric: {
    name: 'checkout_conversion',
    type: 'conversion',
    goal: 'increase',
    minimumDetectableEffect: 5
  },
  estimatedDuration: 14,
  minSampleSize: 1000,
  owner: 'product_team'
});

// Start experiment
await experimentEngine.startExperiment(experiment.id);

2. USING IN REACT COMPONENTS:

import { useExperiment } from '@/lib/ab-testing';

function CheckoutButton() {
  const { variant, trackConversion } = useExperiment('checkout_button_test');
  
  const buttonColor = variant === 'treatment' ? 'green' : 'blue';
  
  const handleClick = () => {
    trackConversion('button_click');
    // ... checkout logic
  };
  
  return (
    <button 
      className={`bg-${buttonColor}-600`}
      onClick={handleClick}
    >
      Complete Purchase
    </button>
  );
}

3. FEATURE FLAG INTEGRATION:

import { useExperimentAwareFeature } from '@/lib/ab-testing';

function DocumentWizard() {
  const { isEnabled, variant, trackConversion } = useExperimentAwareFeature(
    'wizard_v4',
    { userId: user.id, userRole: user.role }
  );
  
  if (isEnabled && variant === 'new_wizard') {
    return <NewWizardV4 onComplete={() => trackConversion('wizard_completion')} />;
  }
  
  return <ClassicWizard />;
}

4. FUNNEL TRACKING WITH EXPERIMENTS:

import { useFunnelTrackingWithExperiments } from '@/lib/ab-testing';

function DocumentFlow() {
  const { trackStep, trackRevenue } = useFunnelTrackingWithExperiments();
  
  useEffect(() => {
    trackStep('visit', sessionId, userId, { documentType: 'bill_of_sale' });
  }, []);
  
  const handleDraftStart = () => {
    trackStep('draft', sessionId, userId);
  };
  
  const handlePurchase = (amount: number, orderId: string) => {
    trackStep('signed', sessionId, userId);
    trackRevenue(userId, amount, orderId);
  };
}

5. REVENUE TRACKING:

import { experimentEngine } from '@/lib/ab-testing';

// Track revenue for experiments
experimentEngine.trackRevenue(experimentId, userId, 29.99, 'purchase');

6. ADMIN DASHBOARD:

import { ExperimentDashboard } from '@/lib/ab-testing';

function AdminExperimentsPage() {
  return (
    <div className="p-6">
      <h1>A/B Test Management</h1>
      <ExperimentDashboard />
    </div>
  );
}

STATISTICAL FEATURES:
- Bayesian analysis with credible intervals
- Frequentist significance testing  
- Automatic winner detection (95% confidence)
- Revenue impact estimation
- Sample size calculations
- Multi-armed bandit support (future)

INTEGRATION FEATURES:
- Works with existing feature toggles
- Automatic funnel analytics integration
- Firestore data persistence (production)
- BigQuery streaming for large scale
- Real-time results updating
- Experiment recommendations based on performance data

BEST PRACTICES:
1. Always define clear hypothesis before starting
2. Set appropriate minimum detectable effect (5-10%)
3. Ensure sufficient sample size (1000+ per variant)
4. Run experiments for full business cycles (7-14 days minimum)
5. Monitor both primary and secondary metrics
6. Document results and learnings for future experiments
*/
