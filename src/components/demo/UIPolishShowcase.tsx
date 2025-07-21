'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StickySummaryBar } from '@/components/ui/StickySummaryBar';
import {
  OrdersTableSkeleton,
  DashboardSkeleton,
  Customer360Skeleton,
  SessionReplaySkeleton,
  SupportToolkitSkeleton,
  ShimmerSkeleton,
  PulseSkeleton,
  WaveSkeleton,
  SkeletonElement,
} from '@/components/ui/SkeletonLoaders';
import {
  Play,
  Pause,
  RefreshCw,
  Loader2,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  RotateCcw,
  Mail,
  MessageSquare,
  Eye,
  Copy,
} from 'lucide-react';

export default function UIPolishShowcase() {
  const [activeDemo, setActiveDemo] = useState<
    'summary' | 'skeleton' | 'actions' | 'optimistic'
  >('summary');
  const [isLoading, setIsLoading] = useState(false);
  const [optimisticStates, setOptimisticStates] = useState<
    Record<string, boolean>
  >({});

  const triggerOptimisticUpdate = (key: string) => {
    setOptimisticStates((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setOptimisticStates((prev) => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const triggerLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Quick-Win UI Polish Showcase
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Experience the enhanced admin interface with sticky summary bars,
          contextual inline actions, skeleton loaders, and optimistic updates
          for blazing-fast perceived performance.
        </p>

        {/* Demo Navigation */}
        <div className="flex justify-center gap-2 mt-6">
          {[
            { key: 'summary', label: 'Sticky Summary Bar', icon: DollarSign },
            { key: 'skeleton', label: 'Skeleton Loaders', icon: RefreshCw },
            { key: 'actions', label: 'Inline Actions', icon: MessageSquare },
            {
              key: 'optimistic',
              label: 'Optimistic Updates',
              icon: TrendingUp,
            },
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={activeDemo === key ? 'default' : 'outline'}
              onClick={() => setActiveDemo(key as any)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Demo Content */}
      <div className="min-h-[600px]">
        {/* Sticky Summary Bar Demo */}
        {activeDemo === 'summary' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Sticky Summary Bar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  The sticky summary bar appears in the top-right corner when
                  you scroll down, providing instant access to key metrics and
                  quick actions.
                </p>

                {/* Features List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Key Features:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Real-time metrics updates every 30 seconds
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Compact and expanded view modes
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Smart sticky behavior on scroll
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Color-coded alerts and indicators
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Metrics Tracked:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        Total sales and revenue changes
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        Open support issues count
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        Average response time
                      </li>
                      <li className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                        Conversion rate tracking
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Pro Tip:</strong> Scroll down this page to see
                    the sticky summary bar in action! It automatically appears
                    when you scroll past the fold.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Skeleton Loaders Demo */}
        {activeDemo === 'skeleton' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5" />
                    Advanced Skeleton Loaders
                  </span>
                  <Button onClick={triggerLoading} disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Play className="h-4 w-4 mr-2" />
                    )}
                    {isLoading ? 'Loading...' : 'Demo Loading'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600">
                  Sophisticated skeleton loading patterns that match your actual
                  content structure for superior perceived performance.
                </p>

                {/* Skeleton Variants */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Pulse Animation</h4>
                    <div className="space-y-3">
                      <PulseSkeleton className="h-6 w-full" />
                      <PulseSkeleton className="h-4 w-3/4" />
                      <PulseSkeleton className="h-4 w-1/2" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Shimmer Effect</h4>
                    <div className="space-y-3">
                      <ShimmerSkeleton className="h-6 w-full" />
                      <ShimmerSkeleton className="h-4 w-3/4" />
                      <ShimmerSkeleton className="h-4 w-1/2" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Wave Animation</h4>
                    <div className="space-y-3">
                      <WaveSkeleton className="h-6 w-full" />
                      <WaveSkeleton className="h-4 w-3/4" />
                      <WaveSkeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                </div>

                {/* Full Component Skeletons */}
                {isLoading && (
                  <div className="mt-8">
                    <h4 className="font-semibold mb-4">
                      Component-Specific Skeletons
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <OrdersTableSkeleton rows={3} />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Inline Actions Demo */}
        {activeDemo === 'actions' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Contextual Inline Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600">
                  Quick actions are now directly accessible beside each row,
                  eliminating the need to open dropdown menus for common tasks.
                </p>

                {/* Sample Order Rows */}
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Order
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Customer
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Quick Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[
                        {
                          id: '1',
                          order: '#ORD-2024-001',
                          customer: 'John Smith',
                          email: 'john@example.com',
                          amount: '$89.99',
                          status: 'completed',
                        },
                        {
                          id: '2',
                          order: '#ORD-2024-002',
                          customer: 'Sarah Johnson',
                          email: 'sarah@example.com',
                          amount: '$129.99',
                          status: 'processing',
                        },
                        {
                          id: '3',
                          order: '#ORD-2024-003',
                          customer: 'Mike Davis',
                          email: 'mike@example.com',
                          amount: '$59.99',
                          status: 'pending',
                        },
                      ].map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{order.order}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() =>
                                  navigator.clipboard.writeText(order.order)
                                }
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <div className="font-medium">
                                {order.customer}
                              </div>
                              <div className="text-sm text-gray-600">
                                {order.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-semibold">
                            {order.amount}
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              className={
                                order.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : order.status === 'processing'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-yellow-100 text-yellow-800'
                              }
                            >
                              {order.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                                onClick={() =>
                                  triggerOptimisticUpdate(`refund_${order.id}`)
                                }
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50"
                                onClick={() =>
                                  triggerOptimisticUpdate(`email_${order.id}`)
                                }
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-green-600 hover:bg-green-50"
                              >
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-600 hover:bg-gray-50"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4 text-red-600" />
                    <span>Quick Refund</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span>Resend Email</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-green-600" />
                    <span>Contact Customer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-gray-600" />
                    <span>View Details</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Optimistic Updates Demo */}
        {activeDemo === 'optimistic' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Optimistic Updates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600">
                  Actions feel instant with optimistic updates that show results
                  immediately, with graceful fallback if the server operation
                  fails.
                </p>

                {/* Demo Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card
                    className={
                      optimisticStates.status
                        ? 'bg-blue-50 border-blue-200'
                        : ''
                    }
                  >
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Status Change</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Order status updates immediately in the UI
                      </p>
                      <Button
                        size="sm"
                        onClick={() => triggerOptimisticUpdate('status')}
                        disabled={optimisticStates.status}
                        className="w-full"
                      >
                        {optimisticStates.status ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Updating...
                          </>
                        ) : (
                          'Change Status'
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card
                    className={
                      optimisticStates.refund ? 'bg-red-50 border-red-200' : ''
                    }
                  >
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Process Refund</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Refund appears processed while API call happens
                      </p>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => triggerOptimisticUpdate('refund')}
                        disabled={optimisticStates.refund}
                        className="w-full"
                      >
                        {optimisticStates.refund ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Processing...
                          </>
                        ) : (
                          'Process Refund'
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card
                    className={
                      optimisticStates.email
                        ? 'bg-green-50 border-green-200'
                        : ''
                    }
                  >
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Send Email</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Email shows as sent while delivery happens
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => triggerOptimisticUpdate('email')}
                        disabled={optimisticStates.email}
                        className="w-full"
                      >
                        {optimisticStates.email ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Sending...
                          </>
                        ) : (
                          'Send Email'
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-800">
                    ✨ <strong>The Magic:</strong> Users see instant feedback
                    while the actual API call happens in the background. If it
                    fails, the UI gracefully reverts with an error message.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Sticky Summary Bar - Only show when not on summary demo */}
      {activeDemo !== 'summary' && <StickySummaryBar />}

      {/* Scroll prompt */}
      <div className="text-center py-8 text-gray-500">
        <p className="text-sm">
          ↓ Scroll down to see the sticky summary bar in action ↓
        </p>
      </div>

      {/* Extra content to enable scrolling */}
      <div className="space-y-8 py-16">
        {Array.from({ length: 10 }).map((_, i) => (
          <Card key={i} className="p-8">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">
                Sample Content Section {i + 1}
              </h3>
              <p className="text-gray-600">
                This is sample content to demonstrate scrolling behavior. Notice
                how the sticky summary bar appears as you scroll down.
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
