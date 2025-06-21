// src/lib/versioning/__tests__/template-version-manager.test.ts
import { TemplateVersionManager } from '../template-version-manager';
import type { LegalDocument } from '@/types/documents';
import type { ChangelogEntry } from '@/types/marketplace';

// Mock Firebase first without referencing mockDb
jest.mock('@/lib/firebase', () => ({
  getDb: jest.fn(),
}));

// Mock Firestore - define functions inside the mock factory
jest.mock('firebase/firestore', () => {
  const mockGetDocs = jest.fn();
  const mockCollection = jest.fn();
  const mockDoc = jest.fn();
  const mockSetDoc = jest.fn();
  const mockGetDoc = jest.fn();
  const mockUpdateDoc = jest.fn();
  const mockQuery = jest.fn();
  const mockWhere = jest.fn();
  const mockOrderBy = jest.fn();
  const mockLimit = jest.fn();

  // Store references for later use
  global.__mockFirestoreVersions = {
    getDocs: mockGetDocs,
    collection: mockCollection,
    doc: mockDoc,
    setDoc: mockSetDoc,
    getDoc: mockGetDoc,
    updateDoc: mockUpdateDoc,
    query: mockQuery,
    where: mockWhere,
    orderBy: mockOrderBy,
    limit: mockLimit,
    serverTimestamp: jest.fn(() => ({ seconds: Date.now() / 1000 })),
  };

  return global.__mockFirestoreVersions;
});

const mockDb = {
  collection: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
};

// After mockDb is defined, set the implementation
const firebase = require('@/lib/firebase');
firebase.getDb.mockImplementation(() => Promise.resolve(mockDb));

