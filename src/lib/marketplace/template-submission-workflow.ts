// src/lib/marketplace/template-submission-workflow.ts
'use client';

import { getDb } from '@/lib/firebase';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { templateVersionManager } from '@/lib/versioning/template-version-manager';
import type {
  MarketplaceTemplate,
  TemplateVersion,
  ChangelogEntry,
} from '@/types/marketplace';
import type { LegalDocument } from '@/types/documents';

/**
 * Template Submission Workflow Manager
 * Handles the complete lifecycle of template submissions from draft to published
 */
export class TemplateSubmissionWorkflow {
  private db: ReturnType<typeof getDb> | null = null;

  constructor() {
    this.initDb();
  }

  private async initDb() {
    this.db = await getDb();
  }

  private async ensureDb() {
    if (!this.db) {
      await this.initDb();
    }
    return this.db!;
  }

  /**
   * Step 1: Create initial template draft
   */
  async createTemplateDraft(params: {
    name: string;
    description: string;
    category: string;
    tags: string[];
    jurisdiction: string;
    states?: string[] | 'all';
    languageSupport: string[];
    createdBy: string;
    document: LegalDocument;
    pricing: {
      type: 'free' | 'one-time' | 'subscription' | 'usage-based';
      basePrice: number;
      currency: string;
      creatorShare?: number;
    };
  }): Promise<{ templateId: string; versionId: string }> {
    const db = await this.ensureDb();

    // Generate template ID
    const templateRef = doc(collection(db, 'marketplace-templates'));
    const templateId = templateRef.id;

    // Create marketplace template record
    const marketplaceTemplate: Partial<MarketplaceTemplate> = {
      id: templateId,
      name: params.name,
      slug: this.generateSlug(params.name),
      description: params.description,
      createdBy: params.createdBy,
      category: params.category,
      tags: params.tags,
      jurisdiction: params.jurisdiction,
      states: params.states || 'all',
      languageSupport: params.languageSupport,

      // Initial state
      visibility: 'private',
      pricing: {
        type: params.pricing.type,
        basePrice: params.pricing.basePrice,
        currency: params.pricing.currency,
        creatorShare: params.pricing.creatorShare || 70, // Default 70% to creator
        platformFee: 100 - (params.pricing.creatorShare || 70), // Platform takes remainder
      },
      licenseType: params.pricing.type === 'free' ? 'free' : 'premium',

      // Version info
      currentVersion: '1.0.0',
      latestVersionId: `${templateId}-v1.0.0`,
      versions: ['1.0.0'],

      // Stats (initialized)
      stats: this.createInitialStats(),
      ratings: this.createInitialRatings(),

      // Workflow state
      moderationStatus: 'pending',
      featured: false,
      verified: false,

      // Timestamps
      lastUpdated: serverTimestamp() as any,
    };

    // Create initial version
    const versionResult = await templateVersionManager.createVersion({
      templateId,
      version: '1.0.0',
      document: params.document,
      createdBy: params.createdBy,
      changelog: [
        {
          type: 'added',
          description: 'Initial template submission',
          impact: 'major',
        } as ChangelogEntry,
      ],
      breaking: false,
      compatibility: {
        backwardCompatible: true,
        forwardCompatible: false,
        migrationRequired: false,
      },
    });

    // Save template to database
    await setDoc(templateRef, marketplaceTemplate);

    // Create submission record for tracking
    await this.createSubmissionRecord({
      templateId,
      versionId: versionResult.id,
      submittedBy: params.createdBy,
      submissionType: 'new_template',
      status: 'pending_review',
    });

    return {
      templateId,
      versionId: versionResult.id,
    };
  }

  /**
   * Step 2: Submit template for review
   */
  async submitForReview(params: {
    templateId: string;
    submissionNotes?: string;
    reviewerPreferences?: string[];
  }): Promise<{ submissionId: string; estimatedReviewTime: string }> {
    const db = await this.ensureDb();

    // Update template status
    const templateRef = doc(db, 'marketplace-templates', params.templateId);
    await updateDoc(templateRef, {
      moderationStatus: 'pending',
      submittedForReviewAt: serverTimestamp(),
      submissionNotes: params.submissionNotes || '',
    });

    // Create detailed submission record
    const submissionRef = doc(collection(db, 'template-submissions'));
    const submissionRecord = {
      id: submissionRef.id,
      templateId: params.templateId,
      submissionType: 'review_request',
      status: 'pending_assignment',
      submissionNotes: params.submissionNotes || '',
      reviewerPreferences: params.reviewerPreferences || [],
      submittedAt: serverTimestamp(),
      estimatedReviewTime: this.calculateEstimatedReviewTime(),
      priority: this.calculateSubmissionPriority(params.templateId),
    };

    await setDoc(submissionRef, submissionRecord);

    // Notify review team
    await this.notifyReviewTeam(submissionRecord);

    return {
      submissionId: submissionRef.id,
      estimatedReviewTime: submissionRecord.estimatedReviewTime,
    };
  }

