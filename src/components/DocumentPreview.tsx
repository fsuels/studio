// src/components/DocumentPreview.tsx
'use client';

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import Image from 'next/image'; // Use next/image for optimization

interface DocumentPreviewProps {
  docId: string;          // e.g. "bill-of-sale-vehicle"
  locale?: 'en' | 'es';     // defaults to 'en'
  alt?: string; // Added alt prop
}

export default function DocumentPreview({
  docId,
  locale = 'en',
  alt,
}: DocumentPreviewProps) {
  const { t } = useTranslation();
  const [imgExists, setImgExists] = useState<boolean>(true); // Assume image exists initially
  const [md, setMd] = useState<string>('');
  const [isLoadingMd, setIsLoadingMd] = useState<boolean>(false);
  const [errorMd, setErrorMd] = useState<string | null>(null);

  // 1) Try loading the static preview PNG
  const imgSrc = `/images/previews/${locale}/${docId}.png`;
  const defaultAlt = alt ?? (locale === 'es' ? t(`Vista previa de ${docId}`) : t(`${docId} preview`));

  // onError → hide image and load markdown
  const handleImgError = () => {
    console.warn(`[DocumentPreview] Image not found or failed to load: ${imgSrc}. Falling back to Markdown.`);
    setImgExists(false);
  };

  // 2) If image is missing or errored, fetch the Markdown live
  useEffect(() => {
    if (!imgExists) {
      setIsLoadingMd(true);
      setErrorMd(null);
      fetch(`/templates/${locale}/${docId}.md`)
        .then(r => {
          if (!r.ok) {
            throw new Error(`Failed to fetch Markdown template (${r.status}): /templates/${locale}/${docId}.md`);
          }
          return r.text();
        })
        .then(text => {
          setMd(text);
          setIsLoadingMd(false);
        })
        .catch(err => {
          console.error(`[DocumentPreview] Error fetching Markdown for ${docId} (${locale}):`, err);
          setMd(''); // Clear any previous markdown
          setErrorMd(err.message || t('Error loading preview content.', {defaultValue: 'Error loading preview content.'}));
          setIsLoadingMd(false);
        });
    }
  }, [docId, locale, imgExists, t]);

  return (
    <div className="border rounded-lg overflow-hidden bg-muted p-2 md:p-4 aspect-[8.5/11] max-h-[500px] md:max-h-[600px] w-full flex items-center justify-center shadow-lg">
      {imgExists ? (
        <Image
          src={imgSrc}
          alt={defaultAlt}
          width={850} // Intrinsic width of a letter page at higher DPI for quality
          height={1100} // Intrinsic height
          className="object-contain w-full h-full"
          onError={handleImgError}
          priority // Consider if this is LCP
          unoptimized={process.env.NODE_ENV === 'development'}
          data-ai-hint="document template screenshot"
        />
      ) : isLoadingMd ? (
        <p className="text-center text-sm text-muted-foreground animate-pulse">
          {t('Loading preview…', {defaultValue: 'Loading preview…'})}
        </p>
      ) : errorMd ? (
        <p className="text-center text-sm text-destructive p-4">
          {errorMd}
        </p>
      ) : md ? (
        <div className="prose prose-sm dark:prose-invert max-w-none w-full h-full overflow-y-auto p-2 bg-background text-foreground">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {md}
          </ReactMarkdown>
        </div>
      ) : (
         <p className="text-center text-sm text-muted-foreground">
           {t('Preview not available.', {defaultValue: 'Preview not available.'})}
         </p>
      )}
    </div>
  );
}
