// src/lib/collaboration/client.ts
'use client';

import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';
import type * as Monaco from 'monaco-editor';

export interface CollaborationUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  color: string;
  role: 'owner' | 'editor' | 'reviewer' | 'viewer';
}

export interface CursorPosition {
  line: number;
  column: number;
  selection?: {
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
  };
}

export interface PresenceInfo {
  user: CollaborationUser;
  cursor?: CursorPosition;
  lastSeen: number;
  status: 'online' | 'away' | 'offline';
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  position: {
    line: number;
    column: number;
  };
  timestamp: number;
  resolved: boolean;
  replies?: Comment[];
}

export interface Mention {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  position: {
    line: number;
    column: number;
  };
  timestamp: number;
  read: boolean;
}

export class CollaborationClient {
  private ydoc: Y.Doc;
  private provider: WebsocketProvider;
  private ytext: Y.Text;
  private ymeta: Y.Map<any>;
  private ycomments: Y.Array<any>;
  private ypresence: Y.Map<any>;
  private monacoBinding?: MonacoBinding;
  private currentUser: CollaborationUser;
  private documentId: string;
  private callbacks: Map<string, Function[]> = new Map();
  private presenceInterval?: NodeJS.Timeout;
  private cursorUpdateTimeout?: NodeJS.Timeout;

  constructor(
    documentId: string,
    currentUser: CollaborationUser,
    authToken: string,
  ) {
    this.documentId = documentId;
    this.currentUser = currentUser;

    // Initialize Yjs document
    this.ydoc = new Y.Doc();
    this.ytext = this.ydoc.getText('content');
    this.ymeta = this.ydoc.getMap('metadata');
    this.ycomments = this.ydoc.getArray('comments');
    this.ypresence = this.ydoc.getMap('presence');

    // Connect to collaboration server
    const wsUrl =
      process.env.NEXT_PUBLIC_COLLABORATION_WS_URL || 'ws://localhost:3001';
    this.provider = new WebsocketProvider(wsUrl, documentId, this.ydoc, {
      params: {
        token: authToken,
      },
    });

    this.setupEventListeners();
    this.startPresenceHeartbeat();
  }

  private setupEventListeners(): void {
    // Document updates
    this.ytext.observe((event) => {
      this.emit('document_changed', {
        changes: event.changes,
        origin: event.transaction.origin,
      });
    });

    // Comments updates
    this.ycomments.observe((event) => {
      this.emit('comments_changed', {
        changes: event.changes,
        comments: this.getComments(),
      });
    });

    // Presence updates
    this.ypresence.observe((event) => {
      this.emit('presence_changed', {
        presence: this.getPresence(),
      });
    });

    // Provider connection events
    this.provider.on('status', (event: any) => {
      this.emit('connection_status', event);
    });

    this.provider.on('message', (message: any) => {
      this.handleCustomMessage(message);
    });

    // Metadata updates
    this.ymeta.observe((event) => {
      this.emit('metadata_changed', {
        changes: event.changes,
        metadata: this.getMetadata(),
      });
    });
  }

  private handleCustomMessage(message: any): void {
    try {
      const data = JSON.parse(message);

      switch (data.type) {
        case 'cursor_moved':
          this.emit('cursor_moved', data);
          break;
        case 'selection_changed':
          this.emit('selection_changed', data);
          break;
        case 'user_joined':
          this.emit('user_joined', data.user);
          break;
        case 'user_left':
          this.emit('user_left', data.userId);
          break;
        case 'comment_added':
          this.emit('comment_added', data.comment);
          break;
        case 'mention_created':
          this.emit('mention_created', data.mention);
          break;
        case 'presence_update':
          this.emit('presence_update', data.presence);
          break;
      }
    } catch (error) {
      console.error('Error handling custom message:', error);
    }
  }

  public bindMonacoEditor(editor: Monaco.editor.IStandaloneCodeEditor): void {
    this.monacoBinding = new MonacoBinding(
      this.ytext,
      editor.getModel()!,
      new Set([editor]),
      this.provider.awareness,
    );

    // Set user info for awareness
    this.provider.awareness.setLocalState({
      user: this.currentUser,
      cursor: null,
      selection: null,
    });

    // Track cursor movements
    editor.onDidChangeCursorPosition((e) => {
      this.updateCursorPosition(e.position);
    });

    // Track selections
    editor.onDidChangeCursorSelection((e) => {
      this.updateSelection(e.selection);
    });
  }

  private updateCursorPosition(position: Monaco.Position): void {
    if (this.cursorUpdateTimeout) {
      clearTimeout(this.cursorUpdateTimeout);
    }

    this.cursorUpdateTimeout = setTimeout(() => {
      const cursorData = {
        line: position.lineNumber,
        column: position.column,
      };

      this.provider.awareness.setLocalState({
        ...this.provider.awareness.getLocalState(),
        cursor: cursorData,
      });

      this.sendCustomMessage({
        type: 'cursor_update',
        position: cursorData,
      });
    }, 100); // Throttle cursor updates
  }

