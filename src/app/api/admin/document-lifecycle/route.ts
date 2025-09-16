// Document Lifecycle Management API
import { NextRequest, NextResponse } from 'next/server';

// Run dynamically at request time (SSR)
export const dynamic = 'force-dynamic';
import { requireAdmin } from '@/lib/admin-auth';
import {
  documentLifecycle,
  type DocumentStatus,
  type DocumentPriority,
} from '@/lib/document-lifecycle';

export async function GET(request: NextRequest) {
  const adminResult = await requireAdmin(request);
  if (adminResult instanceof Response) {
    return adminResult;
  }

  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || 'overview';
    const timeframe = url.searchParams.get('timeframe') || '30d';
    const status = url.searchParams.get('status');
    const priority = url.searchParams.get('priority');

    switch (type) {
      case 'overview': {
        const metrics = documentLifecycle.generateWorkflowMetrics(timeframe);
        const stalledAnalysis = documentLifecycle.analyzeStalledDocuments();

        return NextResponse.json({
          success: true,
          data: {
            overview: metrics.overview,
            statusDistribution: metrics.statusDistribution,
            criticalStalls: stalledAnalysis.stalledDocuments
              .filter((d) => d.priority === 'urgent' || d.escalationSuggested)
              .slice(0, 10),
            topBottlenecks: metrics.statusDistribution
              .sort((a, b) => b.bottleneckScore - a.bottleneckScore)
              .slice(0, 5),
            unblockingOpportunities: stalledAnalysis.unblockingOpportunities,
          },
        });
      }

      case 'heatmap': {
        const heatmapMetrics =
          documentLifecycle.generateWorkflowMetrics(timeframe);
        return NextResponse.json({
          success: true,
          data: {
            statusDistribution: heatmapMetrics.statusDistribution,
            performanceMetrics: heatmapMetrics.performanceMetrics,
            trends: heatmapMetrics.trends,
          },
        });
      }

      case 'stalled_analysis': {
        const stalledDocs = documentLifecycle.analyzeStalledDocuments();
        return NextResponse.json({
          success: true,
          data: stalledDocs,
        });
      }

      case 'workflow_metrics': {
        const workflowMetrics =
          documentLifecycle.generateWorkflowMetrics(timeframe);
        return NextResponse.json({
          success: true,
          data: workflowMetrics,
        });
      }

      case 'documents': {
        const documents = await getDocumentsList(
          status as DocumentStatus,
          priority as DocumentPriority,
          timeframe,
        );
        return NextResponse.json({
          success: true,
          data: documents,
        });
      }

      case 'realtime_status': {
        const realtimeStatus = await getRealtimeStatus();
        return NextResponse.json({
          success: true,
          data: realtimeStatus,
        });
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid type parameter',
          },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error('Document lifecycle API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve document lifecycle data',
      },
      { status: 500 },
    );
  }
}

// Update document status
export async function POST(request: NextRequest) {
  const adminResult = await requireAdmin(request);
  if (adminResult instanceof Response) {
    return adminResult;
  }

  try {
    const body = await request.json();
    const { action, documentId, newStatus, metadata } = body;

    if (!action || !documentId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: action, documentId',
        },
        { status: 400 },
      );
    }

    switch (action) {
      case 'update_status': {
        if (!newStatus) {
          return NextResponse.json(
            {
              success: false,
              error: 'newStatus is required for update_status action',
            },
            { status: 400 },
          );
        }

        await documentLifecycle.updateDocumentStatus(
          documentId,
          newStatus,
          metadata || {},
          'admin',
          (adminResult as any).userId,
        );

        return NextResponse.json({
          success: true,
          data: { documentId, newStatus, updatedAt: new Date().toISOString() },
        });
      }

      case 'auto_unblock': {
        const unblockResult =
          await documentLifecycle.autoUnblockStalledDocuments();
        return NextResponse.json({
          success: true,
          data: unblockResult,
        });
      }

      case 'bulk_update': {
        const { documentIds, bulkStatus, bulkMetadata } = body;
        if (!documentIds || !Array.isArray(documentIds)) {
          return NextResponse.json(
            {
              success: false,
              error: 'documentIds array is required for bulk_update',
            },
            { status: 400 },
          );
        }

        const bulkResults = [];
        for (const docId of documentIds) {
          try {
            await documentLifecycle.updateDocumentStatus(
              docId,
              bulkStatus,
              bulkMetadata || {},
              'admin',
              (adminResult as any).userId,
            );
            bulkResults.push({ documentId: docId, success: true });
          } catch (error) {
            bulkResults.push({
              documentId: docId,
              success: false,
              error: (error as Error).message,
            });
          }
        }

        return NextResponse.json({
          success: true,
          data: {
            total: documentIds.length,
            successful: bulkResults.filter((r) => r.success).length,
            failed: bulkResults.filter((r) => !r.success).length,
            results: bulkResults,
          },
        });
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action',
          },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error('Document lifecycle update error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update document lifecycle',
      },
      { status: 500 },
    );
  }
}

// Helper functions
async function getDocumentsList(
  status?: DocumentStatus,
  priority?: DocumentPriority,
  timeframe: string = '30d',
) {
  // In production, fetch from actual database
  // For demo, generate mock data
  const mockDocuments = generateMockDocuments(100);

  let filtered = mockDocuments;

  if (status) {
    filtered = filtered.filter((doc) => doc.currentStatus === status);
  }

  if (priority) {
    filtered = filtered.filter((doc) => doc.priority === priority);
  }

  // Apply timeframe filter
  const cutoffDate = new Date();
  switch (timeframe) {
    case '7d': {
      cutoffDate.setDate(cutoffDate.getDate() - 7);
      break;
    }
    case '30d': {
      cutoffDate.setDate(cutoffDate.getDate() - 30);
      break;
    }
    case '90d': {
      cutoffDate.setDate(cutoffDate.getDate() - 90);
      break;
    }
  }

  filtered = filtered.filter((doc) => new Date(doc.createdAt) >= cutoffDate);

  return {
    documents: filtered.slice(0, 50), // Limit results
    total: filtered.length,
    pagination: {
      page: 1,
      limit: 50,
      totalPages: Math.ceil(filtered.length / 50),
    },
  };
}