describe('TemplateVersionManager', () => {
  let manager: TemplateVersionManager;
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

  beforeEach(() => {
    manager = new TemplateVersionManager();
    jest.clearAllMocks();

    // Clear all global mock functions
    if (global.__mockFirestoreVersions) {
      Object.values(global.__mockFirestoreVersions).forEach((mockFn) => {
        if (typeof mockFn === 'function' && mockFn.mockClear) {
          mockFn.mockClear();
        }
      });

      // Setup default mock behaviors
      global.__mockFirestoreVersions.collection.mockReturnValue('collection');
      global.__mockFirestoreVersions.doc.mockReturnValue({ id: 'test-doc' });
      global.__mockFirestoreVersions.setDoc.mockResolvedValue(undefined);
      global.__mockFirestoreVersions.getDoc.mockResolvedValue({
        exists: () => false,
      });
      global.__mockFirestoreVersions.updateDoc.mockResolvedValue(undefined);
      global.__mockFirestoreVersions.getDocs.mockResolvedValue({ docs: [] });
      global.__mockFirestoreVersions.query.mockReturnValue('query');
      global.__mockFirestoreVersions.where.mockReturnValue('where');
      global.__mockFirestoreVersions.orderBy.mockReturnValue('orderBy');
      global.__mockFirestoreVersions.limit.mockReturnValue('limit');
    }
  });

  describe('createVersion', () => {
    it('should create a new template version', async () => {
      const mockDocRef = { id: 'test-template-v1.0.0' };
      global.__mockFirestoreVersions.doc.mockReturnValue(mockDocRef);
      global.__mockFirestoreVersions.setDoc.mockResolvedValue(undefined);

      const changelog: ChangelogEntry[] = [
        {
          type: 'added',
          description: 'Initial template version',
          impact: 'major',
        },
      ];

      const result = await manager.createVersion({
        templateId: 'test-template',
        version: '1.0.0',
        document: mockDocument,
        createdBy: 'user123',
        changelog,
        breaking: false,
      });

      expect(result.version).toBe('1.0.0');
      expect(result.templateId).toBe('test-template');
      expect(result.changelog).toEqual(changelog);
      expect(result.breaking).toBe(false);
      expect(global.__mockFirestoreVersions.setDoc).toHaveBeenCalled();
    });

    it('should reject invalid semantic versions', async () => {
      await expect(
        manager.createVersion({
          templateId: 'test-template',
          version: 'invalid-version',
          document: mockDocument,
          createdBy: 'user123',
          changelog: [],
        }),
      ).rejects.toThrow('Invalid semantic version: invalid-version');
    });

    it('should reject duplicate versions', async () => {
      // Mock existing version
      global.__mockFirestoreVersions.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ version: '1.0.0' }),
      });

      await expect(
        manager.createVersion({
          templateId: 'test-template',
          version: '1.0.0',
          document: mockDocument,
          createdBy: 'user123',
          changelog: [],
        }),
      ).rejects.toThrow(
        'Version 1.0.0 already exists for template test-template',
      );
    });
  });

  describe('getVersion', () => {
    it('should retrieve a specific version', async () => {
      const mockVersionData = {
        id: 'test-template-v1.0.0',
        templateId: 'test-template',
        version: '1.0.0',
        document: mockDocument,
        changelog: [],
      };

      global.__mockFirestoreVersions.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockVersionData,
      });

      const result = await manager.getVersion('test-template', '1.0.0');
      expect(result).toEqual(mockVersionData);
    });

    it('should return null for non-existent version', async () => {
      global.__mockFirestoreVersions.getDoc.mockResolvedValue({
        exists: () => false,
      });

      const result = await manager.getVersion('test-template', '1.0.0');
      expect(result).toBeNull();
    });
  });

  describe('publishVersion', () => {
    it('should publish a draft version', async () => {
      global.__mockFirestoreVersions.updateDoc.mockResolvedValue(undefined);

      await manager.publishVersion('test-template', '1.0.0', 'reviewer123');

      expect(global.__mockFirestoreVersions.updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          status: 'published',
          approvedBy: 'reviewer123',
        }),
      );
    });
  });

  describe('deprecateVersion', () => {
    it('should deprecate a version', async () => {
      global.__mockFirestoreVersions.updateDoc.mockResolvedValue(undefined);

      await manager.deprecateVersion(
        'test-template',
        '1.0.0',
        'Security vulnerability',
      );

      expect(global.__mockFirestoreVersions.updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          status: 'deprecated',
          deprecationReason: 'Security vulnerability',
        }),
      );
    });
  });

  describe('validateCompatibility', () => {
    it('should pass validation for first version', async () => {
      // Mock no existing versions
      global.__mockFirestoreVersions.getDoc.mockResolvedValue({
        exists: () => false,
      });

      const results = await manager.validateCompatibility(
        'test-template',
        '1.0.0',
        mockDocument,
      );

      expect(results).toHaveLength(1);
      expect(results[0].rule).toBe('first-version');
      expect(results[0].status).toBe('pass');
    });

    it('should validate version increment', async () => {
      // Mock existing version
      const existingVersion = {
        version: '1.0.0',
        document: mockDocument,
      };

      global.__mockFirestoreVersions.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => existingVersion,
      });

      const results = await manager.validateCompatibility(
        'test-template',
        '0.9.0', // Lower version
        mockDocument,
      );

      const versionIncrementResult = results.find(
        (r) => r.rule === 'version-increment',
      );
      expect(versionIncrementResult?.status).toBe('fail');
    });

    it('should detect breaking changes requiring major version bump', async () => {
      const existingVersion = {
        version: '1.0.0',
        document: mockDocument,
      };

      global.__mockFirestoreVersions.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => existingVersion,
      });

      // Modify document to have breaking changes
      const modifiedDocument = {
        ...mockDocument,
        questions: [
          {
            id: 'q1',
            label: 'Company Name',
            type: 'number', // Changed type - breaking change
            required: true,
          },
        ],
      };

      const results = await manager.validateCompatibility(
        'test-template',
        '1.1.0', // Minor version bump but has breaking changes
        modifiedDocument,
      );

      const breakingChangesResult = results.find(
        (r) => r.rule === 'breaking-changes',
      );
      expect(breakingChangesResult?.status).toBe('fail');
    });
  });

  describe('suggestNextVersion', () => {
    it('should suggest major version for breaking changes', () => {
      const suggestion = manager.suggestNextVersion('1.0.0', {
        breaking: true,
        features: false,
        fixes: false,
      });

      expect(suggestion).toBe('2.0.0');
    });

    it('should suggest minor version for new features', () => {
      const suggestion = manager.suggestNextVersion('1.0.0', {
        breaking: false,
        features: true,
        fixes: false,
      });

      expect(suggestion).toBe('1.1.0');
    });

    it('should suggest patch version for bug fixes', () => {
      const suggestion = manager.suggestNextVersion('1.0.0', {
        breaking: false,
        features: false,
        fixes: true,
      });

      expect(suggestion).toBe('1.0.1');
    });
  });

  describe('compareVersions', () => {
    it('should generate version diff', async () => {
      const originalVersion = {
        id: 'v1',
        templateId: 'test-template',
        version: '1.0.0',
        document: mockDocument,
        changelog: [],
      } as any;

      const modifiedDocument = {
        ...mockDocument,
        questions: [
          ...mockDocument.questions!,
          {
            id: 'q2',
            label: 'Email',
            type: 'text',
            required: false,
          },
        ],
      };

      const modifiedVersion = {
        id: 'v2',
        templateId: 'test-template',
        version: '1.1.0',
        document: modifiedDocument,
        changelog: [
          {
            type: 'added',
            description: 'Added email field',
            impact: 'minor',
          },
        ],
      } as any;

      global.__mockFirestoreVersions.getDoc
        .mockResolvedValueOnce({
          exists: () => true,
          data: () => originalVersion,
        })
        .mockResolvedValueOnce({
          exists: () => true,
          data: () => modifiedVersion,
        });

      const result = await manager.compareVersions(
        'test-template',
        '1.0.0',
        '1.1.0',
      );

      expect(result.fromVersion.version).toBe('1.0.0');
      expect(result.toVersion.version).toBe('1.1.0');
      expect(result.diff.versionChange.type).toBe('minor');
      expect(result.diff.schemaChanges.added).toContain('question.q2');
    });
  });
});
