// src/lib/versioning/template-version-manager.ts
import { getDb } from '@/lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  writeBatch,
  type Timestamp,
} from 'firebase/firestore';
import {
  parseVersion,
  compareVersions,
  incrementVersion,
  getLatestVersion,
  sortVersions,
  isValidVersion,
  suggestNextVersion,
} from './semantic-version';
import type {
  SemanticVersion,
  TemplateVersion,
  MarketplaceTemplate,
  ChangelogEntry,
  CompatibilityInfo,
  ValidationResult,
} from '@/types/marketplace';
import type { LegalDocument } from '@/types/documents';

/**
 * Template Version Manager
 * Handles version creation, updates, and management for marketplace templates
 */
export class TemplateVersionManager {
  private db: ReturnType<typeof getDb> | null = null;

  constructor() {
    this.initDb();
  }

  private async initDb() {
    this.db = await getDb();
  }

  private async ensureDb() {
    if (!this.db) {
      await this.initDb();
    }
    return this.db!;
  }

  /**
   * Create a new template version
   */
  async createVersion(params: {
    templateId: string;
    version: SemanticVersion;
    document: LegalDocument;
    createdBy: string;
    changelog: ChangelogEntry[];
    breaking?: boolean;
    compatibility?: CompatibilityInfo;
  }): Promise<TemplateVersion> {
    const db = await this.ensureDb();

    if (!isValidVersion(params.version)) {
      throw new Error(`Invalid semantic version: ${params.version}`);
    }

    // Check if version already exists
    const existingVersion = await this.getVersion(
      params.templateId,
      params.version,
    );
    if (existingVersion) {
      throw new Error(
        `Version ${params.version} already exists for template ${params.templateId}`,
      );
    }

    const parsed = parseVersion(params.version);
    const versionId = `${params.templateId}-v${params.version}`;

    const templateVersion: TemplateVersion = {
      id: versionId,
      templateId: params.templateId,
      version: params.version,
      majorVersion: parsed.major,
      minorVersion: parsed.minor,
      patchVersion: parsed.patch,
      prerelease: parsed.prerelease,
      createdAt: serverTimestamp() as Timestamp,
      createdBy: params.createdBy,
      status: 'draft',
      document: params.document,
      changelog: params.changelog,
      breaking: params.breaking || false,
      compatibility: params.compatibility || {
        backwardCompatible: !params.breaking,
        forwardCompatible: false,
        migrationRequired: params.breaking || false,
      },
    };

    // Store version
    const versionRef = doc(
      db,
      'marketplace-templates',
      params.templateId,
      'versions',
      versionId,
    );
    await setDoc(versionRef, templateVersion);

    // Update template's version list and current version if this is the latest
    await this.updateTemplateVersions(params.templateId, params.version);

    return templateVersion;
  }

  /**
   * Get a specific version of a template
   */
  async getVersion(
    templateId: string,
    version: SemanticVersion,
  ): Promise<TemplateVersion | null> {
    const db = await this.ensureDb();
    const versionId = `${templateId}-v${version}`;
    const versionRef = doc(
      db,
      'marketplace-templates',
      templateId,
      'versions',
      versionId,
    );
    const snap = await getDoc(versionRef);

    return snap.exists() ? (snap.data() as TemplateVersion) : null;
  }

  /**
   * Get all versions of a template
   */
  async getVersions(
    templateId: string,
    options?: {
      includeStatus?: ('draft' | 'published' | 'deprecated' | 'archived')[];
      limit?: number;
      stable?: boolean;
    },
  ): Promise<TemplateVersion[]> {
    const db = await this.ensureDb();
    const versionsRef = collection(
      db,
      'marketplace-templates',
      templateId,
      'versions',
    );

    let q = query(versionsRef, orderBy('createdAt', 'desc'));

    if (options?.limit) {
      q = query(q, limit(options.limit));
    }

    const snap = await getDocs(q);
    let versions = snap.docs.map((doc) => doc.data() as TemplateVersion);

    // Apply filters
    if (options?.includeStatus) {
      versions = versions.filter((v) =>
        options.includeStatus!.includes(v.status),
      );
    }

    if (options?.stable) {
      versions = versions.filter((v) => !v.prerelease);
    }

    return versions;
  }

