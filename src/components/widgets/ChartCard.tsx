'use client';

import React from 'react';
import useSWR from 'swr';
import { z } from 'zod';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

// Zod schemas for different chart data types
const BaseDataPointSchema = z.object({
  name: z.string(),
  value: z.number(),
  timestamp: z.string().optional(),
});

const TimeSeriesDataSchema = z.array(
  BaseDataPointSchema.extend({
    date: z.string(),
  })
);

const CategoryDataSchema = z.array(
  BaseDataPointSchema.extend({
    category: z.string(),
    color: z.string().optional(),
  })
);

const MetricResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    current: z.number(),
    previous: z.number().optional(),
    change: z.number().optional(),
    changeType: z.enum(['increase', 'decrease', 'stable']).optional(),
    chartData: z.union([TimeSeriesDataSchema, CategoryDataSchema]),
    unit: z.string().optional(),
    format: z.enum(['number', 'percentage', 'currency', 'duration']).optional(),
  }),
  error: z.string().optional(),
});

type MetricResponse = z.infer<typeof MetricResponseSchema>;

interface ChartCardProps {
  queryKey: string;
  title: string;
  description?: string;
  chartType?: 'line' | 'bar' | 'pie';
  height?: number;
  refreshInterval?: number;
  className?: string;
}

const COLORS = [
  '#3b82f6', // blue-500
  '#ef4444', // red-500
  '#10b981', // green-500
  '#f59e0b', // yellow-500
  '#8b5cf6', // violet-500
  '#f97316', // orange-500
  '#06b6d4', // cyan-500
  '#84cc16', // lime-500
];

// SWR fetcher function
const fetcher = async (url: string): Promise<MetricResponse> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  
  // Validate response with Zod schema
  try {
    return MetricResponseSchema.parse(data);
  } catch (error) {
    console.error('Invalid metric response schema:', error);
    throw new Error('Invalid response format');
  }
};

const formatValue = (value: number, format?: string, unit?: string): string => {
  switch (format) {
    case 'percentage':
      return `${value.toFixed(1)}%`;
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value);
    case 'duration':
      return `${value.toFixed(1)}s`;
    case 'number':
    default:
      const formatted = value.toLocaleString();
      return unit ? `${formatted} ${unit}` : formatted;
  }
};

const renderTrendIcon = (changeType?: string, change?: number) => {
  if (!changeType || change === undefined) return null;
  
  const iconClass = "h-4 w-4 ml-1";
  switch (changeType) {
    case 'increase':
      return <TrendingUp className={`${iconClass} text-green-500`} />;
    case 'decrease':
      return <TrendingDown className={`${iconClass} text-red-500`} />;
    case 'stable':
      return <Minus className={`${iconClass} text-gray-500`} />;
    default:
      return null;
  }
};

const renderChart = (data: any[], chartType: string, height: number) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No data available
      </div>
    );
  }

  const commonProps = {
    width: '100%',
    height,
    data,
    margin: { top: 5, right: 30, left: 20, bottom: 5 },
  };

  switch (chartType) {
    case 'line':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              className="fill-muted-foreground"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              className="fill-muted-foreground"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={COLORS[0]}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );

    case 'bar':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              className="fill-muted-foreground"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              className="fill-muted-foreground"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            <Bar 
              dataKey="value" 
              fill={COLORS[0]}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      );

    case 'pie':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color || COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );

    default:
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Unsupported chart type: {chartType}
        </div>
      );
  }
};

export function ChartCard({ 
  queryKey, 
  title, 
  description, 
  chartType = 'line', 
  height = 300,
  refreshInterval = 30000, // 30 seconds
  className = ''
}: ChartCardProps) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/metrics?metric=${encodeURIComponent(queryKey)}`,
    fetcher,
    {
      refreshInterval,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 10000, // 10 seconds
    }
  );

  const handleRefresh = () => {
    mutate();
  };

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            {title}
          </CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] text-red-500">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">Failed to load metric data</p>
              <button 
                onClick={handleRefresh}
                className="mt-2 text-xs underline hover:no-underline"
              >
                Try again
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-[200px] w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data?.success || !data.data) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const { current, previous, change, changeType, chartData, format, unit } = data.data;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <button 
            onClick={handleRefresh}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            title="Refresh data"
          >
            ↻
          </button>
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold">
            {formatValue(current, format, unit)}
          </div>
          {change !== undefined && (
            <div className="flex items-center text-sm text-muted-foreground">
              <span>{change > 0 ? '+' : ''}{formatValue(change, format, unit)}</span>
              {renderTrendIcon(changeType, change)}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ height }}>
          {renderChart(chartData, chartType, height)}
        </div>
      </CardContent>
    </Card>
  );
}

// Export types for external use
export type { MetricResponse };
export { MetricResponseSchema };