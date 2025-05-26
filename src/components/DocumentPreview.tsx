// src/components/DocumentPreview.tsx
'use client';

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import AutoImage from './AutoImage';
import { Loader2 } from 'lucide-react';

interface DocumentPreviewProps {
  docId: string;
  locale?: 'en' | 'es';
  alt?: string;
}

const DocumentPreview = React.memo(function DocumentPreview({
  docId,
  locale = 'en',
  alt,
}: DocumentPreviewProps) {
  const { t } = useTranslation('common');
  const [imgExists, setImgExists] = useState<boolean>(true);
  const [md, setMd] = useState<string>('');
  const [isLoadingMd, setIsLoadingMd] = useState<boolean>(false);
  const [errorMd, setErrorMd] = useState<string | null>(null);

  const imgSrc = `/images/previews/${locale}/${docId}.png`;
  const defaultAlt =
    alt ??
    (locale === 'es' ? t(`Vista previa de ${docId}`) : t(`${docId} preview`));

  const handleImgError = () => {
    console.warn(
      `[DocumentPreview] Image not found or failed to load: ${imgSrc}. Falling back to Markdown.`,
    );
    setImgExists(false);
  };

  useEffect(() => {
    if (!imgExists) {
      setIsLoadingMd(true);
      setErrorMd(null);
      fetch(`/templates/${locale}/${docId}.md`)
        .then((r) => {
          if (!r.ok) {
            throw new Error(
              `Failed to fetch Markdown template (${r.status}): /templates/${locale}/${docId}.md`,
            );
          }
          return r.text();
        })
        .then((text) => {
          setMd(text);
          setIsLoadingMd(false);
        })
        .catch((err) => {
          console.error(
            `[DocumentPreview] Error fetching Markdown for ${docId} (${locale}):`,
            err,
          );
          setMd('');
          setErrorMd(
            err.message ||
              t('Error loading preview content.', {
                defaultValue: 'Error loading preview content.',
              }),
          );
          setIsLoadingMd(false);
        });
    }
  }, [docId, locale, imgExists, t]);

  return (
    <div className="relative w-full h-full overflow-auto rounded-lg bg-white shadow border border-border">
      <div className="absolute inset-0 select-none pointer-events-none z-20" />
      <div
        className="absolute inset-0 flex items-center justify-center z-10 select-none pointer-events-none
                   text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-widest opacity-10 rotate-[-35deg] text-muted-foreground"
      >
        {locale === 'es'
          ? t('VISTA PREVIA', 'VISTA PREVIA')
          : t('PREVIEW', 'PREVIEW')}
      </div>

      {imgExists ? (
        <Image
          src={imgSrc}
          alt={defaultAlt}
          width={850}
          height={1100}
          loading="lazy" // Added lazy loading
          className="object-contain w-full h-full"
          onError={handleImgError}
          priority={false} // Set to false for lazy loading
          unoptimized={process.env.NODE_ENV === 'development'}
          data-ai-hint="document template screenshot"
        />
      ) : isLoadingMd ? (
        <div className="flex flex-col items-center justify-center text-muted-foreground h-full p-4">
          <Loader2 className="h-6 w-6 animate-spin mb-2" />
          <p className="text-center text-sm ">
            {t('Loading preview…', { defaultValue: 'Loading preview…' })}
          </p>
        </div>
      ) : errorMd ? (
        <p className="text-center text-sm text-destructive p-4 h-full flex items-center justify-center">
          {errorMd}
        </p>
      ) : md ? (
        <div className="prose prose-sm dark:prose-invert max-w-none w-full h-full overflow-y-auto p-4 md:p-6 bg-background text-foreground">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: (props) => <p {...props} className="select-none" />,
              // FIXED: ensure images have explicit dimensions
              img: ({ src = '', ...rest }: React.ImgHTMLAttributes<HTMLImageElement>) => (
                <AutoImage src={src} {...rest} className="mx-auto" />
              ),
            }}
          >
            {md}
          </ReactMarkdown>
        </div>
      ) : (
        <p className="text-center text-sm text-muted-foreground h-full flex items-center justify-center p-4">
          {t('Preview not available.', {
            defaultValue: 'Preview not available.',
          })}
        </p>
      )}
    </div>
  );
});
export default DocumentPreview;
