// src/components/PreviewPane.tsx
'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useFormContext } from 'react-hook-form'; 
import { Loader2, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { debounce } from 'lodash-es';
import { documentLibrary, type LegalDocument } from '@/lib/document-library';
import { cn } from '@/lib/utils';
import Image from 'next/image'; // Import next/image

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
  const [imageError, setImageError] = useState(false);

  const docConfig = useMemo(() => documentLibrary.find(d => d.id === docId), [docId]);
  const templatePath = locale === 'es' && docConfig?.templatePath_es ? docConfig.templatePath_es : docConfig?.templatePath;
  const watermarkText = t('preview.watermark', { ns: 'translation', defaultValue: 'PREVIEW' });
  const imgSrc = `/images/previews/${locale}/${docId}.png`;

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
      setImageError(false); // Reset image error on new fetch
      setRawMarkdown('');
      setProcessedMarkdown('');

      if (!templatePath) {
        console.warn(`[PreviewPane] No templatePath for docId: ${docId}, locale: ${locale}. Will attempt image fallback.`);
        // No direct error here, will try to load image first if MD fetch isn't attempted.
        setIsLoading(false); // Stop loading MD as there's no path
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
    
    let titleToUse = docConfig?.name;
    if (locale === 'es' && docConfig?.name_es) {
      titleToUse = docConfig.name_es;
    }
    if (titleToUse) {
       tempMd = tempMd.replace(/^# .*/m, `# ${titleToUse}`);
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
      if (rawMarkdown) setProcessedMarkdown(updatePreviewContent({}, rawMarkdown)); 
      return;
    }

    if (isLoading || !isHydrated) return;
    
    // Initial update, and set up watcher if rawMarkdown is available
    if (rawMarkdown) {
      debouncedUpdatePreview(watch(), rawMarkdown);
      const subscription = watch((formData) => {
        debouncedUpdatePreview(formData as Record<string, any>, rawMarkdown);
      });
      return () => {
        subscription.unsubscribe();
        debouncedUpdatePreview.cancel();
      };
    } else {
      // If rawMarkdown is not available (e.g. no templatePath), clear processedMarkdown
      setProcessedMarkdown('');
    }
    
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

  // If Markdown successfully loaded and processed, show it
  if (!error && rawMarkdown && processedMarkdown) {
    return (
      <div
        id="live-preview"
        data-watermark={watermarkText}
        className="relative w-full h-full bg-background" 
        style={{ userSelect: 'none' }}
      >
        <div className={cn("prose prose-sm dark:prose-invert max-w-none w-full h-full overflow-y-auto overflow-x-hidden p-4 md:p-6 scrollbar-hide bg-background text-foreground")}>
          <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{ p: ({node, ...props}) => <p {...props} className="select-none" /> }}
          >
            {processedMarkdown}
          </ReactMarkdown>
        </div>
      </div>
    );
  }

  // If Markdown fetch failed OR no templatePath was provided, AND image hasn't errored yet, try to show image
  if ((error || !templatePath) && !imageError) {
    return (
      <div
        id="live-preview"
        data-watermark={watermarkText}
        className="relative w-full h-full bg-background"
        style={{ userSelect: 'none' }}
      >
        <Image
          src={imgSrc}
          alt={`${docId} preview fallback`}
          width={850}
          height={1100}
          className="object-contain w-full h-full"
          loading="lazy"
          data-ai-hint="document template screenshot"
          onError={() => {
            console.warn(`[PreviewPane] Fallback image also failed to load: ${imgSrc}`);
            setImageError(true);
          }}
        />
      </div>
    );
  }
  
  // If both Markdown and Image have failed, or if there was an error and no templatePath
  if (error || imageError || (!templatePath && !rawMarkdown && !isLoading)) {
     return (
        <div className="flex flex-col items-center justify-center h-full text-destructive p-4 text-center">
          <AlertTriangle className="h-8 w-8 mb-2" />
          <p className="font-semibold">{error ? t('Error loading preview', { ns: 'translation' }) : t('Preview Unavailable', { ns: 'translation'})}</p>
          {error && <p className="text-xs mt-1">{error}</p>}
          {imageError && !error && <p className="text-xs mt-1">{t('Image preview could not be loaded.')}</p>}
        </div>
     );
  }

  // Fallback for any other unhandled state (should ideally not be reached)
  return (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
      <p>{t('Preview not available.', { ns: 'translation' })}</p>
    </div>
  );
}