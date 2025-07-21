// src/components/translation/TranslationReviewWorkflow.tsx
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CheckCircle,
  XCircle,
  Clock,
  MessageCircle,
  Edit,
  Eye,
  Users,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Send,
  UserPlus,
  Scale,
  Globe,
  BookOpen,
  Star,
  History,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewStage {
  id: string;
  name: string;
  description: string;
  required: boolean;
  reviewerType:
    | 'ai'
    | 'legal_professional'
    | 'native_speaker'
    | 'subject_expert';
  estimatedTime: number; // in minutes
}

interface Reviewer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  type: 'legal_professional' | 'native_speaker' | 'subject_expert';
  specializations: string[];
  languages: string[];
  rating: number;
  reviewCount: number;
  certifications: string[];
}

interface ReviewComment {
  id: string;
  reviewerId: string;
  stageId: string;
  type: 'suggestion' | 'correction' | 'approval' | 'concern';
  originalText: string;
  suggestedText?: string;
  reason: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
  position?: { start: number; end: number };
  resolved: boolean;
}

interface TranslationReview {
  id: string;
  translationId: string;
  status: 'pending' | 'in_review' | 'completed' | 'rejected';
  currentStage: string;
  stages: ReviewStage[];
  reviewers: Reviewer[];
  comments: ReviewComment[];
  finalApproval?: {
    approved: boolean;
    approvedBy: string;
    timestamp: Date;
    notes?: string;
  };
  qualityScore?: number;
  estimatedCompletion: Date;
}

interface TranslationReviewWorkflowProps {
  translationResult: any;
  documentType: string;
  sourceLanguage: string;
  targetLanguage: string;
  jurisdiction: string;
  onReviewComplete?: (review: TranslationReview) => void;
  className?: string;
}

const REVIEW_STAGES: ReviewStage[] = [
  {
    id: 'ai_validation',
    name: 'AI Validation',
    description: 'Automated legal accuracy and terminology validation',
    required: true,
    reviewerType: 'ai',
    estimatedTime: 2,
  },
  {
    id: 'legal_review',
    name: 'Legal Professional Review',
    description:
      'Review by qualified legal professional in target jurisdiction',
    required: true,
    reviewerType: 'legal_professional',
    estimatedTime: 30,
  },
  {
    id: 'linguistic_review',
    name: 'Native Speaker Review',
    description: 'Language fluency and cultural appropriateness review',
    required: false,
    reviewerType: 'native_speaker',
    estimatedTime: 20,
  },
  {
    id: 'final_approval',
    name: 'Final Approval',
    description: 'Senior legal reviewer final approval',
    required: true,
    reviewerType: 'legal_professional',
    estimatedTime: 15,
  },
];

