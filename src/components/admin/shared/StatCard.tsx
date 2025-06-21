'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatItem {
  label: string;
  value: string | number;
  className?: string;
  highlight?: boolean;
}

interface StatCardProps {
  title: string;
  icon?: LucideIcon;
  stats: StatItem[];
  className?: string;
  children?: React.ReactNode;
}

export function StatCard({
  title,
  icon: Icon,
  stats,
  className,
  children,
}: StatCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex items-center justify-between"
            >
              <span className="text-sm text-muted-foreground">
                {stat.label}
              </span>
              <span
                className={`font-semibold ${
                  stat.highlight ? 'text-red-600' : ''
                } ${stat.className || ''}`}
              >
                {formatValue(stat.value)}
              </span>
            </div>
          ))}
          {children}
        </div>
      </CardContent>
    </Card>
  );
}