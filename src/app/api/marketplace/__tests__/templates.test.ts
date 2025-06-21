// src/app/api/marketplace/__tests__/templates.test.ts
import { GET, POST } from '../templates/route';
import { NextRequest } from 'next/server';

// Mock Firebase first
jest.mock('@/lib/firebase', () => ({
  getDb: jest.fn(),
}));

// Mock Firestore - define functions inside the mock factory
jest.mock('firebase/firestore', () => {
  const mockGetDocs = jest.fn();
  const mockCollection = jest.fn();
  const mockDoc = jest.fn();
  const mockQuery = jest.fn();
  const mockWhere = jest.fn();
  const mockOrderBy = jest.fn();
  const mockLimit = jest.fn();
  const mockStartAfter = jest.fn();
  const mockAddDoc = jest.fn();

  // Store references for later use
  global.__mockFirestore = {
    getDocs: mockGetDocs,
    collection: mockCollection,
    doc: mockDoc,
    query: mockQuery,
    where: mockWhere,
    orderBy: mockOrderBy,
    limit: mockLimit,
    startAfter: mockStartAfter,
    addDoc: mockAddDoc,
  };

  return global.__mockFirestore;
});

// Mock auth
jest.mock('@/lib/auth', () => ({
  getCurrentUser: jest.fn(),
}));

// Mock template submission workflow
jest.mock('@/lib/marketplace/template-submission-workflow', () => ({
  TemplateSubmissionWorkflow: jest.fn().mockImplementation(() => ({
    createTemplateDraft: jest.fn(),
  })),
}));

const mockDb = {
  collection: jest.fn(),
  doc: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
};

// After mockDb is defined, set the implementation
const firebase = require('@/lib/firebase');
firebase.getDb.mockImplementation(() => Promise.resolve(mockDb));

const { getCurrentUser } = require('@/lib/auth');
const {
  TemplateSubmissionWorkflow,
} = require('@/lib/marketplace/template-submission-workflow');

