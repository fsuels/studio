'use client';

import { getDb } from '@/lib/firebase';
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  type Timestamp,
} from 'firebase/firestore';
import { documentLibrary } from '@/lib/document-library';

export interface DashboardDocument {
  id: string;
  name: string;
  date: Timestamp | Date | string; // This will represent updatedAt
  status: string;
  docType: string;
  folderId?: string;
}

export async function getUserDocuments(
  userId: string,
  max = 20,
): Promise<DashboardDocument[]> {
  const start = Date.now();
  const db = await getDb();
  const col = collection(db, 'users', userId, 'documents');
  // Changed orderBy from 'createdAt' to 'updatedAt'
  const q = query(col, orderBy('updatedAt', 'desc'), limit(max));
  const snap = await getDocs(q);
  console.info(
    `[dashboardData] fetched ${snap.size} docs for ${userId} in ${Date.now() - start}ms`,
  );
  return snap.docs
    .filter((d) => {
      const data = d.data() as { deletedAt?: unknown };
      return !data.deletedAt;
    })
    .map((d) => {
      const data = d.data() as Record<string, unknown> & {
        updatedAt?: Timestamp | Date | string;
        createdAt?: Timestamp | Date | string; // Keep for compatibility if some docs only have createdAt
      };
      const docType = (data.originalDocId || data.docType || d.id) as string;
      const docConfig = documentLibrary.find((doc) => doc.id === docType);
      return {
        id: d.id,
        name:
          (data.name as string) ||
          docConfig?.name ||
          docConfig?.translations?.en?.name ||
          docType,
        // Use updatedAt for the date display, fallback to createdAt if updatedAt is missing
        date: data.updatedAt || data.createdAt || new Date(),
        status: (data.status as string) || 'Draft',
        docType,
        folderId: data.folderId as string | undefined,
      };
    });
}

export interface DashboardPayment {
  id: string;
  date: Timestamp | Date | string;
  amount: string;
  documentName: string;
  documentId?: string;
}

export interface DashboardFolder {
  id: string;
  name: string;
}

export async function getUserPayments(
  userId: string,
  max = 20,
): Promise<DashboardPayment[]> {
  const start = Date.now();
  const db = await getDb();
  const col = collection(db, 'users', userId, 'payments');
  const q = query(col, orderBy('date', 'desc'), limit(max));
  const snap = await getDocs(q);
  console.info(
    `[dashboardData] fetched ${snap.size} payments for ${userId} in ${Date.now() - start}ms`,
  );
  return snap.docs.map((d) => d.data() as DashboardPayment);
}

export async function getUserFolders(
  userId: string,
): Promise<DashboardFolder[]> {
  const start = Date.now();
  const db = await getDb();
  const col = collection(db, 'users', userId, 'folders');
  const q = query(col, orderBy('createdAt', 'asc'));
  const snap = await getDocs(q);
  console.info(
    `[dashboardData] fetched ${snap.size} folders for ${userId} in ${Date.now() - start}ms`,
  );
  return snap.docs.map((d) => ({ id: d.id, name: (d.data().name as string) || d.id }));
}
