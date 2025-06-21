'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  Play,
  Pause,
  Trash2,
  Eye,
  Settings,
  Activity,
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
  const [error, setError] = useState<string | null>(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedWebhook, setSelectedWebhook] =
    useState<WebhookSubscription | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/webhooks');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch webhooks');
      }

      setWebhooks(data.webhooks || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching webhooks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWebhook = async (webhookId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/webhooks/${webhookId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle webhook');
      }

      // Refresh webhooks list
      await fetchWebhooks();
    } catch (err: any) {
      console.error('Error toggling webhook:', err);
      setError(err.message);
    }
  };

  const handleDeleteWebhook = async (webhookId: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this webhook? This action cannot be undone.',
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/webhooks/${webhookId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete webhook');
      }

      // Refresh webhooks list
      await fetchWebhooks();
    } catch (err: any) {
      console.error('Error deleting webhook:', err);
      setError(err.message);
    }
  };

  const handleTestWebhook = async (webhookId: string) => {
    try {
      const response = await fetch(`/api/webhooks/${webhookId}/test`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send test webhook');
      }

      alert(`Test webhook sent successfully! Status: ${data.delivery.status}`);
    } catch (err: any) {
      console.error('Error testing webhook:', err);
      setError(err.message);
    }
  };

  const formatDate = (timestamp: { seconds: number }) => {
    return new Date(timestamp.seconds * 1000).toLocaleString();
  };

  const getStatusColor = (
    isActive: boolean,
    stats: WebhookSubscription['deliveryStats'],
  ) => {
    if (!isActive) return 'secondary';
    if (stats.failedDeliveries > stats.successfulDeliveries)
      return 'destructive';
    return 'default';
  };

  const calculateSuccessRate = (
    stats: WebhookSubscription['deliveryStats'],
  ) => {
    if (stats.totalDeliveries === 0) return 0;
    return Math.round(
      (stats.successfulDeliveries / stats.totalDeliveries) * 100,
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Webhook Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage webhook subscriptions and monitor delivery status
          </p>
        </div>
        <Button onClick={() => setShowRegistrationModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Webhook
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-destructive font-medium">Error: {error}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => setError(null)}
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Webhooks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{webhooks.length}</div>
            <p className="text-xs text-muted-foreground">
              {webhooks.filter((w) => w.isActive).length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Deliveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {webhooks.reduce(
                (sum, w) => sum + w.deliveryStats.totalDeliveries,
                0,
              )}
            </div>
            <p className="text-xs text-muted-foreground">All time deliveries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {webhooks.length > 0
                ? Math.round(
                    (webhooks.reduce(
                      (sum, w) => sum + w.deliveryStats.successfulDeliveries,
                      0,
                    ) /
                      Math.max(
                        webhooks.reduce(
                          (sum, w) => sum + w.deliveryStats.totalDeliveries,
                          0,
                        ),
                        1,
                      )) *
                      100,
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              Overall success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Failed Deliveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {webhooks.reduce(
                (sum, w) => sum + w.deliveryStats.failedDeliveries,
                0,
              )}
            </div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="webhooks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="events">Event Log</TabsTrigger>
        </TabsList>

        <TabsContent value="webhooks" className="space-y-4">
          {webhooks.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <Activity className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No webhooks configured
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  Start by creating your first webhook to receive real-time
                  notifications
                </p>
                <Button onClick={() => setShowRegistrationModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Webhook
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {webhooks.map((webhook) => (
                <Card key={webhook.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg">{webhook.url}</CardTitle>
                        <Badge
                          variant={getStatusColor(
                            webhook.isActive,
                            webhook.deliveryStats,
                          )}
                        >
                          {webhook.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline">
                          {calculateSuccessRate(webhook.deliveryStats)}% success
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTestWebhook(webhook.id)}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
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
                          onClick={() => handleDeleteWebhook(webhook.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium">Events</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {webhook.events.slice(0, 3).map((event) => (
                            <Badge
                              key={event}
                              variant="outline"
                              className="text-xs"
                            >
                              {event}
                            </Badge>
                          ))}
                          {webhook.events.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{webhook.events.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium">Delivery Stats</p>
                        <p className="text-sm text-muted-foreground">
                          {webhook.deliveryStats.totalDeliveries} total,{' '}
                          {webhook.deliveryStats.successfulDeliveries}{' '}
                          successful, {webhook.deliveryStats.failedDeliveries}{' '}
                          failed
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium">Last Delivery</p>
                        <p className="text-sm text-muted-foreground">
                          {webhook.lastDeliveryAt
                            ? formatDate(webhook.lastDeliveryAt)
                            : 'Never'}
                        </p>
                      </div>
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
