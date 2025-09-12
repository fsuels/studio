import jwt from 'jsonwebtoken';
import { TenantInvite, TenantUserRole, TenantPermission } from '@/types/tenant';

// JWT secret for invitation tokens (should be in environment variables)
const INVITE_JWT_SECRET =
  process.env.TENANT_INVITE_JWT_SECRET || 'your-super-secret-invite-key';
const INVITE_EXPIRY_HOURS = 72; // 3 days

export interface InviteTokenPayload {
  inviteId: string;
  tenantId: string;
  email: string;
  role: TenantUserRole;
  permissions: TenantPermission[];
  invitedBy: string;
  iat: number;
  exp: number;
}

export async function createInviteToken(
  invite: Omit<
    TenantInvite,
    'id' | 'token' | 'createdAt' | 'status' | 'usesCount'
  >,
): Promise<string> {
  const payload: Partial<InviteTokenPayload> = {
    inviteId: generateInviteId(),
    tenantId: invite.tenantId,
    email: invite.email,
    role: invite.role,
    permissions: invite.permissions,
    invitedBy: invite.invitedBy,
  };

  const token = jwt.sign(payload, INVITE_JWT_SECRET, {
    expiresIn: `${INVITE_EXPIRY_HOURS}h`,
    issuer: '123legaldoc-tenant-invites',
    audience: 'tenant-invite',
  });

  return token;
}

export async function validateInviteToken(
  token: string,
  tenantId?: string,
): Promise<TenantInvite | null> {
  try {
    const decoded = jwt.verify(token, INVITE_JWT_SECRET, {
      issuer: '123legaldoc-tenant-invites',
      audience: 'tenant-invite',
    }) as InviteTokenPayload;

    // Additional tenant validation if provided
    if (tenantId && decoded.tenantId !== tenantId) {
      return null;
    }

    // Check if invitation exists in database and is still valid
    const invitation = await getInvitationFromDatabase(decoded.inviteId);

    if (!invitation) {
      return null;
    }

    // Check if already accepted or expired
    if (invitation.status === 'accepted' || invitation.status === 'expired') {
      return invitation;
    }

    // Check manual expiration
    const now = new Date();
    const expiresAt = new Date(invitation.expiresAt);
    if (now > expiresAt) {
      await updateInvitationStatus(invitation.id, 'expired');
      return { ...invitation, status: 'expired' };
    }

    // Check max uses
    if (invitation.maxUses && invitation.usesCount >= invitation.maxUses) {
      await updateInvitationStatus(invitation.id, 'expired');
      return { ...invitation, status: 'expired' };
    }

    return invitation;
  } catch (error) {
    console.error('Error validating invite token:', error);
    return null;
  }
}

export async function acceptInvitation(
  token: string,
  userInfo: {
    firstName: string;
    lastName: string;
    password: string;
  },
): Promise<{ success: boolean; tenantUser?: TenantUser; error?: string }> {
  try {
    const invitation = await validateInviteToken(token);

    if (!invitation) {
      return { success: false, error: 'Invalid or expired invitation' };
    }

    if (invitation.status !== 'pending') {
      return {
        success: false,
        error: 'Invitation has already been used or expired',
      };
    }

    // Create or update user account
    const user = await createOrUpdateUser({
      email: invitation.email,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      password: userInfo.password,
    });

    if (!user) {
      return { success: false, error: 'Failed to create user account' };
    }

    // Create tenant user relationship
    const tenantUser = await createTenantUser({
      tenantId: invitation.tenantId,
      userId: user.id,
      role: invitation.role,
      permissions: invitation.permissions,
      invitedBy: invitation.invitedBy,
    });

    // Mark invitation as accepted
    await updateInvitationStatus(invitation.id, 'accepted');
    await incrementInvitationUses(invitation.id);

    // Log audit event
    await logTenantAuditEvent({
      tenantId: invitation.tenantId,
      userId: user.id,
      action: 'user.added',
      description: `User ${user.email} accepted invitation and joined tenant`,
      metadata: {
        invitationId: invitation.id,
        role: invitation.role,
        invitedBy: invitation.invitedBy,
      },
    });

    return { success: true, tenantUser };
  } catch (error) {
    console.error('Error accepting invitation:', error);
    return { success: false, error: 'Failed to process invitation' };
  }
}

