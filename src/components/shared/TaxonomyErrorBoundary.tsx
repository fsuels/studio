// src/components/shared/TaxonomyErrorBoundary.tsx
'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TaxonomyErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface TaxonomyErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ retry: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

class TaxonomyErrorBoundary extends React.Component<
  TaxonomyErrorBoundaryProps,
  TaxonomyErrorBoundaryState
> {
  constructor(props: TaxonomyErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): TaxonomyErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Taxonomy Error Boundary caught an error:', error, errorInfo);
    
    // Report to analytics
    this.props.onError?.(error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent retry={this.handleRetry} />;
      }

      return <DefaultErrorFallback error={this.state.error} onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<{ error?: Error; onRetry: () => void }> = ({ 
  error, 
  onRetry 
}) => (
  <Card className="border-destructive/50 bg-destructive/5">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-destructive">
        <AlertTriangle className="h-5 w-5" />
        Something went wrong
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <p className="text-sm text-muted-foreground">
        We're having trouble loading the enhanced features. You can still browse documents using the basic navigation.
      </p>
      {process.env.NODE_ENV === 'development' && error && (
        <details className="text-xs bg-muted p-2 rounded">
          <summary className="cursor-pointer font-medium">Error Details</summary>
          <pre className="mt-2 whitespace-pre-wrap">{error.stack}</pre>
        </details>
      )}
      <Button 
        onClick={onRetry} 
        variant="outline" 
        size="sm" 
        className="gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </Button>
    </CardContent>
  </Card>
);

export default TaxonomyErrorBoundary;