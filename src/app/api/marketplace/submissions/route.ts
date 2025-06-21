// src/app/api/marketplace/submissions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase';
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
import { templateSubmissionWorkflow } from '@/lib/marketplace/template-submission-workflow';

/**
 * GET /api/marketplace/submissions
 * Get submission queue for reviewers and admins
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication and permission checks
    // const user = await getCurrentUser(request);
    // if (!user || !user.canReviewTemplates) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const url = new URL(request.url);
    const status = url.searchParams.get('status') || 'pending_assignment';
    const priority = url.searchParams.get('priority');
    const assignedReviewer = url.searchParams.get('assignedReviewer');
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = Math.min(parseInt(url.searchParams.get('limit') || '20'), 50);

    const db = await getDb();
    
    // Build query
    let q = query(collection(db, 'template-submissions'));

    // Add filters
    if (status && status !== 'all') {
      q = query(q, where('status', '==', status));
    }

    if (priority) {
      q = query(q, where('priority', '==', priority));
    }

    if (assignedReviewer) {
      q = query(q, where('assignedReviewer', '==', assignedReviewer));
    }

    // Add sorting (oldest submissions first for fairness)
    q = query(q, orderBy('submittedAt', 'asc'));

    // Add pagination
    q = query(q, limit(pageSize));

    if (page > 1) {
      // For cursor-based pagination, we'd need to implement cursor logic
      // For now, using simple offset (not ideal for large datasets)
    }

    const submissionsSnap = await getDocs(q);
    const submissions = submissionsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Get template details for each submission
    const enrichedSubmissions = await Promise.all(
      submissions.map(async (submission) => {
        const templateRef = doc(db, 'marketplace-templates', submission.templateId);
        const templateSnap = await doc(templateRef);
        
        return {
          ...submission,
          template: templateSnap.exists() ? {
            id: templateSnap.id,
            name: templateSnap.data()?.name,
            category: templateSnap.data()?.category,
            createdBy: templateSnap.data()?.createdBy,
          } : null,
        };
      })
    );

    // Calculate queue statistics
    const queueStats = await calculateQueueStatistics();

    return NextResponse.json({
      success: true,
      data: {
        submissions: enrichedSubmissions,
        pagination: {
          page,
          limit: pageSize,
          total: submissions.length,
          hasMore: submissions.length === pageSize,
        },
        queueStats,
        filters: {
          status,
          priority,
          assignedReviewer,
        },
      },
    });

  } catch (error) {
    console.error('Get submissions error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch submissions' 
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/marketplace/submissions
 * Create a new template submission
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication
    // const user = await getCurrentUser(request);
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    const {
      name,
      description,
      category,
      tags = [],
      jurisdiction,
      states = 'all',
      languageSupport = ['en'],
      document,
      pricing = { type: 'free', basePrice: 0, currency: 'usd' },
      submissionNotes,
    } = body;

    // Validate required fields
    if (!name || !description || !category || !document) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, category, document' },
        { status: 400 }
      );
    }

    const userId = 'user-id'; // TODO: Get from auth

    // Create template draft
    const { templateId, versionId } = await templateSubmissionWorkflow.createTemplateDraft({
      name,
      description,
      category,
      tags,
      jurisdiction,
      states,
      languageSupport,
      createdBy: userId,
      document,
      pricing,
    });

    // Submit for review
    const { submissionId, estimatedReviewTime } = await templateSubmissionWorkflow.submitForReview({
      templateId,
      submissionNotes,
    });

    return NextResponse.json({
      success: true,
      data: {
        templateId,
        versionId,
        submissionId,
        estimatedReviewTime,
        status: 'submitted',
        message: 'Template submitted successfully for review',
      },
    });

  } catch (error) {
    console.error('Create submission error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create submission',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Calculate queue statistics for admin dashboard
 */
async function calculateQueueStatistics() {
  const db = await getDb();
  
  const stats = {
    total: 0,
    pending: 0,
    inReview: 0,
    approved: 0,
    rejected: 0,
    changesRequired: 0,
    averageReviewTime: 0,
    oldestSubmission: null,
  };

  try {
    // Get all submissions
    const allSubmissionsQuery = query(collection(db, 'template-submissions'));
    const allSubmissionsSnap = await getDocs(allSubmissionsQuery);
    
    stats.total = allSubmissionsSnap.size;

    // Calculate status breakdown
    allSubmissionsSnap.docs.forEach(doc => {
      const submission = doc.data();
      switch (submission.status) {
        case 'pending_assignment':
        case 'pending_review':
          stats.pending++;
          break;
        case 'in_review':
          stats.inReview++;
          break;
        case 'approved':
          stats.approved++;
          break;
        case 'rejected':
          stats.rejected++;
          break;
        case 'changes_required':
          stats.changesRequired++;
          break;
      }
    });

    // Calculate average review time (for completed reviews)
    const completedSubmissions = allSubmissionsSnap.docs
      .map(doc => doc.data())
      .filter(s => s.completedAt && s.assignedAt);

    if (completedSubmissions.length > 0) {
      const totalReviewTime = completedSubmissions.reduce((sum, s) => {
        return sum + (s.completedAt.toMillis() - s.assignedAt.toMillis());
      }, 0);
      
      stats.averageReviewTime = totalReviewTime / completedSubmissions.length / (1000 * 60 * 60 * 24); // Convert to days
    }

    // Find oldest pending submission
    const pendingSubmissions = allSubmissionsSnap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(s => s.status === 'pending_assignment' || s.status === 'pending_review')
      .sort((a, b) => a.submittedAt.toMillis() - b.submittedAt.toMillis());

    if (pendingSubmissions.length > 0) {
      stats.oldestSubmission = {
        id: pendingSubmissions[0].id,
        submittedAt: pendingSubmissions[0].submittedAt,
        daysWaiting: Math.floor((Date.now() - pendingSubmissions[0].submittedAt.toMillis()) / (1000 * 60 * 60 * 24)),
      };
    }

  } catch (error) {
    console.warn('Failed to calculate queue statistics:', error);
  }

  return stats;
}