'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface PreloadConfig {
  /** Routes to preload when component mounts */
  immediatePreload?: string[];
  /** Routes to preload on user interaction (hover, focus) */
  onInteraction?: string[];
  /** Components to preload based on current route */
  routeBasedPreload?: Record<string, string[]>;
  /** Enable intelligent preloading based on user behavior */
  intelligentPreload?: boolean;
}

interface PreloadedComponent {
  component: React.ComponentType<unknown>;
  path: string;
  preloadedAt: number;
}

// Global preload cache to avoid duplicate loading
const preloadCache = new Map<string, Promise<unknown>>();
const componentCache = new Map<string, PreloadedComponent>();

// Common form workflow paths for intelligent preloading
const FORM_WORKFLOW_PATHS = {
  '/docs/[docId]/start': [
    // After start, users typically go to customize or complete
    '/docs/[docId]/customize',
    '/docs/[docId]/complete',
  ],
  '/docs/[docId]/customize': [
    // After customize, users go to review or complete
    '/docs/[docId]/review', 
    '/docs/[docId]/complete',
  ],
  '/docs/[docId]/review': [
    // After review, users complete or go back to customize
    '/docs/[docId]/complete',
    '/docs/[docId]/customize',
  ],
  '/checkout': [
    // During checkout, preload success and payment components
    '/checkout/success',
    '/dashboard', // Common post-purchase destination
  ],
  '/dashboard': [
    // From dashboard, users often generate new docs or view existing
    '/generate',
    '/docs/[docId]/view',
  ],
  '/generate': [
    // From generate, users typically start document creation
    '/docs/[docId]/start',
  ],
};

// Heavy components that benefit from preloading
const HEAVY_COMPONENTS = {
  'FraudDetectionDashboard': () => import('@/components/admin/fraud-detection/FraudDetectionDashboard'),
  'RevenueIntelligenceDashboard': () => import('@/components/admin/revenue-intelligence/RevenueIntelligenceDashboard'),
  'DocumentCollaboration': () => import('@/components/collaboration/DocumentCollaboration'),
  'AIDocumentAnalyzer': () => import('@/components/ai/AIDocumentAnalyzer'),
  'SignWellIntegration': () => import('@/components/signwell/SignWellIntegration'),
  'PdfGenerator': () => import('@/services/pdf-generator'),
  'PaymentProcessor': () => import('@/lib/stripe-integration'),
};

