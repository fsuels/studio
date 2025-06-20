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
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  Shield,
  Settings,
  Eye,
  UserCheck,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  BarChart3,
  ToggleLeft,
  ToggleRight,
  UserX,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Timer,
  Calendar,
  LogOut,
  PlayCircle,
  StopCircle,
} from 'lucide-react';
import { 
  UserRole, 
  Permission, 
  DEFAULT_ROLES, 
  UserWithRole,
  ImpersonationSession,
  FeatureToggle,
  RoleAuditEvent,
} from '@/types/roles';
import { featureToggleService, FeatureUtils } from '@/lib/feature-toggles';
import { impersonationService, ImpersonationUtils } from '@/lib/impersonation';

interface RoleManagementDashboardProps {
  currentUserRole: UserRole;
  currentUserId: string;
}

// Mock data generators
const generateMockUsers = (count: number = 50): UserWithRole[] => {
  const roles: UserRole[] = ['admin', 'support', 'qa', 'user', 'viewer'];
  const users: UserWithRole[] = [];
  
  for (let i = 0; i < count; i++) {
    const role = roles[Math.floor(Math.random() * roles.length)];
    const roleDefinition = DEFAULT_ROLES[role];
    
    users.push({
      id: `user-${i + 1}`,
      email: `user${i + 1}@example.com`,
      name: `User ${i + 1}`,
      role,
      permissions: roleDefinition.permissions,
      features: roleDefinition.features,
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      lastLogin: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      isActive: Math.random() > 0.1,
      teamId: Math.random() > 0.5 ? `team-${Math.floor(Math.random() * 5) + 1}` : undefined,
      impersonationSettings: {
        allowImpersonation: Math.random() > 0.2,
        maxDuration: 120,
        auditRequired: true,
      },
    });
  }
  
  return users;
};

const generateMockAuditEvents = (count: number = 100): RoleAuditEvent[] => {
  const events: RoleAuditEvent[] = [];
  const eventTypes: RoleAuditEvent['type'][] = [
    'role_assigned', 'role_removed', 'permission_granted', 'permission_revoked',
    'impersonation_started', 'impersonation_ended', 'feature_toggle_changed'
  ];
  
  for (let i = 0; i < count; i++) {
    events.push({
      id: `event-${i + 1}`,
      type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      performedBy: `admin-${Math.floor(Math.random() * 5) + 1}`,
      performedByRole: 'admin',
      targetUserId: `user-${Math.floor(Math.random() * 50) + 1}`,
      description: `Mock audit event ${i + 1}`,
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      userAgent: 'Mozilla/5.0 Admin Dashboard',
    });
  }
  
  return events;
};

