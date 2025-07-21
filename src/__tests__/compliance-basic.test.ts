// Basic compliance test to verify the new version metadata
import { getVehicleBillOfSaleCompliance } from '@/lib/compliance-helper';

describe('Compliance Configuration', () => {
  it('should load compliance for Florida', () => {
    const compliance = getVehicleBillOfSaleCompliance('FL');
    
    expect(compliance).toBeDefined();
    expect(compliance?.schemaVersion).toBe('1.0');
    expect(compliance?.lastUpdated).toBe('2025-01-18');
    expect(compliance?.requiresNotary).toBe(true);
  });

  it('should load compliance for California', () => {
    const compliance = getVehicleBillOfSaleCompliance('CA');
    
    expect(compliance).toBeDefined();
    expect(compliance?.schemaVersion).toBe('1.0');
    expect(compliance?.lastUpdated).toBe('2025-01-18');
    expect(compliance?.requiresNotary).toBe(false);
  });

  it('should handle invalid state gracefully', () => {
    const compliance = getVehicleBillOfSaleCompliance('XX');
    expect(compliance).toBeNull();
  });
});