export function usePreloadStrategy(config: PreloadConfig = {}) {
  const router = useRouter();
  const preloadStarted = useRef(new Set<string>());
  const interactionListeners = useRef(new Map<string, () => void>());

  // Preload a component or route
  const preload = useCallback(async (path: string) => {
    if (preloadStarted.current.has(path) || preloadCache.has(path)) {
      return preloadCache.get(path);
    }

    preloadStarted.current.add(path);

    const preloadPromise = new Promise<unknown>((resolve, reject) => {
      (async () => {
        try {
          // Check if it's a heavy component
          const componentName = Object.keys(HEAVY_COMPONENTS).find(
            (name) => path.includes(name.toLowerCase()) || path.endsWith(name),
          );

          if (componentName) {
            const component =
              await HEAVY_COMPONENTS[
                componentName as keyof typeof HEAVY_COMPONENTS
              ]();
            componentCache.set(path, {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              component: (component as any).default || component,
              path,
              preloadedAt: Date.now(),
            });
            resolve(component);
          } else {
            // Preload route using Next.js router
            router.prefetch(path);

            // Also try to preload any lazy components on that route
            if (path.includes('/admin/')) {
              // Preload admin components
              await Promise.all([
                import('@/components/admin/fraud-detection/FraudDetectionDashboard'),
                import('@/components/admin/revenue-intelligence/RevenueIntelligenceDashboard'),
              ]);
            } else if (path.includes('/docs/')) {
              // Preload document-related components
              await Promise.all([
                import('@/components/forms/WizardForm'),
                import('@/components/collaboration/DocumentCollaboration'),
                import('@/services/pdf-generator'),
              ]);
            } else if (path.includes('/signwell')) {
              // Preload SignWell components
              await import('@/components/signwell/SignWellIntegration');
            }

            resolve(null);
          }
        } catch (error) {
          console.warn(`Failed to preload ${path}:`, error);
          reject(error);
        }
      })();
    });

    preloadCache.set(path, preloadPromise);
    return preloadPromise;
  }, [router]);

  // Preload routes based on current location and user patterns
  const intelligentPreload = useCallback(async (currentPath: string) => {
    const matchingPaths = Object.keys(FORM_WORKFLOW_PATHS).find(pattern =>
      currentPath.includes(pattern.replace('[docId]', '')) ||
      new RegExp(pattern.replace('[docId]', '[^/]+')).test(currentPath)
    );

    if (matchingPaths) {
      const nextPaths = FORM_WORKFLOW_PATHS[matchingPaths as keyof typeof FORM_WORKFLOW_PATHS];
      for (const nextPath of nextPaths) {
        await preload(nextPath.replace('[docId]', 'preview')); // Use preview as placeholder
      }
    }

    // Preload based on time of day / user behavior patterns
    const hour = new Date().getHours();
    if (hour >= 9 && hour <= 17) {
      // Business hours - preload business document components
      await preload('BusinessDocuments');
    } else {
      // Evening - preload personal document components  
      await preload('PersonalDocuments');
    }
  }, [preload]);

  // Setup interaction-based preloading
  const setupInteractionPreloading = useCallback(() => {
    if (!config.onInteraction?.length) return;

    config.onInteraction.forEach((path) => {
      const elements = document.querySelectorAll(
        `a[href*="${path}"], button[data-preload="${path}"]`,
      );
      elements.forEach((element) => {
        const listener = () => preload(path);
        
        // Clean up previous listener if exists
        const existingListener = interactionListeners.current.get(path);
        if (existingListener) {
          element.removeEventListener('mouseenter', existingListener);
          element.removeEventListener('focus', existingListener);
        }

        // Add new listeners
        element.addEventListener('mouseenter', listener, { passive: true });
        element.addEventListener('focus', listener, { passive: true });
        
        interactionListeners.current.set(path, listener);
      });
    });
  }, [config.onInteraction, preload]);

  // Initialize preloading on mount
  useEffect(() => {
    // Immediate preloading
    if (config.immediatePreload?.length) {
      config.immediatePreload.forEach(path => {
        preload(path);
      });
    }

    // Setup interaction preloading
    setupInteractionPreloading();

    // Intelligent preloading based on current route
    if (config.intelligentPreload && typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      intelligentPreload(currentPath);
      
      // Route-based preloading
      if (config.routeBasedPreload?.[currentPath]) {
        config.routeBasedPreload[currentPath].forEach(preload);
      }
    }

    // Cleanup function
    const snapshot = new Map(interactionListeners.current);
    return () => {
      snapshot.forEach((listener, path) => {
        const elements = document.querySelectorAll(
          `a[href*="${path}"], button[data-preload="${path}"]`,
        );
        elements.forEach((element) => {
          element.removeEventListener('mouseenter', listener);
          element.removeEventListener('focus', listener);
        });
      });
      interactionListeners.current.clear();
    };
  }, [config, preload, setupInteractionPreloading, intelligentPreload]);

  // Cleanup old cache entries (older than 10 minutes)
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      const maxAge = 10 * 60 * 1000; // 10 minutes

      componentCache.forEach((cached, path) => {
        if (now - cached.preloadedAt > maxAge) {
          componentCache.delete(path);
          preloadCache.delete(path);
          preloadStarted.current.delete(path);
        }
      });
    }, 5 * 60 * 1000); // Run cleanup every 5 minutes

    return () => clearInterval(cleanupInterval);
  }, []);

  return {
    preload,
    isPreloaded: (path: string) => componentCache.has(path),
    getPreloadedComponent: (path: string) => componentCache.get(path)?.component,
    preloadStats: {
      totalPreloaded: componentCache.size,
      cacheSize: preloadCache.size,
    },
  };
}

// Hook for critical component preloading in forms
export function useFormWorkflowPreload(_currentStep: string) {
  return usePreloadStrategy({
    intelligentPreload: true,
    routeBasedPreload: {
      'step1': ['/components/forms/Step2', '/components/forms/Step3'],
      'step2': ['/components/forms/Step3', '/components/forms/Review'],
      'step3': ['/components/forms/Review', '/components/forms/Complete'],
      'review': ['/components/forms/Complete', '/checkout'],
      'complete': ['/dashboard', '/docs/[docId]/view'],
    },
    onInteraction: [
      '/checkout',
      '/dashboard', 
      '/generate',
    ],
  });
}

// Hook for admin dashboard preloading
export function useAdminPreload() {
  return usePreloadStrategy({
    immediatePreload: [
      'FraudDetectionDashboard',
      'RevenueIntelligenceDashboard', 
    ],
    onInteraction: [
      '/admin/fraud-detection',
      '/admin/revenue-intelligence',
      '/admin/customer-360',
    ],
    intelligentPreload: true,
  });
}
