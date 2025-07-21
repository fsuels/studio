'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar } from '@/components/ui/avatar';
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
import {
  User,
  CreditCard,
  FileText,
  MessageSquare,
  Star,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Activity,
  BarChart3,
  Target,
  Zap,
  Heart,
  UserX,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Filter,
  Search,
  Eye,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type {
  Customer360Data,
  CustomerTimelineEvent,
  SupportTicket,
  NPSResponse,
} from '@/lib/orders';

interface Customer360TimelineProps {
  data: Customer360Data;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export default function Customer360Timeline({
  data,
  onRefresh,
  isLoading = false,
}: Customer360TimelineProps) {
  const [selectedTimelineFilter, setSelectedTimelineFilter] = useState<
    'all' | 'orders' | 'support' | 'nps' | 'documents'
  >('all');
  const [expandedTimelineItems, setExpandedTimelineItems] = useState<
    Set<string>
  >(new Set());
  const [activeTab, setActiveTab] = useState<
    'overview' | 'timeline' | 'orders' | 'support'
  >('overview');

  const {
    customer,
    metrics,
    healthIndicators,
    timeline,
    orders,
    supportTickets,
    npsResponses,
  } = data;

  // Filter timeline based on selected filter
  const filteredTimeline = useMemo(() => {
    if (selectedTimelineFilter === 'all') return timeline;
    return timeline.filter((event) => {
      switch (selectedTimelineFilter) {
        case 'orders':
          return event.type === 'order' || event.type === 'payment';
        case 'support':
          return event.type === 'support_ticket';
        case 'nps':
          return event.type === 'nps_response';
        case 'documents':
          return (
            event.type === 'document_download' ||
            event.type === 'document_created'
          );
        default:
          return true;
      }
    });
  }, [timeline, selectedTimelineFilter]);

  const toggleTimelineItem = (itemId: string) => {
    const newExpanded = new Set(expandedTimelineItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedTimelineItems(newExpanded);
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getChurnRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPlanTierColor = (tier: string) => {
    switch (tier) {
      case 'free':
        return 'bg-gray-100 text-gray-800';
      case 'basic':
        return 'bg-blue-100 text-blue-800';
      case 'premium':
        return 'bg-purple-100 text-purple-800';
      case 'enterprise':
        return 'bg-gold-100 text-gold-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimelineIcon = (type: CustomerTimelineEvent['type']) => {
    switch (type) {
      case 'order':
        return <CreditCard className="h-4 w-4" />;
      case 'payment':
        return <DollarSign className="h-4 w-4" />;
      case 'support_ticket':
        return <MessageSquare className="h-4 w-4" />;
      case 'nps_response':
        return <Star className="h-4 w-4" />;
      case 'document_download':
        return <Download className="h-4 w-4" />;
      case 'document_created':
        return <FileText className="h-4 w-4" />;
      case 'login':
        return <User className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getTimelineColor = (severity?: string) => {
    switch (severity) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Customer Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 bg-blue-100">
                <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-blue-700">
                  {customer.firstName.charAt(0)}
                  {customer.lastName.charAt(0)}
                </div>
              </Avatar>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {customer.firstName} {customer.lastName}
                  </h1>
                  <Badge
                    className={getPlanTierColor(customer.planTier)}
                    variant="outline"
                  >
                    {customer.planTier.toUpperCase()}
                  </Badge>
                  <Badge
                    className={getChurnRiskColor(customer.churnRisk)}
                    variant="outline"
                  >
                    {customer.churnRisk.toUpperCase()} CHURN RISK
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {customer.email}
                  </div>
                  {customer.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {customer.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {customer.billingAddress.city},{' '}
                    {customer.billingAddress.state}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    Customer since {formatDate(customer.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Activity className="h-4 w-4 text-gray-400" />
                    Last active {metrics.lastActivityDays} days ago
                  </span>
                </div>
              </div>
            </div>

            {/* Health Indicators */}
            <div className="flex flex-col items-end gap-2">
              <div
                className={`px-3 py-1 rounded-lg border font-medium ${getHealthScoreColor(metrics.healthScore)}`}
              >
                Health Score: {metrics.healthScore}/100
              </div>
              <div className="flex gap-2">
                {healthIndicators.isHighValue && (
                  <Badge
                    className="bg-purple-100 text-purple-800"
                    variant="outline"
                  >
                    <Target className="h-3 w-3 mr-1" />
                    High Value
                  </Badge>
                )}
                {healthIndicators.hasOpenTickets && (
                  <Badge
                    className="bg-orange-100 text-orange-800"
                    variant="outline"
                  >
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Open Tickets
                  </Badge>
                )}
                {healthIndicators.needsAttention && (
                  <Badge className="bg-red-100 text-red-800" variant="outline">
                    <Zap className="h-3 w-3 mr-1" />
                    Needs Attention
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Lifetime Value
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(metrics.totalLifetimeValue)}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">NPS Score</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics.npsScore.toFixed(1)}
                  </p>
                  {healthIndicators.recentNPS && (
                    <Badge
                      className={
                        healthIndicators.recentNPS === 'promoter'
                          ? 'bg-green-100 text-green-800'
                          : healthIndicators.recentNPS === 'passive'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }
                      variant="outline"
                    >
                      {healthIndicators.recentNPS}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {customer.totalOrders}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Churn Probability
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900">
                    {(metrics.churnProbability * 100).toFixed(0)}%
                  </p>
                  {metrics.churnProbability > 0.4 ? (
                    <TrendingUp className="h-4 w-4 text-red-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-green-500" />
                  )}
                </div>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as any)}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
          <TabsTrigger value="support">
            Support ({supportTickets.length})
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">
                      Customer ID:
                    </span>
                    <p className="text-gray-900">{customer.id}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Segment:</span>
                    <p className="text-gray-900 capitalize">
                      {customer.customerSegment}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">
                      Acquisition:
                    </span>
                    <p className="text-gray-900 capitalize">
                      {customer.acquisitionChannel?.replace('_', ' ')}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">
                      Documents:
                    </span>
                    <p className="text-gray-900">
                      {customer.documentDownloads} downloads
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <span className="font-medium text-gray-600">
                    Billing Address:
                  </span>
                  <p className="text-gray-900 text-sm">
                    {customer.billingAddress.street}
                    <br />
                    {customer.billingAddress.city},{' '}
                    {customer.billingAddress.state}{' '}
                    {customer.billingAddress.zipCode}
                    <br />
                    {customer.billingAddress.country}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {timeline.slice(0, 5).map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-b-0"
                    >
                      <div
                        className={`p-1 rounded-full ${getTimelineColor(event.severity)}`}
                      >
                        {getTimelineIcon(event.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {event.title}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {event.description}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(event.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Customer Timeline
                </CardTitle>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedTimelineFilter}
                    onChange={(e) =>
                      setSelectedTimelineFilter(e.target.value as any)
                    }
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="all">All Events</option>
                    <option value="orders">Orders & Payments</option>
                    <option value="support">Support</option>
                    <option value="nps">NPS Responses</option>
                    <option value="documents">Documents</option>
                  </select>
                  {onRefresh && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onRefresh}
                      disabled={isLoading}
                    >
                      <Activity className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTimeline.map((event, index) => (
                  <div key={event.id} className="relative">
                    {index !== filteredTimeline.length - 1 && (
                      <div className="absolute left-6 top-12 bottom-0 w-px bg-gray-200" />
                    )}
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-2 rounded-full border-2 border-white shadow-sm ${getTimelineColor(event.severity)}`}
                      >
                        {getTimelineIcon(event.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className="cursor-pointer"
                          onClick={() => toggleTimelineItem(event.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-medium text-gray-900">
                                {event.title}
                              </h4>
                              <Badge variant="outline" className="text-xs">
                                {event.type.replace('_', ' ')}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">
                                {formatDate(event.timestamp)}
                              </span>
                              {expandedTimelineItems.has(event.id) ? (
                                <ChevronUp className="h-4 w-4 text-gray-400" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {event.description}
                          </p>
                        </div>

                        {expandedTimelineItems.has(event.id) &&
                          event.metadata && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <h5 className="text-xs font-medium text-gray-700 mb-2">
                                Details:
                              </h5>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                {Object.entries(event.metadata).map(
                                  ([key, value]) => (
                                    <div key={key}>
                                      <span className="font-medium text-gray-600 capitalize">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                                      </span>
                                      <span className="ml-1 text-gray-900">
                                        {typeof value === 'object'
                                          ? JSON.stringify(value)
                                          : String(value)}
                                      </span>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Order History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>
                        {order.items
                          .map((item) => item.documentName)
                          .join(', ')}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(order.payment.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            order.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'processing'
                                ? 'bg-blue-100 text-blue-800'
                                : order.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                          }
                          variant="outline"
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Support Tab */}
        <TabsContent value="support" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Support Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Resolution Time</TableHead>
                    <TableHead>Satisfaction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supportTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">
                        {ticket.subject}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            ticket.priority === 'urgent'
                              ? 'bg-red-100 text-red-800'
                              : ticket.priority === 'high'
                                ? 'bg-orange-100 text-orange-800'
                                : ticket.priority === 'medium'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                          }
                          variant="outline"
                        >
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            ticket.status === 'resolved'
                              ? 'bg-green-100 text-green-800'
                              : ticket.status === 'in_progress'
                                ? 'bg-blue-100 text-blue-800'
                                : ticket.status === 'open'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                          }
                          variant="outline"
                        >
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                      <TableCell>
                        {ticket.resolvedAt
                          ? `${Math.round((new Date(ticket.resolvedAt).getTime() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60))}h`
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {ticket.customerSatisfaction ? (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            {ticket.customerSatisfaction}/5
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
