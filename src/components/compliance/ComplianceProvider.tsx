// Context provider for compliance state management
'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

export interface ComplianceState {
  allowed: boolean;
  riskLevel: 'green' | 'amber' | 'red';
  disclaimerLevel: 'basic' | 'enhanced' | 'strict';
  reason: string;
  requirements: string[];
  recommendations?: string[];
  waitlistEligible: boolean;
  location: {
    state: string;
    stateCode: string;
    country: string;
    confidence: string;
  };
  loading: boolean;
  error: string | null;
}

interface ComplianceContextType {
  compliance: ComplianceState | null;
  checkCompliance: (options?: { mockState?: string }) => Promise<void>;
  isCompliant: boolean;
  isBlocked: boolean;
  isLoading: boolean;
}

const ComplianceContext = createContext<ComplianceContextType | undefined>(
  undefined,
);

interface ComplianceProviderProps {
  children: ReactNode;
  autoCheck?: boolean;
  mockState?: string;
}

export function ComplianceProvider({
  children,
  autoCheck = true,
  mockState,
}: ComplianceProviderProps) {
  const [compliance, setCompliance] = useState<ComplianceState | null>(null);
  const [loading, setLoading] = useState(autoCheck);
  const [error, setError] = useState<string | null>(null);

  const checkCompliance = async (options?: { mockState?: string }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/compliance/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: crypto.randomUUID(),
          mockState: options?.mockState || mockState,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Compliance check failed');
      }

      setCompliance({
        ...data.compliance,
        loading: false,
        error: null,
      });
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);

      // Set fallback blocked state for safety
      setCompliance({
        allowed: false,
        riskLevel: 'red',
        disclaimerLevel: 'strict',
        reason: 'Unable to verify compliance - access temporarily restricted',
        requirements: ['Contact support for assistance'],
        recommendations: ['Try refreshing the page'],
        waitlistEligible: true,
        location: {
          state: 'Unknown',
          stateCode: 'UNK',
          country: 'Unknown',
          confidence: 'low',
        },
        loading: false,
        error: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoCheck) {
      checkCompliance();
    }
  }, [autoCheck, mockState]);

  const value: ComplianceContextType = {
    compliance,
    checkCompliance,
    isCompliant: compliance?.allowed || false,
    isBlocked: compliance ? !compliance.allowed : false,
    isLoading: loading,
  };

  return (
    <ComplianceContext.Provider value={value}>
      {children}
    </ComplianceContext.Provider>
  );
}

export function useCompliance() {
  const context = useContext(ComplianceContext);
  if (context === undefined) {
    throw new Error('useCompliance must be used within a ComplianceProvider');
  }
  return context;
}

// Higher-order component for protecting routes
export function withCompliance<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    redirectTo?: string;
    showWaitlist?: boolean;
    mockState?: string;
  },
) {
  return function ComplianceProtectedComponent(props: P) {
    const { compliance, isLoading, isBlocked } = useCompliance();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
            <p className="text-sm text-muted-foreground">
              Checking compliance...
            </p>
          </div>
        </div>
      );
    }

    if (isBlocked) {
      if (options?.redirectTo) {
        window.location.href = options.redirectTo;
        return null;
      }

      if (options?.showWaitlist && compliance) {
        const WaitlistForm = React.lazy(() => import('./WaitlistForm'));
        return (
          <React.Suspense fallback={<div>Loading...</div>}>
            <WaitlistForm
              stateCode={compliance.location.stateCode}
              stateName={compliance.location.state}
              riskLevel={compliance.riskLevel as 'red' | 'amber'}
              reason={compliance.reason}
            />
          </React.Suspense>
        );
      }

      return (
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold mb-2">Service Not Available</h2>
          <p className="text-muted-foreground">
            {compliance?.reason ||
              'This service is not available in your location.'}
          </p>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

// Hook for getting disclaimer props
export function useDisclaimerProps() {
  const { compliance } = useCompliance();

  if (!compliance) {
    return null;
  }

  return {
    stateCode: compliance.location.stateCode,
    stateName: compliance.location.state,
    riskLevel: compliance.riskLevel,
    disclaimerLevel: compliance.disclaimerLevel,
    requirements: compliance.requirements,
  };
}
