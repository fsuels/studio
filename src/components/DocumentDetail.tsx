// src/components/DocumentDetail.tsx
'use client';

import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { documentLibrary, type LegalDocument } from '@/lib/document-library'; // Import LegalDocument type
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'; // Import React for useState, useEffect

interface DocumentDetailProps {
  docId: string;
  locale: 'en' | 'es'; // Use specific locale types
  altText?: string;
}

export default function DocumentDetail({ docId, locale, altText }: DocumentDetailProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  const doc = documentLibrary.find((d: LegalDocument) => d.id === docId); // Explicitly type d

  useEffect(() => {
    // Reset loading/error states when docId or locale changes
    setIsLoading(true);
    setImgError(false);
  }, [docId, locale]);

  if (!doc) {
    // Handle case where document is not found, though this should ideally be caught by the page
    return <p>{t('Document not found', { defaultValue: 'Document not found' })}</p>;
  }

  const imgSrc = `/images/previews/${locale}/${docId}.png`;
  const fallbackAlt = altText ?? (locale === 'es' && doc.name_es ? doc.name_es : doc.name) + ` ${t('preview')}`;

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImgError(true);
    console.warn(`[DocumentDetail] Preview image not found or failed to load: ${imgSrc}`);
  };


  return (
    <div
      className="relative w-full h-auto max-w-[850px] mx-auto border shadow-md bg-white overflow-hidden select-none aspect-[8.5/11]"
      style={{
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none',
      }}
    >
      {isLoading && !imgError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      {!isLoading && imgError && (
         <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-20">
           <p className="text-destructive text-sm p-4">{t('Preview image failed to load.', {defaultValue: 'Preview image failed to load.'})}</p>
         </div>
      )}
      <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
        <span
          className="text-6xl font-bold text-gray-300 opacity-25 rotate-[315deg]"
          style={{ fontSize: '5rem' }}
        >
          {t('preview.watermark', {defaultValue: 'PREVIEW'})}
        </span>
      </div>
      <Image
        src={imgSrc}
        alt={fallbackAlt} // Use fallbackAlt which includes altText if provided
        width={850}
        height={1100}
        className="w-full h-auto relative z-0 object-contain"
        priority // Preload image as it's likely LCP on detail pages
        onLoad={handleImageLoad}
        onError={handleImageError}
        unoptimized={process.env.NODE_ENV === 'development'} // Useful for local dev if image paths are tricky
        data-ai-hint="document template screenshot" // Keep AI hint
      />
    </div>
  );
}
