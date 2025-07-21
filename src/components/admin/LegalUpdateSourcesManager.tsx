'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Settings,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { LegalUpdateSource } from '@/lib/legal-updates/schema';

interface SourceWithStats extends LegalUpdateSource {
  stats?: {
    totalUpdates: number;
    recentUpdates: number;
    lastSuccessfulFetch?: Date;
    errorCount: number;
  };
}

export function LegalUpdateSourcesManager() {
  const [sources, setSources] = useState<SourceWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingSourceId, setProcessingSourceId] = useState<string | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/legal-update-sources', {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'admin-token'}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch sources');
      }

      const data = await response.json();
      setSources(data.sources || []);
    } catch (error) {
      console.error('Error fetching sources:', error);
      setError('Failed to load legal update sources');
    } finally {
      setLoading(false);
    }
  };

  const toggleSourceStatus = async (sourceId: string, isActive: boolean) => {
    try {
      setProcessingSourceId(sourceId);

      const response = await fetch(
        `/api/admin/legal-update-sources/${sourceId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'admin-token'}`,
          },
          body: JSON.stringify({ isActive: !isActive }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to update source');
      }

      // Update local state
      setSources((prev) =>
        prev.map((source) =>
          source.id === sourceId ? { ...source, isActive: !isActive } : source,
        ),
      );
    } catch (error) {
      console.error('Error updating source:', error);
    } finally {
      setProcessingSourceId(null);
    }
  };

  const testSource = async (sourceId: string) => {
    try {
      setProcessingSourceId(sourceId);

      const response = await fetch(
        `/api/admin/legal-update-sources/${sourceId}/test`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'admin-token'}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to test source');
      }

      const result = await response.json();

      // Show success/error message
      if (result.success) {
        alert(`Test successful! Found ${result.updateCount} updates`);
      } else {
        alert(`Test failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error testing source:', error);
      alert('Failed to test source');
    } finally {
      setProcessingSourceId(null);
    }
  };

  const getStatusIcon = (source: SourceWithStats) => {
    if (!source.isActive) {
      return <Pause className="h-4 w-4 text-gray-500" />;
    }

    if (source.stats?.errorCount && source.stats.errorCount > 0) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }

    if (source.lastFetched) {
      const timeSinceLastFetch = Date.now() - source.lastFetched.getTime();
      const hoursSince = timeSinceLastFetch / (1000 * 60 * 60);

      if (hoursSince < 24) {
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      } else {
        return <Clock className="h-4 w-4 text-yellow-500" />;
      }
    }

    return <Clock className="h-4 w-4 text-gray-500" />;
  };

  const getStatusText = (source: SourceWithStats) => {
    if (!source.isActive) return 'Inactive';
    if (source.stats?.errorCount && source.stats.errorCount > 0) return 'Error';
    if (source.lastFetched) {
      const timeSinceLastFetch = Date.now() - source.lastFetched.getTime();
      const hoursSince = timeSinceLastFetch / (1000 * 60 * 60);

      if (hoursSince < 1) return 'Just updated';
      if (hoursSince < 24) return `${Math.floor(hoursSince)}h ago`;
      return `${Math.floor(hoursSince / 24)}d ago`;
    }
    return 'Never fetched';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 animate-pulse" />
            <CardTitle>Legal Update Sources</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse border rounded-lg p-4">
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <CardTitle>Legal Update Sources</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchSources}
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <CardTitle>Legal Update Sources</CardTitle>
            <Badge variant="secondary">
              {sources.filter((s) => s.isActive).length} active
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchSources}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Add Source
            </Button>
          </div>
        </div>
        <CardDescription>
          Manage RSS feeds and data sources for legal update intelligence
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sources.length === 0 ? (
          <div className="text-center py-8">
            <Settings className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No legal update sources configured
            </p>
            <Button variant="outline" size="sm" className="mt-2">
              <Plus className="h-4 w-4" />
              Add First Source
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {sources.map((source) => (
              <div key={source.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(source)}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{source.name}</h4>
                        <Badge className={getPriorityColor(source.priority)}>
                          {source.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {source.jurisdiction}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {source.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {source.category} • {source.fetchFrequency} •{' '}
                        {getStatusText(source)}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          Updates: {source.stats?.totalUpdates || 0} total,{' '}
                          {source.stats?.recentUpdates || 0} recent
                        </span>
                        {source.stats?.errorCount &&
                          source.stats.errorCount > 0 && (
                            <span className="text-red-600">
                              {source.stats.errorCount} errors
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={source.isActive ? 'default' : 'secondary'}>
                      {source.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        toggleSourceStatus(source.id, source.isActive)
                      }
                      disabled={processingSourceId === source.id}
                    >
                      {source.isActive ? (
                        <Pause className="h-3 w-3" />
                      ) : (
                        <Play className="h-3 w-3" />
                      )}
                      {source.isActive ? 'Pause' : 'Activate'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => testSource(source.id)}
                      disabled={processingSourceId === source.id}
                    >
                      <RefreshCw
                        className={`h-3 w-3 ${processingSourceId === source.id ? 'animate-spin' : ''}`}
                      />
                      Test
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={source.rssUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3 w-3" />
                        RSS
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Statistics */}
        {sources.length > 0 && (
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {sources.filter((s) => s.isActive).length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Active Sources
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {sources.reduce(
                    (sum, s) => sum + (s.stats?.totalUpdates || 0),
                    0,
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Updates
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {sources.reduce(
                    (sum, s) => sum + (s.stats?.recentUpdates || 0),
                    0,
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Recent Updates
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {sources.reduce(
                    (sum, s) => sum + (s.stats?.errorCount || 0),
                    0,
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Errors
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
