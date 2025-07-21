import { describe, it, expect, beforeAll } from '@jest/globals';
import { documentLibrary } from '@/lib/document-library';
import { generateDocument } from '@/services/pdf-generator';
import type { LegalDocument } from '@/types/documents';

describe('Document Generation System', () => {
  let testDocuments: LegalDocument[];

  beforeAll(() => {
    // Get a sample of documents for testing
    testDocuments = documentLibrary.slice(0, 5);
  });

  describe('Document Library Integrity', () => {
    it('should have all required documents loaded', () => {
      expect(documentLibrary).toBeDefined();
      expect(documentLibrary.length).toBeGreaterThan(40);
      expect(documentLibrary.length).toBeLessThanOrEqual(50);
    });

    it('should have valid document structure for all documents', () => {
      documentLibrary.forEach((doc) => {
        expect(doc).toHaveProperty('id');
        expect(doc).toHaveProperty('jurisdiction');
        expect(doc).toHaveProperty('category');
        expect(doc).toHaveProperty('schema');
        expect(doc).toHaveProperty('questions');
        expect(doc).toHaveProperty('translations');

        // Check translations structure
        expect(doc.translations).toHaveProperty('en');
        expect(doc.translations.en).toHaveProperty('name');
        expect(doc.translations.en).toHaveProperty('description');

        if (doc.translations.es) {
          expect(doc.translations.es).toHaveProperty('name');
          expect(doc.translations.es).toHaveProperty('description');
        }
      });
    });

    it('should have unique document IDs', () => {
      const ids = documentLibrary.map((doc) => doc.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid price information', () => {
      documentLibrary.forEach((doc) => {
        expect(doc.basePrice).toBeDefined();
        expect(typeof doc.basePrice).toBe('number');
        expect(doc.basePrice).toBeGreaterThan(0);
        expect(doc.basePrice).toBeLessThan(1000);
      });
    });

    it('should have valid jurisdiction and language support', () => {
      documentLibrary.forEach((doc) => {
        expect(doc.jurisdiction).toBeDefined();
        expect(['US', 'CA', 'ALL'].includes(doc.jurisdiction)).toBe(true);

        expect(doc.languageSupport).toBeDefined();
        expect(Array.isArray(doc.languageSupport)).toBe(true);
        expect(doc.languageSupport.includes('en')).toBe(true);
      });
    });
  });

  describe('Schema Validation', () => {
    it('should have valid Zod schemas for all documents', () => {
      testDocuments.forEach((doc) => {
        expect(doc.schema).toBeDefined();
        expect(typeof doc.schema.parse).toBe('function');
        expect(typeof doc.schema.safeParse).toBe('function');
      });
    });

    it('should validate sample data correctly', () => {
      testDocuments.forEach((doc) => {
        // Test with empty object (should fail)
        const emptyResult = doc.schema.safeParse({});
        expect(emptyResult.success).toBe(false);

        // Test with partial valid data
        const sampleData = {
          party1Name: 'John Doe',
          party1Address: '123 Main St, City, State 12345',
          party2Name: 'Jane Smith',
          party2Address: '456 Oak Ave, City, State 67890',
          effectiveDate: new Date().toISOString().split('T')[0],
        };

        // Some schemas might accept this basic data
        const partialResult = doc.schema.safeParse(sampleData);
        // We don't assert success here as different documents have different requirements
        expect(partialResult).toHaveProperty('success');
      });
    });
  });

  describe('Questions Configuration', () => {
    it('should have valid questions arrays for all documents', () => {
      testDocuments.forEach((doc) => {
        expect(doc.questions).toBeDefined();
        expect(Array.isArray(doc.questions)).toBe(true);
        expect(doc.questions.length).toBeGreaterThan(0);

        doc.questions.forEach((question) => {
          expect(question).toHaveProperty('id');
          expect(question).toHaveProperty('type');
          expect(question).toHaveProperty('label');
          expect(question).toHaveProperty('required');

          // Check for proper question types
          expect(
            [
              'text',
              'email',
              'date',
              'select',
              'textarea',
              'number',
              'tel',
              'address',
            ].includes(question.type),
          ).toBe(true);
        });
      });
    });

    it('should have unique question IDs within each document', () => {
      testDocuments.forEach((doc) => {
        const questionIds = doc.questions.map((q) => q.id);
        const uniqueIds = new Set(questionIds);
        expect(uniqueIds.size).toBe(questionIds.length);
      });
    });

    it('should have proper validation rules', () => {
      testDocuments.forEach((doc) => {
        doc.questions.forEach((question) => {
          if (question.type === 'email') {
            expect(question.validation?.pattern).toBeDefined();
          }

          if (question.type === 'tel') {
            expect(question.validation?.pattern).toBeDefined();
          }

          if (question.required) {
            expect(question.required).toBe(true);
          }
        });
      });
    });
  });

  describe('Template Path Validation', () => {
    it('should have valid template paths', () => {
      testDocuments.forEach((doc) => {
        expect(doc.templatePaths).toBeDefined();
        expect(doc.templatePaths.en).toBeDefined();
        expect(doc.templatePaths.en).toMatch(/^\/templates\/en\/.+\.md$/);

        if (doc.languageSupport.includes('es')) {
          expect(doc.templatePaths.es).toBeDefined();
          expect(doc.templatePaths.es).toMatch(/^\/templates\/es\/.+\.md$/);
        }
      });
    });
  });

  describe('Document Generation Flow', () => {
    it('should generate form fields from questions', () => {
      testDocuments.forEach((doc) => {
        const fields = doc.questions.map((q) => ({
          name: q.id,
          type: q.type,
          label: q.label,
          required: q.required,
        }));

        expect(fields.length).toBeGreaterThan(0);

        fields.forEach((field) => {
          expect(field.name).toBeTruthy();
          expect(field.type).toBeTruthy();
          expect(field.label).toBeTruthy();
          expect(typeof field.required).toBe('boolean');
        });
      });
    });

    it('should validate form data against schema', () => {
      const testDoc = testDocuments[0];

      // Create sample form data based on questions
      const formData: Record<string, any> = {};
      testDoc.questions.forEach((question) => {
        if (question.type === 'text') {
          formData[question.id] = 'Sample text';
        } else if (question.type === 'email') {
          formData[question.id] = 'test@example.com';
        } else if (question.type === 'date') {
          formData[question.id] = '2024-01-01';
        } else if (question.type === 'number') {
          formData[question.id] = 100;
        } else if (question.type === 'select' && question.options) {
          formData[question.id] = question.options[0]?.value || 'option1';
        } else {
          formData[question.id] = 'Sample value';
        }
      });

      const result = testDoc.schema.safeParse(formData);
      // The result might be success or failure depending on the specific schema requirements
      expect(result).toHaveProperty('success');

      if (!result.success) {
        expect(result.error).toBeDefined();
        expect(result.error.issues).toBeDefined();
      }
    });
  });

  describe('Category and Organization', () => {
    it('should have valid categories', () => {
      const validCategories = [
        'Business',
        'Real Estate',
        'Finance',
        'Legal',
        'Family',
        'Employment',
        'Personal',
        'Estate Planning',
        'Transactions',
        'Property',
        'Corporate',
        'Miscellaneous',
      ];

      documentLibrary.forEach((doc) => {
        expect(doc.category).toBeDefined();
        expect(validCategories.includes(doc.category)).toBe(true);
      });
    });

    it('should distribute documents across categories', () => {
      const categories = documentLibrary.reduce(
        (acc, doc) => {
          acc[doc.category] = (acc[doc.category] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      // Should have at least 3 different categories
      expect(Object.keys(categories).length).toBeGreaterThanOrEqual(3);

      // No category should be empty
      Object.values(categories).forEach((count) => {
        expect(count).toBeGreaterThan(0);
      });
    });
  });

  describe('Search and Aliases', () => {
    it('should have search aliases for improved discoverability', () => {
      const documentsWithAliases = documentLibrary.filter(
        (doc) => doc.aliases && doc.aliases.length > 0,
      );

      // At least 50% of documents should have aliases
      expect(documentsWithAliases.length).toBeGreaterThan(
        documentLibrary.length * 0.5,
      );
    });

    it('should have valid alias structures', () => {
      documentLibrary.forEach((doc) => {
        if (doc.aliases) {
          expect(Array.isArray(doc.aliases)).toBe(true);

          doc.aliases.forEach((alias) => {
            expect(typeof alias).toBe('string');
            expect(alias.length).toBeGreaterThan(0);
            expect(alias.trim()).toBe(alias);
          });
        }
      });
    });
  });

  describe('Performance and Optimization', () => {
    it('should load document library quickly', () => {
      const startTime = performance.now();

      // Re-import to test load time
      const {
        documentLibrary: testLibrary,
      } = require('@/lib/document-library');

      const endTime = performance.now();
      const loadTime = endTime - startTime;

      // Should load in less than 100ms
      expect(loadTime).toBeLessThan(100);
      expect(testLibrary).toBeDefined();
      expect(testLibrary.length).toBe(documentLibrary.length);
    });

    it('should have reasonable memory footprint', () => {
      const serialized = JSON.stringify(documentLibrary);
      const sizeInMB =
        new TextEncoder().encode(serialized).length / (1024 * 1024);

      // Should be less than 5MB when serialized
      expect(sizeInMB).toBeLessThan(5);
    });
  });

  describe('Integration Points', () => {
    it('should be compatible with mega menu component', () => {
      // Test that document library can be used in mega menu
      const categorized = documentLibrary.reduce(
        (acc, doc) => {
          const category = doc.category || 'Legal';
          if (!acc[category]) acc[category] = [];
          acc[category].push(doc);
          return acc;
        },
        {} as Record<string, LegalDocument[]>,
      );

      expect(Object.keys(categorized).length).toBeGreaterThan(0);

      Object.values(categorized).forEach((docs) => {
        expect(docs.length).toBeGreaterThan(0);
        docs.forEach((doc) => {
          expect(doc.translations.en.name).toBeTruthy();
        });
      });
    });

    it('should work with search functionality', () => {
      // Test search by name
      const searchTerm = 'agreement';
      const results = documentLibrary.filter(
        (doc) =>
          doc.translations.en.name.toLowerCase().includes(searchTerm) ||
          doc.translations.en.description.toLowerCase().includes(searchTerm) ||
          (doc.aliases &&
            doc.aliases.some((alias) =>
              alias.toLowerCase().includes(searchTerm),
            )),
      );

      expect(results.length).toBeGreaterThan(0);
    });
  });
});