describe('/api/marketplace/templates', () => {
  const mockTemplates = [
    {
      id: 'template-1',
      data: () => ({
        id: 'template-1',
        name: 'Service Agreement',
        description: 'Professional service agreement template',
        category: 'Business Contracts',
        pricing: { type: 'one-time', basePrice: 2999 },
        stats: { totalDownloads: 150, averageRating: 4.5 },
        ratings: { averageRating: 4.5, totalRatings: 50 },
        tags: ['service', 'agreement', 'contract'],
        languageSupport: ['en', 'es'],
        states: 'all',
        verified: true,
        featured: false,
        createdBy: 'user-1',
        visibility: 'public',
        moderationStatus: 'approved',
      }),
    },
    {
      id: 'template-2',
      data: () => ({
        id: 'template-2',
        name: 'NDA Template',
        description: 'Non-disclosure agreement template',
        category: 'Legal Agreements',
        pricing: { type: 'free', basePrice: 0 },
        stats: { totalDownloads: 500, averageRating: 4.8 },
        ratings: { averageRating: 4.8, totalRatings: 120 },
        tags: ['nda', 'agreement', 'legal'],
        languageSupport: ['en'],
        states: 'all',
        verified: true,
        featured: true,
        createdBy: 'user-2',
        visibility: 'public',
        moderationStatus: 'approved',
      }),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Set up default mock behavior for Firestore query chain
    const mocks = global.__mockFirestore;
    mocks.collection.mockReturnValue('collection');
    mocks.where.mockReturnValue('where');
    mocks.orderBy.mockReturnValue('orderBy');
    mocks.limit.mockReturnValue('limit');
    mocks.query.mockReturnValue('query');
    mocks.startAfter.mockReturnValue('startAfter');
  });

  describe('GET /api/marketplace/templates', () => {
    it('should return paginated templates list', async () => {
      global.__mockFirestore.getDocs.mockResolvedValue({
        docs: mockTemplates,
        size: 2,
      });

      const url = new URL(
        'http://localhost/api/marketplace/templates?page=1&limit=10',
      );
      const request = new NextRequest(url);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);

      // Debug: Log the actual response
      console.log('Response data:', JSON.stringify(data, null, 2));

      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(data.data.templates).toHaveLength(2);
      expect(data.data.pagination.page).toBe(1);
      expect(data.data.pagination.limit).toBe(10);
      expect(data.data.pagination.total).toBe(2);
    });

    it('should filter templates by category', async () => {
      const filteredTemplates = [mockTemplates[0]]; // Only Business Contracts
      global.__mockFirestore.getDocs.mockResolvedValue({
        docs: filteredTemplates,
        size: 1,
      });

      const url = new URL(
        'http://localhost/api/marketplace/templates?category=Business%20Contracts',
      );
      const request = new NextRequest(url);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.templates).toHaveLength(1);
      expect(data.data.templates[0].template.category).toBe(
        'Business Contracts',
      );
    });

    it('should search templates by query', async () => {
      const searchResults = [mockTemplates[1]]; // NDA contains "agreement"
      global.__mockFirestore.getDocs.mockResolvedValue({
        docs: searchResults,
        size: 1,
      });

      const url = new URL(
        'http://localhost/api/marketplace/templates?search=agreement',
      );
      const request = new NextRequest(url);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.templates).toHaveLength(1);
      expect(data.data.templates[0].template.name).toContain('NDA');
    });

    it('should filter by price range', async () => {
      const freeTemplates = [mockTemplates[1]]; // Free template
      global.__mockFirestore.getDocs.mockResolvedValue({
        docs: freeTemplates,
        size: 1,
      });

      const url = new URL(
        'http://localhost/api/marketplace/templates?minPrice=0&maxPrice=0',
      );
      const request = new NextRequest(url);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.templates).toHaveLength(1);
      expect(data.data.templates[0].template.pricing.basePrice).toBe(0);
    });

    it('should sort templates by different criteria', async () => {
      global.__mockFirestore.getDocs.mockResolvedValue({
        docs: [...mockTemplates].reverse(), // Reversed order
        size: 2,
      });

      const url = new URL(
        'http://localhost/api/marketplace/templates?sortBy=rating&sortOrder=desc',
      );
      const request = new NextRequest(url);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.templates).toHaveLength(2);
      // Should be sorted by rating descending
      expect(
        data.data.templates[0].template.stats.averageRating,
      ).toBeGreaterThanOrEqual(
        data.data.templates[1].template.stats.averageRating,
      );
    });

    it('should filter by minimum rating', async () => {
      const highRatedTemplates = [mockTemplates[1]]; // 4.8 rating
      global.__mockFirestore.getDocs.mockResolvedValue({
        docs: highRatedTemplates,
        size: 1,
      });

      const url = new URL(
        'http://localhost/api/marketplace/templates?minRating=4.7',
      );
      const request = new NextRequest(url);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.templates).toHaveLength(1);
      expect(
        data.data.templates[0].template.stats.averageRating,
      ).toBeGreaterThanOrEqual(4.7);
    });

    it('should filter by tags', async () => {
      const taggedTemplates = [mockTemplates[0]];
      global.__mockFirestore.getDocs.mockResolvedValue({
        docs: taggedTemplates,
        size: 1,
      });

      const url = new URL(
        'http://localhost/api/marketplace/templates?tags=contract,business',
      );
      const request = new NextRequest(url);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.templates).toHaveLength(1);
    });

    it('should handle pagination correctly', async () => {
      global.__mockFirestore.getDocs.mockResolvedValue({
        docs: mockTemplates,
        size: 2,
      });

      const url = new URL(
        'http://localhost/api/marketplace/templates?page=2&limit=1',
      );
      const request = new NextRequest(url);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.pagination.page).toBe(2);
      expect(data.data.pagination.limit).toBe(1);
      expect(data.data.pagination.hasMore).toBe(true);
    });

    it('should handle empty results', async () => {
      global.__mockFirestore.getDocs.mockResolvedValue({
        docs: [],
        size: 0,
      });

      const url = new URL(
        'http://localhost/api/marketplace/templates?search=nonexistent',
      );
      const request = new NextRequest(url);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.templates).toHaveLength(0);
      expect(data.data.pagination.total).toBe(0);
    });

    it('should handle database errors', async () => {
      global.__mockFirestore.getDocs.mockRejectedValue(
        new Error('Database error'),
      );

      const url = new URL('http://localhost/api/marketplace/templates');
      const request = new NextRequest(url);

      const response = await GET(request);

      expect(response.status).toBe(500);
    });
  });

  describe('POST /api/marketplace/templates', () => {
    const mockSubmissionForm = {
      templateName: 'New Service Agreement',
      description: 'A new service agreement template',
      category: 'Business Contracts',
      tags: ['contract', 'business'],
      jurisdiction: 'US',
      states: 'all',
      languageSupport: ['en'],
      pricing: {
        type: 'one-time',
        basePrice: 1999,
        currency: 'USD',
        creatorShare: 70,
        platformFee: 30,
      },
      licenseType: 'premium',
      document: {
        id: 'doc-123',
        name: 'Service Agreement',
        category: 'Business Contracts',
        schema: {},
        questions: [],
        description: 'Service agreement template',
        languageSupport: ['en'],
        basePrice: 1999,
        requiresNotarization: false,
        canBeRecorded: false,
        offerNotarization: false,
        offerRecordingHelp: false,
      },
      version: '1.0.0',
      changelog: [
        {
          type: 'added',
          description: 'Initial template version',
          impact: 'major',
        },
      ],
    };

    it('should create template draft successfully', async () => {
      getCurrentUser.mockResolvedValue({
        uid: 'user-123',
        email: 'creator@example.com',
      });

      const mockWorkflow = {
        createTemplateDraft: jest.fn().mockResolvedValue({
          templateId: 'template-123',
          versionId: 'version-123',
        }),
      };
      TemplateSubmissionWorkflow.mockImplementation(() => mockWorkflow);

      const request = new NextRequest(
        'http://localhost/api/marketplace/templates',
        {
          method: 'POST',
          body: JSON.stringify(mockSubmissionForm),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.templateId).toBe('template-123');
      expect(data.versionId).toBe('version-123');
      expect(mockWorkflow.createTemplateDraft).toHaveBeenCalledWith(
        'user-123',
        mockSubmissionForm,
      );
    });

    it('should require authentication', async () => {
      getCurrentUser.mockResolvedValue(null);

      const request = new NextRequest(
        'http://localhost/api/marketplace/templates',
        {
          method: 'POST',
          body: JSON.stringify(mockSubmissionForm),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const response = await POST(request);

      expect(response.status).toBe(401);
    });

    it('should validate request body', async () => {
      getCurrentUser.mockResolvedValue({
        uid: 'user-123',
        email: 'creator@example.com',
      });

      const invalidForm = {
        ...mockSubmissionForm,
        templateName: '', // Invalid: empty name
      };

      const request = new NextRequest(
        'http://localhost/api/marketplace/templates',
        {
          method: 'POST',
          body: JSON.stringify(invalidForm),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const response = await POST(request);

      expect(response.status).toBe(400);
    });

    it('should handle invalid JSON', async () => {
      getCurrentUser.mockResolvedValue({
        uid: 'user-123',
        email: 'creator@example.com',
      });

      const request = new NextRequest(
        'http://localhost/api/marketplace/templates',
        {
          method: 'POST',
          body: 'invalid json',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const response = await POST(request);

      expect(response.status).toBe(400);
    });

    it('should handle submission workflow errors', async () => {
      getCurrentUser.mockResolvedValue({
        uid: 'user-123',
        email: 'creator@example.com',
      });

      const mockWorkflow = {
        createTemplateDraft: jest
          .fn()
          .mockRejectedValue(new Error('Workflow error')),
      };
      TemplateSubmissionWorkflow.mockImplementation(() => mockWorkflow);

      const request = new NextRequest(
        'http://localhost/api/marketplace/templates',
        {
          method: 'POST',
          body: JSON.stringify(mockSubmissionForm),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const response = await POST(request);

      expect(response.status).toBe(500);
    });

    it('should validate template pricing', async () => {
      getCurrentUser.mockResolvedValue({
        uid: 'user-123',
        email: 'creator@example.com',
      });

      const invalidPricingForm = {
        ...mockSubmissionForm,
        pricing: {
          ...mockSubmissionForm.pricing,
          basePrice: -100, // Invalid: negative price
        },
      };

      const request = new NextRequest(
        'http://localhost/api/marketplace/templates',
        {
          method: 'POST',
          body: JSON.stringify(invalidPricingForm),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const response = await POST(request);

      expect(response.status).toBe(400);
    });

    it('should validate semantic version', async () => {
      getCurrentUser.mockResolvedValue({
        uid: 'user-123',
        email: 'creator@example.com',
      });

      const invalidVersionForm = {
        ...mockSubmissionForm,
        version: 'invalid-version', // Invalid: not semantic version
      };

      const request = new NextRequest(
        'http://localhost/api/marketplace/templates',
        {
          method: 'POST',
          body: JSON.stringify(invalidVersionForm),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const response = await POST(request);

      expect(response.status).toBe(400);
    });
  });
});
