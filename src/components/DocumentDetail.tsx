// src/components/DocumentDetail.tsx
'use client';

import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { documentLibrary, type LegalDocument } from '@/lib/document-library';
import { Loader2, AlertTriangle } from 'lucide-react'; // Added AlertTriangle
import React, { useEffect, useState } from 'react';

interface DocumentDetailProps {
  docId: string;
  locale: 'en' | 'es';
  altText?: string;
}

export default function DocumentDetail({ docId, locale, altText }: DocumentDetailProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [attemptedImgSrc, setAttemptedImgSrc] = useState('');

  const doc = documentLibrary.find((d: LegalDocument) => d.id === docId);

  useEffect(() => {
    // Reset loading/error states when docId or locale changes
    setIsLoading(true);
    setImgError(false);
    setAttemptedImgSrc(`/images/previews/${locale}/${docId}.png`); // Set imgSrc for potential error display
  }, [docId, locale]);

  if (!doc) {
    // This case should ideally be caught by notFound() on the page level
    return (
      <div className="flex flex-col items-center justify-center text-destructive p-4 border rounded-lg bg-destructive/10 min-h-[300px]">
        <AlertTriangle className="h-8 w-8 mb-2" />
        <p className="font-semibold">{t('Document configuration not found for ID:', {defaultValue: 'Document configuration not found for ID:'})} {docId}</p>
      </div>
    );
  }

  const imgSrc = `/images/previews/${locale}/${docId}.png`;
  // Use doc.name (or its translation) for a more descriptive default alt text
  const documentDisplayName = locale === 'es' && doc.name_es ? doc.name_es : doc.name;
  const fallbackAlt = altText ?? `${documentDisplayName} ${t('preview.watermark', 'preview')}`;


  const handleImageLoad = () => {
    setIsLoading(false);
    setImgError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImgError(true);
    console.warn(`[DocumentDetail] Preview image not found or failed to load: ${attemptedImgSrc}`);
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
      {/* Watermark */}
      <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
        <span
          className="text-6xl font-bold text-gray-300 opacity-25 rotate-[315deg]"
          style={{ fontSize: '5rem' }} // Consistent with previous styling
        >
          {t('preview.watermark', {defaultValue: 'PREVIEW'})}
        </span>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/70 z-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-sm text-muted-foreground">{t('Loading preview...', {defaultValue: 'Loading preview...'})}</p>
        </div>
      )}

      {/* Error State */}
      {!isLoading && imgError && (
         <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/5 z-20 p-4 text-center">
           <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
           <p className="text-destructive text-sm font-semibold">{t('Preview image failed to load.', {defaultValue: 'Preview image failed to load.'})}</p>
           <p className="text-xs text-muted-foreground mt-1">
             {t('Attempted path:', {defaultValue: 'Attempted path:'})} <code className="text-xs bg-muted p-0.5 rounded">{attemptedImgSrc}</code>
            </p>
         </div>
      )}

      {/* Image - hidden if loading or error to prevent broken image icon */}
      <Image
        src={imgSrc}
        alt={fallbackAlt}
        width={850}
        height={1100}
        className="w-full h-auto relative z-0 object-contain"
        priority // Preload if it's LCP
        onLoad={handleImageLoad}
        onError={handleImageError}
        unoptimized={process.env.NODE_ENV === 'development'} // Useful for local dev
        data-ai-hint="document template screenshot"
        style={{ visibility: isLoading || imgError ? 'hidden' : 'visible' }} // Control visibility
      />
    </div>
  );
}
