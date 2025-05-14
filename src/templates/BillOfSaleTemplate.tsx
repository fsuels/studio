'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function BillOfSaleTemplate() {
  // load only this document’s translation keys
  const { t, i18n } = useTranslation("common");

  const [md, setMd] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        // pick the markdown file matching the current language
        const path = `/templates/${i18n.language}/bill-of-sale-vehicle.md`;
        const res = await fetch(path);
        if (!res.ok) throw new Error(`Cannot fetch ${path}: ${res.status}`);
        setMd(await res.text());
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : t('Error loading template.', { defaultValue: 'Error loading template.' })
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, [i18n.language, t]);

  if (isLoading) {
    return (
      <div className="p-4 border rounded-md bg-muted animate-pulse min-h-[300px] text-muted-foreground">
        {t('Loading document preview…', { defaultValue: 'Loading document preview…' })}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border rounded-md bg-destructive/20 text-destructive">
        {t('Error', { defaultValue: 'Error' })}: {error}
      </div>
    );
  }

  return (
    <div className="bg-card p-8 rounded-2xl shadow-xl mx-auto max-w-4xl border border-border">
      <ReactMarkdown
        className="prose prose-neutral dark:prose-invert max-w-none"
        remarkPlugins={[remarkGfm]}
      >
        {md}
      </ReactMarkdown>
    </div>
  );
}
