
// src/components/PreviewPane.tsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { UseFormWatch } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PreviewPaneProps {
  locale: 'en' | 'es';
  docId: string;
  templatePath?: string; 
  watch: UseFormWatch<any>; // From react-hook-form
}

const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise(resolve => {
      clearTimeout(timeout);
      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
};

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

  const updatePreview = useCallback((formData: Record<string, any>, markdown: string) => {
    if (!markdown) return '';
    let tempMd = markdown;
    for (const key in formData) {
      const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      tempMd = tempMd.replace(placeholder, formData[key] || `{{${key}}}`); 
    }
    return tempMd;
  }, []);
  
  const debouncedUpdatePreview = React.useMemo(() => debounce(updatePreview, 300), [updatePreview]);

  useEffect(() => {
    if (!rawMarkdown) return;

    // Subscribe to all form field changes
    const subscription = watch(async (formData) => {
      // formData contains all current form values
      const processed = await debouncedUpdatePreview(formData, rawMarkdown);
      setProcessedMarkdown(processed);
    });

    // Initial processing with current form values
    debouncedUpdatePreview(watch(), rawMarkdown).then(setProcessedMarkdown);
    
    return () => subscription.unsubscribe();
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
        {processedMarkdown || rawMarkdown}
      </ReactMarkdown>
    </div>
  );
}
