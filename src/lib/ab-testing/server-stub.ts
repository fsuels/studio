// Server-side stub for the A/B testing system.
// Provides no-op implementations so that SSR and Cloud Functions avoid
// importing the heavy Firestore-backed experimentation stack.

export type Experiment = Record<string, never>;
export type ExperimentVariant = Record<string, never>;
export type ExperimentResults = Record<string, never>;
export type ExperimentEvent = Record<string, never>;
export type MetricResults = Record<string, never>;

export const experimentEngine = {
  async createExperiment() {
    throw new Error('A/B testing is not available in this environment.');
  },
  async startExperiment() {
    return;
  },
  async pauseExperiment() {
    return;
  },
  async assignUserToExperiment() {
    return null as string | null;
  },
  getExperimentForUser() {
    return {} as Record<string, string>;
  },
  async getRunningExperiments() {
    return [] as Experiment[];
  },
  trackEvent() {
    return;
  },
  trackRevenue() {
    return;
  },
};

export function useExperiment() {
  return {
    variant: 'control' as string | null,
    experimentId: null as string | null,
    trackConversion: () => {},
    trackExposure: () => {},
  };
}

export interface ExperimentAwareFeatureContext {
  userId?: string;
  userRole?: string;
}

export interface ExperimentAwareFunnelSession {
  experiments: Record<string, never>;
}

export const abTestingIntegration = {
  isFeatureEnabledWithExperiments() {
    return false;
  },
  trackFunnelStepWithExperiments() {
    return;
  },
  trackRevenueForExperiments() {
    return;
  },
  generateExperimentRecommendations() {
    return [] as Array<Record<string, unknown>>;
  },
};

export function useExperimentAwareFeature() {
  return {
    isEnabled: false,
    variant: null as string | null,
    experimentId: null as string | null,
    trackConversion: () => {},
  };
}

export function useFunnelTrackingWithExperiments() {
  return {
    trackStep: () => {},
    trackRevenue: () => {},
  };
}

export function useExperimentRecommendations() {
  return {
    recommendations: [] as Array<Record<string, unknown>>,
    refreshRecommendations: () => {},
  };
}

export function useExperimentWithAuth() {
  return {
    variant: 'control' as string | null,
    trackConversion: () => {},
  };
}

export function useFeatureFlagWithExperiments(featureKey: string) {
  return {
    isEnabled: false,
    variant: null as string | null,
    experimentId: null as string | null,
    trackConversion: () => {},
    featureKey,
  };
}

export function useFunnelTrackingWithAuth() {
  return {
    trackStep: () => {},
    trackRevenue: () => {},
  };
}

export function getCurrentUserId() {
  return null as string | null;
}

export function generateSessionId() {
  return 'ab-test-session-stub';
}

export function createExperimentUserContext() {
  return {
    experiments: {},
  } as ExperimentAwareFeatureContext;
}

export const ExperimentDashboard = () => null;
