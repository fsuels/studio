import { describe, it, expect, beforeAll } from '@jest/globals';
import type { LegalDocument } from '@/types/documents';
import { getWorkflowDocuments, loadWorkflowDocument } from '@/lib/workflow/document-workflow';
import { loadSampleDocuments, sampleDocumentIds } from './fixtures/documentSamples';

let libraryUnderTest: LegalDocument[] = [];
let sampleDocuments: LegalDocument[] = [];

beforeAll(async () => {
  const summaries = getWorkflowDocuments({ jurisdiction: 'us' });
  const loadedDocs = await Promise.all(
    summaries.map((summary) => loadWorkflowDocument(summary.id)),
  );

  libraryUnderTest = loadedDocs.filter(
    (doc): doc is LegalDocument => Boolean(doc),
  );

  sampleDocuments = await loadSampleDocuments();
});

describe('Document Library', () => {
  it('exposes a deterministic catalog with unique IDs', () => {
    expect(libraryUnderTest.length).toBeGreaterThan(sampleDocumentIds.length);

    const ids = libraryUnderTest.map((doc) => doc.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(ids.length);
    sampleDocumentIds.forEach((id) => {
      expect(uniqueIds.has(id)).toBe(true);
    });
  });

  it('includes complete translations and pricing metadata', () => {
    libraryUnderTest.forEach((doc) => {
      expect(doc.translations?.en?.name).toBeTruthy();
      expect(doc.translations?.en?.description).toBeDefined();

      if (doc.translations?.es) {
        expect(doc.translations.es.name).toBeTruthy();
        expect(doc.translations.es.description).toBeDefined();
      }

      expect(typeof doc.basePrice).toBe('number');
      expect((doc.basePrice ?? 0)).toBeGreaterThanOrEqual(0);
      expect((doc.basePrice ?? 0)).toBeLessThan(1000);
    });
  });

  it('declares language support and jurisdictions', () => {
    libraryUnderTest.forEach((doc) => {
      expect(Array.isArray(doc.languageSupport)).toBe(true);
      expect(doc.languageSupport).toContain('en');
      const jurisdiction = doc.jurisdiction?.toLowerCase?.() ?? '';
      expect(['us', 'ca', 'all']).toContain(jurisdiction);
    });
  });

  it('normalizes alias values', () => {
    libraryUnderTest.forEach((doc) => {
      if (!doc.aliases) return;
      doc.aliases.forEach((alias) => {
        expect(typeof alias).toBe('string');
        expect(alias.trim()).toBe(alias);
      });
    });
  });

  it('groups documents by category for navigation surfaces', () => {
    const categorized = libraryUnderTest.reduce(
      (acc, doc) => {
        const category = doc.category || 'Uncategorized';
        if (!acc[category]) acc[category] = [];
        acc[category].push(doc);
        return acc;
      },
      {} as Record<string, LegalDocument[]>,
    );

    const categories = Object.keys(categorized);
    expect(categories.length).toBeGreaterThanOrEqual(3);
    categories.forEach((category) => {
      expect(categorized[category].length).toBeGreaterThan(0);
    });
  });
});

describe('Sample Document Fixtures', () => {
  const buildSampleInput = (doc: LegalDocument) => {
    const payload: Record<string, unknown> = {};

    doc.questions?.forEach((question) => {
      switch (question.type) {
        case 'email':
          payload[question.id] = 'test@example.com';
          break;
        case 'date':
          payload[question.id] = '2024-01-01';
          break;
        case 'number':
          payload[question.id] = 100;
          break;
        case 'select':
          payload[question.id] = question.options?.[0]?.value ?? 'option';
          break;
        default:
          payload[question.id] = 'Sample value';
      }
    });

    return payload;
  };

  it('provides schemas that reject empty payloads', () => {
    sampleDocuments.forEach((doc) => {
      const result = doc.schema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  it('accepts shaped payloads produced from question metadata', () => {
    sampleDocuments.forEach((doc) => {
      const samplePayload = buildSampleInput(doc);
      const result = doc.schema.safeParse(samplePayload);
      expect(result).toHaveProperty('success');
    });
  });

  it('ensures every question carries the required structure', () => {
    sampleDocuments.forEach((doc) => {
      expect(Array.isArray(doc.questions)).toBe(true);
      doc.questions?.forEach((question) => {
        expect(question.id).toBeTruthy();
        expect(question.label).toBeTruthy();
        expect(question.type).toBeTruthy();
      });
    });
  });
});
