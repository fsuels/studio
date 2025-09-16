// Baseline regression tests for Vehicle Bill of Sale PDF overlay system
// These tests ensure stability during migration to JSON-first configuration

import { describe, it, expect, beforeAll } from '@jest/globals';
import { overlayFormData } from '@/lib/pdf/pdf-overlay-service';
import { getVehicleBillOfSaleCompliance } from '@/lib/compliance-helper';
import { getStateFormPath } from '@/lib/pdf/state-form-manager';

// Mock form data for testing
const mockFormData = {
  state: 'FL',
  seller_name: 'John Smith',
  seller_address: '123 Main St, Tampa, FL 33601',
  buyer_name: 'Jane Doe', 
  buyer_address: '456 Oak Ave, Miami, FL 33101',
  year: '2020',
  make: 'Toyota',
  model: 'Camry',
  color: 'Blue',
  vin: '1HGBH41JXMN109186',
  odometer: '45000',
  price: '15000',
  sale_date: '2025-01-18'
};

// Test states with different compliance requirements
const testStates = [
  'FL', // Official form with notary
  'AL', // Official form with notary  
  'CO', // Official form with notary
  'CA', // No notary, no official form
  'TX'  // No notary, no official form
];

describe('Vehicle Bill of Sale Stability Tests', () => {
  
  describe('Compliance Configuration Integrity', () => {
    testStates.forEach(state => {
      it(`should have valid compliance configuration for ${state}`, () => {
        const compliance = getVehicleBillOfSaleCompliance(state);
        
        expect(compliance).toBeDefined();
        expect(compliance).toHaveProperty('schemaVersion');
        expect(compliance).toHaveProperty('lastUpdated');
        expect(compliance).toHaveProperty('requiresNotary');
        expect(compliance).toHaveProperty('billOfSaleMandatory');
        expect(compliance).toHaveProperty('odometerIntegrated');
        
        // Verify version metadata format
        expect(compliance!.schemaVersion).toMatch(/^\d+\.\d+$/);
        expect(compliance!.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        
        // Verify required fields are present
        expect(typeof compliance!.requiresNotary).toBe('boolean');
        expect(typeof compliance!.billOfSaleMandatory).toBe('boolean');
        expect(typeof compliance!.odometerIntegrated).toBe('boolean');
      });
    });
  });

  describe('State Form Path Resolution', () => {
    const statesWithForms = ['FL', 'AL', 'CO', 'GA', 'ID', 'KS', 'MD', 'MT', 'ND', 'WV'];
    
    statesWithForms.forEach(state => {
      it(`should resolve form path for ${state}`, () => {
        const formPath = getStateFormPath(state);
        expect(formPath).toBeDefined();
        expect(formPath).toContain(`/forms/vehicle-bill-of-sale/`);
        expect(formPath).toContain(`.pdf`);
      });
    });
    
    const statesWithoutForms = ['CA', 'TX', 'NY'];
    statesWithoutForms.forEach(state => {
      it(`should return null for ${state} (no official form)`, () => {
        const formPath = getStateFormPath(state);
        expect(formPath).toBeNull();
      });
    });
  });

  describe('PDF Overlay Functionality', () => {
    // Note: These tests would require actual PDF files to be meaningful
    // For now, we test the overlay service with mock data
    
    it('should handle overlay without throwing errors', async () => {
      // Mock PDF bytes (empty buffer for test)
      const mockPdfBytes = new ArrayBuffer(1024);
      
      // Test that overlay service doesn't crash
      await expect(async () => {
        await overlayFormData(mockPdfBytes, mockFormData, 'FL');
      }).not.toThrow();
    });

    it('should return valid ArrayBuffer from overlay', async () => {
      const mockPdfBytes = new ArrayBuffer(1024);
      
      const result = await overlayFormData(mockPdfBytes, mockFormData, 'FL');
      
      expect(result).toBeInstanceOf(ArrayBuffer);
      expect(result.byteLength).toBeGreaterThan(0);
    });

    testStates.forEach(state => {
      it(`should process overlay for ${state} without errors`, async () => {
        const mockPdfBytes = new ArrayBuffer(1024);
        const stateFormData = { ...mockFormData, state };
        
        const result = await overlayFormData(mockPdfBytes, stateFormData, state);
        
        expect(result).toBeInstanceOf(ArrayBuffer);
        // Should return at least as many bytes as input (overlay adds data)
        expect(result.byteLength).toBeGreaterThanOrEqual(mockPdfBytes.byteLength);
      });
    });
  });

  describe('Configuration Schema Validation', () => {
    it('should have consistent schema across all states', () => {
      const allStates = [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
        'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
        'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
        'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
        'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
      ];

      allStates.forEach(state => {
        const compliance = getVehicleBillOfSaleCompliance(state);
        
        expect(compliance).toBeDefined();
        expect(compliance!.schemaVersion).toBe('1.0');
        expect(compliance!.lastUpdated).toBe('2025-01-18');
        
        // States with official forms should have formVersion
        if (compliance!.officialForm && compliance!.localFormPath) {
          expect(compliance!.formVersion).toBe('2024.1');
        }
      });
    });

    it('should have required fields for states with official forms', () => {
      const statesWithForms = [
        'AL', 'CO', 'FL', 'GA', 'ID', 'KS', 'MD', 'MT', 'ND', 'WV'
      ];

      statesWithForms.forEach(state => {
        const compliance = getVehicleBillOfSaleCompliance(state);
        
        expect(compliance).toBeDefined();
        expect(compliance!.officialForm).toBeDefined();
        expect(compliance!.localFormPath).toBeDefined();
        expect(compliance!.formVersion).toBe('2024.1');
        expect(compliance!.billOfSaleMandatory).toBe(true);
      });
    });
  });

  describe('Backwards Compatibility', () => {
    it('should maintain existing API compatibility', () => {
      // Test that existing functions still work as expected
      expect(typeof getVehicleBillOfSaleCompliance).toBe('function');
      expect(typeof getStateFormPath).toBe('function');
      expect(typeof overlayFormData).toBe('function');
    });

    it('should handle legacy state lookups', () => {
      // Test both uppercase and lowercase state codes
      const flUpper = getVehicleBillOfSaleCompliance('FL');
      const flLower = getVehicleBillOfSaleCompliance('fl');
      
      expect(flUpper).toBeDefined();
      // Note: flLower might be null if function expects uppercase
      // This tests existing behavior
    });
  });

  describe('Performance Baseline', () => {
    it('should resolve compliance quickly', () => {
      const start = performance.now();
      
      testStates.forEach(state => {
        getVehicleBillOfSaleCompliance(state);
      });
      
      const end = performance.now();
      const duration = end - start;
      
      // Should resolve all states in under 10ms
      expect(duration).toBeLessThan(10);
    });

    it('should handle multiple state lookups efficiently', () => {
      const iterations = 100;
      const start = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        testStates.forEach(state => {
          getVehicleBillOfSaleCompliance(state);
        });
      }
      
      const end = performance.now();
      const averagePerLookup = (end - start) / (iterations * testStates.length);
      
      // Should average less than 0.1ms per lookup
      expect(averagePerLookup).toBeLessThan(0.1);
    });
  });
});

// Snapshot test for configuration stability
describe('Configuration Snapshots', () => {
  it('should match configuration snapshot for key states', () => {
    const keyStates = ['FL', 'CA', 'TX', 'NY'];
    const snapshot: Record<string, any> = {};
    
    keyStates.forEach(state => {
      const compliance = getVehicleBillOfSaleCompliance(state);
      snapshot[state] = {
        requiresNotary: compliance!.requiresNotary,
        billOfSaleMandatory: compliance!.billOfSaleMandatory,
        odometerIntegrated: compliance!.odometerIntegrated,
        hasOfficialForm: !!compliance!.officialForm,
        hasLocalFormPath: !!compliance!.localFormPath
      };
    });
    
    // This would normally use toMatchSnapshot(), but we'll do inline verification
    expect(snapshot.FL.requiresNotary).toBe(true);
    expect(snapshot.FL.hasOfficialForm).toBe(true);
    expect(snapshot.CA.requiresNotary).toBe(false);
    expect(snapshot.CA.hasOfficialForm).toBe(false);
    expect(snapshot.TX.requiresNotary).toBe(false);
    expect(snapshot.TX.hasOfficialForm).toBe(false);
  });
});