// Stream Chat integration for tenant-specific chat rooms
import { StreamChat, Channel, User as StreamUser } from 'stream-chat';
import { TenantChatRoom, Tenant, TenantUser } from '@/types/tenant';

interface StreamChatConfig {
  apiKey: string;
  apiSecret: string;
}

interface TenantChatUser extends StreamUser {
  id: string;
  name: string;
  email: string;
  tenantId: string;
  tenantRole: string;
  avatar?: string;
}

class TenantStreamChatManager {
  private client: StreamChat;
  private config: StreamChatConfig;

  constructor(config: StreamChatConfig) {
    this.config = config;
    this.client = StreamChat.getInstance(config.apiKey, config.apiSecret);
  }

  // Create a new tenant chat room
  async createTenantChatRoom(params: {
    tenantId: string;
    roomName: string;
    roomType: 'general' | 'document' | 'support' | 'private';
    createdBy: string;
    members: string[];
    documentId?: string;
    isPrivate?: boolean;
  }): Promise<TenantChatRoom> {
    try {
      const channelId = this.generateChannelId(
        params.tenantId,
        params.roomName,
      );
      const channelType = params.isPrivate ? 'messaging' : 'team';

      // Create Stream Chat channel
      const channel = this.client.channel(channelType, channelId, {
        name: params.roomName,
        created_by_id: params.createdBy,
        members: params.members,
        tenant_id: params.tenantId,
        document_id: params.documentId,
        room_type: params.roomType,
        is_private: params.isPrivate || false,
      });

      await channel.create();

      // Create tenant chat room record
      const chatRoom: TenantChatRoom = {
        id: `room_${Date.now()}`,
        tenantId: params.tenantId,
        documentId: params.documentId,
        name: params.roomName,
        type: params.roomType,
        streamChannelId: channelId,
        streamChannelType: channelType,
        members: params.members,
        admins: [params.createdBy],
        isPrivate: params.isPrivate || false,
        allowGuestAccess: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: params.createdBy,
      };

      return chatRoom;
    } catch (error) {
      console.error('Error creating tenant chat room:', error);
      throw error;
    }
  }

  // Create or update Stream Chat user for tenant context
  async createTenantChatUser(
    tenantUser: TenantUser,
    tenant: Tenant,
    userInfo: {
      name: string;
      email: string;
      avatar?: string;
    },
  ): Promise<TenantChatUser> {
    const chatUser: TenantChatUser = {
      id: `${tenant.id}_${tenantUser.userId}`,
      name: userInfo.name,
      email: userInfo.email,
      tenantId: tenant.id,
      tenantRole: tenantUser.role,
      avatar: userInfo.avatar || `https://avatar.vercel.sh/${userInfo.email}`,
      // Additional metadata
      tenant_name: tenant.name,
      tenant_plan: tenant.subscription.plan,
      user_status: tenantUser.status,
    };

    await this.client.upsertUser(chatUser);
    return chatUser;
  }

  // Generate authentication token for tenant user
  generateTenantUserToken(tenantId: string, userId: string): string {
    const chatUserId = `${tenantId}_${userId}`;
    return this.client.createToken(chatUserId);
  }

  // Add member to tenant chat room
  async addMemberToRoom(
    roomId: string,
    userId: string,
    role: 'member' | 'moderator' = 'member',
  ): Promise<boolean> {
    try {
      const channel = await this.getTenantChannel(roomId);
      if (!channel) {
        throw new Error('Channel not found');
      }

      await channel.addMembers([userId], { role });
      return true;
    } catch (error) {
      console.error('Error adding member to room:', error);
      return false;
    }
  }

  // Remove member from tenant chat room
  async removeMemberFromRoom(roomId: string, userId: string): Promise<boolean> {
    try {
      const channel = await this.getTenantChannel(roomId);
      if (!channel) {
        throw new Error('Channel not found');
      }

      await channel.removeMembers([userId]);
      return true;
    } catch (error) {
      console.error('Error removing member from room:', error);
      return false;
    }
  }

