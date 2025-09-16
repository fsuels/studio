// Tests for environment configuration
import { 
  getEnvironmentConfig, 
  getAssetUrl, 
  getConfigUrl, 
  validateEnvironment,
  createTestEnvironment 
} from '@/lib/config/environment';

describe('Environment Configuration', () => {
  describe('getEnvironmentConfig', () => {
    it('should return default development config', () => {
      const config = getEnvironmentConfig();
      
      expect(config.isDevelopment).toBeDefined();
      expect(config.assetCDN).toBeDefined();
      expect(config.enableCDN).toBeDefined();
      expect(config.fallbackToTypeScript).toBeDefined();
    });

    it('should have fallback TypeScript enabled by default', () => {
      const config = getEnvironmentConfig();
      expect(config.fallbackToTypeScript).toBe(true);
    });
  });

  describe('URL helpers', () => {
    it('should generate asset URLs correctly', () => {
      const url = getAssetUrl('test/path/file.json');
      expect(url).toBeDefined();
      expect(typeof url).toBe('string');
    });

    it('should generate config URLs correctly', () => {
      const url = getConfigUrl('us/florida', 'vehicle-bill-of-sale');
      expect(url).toContain('us/florida');
      expect(url).toContain('vehicle-bill-of-sale');
      expect(url).toContain('config.json');
    });

    it('should handle leading slashes in asset paths', () => {
      const url1 = getAssetUrl('/test/file.json');
      const url2 = getAssetUrl('test/file.json');
      
      // Should produce the same result regardless of leading slash
      expect(url1).toBe(url2);
    });
  });

  describe('environment validation', () => {
    it('should validate current environment', () => {
      const validation = validateEnvironment();
      
      expect(validation).toHaveProperty('valid');
      expect(validation).toHaveProperty('errors');
      expect(Array.isArray(validation.errors)).toBe(true);
    });
  });

  describe('test environment utilities', () => {
    it('should allow test environment overrides', () => {
      const cleanup = createTestEnvironment({
        assetCDN: 'https://test.example.com',
        enableCDN: true
      });

      const config = getEnvironmentConfig();
      expect(config.assetCDN).toBe('https://test.example.com');
      expect(config.enableCDN).toBe(true);

      // Cleanup
      cleanup();
    });
  });
});