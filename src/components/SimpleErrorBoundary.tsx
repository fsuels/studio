import React from 'react';

interface SimpleErrorBoundaryProps {
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

interface SimpleErrorBoundaryState {
  hasError: boolean;
}

export default class SimpleErrorBoundary extends React.Component<SimpleErrorBoundaryProps, SimpleErrorBoundaryState> {
  constructor(props: SimpleErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('[SimpleErrorBoundary] Caught error:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}
