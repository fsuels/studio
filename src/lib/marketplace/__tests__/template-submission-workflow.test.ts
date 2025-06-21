// src/lib/marketplace/__tests__/template-submission-workflow.test.ts
import { TemplateSubmissionWorkflow } from '../template-submission-workflow';
import type { LegalDocument } from '@/types/documents';
import type { SubmissionForm, SubmissionReview } from '@/types/marketplace';

// Mock Firebase
jest.mock('@/lib/firebase', () => ({
  getDb: jest.fn(() => Promise.resolve(mockDb)),
}));

// Mock Firebase functions
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  serverTimestamp: jest.fn(() => ({ seconds: Date.now() / 1000 })),
}));

const mockDb = {
  collection: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
};

// Mock email service
jest.mock('@/lib/email', () => ({
  sendEmail: jest.fn(),
}));

describe('TemplateSubmissionWorkflow', () => {
  let workflow: TemplateSubmissionWorkflow;
  
  const mockDocument: LegalDocument = {
    id: 'test-doc',
    category: 'Business Contracts',
    schema: {} as any,
    questions: [
      {
        id: 'q1',
        label: 'Company Name',
        type: 'text',
        required: true,
      },
    ],
    name: 'Test Document',
    description: 'A test document',
    languageSupport: ['en'],
    basePrice: 1000,
    requiresNotarization: false,
    canBeRecorded: false,
    offerNotarization: false,
    offerRecordingHelp: false,
  };

  const mockSubmissionForm: SubmissionForm = {
    templateName: 'Professional Service Agreement',
    description: 'A comprehensive service agreement template',
    category: 'Business Contracts',
    tags: ['contract', 'business', 'professional'],
    jurisdiction: 'US',
    states: 'all',
    languageSupport: ['en', 'es'],
    pricing: {
      type: 'one-time',
      basePrice: 2999,
      currency: 'USD',
      creatorShare: 70,
      platformFee: 30,
    },
    licenseType: 'premium',
    document: mockDocument,
    version: '1.0.0',
    changelog: [
      {
        type: 'added',
        description: 'Initial template version',
        impact: 'major',
      },
    ],
    notes: 'This is a high-quality template for professional services.',
  };

  beforeEach(() => {
    workflow = new TemplateSubmissionWorkflow();
    jest.clearAllMocks();
  });

  describe('createTemplateDraft', () => {
    it('should create a template draft', async () => {
      const mockDocRef = { id: 'template-123' };
      const mockVersionDocRef = { id: 'template-123-v1.0.0' };
      
      mockDb.doc.mockReturnValueOnce(mockDocRef);
      mockDb.doc.mockReturnValueOnce(mockVersionDocRef);
      mockDb.setDoc.mockResolvedValue(undefined);

      const result = await workflow.createTemplateDraft(
        'user123',
        mockSubmissionForm
      );

      expect(result.templateId).toBe('template-123');
      expect(result.versionId).toBe('template-123-v1.0.0');
      expect(mockDb.setDoc).toHaveBeenCalledTimes(2); // Template and version
    });

    it('should generate unique slug for duplicate names', async () => {
      // Mock existing template with same slug
      mockDb.getDoc.mockResolvedValueOnce({
        exists: () => true,
      });
      mockDb.getDoc.mockResolvedValueOnce({
        exists: () => false,
      });

      const mockDocRef = { id: 'template-123' };
      mockDb.doc.mockReturnValue(mockDocRef);
      mockDb.setDoc.mockResolvedValue(undefined);

      const result = await workflow.createTemplateDraft(
        'user123',
        mockSubmissionForm
      );

      expect(result.templateId).toBe('template-123');
      // Should have checked for duplicate slugs
      expect(mockDb.getDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining('professional-service-agreement')
      );
    });
  });

  describe('submitForReview', () => {
    it('should submit template for review', async () => {
      const mockSubmissionRef = { id: 'submission-123' };
      mockDb.doc.mockReturnValue(mockSubmissionRef);
      mockDb.setDoc.mockResolvedValue(undefined);
      mockDb.updateDoc.mockResolvedValue(undefined);

      const result = await workflow.submitForReview({
        templateId: 'template-123',
        versionId: 'template-123-v1.0.0',
        submittedBy: 'user123',
      });

      expect(result.submissionId).toBe('submission-123');
      expect(result.estimatedReviewTime).toBe('3-5 business days');
      expect(mockDb.setDoc).toHaveBeenCalled(); // Submission created
      expect(mockDb.updateDoc).toHaveBeenCalled(); // Template status updated
    });

    it('should calculate review time based on template complexity', async () => {
      const complexSubmissionForm = {
        ...mockSubmissionForm,
        document: {
          ...mockDocument,
          questions: Array(20).fill(null).map((_, i) => ({
            id: `q${i}`,
            label: `Question ${i}`,
            type: 'text',
            required: true,
          })),
        },
      };

      const mockSubmissionRef = { id: 'submission-123' };
      mockDb.doc.mockReturnValue(mockSubmissionRef);
      mockDb.setDoc.mockResolvedValue(undefined);
      mockDb.updateDoc.mockResolvedValue(undefined);

      // First create draft with complex form
      await workflow.createTemplateDraft('user123', complexSubmissionForm);

      const result = await workflow.submitForReview({
        templateId: 'template-123',
        versionId: 'template-123-v1.0.0',
        submittedBy: 'user123',
      });

      expect(result.estimatedReviewTime).toBe('5-7 business days'); // Longer for complex templates
    });
  });

  describe('assignReviewer', () => {
    it('should assign reviewer to submission', async () => {
      mockDb.updateDoc.mockResolvedValue(undefined);

      await workflow.assignReviewer('submission-123', 'reviewer456');

      expect(mockDb.updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          status: 'in_review',
          assignedReviewer: 'reviewer456',
        })
      );
    });
  });

  describe('submitReview', () => {
    const mockReview: SubmissionReview = {
      submissionId: 'submission-123',
      reviewerId: 'reviewer456',
      decision: 'approved',
      feedback: 'Excellent template, approved for marketplace.',
      qualityScore: 9,
      categories: {
        documentation: 'excellent',
        usability: 'good',
        legal_accuracy: 'excellent',
        formatting: 'good',
      },
      suggestedImprovements: [],
      requiresChanges: false,
    };

    it('should approve template submission', async () => {
      mockDb.updateDoc.mockResolvedValue(undefined);

      const result = await workflow.submitReview(mockReview);

      expect(result.decision).toBe('approved');
      expect(result.nextSteps).toContain('template will be published');
      expect(mockDb.updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          status: 'approved',
          review: mockReview,
        })
      );
    });

    it('should reject template submission', async () => {
      const rejectedReview: SubmissionReview = {
        ...mockReview,
        decision: 'rejected',
        feedback: 'Template needs significant improvements.',
        qualityScore: 4,
        categories: {
          documentation: 'poor',
          usability: 'fair',
          legal_accuracy: 'poor',
          formatting: 'good',
        },
        suggestedImprovements: [
          'Improve legal accuracy',
          'Add better documentation',
        ],
        requiresChanges: true,
      };

      mockDb.updateDoc.mockResolvedValue(undefined);

      const result = await workflow.submitReview(rejectedReview);

      expect(result.decision).toBe('rejected');
      expect(result.nextSteps).toContain('make the suggested improvements');
      expect(mockDb.updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          status: 'rejected',
          review: rejectedReview,
        })
      );
    });

    it('should request changes for template submission', async () => {
      const changesRequiredReview: SubmissionReview = {
        ...mockReview,
        decision: 'changes_required',
        feedback: 'Good template but needs minor improvements.',
        qualityScore: 7,
        suggestedImprovements: [
          'Fix formatting issues',
          'Clarify instructions',
        ],
        requiresChanges: true,
      };

      mockDb.updateDoc.mockResolvedValue(undefined);

      const result = await workflow.submitReview(changesRequiredReview);

      expect(result.decision).toBe('changes_required');
      expect(result.nextSteps).toContain('address the requested changes');
    });
  });

  describe('publishTemplate', () => {
    it('should publish approved template', async () => {
      mockDb.updateDoc.mockResolvedValue(undefined);

      await workflow.publishTemplate(
        'template-123',
        'template-123-v1.0.0',
        'reviewer456'
      );

      expect(mockDb.updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          visibility: 'public',
          moderationStatus: 'approved',
        })
      );

      expect(mockDb.updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          status: 'published',
          approvedBy: 'reviewer456',
        })
      );
    });
  });

  describe('rejectTemplate', () => {
    it('should reject template with reason', async () => {
      mockDb.updateDoc.mockResolvedValue(undefined);

      await workflow.rejectTemplate(
        'submission-123',
        'template-123',
        'template-123-v1.0.0',
        'Does not meet quality standards'
      );

      expect(mockDb.updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          moderationStatus: 'rejected',
          rejectionReason: 'Does not meet quality standards',
        })
      );
    });
  });

  describe('getSubmissionQueue', () => {
    it('should retrieve submission queue for reviewer', async () => {
      const mockSubmissions = [
        {
          id: 'submission-1',
          templateId: 'template-1',
          status: 'pending_review',
          submittedAt: new Date(),
        },
        {
          id: 'submission-2',
          templateId: 'template-2',
          status: 'in_review',
          assignedReviewer: 'reviewer456',
        },
      ];

      mockDb.getDocs = jest.fn().mockResolvedValue({
        docs: mockSubmissions.map(sub => ({
          id: sub.id,
          data: () => sub,
        })),
      });

      const result = await workflow.getSubmissionQueue('reviewer456');

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('submission-1');
      expect(result[1].id).toBe('submission-2');
    });
  });

  describe('getSubmissionHistory', () => {
    it('should retrieve submission history for user', async () => {
      const mockSubmissions = [
        {
          id: 'submission-1',
          status: 'approved',
          submittedAt: new Date('2024-01-01'),
        },
        {
          id: 'submission-2',
          status: 'rejected',
          submittedAt: new Date('2024-01-15'),
        },
      ];

      mockDb.getDocs = jest.fn().mockResolvedValue({
        docs: mockSubmissions.map(sub => ({
          id: sub.id,
          data: () => sub,
        })),
      });

      const result = await workflow.getSubmissionHistory('user123');

      expect(result).toHaveLength(2);
      expect(result[0].status).toBe('approved');
      expect(result[1].status).toBe('rejected');
    });
  });

  describe('calculateQualityScore', () => {
    it('should calculate quality score from review categories', () => {
      const categories = {
        documentation: 'excellent',
        usability: 'good',
        legal_accuracy: 'excellent',
        formatting: 'fair',
      };

      const score = workflow.calculateQualityScore(categories as any);
      
      // excellent=5, good=4, fair=3, poor=2, very_poor=1
      // (5 + 4 + 5 + 3) / 4 = 4.25, scaled to 8.5/10
      expect(score).toBe(8.5);
    });

    it('should handle minimum quality score', () => {
      const categories = {
        documentation: 'very_poor',
        usability: 'very_poor',
        legal_accuracy: 'very_poor',
        formatting: 'very_poor',
      };

      const score = workflow.calculateQualityScore(categories as any);
      expect(score).toBe(2); // Minimum score
    });
  });

  describe('estimateReviewTime', () => {
    it('should estimate review time based on complexity', () => {
      // Simple template
      const simpleTime = workflow.estimateReviewTime({
        questionsCount: 5,
        hasConditionalLogic: false,
        hasCustomValidation: false,
        documentLength: 500,
      });
      expect(simpleTime).toBe('3-5 business days');

      // Complex template
      const complexTime = workflow.estimateReviewTime({
        questionsCount: 25,
        hasConditionalLogic: true,
        hasCustomValidation: true,
        documentLength: 2000,
      });
      expect(complexTime).toBe('7-10 business days');

      // Very complex template
      const veryComplexTime = workflow.estimateReviewTime({
        questionsCount: 50,
        hasConditionalLogic: true,
        hasCustomValidation: true,
        documentLength: 5000,
      });
      expect(veryComplexTime).toBe('10-14 business days');
    });
  });
});