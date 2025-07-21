// src/lib/collaboration/auth.ts
import { auth } from '@/lib/firebase-admin';
import { firestore } from '@/lib/firebase-admin';
import { CollaboratorInfo } from './yjs-server';

export interface CollaborationToken {
  userId: string;
  documentId: string;
  role: 'owner' | 'editor' | 'reviewer' | 'viewer';
  expiresAt: number;
  permissions: string[];
}

export async function authenticateCollaborator(
  token: string,
): Promise<CollaboratorInfo | null> {
  try {
    // First, try Firebase Auth token
    const decodedToken = await auth.verifyIdToken(token);

    if (decodedToken) {
      const user = await getUserInfo(decodedToken.uid);
      return user;
    }

    return null;
  } catch (error) {
    // If Firebase auth fails, try collaboration-specific token
    try {
      const collaborationToken = await verifyCollaborationToken(token);
      if (collaborationToken) {
        const user = await getUserInfo(collaborationToken.userId);
        return user;
      }
    } catch (collabError) {
      console.error('Collaboration token verification failed:', collabError);
    }

    console.error('Authentication failed:', error);
    return null;
  }
}

export async function authorizeDocumentAccess(
  documentId: string,
  userId: string,
): Promise<boolean> {
  try {
    // Check if user is document owner
    const docRef = firestore.collection('documents').doc(documentId);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      return false;
    }

    const docData = docSnapshot.data();

    // Owner always has access
    if (docData?.ownerId === userId) {
      return true;
    }

    // Check collaborators list
    const collaborators = docData?.collaborators || [];
    const userCollaboration = collaborators.find(
      (c: any) => c.userId === userId,
    );

    if (userCollaboration) {
      return true;
    }

    // Check if document allows public access
    if (docData?.settings?.allowAnonymous) {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Authorization check failed:', error);
    return false;
  }
}

export async function getUserInfo(
  userId: string,
): Promise<CollaboratorInfo | null> {
  try {
    // Get user from Firebase Auth
    const userRecord = await auth.getUser(userId);

    // Get additional user info from Firestore
    const userDoc = await firestore.collection('users').doc(userId).get();
    const userData = userDoc.data();

    return {
      id: userId,
      name: userRecord.displayName || userData?.name || 'Unknown User',
      email: userRecord.email || userData?.email || '',
      avatar: userRecord.photoURL || userData?.avatar,
      role: userData?.defaultRole || 'viewer',
      color: userData?.collaborationColor || generateUserColor(userId),
    };
  } catch (error) {
    console.error('Failed to get user info:', error);
    return null;
  }
}

export async function generateCollaborationToken(
  userId: string,
  documentId: string,
  role: string,
  expiresIn: number = 3600000, // 1 hour
): Promise<string> {
  const token: CollaborationToken = {
    userId,
    documentId,
    role: role as any,
    expiresAt: Date.now() + expiresIn,
    permissions: getRolePermissions(role),
  };

  // In production, use proper JWT signing
  const tokenString = Buffer.from(JSON.stringify(token)).toString('base64');

  // Store token in Redis for validation
  const redis = require('./redis-config').createRedisConnection();
  await redis.setex(
    `collab_token:${tokenString}`,
    Math.floor(expiresIn / 1000),
    JSON.stringify(token),
  );

  return tokenString;
}

