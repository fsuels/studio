// Optimized React Components with Advanced Memoization
// Reduces unnecessary re-renders and improves performance

'use client';

import React, { memo, useMemo, useCallback, forwardRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Shield, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

/**
 * Memoized Document Card Component
 * Prevents re-renders when props haven't changed
 */
export interface DocumentCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  jurisdiction?: string;
  configType: 'json' | 'typescript';
  isNew?: boolean;
  requiresNotary?: boolean;
  officialForm?: boolean;
  route: string;
  className?: string;
  onClick?: (id: string) => void;
}

export const MemoizedDocumentCard = memo(function DocumentCard({
  id,
  title,
  description,
  category,
  jurisdiction,
  configType,
  isNew = false,
  requiresNotary = false,
  officialForm = false,
  route,
  className,
  onClick,
}: DocumentCardProps) {
  const handleClick = useCallback(() => {
    onClick?.(id);
  }, [id, onClick]);

  const documentIcon = useMemo(() => {
    if (configType === 'json') {
      return <Sparkles className="h-5 w-5 text-blue-600" />;
    }
    return <FileText className="h-5 w-5 text-gray-600" />;
  }, [configType]);

  const badges = useMemo(() => (
    <div className="flex gap-1">
      {requiresNotary && (
        <Badge variant="outline" className="text-xs">
          <Shield className="h-3 w-3 mr-1" />
          Notary
        </Badge>
      )}
      {officialForm && (
        <Badge variant="outline" className="text-xs">
          Official
        </Badge>
      )}
    </div>
  ), [requiresNotary, officialForm]);

  const headerBadges = useMemo(() => (
    <div className="flex flex-col gap-1">
      {isNew && (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
          NEW
        </Badge>
      )}
      <Badge variant="outline" className="text-xs">
        {configType === 'json' ? 'JSON' : 'TypeScript'}
      </Badge>
    </div>
  ), [isNew, configType]);

  return (
    <Card className={cn("hover:shadow-lg transition-shadow", className)} onClick={handleClick}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {documentIcon}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          {headerBadges}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FileText className="h-3 w-3" />
            <span>{category}</span>
          </div>
          {jurisdiction && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3 w-3" />
              <span>{jurisdiction}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          {badges}
          <Link href={route}>
            <Button size="sm">
              Create <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
});

/**
 * Memoized Badge Component
 * Optimized for frequently changing status indicators
 */
export interface OptimizedBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const MemoizedBadge = memo(function OptimizedBadge({
  children,
  variant = 'default',
  className,
  icon: Icon,
}: OptimizedBadgeProps) {
  const content = useMemo(() => (
    <>
      {Icon && <Icon className="h-3 w-3 mr-1" />}
      {children}
    </>
  ), [children, Icon]);

  return (
    <Badge variant={variant} className={className}>
      {content}
    </Badge>
  );
});

/**
 * Memoized List Item Component
 * For virtualized lists and large datasets
 */
export interface ListItemProps {
  id: string;
  title: string;
  description?: string;
  status?: 'active' | 'inactive' | 'pending';
  updatedAt?: string;
  onClick?: (id: string) => void;
  className?: string;
  actions?: React.ReactNode;
}

export const MemoizedListItem = memo(function ListItem({
  id,
  title,
  description,
  status = 'active',
  updatedAt,
  onClick,
  className,
  actions,
}: ListItemProps) {
  const handleClick = useCallback(() => {
    onClick?.(id);
  }, [id, onClick]);

  const statusBadge = useMemo(() => {
    const statusConfig = {
      active: { variant: 'default' as const, text: 'Active' },
      inactive: { variant: 'secondary' as const, text: 'Inactive' },
      pending: { variant: 'outline' as const, text: 'Pending' },
    };

    const config = statusConfig[status];
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.text}
      </Badge>
    );
  }, [status]);

  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 border-b border-border hover:bg-muted/50 cursor-pointer transition-colors",
        className
      )}
      onClick={handleClick}
    >
      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground truncate mt-1">
            {description}
          </p>
        )}
        <div className="flex items-center mt-2 text-xs text-muted-foreground">
          {statusBadge}
          {updatedAt && (
            <>
              <span className="mx-2">•</span>
              <Clock className="h-3 w-3 mr-1" />
              <span>{new Date(updatedAt).toLocaleDateString()}</span>
            </>
          )}
        </div>
      </div>
      {actions && (
        <div className="ml-4 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
});

