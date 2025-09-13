// Role Operations API for team & role management
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import {
  UserRole,
  // Permission,
  UserWithRole,
  // RoleManagementOperation,
  RoleAuditEvent,
  DEFAULT_ROLES,
} from '@/types/roles';
import { featureToggleService } from '@/lib/feature-toggles';
import { impersonationService } from '@/lib/impersonation';

// Mock user database - in production, use your actual database
const generateMockUsers = (count: number = 100): UserWithRole[] => {
  const roles: UserRole[] = ['admin', 'support', 'qa', 'user', 'viewer'];
  const users: UserWithRole[] = [];

  for (let i = 0; i < count; i++) {
    const role = roles[Math.floor(Math.random() * roles.length)];
    const roleDefinition = DEFAULT_ROLES[role];

    users.push({
      id: `user-${i + 1}`,
      email: `user${i + 1}@123legaldoc.com`,
      name: `User ${i + 1}`,
      role,
      permissions: roleDefinition.permissions,
      features: roleDefinition.features,
      createdAt: new Date(
        Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      lastLogin:
        Math.random() > 0.3
          ? new Date(
              Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
            ).toISOString()
          : undefined,
      isActive: Math.random() > 0.1,
      teamId:
        Math.random() > 0.5
          ? `team-${Math.floor(Math.random() * 5) + 1}`
          : undefined,
      managedBy:
        Math.random() > 0.5
          ? `admin-${Math.floor(Math.random() * 3) + 1}`
          : undefined,
      impersonationSettings: {
        allowImpersonation: Math.random() > 0.2,
        maxDuration: [60, 120, 240, 480][Math.floor(Math.random() * 4)],
        auditRequired: true,
      },
    });
  }

  return users;
};

const mockUsersDB = generateMockUsers(150);
let auditEventsDB: RoleAuditEvent[] = [];

function getIpAddress(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  // For local development
  if (process.env.NODE_ENV === 'development') {
      return '127.0.0.1';
  }
  return 'unknown';
}

export async function GET(request: NextRequest) {
  // Require admin authentication
  const adminResult = await requireAdmin(request);
  if (adminResult instanceof Response) {
    return adminResult;
  }

  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const search = url.searchParams.get('search') || '';
    const roleFilter = url.searchParams.get('roleFilter') || 'all';

    switch (action) {
      case 'users':
        return getUsersData(request, { page, limit, search, roleFilter });

      case 'features':
        return getFeaturesData(request);

      case 'audit':
        return getAuditData(request, { page, limit });

      case 'impersonation':
        return getImpersonationData(_request);

      case 'stats':
        return getStatsData(_request);

      default:
        return getDashboardData(request);
    }
  } catch (error) {
    console.error('Role operations API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve role operations data',
      },
      { status: 500 },
    );
  }
}

async function getUsersData(
  request: NextRequest,
  filters: { page: number; limit: number; search: string; roleFilter: string },
) {
  const { page, limit, search, roleFilter } = filters;

  // Filter users
  let filteredUsers = mockUsersDB;

  if (search) {
    const searchLower = search.toLowerCase();
    filteredUsers = filteredUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower),
    );
  }

  if (roleFilter !== 'all') {
    filteredUsers = filteredUsers.filter((user) => user.role === roleFilter);
  }

  // Pagination
  const total = filteredUsers.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginatedUsers = filteredUsers.slice(offset, offset + limit);

  return NextResponse.json({
    success: true,
    data: {
      users: paginatedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    },
  });
}

