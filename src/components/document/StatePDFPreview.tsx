// src/components/document/StatePDFPreview.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { overlayFormData } from '@/lib/pdf/pdf-overlay-service';
import { loadDocumentConfig, normalizeJurisdiction, type OverlayConfig } from '@/lib/config-loader';
import { Loader2 } from 'lucide-react';

interface Props {
  state: string;                 // 2-letter code
  documentType: string;
  formData: Record<string, any>;
  overlayConfig?: OverlayConfig | null; // passed from parent to avoid re-fetch
}

export default function StatePDFPreview({
  state,
  documentType,
  formData,
  overlayConfig: injectedOverlay,
}: Props) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let revoke: string | null = null;

    (async () => {
      try {
        setLoading(true);
        setErr(null);
        setPdfUrl(null);

        const jurisdiction = normalizeJurisdiction(state);

        const overlayCfg =
          injectedOverlay ??
          (await (async () => {
            const cfg = await loadDocumentConfig(documentType, jurisdiction);
            return cfg.overlayConfig || null;
          })());

        if (!overlayCfg?.pdfPath) {
          setErr('No overlay configuration (pdfPath missing)');
          setLoading(false);
          return;
        }

        const res = await fetch(overlayCfg.pdfPath);
        if (!res.ok) {
          throw new Error(`Failed to fetch PDF at ${overlayCfg.pdfPath} (status ${res.status})`);
        }
        const pdfBytes = await res.arrayBuffer();

        const filled = await overlayFormData(pdfBytes, formData, state, overlayCfg);

        const blob = new Blob([filled], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        revoke = url;
      } catch (e: any) {
        console.error('[StatePDFPreview] error:', e);
        setErr(e?.message || 'Failed to render preview');
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      if (revoke) URL.revokeObjectURL(revoke);
    };
  }, [state, documentType, formData, injectedOverlay]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin mr-2" /> Generating preview…
      </div>
    );
  }

  if (err) {
    return (
      <div className="p-4 text-sm text-red-600">
        {err}
      </div>
    );
  }

  if (!pdfUrl) {
    return null;
  }

  return (
    <iframe
      title="PDF Preview"
      src={pdfUrl}
      className="w-full h-full border-0"
    />
  );
}
