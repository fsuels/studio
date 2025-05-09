// src/components/PreviewPane.tsx
'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useFormContext, type UseFormWatch } from 'react-hook-form'; // Import useFormContext
import { Loader2, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { debounce } from 'lodash-es';
import { documentLibrary, type LegalDocument } from '@/lib/document-library';

interface PreviewPaneProps {
  locale: 'en' | 'es';
  docId: string;
  watch: UseFormWatch<any>; // Keep this prop for flexibility, but can also use context
}

export default function PreviewPane({ locale, docId, watch: watchProp }: PreviewPaneProps) {
  const { t } = useTranslation();
  // Try to get watch from context if not provided as prop, or prefer prop if available
  const contextMethods = useFormContext();
  const watch = watchProp || contextMethods?.watch;


  const [rawMarkdown, setRawMarkdown] = useState<string>('');
  const [processedMarkdown, setProcessedMarkdown] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const docConfig = useMemo(() => documentLibrary.find(d => d.id === docId), [docId]);
  const templatePath = locale === 'es' && docConfig?.templatePath_es ? docConfig.templatePath_es : docConfig?.templatePath;
  const watermarkText = t('preview.watermark', { ns: 'translation', defaultValue: 'PREVIEW' });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated || !docConfig) {
      if (!docConfig && isHydrated) {
        setError(t('Document configuration not found.', { ns: 'translation' }));
        setIsLoading(false);
      }
      return;
    }

    async function fetchTemplate() {
      setIsLoading(true);
      setError(null);
      setRawMarkdown('');
      setProcessedMarkdown('');

      if (!templatePath) {
        console.warn(`[PreviewPane] No templatePath for docId: ${docId}, locale: ${locale}`);
        setError(t('Preview template not available for this document.', { ns: 'translation' }));
        setIsLoading(false);
        return;
      }
      
      const fetchUrl = templatePath.startsWith('/') ? templatePath : `/${templatePath}`;

      try {
        const response = await fetch(fetchUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch template (${response.status}): ${fetchUrl}`);
        }
        const text = await response.text();
        setRawMarkdown(text);
      } catch (err) {
        console.error("Error fetching Markdown template:", err);
        setError(err instanceof Error ? err.message : t('Could not load template.', { ns: 'translation' }));
        setRawMarkdown('');
      } finally {
        setIsLoading(false);
      }
    }
    fetchTemplate();
  }, [docId, locale, templatePath, docConfig, isHydrated, t]);

  const updatePreviewContent = useCallback((formData: Record<string, any>, currentRawMarkdown: string) => {
    if (!currentRawMarkdown) {
      return '';
    }
    let tempMd = currentRawMarkdown;
    for (const key in formData) {
      const placeholderRegex = new RegExp(`{{\\s*${key.trim()}\\s*}}`, 'g');
      const value = formData[key];
      tempMd = tempMd.replace(placeholderRegex, value ? `**${String(value)}**` : '____');
    }
    tempMd = tempMd.replace(/\{\{.*?\}\}/g, '____');
    return tempMd;
  }, []);

  const debouncedUpdatePreview = useMemo(
    () => debounce((formData: Record<string, any>, currentRawMarkdown: string) => {
      setProcessedMarkdown(updatePreviewContent(formData, currentRawMarkdown));
    }, 300),
    [updatePreviewContent]
  );

  useEffect(() => {
    if (!watch) { // If watch is not available (neither via prop nor context)
      console.warn("[PreviewPane] 'watch' function is not available. Live preview updates will not work.");
      if (rawMarkdown) setProcessedMarkdown(updatePreviewContent({}, rawMarkdown)); // Show initial template without form data
      return;
    }

    if (isLoading || !rawMarkdown || !isHydrated) {
      if (!isLoading && !rawMarkdown && isHydrated) {
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
  }, [watch, rawMarkdown, isLoading, isHydrated, debouncedUpdatePreview, updatePreviewContent]);


  if (!isHydrated) {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-muted-foreground p-4 bg-muted/50 rounded-md animate-pulse">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p>{t('Loading document preview...', { ns: 'translation' })}</p>
        </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[650px] text-muted-foreground p-4 bg-muted/50 rounded-md">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <p>{t('Loading document preview...', { ns: 'translation' })}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[650px] text-destructive p-4 bg-destructive/10 rounded-md text-center">
        <AlertTriangle className="h-8 w-8 mb-2" />
        <p className="font-semibold">{t('Error loading preview', { ns: 'translation' })}</p>
        <p className="text-xs mt-1">{error}</p>
      </div>
    );
  }

  if (!rawMarkdown && !isLoading) {
     return (
        <div className="flex flex-col items-center justify-center h-full min-h-[650px] text-muted-foreground p-4 bg-muted/50 rounded-md">
          <p>{t('Template not found or empty.', { ns: 'translation' })}</p>
        </div>
     );
  }

  return (
    <div
      id="live-preview"
      data-watermark={watermarkText}
      className="relative w-full min-h-[500px] md:min-h-[650px] h-full overflow-hidden rounded-lg bg-background shadow-md border border-border"
      style={{
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none',
      }}
    >
      <div className="prose prose-sm dark:prose-invert max-w-none w-full h-full overflow-y-auto p-4 md:p-6">
        <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
                p: ({node, ...props}) => <p {...props} className="select-none" />
            }}
        >
          {processedMarkdown || ''}
        </ReactMarkdown>
      </div>
    </div>
  );
}
