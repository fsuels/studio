'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Globe, AlertCircle, CheckCircle2 } from 'lucide-react';

interface WebhookRegistrationModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const WEBHOOK_EVENTS = [
  {
    id: 'document.created',
    label: 'Document Created',
    description: 'When a new document is created',
  },
  {
    id: 'document.updated',
    label: 'Document Updated',
    description: 'When a document is modified',
  },
  {
    id: 'document.signed',
    label: 'Document Signed',
    description: 'When a document is electronically signed',
  },
  {
    id: 'document.completed',
    label: 'Document Completed',
    description: 'When a document workflow is finished',
  },
  {
    id: 'document.deleted',
    label: 'Document Deleted',
    description: 'When a document is deleted',
  },
  {
    id: 'user.created',
    label: 'User Created',
    description: 'When a new user account is created',
  },
  {
    id: 'user.updated',
    label: 'User Updated',
    description: 'When user information is updated',
  },
  {
    id: 'payment.succeeded',
    label: 'Payment Succeeded',
    description: 'When a payment is successful',
  },
  {
    id: 'payment.failed',
    label: 'Payment Failed',
    description: 'When a payment fails',
  },
  {
    id: 'subscription.created',
    label: 'Subscription Created',
    description: 'When a new subscription is created',
  },
  {
    id: 'subscription.updated',
    label: 'Subscription Updated',
    description: 'When subscription is modified',
  },
  {
    id: 'subscription.cancelled',
    label: 'Subscription Cancelled',
    description: 'When subscription is cancelled',
  },
  {
    id: 'compliance.audit',
    label: 'Compliance Audit',
    description: 'When compliance events occur',
  },
  {
    id: 'template.created',
    label: 'Template Created',
    description: 'When a new template is created',
  },
  {
    id: 'template.updated',
    label: 'Template Updated',
    description: 'When a template is modified',
  },
];

export function WebhookRegistrationModal({
  onClose,
  onSuccess,
}: WebhookRegistrationModalProps) {
  const [url, setUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [organizationId, setOrganizationId] = useState('');
  const [maxRetries, setMaxRetries] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlValidation, setUrlValidation] = useState<
    'idle' | 'validating' | 'valid' | 'invalid'
  >('idle');

  const validateUrl = async (webhookUrl: string) => {
    if (!webhookUrl) {
      setUrlValidation('idle');
      return;
    }

    if (!webhookUrl.startsWith('https://')) {
      setUrlValidation('invalid');
      return;
    }

    setUrlValidation('validating');

    try {
      // Basic URL validation
      new URL(webhookUrl);

      // Additional validation could be added here (e.g., DNS lookup)
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate validation delay

      setUrlValidation('valid');
    } catch {
      setUrlValidation('invalid');
    }
  };

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    setError(null);

    // Debounce URL validation
    const timeoutId = setTimeout(() => {
      validateUrl(newUrl);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleEventToggle = (eventId: string) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((e) => e !== eventId)
        : [...prev, eventId],
    );
  };

  const handleSelectAllEvents = () => {
    if (selectedEvents.length === WEBHOOK_EVENTS.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(WEBHOOK_EVENTS.map((e) => e.id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url || selectedEvents.length === 0) {
      setError('Please provide a webhook URL and select at least one event');
      return;
    }

    if (urlValidation !== 'valid') {
      setError('Please provide a valid HTTPS URL');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          events: selectedEvents,
          organizationId: organizationId || undefined,
          retryPolicy: {
            maxRetries,
            backoffMultiplier: 2,
            maxBackoffSeconds: 300,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create webhook');
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Register New Webhook
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-destructive font-medium">Error</p>
                  <p className="text-destructive/80 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Webhook URL */}
            <div className="space-y-2">
              <Label htmlFor="webhook-url">Webhook URL *</Label>
              <div className="relative">
                <Input
                  id="webhook-url"
                  type="url"
                  placeholder="https://your-app.com/webhook"
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="pr-10"
                  required
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {urlValidation === 'validating' && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  )}
                  {urlValidation === 'valid' && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                  {urlValidation === 'invalid' && (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Must be a valid HTTPS URL that can receive POST requests
              </p>
            </div>

            {/* Organization ID */}
            <div className="space-y-2">
              <Label htmlFor="organization-id">
                Organization ID (Optional)
              </Label>
              <Input
                id="organization-id"
                placeholder="org_12345..."
                value={organizationId}
                onChange={(e) => setOrganizationId(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Filter events to specific organization
              </p>
            </div>

            {/* Events Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Select Events *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAllEvents}
                >
                  {selectedEvents.length === WEBHOOK_EVENTS.length
                    ? 'Deselect All'
                    : 'Select All'}
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto border rounded-lg p-3">
                {WEBHOOK_EVENTS.map((event) => (
                  <div key={event.id} className="flex items-start space-x-3">
                    <Checkbox
                      id={event.id}
                      checked={selectedEvents.includes(event.id)}
                      onCheckedChange={() => handleEventToggle(event.id)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor={event.id}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {event.label}
                      </label>
                      <p className="text-xs text-muted-foreground">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {selectedEvents.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedEvents.map((eventId) => {
                    const event = WEBHOOK_EVENTS.find((e) => e.id === eventId);
                    return (
                      <Badge
                        key={eventId}
                        variant="secondary"
                        className="text-xs"
                      >
                        {event?.label}
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Retry Configuration */}
            <div className="space-y-2">
              <Label htmlFor="max-retries">Max Retries</Label>
              <Input
                id="max-retries"
                type="number"
                min="0"
                max="10"
                value={maxRetries}
                onChange={(e) => setMaxRetries(parseInt(e.target.value) || 0)}
              />
              <p className="text-sm text-muted-foreground">
                Number of retry attempts for failed deliveries (0-10)
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4">
              <Button
                type="submit"
                disabled={
                  loading ||
                  urlValidation !== 'valid' ||
                  selectedEvents.length === 0
                }
                className="flex-1"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Webhook...
                  </>
                ) : (
                  'Create Webhook'
                )}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
