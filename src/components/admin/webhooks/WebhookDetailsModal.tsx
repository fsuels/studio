'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Clock, CheckCircle, XCircle, RefreshCw, Eye, Copy } from 'lucide-react';

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

interface WebhookDelivery {
  id: string;
  eventType: string;
  status: 'pending' | 'success' | 'failed' | 'retrying';
  statusCode?: number;
  url: string;
  attempts: number;
  createdAt: { seconds: number };
  deliveredAt?: { seconds: number };
  nextRetryAt?: { seconds: number };
  errorMessage?: string;
  responseBody?: string;
  payload: {
    id: string;
    type: string;
    timestamp: string;
    hasData: boolean;
  };
}

interface WebhookDetailsModalProps {
  webhook: WebhookSubscription;
  onClose: () => void;
  onUpdate: () => void;
}

export function WebhookDetailsModal({ webhook, onClose, onUpdate }: WebhookDetailsModalProps) {
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([]);
  const [deliveryStats, setDeliveryStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<WebhookDelivery | null>(null);

  useEffect(() => {
    fetchDeliveryHistory();
  }, [webhook.id]);

  const fetchDeliveryHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/webhooks/${webhook.id}/deliveries?limit=50`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch delivery history');
      }

      setDeliveries(data.deliveries || []);
      setDeliveryStats(data.stats || {});
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching delivery history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTestWebhook = async () => {
    try {
      const response = await fetch(`/api/webhooks/${webhook.id}/test`, {
        method: 'POST'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send test webhook');
      }

      alert(`Test webhook sent! Status: ${data.delivery.status}`);
      await fetchDeliveryHistory(); // Refresh delivery history
    } catch (err: any) {
      setError(err.message);
    }
  };

  const formatDate = (timestamp: { seconds: number }) => {
    return new Date(timestamp.seconds * 1000).toLocaleString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'retrying':
        return <RefreshCw className="h-4 w-4 text-yellow-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'default';
      case 'failed':
        return 'destructive';
      case 'retrying':
        return 'secondary';
      case 'pending':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Webhook Details
                <Badge variant={webhook.isActive ? 'default' : 'secondary'}>
                  {webhook.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{webhook.url}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleTestWebhook}>
                Test Webhook
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="deliveries">Delivery History</TabsTrigger>
              <TabsTrigger value="configuration">Configuration</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{webhook.deliveryStats.totalDeliveries}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Successful</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {webhook.deliveryStats.successfulDeliveries}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Failed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {webhook.deliveryStats.failedDeliveries}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {webhook.deliveryStats.totalDeliveries > 0
                        ? Math.round((webhook.deliveryStats.successfulDeliveries / webhook.deliveryStats.totalDeliveries) * 100)
                        : 0
                      }%
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Events */}
              <Card>
                <CardHeader>
                  <CardTitle>Subscribed Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {webhook.events.map((event) => (
                      <Badge key={event} variant="outline">
                        {event}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Deliveries</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  ) : deliveries.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      No deliveries yet
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {deliveries.slice(0, 5).map((delivery) => (
                        <div key={delivery.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(delivery.status)}
                            <div>
                              <p className="font-medium">{delivery.eventType}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(delivery.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getStatusColor(delivery.status)}>
                              {delivery.status}
                            </Badge>
                            {delivery.statusCode && (
                              <Badge variant="outline">
                                {delivery.statusCode}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="deliveries" className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {deliveryStats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold">{deliveryStats.total}</div>
                          <p className="text-xs text-muted-foreground">Total</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold text-green-600">{deliveryStats.successful}</div>
                          <p className="text-xs text-muted-foreground">Successful</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold text-red-600">{deliveryStats.failed}</div>
                          <p className="text-xs text-muted-foreground">Failed</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold text-yellow-600">{deliveryStats.retrying}</div>
                          <p className="text-xs text-muted-foreground">Retrying</p>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  <div className="space-y-2">
                    {deliveries.map((delivery) => (
                      <Card key={delivery.id} className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => setSelectedDelivery(delivery)}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(delivery.status)}
                              <div>
                                <p className="font-medium">{delivery.eventType}</p>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(delivery.createdAt)}
                                  {delivery.deliveredAt && ` • Delivered: ${formatDate(delivery.deliveredAt)}`}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={getStatusColor(delivery.status)}>
                                {delivery.status}
                              </Badge>
                              {delivery.statusCode && (
                                <Badge variant="outline">
                                  {delivery.statusCode}
                                </Badge>
                              )}
                              <Badge variant="outline">
                                {delivery.attempts} attempts
                              </Badge>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {delivery.errorMessage && (
                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                              {delivery.errorMessage}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="configuration" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">Webhook ID</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded">{webhook.id}</code>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(webhook.id)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">URL</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded break-all">{webhook.url}</code>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(webhook.url)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <Badge variant={webhook.isActive ? 'default' : 'secondary'}>
                        {webhook.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    {webhook.organizationId && (
                      <div>
                        <p className="text-sm font-medium">Organization ID</p>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{webhook.organizationId}</code>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Retry Policy</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">Max Retries</p>
                      <p className="text-sm text-muted-foreground">{webhook.retryPolicy.maxRetries}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Backoff Multiplier</p>
                      <p className="text-sm text-muted-foreground">{webhook.retryPolicy.backoffMultiplier}x</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Max Backoff</p>
                      <p className="text-sm text-muted-foreground">{webhook.retryPolicy.maxBackoffSeconds}s</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Timestamps</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">Created</p>
                      <p className="text-sm text-muted-foreground">{formatDate(webhook.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-sm text-muted-foreground">{formatDate(webhook.updatedAt)}</p>
                    </div>
                    {webhook.lastDeliveryAt && (
                      <div>
                        <p className="text-sm font-medium">Last Delivery</p>
                        <p className="text-sm text-muted-foreground">{formatDate(webhook.lastDeliveryAt)}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Delivery Details Modal */}
      {selectedDelivery && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Delivery Details</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setSelectedDelivery(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Event Type</p>
                  <p className="text-sm text-muted-foreground">{selectedDelivery.eventType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedDelivery.status)}
                    <Badge variant={getStatusColor(selectedDelivery.status)}>
                      {selectedDelivery.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Attempts</p>
                  <p className="text-sm text-muted-foreground">{selectedDelivery.attempts}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status Code</p>
                  <p className="text-sm text-muted-foreground">{selectedDelivery.statusCode || 'N/A'}</p>
                </div>
              </div>

              {selectedDelivery.errorMessage && (
                <div>
                  <p className="text-sm font-medium">Error Message</p>
                  <div className="mt-1 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    {selectedDelivery.errorMessage}
                  </div>
                </div>
              )}

              {selectedDelivery.responseBody && (
                <div>
                  <p className="text-sm font-medium">Response Body</p>
                  <div className="mt-1 p-3 bg-muted rounded text-sm font-mono max-h-32 overflow-y-auto">
                    {selectedDelivery.responseBody}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}