// src/lib/collaboration/yjs-server.ts
import { Server } from '@hocuspocus/server';
import { Redis } from '@hocuspocus/extension-redis';
import { Logger } from '@hocuspocus/extension-logger';
import { Document } from '@hocuspocus/server';
import * as Y from 'yjs';
import { createRedisConnection, PresenceRedisService } from './redis-config';
import { authenticateCollaborator, authorizeDocumentAccess } from './auth';

export interface CollaborationDocument {
  id: string;
  title: string;
  ownerId: string;
  collaborators: string[];
  settings: {
    allowAnonymous: boolean;
    requireApproval: boolean;
    maxCollaborators: number;
  };
}

export interface CollaboratorInfo {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'editor' | 'reviewer' | 'viewer';
  color: string;
}

class YjsCollaborationServer {
  private server: Server;
  private presenceService: PresenceRedisService;
  private redis: any;

  constructor() {
    this.redis = createRedisConnection();
    this.presenceService = new PresenceRedisService(this.redis);
    this.server = this.createServer();
  }

  private createServer(): Server {
    return Server.configure({
      port: parseInt(process.env.COLLABORATION_PORT || '3001'),
      
      extensions: [
        new Logger({
          onLoadDocument: (data) => {
            console.log(`Document loaded: ${data.documentName}`);
          },
          onStoreDocument: (data) => {
            console.log(`Document stored: ${data.documentName}`);
          },
          onConnect: (data) => {
            console.log(`User connected: ${data.context.user?.name || 'Anonymous'} to ${data.documentName}`);
          },
          onDisconnect: (data) => {
            console.log(`User disconnected: ${data.context.user?.name || 'Anonymous'} from ${data.documentName}`);
          },
        }),

        new Redis({
          port: parseInt(process.env.REDIS_PORT || '6379'),
          host: process.env.REDIS_HOST || 'localhost',
          password: process.env.REDIS_PASSWORD,
          prefix: 'yjs:',
        }),
      ],

      async onAuthenticate(data) {
        const { token } = data;
        
        try {
          const user = await authenticateCollaborator(token);
          
          if (!user) {
            throw new Error('Invalid authentication token');
          }

          return {
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              avatar: user.avatar,
              role: user.role,
              color: user.color || this.generateUserColor(user.id),
            }
          };
        } catch (error) {
          console.error('Authentication failed:', error);
          throw new Error('Authentication failed');
        }
      },

      async onLoadDocument(data) {
        const { documentName, context } = data;
        const user = context.user as CollaboratorInfo;

        // Check if user has access to this document
        const hasAccess = await authorizeDocumentAccess(documentName, user.id);
        
        if (!hasAccess) {
          throw new Error('Access denied to document');
        }

        // Initialize document if it doesn't exist
        return this.initializeDocument(documentName);
      },

      async onStoreDocument(data) {
        const { documentName, document, context } = data;
        
        // Store document updates in your database
        await this.persistDocument(documentName, document, context.user);
        
        // Broadcast document update event
        await this.presenceService.broadcastToDocument(documentName, {
          type: 'document_updated',
          timestamp: Date.now(),
          userId: context.user?.id,
        });
      },

      async onConnect(data) {
        const { documentName, context } = data;
        const user = context.user as CollaboratorInfo;

        if (user) {
          // Set user presence
          await this.presenceService.setUserPresence(user.id, documentName, {
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            color: user.color,
            status: 'online',
            connectedAt: Date.now(),
          });

          // Broadcast user joined event
          await this.presenceService.broadcastToDocument(documentName, {
            type: 'user_joined',
            user: user,
            timestamp: Date.now(),
          });

          // Send current presence to new user
          const currentPresence = await this.presenceService.getDocumentPresence(documentName);
          context.sendStateless(JSON.stringify({
            type: 'presence_update',
            presence: currentPresence,
          }));
        }
      },

      async onDisconnect(data) {
        const { documentName, context } = data;
        const user = context.user as CollaboratorInfo;

        if (user) {
          // Remove user presence
          await this.presenceService.removeUserPresence(user.id, documentName);
          
          // Remove cursor position
          await this.presenceService.removeCursorPosition(user.id, documentName);

          // Broadcast user left event
          await this.presenceService.broadcastToDocument(documentName, {
            type: 'user_left',
            userId: user.id,
            timestamp: Date.now(),
          });
        }
      },

      async onRequest(data) {
        const { request, response } = data;
        
        // Handle custom requests like cursor positions, mentions, etc.
        if (request.headers['x-custom-action']) {
          return this.handleCustomAction(data);
        }
      },

      async onMessage(data) {
        const { message, context, documentName } = data;
        
        try {
          const messageData = JSON.parse(message);
          await this.handleCustomMessage(messageData, context, documentName);
        } catch (error) {
          console.error('Error handling custom message:', error);
        }
      },
    });
  }

  private async initializeDocument(documentName: string): Promise<Uint8Array | null> {
    try {
      // Try to load existing document from your database
      const existingDoc = await this.loadPersistedDocument(documentName);
      
      if (existingDoc) {
        return existingDoc;
      }

      // Create new document
      const ydoc = new Y.Doc();
      
      // Initialize with basic structure for legal documents
      const ytext = ydoc.getText('content');
      const ymeta = ydoc.getMap('metadata');
      const ycomments = ydoc.getArray('comments');
      const ypresence = ydoc.getMap('presence');

      // Set initial metadata
      ymeta.set('createdAt', Date.now());
      ymeta.set('version', '1.0.0');
      ymeta.set('template', 'legal-document');

      return Y.encodeStateAsUpdate(ydoc);
    } catch (error) {
      console.error('Error initializing document:', error);
      return null;
    }
  }

  private async persistDocument(documentName: string, document: Document, user?: CollaboratorInfo): Promise<void> {
    try {
      const update = Y.encodeStateAsUpdate(document);
      
      // Store in your database (implement based on your DB structure)
      await this.saveDocumentUpdate({
        documentId: documentName,
        update: Array.from(update),
        userId: user?.id,
        timestamp: Date.now(),
      });

    } catch (error) {
      console.error('Error persisting document:', error);
    }
  }

  private async loadPersistedDocument(documentName: string): Promise<Uint8Array | null> {
    try {
      // Load from your database (implement based on your DB structure)
      const updates = await this.getDocumentUpdates(documentName);
      
      if (updates.length === 0) {
        return null;
      }

      const ydoc = new Y.Doc();
      
      // Apply all updates
      updates.forEach(update => {
        Y.applyUpdate(ydoc, new Uint8Array(update.update));
      });

      return Y.encodeStateAsUpdate(ydoc);
    } catch (error) {
      console.error('Error loading persisted document:', error);
      return null;
    }
  }

  private async handleCustomMessage(
    message: any, 
    context: any, 
    documentName: string
  ): Promise<void> {
    const user = context.user as CollaboratorInfo;

    switch (message.type) {
      case 'cursor_update':
        await this.presenceService.setCursorPosition(user.id, documentName, message.position);
        
        // Broadcast cursor update to other users
        await this.presenceService.broadcastToDocument(documentName, {
          type: 'cursor_moved',
          userId: user.id,
          position: message.position,
          user: {
            name: user.name,
            color: user.color,
          },
          timestamp: Date.now(),
        });
        break;

      case 'selection_update':
        await this.presenceService.broadcastToDocument(documentName, {
          type: 'selection_changed',
          userId: user.id,
          selection: message.selection,
          user: {
            name: user.name,
            color: user.color,
          },
          timestamp: Date.now(),
        });
        break;

      case 'comment_add':
        await this.handleCommentAdd(message, user, documentName);
        break;

      case 'mention':
        await this.handleMention(message, user, documentName);
        break;

      case 'presence_ping':
        await this.presenceService.extendPresence(user.id, documentName);
        break;
    }
  }

  private async handleCustomAction(data: any): Promise<void> {
    // Handle REST-like actions for the collaboration server
    // This can be used for features like file uploads, mentions, etc.
  }

  private async handleCommentAdd(message: any, user: CollaboratorInfo, documentName: string): Promise<void> {
    const comment = {
      id: message.commentId || this.generateId(),
      content: message.content,
      authorId: user.id,
      authorName: user.name,
      position: message.position,
      timestamp: Date.now(),
      resolved: false,
    };

    // Store comment in database
    await this.saveComment(documentName, comment);

    // Broadcast to all users
    await this.presenceService.broadcastToDocument(documentName, {
      type: 'comment_added',
      comment,
    });
  }

  private async handleMention(message: any, user: CollaboratorInfo, documentName: string): Promise<void> {
    const mention = {
      id: this.generateId(),
      fromUser: user,
      toUserId: message.mentionedUserId,
      content: message.content,
      documentId: documentName,
      timestamp: Date.now(),
    };

    // Store mention in database
    await this.saveMention(mention);

    // Send push notification (implement with FCM)
    await this.sendMentionNotification(mention);

    // Broadcast to document
    await this.presenceService.broadcastToDocument(documentName, {
      type: 'mention_created',
      mention,
    });
  }

  private generateUserColor(userId: string): string {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
      '#FFEAA7', '#DDA0DD', '#98D8C8', '#FFB6C1'
    ];
    
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Database methods (implement based on your database)
  private async saveDocumentUpdate(update: any): Promise<void> {
    // Implement document update persistence
  }

  private async getDocumentUpdates(documentName: string): Promise<any[]> {
    // Implement document update retrieval
    return [];
  }

  private async saveComment(documentName: string, comment: any): Promise<void> {
    // Implement comment persistence
  }

  private async saveMention(mention: any): Promise<void> {
    // Implement mention persistence
  }

  private async sendMentionNotification(mention: any): Promise<void> {
    // Implement push notification (FCM)
  }

  public async start(): Promise<void> {
    await this.server.listen();
    console.log(`🚀 Yjs Collaboration Server running on port ${process.env.COLLABORATION_PORT || 3001}`);
  }

  public async stop(): Promise<void> {
    await this.server.destroy();
    this.presenceService.disconnect();
  }
}

export default YjsCollaborationServer;