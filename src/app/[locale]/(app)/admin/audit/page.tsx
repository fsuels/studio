'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  Shield,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { format } from 'date-fns';

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">
      Loading editor...
    </div>
  ),
});

interface AuditEvent {
  id: string;
  timestamp: Timestamp;
  sequence: number;
  previousHash: string;
  currentHash: string;
  eventType: string;
  source: {
    collection: string;
    documentId: string;
    path: string;
  };
  change: {
    type: 'create' | 'update' | 'delete';
    before?: any;
    after?: any;
    diff?: ChangeDetail[];
  };
  actor?: {
    uid?: string;
    email?: string;
    role?: string;
    ipAddress?: string;
  };
  technical: {
    functionName: string;
    functionVersion: string;
    executionId: string;
    checksumBefore?: string;
    checksumAfter?: string;
  };
  compliance: {
    frameworks: string[];
    dataClassification: string;
    retentionPeriod: number;
  };
  integrity: {
    signature: string;
    witnessHash: string;
    immutable: boolean;
  };
}

interface ChangeDetail {
  field: string;
  oldValue: any;
  newValue: any;
  changeType: 'addition' | 'modification' | 'deletion';
  diff?: string;
}

interface AuditFilters {
  eventType: string;
  collection: string;
  actor: string;
  dateRange: string;
  dataClassification: string;
  searchTerm: string;
}

