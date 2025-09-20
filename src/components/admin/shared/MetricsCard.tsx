'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { LucideIcon } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  className?: string;
}

export function MetricsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-blue-600',
  trend,
  badge,
  className,
}: MetricsCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  const getTrendColor = (isPositive: boolean) => {
    return isPositive ? 'text-green-600' : 'text-red-600';
  };

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              {badge && (
                <Badge variant={badge.variant || 'default'} className="text-xs">
                  {badge.text}
                </Badge>
              )}
            </div>
            <p className="text-2xl font-bold">{formatValue(value)}</p>
            {subtitle && (
              <div className="text-sm text-muted-foreground mt-1">
                {subtitle}
              </div>
            )}
            {trend && (
              <div className={`text-sm mt-1 ${getTrendColor(trend.isPositive)}`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
                {trend.label && ` ${trend.label}`}
              </div>
            )}
          </div>
          {Icon && <Icon className={`h-8 w-8 ${iconColor}`} />}
        </div>
      </CardContent>
    </Card>
  );
}
