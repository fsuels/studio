'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Customer360Timeline from '@/components/admin/Customer360Timeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Users,
  Search,
  Filter,
  Download,
  UserPlus,
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Eye,
  Mail,
  Phone,
  Calendar,
} from 'lucide-react';
import { generateMockCustomer360Data, type Customer360Data } from '@/lib/orders';

// Mock data for customer list
const mockCustomers = Array.from({ length: 50 }, (_, index) => {
  const data = generateMockCustomer360Data();
  return {
    id: data.customer.id,
    name: `${data.customer.firstName} ${data.customer.lastName}`,
    email: data.customer.email,
    planTier: data.customer.planTier,
    churnRisk: data.customer.churnRisk,
    lifetimeValue: data.customer.lifetimeValue,
    healthScore: data.metrics.healthScore,
    lastActivity: data.metrics.lastActivityDays,
    totalOrders: data.customer.totalOrders,
    joinDate: data.customer.createdAt,
    needsAttention: data.healthIndicators.needsAttention,
  };
});

export default function Customer360Page() {
  const searchParams = useSearchParams();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    searchParams.get('customerId')
  );
  const [customer360Data, setCustomer360Data] = useState<Customer360Data | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [filterTier, setFilterTier] = useState<'all' | 'free' | 'basic' | 'premium' | 'enterprise'>('all');

  // Filter customers based on search and filters
  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = filterRisk === 'all' || customer.churnRisk === filterRisk;
    const matchesTier = filterTier === 'all' || customer.planTier === filterTier;
    
    return matchesSearch && matchesRisk && matchesTier;
  });

  // Load customer 360 data when a customer is selected
  useEffect(() => {
    if (selectedCustomerId) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const data = generateMockCustomer360Data(selectedCustomerId);
        setCustomer360Data(data);
        setIsLoading(false);
      }, 1000);
    }
  }, [selectedCustomerId]);

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
    });
  };

  const getChurnRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanTierColor = (tier: string) => {
    switch (tier) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Calculate summary statistics
  const summaryStats = {
    totalCustomers: filteredCustomers.length,
    highRiskCustomers: filteredCustomers.filter(c => c.churnRisk === 'high').length,
    needingAttention: filteredCustomers.filter(c => c.needsAttention).length,
    averageHealthScore: Math.round(
      filteredCustomers.reduce((sum, c) => sum + c.healthScore, 0) / filteredCustomers.length
    ),
    totalLTV: filteredCustomers.reduce((sum, c) => sum + c.lifetimeValue, 0),
  };

  if (selectedCustomerId && customer360Data) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCustomerId(null);
                setCustomer360Data(null);
              }}
            >
              ← Back to Customer List
            </Button>
            <h1 className="text-2xl font-bold">Customer 360 View</h1>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Customer360Timeline
            data={customer360Data}
            onRefresh={() => {
              setIsLoading(true);
              setTimeout(() => {
                const data = generateMockCustomer360Data(selectedCustomerId);
                setCustomer360Data(data);
                setIsLoading(false);
              }, 1000);
            }}
            isLoading={isLoading}
          />
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer 360 Intelligence</h1>
          <p className="text-gray-600 mt-1">
            Complete customer insights with timeline, orders, support tickets, NPS, and churn risk
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Customer Note
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{summaryStats.totalCustomers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Risk</p>
                <p className="text-2xl font-bold text-red-600">{summaryStats.highRiskCustomers}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Need Attention</p>
                <p className="text-2xl font-bold text-orange-600">{summaryStats.needingAttention}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Health Score</p>
                <p className={`text-2xl font-bold ${getHealthScoreColor(summaryStats.averageHealthScore)}`}>
                  {summaryStats.averageHealthScore}/100
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total LTV</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(summaryStats.totalLTV)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Customer Database
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search customers by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Risk Levels</option>
                <option value="high">High Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="low">Low Risk</option>
              </select>
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Plan Tiers</option>
                <option value="free">Free</option>
                <option value="basic">Basic</option>
                <option value="premium">Premium</option>
                <option value="enterprise">Enterprise</option>
              </select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Customer Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Plan Tier</TableHead>
                <TableHead>Health Score</TableHead>
                <TableHead>Churn Risk</TableHead>
                <TableHead>LTV</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.slice(0, 20).map((customer) => (
                <TableRow
                  key={customer.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedCustomerId(customer.id)}
                >
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{customer.name}</div>
                      <div className="text-sm text-gray-600">{customer.email}</div>
                      <div className="text-xs text-gray-400">
                        Joined {formatDate(customer.joinDate)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPlanTierColor(customer.planTier)} variant="outline">
                      {customer.planTier.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${getHealthScoreColor(customer.healthScore)}`}>
                      {customer.healthScore}/100
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getChurnRiskColor(customer.churnRisk)} variant="outline">
                      {customer.churnRisk.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(customer.lifetimeValue)}
                  </TableCell>
                  <TableCell>{customer.totalOrders}</TableCell>
                  <TableCell>
                    <span className={customer.lastActivity > 30 ? 'text-red-600' : 'text-green-600'}>
                      {customer.lastActivity}d ago
                    </span>
                  </TableCell>
                  <TableCell>
                    {customer.needsAttention ? (
                      <Badge className="bg-orange-100 text-orange-800" variant="outline">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Attention
                      </Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-800" variant="outline">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Healthy
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCustomerId(customer.id);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredCustomers.length > 20 && (
            <div className="mt-4 text-center">
              <Button variant="outline">
                Load More ({filteredCustomers.length - 20} remaining)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}