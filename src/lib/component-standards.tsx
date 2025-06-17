// Component Standardization Guidelines and Types
import React from 'react'

// Standard base props that most components should extend
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
  id?: string
  'data-testid'?: string
}

// Standard props for interactive components
export interface InteractiveComponentProps extends BaseComponentProps {
  disabled?: boolean
  loading?: boolean
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

// Standard props for form components
export interface FormComponentProps<T = string> extends BaseComponentProps {
  name: string
  label?: string
  value?: T
  defaultValue?: T
  onChange?: (value: T) => void
  onBlur?: () => void
  onFocus?: () => void
  error?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
  tooltip?: string
  helpText?: string
}

// Standard props for layout components
export interface LayoutComponentProps extends BaseComponentProps {
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  margin?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  width?: 'auto' | 'full' | 'fit' | 'screen'
  height?: 'auto' | 'full' | 'fit' | 'screen'
}

// Standard props for card components
export interface CardComponentProps extends LayoutComponentProps {
  title?: string
  description?: string
  actions?: React.ReactNode
  footer?: React.ReactNode
  variant?: 'default' | 'outlined' | 'elevated' | 'flat'
  clickable?: boolean
  onClick?: () => void
}

// Loading state pattern
export interface LoadingStateProps extends BaseComponentProps {
  isLoading: boolean
  error?: string | null
  loadingComponent?: React.ReactNode
  errorComponent?: React.ReactNode
  emptyComponent?: React.ReactNode
  isEmpty?: boolean
}

// List component pattern
export interface ListComponentProps<T> extends BaseComponentProps {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  keyExtractor?: (item: T, index: number) => string | number
  emptyMessage?: string
  loading?: boolean
  error?: string
  onItemClick?: (item: T, index: number) => void
}

// Modal component pattern
export interface ModalComponentProps extends BaseComponentProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable?: boolean
  backdrop?: 'static' | 'clickable' | 'none'
}

// Component display name helper
export function setDisplayName<T extends React.ComponentType<any>>(
  Component: T,
  name: string
): T {
  Component.displayName = name
  return Component
}

// HOC for adding loading states
export function withLoadingState<P extends object>(
  Component: React.ComponentType<P>
) {
  return React.memo<P & LoadingStateProps>(function WithLoadingState({
    isLoading,
    error,
    isEmpty,
    loadingComponent,
    errorComponent,
    emptyComponent,
    children,
    ...props
  }) {
    if (isLoading) {
      return loadingComponent || (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )
    }

    if (error) {
      return errorComponent || (
        <div className="text-red-600 p-4 text-center">
          <p>Error: {error}</p>
        </div>
      )
    }

    if (isEmpty) {
      return emptyComponent || (
        <div className="text-gray-500 p-4 text-center">
          <p>No data available</p>
        </div>
      )
    }

    return <Component {...(props as P)}>{children}</Component>
  })
}

// Accessibility helpers
export const AccessibilityHelpers = {
  // Generate ARIA attributes for form fields
  getFormFieldAria: (props: {
    error?: string
    required?: boolean
    description?: string
    labelId?: string
  }) => ({
    'aria-invalid': props.error ? 'true' : 'false',
    'aria-required': props.required ? 'true' : 'false',
    'aria-describedby': props.description ? `${props.labelId}-description` : undefined,
    'aria-labelledby': props.labelId
  }),

  // Generate ARIA attributes for interactive elements
  getInteractiveAria: (props: {
    disabled?: boolean
    loading?: boolean
    expanded?: boolean
    controls?: string
  }) => ({
    'aria-disabled': props.disabled ? 'true' : 'false',
    'aria-busy': props.loading ? 'true' : 'false',
    'aria-expanded': props.expanded !== undefined ? props.expanded.toString() : undefined,
    'aria-controls': props.controls
  }),

  // Generate role and ARIA attributes for lists
  getListAria: (props: {
    itemCount: number
    selectedIndex?: number
    multiSelect?: boolean
  }) => ({
    role: props.multiSelect ? 'listbox' : 'list',
    'aria-multiselectable': props.multiSelect ? 'true' : 'false',
    'aria-setsize': props.itemCount,
    'aria-posinset': props.selectedIndex !== undefined ? props.selectedIndex + 1 : undefined
  })
}

// Performance helpers
export const PerformanceHelpers = {
  // Create a stable key for lists
  createStableKey: (item: any, index: number, idField = 'id') => {
    if (item && typeof item === 'object' && item[idField]) {
      return item[idField]
    }
    if (typeof item === 'string' || typeof item === 'number') {
      return item
    }
    return `item-${index}`
  },

  // Memoize component with custom comparison
  memoWithProps: <T extends object>(
    Component: React.ComponentType<T>,
    propsAreEqual?: (prev: T, next: T) => boolean
  ) => React.memo(Component, propsAreEqual),

  // Custom hook for debounced values
  useDebounced: <T>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = React.useState(value)

    React.useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)

      return () => {
        clearTimeout(handler)
      }
    }, [value, delay])

    return debouncedValue
  }
}

// Standard className builders
export const ClassNameHelpers = {
  // Build consistent size classes
  sizeClasses: {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-2',
    lg: 'text-lg px-4 py-3'
  },

  // Build consistent variant classes
  variantClasses: {
    default: 'bg-white border border-gray-300 text-gray-900',
    primary: 'bg-blue-600 border border-blue-600 text-white',
    secondary: 'bg-gray-600 border border-gray-600 text-white',
    outline: 'bg-transparent border border-gray-300 text-gray-900',
    ghost: 'bg-transparent border-0 text-gray-900'
  },

  // Build consistent state classes
  stateClasses: {
    disabled: 'opacity-50 cursor-not-allowed',
    loading: 'opacity-75 cursor-wait',
    error: 'border-red-300 text-red-900',
    success: 'border-green-300 text-green-900'
  },

  // Combine classes with proper handling
  cn: (...classes: (string | undefined | null | false)[]): string => {
    return classes
      .filter(Boolean)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
  }
}

// Type guards for better type safety
export const TypeGuards = {
  isString: (value: unknown): value is string => typeof value === 'string',
  isNumber: (value: unknown): value is number => typeof value === 'number',
  isBoolean: (value: unknown): value is boolean => typeof value === 'boolean',
  isFunction: (value: unknown): value is Function => typeof value === 'function',
  isObject: (value: unknown): value is object => 
    typeof value === 'object' && value !== null && !Array.isArray(value),
  isArray: <T>(value: unknown): value is T[] => Array.isArray(value)
}

// Component testing helpers
export const TestingHelpers = {
  // Generate test IDs consistently
  getTestId: (component: string, element?: string, modifier?: string) => {
    const parts = [component, element, modifier].filter(Boolean)
    return parts.join('-').toLowerCase()
  },

  // Generate mock props for testing
  getMockProps: <T extends object>(defaults: T, overrides: Partial<T> = {}): T => ({
    ...defaults,
    ...overrides
  })
}