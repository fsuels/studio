// src/app/[locale]/(app)/dashboard/audit-trail/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Shield,
  Search,
  Download,
  Calendar,
  User,
  FileText,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { auditService } from '@/services/firebase-audit-service';
import { useToast } from '@/hooks/use-toast';

interface AuditEvent {
  id: string;
  eventType: string;
  userId: string;
  timestamp: any;
  metadata: Record<string, any>;
  hash?: string;
}

export default function UserAuditTrailPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const [isVerifying, setIsVerifying] = useState(false);
  const [integrityStatus, setIntegrityStatus] = useState<boolean | null>(null);

  useEffect(() => {
    if (user) {
      fetchAuditTrail();
    }
  }, [user]);

  const fetchAuditTrail = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const auditEvents = await auditService.getUserAuditTrail(user.uid, 100);
      setEvents(auditEvents);
    } catch (error) {
      console.error('Error fetching audit trail:', error);
      toast({
        title: 'Error',
        description: 'Failed to load audit trail',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyIntegrity = async () => {
    if (events.length === 0) return;

    setIsVerifying(true);
    try {
      const isValid = await auditService.verifyIntegrity(events);
      setIntegrityStatus(isValid);

      toast({
        title: isValid ? 'Integrity Verified' : 'Integrity Check Failed',
        description: isValid
          ? 'Your audit trail is cryptographically secure and unmodified.'
          : 'Potential tampering detected in audit trail.',
        variant: isValid ? 'default' : 'destructive',
      });
    } catch (error) {
      console.error('Error verifying integrity:', error);
      toast({
        title: 'Verification Failed',
        description: 'Could not verify audit trail integrity',
        variant: 'destructive',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleExportAuditTrail = async () => {
    if (!user) return;

    try {
      const exportData = await auditService.exportUserData(user.uid);
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-trail-${user.uid}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Export Complete',
        description: 'Audit trail exported successfully',
      });
    } catch (error) {
      console.error('Error exporting audit trail:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export audit trail',
        variant: 'destructive',
      });
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'USER_LOGIN':
      case 'USER_LOGOUT':
      case 'USER_REGISTRATION':
        return <User className="h-4 w-4" />;
      case 'DOCUMENT_CREATED':
      case 'DOCUMENT_UPDATED':
      case 'DATA_ACCESS':
        return <FileText className="h-4 w-4" />;
      case 'POLICY_ACCEPTED':
      case 'POLICY_VIEWED':
        return <Shield className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case 'USER_LOGIN':
        return 'bg-green-100 text-green-800';
      case 'USER_LOGOUT':
        return 'bg-yellow-100 text-yellow-800';
      case 'USER_REGISTRATION':
        return 'bg-blue-100 text-blue-800';
      case 'DOCUMENT_CREATED':
        return 'bg-purple-100 text-purple-800';
      case 'DOCUMENT_UPDATED':
        return 'bg-orange-100 text-orange-800';
      case 'DATA_ACCESS':
        return 'bg-gray-100 text-gray-800';
      case 'POLICY_ACCEPTED':
      case 'POLICY_VIEWED':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'Unknown';

    let date: Date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      date = new Date(timestamp);
    }

    return date.toLocaleString();
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchTerm === '' ||
      event.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      JSON.stringify(event.metadata)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesType =
      eventTypeFilter === 'all' || event.eventType === eventTypeFilter;

    return matchesSearch && matchesType;
  });

  const uniqueEventTypes = Array.from(new Set(events.map((e) => e.eventType)));

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-blue-600" />
          <h1 className="text-3xl font-bold">Your Audit Trail</h1>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleVerifyIntegrity}
            disabled={isVerifying || events.length === 0}
          >
            {isVerifying ? 'Verifying...' : 'Verify Integrity'}
          </Button>
          <Button
            variant="outline"
            onClick={handleExportAuditTrail}
            disabled={events.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Integrity Status */}
      {integrityStatus !== null && (
        <Card
          className={`border-l-4 ${integrityStatus ? 'border-green-500' : 'border-red-500'}`}
        >
          <CardContent className="flex items-center space-x-2 pt-4">
            {integrityStatus ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <span
              className={`font-medium ${integrityStatus ? 'text-green-700' : 'text-red-700'}`}
            >
              {integrityStatus
                ? 'Audit trail integrity verified - all events are authentic and unmodified'
                : 'Integrity verification failed - potential tampering detected'}
            </span>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Event Type</Label>
              <Select
                value={eventTypeFilter}
                onValueChange={setEventTypeFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All events" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  {uniqueEventTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type
                        .replace(/_/g, ' ')
                        .toLowerCase()
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Activity Timeline</span>
          </CardTitle>
          <CardDescription>
            Complete record of your account activity ({filteredEvents.length}{' '}
            events)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No events found matching your filters.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((event, index) => (
                <div
                  key={event.id || index}
                  className="flex items-start space-x-4 p-4 border rounded-lg"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getEventIcon(event.eventType)}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge className={getEventTypeColor(event.eventType)}>
                        {event.eventType
                          .replace(/_/g, ' ')
                          .toLowerCase()
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatTimestamp(event.timestamp)}
                      </span>
                    </div>

                    {event.metadata &&
                      Object.keys(event.metadata).length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          <details>
                            <summary className="cursor-pointer hover:text-foreground">
                              View details
                            </summary>
                            <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-x-auto">
                              {JSON.stringify(event.metadata, null, 2)}
                            </pre>
                          </details>
                        </div>
                      )}

                    {event.hash && (
                      <div className="text-xs text-muted-foreground font-mono">
                        Hash: {event.hash.substring(0, 16)}...
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">About Your Audit Trail</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong>What is this?</strong> Your audit trail is a complete,
            tamper-proof record of all activities on your account.
          </p>
          <p>
            <strong>Security:</strong> Each event is cryptographically signed
            and linked to prevent modification.
          </p>
          <p>
            <strong>Privacy:</strong> Only you can see your audit trail.
            Administrators cannot modify these records.
          </p>
          <p>
            <strong>Retention:</strong> Audit events are retained for 7 years
            for legal compliance purposes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
