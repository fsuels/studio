'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Users,
  Clock,
  RefreshCw,
  Eye,
  BarChart3,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SummaryMetrics {
  totalSales: number;
  openIssues: number;
  todayRevenue: number;
  todayOrders: number;
  pendingRefunds: number;
  avgResponseTime: number;
  conversionRate: number;
  revenueChange: number;
  ordersChange: number;
  lastUpdated: number;
}

interface StickySummaryBarProps {
  className?: string;
  apiEndpoint?: string;
  refreshInterval?: number;
}

export function StickySummaryBar({ 
  className, 
  apiEndpoint = '/api/admin/summary',
  refreshInterval = 30000 // 30 seconds
}: StickySummaryBarProps) {
  const [metrics, setMetrics] = useState<SummaryMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, refreshInterval);
    
    // Sticky behavior
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsSticky(scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [refreshInterval]);

  const fetchMetrics = async () => {
    try {
      setError(null);
      const response = await fetch(apiEndpoint);
      const data = await response.json();
      
      if (data.success) {
        setMetrics(data.data);
      } else {
        setError('Failed to load metrics');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toFixed(0)}`;
  };

  const formatChange = (change: number) => {
    const isPositive = change >= 0;
    return {
      value: `${isPositive ? '+' : ''}${change.toFixed(1)}%`,
      color: isPositive ? 'text-green-600' : 'text-red-600',
      icon: isPositive ? TrendingUp : TrendingDown
    };
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (isLoading) {
    return (
      <div className={cn(
        "fixed top-4 right-4 z-50 transition-all duration-300",
        isSticky ? "translate-y-0 opacity-100" : "translate-y-[-100px] opacity-0",
        className
      )}>
        <Card className="bg-white/95 backdrop-blur-sm border shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="animate-pulse">
                <div className="h-8 w-24 bg-gray-200 rounded"></div>
              </div>
              <div className="animate-pulse">
                <div className="h-6 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className={cn(
        "fixed top-4 right-4 z-50 transition-all duration-300",
        isSticky ? "translate-y-0 opacity-100" : "translate-y-[-100px] opacity-0",
        className
      )}>
        <Card className="bg-red-50/95 backdrop-blur-sm border border-red-200 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Metrics unavailable</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const revenueChange = formatChange(metrics.revenueChange);
  const ordersChange = formatChange(metrics.ordersChange);

  return (
    <div className={cn(
      "fixed top-4 right-4 z-50 transition-all duration-300",
      isSticky ? "translate-y-0 opacity-100" : "translate-y-[-100px] opacity-0",
      className
    )}>
      <Card className="bg-white/95 backdrop-blur-sm border shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="p-4">
          {/* Compact View */}
          {!isExpanded && (
            <div className="flex items-center gap-4">
              {/* Total Sales */}
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-green-100 rounded-full">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatCurrency(metrics.totalSales)}
                  </div>
                  <div className="text-xs text-gray-500">Total Sales</div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-8 w-px bg-gray-200"></div>

              {/* Open Issues */}
              <div className="flex items-center gap-2">
                <div className={cn(
                  "p-1.5 rounded-full",
                  metrics.openIssues > 0 ? "bg-red-100" : "bg-gray-100"
                )}>
                  <AlertTriangle className={cn(
                    "h-4 w-4",
                    metrics.openIssues > 0 ? "text-red-600" : "text-gray-400"
                  )} />
                </div>
                <div>
                  <div className={cn(
                    "text-lg font-bold",
                    metrics.openIssues > 0 ? "text-red-600" : "text-gray-900"
                  )}>
                    {metrics.openIssues}
                  </div>
                  <div className="text-xs text-gray-500">Open Issues</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(true)}
                  className="h-8 w-8 p-0"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchMetrics}
                  className="h-8 w-8 p-0"
                >
                  <RefreshCw className={cn(
                    "h-4 w-4",
                    isLoading && "animate-spin"
                  )} />
                </Button>
              </div>
            </div>
          )}

          {/* Expanded View */}
          {isExpanded && (
            <div className="space-y-4 w-80">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Real-Time Metrics
                </h3>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(false)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={fetchMetrics}
                    className="h-8 w-8 p-0"
                  >
                    <RefreshCw className={cn(
                      "h-4 w-4",
                      isLoading && "animate-spin"
                    )} />
                  </Button>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Today's Revenue */}
                <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
                  <div className="flex items-center justify-between mb-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <div className={cn("flex items-center gap-1 text-xs", revenueChange.color)}>
                      <revenueChange.icon className="h-3 w-3" />
                      {revenueChange.value}
                    </div>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatCurrency(metrics.todayRevenue)}
                  </div>
                  <div className="text-xs text-gray-600">Today's Revenue</div>
                </div>

                {/* Today's Orders */}
                <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between mb-1">
                    <Users className="h-4 w-4 text-blue-600" />
                    <div className={cn("flex items-center gap-1 text-xs", ordersChange.color)}>
                      <ordersChange.icon className="h-3 w-3" />
                      {ordersChange.value}
                    </div>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {metrics.todayOrders}
                  </div>
                  <div className="text-xs text-gray-600">Today's Orders</div>
                </div>

                {/* Pending Refunds */}
                <div className="p-3 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg border border-yellow-100">
                  <div className="flex items-center justify-between mb-1">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    {metrics.pendingRefunds > 0 && (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5">
                        Urgent
                      </Badge>
                    )}
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {metrics.pendingRefunds}
                  </div>
                  <div className="text-xs text-gray-600">Pending Refunds</div>
                </div>

                {/* Response Time */}
                <div className="p-3 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border border-purple-100">
                  <div className="flex items-center justify-between mb-1">
                    <Zap className="h-4 w-4 text-purple-600" />
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs px-1.5 py-0.5",
                        metrics.avgResponseTime <= 60 
                          ? "bg-green-100 text-green-800" 
                          : metrics.avgResponseTime <= 180 
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      )}
                    >
                      {metrics.avgResponseTime <= 60 ? 'Fast' : metrics.avgResponseTime <= 180 ? 'OK' : 'Slow'}
                    </Badge>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatTime(metrics.avgResponseTime)}
                  </div>
                  <div className="text-xs text-gray-600">Avg Response</div>
                </div>
              </div>

              {/* Conversion Rate */}
              <div className="p-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-indigo-600" />
                    <span className="text-sm font-medium text-gray-700">Conversion Rate</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {metrics.conversionRate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      Last updated: {new Date(metrics.lastUpdated).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  Orders
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Issues
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}