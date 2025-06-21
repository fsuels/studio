// src/app/api/translation/add-comment/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface ReviewComment {
  id: string;
  reviewId: string;
  stageId: string;
  reviewerId: string;
  type: 'suggestion' | 'correction' | 'approval' | 'concern';
  originalText: string;
  suggestedText?: string;
  reason: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
  position?: { start: number; end: number };
  resolved: boolean;
  threadId?: string;
  tags: string[];
  attachments?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reviewId, comment } = body;

    if (!reviewId || !comment) {
      return NextResponse.json(
        { error: 'Review ID and comment are required' },
        { status: 400 },
      );
    }

    // Validate comment data
    const validationResult = validateComment(comment);
    if (!validationResult.isValid) {
      return NextResponse.json(
        { error: validationResult.error },
        { status: 400 },
      );
    }

    // Process and save the comment
    const processedComment = await processComment(reviewId, comment);

    // Update review metrics
    await updateReviewMetrics(reviewId, processedComment);

    // Notify relevant parties
    await notifyCommentAdded(processedComment);

    // Check if comment triggers workflow actions
    await checkWorkflowTriggers(reviewId, processedComment);

    return NextResponse.json({
      success: true,
      comment: processedComment,
      message: 'Comment added successfully',
    });
  } catch (error) {
    console.error('Failed to add comment:', error);
    return NextResponse.json(
      { error: 'Failed to add comment' },
      { status: 500 },
    );
  }
}

function validateComment(comment: any): { isValid: boolean; error?: string } {
  if (
    !comment.type ||
    !['suggestion', 'correction', 'approval', 'concern'].includes(comment.type)
  ) {
    return { isValid: false, error: 'Invalid comment type' };
  }

  if (!comment.reason || comment.reason.trim().length < 5) {
    return {
      isValid: false,
      error: 'Comment reason must be at least 5 characters',
    };
  }

  if (comment.type === 'correction' && !comment.suggestedText) {
    return { isValid: false, error: 'Corrections must include suggested text' };
  }

  if (
    comment.severity &&
    !['low', 'medium', 'high'].includes(comment.severity)
  ) {
    return { isValid: false, error: 'Invalid severity level' };
  }

  return { isValid: true };
}

