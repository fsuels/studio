'use client';

import React, { Suspense, lazy, ComponentType } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import {
  BaseComponentProps,
  ClassNameHelpers,
} from '@/lib/component-standards';

export interface LazyComponentProps extends BaseComponentProps {
  fallback?: React.ReactNode;
  errorBoundary?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class LazyErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
  }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <p className="text-red-600 mb-2">
              Something went wrong loading this component.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Try again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// Default loading component
const DefaultLoadingFallback = () => (
  <div className="flex items-center justify-center p-8">
    <Spinner className="h-8 w-8" />
  </div>
);

// Factory function to create lazy-loaded components
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T } | T>,
  options?: {
    fallback?: React.ReactNode;
    errorBoundary?: boolean;
    preload?: boolean;
  },
) {
  const LazyComponent = lazy(async () => {
    const module = await importFn();
    return 'default' in module ? module : { default: module };
  });

  // Preload function
  const preload = () => importFn();

  // Wrapped component with loading and error handling
  const WrappedComponent = React.forwardRef<any, React.ComponentProps<T>>(
    (props, ref) => {
      const content = (
        <Suspense fallback={options?.fallback || <DefaultLoadingFallback />}>
          <LazyComponent {...props} ref={ref} />
        </Suspense>
      );

      if (options?.errorBoundary !== false) {
        return (
          <LazyErrorBoundary fallback={options?.fallback}>
            {content}
          </LazyErrorBoundary>
        );
      }

      return content;
    },
  );

  WrappedComponent.displayName = `Lazy(${LazyComponent.displayName || 'Component'})`;

  // Add preload method
  (WrappedComponent as any).preload = preload;

  // Auto-preload if requested
  if (options?.preload) {
    preload();
  }

  return WrappedComponent as T & { preload: () => Promise<any> };
}

// Intersection Observer hook for lazy loading on visibility
export function useLazyLoad(
  threshold = 0.1,
  rootMargin = '50px',
): [React.RefObject<HTMLDivElement>, boolean] {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const targetRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [targetRef, isIntersecting];
}

// Lazy load wrapper component
export const LazyLoad: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}> = ({ children, fallback, threshold, rootMargin, className }) => {
  const [ref, isVisible] = useLazyLoad(threshold, rootMargin);

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : fallback || <DefaultLoadingFallback />}
    </div>
  );
};

// Common lazy-loaded components
export const LazyImage = createLazyComponent(
  () => import('@/components/shared/media/AutoImage'),
  { fallback: <div className="bg-gray-200 animate-pulse" /> },
);

export const LazyDocumentPreview = createLazyComponent(
  () => import('@/components/document/DocumentPreview'),
  { errorBoundary: true },
);

export const LazyWizardForm = createLazyComponent(
  () => import('@/components/forms/WizardForm'),
  { errorBoundary: true },
);

// Preload critical components
export function preloadCriticalComponents() {
  // Preload components that are likely to be used
  LazyDocumentPreview.preload();
  LazyWizardForm.preload();
}
