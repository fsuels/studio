// src/hooks/useCollaboration.tsx
'use client';

import React from 'react';
import { useAuth } from '@/lib/auth';
import {
  CollaborationClient,
  CollaborationUser,
  PresenceInfo,
  Comment,
  Mention,
} from '@/lib/collaboration/client';

export interface UseCollaborationOptions {
  documentId: string;
  enableRealtime?: boolean;
  autoConnect?: boolean;
}

export interface UseCollaborationReturn {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;

  // Collaboration client
  client: CollaborationClient | null;

  // Real-time data
  presence: PresenceInfo[];
  comments: Comment[];
  mentions: Mention[];
  unreadMentions: number;

  // Actions
  connect: () => Promise<void>;
  disconnect: () => void;
  addComment: (
    content: string,
    position?: { line: number; column: number },
  ) => void;
  resolveComment: (commentId: string) => void;
  createMention: (
    userId: string,
    content: string,
    position?: { line: number; column: number },
  ) => void;
  markMentionAsRead: (mentionId: string) => void;

  // Presence actions
  updatePresence: (data: Record<string, unknown>) => void;

  // Event handlers
  onUserJoined: (callback: (user: CollaborationUser) => void) => () => void;
  onUserLeft: (callback: (userId: string) => void) => () => void;
  onCommentAdded: (callback: (comment: Comment) => void) => () => void;
  onMentionReceived: (callback: (mention: Mention) => void) => () => void;
  onDocumentChanged: (callback: (changes: Record<string, unknown>) => void) => () => void;
}