async function getFeaturesData(_request: NextRequest) {
  const features = featureToggleService.getAllFeatures();

  return NextResponse.json({
    success: true,
    data: {
      features,
      stats: {
        total: features.length,
        enabled: features.filter((f) => f.enabled).length,
        disabled: features.filter((f) => !f.enabled).length,
        byOwner: features.reduce(
          (acc, f) => {
            acc[f.owner] = (acc[f.owner] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        ),
      },
    },
  });
}

async function getAuditData(
  request: NextRequest,
  filters: { page: number; limit: number },
) {
  const { page, limit } = filters;

  // Generate mock audit events if empty
  if (auditEventsDB.length === 0) {
    auditEventsDB = generateMockAuditEvents(200);
  }

  // Sort by timestamp (most recent first)
  const sortedEvents = [...auditEventsDB].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  // Pagination
  const total = sortedEvents.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginatedEvents = sortedEvents.slice(offset, offset + limit);

  return NextResponse.json({
    success: true,
    data: {
      events: paginatedEvents,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    },
  });
}

async function getImpersonationData(_request: NextRequest) {
  const activeSessions = await impersonationService.getActiveSessions();

  return NextResponse.json({
    success: true,
    data: {
      activeSessions,
      stats: {
        totalActive: activeSessions.length,
        totalToday: activeSessions.filter(
          (s) =>
            new Date(s.startedAt).toDateString() === new Date().toDateString(),
        ).length,
      },
    },
  });
}

async function getStatsData(_request: NextRequest) {
  const totalUsers = mockUsersDB.length;
  const activeUsers = mockUsersDB.filter((u) => u.isActive).length;
  const roleDistribution = mockUsersDB.reduce(
    (acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    },
    {} as Record<UserRole, number>,
  );

  const features = featureToggleService.getAllFeatures();
  const activeSessions = await impersonationService.getActiveSessions();

  return NextResponse.json({
    success: true,
    data: {
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers,
        byRole: roleDistribution,
      },
      features: {
        total: features.length,
        enabled: features.filter((f) => f.enabled).length,
        disabled: features.filter((f) => !f.enabled).length,
      },
      impersonation: {
        activeSessions: activeSessions.length,
        todaySessions: activeSessions.filter(
          (s) =>
            new Date(s.startedAt).toDateString() === new Date().toDateString(),
        ).length,
      },
      audit: {
        totalEvents: auditEventsDB.length,
        todayEvents: auditEventsDB.filter(
          (e) =>
            new Date(e.timestamp).toDateString() === new Date().toDateString(),
        ).length,
      },
    },
  });
}

async function getDashboardData(_request: NextRequest) {
  // Return combined dashboard data
  const statsResponse = await getStatsData(_request);
  const impersonationResponse = await getImpersonationData(_request);
  const featuresResponse = await getFeaturesData(_request);

  const statsData = (await statsResponse.json()).data;
  const impersonationData = (await impersonationResponse.json()).data;
  const featuresData = (await featuresResponse.json()).data;

  return NextResponse.json({
    success: true,
    data: {
      stats: statsData,
      activeSessions: impersonationData.activeSessions,
      features: featuresData.features.slice(0, 10), // Top 10 features
      recentUsers: mockUsersDB
        .filter((u) => u.lastLogin)
        .sort(
          (a, b) =>
            new Date(b.lastLogin!).getTime() - new Date(a.lastLogin!).getTime(),
        )
        .slice(0, 5),
    },
  });
}

export async function POST(request: NextRequest) {
  const adminResult = await requireAdmin(request);
  if (adminResult instanceof Response) {
    return adminResult;
  }

  try {
    const body = await request.json();
    const { action, ...params } = body;

    switch (action) {
      case 'assign_role':
        return handleRoleAssignment(request, params, adminResult as any);

      case 'toggle_feature':
        return handleFeatureToggle(request, params, adminResult as any);

      case 'start_impersonation':
        return handleStartImpersonation(request, params, adminResult as any);

      case 'end_impersonation':
        return handleEndImpersonation(request, params, adminResult as any);

      case 'create_user':
        return handleCreateUser(request, params, adminResult as any);

      case 'update_user':
        return handleUpdateUser(request, params, adminResult as any);

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error('Role operations POST error:', error);

    return NextResponse.json(
      { success: false, error: 'Failed to perform role operation' },
      { status: 500 },
    );
  }
}

async function handleRoleAssignment(
  request: NextRequest,
  params: { userId: string; newRole: UserRole; reason: string },
  admin: any,
) {
  const { userId, newRole, reason } = params;

  const userIndex = mockUsersDB.findIndex((user) => user.id === userId);
  if (userIndex === -1) {
    return NextResponse.json(
      { success: false, error: 'User not found' },
      { status: 404 },
    );
  }

  const oldRole = mockUsersDB[userIndex].role;
  const roleDefinition = DEFAULT_ROLES[newRole];

  // Update user role
  mockUsersDB[userIndex] = {
    ...mockUsersDB[userIndex],
    role: newRole,
    permissions: roleDefinition.permissions,
    features: roleDefinition.features,
  };

  // Create audit event
  const auditEvent: RoleAuditEvent = {
    id: crypto.randomUUID(),
    type: 'role_assigned',
    performedBy: admin.username,
    performedByRole: 'admin',
    targetUserId: userId,
    targetRole: newRole,
    description: `Role changed from ${oldRole} to ${newRole} - Reason: ${reason}`,
    timestamp: new Date().toISOString(),
    ipAddress: getIpAddress(request),
    userAgent: request.headers.get('user-agent') || 'unknown',
    metadata: {
      oldRole,
      newRole,
      reason,
    },
  };

  auditEventsDB.push(auditEvent);

  return NextResponse.json({
    success: true,
    data: {
      user: mockUsersDB[userIndex],
      auditEvent,
    },
  });
}

async function handleFeatureToggle(
  request: NextRequest,
  params: { featureKey: string; enabled: boolean },
  admin: any,
) {
  const { featureKey, enabled } = params;

  await featureToggleService.toggleFeature(featureKey, enabled, admin.username);

  // Create audit event
  const auditEvent: RoleAuditEvent = {
    id: crypto.randomUUID(),
    type: 'feature_toggle_changed',
    performedBy: admin.username,
    performedByRole: 'admin',
    targetFeature: featureKey,
    description: `Feature "${featureKey}" ${enabled ? 'enabled' : 'disabled'}`,
    timestamp: new Date().toISOString(),
    ipAddress: getIpAddress(request),
    userAgent: request.headers.get('user-agent') || 'unknown',
    metadata: {
      featureKey,
      enabled,
    },
  };

  auditEventsDB.push(auditEvent);

  return NextResponse.json({
    success: true,
    data: { featureKey, enabled, auditEvent },
  });
}

async function handleStartImpersonation(
  request: NextRequest,
  params: any,
  admin: any,
) {
  const session = await impersonationService.startImpersonation({
    ...params,
    adminId: admin.username,
    adminEmail: admin.email || `${admin.username}@123legaldoc.com`,
    adminRole: 'admin',
    ipAddress: getIpAddress(request),
    userAgent: request.headers.get('user-agent') || 'unknown',
  });

  return NextResponse.json({
    success: true,
    data: { session },
  });
}

type EndImpersonationReason = "timeout" | "manual_end" | "admin_terminated" | "system_terminated";

const validReasons: EndImpersonationReason[] = ["timeout", "manual_end", "admin_terminated", "system_terminated"];

function isValidReason(reason: string): reason is EndImpersonationReason {
    return validReasons.includes(reason as EndImpersonationReason);
}

async function handleEndImpersonation(
  request: NextRequest,
  params: { sessionId: string; reason?: string },
  _admin: any,
) {
  const { sessionId, reason } = params;

  if (reason && !isValidReason(reason)) {
      return NextResponse.json({ success: false, error: 'Invalid reason' }, { status: 400 });
  }

  await impersonationService.endImpersonation(sessionId, reason as EndImpersonationReason | undefined);

  return NextResponse.json({
    success: true,
    data: { sessionId, ended: true },
  });
}

async function handleCreateUser(
  request: NextRequest,
  params: { email: string; name: string; role: UserRole },
  admin: any,
) {
  const { email, name, role } = params;

  // Check if user already exists
  if (mockUsersDB.find((user) => user.email === email)) {
    return NextResponse.json(
      { success: false, error: 'User with this email already exists' },
      { status: 400 },
    );
  }

  const roleDefinition = DEFAULT_ROLES[role];
  const newUser: UserWithRole = {
    id: `user-${Date.now()}`,
    email,
    name,
    role,
    permissions: roleDefinition.permissions,
    features: roleDefinition.features,
    createdAt: new Date().toISOString(),
    isActive: true,
    impersonationSettings: {
      allowImpersonation: true,
      maxDuration: 120,
      auditRequired: true,
    },
  };

  mockUsersDB.push(newUser);

  // Create audit event
  const auditEvent: RoleAuditEvent = {
    id: crypto.randomUUID(),
    type: 'role_assigned',
    performedBy: admin.username,
    performedByRole: 'admin',
    targetUserId: newUser.id,
    targetRole: role,
    description: `Created new user ${email} with role ${role}`,
    timestamp: new Date().toISOString(),
    ipAddress: getIpAddress(request),
    userAgent: request.headers.get('user-agent') || 'unknown',
    metadata: {
      email,
      name,
      role,
      action: 'create_user',
    },
  };

  auditEventsDB.push(auditEvent);

  return NextResponse.json({
    success: true,
    data: { user: newUser, auditEvent },
  });
}

async function handleUpdateUser(
  request: NextRequest,
  params: { userId: string; updates: Partial<UserWithRole> },
  admin: any,
) {
  const { userId, updates } = params;

  const userIndex = mockUsersDB.findIndex((user) => user.id === userId);
  if (userIndex === -1) {
    return NextResponse.json(
      { success: false, error: 'User not found' },
      { status: 404 },
    );
  }

  const oldUser = { ...mockUsersDB[userIndex] };
  mockUsersDB[userIndex] = { ...mockUsersDB[userIndex], ...updates };

  // Create audit event
  const auditEvent: RoleAuditEvent = {
    id: crypto.randomUUID(),
    type: 'user_activated', // or other appropriate type
    performedBy: admin.username,
    performedByRole: 'admin',
    targetUserId: userId,
    description: `Updated user ${oldUser.email}`,
    timestamp: new Date().toISOString(),
    ipAddress: getIpAddress(request),
    userAgent: request.headers.get('user-agent') || 'unknown',
    metadata: {
      updates,
      oldValues: oldUser,
    },
  };

  auditEventsDB.push(auditEvent);

  return NextResponse.json({
    success: true,
    data: { user: mockUsersDB[userIndex], auditEvent },
  });
}

// Helper function to generate mock audit events
function generateMockAuditEvents(count: number): RoleAuditEvent[] {
  const events: RoleAuditEvent[] = [];
  const eventTypes: RoleAuditEvent['type'][] = [
    'role_assigned',
    'role_removed',
    'permission_granted',
    'permission_revoked',
    'impersonation_started',
    'impersonation_ended',
    'feature_toggle_changed',
    'user_activated',
    'user_deactivated',
  ];

  for (let i = 0; i < count; i++) {
    events.push({
      id: `event-${i + 1}`,
      type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      performedBy: `admin-${Math.floor(Math.random() * 5) + 1}`,
      performedByRole: 'admin',
      targetUserId: `user-${Math.floor(Math.random() * 100) + 1}`,
      description: `Mock audit event ${i + 1} - automated system activity`,
      timestamp: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      userAgent: 'Mozilla/5.0 (Admin Dashboard)',
    });
  }

  return events;
}