/**
 * Memoized Search Result Component
 * Optimized for search result lists
 */
export interface SearchResultProps {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  category: string;
  relevance: number;
  onClick?: (result: SearchResultProps) => void;
}

export const MemoizedSearchResult = memo(function SearchResult({
  id,
  title,
  excerpt,
  url,
  category,
  relevance,
  onClick,
}: SearchResultProps) {
  const handleClick = useCallback(() => {
    onClick?.({ id, title, excerpt, url, category, relevance });
  }, [id, title, excerpt, url, category, relevance, onClick]);

  const relevanceBar = useMemo(() => (
    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
      <div
        className="h-full bg-blue-500 transition-all duration-300"
        style={{ width: `${relevance * 100}%` }}
      />
    </div>
  ), [relevance]);

  const relevancePercentage = useMemo(() =>
    Math.round(relevance * 100), [relevance]
  );

  return (
    <div
      className="p-4 border-b border-border hover:bg-muted/30 cursor-pointer transition-colors"
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-blue-600 hover:text-blue-800 truncate">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {excerpt}
          </p>
          <div className="flex items-center mt-2 text-xs text-muted-foreground">
            <span className="px-2 py-1 bg-muted rounded-full">{category}</span>
            <span className="ml-2">{url}</span>
          </div>
        </div>
        <div className="ml-4 flex-shrink-0">
          {relevanceBar}
          <span className="text-xs text-muted-foreground mt-1 block text-center">
            {relevancePercentage}%
          </span>
        </div>
      </div>
    </div>
  );
});

/**
 * Memoized Form Field Component
 * Optimized for large forms with many fields
 */
export interface FormFieldProps {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'date' | 'select' | 'textarea';
  value: string;
  onChange: (id: string, value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  options?: { value: string; label: string }[];
  className?: string;
}

export const MemoizedFormField = memo(function FormField({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  options,
  className,
}: FormFieldProps) {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(id, e.target.value);
  }, [id, onChange]);

  const fieldProps = useMemo(() => ({
    id,
    value,
    onChange: handleChange,
    placeholder,
    required,
    disabled,
    className: cn(
      "w-full p-2 border border-border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",
      error && "border-red-500",
      className
    ),
  }), [id, value, handleChange, placeholder, required, disabled, error, className]);

  const renderField = () => {
    switch (type) {
      case 'textarea':
        return <textarea {...fieldProps} rows={4} />;
      case 'select':
        return (
          <select {...fieldProps}>
            <option value="">{placeholder || 'Select an option'}</option>
            {options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      default:
        return <input {...fieldProps} type={type} />;
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderField()}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

/**
 * HOC for memoizing components with deep comparison
 */
export function withDeepMemo<T extends Record<string, any>>(
  Component: React.ComponentType<T>
) {
  return memo(Component, (prevProps, nextProps) => {
    return JSON.stringify(prevProps) === JSON.stringify(nextProps);
  });
}

/**
 * Hook for memoizing expensive calculations
 */
export function useStableMemo<T>(
  factory: () => T,
  deps: React.DependencyList,
  isEqual?: (a: T, b: T) => boolean
): T {
  const ref = React.useRef<{ deps: React.DependencyList; value: T }>();

  if (!ref.current || !areEqual(ref.current.deps, deps)) {
    ref.current = { deps, value: factory() };
  } else if (isEqual && ref.current.value) {
    const newValue = factory();
    if (!isEqual(ref.current.value, newValue)) {
      ref.current = { deps, value: newValue };
    }
  }

  return ref.current.value;
}

function areEqual(a: React.DependencyList, b: React.DependencyList): boolean {
  return a.length === b.length && a.every((val, i) => val === b[i]);
}

export default {
  MemoizedDocumentCard,
  MemoizedBadge,
  MemoizedListItem,
  MemoizedSearchResult,
  MemoizedFormField,
  withDeepMemo,
  useStableMemo,
};