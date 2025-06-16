'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';

interface RecentDocEntry {
  id: string;
  name: string;
}

export default function PersonalizationBlock() {
  const { isLoggedIn } = useAuth();
  const [lastDoc, setLastDoc] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('recentDocs') || '[]';
      const docs: RecentDocEntry[] = JSON.parse(raw);
      if (Array.isArray(docs) && docs.length > 0) {
        setLastDoc(docs[0].name);
      }
    } catch {
      setLastDoc(null);
    }
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="mt-4 rounded-md bg-secondary p-4 text-center text-sm">
        Start your first document now — it&apos;s free
      </div>
    );
  }

  if (lastDoc) {
    return (
      <div className="mt-4 rounded-md bg-secondary p-4 text-center text-sm">
        Welcome back — Resume your {lastDoc} (Step 2 of 3)
      </div>
    );
  }

  return null;
}