  /**
   * Get the latest version of a template
   */
  async getLatestVersion(
    templateId: string,
    stableOnly = false,
  ): Promise<TemplateVersion | null> {
    const versions = await this.getVersions(templateId, {
      includeStatus: ['published'],
      stable: stableOnly,
    });

    if (versions.length === 0) return null;

    const versionNumbers = versions.map((v) => v.version);
    const latestVersionNumber = getLatestVersion(versionNumbers);

    return versions.find((v) => v.version === latestVersionNumber) || null;
  }

  /**
   * Publish a version (move from draft to published)
   */
  async publishVersion(
    templateId: string,
    version: SemanticVersion,
    publishedBy: string,
  ): Promise<void> {
    const db = await this.ensureDb();
    const versionId = `${templateId}-v${version}`;
    const versionRef = doc(
      db,
      'marketplace-templates',
      templateId,
      'versions',
      versionId,
    );

    await updateDoc(versionRef, {
      status: 'published',
      approvedBy: publishedBy,
      approvedAt: serverTimestamp(),
    });

    // Update template's current version if this is the latest published version
    await this.updateTemplateVersions(templateId, version);
  }

  /**
   * Deprecate a version
   */
  async deprecateVersion(
    templateId: string,
    version: SemanticVersion,
    reason?: string,
  ): Promise<void> {
    const db = await this.ensureDb();
    const versionId = `${templateId}-v${version}`;
    const versionRef = doc(
      db,
      'marketplace-templates',
      templateId,
      'versions',
      versionId,
    );

    const updateData: any = {
      status: 'deprecated',
      deprecatedAt: serverTimestamp(),
    };

    if (reason) {
      updateData.deprecationReason = reason;
    }

    await updateDoc(versionRef, updateData);
  }

  /**
   * Compare two versions and generate a diff
   */
  async compareVersions(
    templateId: string,
    fromVersion: SemanticVersion,
    toVersion: SemanticVersion,
  ): Promise<{
    fromVersion: TemplateVersion;
    toVersion: TemplateVersion;
    diff: VersionDiff;
  }> {
    const [from, to] = await Promise.all([
      this.getVersion(templateId, fromVersion),
      this.getVersion(templateId, toVersion),
    ]);

    if (!from || !to) {
      throw new Error('One or both versions not found');
    }

    const diff = this.generateVersionDiff(from, to);

    return { fromVersion: from, toVersion: to, diff };
  }

  /**
   * Generate suggested next version based on changes
   */
  suggestNextVersion(
    currentVersion: SemanticVersion,
    changeType: {
      breaking?: boolean;
      features?: boolean;
      fixes?: boolean;
    },
  ): SemanticVersion {
    return suggestNextVersion(
      currentVersion,
      changeType.breaking || false,
      changeType.features || false,
      changeType.fixes || false,
    );
  }

  /**
   * Validate version compatibility
   */
  async validateCompatibility(
    templateId: string,
    newVersion: SemanticVersion,
    document: LegalDocument,
  ): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    const latestVersion = await this.getLatestVersion(templateId);

    if (!latestVersion) {
      results.push({
        rule: 'first-version',
        status: 'pass',
        message: 'First version of template',
        severity: 'info',
        timestamp: serverTimestamp() as Timestamp,
      });
      return results;
    }

    // Check version increment validity
    const comparison = compareVersions(newVersion, latestVersion.version);
    if (comparison <= 0) {
      results.push({
        rule: 'version-increment',
        status: 'fail',
        message: `New version ${newVersion} must be greater than current version ${latestVersion.version}`,
        severity: 'error',
        timestamp: serverTimestamp() as Timestamp,
      });
    }

    // Check schema compatibility
    const schemaChanges = this.detectSchemaChanges(
      latestVersion.document,
      document,
    );
    if (schemaChanges.breaking.length > 0) {
      const parsed = parseVersion(newVersion);
      const latestParsed = parseVersion(latestVersion.version);

      if (parsed.major === latestParsed.major) {
        results.push({
          rule: 'breaking-changes',
          status: 'fail',
          message:
            'Breaking changes detected but major version was not incremented',
          severity: 'error',
          timestamp: serverTimestamp() as Timestamp,
        });
      }
    }