export async function createTenantInvitation(params: {
  tenantId: string;
  email: string;
  role: TenantUserRole;
  permissions: TenantPermission[];
  invitedBy: string;
  inviteMessage?: string;
  expiresInHours?: number;
  maxUses?: number;
}): Promise<{ invitation: TenantInvite; token: string }> {
  const expiresAt = new Date();
  expiresAt.setHours(
    expiresAt.getHours() + (params.expiresInHours || INVITE_EXPIRY_HOURS),
  );

  // Create invitation record
  const invitation: Omit<TenantInvite, 'id' | 'token' | 'createdAt'> = {
    tenantId: params.tenantId,
    email: params.email,
    role: params.role,
    permissions: params.permissions,
    invitedBy: params.invitedBy,
    inviteMessage: params.inviteMessage,
    expiresAt: expiresAt.toISOString(),
    status: 'pending',
    maxUses: params.maxUses,
    usesCount: 0,
  };

  // Generate token
  const token = await createInviteToken(invitation);

  // Save to database
  const savedInvitation = await saveInvitationToDatabase({
    ...invitation,
    token,
  });

  return { invitation: savedInvitation, token };
}

export async function revokeInvitation(
  invitationId: string,
  revokedBy: string,
): Promise<boolean> {
  try {
    await updateInvitationStatus(invitationId, 'revoked');

    // Log audit event
    const invitation = await getInvitationFromDatabase(invitationId);
    if (invitation) {
      await logTenantAuditEvent({
        tenantId: invitation.tenantId,
        userId: revokedBy,
        action: 'user.invitation_revoked',
        description: `Invitation for ${invitation.email} was revoked`,
        metadata: { invitationId, originalRole: invitation.role },
      });
    }

    return true;
  } catch (error) {
    console.error('Error revoking invitation:', error);
    return false;
  }
}

export async function getInvitationsByTenant(
  _tenantId: string,
): Promise<TenantInvite[]> {
  // TODO: Implement database query
  // Query Firestore for invitations by tenant
  return [];
}

export async function getInvitationsByEmail(
  _email: string,
): Promise<TenantInvite[]> {
  // TODO: Implement database query
  // Query Firestore for invitations by email
  return [];
}

// Helper functions - these would connect to your actual database

async function getInvitationFromDatabase(
  inviteId: string,
): Promise<TenantInvite | null> {
  // TODO: Implement Firebase query
  // Query Firestore for invitation by ID
  return null;
}

async function saveInvitationToDatabase(
  invitation: Omit<TenantInvite, 'id' | 'createdAt'> & { token: string },
): Promise<TenantInvite> {
  // TODO: Implement Firebase save
  // Save invitation to Firestore
  const now = new Date().toISOString();
  return {
    id: generateInviteId(),
    createdAt: now,
    ...invitation,
  } as TenantInvite;
}

async function updateInvitationStatus(
  _invitationId: string,
  _status: TenantInvite['status'],
): Promise<void> {
  // TODO: Implement Firebase update
  // Update invitation status in Firestore
}

async function incrementInvitationUses(_invitationId: string): Promise<void> {
  // TODO: Implement Firebase update
  // Increment usesCount in Firestore
}

async function createOrUpdateUser(userInfo: {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}): Promise<{ id: string; email: string } | null> {
  // TODO: Implement user creation/update with Firebase Auth
  // Create user in Firebase Auth and Firestore
  return {
    id: 'user-' + Date.now(),
    email: userInfo.email,
  };
}

interface TenantUser {
  tenantId: string;
  userId: string;
  role: TenantUserRole;
  permissions: TenantPermission[];
  invitedBy: string;
}

async function createTenantUser(params: {
  tenantId: string;
  userId: string;
  role: TenantUserRole;
  permissions: TenantPermission[];
  invitedBy: string;
}): Promise<TenantUser> {
  // TODO: Implement tenant user creation
  // Create tenant user relationship in Firestore
  return params;
}

async function logTenantAuditEvent(_event: {
  tenantId: string;
  userId: string;
  action: string;
  description: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  // TODO: Implement audit logging
  // Log event to Firestore audit collection
}

function generateInviteId(): string {
  return 'invite_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Utility to generate secure invite URLs
export function generateInviteUrl(
  tenantSlug: string,
  token: string,
  baseUrl?: string,
): string {
  const base =
    baseUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://123legaldoc.com';
  return `${base}/tenant/${tenantSlug}/room/${token}`;
}
