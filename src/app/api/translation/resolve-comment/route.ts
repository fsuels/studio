// src/app/api/translation/resolve-comment/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface CommentResolution {
  id: string;
  commentId: string;
  resolvedBy: string;
  resolvedAt: Date;
  resolutionType: 'accepted' | 'rejected' | 'partial' | 'superseded';
  resolutionNotes?: string;
  implementedChanges?: string[];
  followUpRequired: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      reviewId,
      commentId,
      resolutionType = 'accepted',
      resolutionNotes,
      resolvedBy,
    } = body;

    if (!reviewId || !commentId) {
      return NextResponse.json(
        { error: 'Review ID and comment ID are required' },
        { status: 400 },
      );
    }

    // Get the comment to be resolved
    const comment = await getCommentById(commentId);
    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    if (comment.resolved) {
      return NextResponse.json(
        { error: 'Comment is already resolved' },
        { status: 400 },
      );
    }

    // Validate resolution permissions
    const canResolve = await validateResolutionPermissions(comment, resolvedBy);
    if (!canResolve.allowed) {
      return NextResponse.json({ error: canResolve.reason }, { status: 403 });
    }

    // Create resolution record
    const resolution = await createCommentResolution({
      commentId,
      resolvedBy: resolvedBy || 'system',
      resolutionType,
      resolutionNotes,
      originalComment: comment,
    });

    // Update comment status
    await updateCommentResolution(commentId, resolution);

    // Apply changes if accepted
    if (resolutionType === 'accepted' && comment.suggestedText) {
      await applyCommentChanges(reviewId, comment, resolution);
    }

    // Update review progress
    await updateReviewProgress(reviewId, resolution);

    // Notify stakeholders
    await notifyCommentResolution(resolution, comment);

    // Check if stage can progress
    await checkStageProgressionAfterResolution(reviewId, comment.stageId);

    return NextResponse.json({
      success: true,
      resolution,
      message: 'Comment resolved successfully',
    });
  } catch (error) {
    console.error('Failed to resolve comment:', error);
    return NextResponse.json(
      { error: 'Failed to resolve comment' },
      { status: 500 },
    );
  }
}

async function getCommentById(commentId: string): Promise<any> {
  // Mock implementation - in real app, fetch from database
  const mockComments: Record<string, any> = {
    comment_1: {
      id: 'comment_1',
      reviewId: 'review_123',
      stageId: 'legal_review',
      reviewerId: 'reviewer_1',
      type: 'correction',
      originalText: 'consideration',
      suggestedText: 'contraprestación',
      reason: 'More accurate legal translation for Spanish jurisdiction',
      severity: 'medium',
      timestamp: new Date(),
      resolved: false,
      position: { start: 45, end: 58 },
    },
  };

  return mockComments[commentId] || null;
}

async function validateResolutionPermissions(
  comment: any,
  resolvedBy: string,
): Promise<{ allowed: boolean; reason?: string }> {
  // In real implementation, check user roles and permissions

  // System can always resolve
  if (resolvedBy === 'system') {
    return { allowed: true };
  }

  // Comment author can resolve their own comments
  if (comment.reviewerId === resolvedBy) {
    return { allowed: true };
  }

  // Review managers can resolve any comments
  if (await isReviewManager(resolvedBy)) {
    return { allowed: true };
  }

  // Stage supervisors can resolve comments in their stage
  if (await isStageSupervisor(resolvedBy, comment.stageId)) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: 'Insufficient permissions to resolve this comment',
  };
}

