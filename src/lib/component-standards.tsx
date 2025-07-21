// Component Standardization Guidelines and Types
import React from 'react';

// Standard base props that most components should extend
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  'data-testid'?: string;
}

// Standard props for interactive components
export interface InteractiveComponentProps extends BaseComponentProps {
  disabled?: boolean;
  loading?: boolean;
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

// Standard props for form components
export interface FormComponentProps<T = string> extends BaseComponentProps {
  name: string;
  label?: string;
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  tooltip?: string;
  helpText?: string;
}

// Standard props for layout components
export interface LayoutComponentProps extends BaseComponentProps {
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  margin?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  width?: 'auto' | 'full' | 'fit' | 'screen';
  height?: 'auto' | 'full' | 'fit' | 'screen';
}

// Standard props for card components
export interface CardComponentProps extends LayoutComponentProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated' | 'flat';
  clickable?: boolean;
  onClick?: () => void;
}

// Loading state pattern
export interface LoadingStateProps extends BaseComponentProps {
  isLoading: boolean;
  error?: string | null;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  isEmpty?: boolean;
}

// List component pattern
export interface ListComponentProps<T> extends BaseComponentProps {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor?: (item: T, index: number) => string | number;
  emptyMessage?: string;
  loading?: boolean;
  error?: string;
  onItemClick?: (item: T, index: number) => void;
}

// Modal component pattern
export interface ModalComponentProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  backdrop?: 'static' | 'clickable' | 'none';
}

// Component display name helper
export function setDisplayName<T extends React.ComponentType<any>>(
  Component: T,
  name: string,
): T {
  Component.displayName = name;
  return Component;
}

// HOC for adding loading states
export function withLoadingState<P extends object>(
  Component: React.ComponentType<P>,
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
      return (
        loadingComponent || (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )
      );
    }

    if (error) {
      return (
        errorComponent || (
          <div className="text-red-600 p-4 text-center">
            <p>Error: {error}</p>
          </div>
        )
      );
    }

    if (isEmpty) {
      return (
        emptyComponent || (
          <div className="text-gray-500 p-4 text-center">
            <p>No data available</p>
          </div>
        )
      );
    }

    return <Component {...(props as P)}>{children}</Component>;
  });
}

// Accessibility helpers
export const AccessibilityHelpers = {
  // Generate ARIA attributes for form fields
  getFormFieldAria: (props: {
    error?: string;
    required?: boolean;
    description?: string;
    labelId?: string;
  }) => ({
    'aria-invalid': props.error ? 'true' : 'false',
    'aria-required': props.required ? 'true' : 'false',
    'aria-describedby': props.description
      ? `${props.labelId}-description`
      : undefined,
    'aria-labelledby': props.labelId,
  }),

  // Generate ARIA attributes for interactive elements
  getInteractiveAria: (props: {
    disabled?: boolean;
    loading?: boolean;
    expanded?: boolean;
    controls?: string;
  }) => ({
    'aria-disabled': props.disabled ? 'true' : 'false',
    'aria-busy': props.loading ? 'true' : 'false',
    'aria-expanded':
      props.expanded !== undefined ? props.expanded.toString() : undefined,
    'aria-controls': props.controls,
  }),

  // Generate role and ARIA attributes for lists
  getListAria: (props: {
    itemCount: number;
    selectedIndex?: number;
    multiSelect?: boolean;
  }) => ({
    role: props.multiSelect ? 'listbox' : 'list',
    'aria-multiselectable': props.multiSelect ? 'true' : 'false',
    'aria-setsize': props.itemCount,
    'aria-posinset':
      props.selectedIndex !== undefined ? props.selectedIndex + 1 : undefined,
  }),
};

// Export helpers from separate file to avoid TypeScript/JSX conflicts
export {
  PerformanceHelpers,
  ClassNameHelpers,
  TypeGuards,
  TestingHelpers,
} from './component-standards-helpers';
