// src/components/DocumentDetail.tsx
'use client';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslation } from 'react-i18next';
import Image from 'next/image'; 
import { Loader2 } from 'lucide-react'; 

interface DocumentDetailProps {
  locale: 'en' | 'es'; // Changed from string to specific union type
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
    setMd(''); // Clear previous markdown content

    const markdownPath = `/templates/${locale}/${docId}.md`;
    const imagePath = `/images/previews/${locale}/${docId}.png`;
    
    console.log(`[DocumentDetail] Fetching for locale: ${locale}, docId: ${docId}`);
    console.log(`[DocumentDetail] Markdown path: ${markdownPath}`);
    console.log(`[DocumentDetail] Image path: ${imagePath}`);

    setImgSrc(imagePath); 

    fetch(markdownPath)
      .then((r) => {
        if (!r.ok) {
          console.error(`[DocumentDetail] Failed to fetch ${markdownPath}: ${r.status}`);
          setMdError(true);
          throw new Error(`Failed to fetch ${locale}/${docId}.md`);
        }
        return r.text();
      })
      .then(text => {
        setMd(text);
        setMdError(false); // Ensure mdError is reset on successful fetch
      })
      .catch(err => {
        console.error(`[DocumentDetail] Error fetching markdown for ${docId} (${locale}):`, err);
        setMdError(true);
      })
      .finally(() => setIsLoading(false));
  }, [locale, docId]); // Add locale and docId as dependencies

  const handleImgError = () => {
    console.warn(`[DocumentDetail] Preview image not found or failed to load: ${imgSrc}`);
    setImgError(true); 
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
          priority 
          unoptimized={process.env.NODE_ENV === 'development'}
          data-ai-hint="document template screenshot"
          key={imgSrc} // Add key to force re-render on src change
        />
      ) : mdError || !md ? (
         <div className="flex items-center justify-center h-full">
            <p className="text-center text-sm text-muted-foreground p-4">{placeholderError}</p>
         </div>
      ) : (
        <div className="prose prose-sm dark:prose-invert max-w-none w-full h-full overflow-y-auto p-1 md:p-2 bg-background text-foreground">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{md}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
