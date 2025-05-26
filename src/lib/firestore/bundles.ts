//--------------------------------------------------------------
// Firestore helpers for bundles (optional – can be omitted if
// you’ll ship with static bundles only)
//--------------------------------------------------------------
import { getDb } from '@/lib/firebase'
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from 'firebase/firestore'
import type { Bundle } from '@/data/bundles'

/**
 * Load the latest N bundles from Firestore.
 * Falls back to static list if collection missing / empty.
 */
export async function loadBundles(max = 20): Promise<Bundle[]> {
  try {
    const db = await getDb()
    const col = collection(db, 'bundles')
    const q   = query(col, orderBy('name'), limit(max))
    const snap = await getDocs(q)
    if (!snap.empty) {
      return snap.docs.map(d => d.data() as Bundle)
    }
  } catch (err) {
    console.warn('Firestore bundles lookup failed – using static list', err)
  }

  const { bundles } = await import('@/data/bundles')
  return bundles.slice(0, max)
}