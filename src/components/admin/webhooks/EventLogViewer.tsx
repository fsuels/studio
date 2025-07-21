'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  RefreshCw,
  Search,
  Filter,
  Download,
  Calendar,
  Globe,
  User,
  FileText,
} from 'lucide-react';

interface SystemEvent {
  id: string;
  type: string;
  timestamp: string;
  userId?: string;
  organizationId?: string;
  resource: string;
  action: string;
  details: Record<string, any>;
  metadata: {
    ip?: string;
    userAgent?: string;
    source?: string;
  };
  severity: 'info' | 'warning' | 'error' | 'success';
}

const EVENT_TYPES = [
  'document.created',
  'document.updated',
  'document.signed',
  'document.completed',
  'document.deleted',
  'user.created',
  'user.updated',
  'payment.succeeded',
  'payment.failed',
  'subscription.created',
  'subscription.updated',
  'subscription.cancelled',
  'compliance.audit',
  'template.created',
  'template.updated',
];

const SEVERITY_COLORS = {
  info: 'default',
  success: 'default',
  warning: 'secondary',
  error: 'destructive',
} as const;

export function EventLogViewer() {
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('24h');

  // Mock data for demonstration - in a real app, this would come from your audit system
  const mockEvents: SystemEvent[] = [
    {
      id: 'evt_1',
      type: 'document.created',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      userId: 'user_123',
      resource: 'document',
      action: 'create',
      details: {
        documentId: 'doc_abc123',
        templateType: 'bill-of-sale-vehicle',
        title: 'Vehicle Bill of Sale',
      },
      metadata: {
        ip: '192.168.1.100',
        userAgent: 'Mozilla/5.0...',
        source: 'web',
      },
      severity: 'success',
    },
    {
      id: 'evt_2',
      type: 'payment.succeeded',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
      userId: 'user_456',
      resource: 'payment',
      action: 'process',
      details: {
        amount: 29.99,
        currency: 'USD',
        paymentMethod: 'stripe',
        subscriptionId: 'sub_789',
      },
      metadata: {
        ip: '10.0.0.45',
        source: 'api',
      },
      severity: 'success',
    },
    {
      id: 'evt_3',
      type: 'user.created',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      resource: 'user',
      action: 'register',
      details: {
        email: 'user@example.com',
        registrationMethod: 'email',
        plan: 'free',
      },
      metadata: {
        ip: '203.0.113.45',
        userAgent: 'Mozilla/5.0...',
        source: 'web',
      },
      severity: 'info',
    },
    {
      id: 'evt_4',
      type: 'compliance.audit',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
      userId: 'system',
      organizationId: 'org_legal123',
      resource: 'compliance',
      action: 'audit',
      details: {
        auditType: 'gdpr_data_access',
        result: 'passed',
        documentsChecked: 156,
        issuesFound: 0,
      },
      metadata: {
        source: 'scheduled_job',
      },
      severity: 'success',
    },
    {
      id: 'evt_5',
      type: 'payment.failed',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
      userId: 'user_789',
      resource: 'payment',
      action: 'process',
      details: {
        amount: 49.99,
        currency: 'USD',
        errorCode: 'card_declined',
        paymentMethod: 'stripe',
      },
      metadata: {
        ip: '198.51.100.12',
        source: 'api',
      },
      severity: 'error',
    },
  ];

  useEffect(() => {
    fetchEvents();
  }, [timeRange, selectedEventType, selectedSeverity]);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In a real implementation, this would be an API call to your audit system:
      // const response = await fetch(`/api/admin/events?timeRange=${timeRange}&type=${selectedEventType}&severity=${selectedSeverity}`);
      // const data = await response.json();
      // setEvents(data.events);

      setEvents(mockEvents);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchTerm === '' ||
      event.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      JSON.stringify(event.details)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesType =
      selectedEventType === 'all' || event.type === selectedEventType;
    const matchesSeverity =
      selectedSeverity === 'all' || event.severity === selectedSeverity;

    return matchesSearch && matchesType && matchesSeverity;
  });

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;

    return date.toLocaleString();
  };

  const getEventIcon = (type: string) => {
    if (type.startsWith('document.')) return <FileText className="h-4 w-4" />;
    if (type.startsWith('user.')) return <User className="h-4 w-4" />;
    if (type.startsWith('payment.') || type.startsWith('subscription.'))
      return <Globe className="h-4 w-4" />;
    return <Calendar className="h-4 w-4" />;
  };

  const exportEvents = () => {
    const csvContent = [
      [
        'Timestamp',
        'Type',
        'Resource',
        'Action',
        'User ID',
        'Severity',
        'Details',
      ].join(','),
      ...filteredEvents.map((event) =>
        [
          event.timestamp,
          event.type,
          event.resource,
          event.action,
          event.userId || '',
          event.severity,
          JSON.stringify(event.details).replace(/,/g, ';'),
        ].join(','),
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `event-log-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Event Log Viewer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select
                value={selectedEventType}
                onValueChange={setSelectedEventType}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {EVENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedSeverity}
                onValueChange={setSelectedSeverity}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>

              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="24h">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={fetchEvents}
                disabled={loading}
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                />
              </Button>

              <Button variant="outline" onClick={exportEvents}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Events ({filteredEvents.length})</CardTitle>
            {error && <Badge variant="destructive">Error: {error}</Badge>}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No events found matching your criteria
            </div>
          ) : (
            <div className="space-y-2">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">{getEventIcon(event.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">{event.type}</p>
                          <Badge
                            variant={SEVERITY_COLORS[event.severity]}
                            className="text-xs"
                          >
                            {event.severity}
                          </Badge>
                          {event.organizationId && (
                            <Badge variant="outline" className="text-xs">
                              {event.organizationId}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {event.action} on {event.resource}
                          {event.userId && ` by ${event.userId}`}
                        </p>

                        {/* Event Details */}
                        {Object.keys(event.details).length > 0 && (
                          <div className="bg-muted/30 rounded p-2 mt-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                              {Object.entries(event.details)
                                .slice(0, 6)
                                .map(([key, value]) => (
                                  <div key={key}>
                                    <span className="font-medium">{key}:</span>{' '}
                                    <span className="text-muted-foreground">
                                      {typeof value === 'object'
                                        ? JSON.stringify(value)
                                        : String(value)}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Metadata */}
                        {event.metadata &&
                          Object.keys(event.metadata).length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {event.metadata.ip && (
                                <Badge variant="outline" className="text-xs">
                                  IP: {event.metadata.ip}
                                </Badge>
                              )}
                              {event.metadata.source && (
                                <Badge variant="outline" className="text-xs">
                                  Source: {event.metadata.source}
                                </Badge>
                              )}
                            </div>
                          )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {formatTimestamp(event.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
