// src/app/api/translation/start-review/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface ReviewWorkflow {
  id: string;
  translationId: string;
  status: 'pending' | 'in_review' | 'completed' | 'rejected';
  currentStage: string;
  startedAt: Date;
  assignedReviewers: Record<string, string>;
  qualityMetrics: {
    aiConfidence: number;
    legalTermsCount: number;
    warningsCount: number;
    riskLevel: 'low' | 'medium' | 'high';
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reviewId, translationResult, assignedReviewers } = body;

    if (!reviewId || !translationResult) {
      return NextResponse.json(
        { error: 'Review ID and translation result are required' },
        { status: 400 },
      );
    }

    // Start the review workflow
    const workflow = await initiateReviewWorkflow({
      reviewId,
      translationResult,
      assignedReviewers: assignedReviewers || {},
    });

    // Perform initial AI validation
    const aiValidation = await performAIValidation(translationResult);

    // Update workflow with AI results
    await updateWorkflowWithAIResults(workflow, aiValidation);

    // Notify reviewers about the started review
    await notifyReviewersOfStart(workflow, assignedReviewers);

    return NextResponse.json({
      success: true,
      workflow,
      aiValidation,
      message: 'Review workflow started successfully',
    });
  } catch (error) {
    console.error('Failed to start review:', error);
    return NextResponse.json(
      { error: 'Failed to start review workflow' },
      { status: 500 },
    );
  }
}

async function initiateReviewWorkflow(params: {
  reviewId: string;
  translationResult: any;
  assignedReviewers: Record<string, string>;
}): Promise<ReviewWorkflow> {
  const { reviewId, translationResult, assignedReviewers } = params;

  // Calculate quality metrics from translation result
  const qualityMetrics = calculateQualityMetrics(translationResult);

  const workflow: ReviewWorkflow = {
    id: reviewId,
    translationId: translationResult.id || `translation_${Date.now()}`,
    status: 'in_review',
    currentStage: 'ai_validation',
    startedAt: new Date(),
    assignedReviewers,
    qualityMetrics,
  };

  // Save workflow to database
  await saveWorkflowToDatabase(workflow);

  // Log workflow initiation
  await logWorkflowEvent(workflow.id, 'workflow_started', {
    assignedReviewers: Object.keys(assignedReviewers).length,
    riskLevel: qualityMetrics.riskLevel,
    aiConfidence: qualityMetrics.aiConfidence,
  });

  return workflow;
}

async function performAIValidation(translationResult: any) {
  const validationChecks = {
    confidenceCheck: translationResult.confidence >= 0.7,
    legalTermsCheck: translationResult.legalTerms?.length > 0,
    warningsCheck: translationResult.warnings?.length < 5,
    preservationCheck:
      translationResult.preservedTerms?.every((term: string) =>
        translationResult.translatedText.includes(term),
      ) || true,
  };

  const issues = [];
  const recommendations = [];

  // Analyze confidence score
  if (translationResult.confidence < 0.7) {
    issues.push({
      type: 'low_confidence',
      severity: 'high',
      message: `Translation confidence is ${Math.round(translationResult.confidence * 100)}%, below recommended 70%`,
      recommendation: 'Requires thorough human review before approval',
    });
  }

  // Check for high-risk warnings
  const highRiskWarnings =
    translationResult.warnings?.filter((w: any) => w.severity === 'high') || [];

  if (highRiskWarnings.length > 0) {
    issues.push({
      type: 'high_risk_warnings',
      severity: 'high',
      message: `Found ${highRiskWarnings.length} high-risk translation warnings`,
      recommendation: 'Review all flagged terms with legal expert',
    });
  }

  // Check legal term preservation
  const legalTermsCount = translationResult.legalTerms?.length || 0;
  if (legalTermsCount === 0) {
    issues.push({
      type: 'no_legal_terms',
      severity: 'medium',
      message: 'No legal terms identified in the document',
      recommendation: 'Verify document type and content classification',
    });
  }

  // Generate overall AI assessment
  const passedChecks = Object.values(validationChecks).filter(Boolean).length;
  const totalChecks = Object.values(validationChecks).length;
  const aiScore = passedChecks / totalChecks;

  let aiRecommendation = 'proceed';
  if (aiScore < 0.5) {
    aiRecommendation = 'reject';
  } else if (aiScore < 0.75) {
    aiRecommendation = 'review_required';
  }

  return {
    overallScore: aiScore,
    recommendation: aiRecommendation,
    checks: validationChecks,
    issues,
    recommendations,
    completedAt: new Date(),
    processingTime: 1500 + Math.random() * 1000, // Simulate processing time
  };
}

