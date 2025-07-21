// src/app/api/marketplace/submissions/[submissionId]/review/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { templateSubmissionWorkflow } from '@/lib/marketplace/template-submission-workflow';

/**
 * POST /api/marketplace/submissions/[submissionId]/review
 * Submit a review for a template submission (reviewer only)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { submissionId: string } },
) {
  try {
    // TODO: Add authentication and reviewer permission checks
    // const user = await getCurrentUser(request);
    // if (!user || !user.canReviewTemplates) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { submissionId } = params;
    const body = await request.json();
    const {
      decision, // 'approved' | 'rejected' | 'needs_changes'
      feedback,
      qualityScore, // 1-10
      issues = [],
      requiredChanges = [],
    } = body;

    // Validate required fields
    if (!decision || !feedback || !qualityScore) {
      return NextResponse.json(
        { error: 'Missing required fields: decision, feedback, qualityScore' },
        { status: 400 },
      );
    }

    if (!['approved', 'rejected', 'needs_changes'].includes(decision)) {
      return NextResponse.json(
        {
          error:
            'Invalid decision. Must be: approved, rejected, or needs_changes',
        },
        { status: 400 },
      );
    }

    if (qualityScore < 1 || qualityScore > 10) {
      return NextResponse.json(
        { error: 'Quality score must be between 1 and 10' },
        { status: 400 },
      );
    }

    const reviewerId = 'reviewer-id'; // TODO: Get from auth

    // Submit the review
    const result = await templateSubmissionWorkflow.submitReview({
      submissionId,
      reviewerId,
      decision,
      feedback,
      qualityScore,
      issues,
      requiredChanges,
    });

    return NextResponse.json({
      success: true,
      data: {
        submissionId,
        decision: result.decision,
        nextSteps: result.nextSteps,
        message: 'Review submitted successfully',
      },
    });
  } catch (error) {
    console.error('Submit review error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit review',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/marketplace/submissions/[submissionId]/review
 * Assign a reviewer to a submission (admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { submissionId: string } },
) {
  try {
    // TODO: Add authentication and admin permission checks
    // const user = await getCurrentUser(request);
    // if (!user || !user.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { submissionId } = params;
    const body = await request.json();
    const { reviewerId, priority = 'normal' } = body;

    // Validate required fields
    if (!reviewerId) {
      return NextResponse.json(
        { error: 'Missing required field: reviewerId' },
        { status: 400 },
      );
    }

    const assignedBy = 'admin-id'; // TODO: Get from auth

    // Assign reviewer
    await templateSubmissionWorkflow.assignReviewer({
      submissionId,
      reviewerId,
      assignedBy,
      priority,
    });

    return NextResponse.json({
      success: true,
      data: {
        submissionId,
        reviewerId,
        priority,
        message: 'Reviewer assigned successfully',
      },
    });
  } catch (error) {
    console.error('Assign reviewer error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to assign reviewer',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