export function useCollaboration({
  documentId,
  enableRealtime = true,
  autoConnect = true,
}: UseCollaborationOptions): UseCollaborationReturn {
  const { user } = useAuth();

  // State
  const [client, setClient] = React.useState<CollaborationClient | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [_authToken, setAuthToken] = React.useState<string | null>(null);

  // Real-time data
  const [presence, setPresence] = React.useState<PresenceInfo[]>([]);
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [mentions, setMentions] = React.useState<Mention[]>([]);
  const [unreadMentions, setUnreadMentions] = React.useState(0);

  // Event callbacks
  const eventCallbacks = React.useRef<Map<string, ((...args: unknown[]) => void)[]>>(new Map());

  const currentUser: CollaborationUser = React.useMemo(
    () => ({
      id: user?.uid || 'anonymous',
      name: user?.displayName || 'Anonymous User',
      email: user?.email || '',
      avatar: user?.photoURL,
      color: generateUserColor(user?.uid || 'anonymous'),
      role: 'editor',
    }),
    [user],
  );

  // Get collaboration auth token
  const getAuthToken = React.useCallback(async (): Promise<string> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const idToken = await user.getIdToken();

      const response = await fetch('/api/collaboration/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          documentId,
          role: 'editor',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get collaboration token');
      }

      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error('Failed to get auth token:', error);
      throw error;
    }
  }, [user, documentId]);

  // Connect to collaboration
  const connect = React.useCallback(async () => {
    if (!enableRealtime || !user || isConnecting || isConnected) {
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const token = await getAuthToken();
      setAuthToken(token);

      const collaborationClient = new CollaborationClient(
        documentId,
        currentUser,
        token,
      );

      // Set up event listeners
      collaborationClient.on('connection_status', (status: string) => {
        setIsConnected(status.status === 'connected');
        if (status.status === 'disconnected') {
          setError('Connection lost');
        }
      });

      collaborationClient.on('presence_changed', (data: Record<string, unknown>) => {
        setPresence(data.presence);
      });

      collaborationClient.on('comments_changed', (data: Record<string, unknown>) => {
        setComments(data.comments);
      });

      collaborationClient.on('comment_added', (comment: Comment) => {
        setComments((prev) => [...prev, comment]);
        emitEvent('comment_added', comment);
      });

      collaborationClient.on('mention_created', (mention: Mention) => {
        setMentions((prev) => [...prev, mention]);
        if (mention.toUserId === currentUser.id) {
          setUnreadMentions((prev) => prev + 1);
        }
        emitEvent('mention_received', mention);
      });

      collaborationClient.on('user_joined', (userData: CollaborationUser) => {
        emitEvent('user_joined', userData);
      });

      collaborationClient.on('user_left', (userId: string) => {
        emitEvent('user_left', userId);
      });

      collaborationClient.on('document_changed', (changes: Record<string, unknown>) => {
        emitEvent('document_changed', changes);
      });

      setClient(collaborationClient);
      setIsConnecting(false);
    } catch (error) {
      console.error('Failed to connect to collaboration:', error);
      setError(error instanceof Error ? error.message : 'Connection failed');
      setIsConnecting(false);
    }
  }, [
    enableRealtime,
    user,
    documentId,
    currentUser,
    isConnecting,
    isConnected,
    getAuthToken,
    emitEvent,
  ]);

  // Disconnect from collaboration
  const disconnect = React.useCallback(() => {
    if (client) {
      client.destroy();
      setClient(null);
    }
    setIsConnected(false);
    setIsConnecting(false);
    setError(null);
  }, [client]);

  // Actions
  const addComment = React.useCallback(
    (
      content: string,
      position: { line: number; column: number } = { line: 1, column: 1 },
    ) => {
      if (client) {
        client.addComment(content, position);
      }
    },
    [client],
  );

  const resolveComment = React.useCallback(
    (commentId: string) => {
      if (client) {
        client.resolveComment(commentId);
      }
    },
    [client],
  );

  const createMention = React.useCallback(
    (
      userId: string,
      content: string,
      position: { line: number; column: number } = { line: 1, column: 1 },
    ) => {
      if (client) {
        client.createMention(userId, content, position);
      }
    },
    [client],
  );

  const markMentionAsRead = React.useCallback((mentionId: string) => {
    setMentions((prev) =>
      prev.map((m) => (m.id === mentionId ? { ...m, read: true } : m)),
    );
    setUnreadMentions((prev) => Math.max(0, prev - 1));
  }, []);

  const updatePresence = React.useCallback((_data: Record<string, unknown>) => {
    // Update local presence data
    // This could be extended to include more presence information
  }, []);

  // Event handlers
  const addEventListener = React.useCallback(
    (event: string, callback: (...args: unknown[]) => void): (() => void) => {
      if (!eventCallbacks.current.has(event)) {
        eventCallbacks.current.set(event, []);
      }
      eventCallbacks.current.get(event)!.push(callback);

      return () => {
        const callbacks = eventCallbacks.current.get(event);
        if (callbacks) {
          const index = callbacks.indexOf(callback);
          if (index > -1) {
            callbacks.splice(index, 1);
          }
        }
      };
    },
    [],
  );

  const emitEvent = React.useCallback((event: string, data: Record<string, unknown>) => {
    const callbacks = eventCallbacks.current.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }, []);

  const onUserJoined = React.useCallback(
    (callback: (user: CollaborationUser) => void) => {
      return addEventListener('user_joined', callback);
    },
    [addEventListener],
  );

  const onUserLeft = React.useCallback(
    (callback: (userId: string) => void) => {
      return addEventListener('user_left', callback);
    },
    [addEventListener],
  );

  const onCommentAdded = React.useCallback(
    (callback: (comment: Comment) => void) => {
      return addEventListener('comment_added', callback);
    },
    [addEventListener],
  );

  const onMentionReceived = React.useCallback(
    (callback: (mention: Mention) => void) => {
      return addEventListener('mention_received', callback);
    },
    [addEventListener],
  );

  const onDocumentChanged = React.useCallback(
    (callback: (changes: Record<string, unknown>) => void) => {
      return addEventListener('document_changed', callback);
    },
    [addEventListener],
  );

  // Auto-connect on mount
  React.useEffect(() => {
    if (autoConnect && enableRealtime && user && !client) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, enableRealtime, user, connect, disconnect, client]);

  // Helper function
  const generateUserColor = (userId: string): string => {
    const colors = [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#96CEB4',
      '#FFEAA7',
      '#DDA0DD',
      '#98D8C8',
      '#FFB6C1',
    ];

    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  return {
    // Connection state
    isConnected,
    isConnecting,
    error,

    // Client
    client,

    // Real-time data
    presence,
    comments,
    mentions,
    unreadMentions,

    // Actions
    connect,
    disconnect,
    addComment,
    resolveComment,
    createMention,
    markMentionAsRead,
    updatePresence,

    // Event handlers
    onUserJoined,
    onUserLeft,
    onCommentAdded,
    onMentionReceived,
    onDocumentChanged,
  };
}

export default useCollaboration;
