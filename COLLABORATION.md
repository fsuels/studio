# Real-Time Collaboration & Presence System

## Overview

This system provides comprehensive real-time collaboration features for legal document editing, including:

- **Live Document Editing** with operational transforms via Yjs
- **Real-time Presence** showing who's online with live cursors
- **Comment Threads** with @mentions and push notifications
- **Conflict Resolution** with automatic operational transforms
- **User Management** with role-based permissions

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App  │    │  Collaboration  │    │     Redis       │
│   (Port 3000)  │◄──►│   Server        │◄──►│   (Presence)    │
│                 │    │  (Port 3001)    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Firestore     │    │      Yjs        │    │      FCM        │
│  (Documents)    │    │  (Sync Engine)  │    │ (Notifications) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Key Features

### 1. Real-time Document Synchronization

- **Yjs Integration**: Conflict-free replicated data types (CRDTs)
- **Monaco Editor**: Live collaborative editing with syntax highlighting
- **Operational Transforms**: Automatic conflict resolution
- **Document Versioning**: Complete history tracking

### 2. Live Presence & Cursors

- **User Presence**: Real-time online/offline status
- **Live Cursors**: See where others are typing
- **Selection Highlights**: View other users' text selections
- **User Colors**: Unique colors for each collaborator

### 3. Enhanced Comments & Mentions

- **Threading**: Reply to comments with nested conversations
- **@Mentions**: Tag users with push notifications
- **Field Anchoring**: Comments attached to specific document sections
- **Resolution Tracking**: Mark comments as resolved

### 4. Push Notifications

- **Firebase Cloud Messaging**: Cross-platform notifications
- **Smart Filtering**: User-configurable notification preferences
- **Real-time Delivery**: Instant mention and comment notifications
- **Badge Counting**: Unread notification tracking

## Setup Instructions

### 1. Environment Configuration

Copy the collaboration environment template:

```bash
cp .env.collaboration.example .env.local
```

Update the following variables:

```env
ENABLE_COLLABORATION=true
COLLABORATION_PORT=3001
NEXT_PUBLIC_COLLABORATION_WS_URL=ws://localhost:3001

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# Production Redis (Redis Cloud)
# REDIS_HOST=your-redis-cloud-host.redis.cloud
# REDIS_PORT=12345
# REDIS_PASSWORD=your-redis-cloud-password
```

### 2. Redis Setup

**Local Development:**

```bash
# Install Redis
brew install redis  # macOS
sudo apt install redis-server  # Ubuntu

# Start Redis
redis-server
```

**Production (Redis Cloud):**

