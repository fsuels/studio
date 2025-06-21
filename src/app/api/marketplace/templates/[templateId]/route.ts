// src/app/api/marketplace/templates/[templateId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase';
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { templateVersionManager } from '@/lib/versioning/template-version-manager';
import type { MarketplaceTemplate } from '@/types/marketplace';

/**
 * GET /api/marketplace/templates/[templateId]
 * Get a specific marketplace template with its current version
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { templateId: string } }
) {
  try {
    const { templateId } = params;
    const url = new URL(request.url);
    const includeVersions = url.searchParams.get('includeVersions') === 'true';
    const includeStats = url.searchParams.get('includeStats') === 'true';

    const db = await getDb();
    const templateRef = doc(db, 'marketplace-templates', templateId);
    const templateSnap = await getDoc(templateRef);

    if (!templateSnap.exists()) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    const template = {
      id: templateSnap.id,
      ...templateSnap.data(),
    } as MarketplaceTemplate;

    // Check visibility permissions
    if (template.visibility === 'private' || template.moderationStatus !== 'approved') {
      // TODO: Check if user is the owner or has admin permissions
      // const user = await getCurrentUser(request);
      // if (!user || (user.id !== template.createdBy && !user.isAdmin)) {
      //   return NextResponse.json(
      //     { error: 'Template not found' },
      //     { status: 404 }
      //   );
      // }
    }

    const response: any = {
      template,
      currentVersion: null,
    };

    // Fetch current version details
    if (template.currentVersion) {
      const currentVersion = await templateVersionManager.getVersion(
        templateId,
        template.currentVersion
      );
      response.currentVersion = currentVersion;
    }

    // Optionally include version history
    if (includeVersions) {
      const versions = await templateVersionManager.getVersions(templateId, {
        includeStatus: ['published'],
        limit: 10,
      });
      response.versions = versions;
    }

    // Optionally include detailed stats
    if (includeStats) {
      // TODO: Fetch detailed analytics from analytics service
      response.detailedStats = {
        downloadsByMonth: [],
        userGrowth: [],
        conversionRate: 0,
        topCountries: [],
        averageSessionTime: 0,
      };
    }

    // Increment view count (fire and forget)
    updateDoc(templateRef, {
      'stats.viewCount': (template.stats as any).viewCount + 1 || 1,
      lastViewed: serverTimestamp(),
    }).catch(error => {
      console.warn('Failed to update view count:', error);
    });

    return NextResponse.json({
      success: true,
      data: response,
    });

  } catch (error) {
    console.error('Get template error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch template' 
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/marketplace/templates/[templateId]
 * Update template metadata (requires ownership or admin)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { templateId: string } }
) {
  try {
    // TODO: Add authentication
    // const user = await getCurrentUser(request);
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { templateId } = params;
    const body = await request.json();

    const db = await getDb();
    const templateRef = doc(db, 'marketplace-templates', templateId);
    const templateSnap = await getDoc(templateRef);

    if (!templateSnap.exists()) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    const template = templateSnap.data() as MarketplaceTemplate;

    // Check permissions
    // if (template.createdBy !== user.id && !user.isAdmin) {
    //   return NextResponse.json(
    //     { error: 'Insufficient permissions' },
    //     { status: 403 }
    //   );
    // }

    // Define allowed fields for update
    const allowedFields = [
      'name',
      'description',
      'tags',
      'pricing',
      'visibility',
      'category',
    ];

    const updateData: any = {
      lastUpdated: serverTimestamp(),
    };

    // Only update allowed fields
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Special handling for name changes (update slug)
    if (body.name && body.name !== template.name) {
      updateData.slug = generateSlug(body.name);
    }

    // Special handling for pricing changes
    if (body.pricing) {
      // Validate pricing structure
      if (typeof body.pricing.basePrice !== 'number' || body.pricing.basePrice < 0) {
        return NextResponse.json(
          { error: 'Invalid pricing data' },
          { status: 400 }
        );
      }
    }

    await updateDoc(templateRef, updateData);

    return NextResponse.json({
      success: true,
      data: {
        templateId,
        updated: Object.keys(updateData),
        message: 'Template updated successfully',
      },
    });

  } catch (error) {
    console.error('Update template error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update template' 
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/marketplace/templates/[templateId]
 * Delete/archive a template (requires ownership or admin)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { templateId: string } }
) {
  try {
    // TODO: Add authentication
    // const user = await getCurrentUser(request);
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { templateId } = params;
    const url = new URL(request.url);
    const force = url.searchParams.get('force') === 'true';

    const db = await getDb();
    const templateRef = doc(db, 'marketplace-templates', templateId);
    const templateSnap = await getDoc(templateRef);

    if (!templateSnap.exists()) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    const template = templateSnap.data() as MarketplaceTemplate;

    // Check permissions
    // if (template.createdBy !== user.id && !user.isAdmin) {
    //   return NextResponse.json(
    //     { error: 'Insufficient permissions' },
    //     { status: 403 }
    //   );
    // }

    // Check if template has installations
    if (template.stats.totalInstalls > 0 && !force) {
      return NextResponse.json(
        { 
          error: 'Cannot delete template with active installations. Use force=true to archive.',
          code: 'TEMPLATE_IN_USE',
          installations: template.stats.totalInstalls,
        },
        { status: 409 }
      );
    }

    if (force || template.stats.totalInstalls === 0) {
      // Hard delete if forced or no installations
      await deleteDoc(templateRef);
      
      // TODO: Also delete all versions and related data
      // This should be handled by Cloud Functions in production
      
      return NextResponse.json({
        success: true,
        data: {
          templateId,
          action: 'deleted',
          message: 'Template permanently deleted',
        },
      });
    } else {
      // Soft delete (archive)
      await updateDoc(templateRef, {
        visibility: 'private',
        moderationStatus: 'archived',
        archivedAt: serverTimestamp(),
        // archivedBy: user.id,
      });

      return NextResponse.json({
        success: true,
        data: {
          templateId,
          action: 'archived',
          message: 'Template archived successfully',
        },
      });
    }

  } catch (error) {
    console.error('Delete template error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete template' 
      },
      { status: 500 }
    );
  }
}

/**
 * Generate URL-friendly slug from name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}