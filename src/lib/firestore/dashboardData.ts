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
  date: Timestamp | Date | string;
  status: string;
  docType: string;
}

export async function getUserDocuments(
  userId: string,
  max = 20
): Promise<DashboardDocument[]> {
  const db = await getDb();
  const col = collection(db, 'users', userId, 'documents');
  const q = query(col, orderBy('createdAt', 'desc'), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map(d => {
    const data = d.data() as Record<string, unknown>;
    const docType = (data.originalDocId || data.docType || d.id) as string;
    const docConfig = documentLibrary.find((doc) => doc.id === docType);
    return {
      id: d.id,
      name: docConfig?.name || docConfig?.translations?.en?.name || docType,
      date: data.createdAt as Timestamp | Date | string,
      status: (data.status as string) || 'Draft',
      docType,
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

export async function getUserPayments(
  userId: string,
  max = 20
): Promise<DashboardPayment[]> {
  const db = await getDb();
  const col = collection(db, 'users', userId, 'payments');
  const q = query(col, orderBy('date', 'desc'), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as DashboardPayment);
}
