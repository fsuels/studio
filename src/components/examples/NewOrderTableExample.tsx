'use client';

import { withFlag } from '@/lib/flags';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Enhanced Order Table Component (new version)
function EnhancedOrderTable() {
  const orders = [
    {
      id: 'ORD-001',
      customer: 'John Doe',
      document: 'Bill of Sale - Vehicle',
      status: 'completed',
      amount: '$299.99',
      date: '2024-01-15',
      actions: ['view', 'download', 'refund']
    },
    {
      id: 'ORD-002', 
      customer: 'Jane Smith',
      document: 'Promissory Note',
      status: 'pending',
      amount: '$199.99',
      date: '2024-01-14',
      actions: ['view', 'complete']
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">Enhanced order management with improved UX</p>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          NEW TABLE
        </Badge>
      </div>
      
      <div className="rounded-md border">
        <div className="p-4 border-b bg-muted/50">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              Filter
            </Button>
            <Button variant="outline" size="sm">
              Sort
            </Button>
            <Button variant="outline" size="sm">
              Export
            </Button>
            <div className="ml-auto">
              <input 
                placeholder="Search orders..." 
                className="px-3 py-1 border rounded-md"
              />
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="h-12 px-4 text-left align-middle font-medium">Order ID</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Customer</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Document</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Amount</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-muted/50">
                  <td className="p-4 font-mono text-sm">{order.id}</td>
                  <td className="p-4">{order.customer}</td>
                  <td className="p-4">{order.document}</td>
                  <td className="p-4">
                    <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="p-4 font-semibold">{order.amount}</td>
                  <td className="p-4 text-muted-foreground">{order.date}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {order.actions.map((action) => (
                        <Button key={action} variant="ghost" size="sm">
                          {action}
                        </Button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Legacy Order Table Component (fallback)
function LegacyOrderTable() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
      <div className="rounded-md border">
        <table className="w-full">
          <thead className="border-b">
            <tr>
              <th className="h-12 px-4 text-left align-middle font-medium">Order ID</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Customer</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-4">ORD-001</td>
              <td className="p-4">John Doe</td>
              <td className="p-4">Completed</td>
              <td className="p-4">$299.99</td>
            </tr>
            <tr className="border-b">
              <td className="p-4">ORD-002</td>
              <td className="p-4">Jane Smith</td>
              <td className="p-4">Pending</td>
              <td className="p-4">$199.99</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Export the feature-flagged component using withFlag HOC
export const OrderTable = withFlag('newOrderTable', LegacyOrderTable)(EnhancedOrderTable);

// Alternative usage patterns:

// 1. Direct component wrapping
export const NewOrderTableDirect = withFlag('newOrderTable')(EnhancedOrderTable);

// 2. With null fallback (show nothing if disabled)
export const NewOrderTableOrNothing = withFlag('newOrderTable')(EnhancedOrderTable);

// 3. Usage example in a parent component
export function OrderManagementPage() {
  return (
    <div className="container mx-auto py-6">
      {/* This will show EnhancedOrderTable if 'newOrderTable' flag is enabled,
          otherwise falls back to LegacyOrderTable */}
      <OrderTable />
      
      {/* Example of other flag usage */}
      {/* <FeatureFlag flag="enhancedSearch">
        <EnhancedSearchBar />
      </FeatureFlag> */}
    </div>
  );
}