const TranslationReviewWorkflow: React.FC<TranslationReviewWorkflowProps> = ({
  translationResult,
  documentType,
  sourceLanguage,
  targetLanguage,
  jurisdiction,
  onReviewComplete,
  className,
}) => {
  const { t } = useTranslation('review');
  const [review, setReview] = React.useState<TranslationReview | null>(null);
  const [availableReviewers, setAvailableReviewers] = React.useState<
    Reviewer[]
  >([]);
  const [selectedReviewers, setSelectedReviewers] = React.useState<
    Record<string, string>
  >({});
  const [newComment, setNewComment] = React.useState('');
  const [selectedText, setSelectedText] = React.useState<{
    start: number;
    end: number;
  } | null>(null);
  const [activeTab, setActiveTab] = React.useState('overview');

  // Initialize review workflow
  React.useEffect(() => {
    initializeReview();
    loadAvailableReviewers();
  }, [translationResult]);

  const initializeReview = () => {
    // Determine required stages based on translation quality and complexity
    const requiredStages = REVIEW_STAGES.filter((stage) => {
      if (stage.required) return true;

      // Add linguistic review for low confidence translations
      if (
        stage.id === 'linguistic_review' &&
        translationResult.confidence < 0.8
      )
        return true;

      // Add subject expert review for complex documents
      if (
        stage.id === 'subject_expert' &&
        ['contract', 'agreement', 'legal_opinion'].includes(documentType)
      )
        return true;

      return false;
    });

    const newReview: TranslationReview = {
      id: crypto.randomUUID(),
      translationId: translationResult.id || crypto.randomUUID(),
      status: 'pending',
      currentStage: requiredStages[0].id,
      stages: requiredStages,
      reviewers: [],
      comments: [],
      estimatedCompletion: new Date(
        Date.now() +
          requiredStages.reduce(
            (total, stage) => total + stage.estimatedTime,
            0,
          ) *
            60 *
            1000,
      ),
    };

    setReview(newReview);
  };

  const loadAvailableReviewers = async () => {
    try {
      const response = await fetch('/api/translation/reviewers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetLanguage,
          jurisdiction,
          documentType,
          specializations: ['legal_translation', documentType],
        }),
      });

      const reviewers = await response.json();
      setAvailableReviewers(reviewers);
    } catch (error) {
      console.error('Failed to load reviewers:', error);
    }
  };

  const assignReviewer = async (stageId: string, reviewerId: string) => {
    if (!review) return;

    try {
      await fetch('/api/translation/assign-reviewer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewId: review.id,
          stageId,
          reviewerId,
        }),
      });

      setSelectedReviewers((prev) => ({
        ...prev,
        [stageId]: reviewerId,
      }));

      // Update review with assigned reviewer
      const reviewer = availableReviewers.find((r) => r.id === reviewerId);
      if (reviewer) {
        setReview((prev) =>
          prev
            ? {
                ...prev,
                reviewers: [
                  ...prev.reviewers.filter((r) => r.id !== reviewerId),
                  reviewer,
                ],
              }
            : null,
        );
      }
    } catch (error) {
      console.error('Failed to assign reviewer:', error);
    }
  };

  const startReview = async () => {
    if (!review) return;

    try {
      await fetch('/api/translation/start-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewId: review.id,
          translationResult,
          assignedReviewers: selectedReviewers,
        }),
      });

      setReview((prev) => (prev ? { ...prev, status: 'in_review' } : null));
    } catch (error) {
      console.error('Failed to start review:', error);
    }
  };

  const addComment = async (
    type: ReviewComment['type'],
    reason: string,
    suggestedText?: string,
  ) => {
    if (!review || !newComment.trim()) return;

    const comment: ReviewComment = {
      id: crypto.randomUUID(),
      reviewerId: 'current-user', // Replace with actual user ID
      stageId: review.currentStage,
      type,
      originalText: selectedText
        ? translationResult.translatedText.substring(
            selectedText.start,
            selectedText.end,
          )
        : '',
      suggestedText,
      reason: newComment,
      severity: type === 'concern' ? 'high' : 'medium',
      timestamp: new Date(),
      position: selectedText,
      resolved: false,
    };

    try {
      await fetch('/api/translation/add-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewId: review.id,
          comment,
        }),
      });

      setReview((prev) =>
        prev
          ? {
              ...prev,
              comments: [...prev.comments, comment],
            }
          : null,
      );

      setNewComment('');
      setSelectedText(null);
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const resolveComment = async (commentId: string) => {
    if (!review) return;

    try {
      await fetch('/api/translation/resolve-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewId: review.id,
          commentId,
        }),
      });

      setReview((prev) =>
        prev
          ? {
              ...prev,
              comments: prev.comments.map((c) =>
                c.id === commentId ? { ...c, resolved: true } : c,
              ),
            }
          : null,
      );
    } catch (error) {
      console.error('Failed to resolve comment:', error);
    }
  };

  const getStageStatus = (stageId: string) => {
    if (!review) return 'pending';

    const currentIndex = review.stages.findIndex(
      (s) => s.id === review.currentStage,
    );
    const stageIndex = review.stages.findIndex((s) => s.id === stageId);

    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'active';
    return 'pending';
  };

  const getStageIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'active':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-gray-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getCommentIcon = (type: string) => {
    switch (type) {
      case 'suggestion':
        return <MessageCircle className="h-4 w-4 text-blue-600" />;
      case 'correction':
        return <Edit className="h-4 w-4 text-orange-600" />;
      case 'approval':
        return <ThumbsUp className="h-4 w-4 text-green-600" />;
      case 'concern':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <MessageCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const unresolvedComments = review?.comments.filter((c) => !c.resolved) || [];
  const totalEstimatedTime =
    review?.stages.reduce((total, stage) => total + stage.estimatedTime, 0) ||
    0;

  if (!review) {
    return <div>Loading review workflow...</div>;
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Translation Review Workflow
            <Badge
              variant="outline"
              className={cn(
                review.status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : review.status === 'in_review'
                    ? 'bg-blue-100 text-blue-800'
                    : review.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800',
              )}
            >
              {review.status.replace('_', ' ')}
            </Badge>
          </CardTitle>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Estimated: {totalEstimatedTime} minutes
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {review.reviewers.length} reviewers assigned
            </div>
            {unresolvedComments.length > 0 && (
              <div className="flex items-center gap-1 text-amber-600">
                <AlertTriangle className="h-4 w-4" />
                {unresolvedComments.length} unresolved issues
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stages">Review Stages</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="reviewers">Reviewers</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Review Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {review.stages.map((stage, index) => {
                  const status = getStageStatus(stage.id);
                  const reviewer = review.reviewers.find(
                    (r) => selectedReviewers[stage.id] === r.id,
                  );

                  return (
                    <div key={stage.id} className="flex items-center gap-4">
                      <div className="shrink-0">{getStageIcon(status)}</div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{stage.name}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {stage.estimatedTime}min
                            </Badge>
                            {stage.required && (
                              <Badge variant="destructive" className="text-xs">
                                Required
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {stage.description}
                        </p>
                        {reviewer && (
                          <div className="flex items-center gap-2 mt-1">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={reviewer.avatar} />
                              <AvatarFallback>
                                {reviewer.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">
                              {reviewer.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quality Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quality Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(translationResult.confidence * 100)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    AI Confidence
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {translationResult.legalTerms.length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Legal Terms
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">
                    {translationResult.warnings.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Warnings</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {review.qualityScore || '--'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Quality Score
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Review Stages Tab */}
        <TabsContent value="stages" className="space-y-4">
          {review.stages.map((stage) => (
            <ReviewStageCard
              key={stage.id}
              stage={stage}
              status={getStageStatus(stage.id)}
              availableReviewers={availableReviewers.filter(
                (r) => r.type === stage.reviewerType,
              )}
              selectedReviewer={selectedReviewers[stage.id]}
              onAssignReviewer={(reviewerId) =>
                assignReviewer(stage.id, reviewerId)
              }
            />
          ))}

          {review.status === 'pending' &&
            Object.keys(selectedReviewers).length > 0 && (
              <Button onClick={startReview} className="w-full">
                Start Review Process
              </Button>
            )}
        </TabsContent>

        {/* Comments Tab */}
        <TabsContent value="comments" className="space-y-4">
          {/* Add Comment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add Review Comment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Enter your review comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />

              <div className="flex gap-2">
                <Button
                  onClick={() => addComment('suggestion', newComment)}
                  disabled={!newComment.trim()}
                  size="sm"
                  variant="outline"
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Suggestion
                </Button>

                <Button
                  onClick={() => addComment('correction', newComment)}
                  disabled={!newComment.trim()}
                  size="sm"
                  variant="outline"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Correction
                </Button>

                <Button
                  onClick={() => addComment('concern', newComment)}
                  disabled={!newComment.trim()}
                  size="sm"
                  variant="outline"
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Concern
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Comments List */}
          <div className="space-y-3">
            {review.comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                reviewer={review.reviewers.find(
                  (r) => r.id === comment.reviewerId,
                )}
                onResolve={() => resolveComment(comment.id)}
              />
            ))}

            {review.comments.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <MessageCircle className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No comments yet</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Reviewers Tab */}
        <TabsContent value="reviewers" className="space-y-4">
          <div className="grid gap-4">
            {availableReviewers.map((reviewer) => (
              <ReviewerCard key={reviewer.id} reviewer={reviewer} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Review Stage Card Component
const ReviewStageCard: React.FC<{
  stage: ReviewStage;
  status: string;
  availableReviewers: Reviewer[];
  selectedReviewer?: string;
  onAssignReviewer: (reviewerId: string) => void;
}> = ({
  stage,
  status,
  availableReviewers,
  selectedReviewer,
  onAssignReviewer,
}) => {
  return (
    <Card
      className={cn(
        'transition-colors',
        status === 'active' ? 'ring-2 ring-blue-500' : '',
        status === 'completed' ? 'bg-green-50' : '',
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {status === 'completed' && (
              <CheckCircle className="h-5 w-5 text-green-600" />
            )}
            {status === 'active' && <Clock className="h-5 w-5 text-blue-600" />}
            {status === 'pending' && (
              <Clock className="h-5 w-5 text-gray-400" />
            )}
            {stage.name}
          </CardTitle>

          <div className="flex items-center gap-2">
            <Badge variant="outline">{stage.estimatedTime}min</Badge>
            {stage.required && <Badge variant="destructive">Required</Badge>}
          </div>
        </div>
        <p className="text-muted-foreground">{stage.description}</p>
      </CardHeader>

      <CardContent>
        {stage.reviewerType !== 'ai' && (
          <div className="space-y-3">
            <label className="text-sm font-medium">Assign Reviewer</label>
            <Select
              value={selectedReviewer || ''}
              onValueChange={onAssignReviewer}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a reviewer" />
              </SelectTrigger>
              <SelectContent>
                {availableReviewers.map((reviewer) => (
                  <SelectItem key={reviewer.id} value={reviewer.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={reviewer.avatar} />
                        <AvatarFallback>{reviewer.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{reviewer.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {reviewer.specializations.join(', ')} • ⭐{' '}
                          {reviewer.rating}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Comment Card Component
const CommentCard: React.FC<{
  comment: ReviewComment;
  reviewer?: Reviewer;
  onResolve: () => void;
}> = ({ comment, reviewer, onResolve }) => {
  return (
    <Card
      className={cn(
        'transition-colors',
        comment.resolved ? 'bg-gray-50 opacity-75' : '',
        comment.severity === 'high' ? 'border-red-200' : '',
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-1">{getCommentIcon(comment.type)}</div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {reviewer && (
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={reviewer.avatar} />
                    <AvatarFallback>{reviewer.name[0]}</AvatarFallback>
                  </Avatar>
                )}
                <span className="font-medium text-sm">
                  {reviewer?.name || 'Reviewer'}
                </span>
                <Badge variant="outline" className="text-xs">
                  {comment.type}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {comment.timestamp.toLocaleString()}
                </span>
              </div>

              {!comment.resolved && (
                <Button onClick={onResolve} size="sm" variant="ghost">
                  <CheckCircle className="h-4 w-4" />
                </Button>
              )}
            </div>

            <p className="text-sm">{comment.reason}</p>

            {comment.originalText && (
              <div className="bg-red-50 border border-red-200 p-2 rounded text-xs">
                <span className="font-medium">Original: </span>"
                {comment.originalText}"
              </div>
            )}

            {comment.suggestedText && (
              <div className="bg-green-50 border border-green-200 p-2 rounded text-xs">
                <span className="font-medium">Suggested: </span>"
                {comment.suggestedText}"
              </div>
            )}

            {comment.resolved && (
              <div className="flex items-center gap-1 text-xs text-green-600">
                <CheckCircle className="h-3 w-3" />
                Resolved
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Reviewer Card Component
const ReviewerCard: React.FC<{ reviewer: Reviewer }> = ({ reviewer }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={reviewer.avatar} />
            <AvatarFallback>{reviewer.name[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{reviewer.name}</h4>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">{reviewer.rating}</span>
                <span className="text-xs text-muted-foreground">
                  ({reviewer.reviewCount} reviews)
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap gap-1">
                {reviewer.specializations.map((spec) => (
                  <Badge key={spec} variant="outline" className="text-xs">
                    {spec}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Globe className="h-3 w-3" />
                Languages: {reviewer.languages.join(', ')}
              </div>

              {reviewer.certifications.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <BookOpen className="h-3 w-3" />
                  {reviewer.certifications.join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

function getCommentIcon(type: string) {
  switch (type) {
    case 'suggestion':
      return <MessageCircle className="h-4 w-4 text-blue-600" />;
    case 'correction':
      return <Edit className="h-4 w-4 text-orange-600" />;
    case 'approval':
      return <ThumbsUp className="h-4 w-4 text-green-600" />;
    case 'concern':
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    default:
      return <MessageCircle className="h-4 w-4 text-gray-600" />;
  }
}

export default TranslationReviewWorkflow;
