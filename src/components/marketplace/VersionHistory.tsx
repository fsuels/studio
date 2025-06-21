// src/components/marketplace/VersionHistory.tsx
'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  GitBranch,
  Clock,
  Download,
  Eye,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Plus,
  Minus,
  Edit,
  Bug,
  Shield,
  Zap,
} from 'lucide-react';
import type {
  TemplateVersion,
  ChangelogEntry,
  SemanticVersion,
} from '@/types/marketplace';

interface VersionHistoryProps {
  templateId: string;
  versions: TemplateVersion[];
  currentVersion: SemanticVersion;
}

interface VersionItemProps {
  version: TemplateVersion;
  isLatest: boolean;
  onPreview: (versionId: string) => void;
  onInstall: (versionId: string) => void;
}

function VersionItem({
  version,
  isLatest,
  onPreview,
  onInstall,
}: VersionItemProps) {
  const [isExpanded, setIsExpanded] = useState(isLatest);

  const getChangeTypeIcon = (type: ChangelogEntry['type']) => {
    switch (type) {
      case 'added':
        return <Plus className="h-4 w-4 text-green-600" />;
      case 'changed':
        return <Edit className="h-4 w-4 text-blue-600" />;
      case 'deprecated':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'removed':
        return <Minus className="h-4 w-4 text-red-600" />;
      case 'fixed':
        return <Bug className="h-4 w-4 text-purple-600" />;
      case 'security':
        return <Shield className="h-4 w-4 text-orange-600" />;
      default:
        return <Zap className="h-4 w-4 text-gray-600" />;
    }
  };

  const getChangeTypeBadge = (type: ChangelogEntry['type']) => {
    const variants = {
      added: 'bg-green-100 text-green-800 border-green-300',
      changed: 'bg-blue-100 text-blue-800 border-blue-300',
      deprecated: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      removed: 'bg-red-100 text-red-800 border-red-300',
      fixed: 'bg-purple-100 text-purple-800 border-purple-300',
      security: 'bg-orange-100 text-orange-800 border-orange-300',
    };

    return (
      <Badge
        className={
          variants[type] || 'bg-gray-100 text-gray-800 border-gray-300'
        }
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const getImpactBadge = (impact: ChangelogEntry['impact']) => {
    const variants = {
      major: 'bg-red-100 text-red-800 border-red-300',
      minor: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      patch: 'bg-green-100 text-green-800 border-green-300',
    };

    return (
      <Badge className={variants[impact]}>
        {impact.charAt(0).toUpperCase() + impact.slice(1)}
      </Badge>
    );
  };

  const formatDate = (date: any) => {
    return new Date(date.toDate ? date.toDate() : date).toLocaleDateString(
      'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      },
    );
  };

  const getVersionType = (version: string) => {
    const [major, minor, patch] = version.split('.').map(Number);
    if (patch > 0) return 'Patch';
    if (minor > 0) return 'Minor';
    return 'Major';
  };

  return (
    <Card className={`${isLatest ? 'ring-2 ring-primary/20' : ''}`}>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <GitBranch className="h-5 w-5" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">
                      v{version.version}
                    </CardTitle>
                    {isLatest && (
                      <Badge className="bg-primary/10 text-primary border-primary/30">
                        Latest
                      </Badge>
                    )}
                    {version.breaking && (
                      <Badge className="bg-red-100 text-red-800 border-red-300">
                        Breaking
                      </Badge>
                    )}
                    <Badge variant="outline">
                      {getVersionType(version.version)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(version.createdAt)}
                    </div>
                    <span>by {version.createdBy}</span>
                    <Badge variant="outline" className="text-xs">
                      {version.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreview(version.id);
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>

                {isLatest && (
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onInstall(version.id);
                    }}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Install
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            {/* Compatibility Info */}
            {(version.breaking ||
              !version.compatibility.backwardCompatible) && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">
                      Compatibility Notice
                    </h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      {version.breaking &&
                        'This version contains breaking changes. '}
                      {!version.compatibility.backwardCompatible &&
                        'This version is not backward compatible with previous versions. '}
                      {version.compatibility.migrationRequired &&
                        'Migration may be required for existing documents.'}
                    </p>
                    {version.compatibility.migrationGuide && (
                      <p className="text-sm text-yellow-700 mt-2">
                        <strong>Migration Guide:</strong>{' '}
                        {version.compatibility.migrationGuide}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Changelog */}
            <div className="space-y-4">
              <h4 className="font-semibold">What's Changed</h4>

              {version.changelog.length > 0 ? (
                <div className="space-y-3">
                  {version.changelog.map((change, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {getChangeTypeIcon(change.type)}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getChangeTypeBadge(change.type)}
                          {getImpactBadge(change.impact)}
                        </div>

                        <p className="text-sm">{change.description}</p>

                        {change.affectedFields &&
                          change.affectedFields.length > 0 && (
                            <div className="mt-2">
                              <span className="text-xs text-muted-foreground">
                                Affected fields:{' '}
                                {change.affectedFields.join(', ')}
                              </span>
                            </div>
                          )}

                        {change.translations && (
                          <div className="mt-2">
                            <details className="text-xs">
                              <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                                View translations
                              </summary>
                              <div className="mt-1 space-y-1">
                                {Object.entries(change.translations).map(
                                  ([lang, desc]) => (
                                    <div key={lang} className="flex gap-2">
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {lang.toUpperCase()}
                                      </Badge>
                                      <span className="text-muted-foreground">
                                        {desc}
                                      </span>
                                    </div>
                                  ),
                                )}
                              </div>
                            </details>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No changelog available for this version.
                </p>
              )}
            </div>

            {/* Technical Details */}
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-semibold mb-3">Technical Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Version Type:</span>
                    <span>{getVersionType(version.version)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Breaking Changes:
                    </span>
                    <span
                      className={
                        version.breaking ? 'text-red-600' : 'text-green-600'
                      }
                    >
                      {version.breaking ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Backward Compatible:
                    </span>
                    <span
                      className={
                        version.compatibility.backwardCompatible
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      {version.compatibility.backwardCompatible ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Migration Required:
                    </span>
                    <span
                      className={
                        version.compatibility.migrationRequired
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      }
                    >
                      {version.compatibility.migrationRequired ? 'Yes' : 'No'}
                    </span>
                  </div>
                  {version.compatibility.minimumAppVersion && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Min App Version:
                      </span>
                      <span>{version.compatibility.minimumAppVersion}</span>
                    </div>
                  )}
                  {version.prerelease && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Prerelease:</span>
                      <span className="text-orange-600">
                        {version.prerelease}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Validation Results */}
            {version.validationResults &&
              version.validationResults.length > 0 && (
                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-semibold mb-3">Validation Results</h4>
                  <div className="space-y-2">
                    {version.validationResults.map((result, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-2 text-sm p-2 rounded ${
                          result.status === 'pass'
                            ? 'bg-green-50 text-green-800'
                            : result.status === 'fail'
                              ? 'bg-red-50 text-red-800'
                              : 'bg-yellow-50 text-yellow-800'
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            result.status === 'pass'
                              ? 'bg-green-500'
                              : result.status === 'fail'
                                ? 'bg-red-500'
                                : 'bg-yellow-500'
                          }`}
                        />
                        <span className="font-medium">{result.rule}:</span>
                        <span>{result.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

export function VersionHistory({
  templateId,
  versions,
  currentVersion,
}: VersionHistoryProps) {
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const sortedVersions = [...versions].sort((a, b) => {
    const dateA = new Date(
      a.createdAt.toDate ? a.createdAt.toDate() : a.createdAt,
    );
    const dateB = new Date(
      b.createdAt.toDate ? b.createdAt.toDate() : b.createdAt,
    );

    return sortOrder === 'newest'
      ? dateB.getTime() - dateA.getTime()
      : dateA.getTime() - dateB.getTime();
  });

  const handlePreview = (versionId: string) => {
    // TODO: Implement version preview
    console.log('Preview version:', versionId);
  };

  const handleInstall = (versionId: string) => {
    // TODO: Implement version installation
    console.log('Install version:', versionId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Version History</h2>
          <p className="text-muted-foreground">
            {versions.length} version{versions.length !== 1 ? 's' : ''}{' '}
            available
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={sortOrder === 'newest' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortOrder('newest')}
          >
            Newest First
          </Button>
          <Button
            variant={sortOrder === 'oldest' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortOrder('oldest')}
          >
            Oldest First
          </Button>
        </div>
      </div>

      {/* Version List */}
      <div className="space-y-4">
        {sortedVersions.length > 0 ? (
          sortedVersions.map((version) => (
            <VersionItem
              key={version.id}
              version={version}
              isLatest={version.version === currentVersion}
              onPreview={handlePreview}
              onInstall={handleInstall}
            />
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <GitBranch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No version history available
              </h3>
              <p className="text-muted-foreground">
                Version history will appear here as the template is updated.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
