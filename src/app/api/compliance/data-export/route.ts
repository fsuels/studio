// src/app/api/compliance/data-export/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/server-auth';
import { auditService } from '@/services/firebase-audit-service';
import { getDb } from '@/lib/firebase';
import {
  collection,
  query,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';

interface DSARRequest {
  userId: string;
  requestType: 'full_export' | 'audit_trail_only' | 'documents_only';
  format: 'json' | 'csv' | 'pdf';
  includeDeleted?: boolean;
}

interface UserDataExport {
  userData: {
    profile: any;
    preferences: any;
  };
  documents: any[];
  auditTrail: any[];
  payments: any[];
  folders: any[];
  metadata: {
    exportDate: string;
    requestType: string;
    totalRecords: number;
    retentionPolicy: string;
  };
}

export async function POST(request: NextRequest) {
  const requestId = `dsar_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const logPrefix = `[API /compliance/data-export] [${requestId}]`;

  console.log(
    `${logPrefix} Received DSAR request: ${request.method} ${request.url}`,
  );

  try {
    // Authenticate user
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    const user = authResult;

    const body: DSARRequest = await request.json();
    const {
      requestType = 'full_export',
      format = 'json',
      includeDeleted = false,
    } = body;

    console.log(
      `${logPrefix} Processing DSAR for user ${user.uid}, type: ${requestType}, format: ${format}`,
    );

    // Log the DSAR request itself
    await auditService.logComplianceEvent('consent_given', {
      consentType: 'data_export_request',
      requestType,
      format,
      includeDeleted,
      requestId,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    // Export user data
    const exportData = await exportUserData(
      user.uid,
      requestType,
      includeDeleted,
    );

    // Format the response based on requested format
    let responseContent: string;
    let contentType: string;
    let fileName: string;

    switch (format) {
      case 'csv':
        responseContent = convertToCSV(exportData);
        contentType = 'text/csv';
        fileName = `data-export-${user.uid}-${Date.now()}.csv`;
        break;
      case 'pdf':
        // For now, return JSON and mention PDF support is coming
        responseContent = JSON.stringify(exportData, null, 2);
        contentType = 'application/json';
        fileName = `data-export-${user.uid}-${Date.now()}.json`;
        break;
      default:
        responseContent = JSON.stringify(exportData, null, 2);
        contentType = 'application/json';
        fileName = `data-export-${user.uid}-${Date.now()}.json`;
    }

    console.log(
      `${logPrefix} Successfully generated DSAR export (${responseContent.length} bytes)`,
    );

    return new NextResponse(responseContent, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': responseContent.length.toString(),
      },
    });
  } catch (error: unknown) {
    console.error(`${logPrefix} DSAR export error:`, error);

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    // Log the failed request
    try {
      await auditService.logComplianceEvent('consent_given', {
        consentType: 'data_export_request_failed',
        error: errorMessage,
        requestId,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      });
    } catch (auditError) {
      console.error(`${logPrefix} Failed to log DSAR error:`, auditError);
    }

    return NextResponse.json(
      {
        error: 'Failed to export user data',
        details:
          process.env.NODE_ENV === 'development' ? errorMessage : undefined,
        requestId,
      },
      { status: 500 },
    );
  }
}

async function exportUserData(
  userId: string,
  requestType: string,
  includeDeleted: boolean,
): Promise<UserDataExport> {
  const db = await getDb();
  const exportData: UserDataExport = {
    userData: { profile: null, preferences: null },
    documents: [],
    auditTrail: [],
    payments: [],
    folders: [],
    metadata: {
      exportDate: new Date().toISOString(),
      requestType,
      totalRecords: 0,
      retentionPolicy: '7 years from last activity',
    },
  };

  try {
    // Export user profile data
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      exportData.userData.profile = userDoc.data();
    }

    // Export documents (if requested)
    if (requestType === 'full_export' || requestType === 'documents_only') {
      const documentsQuery = query(
        collection(db, 'users', userId, 'documents'),
      );
      const documentsSnap = await getDocs(documentsQuery);

      exportData.documents = documentsSnap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((doc) => includeDeleted || !doc.deletedAt);
    }

    // Export folders
    if (requestType === 'full_export') {
      const foldersQuery = query(collection(db, 'users', userId, 'folders'));
      const foldersSnap = await getDocs(foldersQuery);
      exportData.folders = foldersSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }

    // Export audit trail (always included for compliance)
    exportData.auditTrail = await auditService.getUserAuditTrail(userId, 10000);

    // Calculate total records
    exportData.metadata.totalRecords =
      (exportData.userData.profile ? 1 : 0) +
      exportData.documents.length +
      exportData.auditTrail.length +
      exportData.folders.length;

    console.log(
      `Exported ${exportData.metadata.totalRecords} records for user ${userId}`,
    );

    return exportData;
  } catch (error) {
    console.error('Error exporting user data:', error);
    throw error;
  }
}

function convertToCSV(data: UserDataExport): string {
  const csvLines: string[] = [];

  // Header
  csvLines.push('Export Type,Timestamp,Record Type,ID,Data');

  // Add metadata
  csvLines.push(
    `"Metadata","${data.metadata.exportDate}","export_info","metadata","${JSON.stringify(data.metadata).replace(/"/g, '""')}"`,
  );

  // Add user profile
  if (data.userData.profile) {
    csvLines.push(
      `"User Data","${data.metadata.exportDate}","profile","user_profile","${JSON.stringify(data.userData.profile).replace(/"/g, '""')}"`,
    );
  }

  // Add documents
  data.documents.forEach((doc) => {
    csvLines.push(
      `"Documents","${doc.createdAt || data.metadata.exportDate}","document","${doc.id}","${JSON.stringify(doc).replace(/"/g, '""')}"`,
    );
  });

  // Add audit trail
  data.auditTrail.forEach((event) => {
    csvLines.push(
      `"Audit Trail","${event.timestamp || data.metadata.exportDate}","audit_event","${event.id}","${JSON.stringify(event).replace(/"/g, '""')}"`,
    );
  });

  // Add folders
  data.folders.forEach((folder) => {
    csvLines.push(
      `"Folders","${folder.createdAt || data.metadata.exportDate}","folder","${folder.id}","${JSON.stringify(folder).replace(/"/g, '""')}"`,
    );
  });

  return csvLines.join('\n');
}

// GET endpoint for requesting data export (returns metadata about what would be exported)
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    const user = authResult;

    const db = await getDb();

    // Count user's data
    const documentsQuery = query(
      collection(db, 'users', user.uid, 'documents'),
    );
    const documentsSnap = await getDocs(documentsQuery);
    const documentCount = documentsSnap.size;

    const auditEvents = await auditService.getUserAuditTrail(user.uid, 1);
    const hasAuditTrail = auditEvents.length > 0;

    return NextResponse.json({
      userId: user.uid,
      availableData: {
        documents: documentCount,
        auditTrail: hasAuditTrail,
        profile: true,
      },
      supportedFormats: ['json', 'csv'],
      retentionPolicy: '7 years from last activity',
      estimatedExportSize: `${Math.max(1, Math.ceil(documentCount / 10))} MB`,
    });
  } catch (error) {
    console.error('Error getting export info:', error);
    return NextResponse.json(
      { error: 'Failed to get export information' },
      { status: 500 },
    );
  }
}
