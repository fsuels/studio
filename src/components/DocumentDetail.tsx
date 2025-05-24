// src/components/DocumentDetail.tsx
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslation } from 'react-i18next';
import { documentLibrary, type LegalDocument } from '@/lib/document-library/index';
import { Loader2, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import AutoImage from './AutoImage';
import { cn } from '@/lib/utils';
import { getTemplatePath } from '@/lib/templateUtils'; // Centralized util

interface DocumentDetailProps {
  docId: string;
  locale: 'en' | 'es';
  country: string;
  altText?: string;
  liveData?: Record<string, any>;
}

const DocumentDetail = React.memo(function DocumentDetail({ docId, locale, country, altText, liveData }: DocumentDetailProps) {
  const { t } = useTranslation("common");
  const [md, setMd] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const docConfig = useMemo(() => documentLibrary.find((d: LegalDocument) => d.id === docId), [docId]);

  const templatePath = useMemo(() => {
    if (!docConfig) return undefined;
    return getTemplatePath(docConfig, locale, country);
  }, [docConfig, locale, country]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!docConfig || !isHydrated ) {
      if(isHydrated && !docConfig) {
        setError(t('Document configuration not found.', {defaultValue: 'Document configuration not found.'}));
        setIsLoading(false);
      }
      return;
    }

    if (!templatePath) {
      console.log(`[DocumentDetail] No templatePath for docId: ${docId}, locale: ${locale}. Relying on image preview.`);
      setMd('');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    fetch(templatePath) // Path is already absolute from public
      .then((r) => {
        if (!r.ok) {
          throw new Error(
            `Failed to fetch ${templatePath} (${r.status} ${r.statusText})`
          );
        }
        return r.text();
      })
      .then(text => {
        let modifiedMd = text;
        const documentDisplayNameForTitle = locale === 'es' && docConfig.translations?.es?.name ? docConfig.translations.es.name : docConfig.translations?.en?.name;
        if (documentDisplayNameForTitle) {
            modifiedMd = modifiedMd.replace(/^# .*/m, `# ${documentDisplayNameForTitle}`);
        } else {
            const fallbackTitle = locale === 'es' ? docConfig.name_es || docConfig.name : docConfig.name;
            if (fallbackTitle) {
                modifiedMd = modifiedMd.replace(/^# .*/m, `# ${fallbackTitle}`);
            }
        }
        const sampleData: Record<string, string> = {
          'seller_name': 'Alice Carter',
          'seller_address': '123 Maple St, Austin, TX',
          'seller_phone': '(512) 555-1234',
          'buyer_name': 'Bob Rivera',
          'buyer_address': '456 Oak Ave, Houston, TX',
          'buyer_phone': '(832) 555-5678',
          'vin': '1HGCM82633A004352',
          'make': 'Toyota',
          'model': 'Camry',
          'year': '2018',
          'color': 'Silver',
          'odometer': '45,000',
          'sale_date': 'April 10, 2024',
          'price': '$10,000',
          'payment_method': 'Cash',
          'state': 'TX',
          'county': 'Travis',
          'warranty_text': 'Seller guarantees no defects for 30 days.',
          'existing_liens': 'None'
        };

        const finalData = liveData ?? sampleData;
        modifiedMd = modifiedMd.replace(/{{(?!#each)(?!\/each)[^}]+}}/g, (match) => {
          const key = match.replace(/[{}]/g, '').trim();
          return finalData[key] || '__________';
        });
        setMd(modifiedMd);
      })
      .catch((err) => {
        console.error('[DocumentDetail] Error fetching Markdown:', err);
        setError(err.message || t('Error loading preview content.', {defaultValue: 'Error loading preview content.'}));
        setMd('');
      })
      .finally(() => setIsLoading(false));
  }, [docId, locale, country, docConfig, isHydrated, t, templatePath, liveData]);


  if (!isHydrated || (!docConfig && !isLoading)) {
    return (
      <div className="flex flex-col items-center justify-center text-muted-foreground p-4 border rounded-lg bg-muted min-h-[300px] aspect-[8.5/11]">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <p>{t('Loading document details...', {defaultValue: 'Loading document details...'})}</p>
      </div>
    );
  }

  if (isHydrated && !isLoading && !docConfig) {
    return (
         <div className="flex flex-col items-center justify-center text-destructive p-4 border rounded-lg bg-destructive/10 min-h-[300px] aspect-[8.5/11]">
           <AlertTriangle className="h-8 w-8 mb-2" />
           <p>{t('Document configuration not found.', {defaultValue: 'Document configuration not found.'})}</p>
         </div>
    );
  }

  const documentDisplayName = docConfig && (locale === 'es' && docConfig.translations?.es?.name ? docConfig.translations.es.name : docConfig.translations?.en?.name || docConfig.name);
  const imgSrc = `/images/previews/${locale}/${docId}.png`;
  const fallbackAlt = altText || `${documentDisplayName || docId} preview`;
  const watermarkText = t('preview.watermark', { defaultValue: 'PREVIEW' });

  return (
    <div
      id="live-preview"
      data-watermark={watermarkText}
      className={cn(
        "relative w-full h-auto min-h-[500px] md:min-h-[650px]",
        "max-w-[850px] mx-auto border shadow-md bg-white dark:bg-background text-foreground",
        "overflow-hidden select-none aspect-[8.5/11]"
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
          <p className="text-sm text-muted-foreground">{t('Loading preview...', { defaultValue: 'Loading preview...' })}</p>
        </div>
      )}

      {!isLoading && error && !md && (
         <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/5 z-20 p-4 text-center">
           <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
           <p className="text-destructive text-sm font-semibold">{t('Error loading preview', {defaultValue: 'Error loading preview'})}</p>
           <p className="text-xs text-muted-foreground mt-1">{error}</p>
         </div>
      )}

      {!isLoading && !error && md ? (
        <div className="prose prose-sm dark:prose-invert max-w-none w-full h-full overflow-y-auto p-4 md:p-6 relative z-0 bg-white dark:bg-background text-foreground">
           <ReactMarkdown
             remarkPlugins={[remarkGfm]}
           components={{
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              p: ({node, ...props}) => <p {...props} className="select-none" />,
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              h1: ({node, ...props}) => <h1 {...props} className="text-center" />,
              // FIXED: ensure markdown images include dimensions
              img: ({node, ...props}) => <AutoImage {...props} className="mx-auto" />,
            }}
          >
            {md}
           </ReactMarkdown>
        </div>
      ) : !isLoading && !error && !md && !templatePath ? ( // Was: templatePath === undefined, simplified
         <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground z-0 p-0 text-center">
            <Image
              src={imgSrc}
              alt={fallbackAlt}
              width={850}
              height={1100}
              className="object-contain w-full h-full"
              data-ai-hint="document template screenshot"
              loading="lazy"
              onError={(e) => {
                  console.warn(`[DocumentDetail] Image failed to load: ${imgSrc}.`);
              }}
            />
         </div>
      ) : !isLoading && !error && !md && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/70 z-20 p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">{t('Preview not available for this document.', {defaultValue: 'Preview not available for this document.'})}</p>
          </div>
      )}
    </div>
  );
});

export default DocumentDetail;
