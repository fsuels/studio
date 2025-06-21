// Beautiful order detail modal with comprehensive customer profile
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  X,
  User,
  CreditCard,
  MapPin,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Download,
  Eye,
  Shield,
  Mail,
  Phone,
  FileText,
  BarChart3,
  Edit,
  Save,
  RefreshCw,
  ExternalLink,
  Copy,
} from 'lucide-react';
import { type Order } from '@/lib/orders';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string | null;
}

export default function OrderDetailModal({
  isOpen,
  onClose,
  orderId,
}: OrderDetailModalProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [relatedOrders, setRelatedOrders] = useState<Order[]>([]);
  const [customerSummary, setCustomerSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editedStatus, setEditedStatus] = useState('');
  const [newNote, setNewNote] = useState('');
  const [fraudScore, setFraudScore] = useState(0);
  const [fraudRecommendation, setFraudRecommendation] = useState('');

  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrderDetails();
    }
  }, [isOpen, orderId]);

  const fetchOrderDetails = async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/orders/${orderId}`);
      const data = await response.json();

      if (data.success) {
        setOrder(data.data.order);
        setRelatedOrders(data.data.relatedOrders);
        setCustomerSummary(data.data.customerSummary);
        setEditedStatus(data.data.order.status);
        setFraudScore(data.data.order.fraudAnalysis.score);
        setFraudRecommendation(data.data.order.fraudAnalysis.recommendation);
      } else {
        setError(data.error || 'Failed to load order details');
      }
    } catch (err) {
      setError('Network error loading order details');
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (action: string, data: any) => {
    if (!orderId) return;

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, data }),
      });

      const result = await response.json();

      if (result.success) {
        setOrder(result.data);
        setIsEditing(false);
        setNewNote('');
      } else {
        setError(result.error || 'Failed to update order');
      }
    } catch (err) {
      setError('Network error updating order');
    }
  };

  const handleSaveChanges = () => {
    const updates: any = {};

    if (editedStatus !== order?.status) {
      updateOrder('update_status', { status: editedStatus });
    }

    if (newNote.trim()) {
      updateOrder('add_note', { note: newNote.trim() });
    }

    if (
      fraudScore !== order?.fraudAnalysis.score ||
      fraudRecommendation !== order?.fraudAnalysis.recommendation
    ) {
      updateOrder('update_fraud_score', {
        score: fraudScore,
        recommendation: fraudRecommendation,
      });
    }
  };

  const processRefund = () => {
    if (!order) return;
    const amount = prompt(
      'Enter refund amount:',
      order.payment.amount.toString(),
    );
    const reason = prompt('Enter refund reason:', 'Customer request');

    if (amount && reason) {
      updateOrder('process_refund', {
        amount: parseFloat(amount),
        reason,
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
      refunded: 'bg-red-100 text-red-800 border-red-200',
    };

    return (
      <Badge
        variant="outline"
        className={variants[status as keyof typeof variants] || 'bg-gray-100'}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getFraudBadge = (score: number, recommendation: string) => {
    if (recommendation === 'decline' || score >= 70) {
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="h-3 w-3" />
          High Risk ({score}%)
        </Badge>
      );
    }

    if (recommendation === 'review' || score >= 30) {
      return (
        <Badge
          variant="outline"
          className="gap-1 text-amber-600 border-amber-200 bg-amber-50"
        >
          <AlertTriangle className="h-3 w-3" />
          Medium Risk ({score}%)
        </Badge>
      );
    }

    return (
      <Badge
        variant="outline"
        className="gap-1 text-green-600 border-green-200 bg-green-50"
      >
        <CheckCircle className="h-3 w-3" />
        Low Risk ({score}%)
      </Badge>
    );
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6" />
              <div>
                <div className="text-xl font-bold">
                  Order {order?.orderNumber || 'Loading...'}
                </div>
                <div className="text-sm text-muted-foreground font-normal">
                  {order?.id}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={fetchOrderDetails}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        ) : order ? (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="customer">Customer</TabsTrigger>
              <TabsTrigger value="fraud">Fraud Analysis</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Order Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      {isEditing ? (
                        <Select
                          value={editedStatus}
                          onValueChange={setEditedStatus}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">
                              Processing
                            </SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="refunded">Refunded</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div>
                          {getStatusBadge(order.status)}
                          <div className="text-xs text-muted-foreground mt-1">
                            Updated {formatDate(order.updatedAt)}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Payment Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">
                        {formatCurrency(order.payment.amount)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CreditCard className="h-4 w-4" />
                        {order.payment.cardBrand} •••• {order.payment.cardLast4}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Net: {formatCurrency(order.payment.netAmount)}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Fraud Risk
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {getFraudBadge(
                      order.fraudAnalysis.score,
                      order.fraudAnalysis.recommendation,
                    )}
                    {order.fraudAnalysis.distanceAlert && (
                      <div className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {order.fraudAnalysis.ipVsAddressDistance?.toFixed(0)}mi
                        distance alert
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{item.documentType}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.documentName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            State: {item.stateCode} • Qty: {item.quantity}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            {formatCurrency(item.price)}
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant={isEditing ? 'default' : 'outline'}
                      onClick={() =>
                        isEditing ? handleSaveChanges() : setIsEditing(true)
                      }
                    >
                      {isEditing ? (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Order
                        </>
                      )}
                    </Button>

                    {isEditing && (
                      <Button
                        variant="ghost"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    )}

                    <Button variant="outline" onClick={processRefund}>
                      <DollarSign className="h-4 w-4 mr-2" />
                      Process Refund
                    </Button>

                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download Invoice
                    </Button>
                  </div>

                  {isEditing && (
                    <div className="mt-4 space-y-3">
                      <div>
                        <Label htmlFor="note">Add Note</Label>
                        <Textarea
                          id="note"
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          placeholder="Add a note about this order..."
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="customer" className="space-y-6">
              {/* Customer Profile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="font-semibold text-lg">
                        {order.customer.firstName} {order.customer.lastName}
                      </div>
                      <div className="text-muted-foreground">
                        Customer ID: {order.customer.id}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{order.customer.email}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(order.customer.email)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>

                      {order.customer.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{order.customer.phone}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(order.customer.phone)
                            }
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2">
                        Billing Address
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.customer.billingAddress.street}
                        <br />
                        {order.customer.billingAddress.city},{' '}
                        {order.customer.billingAddress.state}{' '}
                        {order.customer.billingAddress.zipCode}
                        <br />
                        {order.customer.billingAddress.country}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Customer Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {customerSummary && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-2xl font-bold">
                            {customerSummary.totalOrders}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Total Orders
                          </div>
                        </div>

                        <div>
                          <div className="text-2xl font-bold">
                            {formatCurrency(customerSummary.totalSpent)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Total Spent
                          </div>
                        </div>

                        <div>
                          <div className="text-2xl font-bold">
                            {customerSummary.averageFraudScore}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Avg Fraud Score
                          </div>
                        </div>

                        <div>
                          <div className="text-2xl font-bold">
                            {order.customer.riskLevel.charAt(0).toUpperCase() +
                              order.customer.riskLevel.slice(1)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Risk Level
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* IP Location */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm font-medium mb-2">
                        IP Location
                      </div>
                      <div className="text-sm">
                        <div>
                          {order.customer.ipLocation.city},{' '}
                          {order.customer.ipLocation.state}
                        </div>
                        <div className="text-muted-foreground">
                          {order.customer.ipLocation.country}
                        </div>
                        <div className="text-muted-foreground">
                          IP: {order.customer.ipLocation.ip}
                        </div>
                        <div className="text-muted-foreground">
                          Provider: {order.customer.ipLocation.provider}
                        </div>
                        <div className="text-muted-foreground">
                          Confidence: {order.customer.ipLocation.confidence}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2">
                        Distance Analysis
                      </div>
                      {order.fraudAnalysis.distanceAlert ? (
                        <Alert variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            IP location is{' '}
                            {order.fraudAnalysis.ipVsAddressDistance?.toFixed(
                              0,
                            )}{' '}
                            miles from billing address
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <div className="text-sm text-green-600">
                          ✓ IP location matches billing region
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Related Orders */}
              {relatedOrders.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders from Customer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {relatedOrders.map((relatedOrder) => (
                        <div
                          key={relatedOrder.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <div className="font-medium">
                              {relatedOrder.orderNumber}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {formatDate(relatedOrder.createdAt)}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="font-semibold">
                                {formatCurrency(relatedOrder.payment.amount)}
                              </div>
                              {getStatusBadge(relatedOrder.status)}
                            </div>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="fraud" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Fraud Analysis Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Fraud Score</Label>
                      {isEditing ? (
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={fraudScore}
                          onChange={(e) =>
                            setFraudScore(parseInt(e.target.value))
                          }
                          className="mt-1"
                        />
                      ) : (
                        <div className="text-2xl font-bold mt-1">
                          {order.fraudAnalysis.score}%
                        </div>
                      )}
                    </div>

                    <div>
                      <Label>Recommendation</Label>
                      {isEditing ? (
                        <Select
                          value={fraudRecommendation}
                          onValueChange={setFraudRecommendation}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="approve">Approve</SelectItem>
                            <SelectItem value="review">Review</SelectItem>
                            <SelectItem value="decline">Decline</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="mt-1">
                          {getFraudBadge(
                            order.fraudAnalysis.score,
                            order.fraudAnalysis.recommendation,
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label>Distance Alert</Label>
                      <div className="mt-1">
                        {order.fraudAnalysis.distanceAlert ? (
                          <Badge variant="destructive">Active</Badge>
                        ) : (
                          <Badge variant="outline" className="text-green-600">
                            None
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Risk Factors</Label>
                    <div className="mt-2 space-y-2">
                      {order.fraudAnalysis.factors.map((factor, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          {factor}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Order Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.timeline.length > 0 ? (
                      order.timeline.map((event) => (
                        <div
                          key={event.id}
                          className="flex gap-4 pb-4 border-b last:border-b-0"
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="font-medium">
                              {event.description}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {formatDate(event.timestamp)}
                            </div>
                            {event.data && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {JSON.stringify(event.data, null, 2)}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        No timeline events yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Generated Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {order.documents.length > 0 ? (
                    <div className="space-y-3">
                      {order.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <div className="font-medium">{doc.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {doc.type} • Created {formatDate(doc.createdAt)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Downloads: {doc.downloadCount}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      No documents generated yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