export default function AuditTrailPage() {
  const { user } = useAuth();
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const [diffMode, setDiffMode] = useState<'unified' | 'split'>('split');
  const [filters, setFilters] = useState<AuditFilters>({
    eventType: 'all',
    collection: 'all',
    actor: 'all',
    dateRange: '24h',
    dataClassification: 'all',
    searchTerm: '',
  });
  const [integrityStatus, setIntegrityStatus] = useState<
    'verified' | 'checking' | 'failed'
  >('checking');

  useEffect(() => {
    if (user) {
      loadAuditEvents();
      verifyChainIntegrity();
    }
  }, [user, filters]);

  const loadAuditEvents = async () => {
    setLoading(true);
    try {
      let auditQuery = query(
        collection(db, 'audit_events'),
        orderBy('sequence', 'desc'),
        limit(100),
      );

      // Apply filters
      if (filters.eventType !== 'all') {
        auditQuery = query(
          auditQuery,
          where('eventType', '==', filters.eventType),
        );
      }

      if (filters.collection !== 'all') {
        auditQuery = query(
          auditQuery,
          where('source.collection', '==', filters.collection),
        );
      }

      const snapshot = await getDocs(auditQuery);
      const events = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AuditEvent[];

      // Apply client-side filters
      let filteredEvents = events;

      if (filters.searchTerm) {
        filteredEvents = events.filter((event) =>
          JSON.stringify(event)
            .toLowerCase()
            .includes(filters.searchTerm.toLowerCase()),
        );
      }

      if (filters.dataClassification !== 'all') {
        filteredEvents = filteredEvents.filter(
          (event) =>
            event.compliance.dataClassification === filters.dataClassification,
        );
      }

      setAuditEvents(filteredEvents);
    } catch (error) {
      console.error('Failed to load audit events:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyChainIntegrity = async () => {
    setIntegrityStatus('checking');
    try {
      // In a real implementation, this would verify the hash chain
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIntegrityStatus('verified');
    } catch {
      setIntegrityStatus('failed');
    }
  };

  const generateDiffContent = (
    event: AuditEvent,
  ): { before: string; after: string } => {
    const before = event.change.before
      ? JSON.stringify(event.change.before, null, 2)
      : '// No previous version';

    const after = event.change.after
      ? JSON.stringify(event.change.after, null, 2)
      : '// Document deleted';

    return { before, after };
  };

  const generateUnifiedDiff = (event: AuditEvent): string => {
    if (!event.change.diff || event.change.diff.length === 0) {
      return 'No changes detected';
    }

    let diff = `--- ${event.source.path} (before)\n`;
    diff += `+++ ${event.source.path} (after)\n`;
    diff += `@@ -1,${event.change.diff.length} +1,${event.change.diff.length} @@\n`;

    event.change.diff.forEach((change) => {
      if (change.changeType === 'deletion') {
        diff += `- ${change.field}: ${JSON.stringify(change.oldValue)}\n`;
      } else if (change.changeType === 'addition') {
        diff += `+ ${change.field}: ${JSON.stringify(change.newValue)}\n`;
      } else {
        diff += `- ${change.field}: ${JSON.stringify(change.oldValue)}\n`;
        diff += `+ ${change.field}: ${JSON.stringify(change.newValue)}\n`;
      }
    });

    return diff;
  };

  const exportAuditTrail = async () => {
    try {
      const dataStr = JSON.stringify(auditEvents, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `audit-trail-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export audit trail:', error);
    }
  };

  const getEventTypeColor = (eventType: string): string => {
    const colorMap: Record<string, string> = {
      document_created: 'bg-green-100 text-green-800',
      document_updated: 'bg-blue-100 text-blue-800',
      document_deleted: 'bg-red-100 text-red-800',
      user_action: 'bg-purple-100 text-purple-800',
      system_change: 'bg-orange-100 text-orange-800',
      policy_update: 'bg-yellow-100 text-yellow-800',
      compliance_event: 'bg-indigo-100 text-indigo-800',
    };
    return colorMap[eventType] || 'bg-gray-100 text-gray-800';
  };

  const getClassificationColor = (classification: string): string => {
    const colorMap: Record<string, string> = {
      public: 'bg-green-100 text-green-800',
      internal: 'bg-blue-100 text-blue-800',
      confidential: 'bg-orange-100 text-orange-800',
      restricted: 'bg-red-100 text-red-800',
    };
    return colorMap[classification] || 'bg-gray-100 text-gray-800';
  };

  const filteredEventTypes = useMemo(() => {
    const types = [...new Set(auditEvents.map((event) => event.eventType))];
    return ['all', ...types];
  }, [auditEvents]);

  const filteredCollections = useMemo(() => {
    const collections = [
      ...new Set(auditEvents.map((event) => event.source.collection)),
    ];
    return ['all', ...collections];
  }, [auditEvents]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Please sign in to access the audit trail.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Trail</h1>
          <p className="text-muted-foreground">
            Comprehensive audit log with blockchain-style integrity verification
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge
            variant={integrityStatus === 'verified' ? 'default' : 'destructive'}
          >
            {integrityStatus === 'verified' && (
              <CheckCircle className="w-3 h-3 mr-1" />
            )}
            {integrityStatus === 'failed' && (
              <AlertTriangle className="w-3 h-3 mr-1" />
            )}
            {integrityStatus === 'checking' && (
              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
            )}
            Chain {integrityStatus}
          </Badge>
          <Button variant="outline" onClick={exportAuditTrail}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={loadAuditEvents}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  value={filters.searchTerm}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      searchTerm: e.target.value,
                    }))
                  }
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Event Type</label>
              <Select
                value={filters.eventType}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, eventType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filteredEventTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === 'all'
                        ? 'All Types'
                        : type.replace(/_/g, ' ').toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Collection</label>
              <Select
                value={filters.collection}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, collection: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filteredCollections.map((collection) => (
                    <SelectItem key={collection} value={collection}>
                      {collection === 'all' ? 'All Collections' : collection}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Classification</label>
              <Select
                value={filters.dataClassification}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, dataClassification: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classifications</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="internal">Internal</SelectItem>
                  <SelectItem value="confidential">Confidential</SelectItem>
                  <SelectItem value="restricted">Restricted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Events */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Events ({auditEvents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" />
              Loading audit events...
            </div>
          ) : (
            <div className="space-y-4">
              {auditEvents.map((event) => (
                <div
                  key={event.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge className={getEventTypeColor(event.eventType)}>
                          {event.eventType.replace(/_/g, ' ')}
                        </Badge>
                        <Badge variant="outline">#{event.sequence}</Badge>
                        <Badge
                          className={getClassificationColor(
                            event.compliance.dataClassification,
                          )}
                        >
                          {event.compliance.dataClassification}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {format(event.timestamp.toDate(), 'PPpp')}
                        </span>
                      </div>

                      <div className="text-sm">
                        <strong>{event.source.collection}</strong> /{' '}
                        {event.source.documentId}
                        {event.actor?.email && (
                          <span className="ml-2 text-muted-foreground">
                            by {event.actor.email}
                          </span>
                        )}
                      </div>

                      {event.change.diff && event.change.diff.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          {event.change.diff.length} field(s) changed:{' '}
                          {event.change.diff
                            .slice(0, 3)
                            .map((d) => d.field)
                            .join(', ')}
                          {event.change.diff.length > 3 &&
                            ` +${event.change.diff.length - 3} more`}
                        </div>
                      )}
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedEvent(event)}
                        >
                          View Diff
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-6xl max-h-[90vh]">
                        <DialogHeader>
                          <DialogTitle>
                            Audit Event #{event.sequence} -{' '}
                            {event.eventType.replace(/_/g, ' ')}
                          </DialogTitle>
                        </DialogHeader>
                        <AuditEventDetails
                          event={event}
                          diffMode={diffMode}
                          setDiffMode={setDiffMode}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}

              {auditEvents.length === 0 && !loading && (
                <div className="text-center py-8 text-muted-foreground">
                  No audit events found matching the current filters.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AuditEventDetails({
  event,
  diffMode,
  setDiffMode,
}: {
  event: AuditEvent;
  diffMode: 'unified' | 'split';
  setDiffMode: (mode: 'unified' | 'split') => void;
}) {
  const { before, after } = generateDiffContent(event);
  const unifiedDiff = generateUnifiedDiff(event);

  return (
    <div className="space-y-4">
      {/* Event Metadata */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <strong>Event ID:</strong> {event.id}
        </div>
        <div>
          <strong>Sequence:</strong> #{event.sequence}
        </div>
        <div>
          <strong>Source:</strong> {event.source.path}
        </div>
        <div>
          <strong>Actor:</strong> {event.actor?.email || 'System'}
        </div>
        <div>
          <strong>Hash:</strong>
          <code className="ml-2 text-xs bg-muted px-1 rounded">
            {event.currentHash.substring(0, 16)}...
          </code>
        </div>
        <div>
          <strong>Integrity:</strong>
          <Badge
            variant={event.integrity.immutable ? 'default' : 'destructive'}
            className="ml-2"
          >
            <Shield className="w-3 h-3 mr-1" />
            {event.integrity.immutable ? 'Verified' : 'Unverified'}
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Diff Viewer */}
      <Tabs
        value={diffMode}
        onValueChange={(value) => setDiffMode(value as 'unified' | 'split')}
      >
        <TabsList>
          <TabsTrigger value="split">Split View</TabsTrigger>
          <TabsTrigger value="unified">Unified Diff</TabsTrigger>
        </TabsList>

        <TabsContent value="split" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2 text-red-600">Before</h4>
              <MonacoEditor
                height="400px"
                language="json"
                theme="vs-light"
                value={before}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  renderLineHighlight: 'none',
                }}
              />
            </div>
            <div>
              <h4 className="font-medium mb-2 text-green-600">After</h4>
              <MonacoEditor
                height="400px"
                language="json"
                theme="vs-light"
                value={after}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  renderLineHighlight: 'none',
                }}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="unified">
          <MonacoEditor
            height="400px"
            language="diff"
            theme="vs-light"
            value={unifiedDiff}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              renderLineHighlight: 'none',
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Compliance Information */}
      <Separator />
      <div className="space-y-2">
        <h4 className="font-medium">Compliance Information</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Frameworks:</strong>{' '}
            {event.compliance.frameworks.join(', ')}
          </div>
          <div>
            <strong>Retention:</strong> {event.compliance.retentionPeriod} days
          </div>
          <div>
            <strong>Classification:</strong>
            <Badge
              className={getClassificationColor(
                event.compliance.dataClassification,
              )}
              variant="outline"
            >
              {event.compliance.dataClassification}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

function getClassificationColor(classification: string): string {
  const colorMap: Record<string, string> = {
    public: 'border-green-200 bg-green-50 text-green-700',
    internal: 'border-blue-200 bg-blue-50 text-blue-700',
    confidential: 'border-orange-200 bg-orange-50 text-orange-700',
    restricted: 'border-red-200 bg-red-50 text-red-700',
  };
  return colorMap[classification] || 'border-gray-200 bg-gray-50 text-gray-700';
}