export async function verifyCollaborationToken(
  token: string,
): Promise<CollaborationToken | null> {
  try {
    const redis = require('./redis-config').createRedisConnection();
    const tokenData = await redis.get(`collab_token:${token}`);

    if (!tokenData) {
      return null;
    }

    const parsedToken: CollaborationToken = JSON.parse(tokenData);

    // Check expiration
    if (parsedToken.expiresAt < Date.now()) {
      await redis.del(`collab_token:${token}`);
      return null;
    }

    return parsedToken;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export function getRolePermissions(role: string): string[] {
  const permissions: Record<string, string[]> = {
    owner: [
      'read',
      'write',
      'comment',
      'resolve_comments',
      'invite_users',
      'manage_permissions',
      'delete_document',
      'view_history',
      'restore_version',
    ],
    editor: ['read', 'write', 'comment', 'resolve_comments', 'view_history'],
    reviewer: ['read', 'comment', 'view_history'],
    viewer: ['read', 'view_history'],
  };

  return permissions[role] || permissions.viewer;
}

export async function checkPermission(
  userId: string,
  documentId: string,
  permission: string,
): Promise<boolean> {
  try {
    // Get user's role for this document
    const docRef = firestore.collection('documents').doc(documentId);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      return false;
    }

    const docData = docSnapshot.data();

    let userRole = 'viewer';

    // Check if owner
    if (docData?.ownerId === userId) {
      userRole = 'owner';
    } else {
      // Check collaborators
      const collaborators = docData?.collaborators || [];
      const userCollaboration = collaborators.find(
        (c: any) => c.userId === userId,
      );
      if (userCollaboration) {
        userRole = userCollaboration.role;
      }
    }

    const permissions = getRolePermissions(userRole);
    return permissions.includes(permission);
  } catch (error) {
    console.error('Permission check failed:', error);
    return false;
  }
}

export async function inviteCollaborator(
  documentId: string,
  inviterUserId: string,
  inviteeEmail: string,
  role: string,
): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    // Check if inviter has permission to invite
    const canInvite = await checkPermission(
      inviterUserId,
      documentId,
      'invite_users',
    );

    if (!canInvite) {
      return { success: false, error: 'Permission denied' };
    }

    // Try to find user by email
    let inviteeUserId: string | null = null;

    try {
      const userRecord = await auth.getUserByEmail(inviteeEmail);
      inviteeUserId = userRecord.uid;
    } catch (error) {
      // User doesn't exist, we'll create a pending invitation
    }

    const invitationId = generateInvitationId();

    // Store invitation
    await firestore
      .collection('collaboration_invitations')
      .doc(invitationId)
      .set({
        documentId,
        inviterUserId,
        inviteeEmail,
        inviteeUserId,
        role,
        status: 'pending',
        createdAt: Date.now(),
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      });

    // Generate collaboration token
    const token = await generateCollaborationToken(
      inviteeUserId || `invite:${invitationId}`,
      documentId,
      role,
    );

    // Send email invitation (implement with your email service)
    await sendInvitationEmail(inviteeEmail, documentId, token, role);

    return { success: true, token };
  } catch (error) {
    console.error('Failed to invite collaborator:', error);
    return { success: false, error: 'Failed to send invitation' };
  }
}

export async function acceptInvitation(
  invitationId: string,
  userId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const invitationRef = firestore
      .collection('collaboration_invitations')
      .doc(invitationId);
    const invitationSnapshot = await invitationRef.get();

    if (!invitationSnapshot.exists) {
      return { success: false, error: 'Invitation not found' };
    }

    const invitation = invitationSnapshot.data();

    if (invitation?.status !== 'pending') {
      return { success: false, error: 'Invitation already processed' };
    }

    if (invitation?.expiresAt < Date.now()) {
      return { success: false, error: 'Invitation expired' };
    }

    // Add user to document collaborators
    const docRef = firestore.collection('documents').doc(invitation.documentId);

    await firestore.runTransaction(async (transaction) => {
      const docSnapshot = await transaction.get(docRef);

      if (!docSnapshot.exists) {
        throw new Error('Document not found');
      }

      const docData = docSnapshot.data();
      const collaborators = docData?.collaborators || [];

      // Check if user is already a collaborator
      if (!collaborators.find((c: any) => c.userId === userId)) {
        collaborators.push({
          userId,
          role: invitation.role,
          addedAt: Date.now(),
          addedBy: invitation.inviterUserId,
        });

        transaction.update(docRef, { collaborators });
      }

      // Mark invitation as accepted
      transaction.update(invitationRef, {
        status: 'accepted',
        acceptedAt: Date.now(),
        acceptedBy: userId,
      });
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to accept invitation:', error);
    return { success: false, error: 'Failed to accept invitation' };
  }
}

function generateUserColor(userId: string): string {
  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEAA7',
    '#DDA0DD',
    '#98D8C8',
    '#FFB6C1',
    '#FF8A80',
    '#82B1FF',
    '#B9F6CA',
    '#FFE57F',
  ];

  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

function generateInvitationId(): string {
  return Math.random().toString(36).substr(2, 16);
}

async function sendInvitationEmail(
  email: string,
  documentId: string,
  token: string,
  role: string,
): Promise<void> {
  // Implement email sending logic
  // This could use SendGrid, AWS SES, or your preferred email service

  const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/collaborate/${documentId}?token=${token}`;

  console.log(`Invitation email would be sent to ${email}:`);
  console.log(`Role: ${role}`);
  console.log(`URL: ${invitationUrl}`);

  // TODO: Implement actual email sending
}
