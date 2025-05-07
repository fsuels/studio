
// src/components/PreviewPane.tsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // Import remark-gfm
import { UseFormWatch } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { debounce } from 'lodash-es'; // Import debounce

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
      const path = templatePath || `/templates/${locale}/${docId}.md`;
      try {
        const response = await fetch(path);
        if (!response.ok) {
          throw new Error(`Failed to fetch template (${response.status}): ${path}`);
        }
        const text = await response.text();
        setRawMarkdown(text);
        setProcessedMarkdown(text); // Initialize processedMarkdown
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

  // Debounced function to update the preview
  const updatePreviewContent = useCallback((formData: Record<string, any>, markdown: string): string => {
    if (!markdown) return '';
    let tempMd = markdown;
    // Iterate over form data to replace placeholders
    for (const key in formData) {
      // Regex to find placeholders like {{fieldName}}, {{ fieldName }}, etc.
      const placeholderRegex = new RegExp(`{{\\s*${key.trim()}\\s*}}`, 'g');
      const value = formData[key];
      // If value exists, make it bold. Otherwise, use underscores.
      tempMd = tempMd.replace(placeholderRegex, value ? `**${String(value)}**` : '____');
    }
    // Replace any remaining unfulfilled placeholders with underscores
    tempMd = tempMd.replace(/\{\{.*?\}\}/g, '____');
    return tempMd;
  }, []);
  
  const debouncedUpdatePreview = React.useMemo(() => debounce(updatePreviewContent, 300), [updatePreviewContent]);

  useEffect(() => {
    if (!rawMarkdown) {
        setProcessedMarkdown(''); // Clear processed markdown if raw is empty
        return;
    }

    const subscription = watch(async (formData) => {
      const processed = await debouncedUpdatePreview(formData, rawMarkdown);
      setProcessedMarkdown(processed);
    });

    // Initial processing with current form values
    debouncedUpdatePreview(watch(), rawMarkdown).then(setProcessedMarkdown);
    
    return () => {
        subscription.unsubscribe();
        debouncedUpdatePreview.cancel(); // Cancel any pending debounced calls
    }
  }, [watch, rawMarkdown, debouncedUpdatePreview]);

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
