// src/app/api/marketplace/templates/[templateId]/versions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { templateVersionManager } from '@/lib/versioning/template-version-manager';
import { generateTemplateDiff } from '@/lib/versioning/template-diff-viewer';
import type { ChangelogEntry } from '@/types/marketplace';

/**
 * GET /api/marketplace/templates/[templateId]/versions
 * Get all versions of a template with optional filtering
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ templateId: string }> },
) {
  try {
    const { templateId } = await context.params;
    const url = new URL(request.url);

    const stableOnly = url.searchParams.get('stable') === 'true';
    const includeStatus = url.searchParams.get('status')?.split(',') as any;
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const includeDiffs = url.searchParams.get('includeDiffs') === 'true';

    const versions = await templateVersionManager.getVersions(templateId, {
      includeStatus: includeStatus || ['published'],
      limit: Math.min(limit, 50), // Max 50 versions
      stable: stableOnly,
    });

    let response: any = {
      versions,
      total: versions.length,
    };

    // Optionally include diffs between consecutive versions
    if (includeDiffs && versions.length > 1) {
      const diffs = [];
      for (let i = 0; i < versions.length - 1; i++) {
        const fromVersion = versions[i + 1]; // Older version
        const toVersion = versions[i]; // Newer version

        try {
          const diff = generateTemplateDiff(fromVersion, toVersion);
          diffs.push({
            from: fromVersion.version,
            to: toVersion.version,
            summary: diff.summary,
            hasBreakingChanges: diff.summary.breakingChanges > 0,
          });
        } catch (error) {
          console.warn(
            `Failed to generate diff between ${fromVersion.version} and ${toVersion.version}:`,
            error,
          );
        }
      }
      response.diffs = diffs;
    }

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Get template versions error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch template versions',
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/marketplace/templates/[templateId]/versions
 * Create a new version of a template
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ templateId: string }> },
) {
  try {
    // TODO: Add authentication and permission checks
    // const user = await getCurrentUser(request);
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { templateId } = await context.params;
    const body = await request.json();

    const {
      version,
      document,
      changelog,
      breaking = false,
      compatibility,
      autoIncrement = false,
      incrementType = 'patch',
    } = body;

    // Validate required fields
    if (!document) {
      return NextResponse.json(
        { error: 'Document content is required' },
        { status: 400 },
      );
    }

    if (!version && !autoIncrement) {
      return NextResponse.json(
        { error: 'Version number or autoIncrement must be specified' },
        { status: 400 },
      );
    }

    let versionNumber = version;

    // Auto-increment version if requested
    if (autoIncrement) {
      const latestVersion =
        await templateVersionManager.getLatestVersion(templateId);
      if (!latestVersion) {
        versionNumber = '1.0.0';
      } else {
        versionNumber = templateVersionManager.suggestNextVersion(
          latestVersion.version,
          {
            breaking: incrementType === 'major' || breaking,
            features: incrementType === 'minor',
            fixes: incrementType === 'patch',
          },
        );
      }
    }

    // Validate version compatibility
    const validationResults =
      await templateVersionManager.validateCompatibility(
        templateId,
        versionNumber,
        document,
      );

    const errors = validationResults.filter((r) => r.status === 'fail');
    if (errors.length > 0) {
      return NextResponse.json(
        {
          error: 'Version validation failed',
          validationErrors: errors,
        },
        { status: 400 },
      );
    }

    // Create the new version
    const newVersion = await templateVersionManager.createVersion({
      templateId,
      version: versionNumber,
      document,
      createdBy: 'user-id', // TODO: Get from auth
      changelog: changelog || [
        {
          type: 'changed',
          description: 'Template updated',
          impact: breaking ? 'major' : 'minor',
        } as ChangelogEntry,
      ],
      breaking,
      compatibility,
    });

    return NextResponse.json({
      success: true,
      data: {
        version: newVersion,
        validationResults,
        message: 'Version created successfully',
      },
    });
  } catch (error) {
    console.error('Create version error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create version',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