function calculateQualityMetrics(translationResult: any) {
  const aiConfidence = translationResult.confidence || 0;
  const legalTermsCount = translationResult.legalTerms?.length || 0;
  const warningsCount = translationResult.warnings?.length || 0;
  const highRiskWarnings =
    translationResult.warnings?.filter((w: any) => w.severity === 'high')
      .length || 0;

  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high' = 'low';

  if (aiConfidence < 0.6 || highRiskWarnings > 2) {
    riskLevel = 'high';
  } else if (aiConfidence < 0.8 || warningsCount > 3 || highRiskWarnings > 0) {
    riskLevel = 'medium';
  }

  return {
    aiConfidence,
    legalTermsCount,
    warningsCount,
    riskLevel,
  };
}

async function updateWorkflowWithAIResults(
  workflow: ReviewWorkflow,
  aiValidation: any,
): Promise<void> {
  // Update workflow status based on AI validation results
  if (aiValidation.recommendation === 'reject') {
    workflow.status = 'rejected';
    await logWorkflowEvent(workflow.id, 'ai_rejection', {
      reason: 'Failed AI validation',
      score: aiValidation.overallScore,
      issues: aiValidation.issues.length,
    });
  } else if (
    aiValidation.recommendation === 'proceed' &&
    workflow.qualityMetrics.riskLevel === 'low'
  ) {
    // Low risk translations might skip some review stages
    workflow.currentStage = 'final_approval';
  } else {
    // Continue with normal review process
    workflow.currentStage = 'legal_review';
  }

  // Save updated workflow
  await saveWorkflowToDatabase(workflow);

  // Log AI validation completion
  await logWorkflowEvent(workflow.id, 'ai_validation_completed', {
    score: aiValidation.overallScore,
    recommendation: aiValidation.recommendation,
    issues: aiValidation.issues.length,
    nextStage: workflow.currentStage,
  });
}

async function notifyReviewersOfStart(
  workflow: ReviewWorkflow,
  assignedReviewers: Record<string, string>,
): Promise<void> {
  // Notify each assigned reviewer
  for (const [stageId, reviewerId] of Object.entries(assignedReviewers)) {
    try {
      await sendReviewStartNotification({
        reviewerId,
        workflowId: workflow.id,
        stageId,
        riskLevel: workflow.qualityMetrics.riskLevel,
        estimatedStartDate: calculateStageStartDate(workflow, stageId),
      });
    } catch (error) {
      console.error(`Failed to notify reviewer ${reviewerId}:`, error);
      // Continue with other notifications even if one fails
    }
  }
}

function calculateStageStartDate(
  workflow: ReviewWorkflow,
  stageId: string,
): Date {
  const stageOrder = [
    'ai_validation',
    'legal_review',
    'linguistic_review',
    'final_approval',
  ];
  const currentIndex = stageOrder.indexOf(workflow.currentStage);
  const targetIndex = stageOrder.indexOf(stageId);

  // Calculate estimated start time based on stage position
  const hoursPerStage = 8; // Estimated 8 hours per stage
  const hoursToAdd = Math.max(0, targetIndex - currentIndex) * hoursPerStage;

  return new Date(workflow.startedAt.getTime() + hoursToAdd * 60 * 60 * 1000);
}

async function saveWorkflowToDatabase(workflow: ReviewWorkflow): Promise<void> {
  // In real implementation, save to database
  console.log('Workflow saved:', {
    id: workflow.id,
    status: workflow.status,
    currentStage: workflow.currentStage,
    riskLevel: workflow.qualityMetrics.riskLevel,
  });
}

async function logWorkflowEvent(
  workflowId: string,
  eventType: string,
  metadata: any,
): Promise<void> {
  const logEntry = {
    workflowId,
    eventType,
    timestamp: new Date(),
    metadata,
  };

  // In real implementation, save to audit log
  console.log('Workflow event logged:', logEntry);
}

async function sendReviewStartNotification(params: {
  reviewerId: string;
  workflowId: string;
  stageId: string;
  riskLevel: string;
  estimatedStartDate: Date;
}): Promise<void> {
  const notification = {
    type: 'review_workflow_started',
    reviewerId: params.reviewerId,
    workflowId: params.workflowId,
    stageId: params.stageId,
    priority: params.riskLevel === 'high' ? 'urgent' : 'normal',
    estimatedStartDate: params.estimatedStartDate,
    message: `Translation review workflow has started. Your stage (${params.stageId}) is estimated to begin at ${params.estimatedStartDate.toLocaleString()}`,
  };

  // In real implementation, send via notification service
  console.log('Review start notification sent:', notification);
}