    return results;
  }

  /**
   * Update template's version information
   */
  private async updateTemplateVersions(
    templateId: string,
    newVersion: SemanticVersion,
  ): Promise<void> {
    const db = await this.ensureDb();
    const templateRef = doc(db, 'marketplace-templates', templateId);
    const templateSnap = await getDoc(templateRef);

    if (!templateSnap.exists()) return;

    const template = templateSnap.data() as MarketplaceTemplate;
    const allVersions = await this.getVersions(templateId, {
      includeStatus: ['published'],
    });
    const versionNumbers = allVersions.map((v) => v.version);

    if (!versionNumbers.includes(newVersion)) {
      versionNumbers.push(newVersion);
    }

    const sortedVersions = sortVersions(versionNumbers);
    const latestVersion = sortedVersions[sortedVersions.length - 1];

    await updateDoc(templateRef, {
      versions: versionNumbers,
      currentVersion: latestVersion,
      latestVersionId: `${templateId}-v${latestVersion}`,
      lastUpdated: serverTimestamp(),
    });
  }

  /**
   * Generate diff between two versions
   */
  private generateVersionDiff(
    from: TemplateVersion,
    to: TemplateVersion,
  ): VersionDiff {
    const schemaChanges = this.detectSchemaChanges(from.document, to.document);

    return {
      versionChange: {
        from: from.version,
        to: to.version,
        type: this.getVersionChangeType(from.version, to.version),
      },
      schemaChanges,
      metadataChanges: this.detectMetadataChanges(from.document, to.document),
      changelog: to.changelog,
      breaking: to.breaking,
    };
  }

  /**
   * Detect schema changes between two documents
   */
  private detectSchemaChanges(
    from: LegalDocument,
    to: LegalDocument,
  ): {
    added: string[];
    removed: string[];
    modified: string[];
    breaking: string[];
  } {
    const changes = {
      added: [] as string[],
      removed: [] as string[],
      modified: [] as string[],
      breaking: [] as string[],
    };

    // Compare questions
    const fromQuestions = from.questions || [];
    const toQuestions = to.questions || [];

    const fromQuestionIds = new Set(fromQuestions.map((q) => q.id));
    const toQuestionIds = new Set(toQuestions.map((q) => q.id));

    // Added questions
    for (const question of toQuestions) {
      if (!fromQuestionIds.has(question.id)) {
        changes.added.push(`question.${question.id}`);
        if (question.required) {
          changes.breaking.push(`question.${question.id}`);
        }
      }
    }

    // Removed questions
    for (const question of fromQuestions) {
      if (!toQuestionIds.has(question.id)) {
        changes.removed.push(`question.${question.id}`);
        changes.breaking.push(`question.${question.id}`);
      }
    }

    // Modified questions
    for (const toQuestion of toQuestions) {
      const fromQuestion = fromQuestions.find((q) => q.id === toQuestion.id);
      if (
        fromQuestion &&
        JSON.stringify(fromQuestion) !== JSON.stringify(toQuestion)
      ) {
        changes.modified.push(`question.${toQuestion.id}`);

        // Check for breaking changes
        if (
          fromQuestion.type !== toQuestion.type ||
          fromQuestion.required !== toQuestion.required
        ) {
          changes.breaking.push(`question.${toQuestion.id}`);
        }
      }
    }

    return changes;
  }

  /**
   * Detect metadata changes between two documents
   */
  private detectMetadataChanges(
    from: LegalDocument,
    to: LegalDocument,
  ): string[] {
    const changes: string[] = [];

    const fieldsToCheck = [
      'name',
      'description',
      'category',
      'basePrice',
      'jurisdiction',
    ];

    for (const field of fieldsToCheck) {
      if ((from as any)[field] !== (to as any)[field]) {
        changes.push(field);
      }
    }

    return changes;
  }

  /**
   * Get version change type
   */
  private getVersionChangeType(
    from: SemanticVersion,
    to: SemanticVersion,
  ): 'major' | 'minor' | 'patch' {
    const fromParsed = parseVersion(from);
    const toParsed = parseVersion(to);

    if (toParsed.major > fromParsed.major) return 'major';
    if (toParsed.minor > fromParsed.minor) return 'minor';
    return 'patch';
  }
}

/**
 * Version diff interface
 */
export interface VersionDiff {
  versionChange: {
    from: SemanticVersion;
    to: SemanticVersion;
    type: 'major' | 'minor' | 'patch';
  };
  schemaChanges: {
    added: string[];
    removed: string[];
    modified: string[];
    breaking: string[];
  };
  metadataChanges: string[];
  changelog: ChangelogEntry[];
  breaking: boolean;
}

/**
 * Singleton instance for easy access
 */
export const templateVersionManager = new TemplateVersionManager();
