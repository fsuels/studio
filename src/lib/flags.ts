'use client';

import { db } from '@/lib/firebase';
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState, ComponentType } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutStrategy: {
    type: 'all' | 'percentage' | 'roles' | 'users' | 'environments';
    percentage?: number;
    roles?: string[];
    userIds?: string[];
    environments?: ('development' | 'staging' | 'production')[];
  };
  conditions?: {
    startDate?: string;
    endDate?: string;
    dependencies?: string[];
  };
  metadata: {
    owner: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    version: number;
  };
}

export interface FeatureFlagsDocument {
  flags: Record<string, FeatureFlag>;
  lastUpdated: string;
  version: number;
}

interface FeatureFlagsContextType {
  flags: Record<string, FeatureFlag>;
  isLoading: boolean;
  isFeatureEnabled: (flagKey: string) => boolean;
  getAllFlags: () => FeatureFlag[];
  updateFlag: (flagKey: string, updates: Partial<FeatureFlag>) => Promise<void>;
  createFlag: (flag: Omit<FeatureFlag, 'metadata'>) => Promise<void>;
  deleteFlag: (flagKey: string) => Promise<void>;
}

const FeatureFlagsContext = createContext<FeatureFlagsContextType | null>(null);

export function FeatureFlagsProvider({ children }: { children: React.ReactNode }) {
  const [flags, setFlags] = useState<Record<string, FeatureFlag>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthContext();

  useEffect(() => {
    const flagsDocRef = doc(db, 'feature_flags', 'main');

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      flagsDocRef,
      (doc) => {
        if (doc.exists()) {
          const data = doc.data() as FeatureFlagsDocument;
          setFlags(data.flags || {});
        } else {
          // Initialize with default flags if document doesn't exist
          initializeDefaultFlags();
        }
        setIsLoading(false);
      },
      (error) => {
        console.error('Error listening to feature flags:', error);
        // Fallback to default flags on error
        initializeDefaultFlags();
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const initializeDefaultFlags = async () => {
    const defaultFlags: Record<string, FeatureFlag> = {
      newOrderTable: {
        id: 'newOrderTable',
        name: 'New Order Table',
        description: 'Enhanced order management table with improved UX',
        enabled: true,
        rolloutStrategy: {
          type: 'percentage',
          percentage: 50,
        },
        metadata: {
          owner: 'Product Team',
          tags: ['ui', 'orders', 'enhancement'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 1,
        },
      },
      advancedAnalytics: {
        id: 'advancedAnalytics',
        name: 'Advanced Analytics Dashboard',
        description: 'Enhanced analytics with real-time metrics',
        enabled: true,
        rolloutStrategy: {
          type: 'roles',
          roles: ['admin', 'super_admin'],
        },
        metadata: {
          owner: 'Analytics Team',
          tags: ['analytics', 'dashboard', 'admin'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 1,
        },
      },
      aiDocumentSuggestions: {
        id: 'aiDocumentSuggestions',
        name: 'AI Document Suggestions',
        description: 'AI-powered document recommendations and improvements',
        enabled: true,
        rolloutStrategy: {
          type: 'percentage',
          percentage: 25,
        },
        metadata: {
          owner: 'AI Team',
          tags: ['ai', 'suggestions', 'documents'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 1,
        },
      },
      bulkDocumentProcessing: {
        id: 'bulkDocumentProcessing',
        name: 'Bulk Document Processing',
        description: 'Process multiple documents in batch operations',
        enabled: false,
        rolloutStrategy: {
          type: 'roles',
          roles: ['admin', 'super_admin'],
        },
        metadata: {
          owner: 'Engineering Team',
          tags: ['bulk', 'processing', 'documents'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 1,
        },
      },
      enhancedSearch: {
        id: 'enhancedSearch',
        name: 'Enhanced Search Experience',
        description: 'Improved search with filters and AI-powered results',
        enabled: true,
        rolloutStrategy: {
          type: 'percentage',
          percentage: 75,
        },
        metadata: {
          owner: 'UX Team',
          tags: ['search', 'ux', 'ai'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 1,
        },
      },
      realTimeCollaboration: {
        id: 'realTimeCollaboration',
        name: 'Real-time Document Collaboration',
        description: 'Live editing and collaboration on documents',
        enabled: false,
        rolloutStrategy: {
          type: 'environments',
          environments: ['development', 'staging'],
        },
        metadata: {
          owner: 'Collaboration Team',
          tags: ['collaboration', 'realtime', 'documents'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 1,
        },
      },
    };

    try {
      const flagsDoc: FeatureFlagsDocument = {
        flags: defaultFlags,
        lastUpdated: new Date().toISOString(),
        version: 1,
      };

      await setDoc(doc(db, 'feature_flags', 'main'), flagsDoc);
      setFlags(defaultFlags);
      console.log('🚩 Feature flags initialized with defaults');
    } catch (error) {
      console.error('Failed to initialize feature flags:', error);
      setFlags(defaultFlags);
    }
  };

  const isFeatureEnabled = (flagKey: string): boolean => {
    const flag = flags[flagKey];
    if (!flag) {
      console.warn(`Feature flag "${flagKey}" not found`);
      return false;
    }

    if (!flag.enabled) {
      return false;
    }

    // Check date conditions
    const now = new Date();
    if (flag.conditions?.startDate && new Date(flag.conditions.startDate) > now) {
      return false;
    }
    if (flag.conditions?.endDate && new Date(flag.conditions.endDate) < now) {
      return false;
    }

    // Check rollout strategy
    const strategy = flag.rolloutStrategy;
    const environment = process.env.NODE_ENV as 'development' | 'staging' | 'production';

    switch (strategy.type) {
      case 'all':
        return true;

      case 'percentage':
        if (!user?.uid) return false;
        const hash = hashString(user.uid + flagKey);
        const threshold = (strategy.percentage || 0) / 100;
        return hash < threshold;

      case 'roles':
        // In a real app, you'd get user role from auth context
        const userRole = getUserRole(user);
        return strategy.roles?.includes(userRole) || false;

      case 'users':
        return strategy.userIds?.includes(user?.uid || '') || false;

      case 'environments':
        return strategy.environments?.includes(environment) || false;

      default:
        return false;
    }
  };

  const getAllFlags = (): FeatureFlag[] => {
    return Object.values(flags);
  };

  const updateFlag = async (flagKey: string, updates: Partial<FeatureFlag>): Promise<void> => {
    try {
      const flagsDocRef = doc(db, 'feature_flags', 'main');
      const currentFlag = flags[flagKey];
      
      if (!currentFlag) {
        throw new Error(`Feature flag "${flagKey}" not found`);
      }

      const updatedFlag: FeatureFlag = {
        ...currentFlag,
        ...updates,
        metadata: {
          ...currentFlag.metadata,
          ...updates.metadata,
          updatedAt: new Date().toISOString(),
          version: currentFlag.metadata.version + 1,
        },
      };

      const updatedFlags = { ...flags, [flagKey]: updatedFlag };
      const updatedDoc: FeatureFlagsDocument = {
        flags: updatedFlags,
        lastUpdated: new Date().toISOString(),
        version: (await getDoc(flagsDocRef)).data()?.version + 1 || 1,
      };

      await updateDoc(flagsDocRef, updatedDoc);
      console.log(`🚩 Feature flag "${flagKey}" updated`);
    } catch (error) {
      console.error(`Failed to update feature flag "${flagKey}":`, error);
      throw error;
    }
  };

  const createFlag = async (flag: Omit<FeatureFlag, 'metadata'>): Promise<void> => {
    try {
      const flagsDocRef = doc(db, 'feature_flags', 'main');
      
      const newFlag: FeatureFlag = {
        ...flag,
        metadata: {
          owner: flag.name,
          tags: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 1,
        },
      };

      const updatedFlags = { ...flags, [flag.id]: newFlag };
      const updatedDoc: FeatureFlagsDocument = {
        flags: updatedFlags,
        lastUpdated: new Date().toISOString(),
        version: (await getDoc(flagsDocRef)).data()?.version + 1 || 1,
      };

      await updateDoc(flagsDocRef, updatedDoc);
      console.log(`🚩 Feature flag "${flag.id}" created`);
    } catch (error) {
      console.error(`Failed to create feature flag "${flag.id}":`, error);
      throw error;
    }
  };

  const deleteFlag = async (flagKey: string): Promise<void> => {
    try {
      const flagsDocRef = doc(db, 'feature_flags', 'main');
      const updatedFlags = { ...flags };
      delete updatedFlags[flagKey];

      const updatedDoc: FeatureFlagsDocument = {
        flags: updatedFlags,
        lastUpdated: new Date().toISOString(),
        version: (await getDoc(flagsDocRef)).data()?.version + 1 || 1,
      };

      await updateDoc(flagsDocRef, updatedDoc);
      console.log(`🚩 Feature flag "${flagKey}" deleted`);
    } catch (error) {
      console.error(`Failed to delete feature flag "${flagKey}":`, error);
      throw error;
    }
  };

  const contextValue: FeatureFlagsContextType = {
    flags,
    isLoading,
    isFeatureEnabled,
    getAllFlags,
    updateFlag,
    createFlag,
    deleteFlag,
  };

  return (
    <FeatureFlagsContext.Provider value={contextValue}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

// Hash function for consistent percentage rollouts
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash) / Math.pow(2, 31);
}

// Get user role (integrate with your auth system)
function getUserRole(user: any): string {
  // This should integrate with your actual user role system
  return user?.customClaims?.role || user?.role || 'user';
}

// Hook to use feature flags
export function useFeatureFlags(): FeatureFlagsContextType {
  const context = useContext(FeatureFlagsContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagsProvider');
  }
  return context;
}

// Hook to check if a specific feature is enabled
export function useFeatureFlag(flagKey: string): boolean {
  const { isFeatureEnabled } = useFeatureFlags();
  return isFeatureEnabled(flagKey);
}

// Higher-Order Component for feature flagging
export function withFlag<P extends object>(
  flagKey: string,
  FallbackComponent?: ComponentType<P>
) {
  return function WithFlagWrapper(WrappedComponent: ComponentType<P>) {
    const ComponentWithFlag = (props: P) => {
      const isEnabled = useFeatureFlag(flagKey);
      
      if (!isEnabled) {
        return FallbackComponent ? <FallbackComponent {...props} /> : null;
      }
      
      return <WrappedComponent {...props} />;
    };

    ComponentWithFlag.displayName = `withFlag(${WrappedComponent.displayName || WrappedComponent.name})`;
    return ComponentWithFlag;
  };
}

// Component wrapper for conditional rendering
export function FeatureFlag({ 
  flag, 
  children, 
  fallback = null 
}: {
  flag: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const isEnabled = useFeatureFlag(flag);
  return isEnabled ? <>{children}</> : <>{fallback}</>;
}

// Admin utilities for managing flags
export const FlagAdmin = {
  // Enable/disable flag
  toggle: async (flagKey: string, enabled: boolean): Promise<void> => {
    const flagsDocRef = doc(db, 'feature_flags', 'main');
    const docSnap = await getDoc(flagsDocRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as FeatureFlagsDocument;
      const currentFlag = data.flags[flagKey];
      
      if (currentFlag) {
        const updatedFlag: FeatureFlag = {
          ...currentFlag,
          enabled,
          metadata: {
            ...currentFlag.metadata,
            updatedAt: new Date().toISOString(),
            version: currentFlag.metadata.version + 1,
          },
        };

        const updatedFlags = { ...data.flags, [flagKey]: updatedFlag };
        const updatedDoc: FeatureFlagsDocument = {
          flags: updatedFlags,
          lastUpdated: new Date().toISOString(),
          version: data.version + 1,
        };

        await updateDoc(flagsDocRef, updatedDoc);
      }
    }
  },

  // Update rollout percentage
  setPercentage: async (flagKey: string, percentage: number): Promise<void> => {
    const flagsDocRef = doc(db, 'feature_flags', 'main');
    const docSnap = await getDoc(flagsDocRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as FeatureFlagsDocument;
      const currentFlag = data.flags[flagKey];
      
      if (currentFlag && currentFlag.rolloutStrategy.type === 'percentage') {
        const updatedFlag: FeatureFlag = {
          ...currentFlag,
          rolloutStrategy: {
            ...currentFlag.rolloutStrategy,
            percentage: Math.max(0, Math.min(100, percentage)),
          },
          metadata: {
            ...currentFlag.metadata,
            updatedAt: new Date().toISOString(),
            version: currentFlag.metadata.version + 1,
          },
        };

        const updatedFlags = { ...data.flags, [flagKey]: updatedFlag };
        const updatedDoc: FeatureFlagsDocument = {
          flags: updatedFlags,
          lastUpdated: new Date().toISOString(),
          version: data.version + 1,
        };

        await updateDoc(flagsDocRef, updatedDoc);
      }
    }
  },

  // Get all flags for admin dashboard
  getAllFlags: async (): Promise<FeatureFlag[]> => {
    const flagsDocRef = doc(db, 'feature_flags', 'main');
    const docSnap = await getDoc(flagsDocRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as FeatureFlagsDocument;
      return Object.values(data.flags);
    }
    
    return [];
  },
};

// Development utilities
export const DevFlags = {
  // Override flag for testing
  override: (flagKey: string, enabled: boolean): void => {
    if (process.env.NODE_ENV === 'development') {
      localStorage.setItem(`flag_override_${flagKey}`, enabled.toString());
      console.log(`🚩 DEV: Feature flag "${flagKey}" overridden to ${enabled}`);
    }
  },

  // Clear all overrides
  clearOverrides: (): void => {
    if (process.env.NODE_ENV === 'development') {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('flag_override_')) {
          localStorage.removeItem(key);
        }
      });
      console.log('🚩 DEV: All feature flag overrides cleared');
    }
  },

  // Check if flag is overridden
  isOverridden: (flagKey: string): boolean => {
    if (process.env.NODE_ENV === 'development') {
      return localStorage.getItem(`flag_override_${flagKey}`) !== null;
    }
    return false;
  },
};