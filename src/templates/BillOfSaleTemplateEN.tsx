// src/templates/BillOfSaleTemplateEN.tsx
'use client';

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // For GitHub Flavored Markdown (tables, etc.)
import { useTranslation } from 'react-i18next';

export default function BillOfSaleTemplateEN() {
  const [md, setMd] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchMarkdown() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/templates/en/bill-of-sale-vehicle.md');
        if (!response.ok) {
          throw new Error(`Failed to fetch template: ${response.status} ${response.statusText}`);
        }
        const markdownText = await response.text();
        setMd(markdownText);
      } catch (err) {
        console.error("Error fetching or parsing markdown:", err);
        setError(err instanceof Error ? err.message : t('Unknown error loading template.', {defaultValue: 'Unknown error loading template.'}));
      } finally {
        setIsLoading(false);
      }
    }
    fetchMarkdown();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  if (isLoading) {
    return <div className="p-4 border rounded-md bg-muted animate-pulse min-h-[300px] text-muted-foreground">{t('Loading document preview…', {defaultValue: 'Loading document preview…'})}</div>;
  }

  if (error) {
    return <div className="p-4 border rounded-md bg-destructive/20 text-destructive">{t('Error', {defaultValue: 'Error'})}: {error}</div>;
  }

  return (
    <div className="bg-card p-8 rounded-2xl shadow-xl mx-auto max-w-4xl border border-border"> {/* Updated styling */}
      <ReactMarkdown
        className="prose prose-neutral dark:prose-invert max-w-none" // Apply prose styles
        remarkPlugins={[remarkGfm]}
      >
        {md}
      </ReactMarkdown>
    </div>
  );
}
