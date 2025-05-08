// src/components/DocumentDetail.tsx
'use client';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslation } from 'react-i18next';
import Image from 'next/image'; 
import { Loader2 } from 'lucide-react'; 

interface DocumentDetailProps {
  locale: 'en' | 'es'; 
  docId: string;
}

export default function DocumentDetail({ locale, docId }: DocumentDetailProps) {
  const { t } = useTranslation(); // t function can still be used for other fixed strings if needed
  const [md, setMd] = useState<string>('');
  const [imgSrc, setImgSrc] = useState<string>('');
  const [imgError, setImgError] = useState(false);
  const [mdError, setMdError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setImgError(false);
    setMdError(false);
    setMd(''); 

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
        setMdError(false); 
      })
      .catch(err => {
        console.error(`[DocumentDetail] Error fetching markdown for ${docId} (${locale}):`, err);
        setMdError(true);
      })
      .finally(() => setIsLoading(false));
  }, [locale, docId]); 

  const handleImgError = () => {
    console.warn(`[DocumentDetail] Preview image not found or failed to load: ${imgSrc}`);
    setImgError(true); 
  };
  
  // Use locale directly for loading text, t() not needed for this dynamic part
  const placeholderLoading = locale === 'es' ? 'Cargando vista previa del documento…' : 'Loading document preview…';
  const placeholderError = locale === 'es' ? 'Vista previa no disponible.' : 'Preview not available.';


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
          alt={alt ?? `${docId} preview`} // Use alt from props or construct default
          width={850} 
          height={1100}
          className="object-contain w-full h-full"
          onError={handleImgError}
          priority 
          unoptimized={process.env.NODE_ENV === 'development'}
          data-ai-hint="document template screenshot"
          key={imgSrc} 
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

interface DocumentDetailProps {
  locale: 'en' | 'es'; 
  docId: string;
  alt?: string; // Added alt prop
}