async function processComment(
  reviewId: string,
  comment: any,
): Promise<ReviewComment> {
  // Generate unique comment ID
  const commentId = `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Determine automatic tags based on content
  const autoTags = generateAutoTags(comment);

  // Assign severity if not provided
  const severity = comment.severity || determineSeverity(comment);

  // Create thread ID for related comments
  const threadId = comment.threadId || commentId;

  const processedComment: ReviewComment = {
    id: commentId,
    reviewId,
    stageId: comment.stageId,
    reviewerId: comment.reviewerId,
    type: comment.type,
    originalText: comment.originalText || '',
    suggestedText: comment.suggestedText,
    reason: comment.reason.trim(),
    severity,
    timestamp: new Date(),
    position: comment.position,
    resolved: false,
    threadId,
    tags: [...autoTags, ...(comment.tags || [])],
    attachments: comment.attachments || [],
  };

  // Save comment to database
  await saveCommentToDatabase(processedComment);

  // Log comment creation
  await logCommentEvent(processedComment, 'comment_created');

  return processedComment;
}

function generateAutoTags(comment: any): string[] {
  const tags: string[] = [];
  const reason = comment.reason.toLowerCase();
  const originalText = comment.originalText?.toLowerCase() || '';

  // Legal-specific tags
  if (reason.includes('jurisdiction') || reason.includes('legal system')) {
    tags.push('jurisdiction');
  }
  if (reason.includes('term') || reason.includes('terminology')) {
    tags.push('terminology');
  }
  if (reason.includes('accuracy') || reason.includes('precise')) {
    tags.push('accuracy');
  }
  if (reason.includes('cultural') || reason.includes('context')) {
    tags.push('cultural');
  }
  if (reason.includes('grammar') || reason.includes('syntax')) {
    tags.push('linguistic');
  }

  // Content-specific tags
  if (originalText.includes('contract') || reason.includes('contract')) {
    tags.push('contract');
  }
  if (originalText.includes('liability') || reason.includes('liability')) {
    tags.push('liability');
  }
  if (originalText.includes('damages') || reason.includes('damages')) {
    tags.push('damages');
  }

  // Type-specific tags
  tags.push(comment.type);

  return [...new Set(tags)]; // Remove duplicates
}

function determineSeverity(comment: any): 'low' | 'medium' | 'high' {
  const reason = comment.reason.toLowerCase();

  // High severity indicators
  if (
    comment.type === 'concern' ||
    reason.includes('incorrect') ||
    reason.includes('wrong') ||
    reason.includes('error') ||
    reason.includes('legal risk') ||
    reason.includes('liability')
  ) {
    return 'high';
  }

  // Medium severity indicators
  if (
    comment.type === 'correction' ||
    reason.includes('should be') ||
    reason.includes('better') ||
    reason.includes('improve') ||
    reason.includes('unclear')
  ) {
    return 'medium';
  }

  // Default to low severity
  return 'low';
}

async function updateReviewMetrics(
  reviewId: string,
  comment: ReviewComment,
): Promise<void> {
  // Update review statistics
  const metrics = {
    totalComments: await getCommentCount(reviewId),
    unresolvedComments: await getUnresolvedCommentCount(reviewId),
    severityBreakdown: await getSeverityBreakdown(reviewId),
    lastActivity: comment.timestamp,
  };

  // Calculate review quality score
  const qualityScore = calculateReviewQualityScore(metrics);

  // Save updated metrics
  await saveReviewMetrics(reviewId, metrics, qualityScore);

  console.log('Review metrics updated:', {
    reviewId,
    totalComments: metrics.totalComments,
    qualityScore,
  });
}

async function notifyCommentAdded(comment: ReviewComment): Promise<void> {
  // Notify relevant stakeholders
  const notifications = [];

  // Notify review owner
  notifications.push({
    type: 'comment_added',
    targetUserId: 'review_owner', // In real implementation, get from review data
    commentId: comment.id,
    commentType: comment.type,
    severity: comment.severity,
    message: `New ${comment.type} comment added to translation review`,
  });

  // For high severity comments, notify supervisors
  if (comment.severity === 'high') {
    notifications.push({
      type: 'high_severity_comment',
      targetUserId: 'supervisor',
      commentId: comment.id,
      urgency: 'high',
      message: `High severity ${comment.type} comment requires immediate attention`,
    });
  }

  // Send notifications
  for (const notification of notifications) {
    await sendNotification(notification);
  }
}

async function checkWorkflowTriggers(
  reviewId: string,
  comment: ReviewComment,
): Promise<void> {
  // Check if comment triggers automatic workflow actions

  if (comment.type === 'approval' && comment.severity === 'low') {
    // Approval comment might allow stage progression
    await checkStageProgression(reviewId, comment.stageId);
  }

  if (comment.severity === 'high' && comment.type === 'concern') {
    // High severity concerns might pause the workflow
    await flagReviewForAttention(reviewId, comment);
  }

  // Check for completion conditions
  await checkStageCompletionConditions(reviewId, comment.stageId);
}

async function checkStageProgression(
  reviewId: string,
  stageId: string,
): Promise<void> {
  // In real implementation, check if stage has enough approvals to proceed
  console.log('Checking stage progression:', { reviewId, stageId });
}

async function flagReviewForAttention(
  reviewId: string,
  comment: ReviewComment,
): Promise<void> {
  // Flag review for supervisor attention
  console.log('Review flagged for attention:', {
    reviewId,
    reason: comment.reason,
    severity: comment.severity,
  });
}

async function checkStageCompletionConditions(
  reviewId: string,
  stageId: string,
): Promise<void> {
  // Check if stage meets completion criteria
  console.log('Checking stage completion conditions:', { reviewId, stageId });
}

// Helper functions (would normally fetch from database)
async function getCommentCount(reviewId: string): Promise<number> {
  // Mock implementation
  return Math.floor(Math.random() * 10) + 1;
}

async function getUnresolvedCommentCount(reviewId: string): Promise<number> {
  // Mock implementation
  return Math.floor(Math.random() * 5);
}

async function getSeverityBreakdown(
  reviewId: string,
): Promise<Record<string, number>> {
  // Mock implementation
  return {
    low: Math.floor(Math.random() * 5),
    medium: Math.floor(Math.random() * 3),
    high: Math.floor(Math.random() * 2),
  };
}

function calculateReviewQualityScore(metrics: any): number {
  // Simple quality score calculation
  const totalComments = metrics.totalComments;
  const severityBreakdown = metrics.severityBreakdown;

  if (totalComments === 0) return 1.0;

  // Weight severity impact
  const score =
    1.0 -
    (severityBreakdown.high * 0.3 +
      severityBreakdown.medium * 0.1 +
      severityBreakdown.low * 0.05) /
      totalComments;

  return Math.max(0, Math.min(1, score));
}

async function saveCommentToDatabase(comment: ReviewComment): Promise<void> {
  // Mock implementation - save to database
  console.log('Comment saved to database:', {
    id: comment.id,
    type: comment.type,
    severity: comment.severity,
    timestamp: comment.timestamp,
  });
}

async function saveReviewMetrics(
  reviewId: string,
  metrics: any,
  qualityScore: number,
): Promise<void> {
  // Mock implementation - save metrics to database
  console.log('Review metrics saved:', {
    reviewId,
    qualityScore,
    totalComments: metrics.totalComments,
  });
}

async function logCommentEvent(
  comment: ReviewComment,
  eventType: string,
): Promise<void> {
  // Mock implementation - log to audit trail
  console.log('Comment event logged:', {
    commentId: comment.id,
    eventType,
    timestamp: new Date(),
    reviewId: comment.reviewId,
  });
}

async function sendNotification(notification: any): Promise<void> {
  // Mock implementation - send notification
  console.log('Notification sent:', notification);
}
