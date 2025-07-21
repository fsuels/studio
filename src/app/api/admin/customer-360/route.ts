// Customer 360 API for admin dashboard
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import {
  generateMockCustomer360Data,
  generateMockOrders,
  type Customer360Data,
  type CustomerInfo,
} from '@/lib/orders';

// Mock customer database - in production, use your actual database
const generateMockCustomerList = (count: number = 100) => {
  const customers: Array<
    CustomerInfo & {
      healthScore: number;
      needsAttention: boolean;
      lastActivityDays: number;
    }
  > = [];

  for (let i = 0; i < count; i++) {
    const data = generateMockCustomer360Data();
    customers.push({
      ...data.customer,
      healthScore: data.metrics.healthScore,
      needsAttention: data.healthIndicators.needsAttention,
      lastActivityDays: data.metrics.lastActivityDays,
    });
  }

  return customers;
};

const mockCustomerList = generateMockCustomerList(150);

export async function GET(request: NextRequest) {
  // Require admin authentication
  const adminResult = await requireAdmin(request);
  if (adminResult instanceof Response) {
    return adminResult;
  }

  try {
    const url = new URL(request.url);
    const customerId = url.searchParams.get('customerId');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const search = url.searchParams.get('search') || '';
    const riskFilter = url.searchParams.get('riskFilter') || 'all';
    const tierFilter = url.searchParams.get('tierFilter') || 'all';
    const sortBy = url.searchParams.get('sortBy') || 'lastActivity';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';

    // If requesting specific customer data
    if (customerId) {
      const customer360Data = generateMockCustomer360Data(customerId);

      return NextResponse.json({
        success: true,
        data: customer360Data,
      });
    }

    // Filter customers
    let filteredCustomers = mockCustomerList;

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCustomers = filteredCustomers.filter(
        (customer) =>
          customer.firstName.toLowerCase().includes(searchLower) ||
          customer.lastName.toLowerCase().includes(searchLower) ||
          customer.email.toLowerCase().includes(searchLower),
      );
    }

    // Risk level filter
    if (riskFilter !== 'all') {
      filteredCustomers = filteredCustomers.filter(
        (customer) => customer.churnRisk === riskFilter,
      );
    }

    // Plan tier filter
    if (tierFilter !== 'all') {
      filteredCustomers = filteredCustomers.filter(
        (customer) => customer.planTier === tierFilter,
      );
    }

    // Sort customers
    filteredCustomers.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
          bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
          break;
        case 'lastActivity':
          aValue = a.lastActivityDays;
          bValue = b.lastActivityDays;
          break;
        case 'healthScore':
          aValue = a.healthScore;
          bValue = b.healthScore;
          break;
        case 'lifetimeValue':
          aValue = a.lifetimeValue;
          bValue = b.lifetimeValue;
          break;
        case 'churnRisk':
          const riskOrder = { low: 1, medium: 2, high: 3 };
          aValue = riskOrder[a.churnRisk as keyof typeof riskOrder];
          bValue = riskOrder[b.churnRisk as keyof typeof riskOrder];
          break;
        default:
          aValue = new Date(a.lastActivityAt).getTime();
          bValue = new Date(b.lastActivityAt).getTime();
      }

      if (sortOrder === 'desc') {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      } else {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
    });

    // Pagination
    const total = filteredCustomers.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedCustomers = filteredCustomers.slice(offset, offset + limit);

    // Calculate summary stats
    const summary = {
      totalCustomers: total,
      highRiskCustomers: filteredCustomers.filter((c) => c.churnRisk === 'high')
        .length,
      needingAttention: filteredCustomers.filter((c) => c.needsAttention)
        .length,
      averageHealthScore:
        filteredCustomers.length > 0
          ? Math.round(
              filteredCustomers.reduce((sum, c) => sum + c.healthScore, 0) /
                filteredCustomers.length,
            )
          : 0,
      totalLTV: filteredCustomers.reduce((sum, c) => sum + c.lifetimeValue, 0),
      planTierDistribution: {
        free: filteredCustomers.filter((c) => c.planTier === 'free').length,
        basic: filteredCustomers.filter((c) => c.planTier === 'basic').length,
        premium: filteredCustomers.filter((c) => c.planTier === 'premium')
          .length,
        enterprise: filteredCustomers.filter((c) => c.planTier === 'enterprise')
          .length,
      },
      churnRiskDistribution: {
        low: filteredCustomers.filter((c) => c.churnRisk === 'low').length,
        medium: filteredCustomers.filter((c) => c.churnRisk === 'medium')
          .length,
        high: filteredCustomers.filter((c) => c.churnRisk === 'high').length,
      },
      recentActivity: {
        active7days: filteredCustomers.filter((c) => c.lastActivityDays <= 7)
          .length,
        active30days: filteredCustomers.filter((c) => c.lastActivityDays <= 30)
          .length,
        inactive30plus: filteredCustomers.filter((c) => c.lastActivityDays > 30)
          .length,
        inactive90plus: filteredCustomers.filter((c) => c.lastActivityDays > 90)
          .length,
      },
    };

    return NextResponse.json({
      success: true,
      data: {
        customers: paginatedCustomers,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
        summary,
        filters: {
          search,
          riskFilter,
          tierFilter,
          sortBy,
          sortOrder,
        },
      },
    });
  } catch (error) {
    console.error('Customer 360 API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve customer data',
      },
      { status: 500 },
    );
  }
}

// Update customer notes or status
export async function PATCH(request: NextRequest) {
  const adminResult = await requireAdmin(request);
  if (adminResult instanceof Response) {
    return adminResult;
  }

  try {
    const body = await request.json();
    const { customerId, updates } = body;

    // Find customer in mock data
    const customerIndex = mockCustomerList.findIndex(
      (customer) => customer.id === customerId,
    );

    if (customerIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 },
      );
    }

    // Update customer
    mockCustomerList[customerIndex] = {
      ...mockCustomerList[customerIndex],
      ...updates,
      // Always update the lastActivityAt when admin makes changes
      lastActivityAt: new Date().toISOString(),
    };

    // In production, you would also create an audit trail entry here
    console.log(
      `Admin ${(adminResult as any).username} updated customer ${customerId}:`,
      updates,
    );

    return NextResponse.json({
      success: true,
      data: mockCustomerList[customerIndex],
    });
  } catch (error) {
    console.error('Customer update error:', error);

    return NextResponse.json(
      { success: false, error: 'Failed to update customer' },
      { status: 500 },
    );
  }
}

// Add customer note or manual timeline event
export async function POST(request: NextRequest) {
  const adminResult = await requireAdmin(request);
  if (adminResult instanceof Response) {
    return adminResult;
  }

  try {
    const body = await request.json();
    const { customerId, type, title, description, metadata } = body;

    // Validate required fields
    if (!customerId || !type || !title) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Create timeline event
    const timelineEvent = {
      id: crypto.randomUUID(),
      customerId,
      type,
      title,
      description: description || '',
      timestamp: new Date().toISOString(),
      metadata: {
        ...metadata,
        adminUser: (adminResult as any).username,
        source: 'admin_manual',
      },
      severity: 'info' as const,
      source: 'manual' as const,
      actor: {
        type: 'admin' as const,
        id: (adminResult as any).username,
        name: (adminResult as any).username,
      },
    };

    // In production, save to database
    console.log('Created timeline event:', timelineEvent);

    return NextResponse.json({
      success: true,
      data: timelineEvent,
    });
  } catch (error) {
    console.error('Timeline event creation error:', error);

    return NextResponse.json(
      { success: false, error: 'Failed to create timeline event' },
      { status: 500 },
    );
  }
}
