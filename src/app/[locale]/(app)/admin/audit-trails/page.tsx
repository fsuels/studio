// src/app/[locale]/(app)/admin/audit-trails/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Search, 
  Download, 
  Calendar, 
  Users, 
  FileText, 
  AlertCircle, 
  CheckCircle,
  BarChart3,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AuditEvent {
  id: string;
  eventType: string;
  userId: string;
  timestamp: string;
  metadata: Record<string, any>;
  hash?: string;
}

interface AuditStats {
  totalEvents: number;
  eventTypes: [string, number][];
  topUsers: [string, number][];
  dateRange: {
    start: string | null;
    end: string | null;
  };
}

interface AuditResponse {
  events: AuditEvent[];
  pagination: {
    hasMore: boolean;
    lastDoc: string | null;
    count: number;
  };
  stats: AuditStats;
  filters: any;
}

export default function AdminAuditTrailsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [data, setData] = useState<AuditResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchUserId, setSearchUserId] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  useEffect(() => {
    fetchAuditTrails();
  }, []);

  const fetchAuditTrails = async () => {
    try {
      setIsLoading(true);
      
      const params = new URLSearchParams();
      if (searchUserId) params.append('userId', searchUserId);
      if (eventTypeFilter !== 'all') params.append('eventType', eventTypeFilter);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      params.append('limit', '100');

      const response = await fetch(`/api/admin/audit-trails?${params}`);
      
      if (response.ok) {
        const auditData = await response.json();
        setData(auditData);
      } else if (response.status === 403) {
        toast({
          title: 'Access Denied',
          description: 'You do not have admin privileges to view audit trails',
          variant: 'destructive'
        });
      } else {
        throw new Error('Failed to fetch audit trails');
      }
    } catch (error) {
      console.error('Error fetching audit trails:', error);
      toast({
        title: 'Error',
        description: 'Failed to load audit trails',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyIntegrity = async () => {
    setIsVerifying(true);
    try {
      const response = await fetch('/api/admin/audit-trails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'verify_integrity',
          userId: searchUserId || undefined,
          limit: 1000
        })
      });

      if (response.ok) {
        const result = await response.json();
        setVerificationResult(result);
        
        toast({
          title: result.isValid ? 'Integrity Verified' : 'Integrity Issues Found',
          description: `Verified ${result.verifiedEvents}/${result.totalEvents} events. ${result.integrityIssues} issues found.`,
          variant: result.isValid ? 'default' : 'destructive'
        });
      } else {
        throw new Error('Verification failed');
      }
    } catch (error) {
      console.error('Error verifying integrity:', error);
      toast({
        title: 'Verification Failed',
        description: 'Could not verify audit trail integrity',
        variant: 'destructive'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      const response = await fetch('/api/admin/audit-trails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'generate_compliance_report',
          startDate: startDate || undefined,
          endDate: endDate || undefined
        })
      });

      if (response.ok) {
        const report = await response.json();
        
        // Download the report
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `compliance-report-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({
          title: 'Report Generated',
          description: 'Compliance report has been downloaded'
        });
      } else {
        throw new Error('Report generation failed');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: 'Report Failed',
        description: 'Could not generate compliance report',
        variant: 'destructive'
      });
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
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
          <Shield className="h-6 w-6 text-red-600" />
          <h1 className="text-3xl font-bold">Admin Audit Trails</h1>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleVerifyIntegrity}
            disabled={isVerifying}
          >
            {isVerifying ? 'Verifying...' : 'Verify Integrity'}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleGenerateReport}
          >
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button onClick={fetchAuditTrails}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Verification Status */}
      {verificationResult && (
        <Card className={`border-l-4 ${verificationResult.isValid ? 'border-green-500' : 'border-red-500'}`}>
          <CardContent className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-2">
              {verificationResult.isValid ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <span className={`font-medium ${verificationResult.isValid ? 'text-green-700' : 'text-red-700'}`}>
                {verificationResult.isValid 
                  ? `Integrity verified for ${verificationResult.verifiedEvents} events`
                  : `${verificationResult.integrityIssues} integrity issues found`
                }
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              Verified at {formatTimestamp(verificationResult.verificationDate)}
            </span>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filter Events</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="userId">User ID</Label>
                  <Input
                    id="userId"
                    placeholder="Filter by user ID..."
                    value={searchUserId}
                    onChange={(e) => setSearchUserId(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Event Type</Label>
                  <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All events" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Events</SelectItem>
                      <SelectItem value="USER_LOGIN">User Login</SelectItem>
                      <SelectItem value="USER_LOGOUT">User Logout</SelectItem>
                      <SelectItem value="USER_REGISTRATION">User Registration</SelectItem>
                      <SelectItem value="DOCUMENT_CREATED">Document Created</SelectItem>
                      <SelectItem value="DOCUMENT_UPDATED">Document Updated</SelectItem>
                      <SelectItem value="DATA_ACCESS">Data Access</SelectItem>
                      <SelectItem value="POLICY_ACCEPTED">Policy Accepted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              
              <Button onClick={fetchAuditTrails} className="w-full md:w-auto">
                <Search className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </CardContent>
          </Card>

          {/* Events List */}
          <Card>
            <CardHeader>
              <CardTitle>Audit Events</CardTitle>
              <CardDescription>
                {data?.events.length || 0} events found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!data?.events.length ? (
                <div className="text-center py-8 text-muted-foreground">
                  No events found matching your filters.
                </div>
              ) : (
                <div className="space-y-3">
                  {data.events.map((event) => (
                    <div key={event.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge className={getEventTypeColor(event.eventType)}>
                              {event.eventType.replace(/_/g, ' ')}
                            </Badge>
                            <span className="text-sm font-mono text-muted-foreground">
                              User: {event.userId.substring(0, 8)}...
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {formatTimestamp(event.timestamp)}
                          </span>
                        </div>
                        
                        {event.metadata && Object.keys(event.metadata).length > 0 && (
                          <details className="text-sm text-muted-foreground">
                            <summary className="cursor-pointer hover:text-foreground">
                              View metadata
                            </summary>
                            <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-x-auto">
                              {JSON.stringify(event.metadata, null, 2)}
                            </pre>
                          </details>
                        )}
                        
                        {event.hash && (
                          <div className="text-xs text-muted-foreground font-mono">
                            Hash: {event.hash}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          {data?.stats && (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Event Types Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Event Types</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.stats.eventTypes.map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-sm">{type.replace(/_/g, ' ')}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-gray-200 rounded">
                            <div 
                              className="h-2 bg-blue-500 rounded" 
                              style={{ 
                                width: `${(count / (data.stats.eventTypes[0]?.[1] || 1)) * 100}%` 
                              }}
                            />
                          </div>
                          <span className="text-sm font-semibold">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Users */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Most Active Users</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.stats.topUsers.map(([userId, count]) => (
                      <div key={userId} className="flex items-center justify-between">
                        <span className="text-sm font-mono">{userId.substring(0, 16)}...</span>
                        <span className="text-sm font-semibold">{count} events</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Summary Stats */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{data.stats.totalEvents}</div>
                      <div className="text-sm text-muted-foreground">Total Events</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{data.stats.eventTypes.length}</div>
                      <div className="text-sm text-muted-foreground">Event Types</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{data.stats.topUsers.length}</div>
                      <div className="text-sm text-muted-foreground">Active Users</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}