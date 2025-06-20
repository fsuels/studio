// src/components/versioning/DocumentComparison.tsx
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  GitCompare, 
  Clock, 
  User, 
  Plus, 
  Minus, 
  Edit,
  Download,
  Share,
  History,
  ArrowLeft,
  ArrowRight,
  Eye,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocumentVersion {
  id: string;
  version: string;
  timestamp: Date;
  authorId: string;
  authorName: string;
  description: string;
  size: number;
  changes: Change[];
  status: 'draft' | 'review' | 'approved' | 'published';
}

interface Change {
  id: string;
  type: 'addition' | 'deletion' | 'modification';
  field: string;
  oldValue?: string;
  newValue?: string;
  position: number;
  context: string;
}

interface Diff {
  field: string;
  type: 'added' | 'removed' | 'modified' | 'unchanged';
  oldValue?: string;
  newValue?: string;
  confidence: number;
}

interface DocumentComparisonProps {
  documentId: string;
  versions: DocumentVersion[];
  onVersionRestore?: (versionId: string) => void;
  onClose?: () => void;
  className?: string;
}

const DocumentComparison: React.FC<DocumentComparisonProps> = ({
  documentId,
  versions,
  onVersionRestore,
  onClose,
  className
}) => {
  const { t } = useTranslation('comparison');
  const [leftVersion, setLeftVersion] = React.useState<string>(versions[1]?.id || '');
  const [rightVersion, setRightVersion] = React.useState<string>(versions[0]?.id || '');
  const [diffs, setDiffs] = React.useState<Diff[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'side-by-side' | 'unified'>('side-by-side');
  const [showOnlyChanges, setShowOnlyChanges] = React.useState(false);

  // Generate comparison when versions change
  React.useEffect(() => {
    if (leftVersion && rightVersion && leftVersion !== rightVersion) {
      generateComparison();
    }
  }, [leftVersion, rightVersion]);

  const generateComparison = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/documents/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId,
          leftVersionId: leftVersion,
          rightVersionId: rightVersion
        })
      });

      const comparison = await response.json();
      setDiffs(comparison.diffs || []);
    } catch (error) {
      console.error('Failed to generate comparison:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getVersionById = (id: string) => versions.find(v => v.id === id);
  const leftVersionData = getVersionById(leftVersion);
  const rightVersionData = getVersionById(rightVersion);

  const changeStats = React.useMemo(() => {
    const stats = {
      additions: diffs.filter(d => d.type === 'added').length,
      deletions: diffs.filter(d => d.type === 'removed').length,
      modifications: diffs.filter(d => d.type === 'modified').length
    };
    return {
      ...stats,
      total: stats.additions + stats.deletions + stats.modifications
    };
  }, [diffs]);

  const filteredDiffs = showOnlyChanges 
    ? diffs.filter(d => d.type !== 'unchanged')
    : diffs;

  const getDiffIcon = (type: string) => {
    switch (type) {
      case 'added': return <Plus className="h-3 w-3 text-green-600" />;
      case 'removed': return <Minus className="h-3 w-3 text-red-600" />;
      case 'modified': return <Edit className="h-3 w-3 text-blue-600" />;
      default: return null;
    }
  };

  const getDiffColor = (type: string) => {
    switch (type) {
      case 'added': return 'bg-green-50 border-green-200 text-green-900';
      case 'removed': return 'bg-red-50 border-red-200 text-red-900';
      case 'modified': return 'bg-blue-50 border-blue-200 text-blue-900';
      default: return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'review': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'published': return <Eye className="h-4 w-4 text-blue-600" />;
      default: return <Edit className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <GitCompare className="h-5 w-5" />
              Document Comparison
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'side-by-side' ? 'unified' : 'side-by-side')}
              >
                {viewMode === 'side-by-side' ? 'Unified View' : 'Side by Side'}
              </Button>
              
              {onClose && (
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Version Selectors */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Compare from:</label>
              <Select value={leftVersion} onValueChange={setLeftVersion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select version" />
                </SelectTrigger>
                <SelectContent>
                  {versions.map(version => (
                    <SelectItem key={version.id} value={version.id}>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(version.status)}
                        <span>v{version.version}</span>
                        <span className="text-muted-foreground">
                          - {version.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Compare to:</label>
              <Select value={rightVersion} onValueChange={setRightVersion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select version" />
                </SelectTrigger>
                <SelectContent>
                  {versions.map(version => (
                    <SelectItem key={version.id} value={version.id}>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(version.status)}
                        <span>v{version.version}</span>
                        <span className="text-muted-foreground">
                          - {version.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Version Info */}
          {leftVersionData && rightVersionData && (
            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              <VersionInfo version={leftVersionData} side="left" />
              <VersionInfo version={rightVersionData} side="right" />
            </div>
          )}

          {/* Change Statistics */}
          {changeStats.total > 0 && (
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-green-600">
                  <Plus className="h-3 w-3" />
                  {changeStats.additions} additions
                </div>
                <div className="flex items-center gap-1 text-red-600">
                  <Minus className="h-3 w-3" />
                  {changeStats.deletions} deletions
                </div>
                <div className="flex items-center gap-1 text-blue-600">
                  <Edit className="h-3 w-3" />
                  {changeStats.modifications} modifications
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showOnlyChanges}
                    onChange={(e) => setShowOnlyChanges(e.target.checked)}
                    className="rounded"
                  />
                  Show only changes
                </label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comparison View */}
      {isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Generating comparison...</p>
            </div>
          </CardContent>
        </Card>
      ) : diffs.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            {viewMode === 'side-by-side' ? (
              <SideBySideView diffs={filteredDiffs} />
            ) : (
              <UnifiedView diffs={filteredDiffs} />
            )}
          </CardContent>
        </Card>
      ) : leftVersion && rightVersion && leftVersion !== rightVersion ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium">No differences found</p>
              <p className="text-xs text-muted-foreground">
                The selected versions are identical
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Actions */}
      {leftVersionData && rightVersionData && changeStats.total > 0 && (
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="text-sm text-muted-foreground">
              Comparing v{leftVersionData.version} with v{rightVersionData.version}
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export Diff
              </Button>
              
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-1" />
                Share
              </Button>

              {onVersionRestore && (
                <Button 
                  onClick={() => onVersionRestore(leftVersion)}
                  size="sm"
                >
                  <History className="h-4 w-4 mr-1" />
                  Restore v{leftVersionData.version}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Version info component
const VersionInfo: React.FC<{ version: DocumentVersion; side: 'left' | 'right' }> = ({ 
  version, 
  side 
}) => {
  return (
    <div className={cn(
      "space-y-2 p-3 rounded-lg border",
      side === 'left' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
    )}>
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">Version {version.version}</h4>
        <Badge variant="outline" className="text-xs">
          {version.status}
        </Badge>
      </div>
      
      <div className="space-y-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <User className="h-3 w-3" />
          {version.authorName}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {version.timestamp.toLocaleString()}
        </div>
      </div>
      
      {version.description && (
        <p className="text-xs">{version.description}</p>
      )}
    </div>
  );
};

// Side-by-side comparison view
const SideBySideView: React.FC<{ diffs: Diff[] }> = ({ diffs }) => {
  return (
    <div className="grid grid-cols-2 divide-x">
      <div className="p-4 space-y-2">
        <h3 className="text-sm font-medium text-red-600 mb-3">Previous Version</h3>
        {diffs.map((diff, index) => (
          <DiffLine key={index} diff={diff} side="left" />
        ))}
      </div>
      
      <div className="p-4 space-y-2">
        <h3 className="text-sm font-medium text-green-600 mb-3">Current Version</h3>
        {diffs.map((diff, index) => (
          <DiffLine key={index} diff={diff} side="right" />
        ))}
      </div>
    </div>
  );
};

// Unified comparison view
const UnifiedView: React.FC<{ diffs: Diff[] }> = ({ diffs }) => {
  return (
    <div className="p-4 space-y-2">
      {diffs.map((diff, index) => (
        <UnifiedDiffLine key={index} diff={diff} />
      ))}
    </div>
  );
};

// Diff line component for side-by-side view
const DiffLine: React.FC<{ diff: Diff; side: 'left' | 'right' }> = ({ diff, side }) => {
  const showValue = side === 'left' ? diff.oldValue : diff.newValue;
  const isVisible = side === 'left' 
    ? diff.type === 'removed' || diff.type === 'modified' || diff.type === 'unchanged'
    : diff.type === 'added' || diff.type === 'modified' || diff.type === 'unchanged';

  if (!isVisible || !showValue) return <div className="h-6" />;

  return (
    <div className={cn(
      "p-2 rounded text-sm border",
      diff.type === 'unchanged' ? 'bg-gray-50 border-gray-200' :
      side === 'left' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
    )}>
      <div className="flex items-start gap-2">
        <span className="text-xs text-muted-foreground font-mono">{diff.field}:</span>
        <span className="flex-1">{showValue}</span>
        {diff.type !== 'unchanged' && (
          <div className="shrink-0">
            {getDiffIcon(diff.type)}
          </div>
        )}
      </div>
    </div>
  );
};

// Unified diff line component
const UnifiedDiffLine: React.FC<{ diff: Diff }> = ({ diff }) => {
  if (diff.type === 'unchanged') {
    return (
      <div className="p-2 text-sm text-muted-foreground">
        <span className="font-mono text-xs mr-2">{diff.field}:</span>
        {diff.newValue || diff.oldValue}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="text-xs text-muted-foreground font-medium">{diff.field}</div>
      
      {diff.type === 'modified' && (
        <>
          <div className="p-2 rounded text-sm bg-red-50 border border-red-200">
            <div className="flex items-start gap-2">
              <Minus className="h-3 w-3 text-red-600 mt-0.5 shrink-0" />
              <span className="flex-1 line-through opacity-75">{diff.oldValue}</span>
            </div>
          </div>
          <div className="p-2 rounded text-sm bg-green-50 border border-green-200">
            <div className="flex items-start gap-2">
              <Plus className="h-3 w-3 text-green-600 mt-0.5 shrink-0" />
              <span className="flex-1">{diff.newValue}</span>
            </div>
          </div>
        </>
      )}
      
      {diff.type === 'added' && (
        <div className="p-2 rounded text-sm bg-green-50 border border-green-200">
          <div className="flex items-start gap-2">
            <Plus className="h-3 w-3 text-green-600 mt-0.5 shrink-0" />
            <span className="flex-1">{diff.newValue}</span>
          </div>
        </div>
      )}
      
      {diff.type === 'removed' && (
        <div className="p-2 rounded text-sm bg-red-50 border border-red-200">
          <div className="flex items-start gap-2">
            <Minus className="h-3 w-3 text-red-600 mt-0.5 shrink-0" />
            <span className="flex-1 line-through opacity-75">{diff.oldValue}</span>
          </div>
        </div>
      )}
    </div>
  );
};

function getDiffIcon(type: string) {
  switch (type) {
    case 'added': return <Plus className="h-3 w-3 text-green-600" />;
    case 'removed': return <Minus className="h-3 w-3 text-red-600" />;
    case 'modified': return <Edit className="h-3 w-3 text-blue-600" />;
    default: return null;
  }
}

export default DocumentComparison;