  private updateSelection(selection: Monaco.Selection): void {
    const selectionData = {
      startLine: selection.startLineNumber,
      startColumn: selection.startColumn,
      endLine: selection.endLineNumber,
      endColumn: selection.endColumn,
    };

    this.provider.awareness.setLocalState({
      ...this.provider.awareness.getLocalState(),
      selection: selectionData,
    });

    this.sendCustomMessage({
      type: 'selection_update',
      selection: selectionData,
    });
  }

  private sendCustomMessage(message: any): void {
    if (this.provider.ws?.readyState === WebSocket.OPEN) {
      this.provider.ws.send(JSON.stringify(message));
    }
  }

  public addComment(content: string, position: CursorPosition): Comment {
    const comment: Comment = {
      id: this.generateId(),
      content,
      authorId: this.currentUser.id,
      authorName: this.currentUser.name,
      position,
      timestamp: Date.now(),
      resolved: false,
    };

    this.ycomments.push([comment]);

    this.sendCustomMessage({
      type: 'comment_add',
      commentId: comment.id,
      content,
      position,
    });

    return comment;
  }

  public resolveComment(commentId: string): void {
    const comments = this.ycomments.toArray();
    const commentIndex = comments.findIndex((c) => c.id === commentId);

    if (commentIndex !== -1) {
      const comment = { ...comments[commentIndex], resolved: true };
      this.ycomments.delete(commentIndex, 1);
      this.ycomments.insert(commentIndex, [comment]);
    }
  }

  public addReplyToComment(commentId: string, content: string): void {
    const comments = this.ycomments.toArray();
    const commentIndex = comments.findIndex((c) => c.id === commentId);

    if (commentIndex !== -1) {
      const comment = comments[commentIndex];
      const reply: Comment = {
        id: this.generateId(),
        content,
        authorId: this.currentUser.id,
        authorName: this.currentUser.name,
        position: comment.position,
        timestamp: Date.now(),
        resolved: false,
      };

      const updatedComment = {
        ...comment,
        replies: [...(comment.replies || []), reply],
      };

      this.ycomments.delete(commentIndex, 1);
      this.ycomments.insert(commentIndex, [updatedComment]);
    }
  }

  public createMention(
    userId: string,
    content: string,
    position: CursorPosition,
  ): void {
    const mention: Mention = {
      id: this.generateId(),
      fromUserId: this.currentUser.id,
      toUserId: userId,
      content,
      position,
      timestamp: Date.now(),
      read: false,
    };

    this.sendCustomMessage({
      type: 'mention',
      mentionedUserId: userId,
      content,
      position,
    });

    this.emit('mention_sent', mention);
  }

  public getComments(): Comment[] {
    return this.ycomments.toArray();
  }

  public getPresence(): PresenceInfo[] {
    const awareness = this.provider.awareness;
    const states = Array.from(awareness.getStates().entries());

    return states
      .filter(([clientId]) => clientId !== awareness.clientID)
      .map(([clientId, state]) => ({
        user: state.user,
        cursor: state.cursor,
        lastSeen: Date.now(),
        status: 'online' as const,
      }))
      .filter((info) => info.user);
  }

  public getMetadata(): any {
    return this.ymeta.toJSON();
  }

  public updateMetadata(key: string, value: any): void {
    this.ymeta.set(key, value);
  }

  public getDocumentContent(): string {
    return this.ytext.toString();
  }

  public insertText(index: number, text: string): void {
    this.ytext.insert(index, text);
  }

  public deleteText(index: number, length: number): void {
    this.ytext.delete(index, length);
  }

  private startPresenceHeartbeat(): void {
    this.presenceInterval = setInterval(() => {
      this.sendCustomMessage({
        type: 'presence_ping',
      });
    }, 30000); // Send heartbeat every 30 seconds
  }

  public on(event: string, callback: Function): void {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, []);
    }
    this.callbacks.get(event)!.push(callback);
  }

  public off(event: string, callback: Function): void {
    const callbacks = this.callbacks.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any): void {
    const callbacks = this.callbacks.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  public destroy(): void {
    if (this.presenceInterval) {
      clearInterval(this.presenceInterval);
    }

    if (this.cursorUpdateTimeout) {
      clearTimeout(this.cursorUpdateTimeout);
    }

    if (this.monacoBinding) {
      this.monacoBinding.destroy();
    }

    this.provider.destroy();
    this.ydoc.destroy();
    this.callbacks.clear();
  }
}

export default CollaborationClient;