  // Get tenant-specific channels for a user
  async getTenantChannelsForUser(
    tenantId: string,
    userId: string,
  ): Promise<Channel[]> {
    try {
      const chatUserId = `${tenantId}_${userId}`;
      const filter = {
        members: { $in: [chatUserId] },
        tenant_id: tenantId,
      };

      const channels = await this.client.queryChannels(filter, {
        last_message_at: -1,
      });
      return channels;
    } catch (error) {
      console.error('Error getting tenant channels:', error);
      return [];
    }
  }

  // Create document-specific chat room
  async createDocumentChatRoom(params: {
    tenantId: string;
    documentId: string;
    documentTitle: string;
    createdBy: string;
    collaborators: string[];
  }): Promise<TenantChatRoom> {
    return await this.createTenantChatRoom({
      tenantId: params.tenantId,
      roomName: `${params.documentTitle} - Discussion`,
      roomType: 'document',
      createdBy: params.createdBy,
      members: params.collaborators,
      documentId: params.documentId,
      isPrivate: true,
    });
  }

  // Send system message to chat room
  async sendSystemMessage(
    roomId: string,
    message: string,
    metadata?: Record<string, any>,
  ): Promise<boolean> {
    try {
      const channel = await this.getTenantChannel(roomId);
      if (!channel) {
        return false;
      }

      await channel.sendMessage({
        text: message,
        user_id: 'system',
        type: 'system',
        custom: metadata,
      });

      return true;
    } catch (error) {
      console.error('Error sending system message:', error);
      return false;
    }
  }

  // Mute/unmute user in tenant room
  async muteUserInRoom(
    roomId: string,
    userId: string,
    muted: boolean,
    duration?: number,
  ): Promise<boolean> {
    try {
      const channel = await this.getTenantChannel(roomId);
      if (!channel) {
        return false;
      }

      if (muted) {
        await channel.muteUser(userId, { timeout: duration });
      } else {
        await channel.unmuteUser(userId);
      }

      return true;
    } catch (error) {
      console.error('Error muting/unmuting user:', error);
      return false;
    }
  }

  // Delete tenant chat room
  async deleteTenantChatRoom(roomId: string): Promise<boolean> {
    try {
      const channel = await this.getTenantChannel(roomId);
      if (!channel) {
        return true; // Already deleted
      }

      await channel.delete();
      return true;
    } catch (error) {
      console.error('Error deleting tenant chat room:', error);
      return false;
    }
  }

