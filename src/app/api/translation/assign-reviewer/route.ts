// src/app/api/translation/assign-reviewer/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface ReviewAssignment {
  id: string;
  reviewId: string;
  stageId: string;
  reviewerId: string;
  assignedAt: Date;
  status: 'assigned' | 'accepted' | 'declined' | 'completed';
  estimatedCompletion?: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reviewId, stageId, reviewerId, priority = 'medium' } = body;

    if (!reviewId || !stageId || !reviewerId) {
      return NextResponse.json(
        { error: 'Review ID, stage ID, and reviewer ID are required' },
        { status: 400 },
      );
    }

    // Create reviewer assignment
    const assignment = await assignReviewerToStage({
      reviewId,
      stageId,
      reviewerId,
      priority,
    });

    // Send notification to reviewer
    await notifyReviewer(assignment);

    return NextResponse.json({
      success: true,
      assignment,
      message: 'Reviewer assigned successfully',
    });
  } catch (error) {
    console.error('Failed to assign reviewer:', error);
    return NextResponse.json(
      { error: 'Failed to assign reviewer' },
      { status: 500 },
    );
  }
}

async function assignReviewerToStage(params: {
  reviewId: string;
  stageId: string;
  reviewerId: string;
  priority: string;
}): Promise<ReviewAssignment> {
  const assignment: ReviewAssignment = {
    id: `assignment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    reviewId: params.reviewId,
    stageId: params.stageId,
    reviewerId: params.reviewerId,
    assignedAt: new Date(),
    status: 'assigned',
    priority: params.priority as any,
  };

  // Calculate estimated completion based on reviewer workload and priority
  assignment.estimatedCompletion = calculateEstimatedCompletion(
    params.reviewerId,
    params.priority,
  );

  // In a real implementation, save to database
  await saveAssignmentToDatabase(assignment);

  // Update review status
  await updateReviewStageStatus(params.reviewId, params.stageId, 'assigned');

  return assignment;
}

async function notifyReviewer(assignment: ReviewAssignment) {
  try {
    // Get reviewer details
    const reviewer = await getReviewerById(assignment.reviewerId);

    if (!reviewer) {
      console.error('Reviewer not found:', assignment.reviewerId);
      return;
    }

    // Get review details
    const review = await getReviewById(assignment.reviewId);

    const notificationData = {
      type: 'review_assignment',
      reviewerId: assignment.reviewerId,
      reviewerEmail: reviewer.email,
      reviewId: assignment.reviewId,
      stageId: assignment.stageId,
      priority: assignment.priority,
      estimatedCompletion: assignment.estimatedCompletion,
      reviewDetails: {
        documentType: review?.documentType,
        sourceLanguage: review?.sourceLanguage,
        targetLanguage: review?.targetLanguage,
        wordCount: review?.wordCount,
      },
    };

    // Send email notification
    await sendEmailNotification(notificationData);

    // Send in-app notification
    await sendInAppNotification(notificationData);

    console.log('Reviewer notification sent successfully');
  } catch (error) {
    console.error('Failed to notify reviewer:', error);
    // Don't throw error - assignment should still succeed even if notification fails
  }
}

function calculateEstimatedCompletion(
  reviewerId: string,
  priority: string,
): Date {
  const now = new Date();
  let hoursToAdd = 24; // Default 24 hours

  // Adjust based on priority
  switch (priority) {
    case 'urgent':
      hoursToAdd = 4;
      break;
    case 'high':
      hoursToAdd = 8;
      break;
    case 'medium':
      hoursToAdd = 24;
      break;
    case 'low':
      hoursToAdd = 48;
      break;
  }

  // In a real implementation, adjust based on reviewer's current workload
  // For now, add a random factor to simulate different reviewer availability
  const workloadFactor = 0.5 + Math.random(); // 0.5 to 1.5 multiplier
  hoursToAdd *= workloadFactor;

  return new Date(now.getTime() + hoursToAdd * 60 * 60 * 1000);
}

async function saveAssignmentToDatabase(
  assignment: ReviewAssignment,
): Promise<void> {
  // In a real implementation, save to your database
  // For now, log the assignment
  console.log('Assignment saved:', {
    id: assignment.id,
    reviewId: assignment.reviewId,
    stageId: assignment.stageId,
    reviewerId: assignment.reviewerId,
    status: assignment.status,
    assignedAt: assignment.assignedAt,
  });
}

async function updateReviewStageStatus(
  reviewId: string,
  stageId: string,
  status: string,
): Promise<void> {
  // In a real implementation, update the review stage status in database
  console.log('Review stage status updated:', {
    reviewId,
    stageId,
    status,
    updatedAt: new Date(),
  });
}

async function getReviewerById(reviewerId: string): Promise<any> {
  // Mock reviewer data - in real implementation, fetch from database
  const mockReviewers: Record<string, any> = {
    reviewer_1: {
      id: 'reviewer_1',
      name: 'Maria González',
      email: 'maria.gonzalez@legalreview.com',
      type: 'legal_professional',
    },
    reviewer_2: {
      id: 'reviewer_2',
      name: 'Jean-Pierre Dubois',
      email: 'jp.dubois@legalfr.com',
      type: 'legal_professional',
    },
  };

  return mockReviewers[reviewerId] || null;
}

async function getReviewById(reviewId: string): Promise<any> {
  // Mock review data - in real implementation, fetch from database
  return {
    id: reviewId,
    documentType: 'contract',
    sourceLanguage: 'en',
    targetLanguage: 'es',
    wordCount: 1250,
    createdAt: new Date(),
  };
}

async function sendEmailNotification(data: any): Promise<void> {
  // In a real implementation, integrate with email service (SendGrid, AWS SES, etc.)
  console.log('Email notification would be sent:', {
    to: data.reviewerEmail,
    subject: `New Translation Review Assignment - ${data.priority.toUpperCase()} Priority`,
    type: data.type,
    reviewId: data.reviewId,
  });
}

async function sendInAppNotification(data: any): Promise<void> {
  // In a real implementation, send real-time notification via WebSocket or push notification
  console.log('In-app notification would be sent:', {
    userId: data.reviewerId,
    type: data.type,
    message: `You have been assigned to review a ${data.reviewDetails.documentType} translation`,
    priority: data.priority,
  });
}
