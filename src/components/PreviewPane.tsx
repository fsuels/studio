// src/components/PreviewPane.tsx
'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react'; // Ensured useMemo is imported
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
  watch: UseFormWatch<any>; // From react-hook-form
}

export default function PreviewPane({ locale, docId, templatePath, watch }: PreviewPaneProps) {
  const { t } = useTranslation();
  const [rawMarkdown, setRawMarkdown] = useState<string>('');
  const [processedMarkdown, setProcessedMarkdown] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTemplate() {
      setIsLoading(true);
      setError(null);
      setRawMarkdown(''); // Clear raw markdown before fetching
      setProcessedMarkdown(''); // Clear processed markdown
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
        setRawMarkdown(''); // Ensure it's empty on error
      } finally {
        setIsLoading(false);
      }
    }
    fetchTemplate();
  }, [docId, locale, templatePath]);

  // This function performs the markdown processing and calls setProcessedMarkdown
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
    tempMd = tempMd.replace(/\{\{.*?\}\}/g, '____');
    setProcessedMarkdown(tempMd);
  }, [setProcessedMarkdown]);

  // Create the debounced version of the state-updating function
  const debouncedUpdatePreview = useMemo(
    () => debounce(updatePreviewContentAndSetState, 300),
    [updatePreviewContentAndSetState]
  );

  useEffect(() => {
    if (isLoading || !rawMarkdown) {
      if (!isLoading && !rawMarkdown) { // If loading finished and still no markdown
        setProcessedMarkdown(''); // Explicitly clear preview
      }
      return; // Don't setup watchers if still loading or no markdown
    }

    // Initial processing with current form values
    debouncedUpdatePreview(watch(), rawMarkdown);

    // Subscribe to form changes
    const subscription = watch((formData) => {
      debouncedUpdatePreview(formData, rawMarkdown);
    });

    return () => {
      subscription.unsubscribe();
      debouncedUpdatePreview.cancel();
    };
  }, [watch, rawMarkdown, debouncedUpdatePreview, isLoading, setProcessedMarkdown]);


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
    <div className="prose prose-sm dark:prose-invert max-w-none p-1 border rounded-md bg-background overflow-y-auto h-full">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {processedMarkdown || ''}
      </ReactMarkdown>
    </div>
  );
}
