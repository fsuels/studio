'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Play,
  Pause,
  FastForward,
  Rewind,
  RotateCcw,
  Search,
  Filter,
  Download,
  Eye,
  Clock,
  DollarSign,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  FileText,
  MessageSquare,
  User,
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  RefreshCw,
  ExternalLink,
  Tag,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SessionReplay {
  id: string;
  sessionId: string;
  userId?: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  userAgent: string;
  events: SessionEvent[];
  metadata: {
    documentTypes?: string[];
    completedSteps?: string[];
    errors?: number;
    supportTicketId?: string;
  };
  tags: string[];
  isActive: boolean;
}

interface SessionEvent {
  id: string;
  sessionId: string;
  timestamp: number;
  type: 'click' | 'scroll' | 'input' | 'navigation' | 'error' | 'form_submit' | 'document_action';
  data: {
    element?: string;
    url?: string;
    value?: string;
    coordinates?: { x: number; y: number };
    viewport?: { width: number; height: number };
    documentType?: string;
    errorMessage?: string;
    metadata?: Record<string, any>;
  };
}

interface RefundRequest {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'processed' | 'failed' | 'rejected';
  requestedBy: {
    type: string;
    name: string;
  };
  createdAt: number;
  auditTrail: Array<{
    timestamp: number;
    action: string;
    actor: { name: string };
    details: string;
  }>;
  metadata: {
    autoApprovalRules?: string[];
    internalNotes?: string;
    customerNotes?: string;
  };
}

