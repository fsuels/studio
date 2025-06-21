// src/lib/versioning/__tests__/semantic-version.test.ts
import {
  parseVersion,
  isValidVersion,
  compareVersions,
  incrementVersion,
  getLatestVersion,
  sortVersions,
  satisfiesRange,
  isPrerelease,
  isStable,
  areCompatible,
  suggestNextVersion,
  formatVersion,
} from '../semantic-version';

describe('Semantic Version Utilities', () => {
  describe('parseVersion', () => {
    it('should parse valid semantic versions', () => {
      const version = parseVersion('1.2.3');
      expect(version).toEqual({
        major: 1,
        minor: 2,
        patch: 3,
        prerelease: undefined,
        build: undefined,
        raw: '1.2.3',
      });
    });

    it('should parse versions with prerelease', () => {
      const version = parseVersion('1.2.3-alpha.1');
      expect(version).toEqual({
        major: 1,
        minor: 2,
        patch: 3,
        prerelease: 'alpha.1',
        build: undefined,
        raw: '1.2.3-alpha.1',
      });
    });

    it('should parse versions with build metadata', () => {
      const version = parseVersion('1.2.3+build.123');
      expect(version).toEqual({
        major: 1,
        minor: 2,
        patch: 3,
        prerelease: undefined,
        build: 'build.123',
        raw: '1.2.3+build.123',
      });
    });

    it('should parse versions with both prerelease and build', () => {
      const version = parseVersion('1.2.3-alpha.1+build.123');
      expect(version).toEqual({
        major: 1,
        minor: 2,
        patch: 3,
        prerelease: 'alpha.1',
        build: 'build.123',
        raw: '1.2.3-alpha.1+build.123',
      });
    });

    it('should throw error for invalid versions', () => {
      expect(() => parseVersion('1.2')).toThrow(
        'Invalid semantic version: 1.2',
      );
      expect(() => parseVersion('invalid')).toThrow(
        'Invalid semantic version: invalid',
      );
      expect(() => parseVersion('1.2.3.4')).toThrow(
        'Invalid semantic version: 1.2.3.4',
      );
    });
  });

  describe('isValidVersion', () => {
    it('should validate correct semantic versions', () => {
      expect(isValidVersion('1.2.3')).toBe(true);
      expect(isValidVersion('0.0.1')).toBe(true);
      expect(isValidVersion('10.20.30')).toBe(true);
      expect(isValidVersion('1.2.3-alpha')).toBe(true);
      expect(isValidVersion('1.2.3-alpha.1')).toBe(true);
      expect(isValidVersion('1.2.3+build')).toBe(true);
      expect(isValidVersion('1.2.3-alpha+build')).toBe(true);
    });

    it('should reject invalid versions', () => {
      expect(isValidVersion('1.2')).toBe(false);
      expect(isValidVersion('1')).toBe(false);
      expect(isValidVersion('1.2.3.4')).toBe(false);
      expect(isValidVersion('invalid')).toBe(false);
      expect(isValidVersion('1.2.x')).toBe(false);
    });
  });

  describe('compareVersions', () => {
    it('should compare major versions correctly', () => {
      expect(compareVersions('2.0.0', '1.9.9')).toBe(1);
      expect(compareVersions('1.0.0', '2.0.0')).toBe(-1);
      expect(compareVersions('1.0.0', '1.0.0')).toBe(0);
    });

    it('should compare minor versions correctly', () => {
      expect(compareVersions('1.2.0', '1.1.9')).toBe(1);
      expect(compareVersions('1.1.0', '1.2.0')).toBe(-1);
    });

    it('should compare patch versions correctly', () => {
      expect(compareVersions('1.0.2', '1.0.1')).toBe(1);
      expect(compareVersions('1.0.1', '1.0.2')).toBe(-1);
    });

    it('should handle prerelease versions correctly', () => {
      expect(compareVersions('1.0.0', '1.0.0-alpha')).toBe(1);
      expect(compareVersions('1.0.0-alpha', '1.0.0')).toBe(-1);
      expect(compareVersions('1.0.0-alpha', '1.0.0-beta')).toBe(-1);
      expect(compareVersions('1.0.0-alpha.1', '1.0.0-alpha.2')).toBe(-1);
    });
  });

  describe('incrementVersion', () => {
    it('should increment major version', () => {
      expect(incrementVersion('1.2.3', 'major')).toBe('2.0.0');
      expect(incrementVersion('0.1.0', 'major')).toBe('1.0.0');
    });

    it('should increment minor version', () => {
      expect(incrementVersion('1.2.3', 'minor')).toBe('1.3.0');
      expect(incrementVersion('1.0.0', 'minor')).toBe('1.1.0');
    });

    it('should increment patch version', () => {
      expect(incrementVersion('1.2.3', 'patch')).toBe('1.2.4');
      expect(incrementVersion('1.0.0', 'patch')).toBe('1.0.1');
    });

    it('should handle prerelease increments', () => {
      expect(incrementVersion('1.0.0', 'prerelease')).toBe('1.0.1-alpha.0');
      expect(incrementVersion('1.0.0-alpha.1', 'prerelease')).toBe(
        '1.0.0-alpha.2',
      );
      expect(incrementVersion('1.0.0-beta', 'prerelease')).toBe('1.0.0-beta.1');
    });
  });

  describe('sortVersions', () => {
    it('should sort versions in ascending order', () => {
      const versions = ['1.2.3', '1.1.0', '2.0.0', '1.2.1'];
      const sorted = sortVersions(versions);
      expect(sorted).toEqual(['1.1.0', '1.2.1', '1.2.3', '2.0.0']);
    });

    it('should handle prerelease versions in sorting', () => {
      const versions = ['1.0.0', '1.0.0-alpha', '1.0.0-beta', '1.0.0-alpha.1'];
      const sorted = sortVersions(versions);
      expect(sorted).toEqual([
        '1.0.0-alpha',
        '1.0.0-alpha.1',
        '1.0.0-beta',
        '1.0.0',
      ]);
    });
  });

  describe('getLatestVersion', () => {
    it('should return the latest version', () => {
      const versions = ['1.2.3', '1.1.0', '2.0.0', '1.2.1'];
      expect(getLatestVersion(versions)).toBe('2.0.0');
    });

    it('should return null for empty array', () => {
      expect(getLatestVersion([])).toBe(null);
    });
  });

  describe('satisfiesRange', () => {
    it('should handle wildcard range', () => {
      expect(satisfiesRange('1.2.3', '*')).toBe(true);
    });

    it('should handle >= range', () => {
      expect(satisfiesRange('1.2.3', '>=1.2.0')).toBe(true);
      expect(satisfiesRange('1.1.0', '>=1.2.0')).toBe(false);
    });

    it('should handle > range', () => {
      expect(satisfiesRange('1.2.3', '>1.2.0')).toBe(true);
      expect(satisfiesRange('1.2.0', '>1.2.0')).toBe(false);
    });

    it('should handle tilde range', () => {
      expect(satisfiesRange('1.2.3', '~1.2.0')).toBe(true);
      expect(satisfiesRange('1.3.0', '~1.2.0')).toBe(false);
    });

    it('should handle caret range', () => {
      expect(satisfiesRange('1.2.3', '^1.2.0')).toBe(true);
      expect(satisfiesRange('2.0.0', '^1.2.0')).toBe(false);
    });

    it('should handle exact match', () => {
      expect(satisfiesRange('1.2.3', '1.2.3')).toBe(true);
      expect(satisfiesRange('1.2.4', '1.2.3')).toBe(false);
    });
  });

  describe('isPrerelease', () => {
    it('should identify prerelease versions', () => {
      expect(isPrerelease('1.0.0-alpha')).toBe(true);
      expect(isPrerelease('1.0.0-beta.1')).toBe(true);
      expect(isPrerelease('1.0.0')).toBe(false);
    });
  });

  describe('isStable', () => {
    it('should identify stable versions', () => {
      expect(isStable('1.0.0')).toBe(true);
      expect(isStable('1.0.0-alpha')).toBe(false);
    });
  });

  describe('areCompatible', () => {
    it('should check major compatibility', () => {
      expect(areCompatible('1.2.3', '1.5.0', 'major')).toBe(true);
      expect(areCompatible('1.2.3', '2.0.0', 'major')).toBe(false);
    });

    it('should check minor compatibility', () => {
      expect(areCompatible('1.2.3', '1.2.5', 'minor')).toBe(true);
      expect(areCompatible('1.2.3', '1.3.0', 'minor')).toBe(false);
    });

    it('should check patch compatibility', () => {
      expect(areCompatible('1.2.3', '1.2.3', 'patch')).toBe(true);
      expect(areCompatible('1.2.3', '1.2.4', 'patch')).toBe(false);
    });
  });

  describe('suggestNextVersion', () => {
    it('should suggest major increment for breaking changes', () => {
      expect(suggestNextVersion('1.2.3', true, false, false)).toBe('2.0.0');
    });

    it('should suggest minor increment for new features', () => {
      expect(suggestNextVersion('1.2.3', false, true, false)).toBe('1.3.0');
    });

    it('should suggest patch increment for bug fixes', () => {
      expect(suggestNextVersion('1.2.3', false, false, true)).toBe('1.2.4');
    });

    it('should default to patch increment for no changes', () => {
      expect(suggestNextVersion('1.2.3', false, false, false)).toBe('1.2.4');
    });
  });

  describe('formatVersion', () => {
    it('should format version with prefix', () => {
      expect(formatVersion('1.2.3', { includePrefix: true })).toBe('v1.2.3');
    });

    it('should format version in short form', () => {
      expect(formatVersion('1.2.3', { short: true })).toBe('1.2');
    });

    it('should format version normally', () => {
      expect(formatVersion('1.2.3')).toBe('1.2.3');
    });
  });
});
