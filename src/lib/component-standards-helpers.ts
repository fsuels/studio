// Component helper utilities (non-JSX)
import React from 'react';

// Performance helpers
export const PerformanceHelpers = {
  // Create a stable key for lists
  createStableKey: (item: any, index: number, idField = 'id') => {
    if (item && typeof item === 'object' && item[idField]) {
      return item[idField];
    }
    if (typeof item === 'string' || typeof item === 'number') {
      return item;
    }
    return `item-${index}`;
  },

  // Memoize component with custom comparison
  memoWithProps: <T extends object>(
    Component: React.ComponentType<T>,
    propsAreEqual?: (prev: T, next: T) => boolean,
  ) => React.memo(Component, propsAreEqual),

  // Custom hook for debounced values
  useDebounced: <T>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = React.useState(value);

    React.useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  },
};

// Standard className builders
export const ClassNameHelpers = {
  // Build consistent size classes
  sizeClasses: {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-2',
    lg: 'text-lg px-4 py-3',
  },

  // Build consistent variant classes
  variantClasses: {
    default: 'bg-white border border-gray-300 text-gray-900',
    primary: 'bg-blue-600 border border-blue-600 text-white',
    secondary: 'bg-gray-600 border border-gray-600 text-white',
    outline: 'bg-transparent border border-gray-300 text-gray-900',
    ghost: 'bg-transparent border-0 text-gray-900',
  },

  // Build consistent state classes
  stateClasses: {
    disabled: 'opacity-50 cursor-not-allowed',
    loading: 'opacity-75 cursor-wait',
    error: 'border-red-300 text-red-900',
    success: 'border-green-300 text-green-900',
  },

  // Combine classes with proper handling
  cn: (...classes: (string | undefined | null | false)[]): string => {
    return classes.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
  },
};

// Type guards for better type safety
export const TypeGuards = {
  isString: (value: unknown): value is string => typeof value === 'string',
  isNumber: (value: unknown): value is number => typeof value === 'number',
  isBoolean: (value: unknown): value is boolean => typeof value === 'boolean',
  isFunction: (value: unknown): value is Function =>
    typeof value === 'function',
  isObject: (value: unknown): value is object =>
    typeof value === 'object' && value !== null && !Array.isArray(value),
  isArray: <T>(value: unknown): value is T[] => Array.isArray(value),
};

// Component testing helpers
export const TestingHelpers = {
  // Generate test IDs consistently
  getTestId: (component: string, element?: string, modifier?: string) => {
    const parts = [component, element, modifier].filter(Boolean);
    return parts.join('-').toLowerCase();
  },

  // Generate mock props for testing
  getMockProps: <T extends object>(
    defaults: T,
    overrides: Partial<T> = {},
  ): T => ({
    ...defaults,
    ...overrides,
  }),
};
