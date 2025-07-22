/**
 * Tests for dynamic question generation in config-loader
 * 
 * Tests the integration between config-loader and question-generator
 * to ensure questions are automatically generated when missing.
 */

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { loadDocumentConfig, loadQuestionsOnly } from '../index';
import * as questionGenerator from '@/lib/question-generator';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch as jest.MockedFunction<typeof fetch>;

// Mock the question generator
jest.mock('@/lib/question-generator');
const mockedGenerateQuestions = jest.mocked(questionGenerator.generateQuestions);

describe('config-loader dynamic question generation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock environment config to enable CDN
    jest.doMock('@/lib/config/environment', () => ({
      getEnvironmentConfig: () => ({
        enableCDN: true,
        fallbackToTypeScript: false
      }),
      getConfigUrl: (jurisdiction: string, docType: string) => 
        `https://cdn.example.com/configs/${jurisdiction}/${docType}/config.json`
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('loadDocumentConfig with dynamic questions', () => {
    it('should generate questions when overlay exists but questions are missing', async () => {
      const mockConfig = {
        jurisdiction: 'us/florida',
        docType: 'vehicle-bill-of-sale',
        schemaVersion: '1.0',
        lastUpdated: '2025-01-22',
        compliance: {
          requiresNotary: true,
          billOfSaleMandatory: true,
          odometerIntegrated: true
        },
        overlayConfig: {
          pdfPath: '/test.pdf',
          fieldMapping: {
            'seller_name': { fieldName: 'Sellers Name' },
            'buyer_name': { fieldName: 'Buyers Name' }
          }
        }
        // No questions array - should be auto-generated
      };

      const mockGeneratedQuestions = [
        {
          id: 'seller_name',
          label: 'Seller Name',
          type: 'text' as const,
          required: true
        },
        {
          id: 'buyer_name', 
          label: 'Buyer Name',
          type: 'text' as const,
          required: true
        }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockConfig)
      } as Response);

      mockedGenerateQuestions.mockReturnValue(mockGeneratedQuestions);

      const result = await loadDocumentConfig('vehicle-bill-of-sale', 'us/florida');

      expect(mockedGenerateQuestions).toHaveBeenCalledWith(mockConfig.overlayConfig);
      expect(result.questions).toEqual(mockGeneratedQuestions);
      expect(result.jurisdiction).toBe('us/florida');
      expect(result.docType).toBe('vehicle-bill-of-sale');
    });

    it('should not generate questions when they already exist', async () => {
      const existingQuestions = [
        {
          id: 'custom_field',
          label: 'Custom Field', 
          type: 'text' as const,
          required: false
        }
      ];

      const mockConfig = {
        jurisdiction: 'us/california',
        docType: 'vehicle-bill-of-sale',
        schemaVersion: '1.0',
        lastUpdated: '2025-01-22',
        questions: existingQuestions,
        compliance: {
          requiresNotary: false,
          billOfSaleMandatory: true,
          odometerIntegrated: true
        },
        overlayConfig: {
          pdfPath: '/test.pdf',
          fieldMapping: {
            'seller_name': { fieldName: 'Sellers Name' }
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockConfig)
      } as Response);

      const result = await loadDocumentConfig('vehicle-bill-of-sale', 'us/california');

      expect(mockedGenerateQuestions).not.toHaveBeenCalled();
      expect(result.questions).toEqual(existingQuestions);
    });

    it('should not generate questions when no overlay exists', async () => {
      const mockConfig = {
        jurisdiction: 'us/texas',
        docType: 'power-of-attorney',
        schemaVersion: '1.0',
        lastUpdated: '2025-01-22',
        compliance: {
          requiresNotary: true,
          billOfSaleMandatory: false,
          odometerIntegrated: false
        }
        // No overlayConfig and no questions
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockConfig)
      } as Response);

      const result = await loadDocumentConfig('power-of-attorney', 'us/texas');

      expect(mockedGenerateQuestions).not.toHaveBeenCalled();
      expect(result.questions).toBeUndefined();
    });

    it('should handle Florida overlay with coordinates and fieldMapping', async () => {
      const mockConfig = {
        jurisdiction: 'us/florida',
        docType: 'vehicle-bill-of-sale',
        schemaVersion: '1.0',
        lastUpdated: '2025-01-22',
        compliance: {
          requiresNotary: true,
          billOfSaleMandatory: true,
          odometerIntegrated: true
        },
        overlayConfig: {
          pdfPath: '/public/forms/vehicle-bill-of-sale/florida/HSMV-82050.pdf',
          fieldMapping: {
            'seller_name': { fieldName: 'Sellers Printed Name' },
            'buyer_name': { fieldName: 'Purchasers Printed Name' },
            'year': { fieldName: 'Year' },
            'make': { fieldName: 'MakeManufacturer' }
          },
          coordinates: {
            'seller_phone': { page: 0, x: 425, y: 618, fontSize: 10 },
            'buyer_phone': { page: 0, x: 425, y: 518, fontSize: 10 }
          }
        }
      };

      const mockGeneratedQuestions = [
        { id: 'seller_name', label: 'Seller Name', type: 'text' as const, required: true },
        { id: 'buyer_name', label: 'Buyer Name', type: 'text' as const, required: true },
        { id: 'year', label: 'Year', type: 'text' as const, required: true },
        { id: 'make', label: 'Make', type: 'text' as const, required: true },
        { id: 'seller_phone', label: 'Seller Phone', type: 'tel' as const, required: false },
        { id: 'buyer_phone', label: 'Buyer Phone', type: 'tel' as const, required: false }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockConfig)
      } as Response);

      mockedGenerateQuestions.mockReturnValue(mockGeneratedQuestions);

      const result = await loadDocumentConfig('vehicle-bill-of-sale', 'us/florida');

      expect(mockedGenerateQuestions).toHaveBeenCalledWith(mockConfig.overlayConfig);
      expect(result.questions).toEqual(mockGeneratedQuestions);
      expect(result.questions).toHaveLength(6);
    });
  });

  describe('loadQuestionsOnly with dynamic generation', () => {
    it('should return generated questions from overlay', async () => {
      const mockConfig = {
        jurisdiction: 'us/colorado',
        docType: 'vehicle-bill-of-sale', 
        schemaVersion: '1.0',
        lastUpdated: '2025-01-22',
        compliance: {
          requiresNotary: true,
          billOfSaleMandatory: true,
          odometerIntegrated: true
        },
        overlayConfig: {
          pdfPath: '/test.pdf',
          coordinates: {
            'seller_name': { page: 0, x: 100, y: 200, fontSize: 10 },
            'county': { page: 0, x: 150, y: 250, fontSize: 10 }
          }
        }
      };

      const mockGeneratedQuestions = [
        { id: 'seller_name', label: 'Seller Name', type: 'text' as const, required: true },
        { id: 'county', label: 'County', type: 'text' as const, required: false }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockConfig)
      } as Response);

      mockedGenerateQuestions.mockReturnValue(mockGeneratedQuestions);

      const questions = await loadQuestionsOnly('vehicle-bill-of-sale', 'us/colorado');

      expect(questions).toEqual(mockGeneratedQuestions);
      expect(questions).toHaveLength(2);
    });

    it('should return empty array when no questions and no overlay', async () => {
      const mockConfig = {
        jurisdiction: 'us/nevada',
        docType: 'basic-contract',
        schemaVersion: '1.0',
        lastUpdated: '2025-01-22',
        compliance: {
          requiresNotary: false,
          billOfSaleMandatory: false,
          odometerIntegrated: false
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockConfig)
      } as Response);

      const questions = await loadQuestionsOnly('basic-contract', 'us/nevada');

      expect(mockedGenerateQuestions).not.toHaveBeenCalled();
      expect(questions).toEqual([]);
    });
  });

  describe('error handling', () => {
    it('should handle question generation errors gracefully', async () => {
      const mockConfig = {
        jurisdiction: 'us/georgia',
        docType: 'vehicle-bill-of-sale',
        schemaVersion: '1.0',
        lastUpdated: '2025-01-22',
        compliance: {
          requiresNotary: true,
          billOfSaleMandatory: true,
          odometerIntegrated: true
        },
        overlayConfig: {
          pdfPath: '/test.pdf',
          fieldMapping: {
            'invalid_field': { fieldName: 'Invalid Field' }
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockConfig)
      } as Response);

      // Mock question generator to throw error
      mockedGenerateQuestions.mockImplementation(() => {
        throw new Error('Question generation failed');
      });

      await expect(loadDocumentConfig('vehicle-bill-of-sale', 'us/georgia'))
        .rejects.toThrow('Question generation failed');
    });
  });

  describe('logging integration', () => {
    it('should log when auto-generating questions', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const mockConfig = {
        jurisdiction: 'us/idaho',
        docType: 'vehicle-bill-of-sale',
        schemaVersion: '1.0',
        lastUpdated: '2025-01-22',
        compliance: {
          requiresNotary: true,
          billOfSaleMandatory: true,
          odometerIntegrated: true
        },
        overlayConfig: {
          pdfPath: '/test.pdf',
          fieldMapping: {
            'seller_name': { fieldName: 'Sellers Name' }
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockConfig)
      } as Response);

      mockedGenerateQuestions.mockReturnValue([
        { id: 'seller_name', label: 'Seller Name', type: 'text' as const, required: true }
      ]);

      await loadDocumentConfig('vehicle-bill-of-sale', 'us/idaho');

      expect(consoleSpy).toHaveBeenCalledWith(
        '🔧 JSON CONFIG: Auto-generating questions from overlay for vehicle-bill-of-sale/us/idaho'
      );

      consoleSpy.mockRestore();
    });
  });
});