export default function SupportToolkitDashboard() {
  const [activeTab, setActiveTab] = useState<'sessions' | 'refunds' | 'analytics'>('sessions');
  const [sessions, setSessions] = useState<SessionReplay[]>([]);
  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [selectedSession, setSelectedSession] = useState<SessionReplay | null>(null);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCriteria, setFilterCriteria] = useState({
    hasErrors: false,
    documentType: '',
    dateRange: '7d'
  });
  const [refundForm, setRefundForm] = useState({
    orderId: '',
    amount: '',
    reason: 'customer_request',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load sessions and refunds
  useEffect(() => {
    loadSessions();
    loadRefunds();
  }, [filterCriteria]);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterCriteria.hasErrors) params.append('hasErrors', 'true');
      if (filterCriteria.documentType) params.append('documentTypes', filterCriteria.documentType);
      if (filterCriteria.dateRange) {
        const daysAgo = parseInt(filterCriteria.dateRange.replace('d', ''));
        const startDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
        params.append('startDate', startDate.toISOString());
      }
      params.append('limit', '50');

      const response = await fetch(`/api/support-toolkit/session-replay?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setSessions(data.data.sessions);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load session replays',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load session replays',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadRefunds = async () => {
    try {
      const response = await fetch('/api/support-toolkit/refunds?pending=true');
      const data = await response.json();
      
      if (data.success) {
        setRefunds(data.data.refunds);
      }
    } catch (error) {
      console.error('Failed to load refunds:', error);
    }
  };

  const createRefund = async () => {
    if (!refundForm.orderId || !refundForm.amount) {
      toast({
        title: 'Validation Error',
        description: 'Order ID and amount are required',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await fetch('/api/support-toolkit/refunds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_refund',
          orderId: refundForm.orderId,
          amount: parseFloat(refundForm.amount),
          reason: refundForm.reason,
          agentId: 'current_agent', // This would come from auth context
          agentName: 'Support Agent',
          notes: refundForm.notes
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Success',
          description: data.message,
        });
        setRefundForm({ orderId: '', amount: '', reason: 'customer_request', notes: '' });
        loadRefunds();
      } else {
        toast({
          title: 'Error',
          description: data.error,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create refund',
        variant: 'destructive'
      });
    }
  };

  const approveRefund = async (refundId: string) => {
    try {
      const response = await fetch('/api/support-toolkit/refunds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve_refund',
          refundId,
          agentId: 'current_agent',
          agentName: 'Support Agent'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Refund approved and processed',
        });
        loadRefunds();
      } else {
        toast({
          title: 'Error',
          description: data.error,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve refund',
        variant: 'destructive'
      });
    }
  };

  const linkSessionToTicket = async (sessionId: string, ticketId: string) => {
    try {
      const response = await fetch('/api/support-toolkit/session-replay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'link_to_ticket',
          sessionId,
          ticketId
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Session linked to support ticket',
        });
        loadSessions();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to link session',
        variant: 'destructive'
      });
    }
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'processed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'rejected': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSessions = sessions.filter(session => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        session.sessionId.toLowerCase().includes(query) ||
        session.userId?.toLowerCase().includes(query) ||
        session.metadata.documentTypes?.some(type => type.toLowerCase().includes(query))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Toolkit</h1>
          <p className="text-gray-600">Session replay, refund management, and faster issue resolution</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadSessions} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sessions.filter(s => s.isActive).length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Error Sessions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sessions.filter(s => s.metadata.errors && s.metadata.errors > 0).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Refunds</p>
                <p className="text-2xl font-bold text-gray-900">
                  {refunds.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Refunds</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${refunds
                    .filter(r => Date.now() - r.createdAt < 24 * 60 * 60 * 1000)
                    .reduce((sum, r) => sum + r.amount, 0)
                    .toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sessions">Session Replays ({sessions.length})</TabsTrigger>
          <TabsTrigger value="refunds">Refund Management ({refunds.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Session Replays Tab */}
        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Session Replays
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search sessions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Session ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Errors</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-mono text-sm">
                        {session.sessionId.slice(0, 12)}...
                      </TableCell>
                      <TableCell>
                        {session.userId ? (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {session.userId.slice(0, 8)}...
                          </div>
                        ) : (
                          <span className="text-gray-400">Anonymous</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {session.duration ? formatDuration(session.duration) : 'Active'}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {session.metadata.documentTypes?.slice(0, 2).map((type) => (
                            <Badge key={type} variant="outline" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                          {(session.metadata.documentTypes?.length || 0) > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{(session.metadata.documentTypes?.length || 0) - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {session.metadata.errors ? (
                          <Badge className="bg-red-100 text-red-800" variant="outline">
                            {session.metadata.errors} errors
                          </Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-800" variant="outline">
                            No errors
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(session.startTime)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedSession(session)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>Session Replay - {session.sessionId}</DialogTitle>
                              </DialogHeader>
                              <SessionReplayViewer session={session} />
                            </DialogContent>
                          </Dialog>
                          {session.metadata.supportTicketId ? (
                            <Badge variant="outline" className="text-xs">
                              Linked
                            </Badge>
                          ) : (
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Refunds Tab */}
        <TabsContent value="refunds" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Create Refund Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Create Refund
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="orderId">Order ID</Label>
                  <Input
                    id="orderId"
                    value={refundForm.orderId}
                    onChange={(e) => setRefundForm(prev => ({ ...prev, orderId: e.target.value }))}
                    placeholder="order_123..."
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={refundForm.amount}
                    onChange={(e) => setRefundForm(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="reason">Reason</Label>
                  <Select value={refundForm.reason} onValueChange={(value) => setRefundForm(prev => ({ ...prev, reason: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer_request">Customer Request</SelectItem>
                      <SelectItem value="technical_issue">Technical Issue</SelectItem>
                      <SelectItem value="billing_error">Billing Error</SelectItem>
                      <SelectItem value="fraud_protection">Fraud Protection</SelectItem>
                      <SelectItem value="goodwill">Goodwill</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="notes">Internal Notes</Label>
                  <Textarea
                    id="notes"
                    value={refundForm.notes}
                    onChange={(e) => setRefundForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Internal notes for this refund..."
                  />
                </div>
                <Button onClick={createRefund} className="w-full">
                  Create Refund
                </Button>
              </CardContent>
            </Card>

            {/* Pending Refunds */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Pending Refunds
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Requested By</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {refunds.filter(r => r.status === 'pending').map((refund) => (
                        <TableRow key={refund.id}>
                          <TableCell className="font-mono text-sm">{refund.orderId}</TableCell>
                          <TableCell className="font-semibold">${refund.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {refund.reason.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>{refund.requestedBy.name}</TableCell>
                          <TableCell>{formatDate(refund.createdAt)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => approveRefund(refund.id)}>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Session Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Sessions</span>
                    <span className="text-lg font-bold">{sessions.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Error Rate</span>
                    <span className="text-lg font-bold text-red-600">
                      {((sessions.filter(s => s.metadata.errors && s.metadata.errors > 0).length / sessions.length) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Avg Duration</span>
                    <span className="text-lg font-bold">
                      {formatDuration(sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / sessions.length)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Refund Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Refunds</span>
                    <span className="text-lg font-bold">{refunds.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Amount</span>
                    <span className="text-lg font-bold">
                      ${refunds.reduce((sum, r) => sum + r.amount, 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Auto-Approval Rate</span>
                    <span className="text-lg font-bold text-green-600">
                      {((refunds.filter(r => r.metadata.autoApprovalRules?.length).length / refunds.length) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Session Replay Viewer Component
function SessionReplayViewer({ session }: { session: SessionReplay }) {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const currentEvent = session.events[currentEventIndex];

  return (
    <div className="space-y-4">
      {/* Playback Controls */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentEventIndex(Math.max(0, currentEventIndex - 1))}>
            <Rewind className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentEventIndex(Math.min(session.events.length - 1, currentEventIndex + 1))}>
            <FastForward className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentEventIndex(0)}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Speed:</span>
          <Select value={playbackSpeed.toString()} onValueChange={(value) => setPlaybackSpeed(parseFloat(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.5">0.5x</SelectItem>
              <SelectItem value="1">1x</SelectItem>
              <SelectItem value="2">2x</SelectItem>
              <SelectItem value="4">4x</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Event {currentEventIndex + 1} of {session.events.length}</span>
          <span>{new Date(currentEvent?.timestamp || 0).toLocaleTimeString()}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all" 
            style={{ width: `${((currentEventIndex + 1) / session.events.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Event Details */}
      {currentEvent && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Event: {currentEvent.type}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Element:</span>
                <p className="text-gray-900">{currentEvent.data.element || 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">URL:</span>
                <p className="text-gray-900 truncate">{currentEvent.data.url || 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Coordinates:</span>
                <p className="text-gray-900">
                  {currentEvent.data.coordinates ? `${currentEvent.data.coordinates.x}, ${currentEvent.data.coordinates.y}` : 'N/A'}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Value:</span>
                <p className="text-gray-900">{currentEvent.data.value || 'N/A'}</p>
              </div>
            </div>
            
            {currentEvent.type === 'error' && currentEvent.data.errorMessage && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <span className="font-medium text-red-800">Error:</span>
                <p className="text-red-700 text-sm mt-1">{currentEvent.data.errorMessage}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Event Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Event Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {session.events.map((event, index) => (
              <div
                key={event.id}
                className={`p-2 rounded cursor-pointer transition-colors ${
                  index === currentEventIndex ? 'bg-blue-100 border border-blue-300' : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setCurrentEventIndex(index)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">{event.type.replace('_', ' ')}</span>
                  <span className="text-xs text-gray-500">{new Date(event.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-xs text-gray-600 truncate">{event.data.element || event.data.url}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}