// A/B Testing Auth Integration with Firebase Auth System
// Connects experiment tracking with actual user authentication

import { useAuth } from '@/hooks/useAuth';
import { experimentEngine } from './experiment-engine';
import { abTestingIntegration } from './integration';

// Get current user ID from auth context
export function getCurrentUserId(): string | null {
  // This needs to be called from within a React component
  // For server-side usage, we'll need to pass the user ID explicitly
  if (typeof window === 'undefined') {
    return null; // Server-side - must be provided explicitly
  }

  // Try to get from localStorage (auth provider stores user data there)
  try {
    const authData = localStorage.getItem('mockAuth');
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed.user?.uid || null;
    }
  } catch (error) {
    console.error('Error reading auth data for A/B testing:', error);
  }

  return null;
}

// Generate session ID based on user and timestamp
export function generateSessionId(userId?: string): string {
  const uid = userId || getCurrentUserId() || 'anonymous';
  return `sess_${uid}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
}

// Enhanced user context for experiments
export interface ExperimentUserContext {
  userId: string;
  userRole: 'user' | 'premium' | 'admin'; // Simplified role mapping
  isNewUser: boolean;
  registrationDate?: string;
  email?: string;
  location?: {
    country?: string;
    state?: string;
  };
  device?: {
    type: 'mobile' | 'tablet' | 'desktop';
    browser?: string;
    os?: string;
  };
  sessionId: string;
}

// Create user context for A/B testing
export function createExperimentUserContext(
  userId: string,
  userEmail?: string,
  additionalContext?: Partial<ExperimentUserContext>,
): ExperimentUserContext {
  // Determine user role (simplified for now)
  let userRole: 'user' | 'premium' | 'admin' = 'user';
  if (userEmail?.includes('@123legaldoc.com')) {
    userRole = 'admin';
  }

  // Detect device type
  const deviceType = getDeviceType();

  // Determine if new user (registered in last 7 days)
  const isNewUser = isUserNew(userId);

  return {
    userId,
    userRole,
    isNewUser,
    email: userEmail,
    device: {
      type: deviceType,
      browser: getBrowser(),
      os: getOperatingSystem(),
    },
    sessionId: generateSessionId(userId),
    ...additionalContext,
  };
}

// Device detection utilities
function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';

  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

function getBrowser(): string {
  if (typeof window === 'undefined') return 'unknown';

  const userAgent = navigator.userAgent;
  if (userAgent.includes('Chrome')) return 'chrome';
  if (userAgent.includes('Firefox')) return 'firefox';
  if (userAgent.includes('Safari')) return 'safari';
  if (userAgent.includes('Edge')) return 'edge';
  return 'other';
}

function getOperatingSystem(): string {
  if (typeof window === 'undefined') return 'unknown';

  const userAgent = navigator.userAgent;
  if (userAgent.includes('Windows')) return 'windows';
  if (userAgent.includes('Mac')) return 'macos';
  if (userAgent.includes('Linux')) return 'linux';
  if (userAgent.includes('Android')) return 'android';
  if (userAgent.includes('iOS')) return 'ios';
  return 'other';
}

function isUserNew(userId: string): boolean {
  // In a real implementation, this would check the user's registration date
  // For now, we'll use a simple heuristic based on localStorage
  try {
    const authData = localStorage.getItem('mockAuth');
    if (authData) {
      const parsed = JSON.parse(authData);
      // If user was created recently, consider them new
      return (
        Date.now() - new Date(parsed.user?.createdAt || Date.now()).getTime() <
        7 * 24 * 60 * 60 * 1000
      );
    }
  } catch (error) {
    console.error('Error checking if user is new:', error);
  }
  return false;
}

// React Hook for A/B Testing with Auth Integration
export function useExperimentWithAuth(experimentId: string) {
  const { user, isLoggedIn } = useAuth();
  const [state, setState] = React.useState({
    variant: null as string | null,
    isLoading: true,
    error: null as string | null,
  });

  React.useEffect(() => {
    if (!isLoggedIn || !user) {
      setState({
        variant: null,
        isLoading: false,
        error: 'User not authenticated',
      });
      return;
    }

    try {
      const userContext = createExperimentUserContext(
        user.uid,
        user.email || undefined,
      );
      const assignedVariant = experimentEngine.assignUserToExperiment(
        experimentId,
        user.uid,
      );

      setState({
        variant: assignedVariant,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error assigning user to experiment:', error);
      setState({
        variant: null,
        isLoading: false,
        error: 'Failed to assign experiment variant',
      });
    }
  }, [experimentId, user, isLoggedIn]);

  const trackConversion = React.useCallback(
    (metric: string = 'conversion', value: number = 1) => {
      if (user?.uid) {
        experimentEngine.trackConversion(experimentId, user.uid, metric, value);
      }
    },
    [experimentId, user],
  );

  const trackRevenue = React.useCallback(
    (amount: number, metric: string = 'revenue') => {
      if (user?.uid) {
        experimentEngine.trackRevenue(experimentId, user.uid, amount, metric);
      }
    },
    [experimentId, user],
  );

  return {
    variant: state.variant,
    isLoading: state.isLoading,
    error: state.error,
    isAuthenticated: isLoggedIn,
    trackConversion,
    trackRevenue,
    userContext: user
      ? createExperimentUserContext(user.uid, user.email || undefined)
      : null,
  };
}

// Hook for Feature Flags with A/B Testing
export function useFeatureFlagWithExperiments(featureKey: string) {
  const { user, isLoggedIn } = useAuth();
  const [state, setState] = React.useState({
    isEnabled: false,
    variant: null as string | null,
    experiment: null as string | null,
    isLoading: true,
  });

  React.useEffect(() => {
    if (!isLoggedIn || !user) {
      setState({
        isEnabled: false,
        variant: null,
        experiment: null,
        isLoading: false,
      });
      return;
    }

    try {
      const userContext = createExperimentUserContext(
        user.uid,
        user.email || undefined,
      );

      // Check if feature is enabled through A/B testing
      const isEnabled = abTestingIntegration.isFeatureEnabledWithExperiments(
        featureKey,
        {
          userId: user.uid,
          userRole: 'user', // Map from your user role system
          environment:
            process.env.NODE_ENV === 'development'
              ? 'development'
              : 'production',
        },
      );

      // Get experiment assignment if any
      const userExperiments = experimentEngine.getExperimentForUser(user.uid);
      let experimentId = null;
      let variantId = null;

      for (const [expId, variant] of Object.entries(userExperiments)) {
        const experiment = experimentEngine.getExperiment(expId);
        if (experiment?.featureFlag === featureKey) {
          experimentId = expId;
          variantId = variant;
          break;
        }
      }

      setState({
        isEnabled,
        variant: variantId,
        experiment: experimentId,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error checking feature flag with experiments:', error);
      setState({
        isEnabled: false,
        variant: null,
        experiment: null,
        isLoading: false,
      });
    }
  }, [featureKey, user, isLoggedIn]);

  const trackConversion = React.useCallback(
    (metric: string = 'feature_usage', value: number = 1) => {
      if (user?.uid && state.experiment) {
        experimentEngine.trackConversion(
          state.experiment,
          user.uid,
          metric,
          value,
        );
      }
    },
    [state.experiment, user],
  );

  return {
    isEnabled: state.isEnabled,
    variant: state.variant,
    experiment: state.experiment,
    isLoading: state.isLoading,
    isAuthenticated: isLoggedIn,
    trackConversion,
  };
}

// Funnel tracking with authentication
export function useFunnelTrackingWithAuth() {
  const { user, isLoggedIn } = useAuth();

  const trackStep = React.useCallback(
    (
      step: 'visit' | 'draft' | 'checkout' | 'signed',
      metadata?: Record<string, any>,
    ) => {
      if (!user?.uid) return;

      const userContext = createExperimentUserContext(
        user.uid,
        user.email || undefined,
      );

      abTestingIntegration.trackFunnelStepWithExperiments(
        {
          step,
          stepOrder: { visit: 1, draft: 2, checkout: 3, signed: 4 }[step],
          timestamp: new Date().toISOString(),
          sessionId: userContext.sessionId,
          userId: user.uid,
          deviceId: `dev_${user.uid}_${Date.now()}`,
          metadata: {
            ...metadata,
            userRole: userContext.userRole,
            isNewUser: userContext.isNewUser,
            device: userContext.device,
          },
        },
        user.uid,
      );
    },
    [user],
  );

  const trackRevenue = React.useCallback(
    (amount: number, orderId: string, metadata?: Record<string, any>) => {
      if (!user?.uid) return;

      abTestingIntegration.trackRevenueForExperiments(
        user.uid,
        amount,
        orderId,
        {
          ...metadata,
          timestamp: new Date().toISOString(),
        },
      );
    },
    [user],
  );

  return {
    trackStep,
    trackRevenue,
    isAuthenticated: isLoggedIn,
    user: user
      ? createExperimentUserContext(user.uid, user.email || undefined)
      : null,
  };
}

// Export utility functions
export { getCurrentUserId, generateSessionId, createExperimentUserContext };

import React from 'react';