export default function RoleManagementDashboard({ 
  currentUserRole, 
  currentUserId 
}: RoleManagementDashboardProps) {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [activeSessions, setActiveSessions] = useState<ImpersonationSession[]>([]);
  const [features, setFeatures] = useState<FeatureToggle[]>([]);
  const [auditEvents, setAuditEvents] = useState<RoleAuditEvent[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');

  useEffect(() => {
    // Load initial data
    setUsers(generateMockUsers(50));
    setFeatures(featureToggleService.getAllFeatures());
    setAuditEvents(generateMockAuditEvents(100));
    
    // Load active impersonation sessions
    impersonationService.getActiveSessions().then(setActiveSessions);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const canManageRoles = currentUserRole === 'super_admin' || currentUserRole === 'admin';
  const canImpersonate = ['super_admin', 'admin', 'support'].includes(currentUserRole);
  const canManageFeatures = FeatureUtils.canManageFeatures(currentUserRole);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, role: newRole, permissions: DEFAULT_ROLES[newRole].permissions }
        : user
    ));
    
    // In production, make API call to update role
    console.log(`Changed user ${userId} role to ${newRole}`);
  };

  const handleFeatureToggle = async (featureKey: string, enabled: boolean) => {
    await featureToggleService.toggleFeature(featureKey, enabled, currentUserId);
    setFeatures(featureToggleService.getAllFeatures());
  };

  const handleStartImpersonation = async (targetUser: UserWithRole) => {
    if (!canImpersonate) return;
    
    try {
      const session = await impersonationService.startImpersonation({
        adminId: currentUserId,
        adminEmail: 'admin@example.com',
        adminRole: currentUserRole,
        targetUserId: targetUser.id,
        targetUserEmail: targetUser.email,
        targetUserRole: targetUser.role,
        reason: 'Customer support assistance',
        ipAddress: '192.168.1.100',
        userAgent: navigator.userAgent,
      });
      
      setActiveSessions(prev => [...prev, session]);
      setIsImpersonating(true);
    } catch (error) {
      console.error('Failed to start impersonation:', error);
    }
  };

  const handleEndImpersonation = async (sessionId: string) => {
    await impersonationService.endImpersonation(sessionId);
    setActiveSessions(prev => prev.filter(s => s.id !== sessionId));
    setIsImpersonating(false);
  };

  const getRoleColor = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      super_admin: 'bg-red-100 text-red-800',
      admin: 'bg-purple-100 text-purple-800',
      support: 'bg-blue-100 text-blue-800',
      qa: 'bg-green-100 text-green-800',
      user: 'bg-gray-100 text-gray-800',
      viewer: 'bg-yellow-100 text-yellow-800',
    };
    return colors[role];
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team & Role Operations</h1>
          <p className="text-gray-600 mt-1">
            Manage roles, permissions, feature toggles, and user impersonation
          </p>
        </div>
        <div className="flex gap-2">
          {canManageRoles && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          )}
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                <p className="text-2xl font-bold text-orange-600">{activeSessions.length}</p>
              </div>
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Feature Flags</p>
                <p className="text-2xl font-bold text-purple-600">{features.length}</p>
              </div>
              <Settings className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admin Users</p>
                <p className="text-2xl font-bold text-red-600">
                  {users.filter(u => ['super_admin', 'admin'].includes(u.role)).length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="impersonation">Active Sessions</TabsTrigger>
          <TabsTrigger value="features">Feature Toggles</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as any)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="qa">QA</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.slice(0, 20).map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)} variant="outline">
                          {user.role.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.isActive ? (
                          <Badge className="bg-green-100 text-green-800" variant="outline">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800" variant="outline">
                            <XCircle className="h-3 w-3 mr-1" />
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {user.permissions.length} permissions
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {canImpersonate && impersonationService.canImpersonate(currentUserRole, user.role) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStartImpersonation(user)}
                            >
                              <UserCheck className="h-4 w-4" />
                            </Button>
                          )}
                          {canManageRoles && (
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
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

        {/* Active Impersonation Sessions Tab */}
        <TabsContent value="impersonation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Active Impersonation Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeSessions.length === 0 ? (
                <div className="text-center py-8">
                  <UserX className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No Active Sessions</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    No impersonation sessions are currently active.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Admin</TableHead>
                      <TableHead>Target User</TableHead>
                      <TableHead>Started</TableHead>
                      <TableHead>Time Remaining</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>{session.adminEmail}</TableCell>
                        <TableCell>{session.targetUserEmail}</TableCell>
                        <TableCell>{formatDate(session.startedAt)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Timer className="h-4 w-4 text-orange-500" />
                            {ImpersonationUtils.formatDuration(
                              ImpersonationUtils.getTimeRemaining(session)
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{session.reason}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEndImpersonation(session.id)}
                          >
                            <StopCircle className="h-4 w-4 mr-2" />
                            End Session
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feature Toggles Tab */}
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Feature Toggle Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {features.map((feature) => (
                  <div key={feature.key} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900">{feature.name}</h3>
                        <div className="flex gap-1">
                          {feature.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Owner: {feature.owner}</span>
                        {feature.rolloutStrategy.type === 'percentage' && (
                          <span>Rollout: {feature.rolloutStrategy.percentage}%</span>
                        )}
                        {feature.rolloutStrategy.type === 'roles' && (
                          <span>Roles: {feature.rolloutStrategy.roles?.join(', ')}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {feature.rolloutStrategy.type === 'percentage' && (
                        <div className="w-24">
                          <Progress value={feature.rolloutStrategy.percentage || 0} />
                        </div>
                      )}
                      <Switch
                        checked={feature.enabled}
                        onCheckedChange={(enabled) => handleFeatureToggle(feature.key, enabled)}
                        disabled={!canManageFeatures}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Trail Tab */}
        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Role Operations Audit Trail
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Performed By</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditEvents.slice(0, 20).map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>{formatDate(event.timestamp)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {event.type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{event.performedBy}</TableCell>
                      <TableCell>{event.targetUserId || '-'}</TableCell>
                      <TableCell className="max-w-md truncate">{event.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Detail Modal */}
      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>User Details: {selectedUser.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Role</label>
                  <Badge className={getRoleColor(selectedUser.role)} variant="outline">
                    {selectedUser.role.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <p className={selectedUser.isActive ? 'text-green-600' : 'text-red-600'}>
                    {selectedUser.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Login</label>
                  <p className="text-gray-900">
                    {selectedUser.lastLogin ? formatDate(selectedUser.lastLogin) : 'Never'}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Permissions</label>
                <div className="flex flex-wrap gap-1">
                  {selectedUser.permissions.map(permission => (
                    <Badge key={permission} variant="outline" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Features</label>
                <div className="flex flex-wrap gap-1">
                  {selectedUser.features.map(feature => (
                    <Badge key={feature} variant="outline" className="text-xs bg-blue-50">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}