1. Sign up at [Redis Cloud](https://redis.com/redis-enterprise-cloud/)
2. Create a new database
3. Update environment variables with connection details

### 3. Start the Application

**Development with Collaboration:**

```bash
npm run dev:collab
```

**Production with Collaboration:**

```bash
npm run build
npm run start:collab
```

## Usage Guide

### 1. Basic Integration

```tsx
import { CollaborativeEditor } from '@/components/collaboration/CollaborativeEditor';
import { DocumentCollaboration } from '@/components/collaboration/DocumentCollaboration';
import { useCollaboration } from '@/hooks/useCollaboration';

function DocumentPage({ documentId }: { documentId: string }) {
  const collaboration = useCollaboration({
    documentId,
    enableRealtime: true,
    autoConnect: true,
  });

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <CollaborativeEditor
          documentId={documentId}
          authToken={collaboration.authToken}
          onContentChange={(content) =>
            console.log('Content changed:', content)
          }
        />
      </div>

      <div className="w-80">
        <DocumentCollaboration
          documentId={documentId}
          currentUserId={user.uid}
          authToken={collaboration.authToken}
          enableRealtime={true}
        />
      </div>
    </div>
  );
}
```

### 2. Document Permissions

```tsx
import {
  authorizeDocumentAccess,
  checkPermission,
} from '@/lib/collaboration/auth';

// Check if user can access document
const hasAccess = await authorizeDocumentAccess(documentId, userId);

// Check specific permissions
const canEdit = await checkPermission(userId, documentId, 'write');
const canInvite = await checkPermission(userId, documentId, 'invite_users');
```

### 3. Invitation System

```tsx
import { inviteCollaborator } from '@/lib/collaboration/auth';

// Invite a new collaborator
const result = await inviteCollaborator(
  documentId,
  inviterUserId,
  'colleague@example.com',
  'editor',
);

if (result.success) {
  console.log('Invitation sent:', result.token);
}
```

### 4. Notifications Setup

```tsx
import { notificationService } from '@/lib/collaboration/notifications';

// Register FCM token
await notificationService.registerFCMToken(userId, fcmToken);

// Update notification preferences
await notificationService.updateNotificationSettings(userId, {
  mentions: true,
  comments: true,
  documentUpdates: false,
  pushEnabled: true,
});
```

## API Reference

### Collaboration Client

```typescript
class CollaborationClient {
  constructor(documentId: string, user: CollaborationUser, authToken: string);

  // Document operations
  bindMonacoEditor(editor: Monaco.editor.IStandaloneCodeEditor): void;
  getDocumentContent(): string;
  insertText(index: number, text: string): void;
  deleteText(index: number, length: number): void;

  // Comments
  addComment(content: string, position: CursorPosition): Comment;
  resolveComment(commentId: string): void;
  addReplyToComment(commentId: string, content: string): void;

  // Mentions
  createMention(
    userId: string,
    content: string,
    position: CursorPosition,
  ): void;

  // Events
  on(event: string, callback: Function): void;
  off(event: string, callback: Function): void;

  // Cleanup
  destroy(): void;
}
```

### Collaboration Hook

```typescript
interface UseCollaborationReturn {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;

  // Real-time data
  presence: PresenceInfo[];
  comments: Comment[];
  mentions: Mention[];
  unreadMentions: number;

  // Actions
  connect: () => Promise<void>;
  disconnect: () => void;
  addComment: (content: string, position?: CursorPosition) => void;
  resolveComment: (commentId: string) => void;
  createMention: (
    userId: string,
    content: string,
    position?: CursorPosition,
  ) => void;
  markMentionAsRead: (mentionId: string) => void;

  // Event handlers
  onUserJoined: (callback: (user: CollaborationUser) => void) => () => void;
  onUserLeft: (callback: (userId: string) => void) => () => void;
  onCommentAdded: (callback: (comment: Comment) => void) => () => void;
  onMentionReceived: (callback: (mention: Mention) => void) => () => void;
  onDocumentChanged: (callback: (changes: any) => void) => () => void;
}
```

## Security Features

### 1. Authentication

- Firebase Auth integration
- JWT-based collaboration tokens
- Token expiration and refresh

### 2. Authorization

- Role-based permissions (owner, editor, reviewer, viewer)
- Document-level access control
- Feature-specific permissions

### 3. Data Protection

- Encrypted WebSocket connections (WSS)
- Redis authentication
- CORS protection

## Performance Optimizations

### 1. Connection Management

- Automatic reconnection with exponential backoff
- Connection pooling for WebSocket connections
- Heartbeat mechanism for presence detection

### 2. Data Efficiency

- Operational transform compression
- Incremental sync with Yjs
- Redis TTL for presence data

### 3. Notification Optimization

- Batched notifications
- User preference filtering
- Invalid token cleanup

## Troubleshooting

### Common Issues

**1. Connection Failed**

```
Error: Failed to connect to collaboration server
```

- Check if Redis is running
- Verify COLLABORATION_PORT is available
- Ensure WebSocket URL is correct

**2. Authentication Errors**

```
Error: Invalid authentication token
```

- Verify Firebase Auth is working
- Check if user has document access
- Ensure collaboration token hasn't expired

**3. Notifications Not Working**

```
FCM tokens not registered
```

- Verify Firebase Cloud Messaging is configured
- Check if user granted notification permissions
- Ensure FCM service worker is registered

### Debug Mode

Enable debug logging:

```env
COLLABORATION_LOG_LEVEL=debug
```

View collaboration logs:

```bash
tail -f ./logs/collaboration.log
```

## Production Deployment

### 1. Redis Configuration

- Use Redis Cloud or managed Redis service
- Enable Redis AUTH for security
- Configure Redis clustering for high availability

### 2. Load Balancing

- Use sticky sessions for WebSocket connections
- Configure Redis for session sharing
- Monitor connection counts and performance

### 3. Monitoring

- Set up metrics for active connections
- Monitor Redis memory usage
- Track notification delivery rates

## Extending the System

### 1. Custom Document Types

```typescript
// Extend document synchronization for custom fields
const customDoc = ydoc.getMap('customFields');
customDoc.set('legalClause', new Y.Text());
```

### 2. Additional Notification Types

```typescript
// Add new notification types
await notificationService.sendCustomNotification({
  type: 'document_signed',
  title: 'Document Signed',
  body: 'Legal document has been signed',
  // ...
});
```

### 3. Analytics Integration

```typescript
// Track collaboration events
collaboration.onDocumentChanged((changes) => {
  analytics.track('document_edited', {
    documentId,
    userId: currentUser.id,
    changeCount: changes.length,
  });
});
```

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review the API documentation
3. Check Redis and WebSocket connectivity
4. Verify Firebase configuration

This collaboration system provides a robust foundation for real-time legal document collaboration with enterprise-grade features and security.