async function getRealtimeStatus() {
  return {
    activeDocuments: 247,
    stalledDocuments: 18,
    overDueDocuments: 12,
    recentActivity: [
      {
        documentId: 'doc_abc123',
        documentType: 'Lease Agreement',
        customerEmail: 'customer@example.com',
        statusChange: { from: 'draft', to: 'pending_esign' },
        timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
      },
      {
        documentId: 'doc_def456',
        documentType: 'LLC Operating Agreement',
        customerEmail: 'business@example.com',
        statusChange: { from: 'pending_esign', to: 'completed' },
        timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
      },
      {
        documentId: 'doc_ghi789',
        documentType: 'Promissory Note',
        customerEmail: 'borrower@example.com',
        statusChange: { from: 'pending_payment', to: 'stalled' },
        timestamp: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
      },
    ],
    statusDistribution: {
      draft: 67,
      pending_review: 23,
      pending_esign: 89,
      pending_notarization: 12,
      pending_payment: 34,
      completed: 156,
      stalled: 18,
    },
    urgentDocuments: [
      {
        documentId: 'doc_urgent1',
        documentType: 'Real Estate Purchase Agreement',
        customerEmail: 'buyer@example.com',
        priority: 'urgent',
        stalledFor: 172800, // 2 days
        value: 500000,
        currentStatus: 'pending_esign',
      },
      {
        documentId: 'doc_urgent2',
        documentType: 'Business Sale Agreement',
        customerEmail: 'seller@example.com',
        priority: 'urgent',
        stalledFor: 259200, // 3 days
        value: 750000,
        currentStatus: 'pending_notarization',
      },
    ],
  };
}

function generateMockDocuments(count: number) {
  const documentTypes = [
    'Lease Agreement',
    'LLC Operating Agreement',
    'Promissory Note',
    'Bill of Sale',
    'Employment Contract',
    'NDA Agreement',
    'Partnership Agreement',
  ];

  const statuses: DocumentStatus[] = [
    'draft',
    'pending_review',
    'pending_esign',
    'pending_notarization',
    'pending_payment',
    'completed',
    'stalled',
  ];

  const priorities: DocumentPriority[] = ['low', 'medium', 'high', 'urgent'];

  const documents = [];

  for (let i = 0; i < count; i++) {
    const createdAt = new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
    ).toISOString();
    const currentStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];

    documents.push({
      documentId: `doc_${i.toString().padStart(6, '0')}`,
      documentType:
        documentTypes[Math.floor(Math.random() * documentTypes.length)],
      orderId: `ord_${Math.random().toString(36).substr(2, 9)}`,
      customerId: `cust_${Math.random().toString(36).substr(2, 9)}`,
      customerEmail: `customer${i}@example.com`,
      currentStatus,
      priority,
      createdAt,
      updatedAt: new Date(
        new Date(createdAt).getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      completedAt:
        currentStatus === 'completed' ? new Date().toISOString() : undefined,
      statusTimeline: generateStatusTimeline(createdAt, currentStatus),
      timeInCurrentStatus: Math.floor(Math.random() * 7 * 24 * 3600), // 0-7 days in seconds
      totalLifecycleTime: Math.floor(Math.random() * 14 * 24 * 3600), // 0-14 days in seconds
      expectedCompletionTime: 5 * 24 * 3600, // 5 days
      isStalled: Math.random() < 0.15, // 15% chance of being stalled
      stallReason:
        Math.random() < 0.15
          ? 'Customer not responding to e-signature request'
          : undefined,
      stalledAt:
        Math.random() < 0.15
          ? new Date(
              Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000,
            ).toISOString()
          : undefined,
      stallThreshold: 24 * 3600, // 24 hours
      lastReminderSent:
        Math.random() < 0.3
          ? new Date(
              Date.now() - Math.random() * 24 * 60 * 60 * 1000,
            ).toISOString()
          : undefined,
      reminderCount: Math.floor(Math.random() * 3),
      escalationLevel: Math.floor(Math.random() * 3),
      assignedTo:
        Math.random() < 0.5
          ? `admin_${Math.floor(Math.random() * 5) + 1}`
          : undefined,
      value:
        Math.random() < 0.7 ? Math.floor(Math.random() * 500) + 35 : undefined,
      tags: [],
      notes: '',
      version: 1,
      events: [],
    });
  }

  return documents;
}

function generateStatusTimeline(
  createdAt: string,
  currentStatus: DocumentStatus,
) {
  const timeline: any = { draft: createdAt };

  const statusOrder: DocumentStatus[] = [
    'draft',
    'pending_review',
    'pending_esign',
    'pending_notarization',
    'pending_payment',
    'completed',
  ];

  const currentIndex = statusOrder.indexOf(currentStatus);
  let currentTime = new Date(createdAt).getTime();

  for (let i = 1; i <= currentIndex; i++) {
    currentTime += Math.random() * 2 * 24 * 60 * 60 * 1000; // Add 0-2 days
    const statusKey = statusOrder[i].replace(
      'pending_',
      'pending',
    ) as keyof typeof timeline;
    timeline[statusKey] = new Date(currentTime).toISOString();
  }

  return timeline;
}
