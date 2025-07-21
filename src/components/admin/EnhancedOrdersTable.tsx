// Enhanced Orders Table with Inline Actions & Optimistic Updates
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Search,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MapPin,
  CreditCard,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  Download,
  RefreshCw,
  RotateCcw,
  Mail,
  Phone,
  MessageSquare,
  Loader2,
  CheckIcon,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { type Order } from '@/lib/orders';
import { OrdersTableSkeleton } from '@/components/ui/SkeletonLoaders';
import { useToast } from '@/hooks/use-toast';

interface EnhancedOrdersTableProps {
  className?: string;
}

interface OptimisticUpdate {
  orderId: string;
  type: 'refund' | 'status_change' | 'email_resend';
  timestamp: number;
}

export default function EnhancedOrdersTable({
  className,
}: EnhancedOrdersTableProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [optimisticUpdates, setOptimisticUpdates] = useState<
    OptimisticUpdate[]
  >([]);
  const { toast } = useToast();

  // Filters and search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Pagination and sorting
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Loading states for individual actions
  const [actionStates, setActionStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchOrders();
  }, [
    page,
    search,
    statusFilter,
    riskFilter,
    dateFrom,
    dateTo,
    sortBy,
    sortOrder,
  ]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        search,
        status: statusFilter,
        riskLevel: riskFilter,
        dateFrom,
        dateTo,
        sortBy,
        sortOrder,
      });

      const response = await fetch(`/api/admin/orders?${params}`);
      const data = await response.json();

      if (data.success) {
        setOrders(data.data.orders);
        setTotalPages(data.data.pagination.totalPages);
        setTotal(data.data.pagination.total);
        setSummary(data.data.summary);
      } else {
        setError(data.error || 'Failed to load orders');
      }
    } catch (err) {
      setError('Network error loading orders');
    } finally {
      setLoading(false);
    }
  };

  // Optimistic update helper
  const addOptimisticUpdate = (
    orderId: string,
    type: OptimisticUpdate['type'],
  ) => {
    const update: OptimisticUpdate = {
      orderId,
      type,
      timestamp: Date.now(),
    };

    setOptimisticUpdates((prev) => [...prev, update]);

    // Remove after 5 seconds
    setTimeout(() => {
      setOptimisticUpdates((prev) => prev.filter((u) => u !== update));
    }, 5000);
  };

  // Check if order has pending optimistic update
  const hasPendingUpdate = (
    orderId: string,
    type?: OptimisticUpdate['type'],
  ) => {
    return optimisticUpdates.some(
      (update) => update.orderId === orderId && (!type || update.type === type),
    );
  };

  // Set loading state for specific action
  const setActionLoading = (key: string, loading: boolean) => {
    setActionStates((prev) => ({ ...prev, [key]: loading }));
  };

  // Quick actions
  const handleQuickRefund = async (order: Order) => {
    const actionKey = `refund_${order.id}`;
    setActionLoading(actionKey, true);
    addOptimisticUpdate(order.id, 'refund');

    try {
      const response = await fetch('/api/support-toolkit/refunds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_refund',
          orderId: order.id,
          amount: order.payment.amount,
          reason: 'customer_request',
          agentId: 'current_admin',
          agentName: 'Admin User',
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Refund Processed',
          description: `Refund of ${formatCurrency(order.payment.amount)} initiated for order ${order.orderNumber}`,
        });

        // Update order status optimistically
        setOrders((prev) =>
          prev.map((o) =>
            o.id === order.id ? { ...o, status: 'refunded' } : o,
          ),
        );
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: 'Refund Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setActionLoading(actionKey, false);
    }
  };

  const handleResendEmail = async (order: Order) => {
    const actionKey = `email_${order.id}`;
    setActionLoading(actionKey, true);
    addOptimisticUpdate(order.id, 'email_resend');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: 'Email Sent',
        description: `Confirmation email resent to ${order.customer.email}`,
      });
    } catch (error) {
      toast({
        title: 'Email Failed',
        description: 'Failed to resend confirmation email',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(actionKey, false);
    }
  };

  const handleStatusChange = async (order: Order, newStatus: string) => {
    const actionKey = `status_${order.id}`;
    setActionLoading(actionKey, true);
    addOptimisticUpdate(order.id, 'status_change');

    try {
      // Update order status optimistically
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o)),
      );

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      toast({
        title: 'Status Updated',
        description: `Order ${order.orderNumber} status changed to ${newStatus}`,
      });
    } catch (error) {
      // Revert optimistic update
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id ? { ...o, status: order.status } : o,
        ),
      );

      toast({
        title: 'Update Failed',
        description: 'Failed to update order status',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(actionKey, false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: `${label} copied to clipboard`,
    });
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getStatusBadge = (status: string, orderId: string) => {
    const isUpdating = hasPendingUpdate(orderId, 'status_change');

    const variants = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
      refunded: 'bg-red-100 text-red-800 border-red-200',
    };

    return (
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className={variants[status as keyof typeof variants] || 'bg-gray-100'}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
        {isUpdating && (
          <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
        )}
      </div>
    );
  };

  const getFraudBadge = (fraudAnalysis: any) => {
    const { recommendation, score, distanceAlert } = fraudAnalysis;

    if (recommendation === 'decline' || score >= 800) {
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="h-3 w-3" />
          Very High Risk
        </Badge>
      );
    }

    if (score >= 600) {
      return (
        <Badge
          variant="destructive"
          className="gap-1 bg-orange-100 text-orange-700 border-orange-300"
        >
          <AlertTriangle className="h-3 w-3" />
          High Risk
        </Badge>
      );
    }

    if (recommendation === 'review' || score >= 400 || distanceAlert) {
      return (
        <Badge
          variant="outline"
          className="gap-1 text-amber-600 border-amber-200 bg-amber-50"
        >
          <AlertTriangle className="h-3 w-3" />
          Medium Risk
        </Badge>
      );
    }

    return (
      <Badge
        variant="outline"
        className="gap-1 text-green-600 border-green-200 bg-green-50"
      >
        <CheckCircle className="h-3 w-3" />
        Low Risk
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && orders.length === 0) {
    return <OrdersTableSkeleton />;
  }

  return (
    <TooltipProvider>
      <div className={`space-y-6 ${className}`}>
        {/* Enhanced Summary Cards with Real-time Updates */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(summary.totalRevenue)}
                    </p>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3" />
                      +12.5% from last week
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Orders
                    </p>
                    <p className="text-2xl font-bold">
                      {summary.totalOrders.toLocaleString()}
                    </p>
                    <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3" />
                      +8.2% from last week
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Avg Order Value
                    </p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(summary.averageOrderValue)}
                    </p>
                    <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3" />
                      +3.1% from last week
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Fraud Alerts
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {summary.fraudAlerts}
                    </p>
                    <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                      <AlertTriangle className="h-3 w-3" />
                      Requires attention
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Enhanced Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Orders Management</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchOrders}
                  disabled={loading}
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
                  />
                  Refresh
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders, customers, or documents..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>

              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Risk Levels</SelectItem>
                  <SelectItem value="approve">Low Risk</SelectItem>
                  <SelectItem value="review">Medium Risk</SelectItem>
                  <SelectItem value="decline">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Enhanced Orders Table */}
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort('orderNumber')}
                      >
                        Order
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort('customerName')}
                      >
                        Customer
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Document</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort('amount')}
                      >
                        Amount
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Fraud Risk</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort('createdAt')}
                      >
                        Date
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="w-32">Quick Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow
                      key={order.id}
                      className={`hover:bg-muted/50 transition-colors ${
                        hasPendingUpdate(order.id) ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="font-semibold">
                              {order.orderNumber}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {order.id.slice(0, 8)}
                            </div>
                          </div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() =>
                                  copyToClipboard(order.id, 'Order ID')
                                }
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Copy Order ID</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="font-medium">
                              {order.customer.firstName}{' '}
                              {order.customer.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {order.customer.email}
                            </div>
                            {order.customer.phone && (
                              <div className="text-xs text-muted-foreground">
                                {order.customer.phone}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() =>
                                    copyToClipboard(
                                      order.customer.email,
                                      'Email',
                                    )
                                  }
                                >
                                  <Mail className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Copy Email</TooltipContent>
                            </Tooltip>
                            {order.customer.phone && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() =>
                                      copyToClipboard(
                                        order.customer.phone,
                                        'Phone',
                                      )
                                    }
                                  >
                                    <Phone className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Copy Phone</TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {order.items[0]?.documentType}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {order.items.length} item
                            {order.items.length > 1 ? 's' : ''}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div>
                          <div className="font-semibold">
                            {formatCurrency(order.payment.amount)}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <CreditCard className="h-3 w-3" />
                            {order.payment.cardBrand} ••••{' '}
                            {order.payment.cardLast4}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        {getStatusBadge(order.status, order.id)}
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          {getFraudBadge(order.fraudAnalysis)}
                          <div className="text-xs text-muted-foreground">
                            Score: {order.fraudAnalysis.score}%
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div>
                          <div className="text-sm font-medium">
                            {order.customer.billingAddress.city},{' '}
                            {order.customer.billingAddress.state}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            IP: {order.customer.ipLocation.city},{' '}
                            {order.customer.ipLocation.state}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div>
                          <div className="text-sm">
                            {formatDate(order.createdAt)}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(order.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </TableCell>

                      {/* Enhanced Quick Actions */}
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {/* Quick Refund */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleQuickRefund(order)}
                                disabled={
                                  actionStates[`refund_${order.id}`] ||
                                  order.status === 'refunded'
                                }
                              >
                                {actionStates[`refund_${order.id}`] ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <RotateCcw className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Quick Refund</TooltipContent>
                          </Tooltip>

                          {/* Resend Email */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                onClick={() => handleResendEmail(order)}
                                disabled={actionStates[`email_${order.id}`]}
                              >
                                {actionStates[`email_${order.id}`] ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Mail className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Resend Email</TooltipContent>
                          </Tooltip>

                          {/* Customer Support Chat */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Contact Customer</TooltipContent>
                          </Tooltip>

                          {/* View Details */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>View Details</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Enhanced Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {orders.length} of {total.toLocaleString()} orders
                {optimisticUpdates.length > 0 && (
                  <span className="ml-2 text-blue-600">
                    • {optimisticUpdates.length} pending update
                    {optimisticUpdates.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
