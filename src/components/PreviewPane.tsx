// src/components/PreviewPane.tsx
'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react'; 
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { UseFormWatch } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { debounce } from 'lodash-es';

interface PreviewPaneProps {
  locale: 'en' | 'es';
  docId: string;
  templatePath?: string;
  watch: UseFormWatch<any>; 
}

export default function PreviewPane({ locale, docId, templatePath, watch }: PreviewPaneProps) {
  const { t } = useTranslation();
  const [rawMarkdown, setRawMarkdown] = useState<string>('');
  const [processedMarkdown, setProcessedMarkdown] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const watermarkText = t('previewWatermark');

  useEffect(() => {
    async function fetchTemplate() {
      setIsLoading(true);
      setError(null);
      setRawMarkdown(''); 
      setProcessedMarkdown(''); 
      const path = templatePath || `/templates/${locale}/${docId}.md`;
      try {
        const response = await fetch(path);
        if (!response.ok) {
          throw new Error(`Failed to fetch template (${response.status}): ${path}`);
        }
        const text = await response.text();
        setRawMarkdown(text);
      } catch (err) {
        console.error("Error fetching Markdown template:", err);
        setError(err instanceof Error ? err.message : "Could not load template.");
        setRawMarkdown(''); 
      } finally {
        setIsLoading(false);
      }
    }
    fetchTemplate();
  }, [docId, locale, templatePath]);

  const updatePreviewContentAndSetState = useCallback((formData: Record<string, any>, currentRawMarkdown: string) => {
    if (!currentRawMarkdown) {
      setProcessedMarkdown('');
      return;
    }
    let tempMd = currentRawMarkdown;
    for (const key in formData) {
      const placeholderRegex = new RegExp(`{{\\s*${key.trim()}\\s*}}`, 'g');
      const value = formData[key];
      tempMd = tempMd.replace(placeholderRegex, value ? `**${String(value)}**` : '____');
    }
    tempMd = tempMd.replace(/\{\{.*?\}\}/g, '____'); // Replace any remaining placeholders
    setProcessedMarkdown(tempMd);
  }, []);

  const debouncedUpdatePreview = useMemo(
    () => debounce(updatePreviewContentAndSetState, 300),
    [updatePreviewContentAndSetState]
  );

  useEffect(() => {
    if (isLoading || !rawMarkdown) {
      if (!isLoading && !rawMarkdown) { 
        setProcessedMarkdown(''); 
      }
      return; 
    }

    debouncedUpdatePreview(watch(), rawMarkdown);

    const subscription = watch((formData) => {
      debouncedUpdatePreview(formData, rawMarkdown);
    });

    return () => {
      subscription.unsubscribe();
      debouncedUpdatePreview.cancel();
    };
  }, [watch, rawMarkdown, debouncedUpdatePreview, isLoading]);


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-muted-foreground p-4 bg-muted/50 rounded-md">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <p>{t('Loading document preview...', { ns: 'translation' })}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-destructive p-4 bg-destructive/10 rounded-md">
        <p>{t('Error loading preview', { ns: 'translation' })}: {error}</p>
      </div>
    );
  }
  
  if (!rawMarkdown && !isLoading) {
     return (
        <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-muted-foreground p-4 bg-muted/50 rounded-md">
          <p>{t('Template not found or empty.', { ns: 'translation' })}</p>
        </div>
     )
  }

  return (
    <div
      id="live-preview"
      data-watermark={watermarkText}
      className="relative w-full min-h-[500px] md:min-h-[650px] h-full overflow-hidden rounded-lg bg-background shadow-md border border-border"
    >
      {/* Scrollable content area */}
      <div className="prose prose-sm dark:prose-invert max-w-none w-full h-full overflow-y-auto p-4 md:p-6">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {processedMarkdown || ''}
        </ReactMarkdown>
      </div>
    </div>
  );
}