// src/components/collaboration/DocumentCollaboration.tsx
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { 
  Users, 
  Share2, 
  MessageCircle, 
  Clock, 
  Check, 
  X, 
  Edit, 
  Eye,
  MoreVertical,
  Send,
  UserPlus,
  Bell,
  Download,
  History,
  AlertCircle,
  Wifi,
  WifiOff,
  AtSign,
  Pin,
  Reply
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CollaborationClient, CollaborationUser, PresenceInfo, Comment as CollabComment } from '@/lib/collaboration/client';
import { useAuth } from '@/lib/auth';

interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'editor' | 'reviewer' | 'viewer';
  status: 'online' | 'offline' | 'away';
  lastSeen?: Date;
}

interface Comment {
  id: string;
  authorId: string;
  content: string;
  timestamp: Date;
  fieldId?: string;
  resolved: boolean;
  replies?: Comment[];
}

interface DocumentVersion {
  id: string;
  timestamp: Date;
  authorId: string;
  description: string;
  changes: string[];
}

interface DocumentCollaborationProps {
  documentId: string;
  currentUserId: string;
  authToken: string;
  onSave?: (data: any) => void;
  className?: string;
  enableRealtime?: boolean;
}

const DocumentCollaboration: React.FC<DocumentCollaborationProps> = ({
  documentId,
  currentUserId,
  authToken,
  onSave,
  className,
  enableRealtime = true
}) => {
  const { t } = useTranslation('collaboration');
  const { user } = useAuth();
  
  // Legacy state for backwards compatibility
  const [collaborators, setCollaborators] = React.useState<Collaborator[]>([]);
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [versions, setVersions] = React.useState<DocumentVersion[]>([]);
  
  // Real-time collaboration state
  const [collaborationClient, setCollaborationClient] = React.useState<CollaborationClient | null>(null);
  const [realtimePresence, setRealtimePresence] = React.useState<PresenceInfo[]>([]);
  const [realtimeComments, setRealtimeComments] = React.useState<CollabComment[]>([]);
  const [isConnected, setIsConnected] = React.useState(false);
  const [mentions, setMentions] = React.useState<any[]>([]);
  const [unreadMentions, setUnreadMentions] = React.useState(0);
  
  // UI state
  const [newComment, setNewComment] = React.useState('');
  const [selectedField, setSelectedField] = React.useState<string | null>(null);
  const [showVersionHistory, setShowVersionHistory] = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState('');
  const [mentionQuery, setMentionQuery] = React.useState('');
  const [showMentionPopup, setShowMentionPopup] = React.useState(false);
  const [replyToComment, setReplyToComment] = React.useState<string | null>(null);

  const currentUser: CollaborationUser = React.useMemo(() => ({
    id: user?.uid || currentUserId,
    name: user?.displayName || 'Unknown User',
    email: user?.email || '',
    avatar: user?.photoURL,
    color: generateUserColor(user?.uid || currentUserId),
    role: 'editor', // This should come from document permissions
  }), [user, currentUserId]);

  // Initialize real-time collaboration
  React.useEffect(() => {
    if (!enableRealtime || !authToken) {
      loadCollaborationData();
      setupRealtimeUpdates();
      return;
    }

    const client = new CollaborationClient(documentId, currentUser, authToken);
    setCollaborationClient(client);

    // Set up event listeners
    client.on('connection_status', (status: any) => {
      setIsConnected(status.status === 'connected');
    });

    client.on('presence_changed', (data: any) => {
      setRealtimePresence(data.presence);
    });

    client.on('comments_changed', (data: any) => {
      setRealtimeComments(data.comments);
    });

    client.on('comment_added', (comment: CollabComment) => {
      setRealtimeComments(prev => [...prev, comment]);
      
      // Show notification if it's not from current user
      if (comment.authorId !== currentUser.id) {
        showCommentNotification(comment);
      }
    });

    client.on('mention_created', (mention: any) => {
      setMentions(prev => [...prev, mention]);
      
      // If mention is for current user, increment unread count
      if (mention.toUserId === currentUser.id) {
        setUnreadMentions(prev => prev + 1);
        showMentionNotification(mention);
      }
    });

    client.on('user_joined', (userData: CollaborationUser) => {
      showUserJoinedNotification(userData);
    });

    client.on('user_left', (userId: string) => {
      showUserLeftNotification(userId);
    });

    return () => {
      client.destroy();
    };
  }, [documentId, enableRealtime, authToken, currentUser]);

  // Fallback to legacy collaboration for non-realtime mode
  const loadCollaborationData = async () => {
    try {
      const [collabResponse, commentsResponse, versionsResponse] = await Promise.all([
        fetch(`/api/documents/${documentId}/collaborators`),
        fetch(`/api/documents/${documentId}/comments`),
        fetch(`/api/documents/${documentId}/versions`)
      ]);

      setCollaborators(await collabResponse.json());
      setComments(await commentsResponse.json());
      setVersions(await versionsResponse.json());
    } catch (error) {
      console.error('Failed to load collaboration data:', error);
    }
  };

  const setupRealtimeUpdates = () => {
    // Setup WebSocket or EventSource for real-time updates (legacy)
    const eventSource = new EventSource(`/api/documents/${documentId}/stream`);
    
    eventSource.onmessage = (event) => {
      const update = JSON.parse(event.data);
      handleRealtimeUpdate(update);
    };

    return () => eventSource.close();
  };

  const handleRealtimeUpdate = (update: any) => {
    switch (update.type) {
      case 'collaborator_joined':
        setCollaborators(prev => [...prev.filter(c => c.id !== update.collaborator.id), update.collaborator]);
        break;
      case 'collaborator_left':
        setCollaborators(prev => prev.filter(c => c.id !== update.collaboratorId));
        break;
      case 'comment_added':
        setComments(prev => [...prev, update.comment]);
        break;
      case 'comment_resolved':
        setComments(prev => prev.map(c => 
          c.id === update.commentId ? { ...c, resolved: true } : c
        ));
        break;
      case 'field_changed':
        showFieldChangeNotification(update);
        break;
    }
  };

  // Notification functions
  const showCommentNotification = (comment: CollabComment) => {
    // Implement toast notification for new comments
    console.log(`New comment from ${comment.authorName}: ${comment.content}`);
  };

  const showMentionNotification = (mention: any) => {
    // Implement toast notification for mentions
    console.log(`You were mentioned by ${mention.fromUser.name}`);
  };

  const showUserJoinedNotification = (userData: CollaborationUser) => {
    // Implement toast notification for user joining
    console.log(`${userData.name} joined the document`);
  };

  const showUserLeftNotification = (userId: string) => {
    // Implement toast notification for user leaving
    const user = getActivePresence().find(p => p.user.id === userId);
    if (user) {
      console.log(`${user.user.name} left the document`);
    }
  };

  const showFieldChangeNotification = (update: any) => {
    // Show a subtle notification about field changes
    console.log('Document field changed:', update);
  };

  const inviteCollaborator = async () => {
    if (!inviteEmail) return;

    try {
      await fetch(`/api/documents/${documentId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inviteEmail,
          role: 'editor'
        })
      });

      setInviteEmail('');
      // Show success toast
    } catch (error) {
      console.error('Failed to invite collaborator:', error);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;

    if (enableRealtime && collaborationClient) {
      // Use real-time collaboration client
      collaborationClient.addComment(newComment, {
        line: 1,
        column: 1,
      });
      setNewComment('');
    } else {
      // Fallback to legacy API
      const comment: Comment = {
        id: crypto.randomUUID(),
        authorId: currentUserId,
        content: newComment,
        timestamp: new Date(),
        fieldId: selectedField || undefined,
        resolved: false
      };

      try {
        await fetch(`/api/documents/${documentId}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(comment)
        });

        setComments(prev => [...prev, comment]);
        setNewComment('');
      } catch (error) {
        console.error('Failed to add comment:', error);
      }
    }
  };

  const addReply = async (commentId: string, content: string) => {
    if (enableRealtime && collaborationClient) {
      collaborationClient.addReplyToComment(commentId, content);
    } else {
      // Implement legacy reply logic
    }
    setReplyToComment(null);
  };

  const createMention = async (userId: string) => {
    if (!newComment.trim() || !enableRealtime || !collaborationClient) return;

    collaborationClient.createMention(userId, newComment, {
      line: 1,
      column: 1,
    });

    setNewComment('');
    setShowMentionPopup(false);
    setMentionQuery('');
  };

  const resolveComment = async (commentId: string) => {
    if (enableRealtime && collaborationClient) {
      collaborationClient.resolveComment(commentId);
    } else {
      try {
        await fetch(`/api/documents/${documentId}/comments/${commentId}/resolve`, {
          method: 'POST'
        });

        setComments(prev => prev.map(c => 
          c.id === commentId ? { ...c, resolved: true } : c
        ));
      } catch (error) {
        console.error('Failed to resolve comment:', error);
      }
    }
  };

  const markMentionAsRead = (mentionId: string) => {
    setMentions(prev => prev.map(m => 
      m.id === mentionId ? { ...m, read: true } : m
    ));
    setUnreadMentions(prev => Math.max(0, prev - 1));
  };

  // Helper functions to get the right data based on mode
  const getActivePresence = (): (PresenceInfo | Collaborator)[] => {
    return enableRealtime ? realtimePresence : collaborators.map(c => ({
      ...c,
      status: c.status || 'offline',
      lastSeen: c.lastSeen || Date.now(),
    }));
  };

  const getActiveComments = (): (CollabComment | Comment)[] => {
    return enableRealtime ? realtimeComments : comments;
  };

  const getConnectionStatus = () => {
    return enableRealtime ? isConnected : true; // Assume connected for legacy mode
  };

  const generateUserColor = (userId: string): string => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
      '#FFEAA7', '#DDA0DD', '#98D8C8', '#FFB6C1'
    ];
    
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Users className="h-3 w-3" />;
      case 'editor': return <Edit className="h-3 w-3" />;
      case 'reviewer': return <MessageCircle className="h-3 w-3" />;
      case 'viewer': return <Eye className="h-3 w-3" />;
      default: return <Users className="h-3 w-3" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800';
      case 'editor': return 'bg-blue-100 text-blue-800';
      case 'reviewer': return 'bg-orange-100 text-orange-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMentionUsers = (): CollaborationUser[] => {
    const query = mentionQuery.toLowerCase();
    return getActivePresence()
      .filter(p => 'user' in p ? p.user.id !== currentUser.id : p.id !== currentUser.id)
      .map(p => 'user' in p ? p.user : {
        id: p.id,
        name: p.name,
        email: p.email,
        avatar: p.avatar,
        color: generateUserColor(p.id),
        role: p.role as any,
      })
      .filter(user => 
        user.name.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query)
      )
      .slice(0, 5);
  };

  const unresolvedComments = getActiveComments().filter(c => !c.resolved);
  const activePresence = getActivePresence();
  const currentUserData = activePresence.find(p => 
    'user' in p ? p.user.id === currentUser.id : p.id === currentUser.id
  );

  return (
    <TooltipProvider>
      <div className={cn("space-y-4", className)}>
        {/* Real-time Status Bar */}
        {enableRealtime && (
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getConnectionStatus() ? (
                      <Wifi className="h-4 w-4 text-green-500" />
                    ) : (
                      <WifiOff className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm font-medium">
                      {getConnectionStatus() ? 'Live Collaboration Active' : 'Connecting...'}
                    </span>
                  </div>

                  {unreadMentions > 0 && (
                    <Badge variant="destructive" className="gap-1">
                      <AtSign className="h-3 w-3" />
                      {unreadMentions} mention{unreadMentions > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {activePresence.length} user{activePresence.length !== 1 ? 's' : ''} online
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Collaboration Header */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Collaboration
                {enableRealtime && (
                  <Badge variant="outline" className="ml-2">
                    Real-time
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowVersionHistory(true)}>
                  <History className="h-4 w-4 mr-1" />
                  History
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
        
          <CardContent className="space-y-4">
            {/* Active Collaborators */}
            <div>
              <h3 className="text-sm font-medium mb-2">
                Active Collaborators ({activePresence.length})
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                {activePresence.map((presenceItem) => {
                  const collaborator = 'user' in presenceItem ? presenceItem.user : presenceItem;
                  const status = 'user' in presenceItem ? presenceItem.status : presenceItem.status;
                  
                  return (
                    <Tooltip key={collaborator.id}>
                      <TooltipTrigger>
                        <div className="flex items-center gap-2 bg-muted rounded-lg p-2 hover:bg-muted/80 transition-colors">
                          <div className="relative">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={collaborator.avatar} />
                              <AvatarFallback 
                                className="text-xs"
                                style={{ backgroundColor: collaborator.color || '#94A3B8' }}
                              >
                                {collaborator.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className={cn(
                              "absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-background",
                              status === 'online' ? 'bg-green-500' :
                              status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                            )} />
                          </div>
                          
                          <span className="text-sm font-medium">{collaborator.name}</span>
                          
                          <Badge variant="outline" className={cn("text-xs", getRoleColor(collaborator.role))}>
                            <div className="flex items-center gap-1">
                              {getRoleIcon(collaborator.role)}
                              {collaborator.role}
                            </div>
                          </Badge>

                          {enableRealtime && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => {
                                setMentionQuery(`@${collaborator.name}`);
                                setShowMentionPopup(true);
                              }}
                            >
                              <AtSign className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-center">
                          <p className="font-medium">{collaborator.name}</p>
                          <p className="text-xs text-muted-foreground">{collaborator.email}</p>
                          <p className="text-xs text-muted-foreground capitalize">{status}</p>
                          {enableRealtime && 'lastSeen' in presenceItem && (
                            <p className="text-xs text-muted-foreground">
                              Last seen: {new Date(presenceItem.lastSeen).toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>

            {/* Invite New Collaborator */}
            {(currentUserData && ('role' in currentUserData ? currentUserData.role === 'owner' : true)) && (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter email to invite..."
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && inviteCollaborator()}
                />
                <Button onClick={inviteCollaborator} disabled={!inviteEmail}>
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
      </Card>

        {/* Comments & Feedback */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Comments & Feedback
                {enableRealtime && (
                  <Badge variant="outline" className="text-xs">
                    Live
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unresolvedComments.length > 0 && (
                  <Badge variant="destructive" className="gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {unresolvedComments.length} unresolved
                  </Badge>
                )}
                {mentions.filter(m => !m.read).length > 0 && (
                  <Badge variant="secondary" className="gap-1">
                    <AtSign className="h-3 w-3" />
                    {mentions.filter(m => !m.read).length}
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Add Comment */}
            <div className="space-y-2">
              <div className="relative">
                <Textarea
                  placeholder={enableRealtime ? "Add a comment, @mention someone, or suggestion..." : "Add a comment or suggestion..."}
                  value={newComment}
                  onChange={(e) => {
                    setNewComment(e.target.value);
                    
                    // Handle mention triggers
                    if (enableRealtime && e.target.value.includes('@')) {
                      const lastAtIndex = e.target.value.lastIndexOf('@');
                      const textAfterAt = e.target.value.substring(lastAtIndex + 1);
                      if (!textAfterAt.includes(' ')) {
                        setMentionQuery(textAfterAt);
                        setShowMentionPopup(true);
                      }
                    } else {
                      setShowMentionPopup(false);
                    }
                  }}
                  rows={2}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      addComment();
                    }
                    if (e.key === 'Escape') {
                      setShowMentionPopup(false);
                    }
                  }}
                />

                {/* Mention Popup */}
                {showMentionPopup && enableRealtime && (
                  <div className="absolute bottom-full left-0 w-full bg-background border rounded-lg shadow-lg p-2 z-10">
                    <div className="text-xs text-muted-foreground mb-2">Mention someone:</div>
                    {filteredMentionUsers().map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer"
                        onClick={() => {
                          const beforeAt = newComment.substring(0, newComment.lastIndexOf('@'));
                          setNewComment(`${beforeAt}@${user.name} `);
                          setShowMentionPopup(false);
                        }}
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="text-xs">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">
                    {selectedField ? `Commenting on field: ${selectedField}` : 'General comment'}
                  </p>
                  {enableRealtime && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs gap-1"
                      onClick={() => setShowMentionPopup(!showMentionPopup)}
                    >
                      <AtSign className="h-3 w-3" />
                      Mention
                    </Button>
                  )}
                </div>
                <Button 
                  onClick={addComment} 
                  disabled={!newComment.trim()}
                  size="sm"
                  className="gap-1"
                >
                  <Send className="h-3 w-3" />
                  {enableRealtime ? 'Send' : 'Comment'}
                </Button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {getActiveComments().map((comment) => (
                <EnhancedCommentItem
                  key={comment.id}
                  comment={comment}
                  collaborators={activePresence}
                  onResolve={() => resolveComment(comment.id)}
                  onReply={enableRealtime ? (content) => addReply(comment.id, content) : undefined}
                  canResolve={currentUserData && ('role' in currentUserData ? 
                    currentUserData.role === 'owner' || currentUserData.role === 'editor' : true)}
                  enableRealtime={enableRealtime}
                  replyToComment={replyToComment}
                  setReplyToComment={setReplyToComment}
                />
              ))}
              
              {getActiveComments().length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No comments yet. Start the conversation!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Version History Modal */}
        {showVersionHistory && (
          <VersionHistoryModal
            versions={versions}
            collaborators={activePresence}
            onClose={() => setShowVersionHistory(false)}
            onRestore={(versionId) => {
              // Implement version restore
              setShowVersionHistory(false);
            }}
          />
        )}
      </div>
    </TooltipProvider>
  );
};

// Enhanced Comment item component with real-time features
const EnhancedCommentItem: React.FC<{
  comment: CollabComment | Comment;
  collaborators: (PresenceInfo | Collaborator)[];
  onResolve: () => void;
  onReply?: (content: string) => void;
  canResolve: boolean;
  enableRealtime: boolean;
  replyToComment: string | null;
  setReplyToComment: (id: string | null) => void;
}> = ({ comment, collaborators, onResolve, onReply, canResolve, enableRealtime, replyToComment, setReplyToComment }) => {
  const [replyContent, setReplyContent] = React.useState('');
  
  const author = collaborators.find(c => 
    'user' in c ? c.user.id === comment.authorId : c.id === comment.authorId
  );
  
  const authorData = 'user' in (author || {}) ? author!.user : author;
  
  const isReplying = replyToComment === comment.id;
  
  const handleReply = () => {
    if (replyContent.trim() && onReply) {
      onReply(replyContent);
      setReplyContent('');
      setReplyToComment(null);
    }
  };
  
  return (
    <div className={cn(
      "flex gap-3 p-3 rounded-lg border transition-all",
      comment.resolved ? "bg-muted/50 opacity-75" : "bg-background",
      enableRealtime && "hover:shadow-sm"
    )}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={authorData?.avatar} />
        <AvatarFallback 
          className="text-xs"
          style={{ backgroundColor: authorData?.color || '#94A3B8' }}
        >
          {authorData?.name?.charAt(0) || '?'}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{authorData?.name || 'Unknown'}</span>
            <span className="text-xs text-muted-foreground">
              {'timestamp' in comment 
                ? (comment.timestamp instanceof Date 
                  ? comment.timestamp.toLocaleString() 
                  : new Date(comment.timestamp).toLocaleString())
                : 'Just now'
              }
            </span>
            {'fieldId' in comment && comment.fieldId && (
              <Badge variant="outline" className="text-xs">
                Field: {comment.fieldId}
              </Badge>
            )}
            {enableRealtime && 'position' in comment && (
              <Badge variant="outline" className="text-xs">
                <Pin className="h-2 w-2 mr-1" />
                Line {comment.position.line}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {enableRealtime && onReply && !comment.resolved && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={() => setReplyToComment(isReplying ? null : comment.id)}
              >
                <Reply className="h-3 w-3" />
              </Button>
            )}
            
            {!comment.resolved && canResolve && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onResolve}>
                    <Check className="h-3 w-3 mr-1" />
                    Resolve
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        
        <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
        
        {/* Replies */}
        {'replies' in comment && comment.replies && comment.replies.length > 0 && (
          <div className="mt-2 space-y-2 border-l-2 border-muted pl-3">
            {comment.replies.map((reply) => (
              <div key={reply.id} className="flex gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={authorData?.avatar} />
                  <AvatarFallback className="text-xs">
                    {reply.authorName?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">{reply.authorName}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(reply.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{reply.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Reply Input */}
        {isReplying && onReply && (
          <div className="mt-2 space-y-2">
            <Textarea
              placeholder="Write a reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={2}
              className="text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleReply();
                }
                if (e.key === 'Escape') {
                  setReplyToComment(null);
                  setReplyContent('');
                }
              }}
            />
            <div className="flex justify-end gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setReplyToComment(null);
                  setReplyContent('');
                }}
              >
                Cancel
              </Button>
              <Button 
                size="sm"
                onClick={handleReply}
                disabled={!replyContent.trim()}
                className="gap-1"
              >
                <Send className="h-3 w-3" />
                Reply
              </Button>
            </div>
          </div>
        )}
        
        {comment.resolved && (
          <div className="flex items-center gap-1 text-xs text-green-600 mt-2">
            <Check className="h-3 w-3" />
            Resolved
          </div>
        )}
      </div>
    </div>
  );
};

// Version history modal component
const VersionHistoryModal: React.FC<{
  versions: DocumentVersion[];
  collaborators: Collaborator[];
  onClose: () => void;
  onRestore: (versionId: string) => void;
}> = ({ versions, collaborators, onClose, onRestore }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Version History</CardTitle>
            <Button variant="ghost" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="overflow-y-auto">
          <div className="space-y-3">
            {versions.map((version) => {
              const author = collaborators.find(c => c.id === version.authorId);
              
              return (
                <div key={version.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{author?.name || 'Unknown'}</span>
                      <span className="text-xs text-muted-foreground">
                        {version.timestamp.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{version.description}</p>
                    <div className="flex gap-1 mt-1">
                      {version.changes.slice(0, 3).map((change, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {change}
                        </Badge>
                      ))}
                      {version.changes.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{version.changes.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onRestore(version.id)}
                  >
                    Restore
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentCollaboration;