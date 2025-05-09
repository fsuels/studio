// src/components/PreviewPane.tsx
'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useFormContext, type UseFormWatch } from 'react-hook-form'; 
import { Loader2, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { debounce } from 'lodash-es';
import { documentLibrary, type LegalDocument } from '@/lib/document-library';
import { cn } from '@/lib/utils';

interface PreviewPaneProps {
  locale: 'en' | 'es';
  docId: string;
}

export default function PreviewPane({ locale, docId }: PreviewPaneProps) {
  const { t } = useTranslation();
  const { watch } = useFormContext();


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
    tempMd = tempMd.replace(/\{\{.*?\}\}/g, '____'); // Replace any remaining placeholders
    if (docConfig?.name_es && locale === 'es') {
        tempMd = tempMd.replace(/^# .*/, `# ${docConfig.name_es}`);
    } else if (docConfig?.name) {
        tempMd = tempMd.replace(/^# .*/, `# ${docConfig.name}`);
    }
    return tempMd;
  }, [docConfig, locale]);

  const debouncedUpdatePreview = useMemo(
    () => debounce((formData: Record<string, any>, currentRawMarkdown: string) => {
      setProcessedMarkdown(updatePreviewContent(formData, currentRawMarkdown));
    }, 300),
    [updatePreviewContent]
  );

  useEffect(() => {
    if (!watch) { 
      console.warn("[PreviewPane] 'watch' function is not available. Live preview updates will not work.");
      if (rawMarkdown) setProcessedMarkdown(updatePreviewContent({}, rawMarkdown)); 
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
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4 animate-pulse">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p>{t('Loading document preview...', { ns: 'translation' })}</p>
        </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <p>{t('Loading document preview...', { ns: 'translation' })}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-destructive p-4 text-center">
        <AlertTriangle className="h-8 w-8 mb-2" />
        <p className="font-semibold">{t('Error loading preview', { ns: 'translation' })}</p>
        <p className="text-xs mt-1">{error}</p>
      </div>
    );
  }

  if (!rawMarkdown && !isLoading) {
     return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
          <p>{t('Template not found or empty.', { ns: 'translation' })}</p>
        </div>
     );
  }

  return (
    <div
      id="live-preview"
      data-watermark={watermarkText}
      className="relative w-full h-full" // Simplified: parent controls bg, border, shadow, overflow
      style={{
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none',
      }}
    >
      {/* Watermark - stays the same */}
      <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
        <span
          className="text-6xl font-bold text-gray-300/50 opacity-25 rotate-[315deg]"
          style={{ fontSize: '5rem' }}
        >
          {watermarkText}
        </span>
      </div>

      {/* Markdown content container with scrollbar visually hidden */}
      <div className={cn("prose prose-sm dark:prose-invert max-w-none w-full h-full overflow-y-auto p-4 md:p-6 scrollbar-hide")}>
        <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
                p: ({node, ...props}) => <p {...props} className="select-none" />,
                h1: ({node, ...props}) => <h1 {...props} className="text-center select-none" />, // Center H1
            }}
        >
          {processedMarkdown || ''}
        </ReactMarkdown>
      </div>
    </div>
  );
}
