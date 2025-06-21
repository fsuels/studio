// src/lib/versioning/semantic-version.ts
import type { SemanticVersion } from '@/types/marketplace';

/**
 * Semantic versioning utilities for template marketplace
 * Implements semver.org specification
 */

export interface ParsedVersion {
  major: number;
  minor: number;
  patch: number;
  prerelease?: string;
  build?: string;
  raw: string;
}

/**
 * Regular expression for semantic version validation
 * Supports: 1.2.3, 1.2.3-alpha.1, 1.2.3+build.1, 1.2.3-alpha.1+build.1
 */
const SEMVER_REGEX =
  /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;

/**
 * Parse a semantic version string into components
 */
export function parseVersion(version: SemanticVersion): ParsedVersion {
  const match = version.match(SEMVER_REGEX);

  if (!match) {
    throw new Error(`Invalid semantic version: ${version}`);
  }

  const [, major, minor, patch, prerelease, build] = match;

  return {
    major: parseInt(major, 10),
    minor: parseInt(minor, 10),
    patch: parseInt(patch, 10),
    prerelease: prerelease || undefined,
    build: build || undefined,
    raw: version,
  };
}

/**
 * Validate if a string is a valid semantic version
 */
export function isValidVersion(version: string): version is SemanticVersion {
  return SEMVER_REGEX.test(version);
}

/**
 * Compare two semantic versions
 * Returns: -1 if a < b, 0 if a === b, 1 if a > b
 */
export function compareVersions(
  a: SemanticVersion,
  b: SemanticVersion,
): number {
  const versionA = parseVersion(a);
  const versionB = parseVersion(b);

  // Compare major version
  if (versionA.major !== versionB.major) {
    return versionA.major < versionB.major ? -1 : 1;
  }

  // Compare minor version
  if (versionA.minor !== versionB.minor) {
    return versionA.minor < versionB.minor ? -1 : 1;
  }

  // Compare patch version
  if (versionA.patch !== versionB.patch) {
    return versionA.patch < versionB.patch ? -1 : 1;
  }

  // Compare prerelease
  return comparePrereleases(versionA.prerelease, versionB.prerelease);
}

/**
 * Compare prerelease versions
 */
function comparePrereleases(a?: string, b?: string): number {
  // No prerelease > prerelease
  if (!a && !b) return 0;
  if (!a && b) return 1;
  if (a && !b) return -1;

  // Both have prereleases - compare lexically
  const partsA = a!.split('.');
  const partsB = b!.split('.');
  const maxLength = Math.max(partsA.length, partsB.length);

  for (let i = 0; i < maxLength; i++) {
    const partA = partsA[i];
    const partB = partsB[i];

    if (partA === undefined) return -1;
    if (partB === undefined) return 1;

    // Try to parse as numbers
    const numA = parseInt(partA, 10);
    const numB = parseInt(partB, 10);

    if (!isNaN(numA) && !isNaN(numB)) {
      if (numA !== numB) return numA < numB ? -1 : 1;
    } else {
      // String comparison
      if (partA !== partB) return partA < partB ? -1 : 1;
    }
  }

  return 0;
}

/**
 * Sort versions in ascending order
 */
export function sortVersions(versions: SemanticVersion[]): SemanticVersion[] {
  return [...versions].sort(compareVersions);
}

/**
 * Find the latest version from an array
 */
export function getLatestVersion(
  versions: SemanticVersion[],
): SemanticVersion | null {
  if (versions.length === 0) return null;
  return sortVersions(versions)[versions.length - 1];
}

/**
 * Increment version based on type
 */
export function incrementVersion(
  version: SemanticVersion,
  type: 'major' | 'minor' | 'patch' | 'prerelease',
): SemanticVersion {
  const parsed = parseVersion(version);

  switch (type) {
    case 'major':
      return `${parsed.major + 1}.0.0`;

    case 'minor':
      return `${parsed.major}.${parsed.minor + 1}.0`;

    case 'patch':
      return `${parsed.major}.${parsed.minor}.${parsed.patch + 1}`;

    case 'prerelease':
      if (parsed.prerelease) {
        // Try to increment existing prerelease number
        const match = parsed.prerelease.match(/^(.+?)\.?(\d+)$/);
        if (match) {
          const [, identifier, num] = match;
          return `${parsed.major}.${parsed.minor}.${parsed.patch}-${identifier}.${parseInt(num, 10) + 1}`;
        } else {
          return `${parsed.major}.${parsed.minor}.${parsed.patch}-${parsed.prerelease}.1`;
        }
      } else {
        return `${parsed.major}.${parsed.minor}.${parsed.patch + 1}-alpha.0`;
      }

    default:
      throw new Error(`Invalid increment type: ${type}`);
  }
}

