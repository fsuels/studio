// Tests for the unified configuration loader
import { loadDocumentConfig, normalizeJurisdiction } from '@/lib/config-loader';

// Mock environment to disable CDN for testing
const originalEnv = process.env.NODE_ENV;
beforeAll(() => {
  process.env.NODE_ENV = 'test';
  process.env.ENABLE_CDN = 'false';
});

afterAll(() => {
  process.env.NODE_ENV = originalEnv;
  delete process.env.ENABLE_CDN;
});

describe('Config Loader', () => {
  describe('normalizeJurisdiction', () => {
    it('should normalize state codes to full jurisdiction', () => {
      expect(normalizeJurisdiction('FL')).toBe('us/florida');
      expect(normalizeJurisdiction('fl')).toBe('us/florida');
      expect(normalizeJurisdiction('CA')).toBe('us/california');
      expect(normalizeJurisdiction('NY')).toBe('us/new-york');
      expect(normalizeJurisdiction('ND')).toBe('us/north-dakota');
    });

    it('should handle full jurisdiction strings', () => {
      expect(normalizeJurisdiction('us/florida')).toBe('us/florida');
      expect(normalizeJurisdiction('US/FLORIDA')).toBe('us/florida');
    });

    it('should handle state names', () => {
      expect(normalizeJurisdiction('florida')).toBe('us/florida');
      expect(normalizeJurisdiction('california')).toBe('us/california');
    });
  });

  describe('loadDocumentConfig for Vehicle Bill of Sale', () => {
    it('should load TypeScript config for Florida VBOS', async () => {
      const config = await loadDocumentConfig('vehicle-bill-of-sale', 'us/florida');
      
      expect(config).toBeDefined();
      expect(config.jurisdiction).toBe('us/florida');
      expect(config.docType).toBe('vehicle-bill-of-sale');
      expect(config.schemaVersion).toBe('1.0');
      expect(config.compliance.requiresNotary).toBe(true);
      expect(config.compliance.officialForm).toBe('HSMV 82050');
      expect(config.questions).toBeInstanceOf(Array);
      expect(config.questions.length).toBeGreaterThan(0);
    });

    it('should load TypeScript config for California VBOS', async () => {
      const config = await loadDocumentConfig('vehicle-bill-of-sale', 'us/california');
      
      expect(config).toBeDefined();
      expect(config.jurisdiction).toBe('us/california');
      expect(config.compliance.requiresNotary).toBe(false);
      expect(config.compliance.officialForm).toBeUndefined();
    });

    it('should handle state normalization in loading', async () => {
      const config = await loadDocumentConfig('vehicle-bill-of-sale', normalizeJurisdiction('TX'));
      
      expect(config).toBeDefined();
      expect(config.jurisdiction).toBe('us/texas');
      expect(config.compliance.requiresNotary).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should throw error for unsupported document type', async () => {
      await expect(
        loadDocumentConfig('unsupported-doc', 'us/florida')
      ).rejects.toThrow();
    });

    it('should throw error for unsupported jurisdiction', async () => {
      await expect(
        loadDocumentConfig('vehicle-bill-of-sale', 'uk/england')
      ).rejects.toThrow();
    });

    it('should throw error for invalid state', async () => {
      await expect(
        loadDocumentConfig('vehicle-bill-of-sale', 'us/invalid-state')
      ).rejects.toThrow();
    });
  });
});