  // Export chat history for compliance
  async exportChatHistory(
    roomId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<any[]> {
    try {
      const channel = await this.getTenantChannel(roomId);
      if (!channel) {
        return [];
      }

      const filter: any = {};
      if (startDate) filter.created_at = { $gte: startDate.toISOString() };
      if (endDate)
        filter.created_at = {
          ...filter.created_at,
          $lte: endDate.toISOString(),
        };

      const messages = await channel.query({
        messages: { limit: 1000, ...filter },
      });

      return messages.messages || [];
    } catch (error) {
      console.error('Error exporting chat history:', error);
      return [];
    }
  }

  // Get channel analytics
  async getChannelAnalytics(roomId: string): Promise<any> {
    try {
      const channel = await this.getTenantChannel(roomId);
      if (!channel) {
        return null;
      }

      // Get basic channel stats
      const state = channel.state;
      return {
        memberCount: state.memberCount,
        messageCount: state.messages.length,
        lastActivity: state.last_message_at,
        createdAt: state.created_at,
        isOnline: state.isOnline,
        typing: state.typing,
        watchers: state.watchers,
      };
    } catch (error) {
      console.error('Error getting channel analytics:', error);
      return null;
    }
  }

  // Private helper methods
  private async getTenantChannel(roomId: string): Promise<Channel | null> {
    try {
      // Extract channel info from room ID
      const channelId = this.extractChannelId(roomId);
      const channel = this.client.channel('team', channelId);
      await channel.watch();
      return channel;
    } catch (error) {
      console.error('Error getting tenant channel:', error);
      return null;
    }
  }

  private generateChannelId(tenantId: string, roomName: string): string {
    const sanitizedName = roomName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `${tenantId}-${sanitizedName}-${Date.now()}`;
  }

  private extractChannelId(roomId: string): string {
    // Extract Stream channel ID from our room ID
    // This would depend on how you store the mapping
    return roomId.replace('room_', 'channel_');
  }
}

// Initialize Stream Chat manager
export function createTenantChatManager(): TenantStreamChatManager {
  const config: StreamChatConfig = {
    apiKey: process.env.STREAM_CHAT_API_KEY || '',
    apiSecret: process.env.STREAM_CHAT_API_SECRET || '',
  };

  if (!config.apiKey || !config.apiSecret) {
    throw new Error(
      'Stream Chat configuration missing. Set STREAM_CHAT_API_KEY and STREAM_CHAT_API_SECRET environment variables.',
    );
  }

  return new TenantStreamChatManager(config);
}

// High-level functions for tenant chat management
export async function createTenantGeneralRoom(
  tenantId: string,
  createdBy: string,
  members: string[],
): Promise<TenantChatRoom> {
  const manager = createTenantChatManager();
  return await manager.createTenantChatRoom({
    tenantId,
    roomName: 'General Discussion',
    roomType: 'general',
    createdBy,
    members,
    isPrivate: false,
  });
}

export async function createDocumentDiscussion(params: {
  tenantId: string;
  documentId: string;
  documentTitle: string;
  createdBy: string;
  collaborators: string[];
}): Promise<TenantChatRoom> {
  const manager = createTenantChatManager();
  return await manager.createDocumentChatRoom(params);
}

export async function setupTenantChatUser(
  tenantUser: TenantUser,
  tenant: Tenant,
  userInfo: {
    name: string;
    email: string;
    avatar?: string;
  },
): Promise<{ chatUser: TenantChatUser; token: string }> {
  const manager = createTenantChatManager();

  const chatUser = await manager.createTenantChatUser(
    tenantUser,
    tenant,
    userInfo,
  );
  const token = manager.generateTenantUserToken(tenant.id, tenantUser.userId);

  return { chatUser, token };
}

export async function getTenantChatRooms(
  tenantId: string,
  userId: string,
): Promise<Channel[]> {
  const manager = createTenantChatManager();
  return await manager.getTenantChannelsForUser(tenantId, userId);
}

// Utility functions for chat room management
export function formatChatRoomName(
  tenant: Tenant,
  roomType: string,
  context?: string,
): string {
  const companyName = tenant.branding?.companyName || tenant.name;

  switch (roomType) {
    case 'general':
      return `${companyName} - General`;
    case 'support':
      return `${companyName} - Support`;
    case 'document':
      return context ? `${context} - Discussion` : 'Document Discussion';
    default:
      return `${companyName} - ${roomType}`;
  }
}

export function getChatRoomPermissions(tenantUserRole: string): {
  canCreateRooms: boolean;
  canDeleteRooms: boolean;
  canMuteUsers: boolean;
  canInviteUsers: boolean;
  canManageMessages: boolean;
} {
  const permissions = {
    admin: {
      canCreateRooms: true,
      canDeleteRooms: true,
      canMuteUsers: true,
      canInviteUsers: true,
      canManageMessages: true,
    },
    manager: {
      canCreateRooms: true,
      canDeleteRooms: false,
      canMuteUsers: true,
      canInviteUsers: true,
      canManageMessages: true,
    },
    editor: {
      canCreateRooms: false,
      canDeleteRooms: false,
      canMuteUsers: false,
      canInviteUsers: true,
      canManageMessages: false,
    },
    viewer: {
      canCreateRooms: false,
      canDeleteRooms: false,
      canMuteUsers: false,
      canInviteUsers: false,
      canManageMessages: false,
    },
    guest: {
      canCreateRooms: false,
      canDeleteRooms: false,
      canMuteUsers: false,
      canInviteUsers: false,
      canManageMessages: false,
    },
  };

  return (
    permissions[tenantUserRole as keyof typeof permissions] || permissions.guest
  );
}
