// src/components/DocumentDetail.tsx
'use client';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslation } from 'react-i18next';
import Image from 'next/image'; // For optimized images
import { Loader2 } from 'lucide-react'; // For loading state

interface DocumentDetailProps {
  locale: 'en' | 'es';
  docId: string;
}

export default function DocumentDetail({ locale, docId }: DocumentDetailProps) {
  const { t } = useTranslation();
  const [md, setMd] = useState<string>('');
  const [imgSrc, setImgSrc] = useState<string>('');
  const [imgError, setImgError] = useState(false);
  const [mdError, setMdError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setImgError(false);
    setMdError(false);

    const markdownPath = `/templates/${locale}/${docId}.md`;
    const imagePath = `/images/previews/${locale}/${docId}.png`;
    setImgSrc(imagePath); // Set image path for preview

    fetch(markdownPath)
      .then((r) => {
        if (!r.ok) {
          console.error(`Failed to fetch ${markdownPath}: ${r.status}`);
          setMdError(true);
          throw new Error(`Failed to fetch ${locale}/${docId}.md`);
        }
        return r.text();
      })
      .then(setMd)
      .catch(err => {
        console.error(`Error fetching markdown for ${docId} (${locale}):`, err);
        setMdError(true);
      })
      .finally(() => setIsLoading(false));
  }, [locale, docId]);

  const handleImgError = () => {
    console.warn(`Preview image not found or failed to load: ${imgSrc}`);
    setImgError(true); // This will hide the <img> tag
  };
  
  const placeholderLoading = t('Loading document preview…', {defaultValue: 'Loading document preview…'});
  const placeholderError = t('Preview not available.', {defaultValue: 'Preview not available.'});


  if (isLoading) {
    return (
      <div className="flex items-center justify-center border rounded-lg bg-muted p-4 aspect-[8.5/11] max-h-[500px] md:max-h-[700px] w-full shadow-lg">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">{placeholderLoading}</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-background shadow-xl p-2 md:p-3 aspect-[8.5/11] max-h-[500px] md:max-h-[700px] w-full">
      {!imgError ? (
        <Image
          src={imgSrc}
          alt={t(`${docId} preview`, {defaultValue: `${docId} preview`})}
          width={850} 
          height={1100}
          className="object-contain w-full h-full"
          onError={handleImgError}
          priority // Consider if this is LCP if it's often the main content
          unoptimized={process.env.NODE_ENV === 'development'} // Useful for local dev with non-optimized images
          data-ai-hint="document template screenshot"
        />
      ) : mdError || !md ? (
         <div className="flex items-center justify-center h-full">
            <p className="text-center text-sm text-muted-foreground p-4">{placeholderError}</p>
         </div>
      ) : (
        <div className="prose prose-sm dark:prose-invert max-w-none w-full h-full overflow-y-auto p-1 md:p-2">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{md}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}