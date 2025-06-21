// Admin API for order management
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import {
  generateMockOrders,
  calculateOrderSummary,
  type Order,
} from '@/lib/orders';

// Mock database - in production, use your actual database
let ordersDB: Order[] = generateMockOrders(150);

export async function GET(request: NextRequest) {
  // Require admin authentication
  const adminResult = await requireAdmin(request);
  if (adminResult instanceof Response) {
    return adminResult;
  }

  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || '';
    const riskLevel = url.searchParams.get('riskLevel') || '';
    const dateFrom = url.searchParams.get('dateFrom') || '';
    const dateTo = url.searchParams.get('dateTo') || '';
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';

    // Filter orders
    let filteredOrders = ordersDB;

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredOrders = filteredOrders.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchLower) ||
          order.customer.email.toLowerCase().includes(searchLower) ||
          order.customer.firstName.toLowerCase().includes(searchLower) ||
          order.customer.lastName.toLowerCase().includes(searchLower) ||
          order.items.some((item) =>
            item.documentType.toLowerCase().includes(searchLower),
          ),
      );
    }

    // Status filter
    if (status) {
      filteredOrders = filteredOrders.filter(
        (order) => order.status === status,
      );
    }

    // Risk level filter
    if (riskLevel) {
      filteredOrders = filteredOrders.filter(
        (order) => order.fraudAnalysis.recommendation === riskLevel,
      );
    }

    // Date range filter
    if (dateFrom) {
      filteredOrders = filteredOrders.filter(
        (order) => new Date(order.createdAt) >= new Date(dateFrom),
      );
    }
    if (dateTo) {
      filteredOrders = filteredOrders.filter(
        (order) => new Date(order.createdAt) <= new Date(dateTo),
      );
    }

    // Sort orders
    filteredOrders.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Order];
      let bValue: any = b[sortBy as keyof Order];

      // Handle nested properties
      if (sortBy === 'customerName') {
        aValue = `${a.customer.firstName} ${a.customer.lastName}`;
        bValue = `${b.customer.firstName} ${b.customer.lastName}`;
      } else if (sortBy === 'amount') {
        aValue = a.payment.amount;
        bValue = b.payment.amount;
      } else if (sortBy === 'fraudScore') {
        aValue = a.fraudAnalysis.score;
        bValue = b.fraudAnalysis.score;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'desc') {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      } else {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
    });

    // Pagination
    const total = filteredOrders.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedOrders = filteredOrders.slice(offset, offset + limit);

    // Calculate summary stats
    const summary = calculateOrderSummary(filteredOrders);

    // Add fraud alerts count
    const fraudAlerts = filteredOrders.filter(
      (order) =>
        order.fraudAnalysis.distanceAlert ||
        order.fraudAnalysis.recommendation === 'decline',
    ).length;

    return NextResponse.json({
      success: true,
      data: {
        orders: paginatedOrders,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
        summary: {
          ...summary,
          fraudAlerts,
        },
        filters: {
          search,
          status,
          riskLevel,
          dateFrom,
          dateTo,
          sortBy,
          sortOrder,
        },
      },
    });
  } catch (error) {
    console.error('Admin orders API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve orders',
      },
      { status: 500 },
    );
  }
}

// Update order status or add notes
export async function PATCH(request: NextRequest) {
  const adminResult = await requireAdmin(request);
  if (adminResult instanceof Response) {
    return adminResult;
  }

  try {
    const body = await request.json();
    const { orderId, updates } = body;

    const orderIndex = ordersDB.findIndex((order) => order.id === orderId);

    if (orderIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 },
      );
    }

    // Update order
    ordersDB[orderIndex] = {
      ...ordersDB[orderIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Add timeline event
    if (updates.status) {
      ordersDB[orderIndex].timeline.push({
        id: crypto.randomUUID(),
        type: updates.status,
        description: `Status changed to ${updates.status}`,
        timestamp: new Date().toISOString(),
        data: { adminUser: (adminResult as any).username },
      });
    }

    return NextResponse.json({
      success: true,
      data: ordersDB[orderIndex],
    });
  } catch (error) {
    console.error('Order update error:', error);

    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 },
    );
  }
}