  /**
   * Step 3: Assign reviewer (admin function)
   */
  async assignReviewer(params: {
    submissionId: string;
    reviewerId: string;
    assignedBy: string;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
  }): Promise<void> {
    const db = await this.ensureDb();

    const submissionRef = doc(db, 'template-submissions', params.submissionId);
    const submissionSnap = await getDoc(submissionRef);

    if (!submissionSnap.exists()) {
      throw new Error('Submission not found');
    }

    const submission = submissionSnap.data();

    // Update submission with reviewer assignment
    await updateDoc(submissionRef, {
      status: 'in_review',
      assignedReviewer: params.reviewerId,
      assignedBy: params.assignedBy,
      assignedAt: serverTimestamp(),
      priority: params.priority || 'normal',
      estimatedCompletionDate: this.calculateEstimatedCompletion(
        params.priority,
      ),
    });

    // Update template status
    const templateRef = doc(db, 'marketplace-templates', submission.templateId);
    await updateDoc(templateRef, {
      moderationStatus: 'in_review',
      assignedReviewer: params.reviewerId,
    });

    // Notify reviewer
    await this.notifyReviewer({
      reviewerId: params.reviewerId,
      submissionId: params.submissionId,
      templateId: submission.templateId,
      priority: params.priority || 'normal',
    });
  }

  /**
   * Step 4: Submit review (reviewer function)
   */
  async submitReview(params: {
    submissionId: string;
    reviewerId: string;
    decision: 'approved' | 'rejected' | 'needs_changes';
    feedback: string;
    qualityScore: number; // 1-10
    issues?: {
      type: 'legal' | 'technical' | 'content' | 'pricing';
      severity: 'low' | 'medium' | 'high' | 'critical';
      description: string;
      suggestion?: string;
    }[];
    requiredChanges?: string[];
  }): Promise<{ decision: string; nextSteps: string[] }> {
    const db = await this.ensureDb();

    const submissionRef = doc(db, 'template-submissions', params.submissionId);
    const submissionSnap = await getDoc(submissionRef);

    if (!submissionSnap.exists()) {
      throw new Error('Submission not found');
    }

    const submission = submissionSnap.data();

    // Create detailed review record
    const reviewRecord = {
      submissionId: params.submissionId,
      templateId: submission.templateId,
      reviewerId: params.reviewerId,
      decision: params.decision,
      feedback: params.feedback,
      qualityScore: params.qualityScore,
      issues: params.issues || [],
      requiredChanges: params.requiredChanges || [],
      reviewedAt: serverTimestamp(),
      reviewDuration:
        Date.now() - (submission.assignedAt?.toMillis() || Date.now()),
    };

    // Update submission status
    await updateDoc(submissionRef, {
      status:
        params.decision === 'approved'
          ? 'approved'
          : params.decision === 'rejected'
            ? 'rejected'
            : 'changes_required',
      review: reviewRecord,
      completedAt: serverTimestamp(),
    });

    // Handle different decisions
    if (params.decision === 'approved') {
      await this.approveTemplate(submission.templateId, params.reviewerId);
    } else if (params.decision === 'rejected') {
      await this.rejectTemplate(
        submission.templateId,
        params.reviewerId,
        params.feedback,
      );
    } else {
      await this.requestChanges(
        submission.templateId,
        params.requiredChanges || [],
      );
    }

    // Notify template creator
    await this.notifyCreator({
      templateId: submission.templateId,
      decision: params.decision,
      feedback: params.feedback,
      issues: params.issues || [],
    });

    const nextSteps = this.getNextSteps(params.decision);

    return {
      decision: params.decision,
      nextSteps,
    };
  }

  /**
   * Step 5: Approve template (internal)
   */
  private async approveTemplate(
    templateId: string,
    reviewerId: string,
  ): Promise<void> {
    const db = await this.ensureDb();

    const templateRef = doc(db, 'marketplace-templates', templateId);
    const templateSnap = await getDoc(templateRef);

    if (!templateSnap.exists()) {
      throw new Error('Template not found');
    }

    const template = templateSnap.data() as MarketplaceTemplate;

    // Update template to published state
    await updateDoc(templateRef, {
      moderationStatus: 'approved',
      visibility: 'public',
      publishedAt: serverTimestamp(),
      approvedBy: reviewerId,
      approvedAt: serverTimestamp(),
    });

    // Publish the initial version
    await templateVersionManager.publishVersion(
      templateId,
      template.currentVersion,
      reviewerId,
    );

    // Update creator profile stats
    await this.updateCreatorStats(template.createdBy, 'template_approved');

    // Add to marketplace indexes for search
    await this.indexTemplateForSearch(templateId);
  }

