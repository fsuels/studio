// src/components/DocumentDetail.tsx
'use client';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { documentLibrary } from '@/lib/document-library'; // Import documentLibrary

interface DocumentDetailProps {
  locale: 'en' | 'es';
  docId: string;
  altText?: string; // Renamed from alt to altText
}

export default function DocumentDetail({ locale, docId, altText }: DocumentDetailProps) {
  const { t } = useTranslation();
  const [md, setMd] = useState<string>('');
  const [imgSrc, setImgSrc] = useState<string>('');
  const [imgError, setImgError] = useState(false);
  const [mdError, setMdError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const docConfig = documentLibrary.find((d) => d.id === docId);
  const fallbackAlt = docConfig ? (locale === 'es' && docConfig.name_es ? docConfig.name_es : docConfig.name) + ' preview' : `${docId} preview`;


  useEffect(() => {
    setIsLoading(true);
    setImgError(false);
    setMdError(false);
    setMd('');

    const markdownPath = `/templates/${locale}/${docId}.md`;
    const imagePath = `/images/previews/${locale}/${docId}.png`;

    console.log(`[DocumentDetail] Fetching for locale: ${locale}, docId: ${docId}`);
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

  const placeholderLoading = locale === 'es' ? t('Cargando vista previa del documento…', {defaultValue: 'Cargando vista previa del documento…'}) : t('Loading document preview…', {defaultValue: 'Loading document preview…'});
  const placeholderError = locale === 'es' ? t('Vista previa no disponible.', {defaultValue: 'Vista previa no disponible.'}) : t('Preview not available.', {defaultValue: 'Preview not available.'});


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
          alt={altText ?? fallbackAlt} // Use altText or fallbackAlt
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
