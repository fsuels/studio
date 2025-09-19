'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  Activity,
  AlertTriangle,
  Eye,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { WebhookRegistrationModal } from './WebhookRegistrationModal';
import { WebhookDetailsModal } from './WebhookDetailsModal';
import { EventLogViewer } from './EventLogViewer';

interface WebhookSubscription {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  organizationId?: string;
  metadata: Record<string, any>;
  createdAt: { seconds: number };
  updatedAt: { seconds: number };
  lastDeliveryAt?: { seconds: number };
  deliveryStats: {
    totalDeliveries: number;
    successfulDeliveries: number;
    failedDeliveries: number;
    avgResponseTime: number;
  };
  retryPolicy: {
    maxRetries: number;
    backoffMultiplier: number;
    maxBackoffSeconds: number;
  };
}

export function WebhookDashboard() {
  const [webhooks, setWebhooks] = useState<WebhookSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedWebhook, setSelectedWebhook] =
    useState<WebhookSubscription | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'webhooks' | 'events'>('webhooks');

  const abortControllerRef = useRef<AbortController | null>(null);
  const hasFetchedRef = useRef(false);
  const { toast } = useToast();

  const fetchWebhooks = useCallback(async () => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    if (!hasFetchedRef.current) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    setError(null);

    try {
      const response = await fetch('/api/webhooks', {
        signal: controller.signal,
      });
      const data = await response.json().catch(() => null);

      if (controller.signal.aborted) {
        return;
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to fetch webhooks');
      }

      setWebhooks((data?.webhooks as WebhookSubscription[]) || []);
      hasFetchedRef.current = true;
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        return;
      }

      console.error('Error fetching webhooks:', err);
      const message =
        (err as Error).message || 'Unable to load webhooks right now.';
      setError(message);
      toast({
        title: 'Webhook load failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [toast]);

  useEffect(() => {
    void fetchWebhooks();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [fetchWebhooks]);

  const handleToggleWebhook = useCallback(
    async (webhookId: string, isActive: boolean) => {
      try {
        const response = await fetch(`/api/webhooks/${webhookId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive: !isActive }),
        });
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.error || 'Failed to toggle webhook');
        }

        await fetchWebhooks();
        toast({
          title: isActive ? 'Webhook paused' : 'Webhook activated',
          description: `${webhookId} ${
            isActive ? 'is now paused' : 'is active again'
          }.`,
        });
      } catch (err) {
        console.error('Error toggling webhook:', err);
        const message =
          (err as Error).message || 'Unable to update webhook status.';
        setError(message);
        toast({
          title: 'Webhook update failed',
          description: message,
          variant: 'destructive',
        });
      }
    },
    [fetchWebhooks, toast],
  );

  const handleDeleteWebhook = useCallback(
    async (webhookId: string) => {
      try {
        const response = await fetch(`/api/webhooks/${webhookId}`, {
          method: 'DELETE',
        });
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.error || 'Failed to delete webhook');
        }

        await fetchWebhooks();
        toast({
          title: 'Webhook deleted',
          description: `${webhookId} has been removed.`,
        });
      } catch (err) {
        console.error('Error deleting webhook:', err);
        const message = (err as Error).message || 'Unable to delete webhook.';
        setError(message);
        toast({
          title: 'Webhook delete failed',
          description: message,
          variant: 'destructive',
        });
      }
    },
    [fetchWebhooks, toast],
  );

  const handleTestWebhook = useCallback(async (webhookId: string) => {
    try {
      const response = await fetch(`/api/webhooks/${webhookId}/test`, {
        method: 'POST',
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to send test webhook');
      }

      toast({
        title: 'Test webhook sent',
        description: 'Delivery request queued successfully.',
      });
    } catch (err) {
      console.error('Error testing webhook:', err);
      const message =
        (err as Error).message || 'Unable to send test webhook.';
      setError(message);
      toast({
        title: 'Webhook test failed',
        description: message,
        variant: 'destructive',
      });
    }
  }, [toast]);

  const formatDate = useCallback((timestamp: { seconds: number }) => {
    return new Date(timestamp.seconds * 1000).toLocaleString();
  }, []);

  const getStatusColor = useCallback(
    (
      isActive: boolean,
      stats: WebhookSubscription['deliveryStats'],
    ) => {
      if (!isActive) return 'secondary';
      if (stats.failedDeliveries > stats.successfulDeliveries) {
        return 'destructive';
      }
      return 'default';
    },
    [],
  );

  const calculateSuccessRate = useCallback(
    (stats: WebhookSubscription['deliveryStats']) => {
      if (stats.totalDeliveries === 0) return 0;
      return Math.round(
        (stats.successfulDeliveries / stats.totalDeliveries) * 100,
      );
    },
    [],
  );

  const handleManualRefresh = useCallback(() => {
    void fetchWebhooks();
  }, [fetchWebhooks]);

  const aggregatedStats = useMemo(() => {
    return webhooks.reduce(
      (acc, webhook) => {
        acc.totalDeliveries += webhook.deliveryStats.totalDeliveries;
        acc.successfulDeliveries +=
          webhook.deliveryStats.successfulDeliveries;
        acc.failedDeliveries += webhook.deliveryStats.failedDeliveries;
        if (webhook.isActive) {
          acc.activeCount += 1;
        }
        return acc;
      },
      {
        totalDeliveries: 0,
        successfulDeliveries: 0,
        failedDeliveries: 0,
        activeCount: 0,
      },
    );
  }, [webhooks]);

  const successRatePercentage = useMemo(() => {
    if (aggregatedStats.totalDeliveries === 0) {
      return 0;
    }

    return Math.round(
      (aggregatedStats.successfulDeliveries /
        aggregatedStats.totalDeliveries) *
        100,
    );
  }, [aggregatedStats]);

  const isInitialLoad = loading && !hasFetchedRef.current;
  const isEmpty = !loading && webhooks.length === 0;

  if (isInitialLoad) {
    return <WebhookDashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-900">
            Webhook Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage webhook subscriptions and monitor delivery status.
          </p>
          {refreshing ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-primary">
                <RefreshCw className="h-3 w-3 animate-spin" />
                Updating…
              </span>
            </div>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
            />
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </Button>
          <Button onClick={() => setShowRegistrationModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Webhook
          </Button>
        </div>
      </div>

      <div aria-live="polite" className="sr-only">
        {error ? `Error: ${error}` : ''}
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between gap-3">
              <span>{error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setError(null)}
              >
                Dismiss
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-none bg-white/80 shadow-sm ring-1 ring-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Webhooks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-slate-900">
              {webhooks.length.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {aggregatedStats.activeCount.toLocaleString()} active
            </p>
          </CardContent>
        </Card>

        <Card className="border-none bg-white/80 shadow-sm ring-1 ring-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Deliveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-slate-900">
              {aggregatedStats.totalDeliveries.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All-time deliveries</p>
          </CardContent>
        </Card>

        <Card className="border-none bg-white/80 shadow-sm ring-1 ring-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-slate-900">
              {successRatePercentage}%
            </div>
            <p className="text-xs text-muted-foreground">
              Overall delivery success
            </p>
          </CardContent>
        </Card>

        <Card className="border-none bg-white/80 shadow-sm ring-1 ring-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Failed Deliveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-destructive">
              {aggregatedStats.failedDeliveries.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as 'webhooks' | 'events')}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white/80 p-2 shadow-sm">
          <TabsTrigger
            value="webhooks"
            className="rounded-xl border border-transparent bg-transparent px-3 py-2 text-sm font-medium transition hover:border-slate-200 hover:bg-slate-100/60 data-[state=active]:border-primary/30 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
          >
            Webhooks
          </TabsTrigger>
          <TabsTrigger
            value="events"
            className="rounded-xl border border-transparent bg-transparent px-3 py-2 text-sm font-medium transition hover:border-slate-200 hover:bg-slate-100/60 data-[state=active]:border-primary/30 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
          >
            Event Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="webhooks" className="space-y-4">
          {isEmpty ? (
            <Card className="border border-dashed border-slate-200 bg-white/80 shadow-sm">
              <CardContent className="flex h-64 flex-col items-center justify-center gap-3 text-center">
                <Activity className="h-12 w-12 text-muted-foreground" />
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-slate-900">
                    No webhooks configured
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Create a webhook to receive real-time notifications from 123LegalDoc.
                  </p>
                </div>
                <Button onClick={() => setShowRegistrationModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create first webhook
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {webhooks.map((webhook) => (
                <Card
                  key={webhook.id}
                  className="border-none bg-white/80 shadow-sm ring-1 ring-slate-200"
                >
                  <CardHeader>
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle className="text-base font-semibold">
                          {webhook.url}
                        </CardTitle>
                        <Badge
                          variant={getStatusColor(
                            webhook.isActive,
                            webhook.deliveryStats,
                          )}
                        >
                          {webhook.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {calculateSuccessRate(webhook.deliveryStats)}% success
                        </Badge>
                        {webhook.organizationId ? (
                          <Badge variant="outline" className="text-xs">
                            Org {webhook.organizationId}
                          </Badge>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          aria-label={`Send test event to ${webhook.url}`}
                          onClick={() => handleTestWebhook(webhook.id)}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          aria-label={
                            webhook.isActive
                              ? `Pause webhook ${webhook.url}`
                              : `Activate webhook ${webhook.url}`
                          }
                          onClick={() =>
                            handleToggleWebhook(webhook.id, webhook.isActive)
                          }
                        >
                          {webhook.isActive ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          aria-label={`View details for ${webhook.url}`}
                          onClick={() => {
                            setSelectedWebhook(webhook);
                            setShowDetailsModal(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          aria-label={`Delete webhook ${webhook.url}`}
                          onClick={() => handleDeleteWebhook(webhook.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-900">Events</p>
                      <div className="flex flex-wrap gap-1">
                        {webhook.events.slice(0, 4).map((event) => (
                          <Badge key={event} variant="outline" className="text-xs">
                            {event}
                          </Badge>
                        ))}
                        {webhook.events.length > 4 ? (
                          <Badge variant="outline" className="text-xs">
                            +{webhook.events.length - 4} more
                          </Badge>
                        ) : null}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-900">
                        Delivery stats
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {webhook.deliveryStats.totalDeliveries.toLocaleString()} total •{' '}
                        {webhook.deliveryStats.successfulDeliveries.toLocaleString()} success •{' '}
                        {webhook.deliveryStats.failedDeliveries.toLocaleString()} failed
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-900">
                        Last delivery
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {webhook.lastDeliveryAt
                          ? formatDate(webhook.lastDeliveryAt)
                          : 'Never'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="events">
          <EventLogViewer />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {showRegistrationModal && (
        <WebhookRegistrationModal
          onClose={() => setShowRegistrationModal(false)}
          onSuccess={() => {
            setShowRegistrationModal(false);
            fetchWebhooks();
          }}
        />
      )}

      {showDetailsModal && selectedWebhook && (
        <WebhookDetailsModal
          webhook={selectedWebhook}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedWebhook(null);
          }}
          onUpdate={() => {
            fetchWebhooks();
          }}
        />
      )}
    </div>
  );
}

function WebhookDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            key={index}
            className="border-none bg-white/70 shadow-sm ring-1 ring-slate-200"
          >
            <CardContent className="space-y-3 p-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-dashed border-slate-200 bg-white/80">
        <CardContent className="space-y-3 p-6">
          <Skeleton className="h-5 w-40" />
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-4 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
