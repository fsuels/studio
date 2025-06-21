'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Scale,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Filter,
  Bell,
  Archive,
  Bookmark,
  Share,
  X,
  RefreshCw,
} from 'lucide-react';
import { ProcessedLegalUpdate } from '@/lib/legal-updates/schema';

interface LegalUpdatesWidgetProps {
  className?: string;
  maxItems?: number;
  showFilters?: boolean;
  showActions?: boolean;
}

interface UpdateWithStatus extends ProcessedLegalUpdate {
  isRead?: boolean;
  isBookmarked?: boolean;
  isDismissed?: boolean;
}

export function LegalUpdatesWidget({
  className = '',
  maxItems = 5,
  showFilters = true,
  showActions = true,
}: LegalUpdatesWidgetProps) {
  const { user } = useAuth();
  const [updates, setUpdates] = useState<UpdateWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'urgent' | 'unread'>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLegalUpdates();
  }, [user, filter]);

  const fetchLegalUpdates = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        limit: maxItems.toString(),
        filter,
        userId: user?.uid || 'anonymous',
      });

      const response = await fetch(`/api/legal-updates/feed?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch legal updates');
      }

      const data = await response.json();
      setUpdates(data.updates || []);
    } catch (error) {
      console.error('Error fetching legal updates:', error);
      setError('Failed to load legal updates');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAction = async (
    updateId: string,
    action: 'read' | 'bookmark' | 'dismiss' | 'share',
  ) => {
    try {
      const response = await fetch('/api/legal-updates/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updateId,
          action,
          userId: user?.uid,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to perform action');
      }

      // Update local state
      setUpdates((prev) =>
        prev.map((update) => {
          if (update.id === updateId) {
            switch (action) {
              case 'read':
                return { ...update, isRead: true };
              case 'bookmark':
                return { ...update, isBookmarked: !update.isBookmarked };
              case 'dismiss':
                return { ...update, isDismissed: true };
              default:
                return update;
            }
          }
          return update;
        }),
      );

      if (action === 'share') {
        // Handle share action (copy link, etc.)
        await navigator.clipboard.writeText(
          window.location.origin + '/legal-updates/' + updateId,
        );
      }
    } catch (error) {
      console.error('Error performing action:', error);
    }
  };

  const getUrgencyIcon = (urgency: ProcessedLegalUpdate['urgency']) => {
    switch (urgency) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'low':
        return <CheckCircle2 className="h-4 w-4 text-blue-600" />;
      default:
        return <Scale className="h-4 w-4 text-gray-600" />;
    }
  };

  const getUrgencyColor = (urgency: ProcessedLegalUpdate['urgency']) => {
    switch (urgency) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredUpdates = updates.filter((update) => {
    if (update.isDismissed) return false;

    switch (filter) {
      case 'urgent':
        return update.urgency === 'critical' || update.urgency === 'high';
      case 'unread':
        return !update.isRead;
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 animate-pulse" />
            <CardTitle>Legal Updates</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            <CardTitle>Legal Updates</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchLegalUpdates}
              className="mt-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            <CardTitle>Legal Updates</CardTitle>
            {filteredUpdates.length > 0 && (
              <Badge variant="secondary">
                {filteredUpdates.filter((u) => !u.isRead).length} new
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={fetchLegalUpdates}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Stay compliant with the latest legal changes affecting your documents
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {showFilters && (
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'urgent' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('urgent')}
            >
              <AlertTriangle className="h-3 w-3" />
              Urgent
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              <Bell className="h-3 w-3" />
              Unread
            </Button>
          </div>
        )}

        {filteredUpdates.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              {filter === 'urgent'
                ? 'No urgent updates at this time'
                : filter === 'unread'
                  ? 'All updates have been read'
                  : 'No legal updates available'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUpdates.map((update) => (
              <div
                key={update.id}
                className={`border rounded-lg p-4 space-y-3 transition-all ${
                  update.isRead ? 'opacity-75' : ''
                } ${getUrgencyColor(update.urgency)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getUrgencyIcon(update.urgency)}
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium leading-tight">
                        {update.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {update.summary}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">
                          {update.jurisdiction}
                        </Badge>
                        {update.compliance.hasDeadline && (
                          <Badge
                            variant="outline"
                            className="text-xs text-red-600"
                          >
                            Deadline:{' '}
                            {new Date(
                              update.compliance.deadline!,
                            ).toLocaleDateString()}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {showActions && (
                    <div className="flex items-center gap-1">
                      {update.isBookmarked && (
                        <Bookmark className="h-4 w-4 text-blue-600 fill-current" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpdateAction(update.id, 'dismiss')}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>

                {update.actionItems.length > 0 && (
                  <div className="bg-background/50 rounded-lg p-3">
                    <h5 className="font-medium text-sm mb-2">
                      Action Required:
                    </h5>
                    <ul className="text-sm space-y-1">
                      {update.actionItems.slice(0, 2).map((action, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <ChevronRight className="h-3 w-3 mt-0.5 text-muted-foreground" />
                          <span>{action.description}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {showActions && (
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpdateAction(update.id, 'read')}
                        disabled={update.isRead}
                      >
                        {update.isRead ? 'Read' : 'Mark as Read'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleUpdateAction(update.id, 'bookmark')
                        }
                      >
                        <Bookmark
                          className={`h-3 w-3 ${update.isBookmarked ? 'fill-current' : ''}`}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpdateAction(update.id, 'share')}
                      >
                        <Share className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={`/legal-updates/${update.id}`} target="_blank">
                        <ExternalLink className="h-3 w-3" />
                        Details
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {filteredUpdates.length > 0 && (
          <Button variant="outline" className="w-full" asChild>
            <a href="/legal-updates">
              View All Legal Updates
              <ChevronRight className="h-4 w-4" />
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
