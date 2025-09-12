'use client';
// src/components/RecentDocs.tsx

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2, FileText } from 'lucide-react';

/**
 * HOW WE PERSIST ▾
 *  – Anonymous / logged‑out   ➜ localStorage  (key: recentDocs)
 *  – Logged‑in (userId prop)  ➜ Firestore     (/users/{userId}/recentDocs)
 *
 *  The component automatically keeps localStorage in sync so it “just works”
 *  before a user signs up.
 */

interface RecentDocsProps {
  userId?: string; // hand down from auth context if available
  max?: number; // default 5
}

interface RecentDocEntry {
  id: string; // template/document id
  name: string;
  lastOpened: number; // epoch ms
}

export default function RecentDocs({ userId, max = 5 }: RecentDocsProps) {
  const [docs, setDocs] = useState<RecentDocEntry[] | null>(null);

  /* ---------- helpers ------------------------------------- */
  const fetchLocal = (): RecentDocEntry[] => {
    try {
      const raw = localStorage.getItem('recentDocs') || '[]';
      return JSON.parse(raw);
    } catch {
      return [];
    }
  };

  const saveLocal = (entries: RecentDocEntry[]) => {
    localStorage.setItem('recentDocs', JSON.stringify(entries));
  };

  /* ---------- load on mount -------------------------------- */
  useEffect(() => {
    const load = async () => {
      // 1) start with localStorage
      let list = fetchLocal();

      // 2) if logged in, merge with Firestore copy
      if (userId) {
        const { loadRecentDocs } = await import('@/lib/firestore/recentDocs');
        const remote = await loadRecentDocs(userId);
        const map = new Map<string, RecentDocEntry>();
        [...list, ...remote].forEach((d) => map.set(d.id, d)); // dedupe
        list = Array.from(map.values()).sort(
          (a, b) => b.lastOpened - a.lastOpened,
        );
        // keep localStorage fresh
        saveLocal(list);
      }

      setDocs(list.slice(0, max));
    };
    load().catch(console.error);
  }, [userId]);

  if (docs === null) {
    return (
      <div className="flex items-center gap-2 py-8 justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">
          Loading recent&nbsp;documents…
        </span>
      </div>
    );
  }

  if (!docs.length) return null;

  return (
    <Card className="w-full shadow-sm border border-border">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Recently used documents
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {docs.map((d) => (
          <Link
            key={d.id}
            href={`/generate?doc=${encodeURIComponent(d.id)}`}
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span>{d.name}</span>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