async function createCommentResolution(params: {
  commentId: string;
  resolvedBy: string;
  resolutionType: string;
  resolutionNotes?: string;
  originalComment: any;
}): Promise<CommentResolution> {
  // Determine if follow-up is required
  const followUpRequired = determineFollowUpRequirement(
    params.originalComment,
    params.resolutionType,
  );

  // Track implemented changes
  const implementedChanges = [];
  if (
    params.resolutionType === 'accepted' &&
    params.originalComment.suggestedText
  ) {
    implementedChanges.push(
      `Applied suggestion: "${params.originalComment.suggestedText}"`,
    );
  }

  const resolution: CommentResolution = {
    id: `resolution_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    commentId: params.commentId,
    resolvedBy: params.resolvedBy,
    resolvedAt: new Date(),
    resolutionType: params.resolutionType as any,
    resolutionNotes: params.resolutionNotes,
    implementedChanges,
    followUpRequired,
  };

  // Save resolution to database
  await saveResolutionToDatabase(resolution);

  // Log resolution event
  await logResolutionEvent(resolution, params.originalComment);

  return resolution;
}

function determineFollowUpRequirement(
  comment: any,
  resolutionType: string,
): boolean {
  // High severity comments that are rejected or partially resolved need follow-up
  if (
    comment.severity === 'high' &&
    (resolutionType === 'rejected' || resolutionType === 'partial')
  ) {
    return true;
  }

  // Corrections that are rejected need follow-up explanation
  if (comment.type === 'correction' && resolutionType === 'rejected') {
    return true;
  }

  // Concerns always need follow-up when resolved
  if (comment.type === 'concern') {
    return true;
  }

  return false;
}

async function updateCommentResolution(
  commentId: string,
  resolution: CommentResolution,
): Promise<void> {
  // Update comment in database to mark as resolved
  console.log('Comment marked as resolved:', {
    commentId,
    resolutionId: resolution.id,
    resolvedAt: resolution.resolvedAt,
    resolutionType: resolution.resolutionType,
  });
}

async function applyCommentChanges(
  reviewId: string,
  comment: any,
  resolution: CommentResolution,
): Promise<void> {
  if (!comment.suggestedText || !comment.position) {
    return;
  }

  // Get current translation text
  const currentTranslation = await getCurrentTranslation(reviewId);

  // Apply the suggested change
  const updatedText = applyTextChange(
    currentTranslation,
    comment.position,
    comment.originalText,
    comment.suggestedText,
  );

  // Save updated translation
  await updateTranslationText(reviewId, updatedText, {
    changeType: 'comment_resolution',
    commentId: comment.id,
    resolutionId: resolution.id,
    appliedBy: resolution.resolvedBy,
  });

  console.log('Comment changes applied:', {
    reviewId,
    commentId: comment.id,
    originalText: comment.originalText,
    suggestedText: comment.suggestedText,
  });
}

function applyTextChange(
  text: string,
  position: { start: number; end: number },
  originalText: string,
  suggestedText: string,
): string {
  // Validate position
  if (
    position.start < 0 ||
    position.end > text.length ||
    position.start >= position.end
  ) {
    console.warn('Invalid position for text change');
    return text;
  }

  // Extract the text at the position to verify it matches originalText
  const textAtPosition = text.substring(position.start, position.end);

  if (textAtPosition.toLowerCase() !== originalText.toLowerCase()) {
    console.warn('Text at position does not match original text', {
      expected: originalText,
      found: textAtPosition,
    });
    // Try to find the text elsewhere in the document
    const index = text.toLowerCase().indexOf(originalText.toLowerCase());
    if (index !== -1) {
      return (
        text.substring(0, index) +
        suggestedText +
        text.substring(index + originalText.length)
      );
    }
    return text; // No change if text not found
  }

  // Apply the change
  return (
    text.substring(0, position.start) +
    suggestedText +
    text.substring(position.end)
  );
}

async function updateReviewProgress(
  reviewId: string,
  resolution: CommentResolution,
): Promise<void> {
  // Calculate new progress metrics
  const totalComments = await getTotalCommentsCount(reviewId);
  const resolvedComments = await getResolvedCommentsCount(reviewId);
  const progressPercentage =
    totalComments > 0 ? (resolvedComments / totalComments) * 100 : 0;

  // Update review metrics
  await saveReviewProgress(reviewId, {
    totalComments,
    resolvedComments,
    progressPercentage,
    lastResolutionAt: resolution.resolvedAt,
    lastResolutionBy: resolution.resolvedBy,
  });

  console.log('Review progress updated:', {
    reviewId,
    progressPercentage: Math.round(progressPercentage),
    resolvedComments,
    totalComments,
  });
}

async function notifyCommentResolution(
  resolution: CommentResolution,
  originalComment: any,
): Promise<void> {
  const notifications = [];

  // Notify comment author
  if (originalComment.reviewerId !== resolution.resolvedBy) {
    notifications.push({
      type: 'comment_resolved',
      targetUserId: originalComment.reviewerId,
      resolutionType: resolution.resolutionType,
      message: `Your ${originalComment.type} comment has been ${resolution.resolutionType}`,
    });
  }

  // Notify review stakeholders for important resolutions
  if (originalComment.severity === 'high' || resolution.followUpRequired) {
    notifications.push({
      type: 'important_comment_resolved',
      targetRole: 'review_manager',
      commentSeverity: originalComment.severity,
      followUpRequired: resolution.followUpRequired,
      message: `High priority comment resolution requires attention`,
    });
  }

  // Send notifications
  for (const notification of notifications) {
    await sendNotification(notification);
  }
}

async function checkStageProgressionAfterResolution(
  reviewId: string,
  stageId: string,
): Promise<void> {
  // Check if stage completion criteria are met
  const unresolvedCriticalComments = await getUnresolvedCriticalComments(
    reviewId,
    stageId,
  );
  const stageProgress = await getStageProgress(reviewId, stageId);

  if (
    unresolvedCriticalComments === 0 &&
    stageProgress.completionPercentage >= 90
  ) {
    // Stage might be ready for progression
    await evaluateStageCompletion(reviewId, stageId);
  }
}

// Helper functions (mock implementations)
async function isReviewManager(userId: string): Promise<boolean> {
  // Mock implementation
  return userId.includes('manager') || userId.includes('admin');
}

async function isStageSupervisor(
  userId: string,
  stageId: string,
): Promise<boolean> {
  // Mock implementation
  return userId.includes('supervisor') || userId.includes(stageId);
}

async function getCurrentTranslation(reviewId: string): Promise<string> {
  // Mock implementation
  return 'This is a sample legal document with consideration clause...';
}

async function updateTranslationText(
  reviewId: string,
  newText: string,
  metadata: any,
): Promise<void> {
  console.log('Translation text updated:', { reviewId, metadata });
}

async function getTotalCommentsCount(reviewId: string): Promise<number> {
  return Math.floor(Math.random() * 20) + 5;
}

async function getResolvedCommentsCount(reviewId: string): Promise<number> {
  return Math.floor(Math.random() * 15) + 3;
}

async function getUnresolvedCriticalComments(
  reviewId: string,
  stageId: string,
): Promise<number> {
  return Math.floor(Math.random() * 3);
}

async function getStageProgress(
  reviewId: string,
  stageId: string,
): Promise<any> {
  return {
    completionPercentage: Math.floor(Math.random() * 30) + 70,
    resolvedIssues: Math.floor(Math.random() * 10),
    totalIssues: Math.floor(Math.random() * 5) + 10,
  };
}

async function saveResolutionToDatabase(
  resolution: CommentResolution,
): Promise<void> {
  console.log('Resolution saved to database:', resolution.id);
}

async function saveReviewProgress(
  reviewId: string,
  progress: any,
): Promise<void> {
  console.log('Review progress saved:', { reviewId, progress });
}

async function logResolutionEvent(
  resolution: CommentResolution,
  comment: any,
): Promise<void> {
  console.log('Resolution event logged:', {
    resolutionId: resolution.id,
    commentType: comment.type,
    resolutionType: resolution.resolutionType,
  });
}

async function evaluateStageCompletion(
  reviewId: string,
  stageId: string,
): Promise<void> {
  console.log('Evaluating stage completion:', { reviewId, stageId });
}

async function sendNotification(notification: any): Promise<void> {
  console.log('Notification sent:', notification);
}
