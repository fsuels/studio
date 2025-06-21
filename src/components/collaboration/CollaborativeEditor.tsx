// src/components/collaboration/CollaborativeEditor.tsx
'use client';

import React from 'react';
import { Editor } from '@monaco-editor/react';
import type * as Monaco from 'monaco-editor';
import { useAuth } from '@/lib/auth';
import {
  CollaborationClient,
  CollaborationUser,
  PresenceInfo,
  Comment,
  CursorPosition,
} from '@/lib/collaboration/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { MessageCircle, Users, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollaborativeEditorProps {
  documentId: string;
  initialContent?: string;
  language?: string;
  authToken: string;
  onContentChange?: (content: string) => void;
  onCommentAdd?: (comment: Comment) => void;
  className?: string;
  readOnly?: boolean;
}

interface LiveCursor {
  userId: string;
  user: CollaborationUser;
  position: CursorPosition;
  decoration?: string[];
}

const CollaborativeEditor: React.FC<CollaborativeEditorProps> = ({
  documentId,
  initialContent = '',
  language = 'markdown',
  authToken,
  onContentChange,
  onCommentAdd,
  className,
  readOnly = false,
}) => {
  const { user } = useAuth();
  const [editor, setEditor] =
    React.useState<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const [monaco, setMonaco] = React.useState<typeof Monaco | null>(null);
  const [collaborationClient, setCollaborationClient] =
    React.useState<CollaborationClient | null>(null);
  const [presence, setPresence] = React.useState<PresenceInfo[]>([]);
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [isConnected, setIsConnected] = React.useState(false);
  const [liveCursors, setLiveCursors] = React.useState<Map<string, LiveCursor>>(
    new Map(),
  );
  const [showingComment, setShowingComment] = React.useState(false);
  const [commentPosition, setCommentPosition] =
    React.useState<CursorPosition | null>(null);

  const currentUser: CollaborationUser = React.useMemo(
    () => ({
      id: user?.uid || 'anonymous',
      name: user?.displayName || 'Anonymous User',
      email: user?.email || '',
      avatar: user?.photoURL,
      color: generateUserColor(user?.uid || 'anonymous'),
      role: 'editor', // This should come from document permissions
    }),
    [user],
  );

  React.useEffect(() => {
    if (!user || !authToken) return;

    const client = new CollaborationClient(documentId, currentUser, authToken);
    setCollaborationClient(client);

    // Set up event listeners
    client.on('connection_status', (status: any) => {
      setIsConnected(status.status === 'connected');
    });

    client.on('presence_changed', (data: any) => {
      setPresence(data.presence);
    });

    client.on('comments_changed', (data: any) => {
      setComments(data.comments);
    });

    client.on('document_changed', (data: any) => {
      if (onContentChange) {
        onContentChange(client.getDocumentContent());
      }
    });

    client.on('cursor_moved', (data: any) => {
      updateLiveCursor(data.userId, data.user, data.position);
    });

    client.on('selection_changed', (data: any) => {
      updateLiveSelection(data.userId, data.user, data.selection);
    });

    client.on('user_joined', (userData: CollaborationUser) => {
      console.log(`${userData.name} joined the document`);
    });

    client.on('user_left', (userId: string) => {
      removeLiveCursor(userId);
    });

    return () => {
      client.destroy();
    };
  }, [documentId, user, authToken]);

  React.useEffect(() => {
    if (editor && collaborationClient) {
      collaborationClient.bindMonacoEditor(editor);
    }
  }, [editor, collaborationClient]);

  React.useEffect(() => {
    if (editor && monaco) {
      updateCursorDecorations();
    }
  }, [liveCursors, editor, monaco]);

  const handleEditorDidMount = (
    editorInstance: Monaco.editor.IStandaloneCodeEditor,
    monacoInstance: typeof Monaco,
  ) => {
    setEditor(editorInstance);
    setMonaco(monacoInstance);

    // Set initial content
    if (initialContent) {
      editorInstance.setValue(initialContent);
    }

    // Add context menu for comments
    editorInstance.addAction({
      id: 'add-comment',
      label: 'Add Comment',
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1.5,
      run: (ed) => {
        const position = ed.getPosition();
        if (position) {
          setCommentPosition({
            line: position.lineNumber,
            column: position.column,
          });
          setShowingComment(true);
        }
      },
    });

    // Add shortcut for mentions
    editorInstance.addCommand(
      monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyM,
      () => {
        // Trigger mention popup
        triggerMentionPopup();
      },
    );
  };

  const updateLiveCursor = (
    userId: string,
    user: CollaborationUser,
    position: CursorPosition,
  ) => {
    if (userId === currentUser.id) return;

    setLiveCursors((prev) => {
      const newCursors = new Map(prev);
      newCursors.set(userId, {
        userId,
        user,
        position,
      });
      return newCursors;
    });
  };

  const updateLiveSelection = (
    userId: string,
    user: CollaborationUser,
    selection: any,
  ) => {
    if (userId === currentUser.id) return;

    setLiveCursors((prev) => {
      const newCursors = new Map(prev);
      const existing = newCursors.get(userId);
      if (existing) {
        newCursors.set(userId, {
          ...existing,
          position: {
            line: selection.startLine,
            column: selection.startColumn,
            selection,
          },
        });
      }
      return newCursors;
    });
  };

  const removeLiveCursor = (userId: string) => {
    setLiveCursors((prev) => {
      const newCursors = new Map(prev);
      newCursors.delete(userId);
      return newCursors;
    });
  };

  const updateCursorDecorations = () => {
    if (!editor || !monaco) return;

    const decorations: Monaco.editor.IModelDeltaDecoration[] = [];

    liveCursors.forEach((cursor) => {
      const { user, position } = cursor;

      // Cursor decoration
      decorations.push({
        range: new monaco.Range(
          position.line,
          position.column,
          position.line,
          position.column,
        ),
        options: {
          className: 'live-cursor',
          beforeContentClassName: 'live-cursor-line',
          afterContentClassName: 'live-cursor-label',
          glyphMarginClassName: 'live-cursor-glyph',
          stickiness:
            monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        },
      });

      // Selection decoration
      if (position.selection) {
        decorations.push({
          range: new monaco.Range(
            position.selection.startLine,
            position.selection.startColumn,
            position.selection.endLine,
            position.selection.endColumn,
          ),
          options: {
            className: 'live-selection',
            stickiness:
              monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
          },
        });
      }
    });

    const existingDecorations = Array.from(liveCursors.values())
      .map((cursor) => cursor.decoration)
      .filter(Boolean)
      .flat() as string[];

    const newDecorations = editor.deltaDecorations(
      existingDecorations,
      decorations,
    );

    // Update decoration IDs
    let decorationIndex = 0;
    liveCursors.forEach((cursor, userId) => {
      cursor.decoration = newDecorations.slice(
        decorationIndex,
        decorationIndex + (cursor.position.selection ? 2 : 1),
      );
      decorationIndex += cursor.position.selection ? 2 : 1;
    });
  };

  const addComment = (content: string) => {
    if (!collaborationClient || !commentPosition) return;

    const comment = collaborationClient.addComment(content, commentPosition);

    if (onCommentAdd) {
      onCommentAdd(comment);
    }

    setShowingComment(false);
    setCommentPosition(null);
  };

  const triggerMentionPopup = () => {
    // Implement mention popup logic
    // This would show a dropdown with available users to mention
  };

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

  return (
    <div className={cn('relative', className)}>
      {/* Collaboration Toolbar */}
      <Card className="mb-4 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm text-muted-foreground">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>

            {/* Active Users */}
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="flex -space-x-2">
                <TooltipProvider>
                  {presence.slice(0, 5).map((presenceInfo) => (
                    <Tooltip key={presenceInfo.user.id}>
                      <TooltipTrigger>
                        <Avatar className="h-6 w-6 border-2 border-background">
                          <AvatarImage src={presenceInfo.user.avatar} />
                          <AvatarFallback
                            className="text-xs"
                            style={{ backgroundColor: presenceInfo.user.color }}
                          >
                            {presenceInfo.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{presenceInfo.user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {presenceInfo.user.role}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>

                {presence.length > 5 && (
                  <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                    <span className="text-xs">+{presence.length - 5}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-1">
              <MessageCircle className="h-4 w-4" />
              {comments.filter((c) => !c.resolved).length}
            </Button>
          </div>
        </div>
      </Card>

      {/* Monaco Editor */}
      <div className="relative border rounded-lg overflow-hidden">
        <Editor
          height="500px"
          language={language}
          onMount={handleEditorDidMount}
          options={{
            readOnly,
            minimap: { enabled: false },
            lineNumbers: 'on',
            glyphMargin: true,
            contextmenu: true,
            quickSuggestions: false,
            suggestOnTriggerCharacters: false,
            wordWrap: 'on',
            theme: 'vs-light',
          }}
        />

        {/* Comment Input Modal */}
        {showingComment && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="p-4 w-96">
              <h3 className="font-medium mb-2">Add Comment</h3>
              <textarea
                className="w-full p-2 border rounded resize-none"
                rows={3}
                placeholder="Enter your comment..."
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    addComment(e.currentTarget.value);
                  }
                  if (e.key === 'Escape') {
                    setShowingComment(false);
                    setCommentPosition(null);
                  }
                }}
              />
              <div className="flex justify-end gap-2 mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowingComment(false);
                    setCommentPosition(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={(e) => {
                    const textarea =
                      e.currentTarget.parentElement?.parentElement?.querySelector(
                        'textarea',
                      );
                    if (textarea?.value) {
                      addComment(textarea.value);
                    }
                  }}
                >
                  Add Comment
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* CSS for live cursors and selections */}
      <style jsx global>{`
        .live-cursor {
          border-left: 2px solid var(--cursor-color);
        }

        .live-cursor-line::before {
          content: '';
          position: absolute;
          top: 0;
          left: -1px;
          width: 2px;
          height: 100%;
          background-color: var(--cursor-color);
        }

        .live-cursor-label::after {
          content: attr(data-user-name);
          position: absolute;
          top: -20px;
          left: -1px;
          background-color: var(--cursor-color);
          color: white;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 11px;
          white-space: nowrap;
          z-index: 10;
        }

        .live-selection {
          background-color: var(--selection-color);
          opacity: 0.3;
        }
      `}</style>
    </div>
  );
};

export default CollaborativeEditor;