  /**
   * Step 6: Handle template rejection
   */
  private async rejectTemplate(
    templateId: string,
    reviewerId: string,
    reason: string,
  ): Promise<void> {
    const db = await this.ensureDb();

    const templateRef = doc(db, 'marketplace-templates', templateId);
    await updateDoc(templateRef, {
      moderationStatus: 'rejected',
      rejectedBy: reviewerId,
      rejectedAt: serverTimestamp(),
      rejectionReason: reason,
    });
  }

  /**
   * Step 7: Request changes
   */
  private async requestChanges(
    templateId: string,
    requiredChanges: string[],
  ): Promise<void> {
    const db = await this.ensureDb();

    const templateRef = doc(db, 'marketplace-templates', templateId);
    await updateDoc(templateRef, {
      moderationStatus: 'changes_required',
      requiredChanges,
      changesRequestedAt: serverTimestamp(),
    });
  }

  /**
   * Utility functions
   */

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private createInitialStats() {
    return {
      totalDownloads: 0,
      totalInstalls: 0,
      totalRevenue: 0,
      uniqueUsers: 0,
      downloadsThisMonth: 0,
      downloadsThisWeek: 0,
      revenueThisMonth: 0,
      totalRatings: 0,
      averageRating: 0,
      completionRate: 0,
      forkCount: 0,
      favoriteCount: 0,
      reportCount: 0,
      versionCount: 1,
      lastVersionDate: new Date() as any,
      updateFrequency: 0,
    };
  }

  private createInitialRatings() {
    return {
      averageRating: 0,
      totalRatings: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      recentTrend: 'stable' as const,
      trendChange: 0,
    };
  }

  private async createSubmissionRecord(params: {
    templateId: string;
    versionId: string;
    submittedBy: string;
    submissionType: string;
    status: string;
  }) {
    const db = await this.ensureDb();
    const submissionRef = doc(collection(db, 'template-submissions'));

    await setDoc(submissionRef, {
      ...params,
      submittedAt: serverTimestamp(),
      id: submissionRef.id,
    });
  }

  private calculateEstimatedReviewTime(): string {
    // Simple algorithm - could be made more sophisticated
    return '3-5 business days';
  }

  private calculateSubmissionPriority(
    templateId: string,
  ): 'low' | 'normal' | 'high' {
    // Simple algorithm - could be based on creator reputation, template complexity, etc.
    return 'normal';
  }

  private calculateEstimatedCompletion(priority?: string): Date {
    const days =
      priority === 'urgent'
        ? 1
        : priority === 'high'
          ? 2
          : priority === 'normal'
            ? 3
            : 5;
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }

  private async notifyReviewTeam(submission: any) {
    // TODO: Implement notification system (email, in-app, etc.)
    console.log('Notify review team:', submission);
  }

  private async notifyReviewer(params: any) {
    // TODO: Implement reviewer notification
    console.log('Notify reviewer:', params);
  }

  private async notifyCreator(params: any) {
    // TODO: Implement creator notification
    console.log('Notify creator:', params);
  }

  private async updateCreatorStats(userId: string, event: string) {
    // TODO: Update creator profile statistics
    console.log('Update creator stats:', userId, event);
  }

  private async indexTemplateForSearch(templateId: string) {
    // TODO: Add to search indexes (Algolia, Elasticsearch, etc.)
    console.log('Index template for search:', templateId);
  }

  private getNextSteps(decision: string): string[] {
    switch (decision) {
      case 'approved':
        return [
          'Template is now live in the marketplace',
          'Start promoting your template to potential users',
          'Monitor analytics and user feedback',
          'Consider creating additional versions or related templates',
        ];
      case 'rejected':
        return [
          'Review the feedback provided by the reviewer',
          'Address the identified issues',
          'Create a new template submission when ready',
          'Contact support if you need clarification on the rejection',
        ];
      case 'needs_changes':
        return [
          'Review the required changes listed by the reviewer',
          'Update your template to address the feedback',
          'Resubmit the template for review',
          'Ensure all legal and quality requirements are met',
        ];
      default:
        return [];
    }
  }
}

/**
 * Singleton instance for easy access
 */
export const templateSubmissionWorkflow = new TemplateSubmissionWorkflow();