/**
 * Check if version satisfies a range
 */
export function satisfiesRange(
  version: SemanticVersion,
  range: string,
): boolean {
  // Basic implementation - can be extended with more complex range syntax
  if (range === '*') return true;
  if (range.startsWith('>=')) {
    const targetVersion = range.slice(2).trim() as SemanticVersion;
    return compareVersions(version, targetVersion) >= 0;
  }
  if (range.startsWith('>')) {
    const targetVersion = range.slice(1).trim() as SemanticVersion;
    return compareVersions(version, targetVersion) > 0;
  }
  if (range.startsWith('<=')) {
    const targetVersion = range.slice(2).trim() as SemanticVersion;
    return compareVersions(version, targetVersion) <= 0;
  }
  if (range.startsWith('<')) {
    const targetVersion = range.slice(1).trim() as SemanticVersion;
    return compareVersions(version, targetVersion) < 0;
  }
  if (range.startsWith('~')) {
    // Tilde range: ~1.2.3 := >=1.2.3 <1.3.0
    const targetVersion = range.slice(1).trim() as SemanticVersion;
    const parsed = parseVersion(targetVersion);
    const min = targetVersion;
    const max = `${parsed.major}.${parsed.minor + 1}.0` as SemanticVersion;
    return (
      compareVersions(version, min) >= 0 && compareVersions(version, max) < 0
    );
  }
  if (range.startsWith('^')) {
    // Caret range: ^1.2.3 := >=1.2.3 <2.0.0
    const targetVersion = range.slice(1).trim() as SemanticVersion;
    const parsed = parseVersion(targetVersion);
    const min = targetVersion;
    const max = `${parsed.major + 1}.0.0` as SemanticVersion;
    return (
      compareVersions(version, min) >= 0 && compareVersions(version, max) < 0
    );
  }

  // Exact match
  return compareVersions(version, range as SemanticVersion) === 0;
}

/**
 * Check if a version is a prerelease
 */
export function isPrerelease(version: SemanticVersion): boolean {
  const parsed = parseVersion(version);
  return !!parsed.prerelease;
}

/**
 * Check if a version is stable (not a prerelease)
 */
export function isStable(version: SemanticVersion): boolean {
  return !isPrerelease(version);
}

/**
 * Get the stable versions from an array
 */
export function getStableVersions(
  versions: SemanticVersion[],
): SemanticVersion[] {
  return versions.filter(isStable);
}

/**
 * Get the prerelease versions from an array
 */
export function getPrereleaseVersions(
  versions: SemanticVersion[],
): SemanticVersion[] {
  return versions.filter(isPrerelease);
}

/**
 * Check if two versions are compatible
 */
export function areCompatible(
  version1: SemanticVersion,
  version2: SemanticVersion,
  compatibilityLevel: 'major' | 'minor' | 'patch' = 'minor',
): boolean {
  const v1 = parseVersion(version1);
  const v2 = parseVersion(version2);

  switch (compatibilityLevel) {
    case 'major':
      return v1.major === v2.major;
    case 'minor':
      return v1.major === v2.major && v1.minor === v2.minor;
    case 'patch':
      return (
        v1.major === v2.major && v1.minor === v2.minor && v1.patch === v2.patch
      );
    default:
      return false;
  }
}

/**
 * Get the next suggested version based on changes
 */
export function suggestNextVersion(
  currentVersion: SemanticVersion,
  hasBreakingChanges: boolean,
  hasNewFeatures: boolean,
  hasBugFixes: boolean,
): SemanticVersion {
  if (hasBreakingChanges) {
    return incrementVersion(currentVersion, 'major');
  }
  if (hasNewFeatures) {
    return incrementVersion(currentVersion, 'minor');
  }
  if (hasBugFixes) {
    return incrementVersion(currentVersion, 'patch');
  }

  // No changes - suggest patch increment
  return incrementVersion(currentVersion, 'patch');
}

/**
 * Format version for display
 */
export function formatVersion(
  version: SemanticVersion,
  options?: {
    includePrefix?: boolean;
    short?: boolean;
  },
): string {
  const { includePrefix = false, short = false } = options || {};

  if (short) {
    const parsed = parseVersion(version);
    return `${parsed.major}.${parsed.minor}`;
  }

  const prefix = includePrefix ? 'v' : '';
  return `${prefix}${version}`;
}

/**
 * Version validation schema for Zod (if needed)
 */
export const versionValidation = {
  isValid: isValidVersion,
  parse: parseVersion,
  compare: compareVersions,
};
