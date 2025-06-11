// src/components/DocumentDetail.tsx
'use client';

import React, { useEffect, useState, useMemo, Children, isValidElement } from 'react';
// Lazy load react-markdown to reduce initial bundle size
const ReactMarkdown = React.lazy(() => import('react-markdown'));
import { useTranslation } from 'react-i18next';
import { documentLibrary, type LegalDocument } from '@/lib/document-library';
import { Loader2, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import AutoImage from './AutoImage';
import { cn } from '@/lib/utils';
import { ClauseTooltip } from '@/components/ClauseTooltip';

function extractText(children: React.ReactNode): string {
  return Children.toArray(children).reduce((acc, child) => {
    if (typeof child === 'string') return acc + child;
    if (isValidElement(child)) return acc + extractText(child.props.children);
    return acc;
  }, '');
}

export interface DocumentDetailProps {
  docId: string;
  locale: 'en' | 'es';
  altText?: string;
  markdownContent?: string | null; // Add this line
}

const DocumentDetail = React.memo(function DocumentDetail({
  docId,
  locale,
  altText,
  markdownContent: initialMarkdown,
}: DocumentDetailProps) {
  const { t } = useTranslation('common');
  const [md, setMd] = useState<string>(initialMarkdown || ''); // Initialize with prop
  const [isLoading, setIsLoading] = useState(!initialMarkdown); // If no initial markdown, consider it loading (for fallback/image)
  const [error, setError] = useState<string | null>(null); // Error if initialMarkdown is null/undefined and no docConfig?
  const [isHydrated, setIsHydrated] = useState(false);
  const [remarkGfmPlugin, setRemarkGfmPlugin] = useState<unknown | null>(null);

  const docConfig = useMemo(
    () => documentLibrary.find((d: LegalDocument) => d.id === docId),
    [docId],
  );

  // const templatePath = useMemo(() => {
  //   if (!docConfig) return undefined;
  //   return `/templates/${locale}/${docId}.md`;
  // }, [docConfig, locale, docId]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Dynamically load remark-gfm only when markdown is provided
  useEffect(() => {
    if (initialMarkdown) {
      import('remark-gfm').then((mod) => {
        setRemarkGfmPlugin(() => mod.default ?? mod);
      });
    }
  }, [initialMarkdown]);

  // New useEffect to process initialMarkdown (e.g., title replacement, placeholder replacement)
  useEffect(() => {
    if (initialMarkdown && docConfig) {
      let modifiedMd = initialMarkdown;
      const documentDisplayNameForTitle =
        locale === 'es' && docConfig.translations?.es?.name
          ? docConfig.translations.es.name
          : docConfig.translations?.en?.name;
      if (documentDisplayNameForTitle) {
        modifiedMd = modifiedMd.replace(
          /^# .*/m,
          `# ${documentDisplayNameForTitle}`,
        );
      } else {
        const fallbackTitle =
          locale === 'es'
            ? docConfig.translations?.es?.name ||
              docConfig.translations?.en?.name ||
              docConfig.name
            : docConfig.translations?.en?.name ||
              docConfig.name ||
              docConfig.translations?.es?.name;
        if (fallbackTitle) {
          modifiedMd = modifiedMd.replace(/^# .*/m, `# ${fallbackTitle}`);
        }
      }
      modifiedMd = modifiedMd.replace(/{{[^}]+}}/g, '__________');
      setMd(modifiedMd);
      setIsLoading(false);
      setError(null);
    } else if (!initialMarkdown && docConfig) {
      // No markdown content passed, but we have a docConfig.
      // This means we should rely on the image preview.
      setMd('');
      setIsLoading(false); // Not loading markdown, but want to show image
      setError(null); // Not an error, just no markdown
    } else if (!docConfig && isHydrated) {
      setError(
        t('Document configuration not found.', {
          defaultValue: 'Document configuration not found.',
        }),
      );
      setIsLoading(false);
    }
  }, [initialMarkdown, docConfig, locale, t, isHydrated]); // Add dependencies

  // Initial loading state: Show if not hydrated, or if initialMarkdown is being processed and docConfig isn't ready.
  // isLoading is true if !initialMarkdown at the start, or until initialMarkdown processing is complete.
  if (!isHydrated || (isLoading && !docConfig && !initialMarkdown)) {
    return (
      <div className="flex flex-col items-center justify-center text-muted-foreground p-4 border rounded-lg bg-muted min-h-[300px] aspect-[8.5/11]">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <p>
          {t('Loading document details...', {
            defaultValue: 'Loading document details...',
          })}
        </p>
      </div>
    );
  }

  // Error state: If after hydration and loading attempts, docConfig is still not found,
  // and we don't have initialMarkdown to display.
  // The error state from useEffect (due to !docConfig) will be shown here.
  if (isHydrated && !isLoading && !docConfig && !initialMarkdown) {
    return (
      <div className="flex flex-col items-center justify-center text-destructive p-4 border rounded-lg bg-destructive/10 min-h-[300px] aspect-[8.5/11]">
        <AlertTriangle className="h-8 w-8 mb-2" />
        <p>
          {error ||
            t('Document configuration not found and no content provided.', {
              defaultValue:
                'Document configuration not found and no content provided.',
            })}
        </p>
      </div>
    );
  }

  // docConfig might be null here if initialMarkdown IS provided.
  const documentDisplayName =
    docConfig &&
    (locale === 'es' && docConfig.translations?.es?.name
      ? docConfig.translations.es.name
      : docConfig.translations?.en?.name || docConfig.name);
  const imgSrc = `/images/previews/${locale}/${docId}.png`;
  const fallbackAlt = altText || `${documentDisplayName || docId} preview`;
  const watermarkText = t('preview.watermark', { defaultValue: 'PREVIEW' });

  return (
    <div
      id="live-preview"
      data-watermark={watermarkText}
      className={cn(
        'relative w-full h-auto min-h-[500px] md:min-h-[650px]',
        'max-w-[850px] mx-auto border shadow-md bg-white dark:bg-background text-foreground',
        'overflow-hidden select-none aspect-[8.5/11]',
      )}
      style={{
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none',
      }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/70 z-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-sm text-muted-foreground">
            {t('Loading preview...', { defaultValue: 'Loading preview...' })}
          </p>
        </div>
      )}

      {!isLoading && error && !md && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/5 z-20 p-4 text-center">
          <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
          <p className="text-destructive text-sm font-semibold">
            {t('Error loading preview', {
              defaultValue: 'Error loading preview',
            })}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{error}</p>
        </div>
      )}

      {/* Case 1: Display Markdown if initialMarkdown was provided, processed into md, and no error occurred */}
      {!isLoading && !error && md && initialMarkdown ? (
        <div className="prose prose-sm dark:prose-invert max-w-none w-full h-full overflow-y-auto p-4 md:p-6 relative z-0 bg-white dark:bg-background text-foreground">
          <React.Suspense
            fallback={<Loader2 className="h-8 w-8 animate-spin" />}
          >
            <ReactMarkdown
              remarkPlugins={remarkGfmPlugin ? [remarkGfmPlugin] : []}
              components={{
                p: ({ node, ...props }) => (
                  <ClauseTooltip
                    id={`p-${node.position?.start.offset ?? Math.random()}`}
                    text={extractText(props.children)}
                  >
                    <p {...props} className="select-none" />
                  </ClauseTooltip>
                ),
                li: ({ node, ...props }) => (
                  <ClauseTooltip
                    id={`li-${node.position?.start.offset ?? Math.random()}`}
                    text={extractText(props.children)}
                  >
                    <li {...props} />
                  </ClauseTooltip>
                ),
                h1: (props) => <h1 {...props} className="text-center" />,
                // FIXED: ensure markdown images include dimensions
                img: ({ src = '', ...rest }: React.ImgHTMLAttributes<HTMLImageElement>) => (
                  <AutoImage src={src} {...rest} className="mx-auto" />
                ),
              }}
            >
              {md}
            </ReactMarkdown>
          </React.Suspense>
        </div>
      ) : // Case 2: Display Image Preview if no initialMarkdown was provided, not loading, no error, and docConfig IS available
      !isLoading && !error && !md && !initialMarkdown && docConfig ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground z-0 p-0 text-center">
          <Image
            src={imgSrc} // imgSrc relies on docId, which comes from docConfig
            alt={fallbackAlt} // fallbackAlt relies on documentDisplayName, which comes from docConfig
            width={850}
            height={1100}
            className="object-contain w-full h-full"
            data-ai-hint="document template screenshot"
            loading="lazy"
            onError={() => {
              console.warn(`[DocumentDetail] Image failed to load: ${imgSrc}.`);
            }}
          />
        </div>
      ) : // Case 3: Fallback "Preview not available" if not loading, no error, but neither markdown nor image can be shown
      // This can happen if !initialMarkdown and !docConfig (after loading attempt)
      !isLoading && !error && !md ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/70 z-20 p-4 text-center">
          <AlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            {t('Preview not available for this document.', {
              defaultValue: 'Preview not available for this document.',
            })}
          </p>
        </div>
      ) : null}
    </div>
  );
});

export default DocumentDetail;
