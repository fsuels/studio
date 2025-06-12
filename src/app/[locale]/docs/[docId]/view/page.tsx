// src/app/[locale]/docs/[docId]/view/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import EmptyState from '@/components/EmptyState';
import { renderMarkdown } from '@/lib/markdown-renderer';
import { serverTimestamp, setDoc } from 'firebase/firestore';
import { useRouter, useSearchParams } from 'next/navigation';
import DocumentDetail from '@/components/DocumentDetail';
import { useAuth } from '@/hooks/useAuth';
import { getSignWellUrl } from '@/services/signwell';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { getDb } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';

interface ViewDocumentPageProps {
  params: { locale: 'en' | 'es'; docId: string };
}

export default function ViewDocumentPage({ params }: ViewDocumentPageProps) {
  const { locale, docId } = params;
  const searchParams = useSearchParams();
  const savedDocId = searchParams.get('docId');
  const { isLoggedIn, isLoading: authLoading, user } = useAuth();
  const router = useRouter();

  const [markdownContent, setMarkdownContent] = useState<string | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const uid = user?.uid; // TODO: use context/hook for userId
    if (!uid || !savedDocId) return; // TODO: if not logged in, maybe show a different message/CTA
    let cancelled = false;
    async function fetchContent() {
      setIsLoadingContent(true);
      try {
        const db = await getDb();
        const docRef = doc(db, 'users', uid, 'documents', savedDocId);
        const snap = await getDoc(docRef);
        if (!snap.exists()) {
          setLoadError('Document not found.');
          return;
        }
        const data = snap.data() as Record<string, any>;
        let markdown = data.contentMarkdown as string | undefined;

        // Check for other sources (legacy or alternative storage)
        if (typeof data.markdown === 'string' && !markdown) {
          markdown = data.markdown; // legacy markdown field
        } else if (data.storagePath) {
          const storage = getStorage();
          const url = await getDownloadURL(storageRef(storage, data.storagePath));
          const res = await fetch(url);
          markdown = await res.text();
        } else if (data.url) {
          // Direct URL storage (less common now)
          const res = await fetch(data.url); // Assuming data.url is a publicly accessible URL
          markdown = await res.text();
        }

        // ---------- Fallback: generate from formData on‑the‑fly ----------
        if (!markdown && data.formData) {
          markdown = await renderMarkdown(
            data.docType,
            data.formData,
            data.state ?? 'NA',
          );

          /*  Optional but highly recommended: write it back so subsequent
              visits are instant. Fail‑safe — ignore any permission errors.  */
          try {
            await setDoc(docRef, { contentMarkdown: markdown, updatedAt: serverTimestamp() }, { merge: true });
          } catch (_) {} // read‑only environments (preview channels) can skip this
        }

        setMarkdownContent(markdown || null);
        setLoadError(null);
      } catch (err) {
        console.error('[view page] failed to load saved content', err);
        setLoadError('Failed to load document.');
      } finally {
        if (!cancelled) setIsLoadingContent(false);
      }
    }
    fetchContent();
    return () => {
      cancelled = true;
    };
  }, [savedDocId, user]);

  const [isSigning, setIsSigning] = useState(false);

  // Navigate back to the start‐wizard, preserving any saved data
  const handleEdit = () => {
    router.push(`/${locale}/docs/${docId}/start`);
  };

  // Opens SignWell flow in a new tab
  const handleSign = async () => {
    setIsSigning(true);
    try {
      const url = await getSignWellUrl(docId);
      window.open(url, '_blank');
    } catch (err) {
      console.error('Error fetching SignWell URL', err);
    } finally {
      setIsSigning(false);
    }
  };

  // Simple guard: only logged in users can download (you'd replace with real payment check)
  const handleDownload = () => {
    if (!isLoggedIn) {
      router.push(`/${locale}/signin`);
    } else {
      router.push(`/${locale}/checkout?docId=${docId}`);
    }
  };

  if (authLoading || isLoadingContent) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.back()}
            className="text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
          <h1 className="text-2xl font-bold">
            {/* Ideally replace docId with a friendly title lookup */}
            {docId.replace(/-/g, ' ')}
          </h1>
        </div>

        <div className="flex space-x-2">
          <Button onClick={handleEdit}>Edit</Button>

          <Button onClick={handleSign} disabled={isSigning}>
            {isSigning ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Sign
          </Button>

          <Button variant="secondary" onClick={handleDownload}>
            Download
          </Button>
        </div>
      </div>

      {/* Document preview */}
      <div className="border rounded-lg overflow-hidden">
        {loadError ? (
          <EmptyState
            title={loadError}
            description="Edit the draft to finish generating your document."
          />
        ) : (
          <DocumentDetail
            docId={docId}
            locale={locale}
            markdownContent={markdownContent || undefined}
          />
        )}
      </div>
    </div>
  );
}
