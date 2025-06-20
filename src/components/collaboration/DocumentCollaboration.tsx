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
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
  onSave?: (data: any) => void;
  className?: string;
}

const DocumentCollaboration: React.FC<DocumentCollaborationProps> = ({
  documentId,
  currentUserId,
  onSave,
  className
}) => {
  const { t } = useTranslation('collaboration');
  const [collaborators, setCollaborators] = React.useState<Collaborator[]>([]);
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [versions, setVersions] = React.useState<DocumentVersion[]>([]);
  const [newComment, setNewComment] = React.useState('');
  const [selectedField, setSelectedField] = React.useState<string | null>(null);
  const [showVersionHistory, setShowVersionHistory] = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState('');

  // Load collaboration data
  React.useEffect(() => {
    loadCollaborationData();
    setupRealtimeUpdates();
  }, [documentId]);

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
    // Setup WebSocket or EventSource for real-time updates
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
  };

  const resolveComment = async (commentId: string) => {
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

  const showFieldChangeNotification = (update: any) => {
    // Show a subtle notification about field changes
    // This could integrate with your toast system
  };

  const unresolvedComments = comments.filter(c => !c.resolved);
  const currentUser = collaborators.find(c => c.id === currentUserId);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Collaboration Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Collaboration
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
            <h3 className="text-sm font-medium mb-2">Active Collaborators</h3>
            <div className="flex items-center gap-2 flex-wrap">
              {collaborators.map((collaborator) => (
                <div 
                  key={collaborator.id}
                  className="flex items-center gap-2 bg-muted rounded-lg p-2"
                >
                  <div className="relative">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={collaborator.avatar} />
                      <AvatarFallback className="text-xs">
                        {collaborator.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-background",
                      collaborator.status === 'online' ? 'bg-green-500' :
                      collaborator.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                    )} />
                  </div>
                  
                  <span className="text-sm font-medium">{collaborator.name}</span>
                  
                  <Badge variant="outline" className={cn("text-xs", getRoleColor(collaborator.role))}>
                    <div className="flex items-center gap-1">
                      {getRoleIcon(collaborator.role)}
                      {collaborator.role}
                    </div>
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Invite New Collaborator */}
          {currentUser?.role === 'owner' && (
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
            </div>
            {unresolvedComments.length > 0 && (
              <Badge variant="destructive" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                {unresolvedComments.length} unresolved
              </Badge>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Add Comment */}
          <div className="space-y-2">
            <Textarea
              placeholder="Add a comment or suggestion..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={2}
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                {selectedField ? `Commenting on field: ${selectedField}` : 'General comment'}
              </p>
              <Button 
                onClick={addComment} 
                disabled={!newComment.trim()}
                size="sm"
                className="gap-1"
              >
                <Send className="h-3 w-3" />
                Comment
              </Button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                collaborators={collaborators}
                onResolve={() => resolveComment(comment.id)}
                canResolve={currentUser?.role === 'owner' || currentUser?.role === 'editor'}
              />
            ))}
            
            {comments.length === 0 && (
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
          collaborators={collaborators}
          onClose={() => setShowVersionHistory(false)}
          onRestore={(versionId) => {
            // Implement version restore
            setShowVersionHistory(false);
          }}
        />
      )}
    </div>
  );
};

// Comment item component
const CommentItem: React.FC<{
  comment: Comment;
  collaborators: Collaborator[];
  onResolve: () => void;
  canResolve: boolean;
}> = ({ comment, collaborators, onResolve, canResolve }) => {
  const author = collaborators.find(c => c.id === comment.authorId);
  
  return (
    <div className={cn(
      "flex gap-3 p-3 rounded-lg border",
      comment.resolved ? "bg-muted/50 opacity-75" : "bg-background"
    )}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={author?.avatar} />
        <AvatarFallback className="text-xs">
          {author?.name.charAt(0) || '?'}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{author?.name || 'Unknown'}</span>
            <span className="text-xs text-muted-foreground">
              {comment.timestamp.toLocaleString()}
            </span>
            {comment.fieldId && (
              <Badge variant="outline" className="text-xs">
                Field: {comment.fieldId}
              </Badge>
            )}
          </div>
          
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
        
        <p className="text-sm">{comment.content}</p>
        
        {comment.resolved && (
          <div className="flex items-center gap-1 text-xs text-green-600">
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