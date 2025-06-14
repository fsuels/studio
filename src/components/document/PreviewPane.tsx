// src/components/PreviewPane.tsx
'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useFormContext } from 'react-hook-form';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { debounce } from '@/lib/debounce';
import { documentLibrary } from '@/lib/document-library';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import AutoImage from '../AutoImage';

interface PreviewPaneProps {
  locale: 'en' | 'es';
  docId: string;
}

export default function PreviewPane({ locale, docId }: PreviewPaneProps) {
  const { t } = useTranslation('common');
  const { watch } = useFormContext();

  const [rawMarkdown, setRawMarkdown] = useState<string>('');
  const [processedMarkdown, setProcessedMarkdown] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [imageError, setImageError] = useState(false);

  const docConfig = useMemo(
    () => documentLibrary.find((d) => d.id === docId),
    [docId],
  );

  // Use the new standardized template path structure
  const templatePath = useMemo(() => {
    if (!docConfig) return undefined;
    return `/templates/${locale}/${docId}.md`; // Path relative to public folder
  }, [docConfig, locale, docId]);

  const watermarkText = t('preview.watermark', {
    ns: 'translation',
    defaultValue: 'PREVIEW',
  });
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
      setImageError(false);
      setRawMarkdown('');
      setProcessedMarkdown('');

      if (!templatePath) {
        console.warn(
          `[PreviewPane] No templatePath for docId: ${docId}, locale: ${locale}. Will attempt image fallback.`,
        );
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(templatePath); // Path is already absolute from public
        if (!response.ok) {
          throw new Error(
            `Failed to fetch template (${response.status}): ${templatePath}`,
          );
        }
        const text = await response.text();
        setRawMarkdown(text);
      } catch (err) {
        console.error('Error fetching Markdown template:', err);
        setError(
          err instanceof Error
            ? err.message
            : t('Could not load template.', { ns: 'translation' }),
        );
        setRawMarkdown('');
      } finally {
        setIsLoading(false);
      }
    }
    fetchTemplate();
  }, [docId, locale, templatePath, docConfig, isHydrated, t]);

  const updatePreviewContent = useCallback(
    (formData: Record<string, unknown>, currentRawMarkdown: string) => {
      if (!currentRawMarkdown) {
        return '';
      }
      let tempMd = currentRawMarkdown;
      for (const key in formData) {
        const placeholderRegex = new RegExp(`{{\\s*${key.trim()}\\s*}}`, 'g');
        const value = formData[key];
        tempMd = tempMd.replace(
          placeholderRegex,
          value ? `**${String(value)}**` : '____',
        );
      }
      tempMd = tempMd.replace(/\{\{.*?\}\}/g, '____');

      let titleToUse = docConfig?.translations?.en?.name; // Default to English name
      if (locale === 'es' && docConfig?.translations?.es?.name) {
        titleToUse = docConfig.translations.es.name;
      } else if (docConfig?.name) {
        // Fallback to root name if translations are missing
        titleToUse = docConfig.name;
      }

      if (titleToUse) {
        tempMd = tempMd.replace(/^# .*/m, `# ${titleToUse}`);
      }

      return tempMd;
    },
    [docConfig, locale],
  );

  const debouncedUpdatePreview = useMemo(
    () =>
      debounce<[Record<string, unknown>, string]>(
        (formData, currentRawMarkdown) => {
          setProcessedMarkdown(
            updatePreviewContent(formData, currentRawMarkdown),
          );
        },
        300,
      ),
    [updatePreviewContent],
  );

  useEffect(() => {
    if (!watch || !isHydrated || isLoading) {
      if (rawMarkdown && !isLoading)
        setProcessedMarkdown(updatePreviewContent({}, rawMarkdown));
      return;
    }

    debouncedUpdatePreview(
      watch() as Record<string, unknown>,
      rawMarkdown,
    );
    const subscription = watch((formData) => {
      debouncedUpdatePreview(formData as Record<string, unknown>, rawMarkdown);
    });
    return () => {
      subscription.unsubscribe();
      debouncedUpdatePreview.cancel();
    };
  }, [
    watch,
    rawMarkdown,
    isLoading,
    isHydrated,
    debouncedUpdatePreview,
    updatePreviewContent,
  ]);

  if (!isHydrated) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4 animate-pulse bg-muted rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <p>
          {t('Loading document preview...', {
            ns: 'translation',
            defaultValue: 'Loading document preview...',
          })}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4 bg-muted rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <p>
          {t('Loading document preview...', {
            ns: 'translation',
            defaultValue: 'Loading document preview...',
          })}
        </p>
      </div>
    );
  }

  if (!error && rawMarkdown && processedMarkdown) {
    return (
      <div
        id="live-preview"
        data-watermark={watermarkText}
        className="relative w-full h-full bg-card text-card-foreground rounded-lg overflow-hidden"
        style={{ userSelect: 'none' }}
      >
        <div
          className={cn(
            'prose prose-sm max-w-none w-full h-full overflow-y-auto overflow-x-hidden p-4 md:p-6 scrollbar-hide bg-card text-card-foreground',
          )}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: (props) => <p {...props} className="select-none" />,
              h1: (props) => <h1 {...props} className="text-center" />,
              // FIXED: ensure markdown images include dimensions
              img: ({
                src = '',
                ...rest
              }: React.ImgHTMLAttributes<HTMLImageElement>) => (
                <AutoImage src={src} {...rest} className="mx-auto" />
              ),
            }}
          >
            {processedMarkdown}
          </ReactMarkdown>
        </div>
      </div>
    );
  }

  if ((error || !templatePath) && !imageError) {
    return (
      <div
        id="live-preview"
        data-watermark={watermarkText}
        className="relative w-full h-full bg-card text-card-foreground rounded-lg overflow-hidden"
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
            console.warn(
              `[PreviewPane] Fallback image also failed to load: ${imgSrc}`,
            );
            setImageError(true);
          }}
        />
      </div>
    );
  }

  if (error || imageError || (!templatePath && !rawMarkdown && !isLoading)) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-destructive p-4 text-center bg-destructive/5 rounded-lg">
        <AlertTriangle className="h-8 w-8 mb-2" />
        <p className="font-semibold">
          {error
            ? t('Error loading preview', {
                ns: 'translation',
                defaultValue: 'Error loading preview',
              })
            : t('Preview Unavailable', {
                ns: 'translation',
                defaultValue: 'Preview Unavailable',
              })}
        </p>
        {error && <p className="text-xs mt-1">{error}</p>}
        {imageError && !error && (
          <p className="text-xs mt-1">
            {t('Image preview could not be loaded.', {
              ns: 'translation',
              defaultValue: 'Image preview could not be loaded.',
            })}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4 bg-muted rounded-lg">
      <p>
        {t('Preview not available.', {
          ns: 'translation',
          defaultValue: 'Preview not available.',
        })}
      </p>
    </div>
  );
}
