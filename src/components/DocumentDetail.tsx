// src/components/DocumentDetail.tsx
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslation } from 'react-i18next';
import { documentLibrary, type LegalDocument } from '@/lib/document-library';
import { Loader2, AlertTriangle } from 'lucide-react';
import Image from 'next/image'; 
import { cn } from '@/lib/utils';

interface DocumentDetailProps {
  docId: string;
  locale: 'en' | 'es';
  altText?: string;
}

const DocumentDetail = React.memo(function DocumentDetail({ docId, locale, altText }: DocumentDetailProps) {
  const { t } = useTranslation();
  const [md, setMd] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const doc = useMemo(() => documentLibrary.find((d: LegalDocument) => d.id === docId), [docId]);

  const templatePath = useMemo(() => {
    if (!doc) return undefined;
    return locale === 'es' && doc.templatePath_es ? doc.templatePath_es : doc.templatePath;
  }, [doc, locale]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!doc || !isHydrated) return;

    setIsLoading(true);
    setError(null);
    
    if (!templatePath) {
      console.warn(`[DocumentDetail] No templatePath defined for docId: ${docId}, locale: ${locale}`);
      setError(t('Preview not available for this document.', {defaultValue: 'Preview not available for this document.'}));
      setIsLoading(false);
      setMd(''); 
      return;
    }
    
    const fetchPath = templatePath.startsWith('/') ? templatePath : `/${templatePath}`;

    fetch(fetchPath)
      .then((r) => {
        if (!r.ok) {
          throw new Error(
            `Failed to fetch ${fetchPath} (${r.status} ${r.statusText})`
          );
        }
        return r.text();
      })
      .then(text => {
        let modifiedMd = text;
        const documentDisplayName = locale === 'es' && doc.name_es ? doc.name_es : doc.name;
        if (documentDisplayName) {
            modifiedMd = modifiedMd.replace(/^# .*/m, `# ${documentDisplayName}`);
        }
        setMd(modifiedMd);
      })
      .catch((err) => {
        console.error('[DocumentDetail] Error fetching Markdown:', err);
        setError(err.message || t('Error loading preview content.', {defaultValue: 'Error loading preview content.'}));
        setMd(''); 
      })
      .finally(() => setIsLoading(false));
  }, [docId, locale, doc, isHydrated, t, templatePath]);


  if (!isHydrated || !doc) {
    return (
      <div className="flex flex-col items-center justify-center text-muted-foreground p-4 border rounded-lg bg-muted min-h-[300px] aspect-[8.5/11]">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <p>{t('Loading document details...', {defaultValue: 'Loading document details...'})}</p>
      </div>
    );
  }
  
  const documentDisplayName = locale === 'es' && doc.name_es ? doc.name_es : doc.name;
  const imgSrc = `/images/previews/${locale}/${docId}.png`;
  const fallbackAlt = altText || `${documentDisplayName} preview`;
  const watermarkText = t('preview.watermark', { defaultValue: 'PREVIEW' });


  return (
    <div
      id="live-preview" 
      data-watermark={watermarkText} 
      className={cn(
        "relative w-full h-auto min-h-[500px] md:min-h-[650px]", 
        "max-w-[850px] mx-auto border shadow-md bg-card", 
        "overflow-hidden select-none aspect-[8.5/11]"
      )}
    >
      
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/70 z-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-sm text-muted-foreground">{t('Loading preview...', { defaultValue: 'Loading preview...' })}</p>
        </div>
      )}

      {!isLoading && error && (
         <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/5 z-20 p-4 text-center">
           <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
           <p className="text-destructive text-sm font-semibold">{t('Error loading preview', {defaultValue: 'Error loading preview'})}</p>
           <p className="text-xs text-muted-foreground mt-1">{error}</p>
         </div>
      )}
      
      {!isLoading && !error && md ? (
        <div className="prose prose-sm dark:prose-invert max-w-none w-full h-full overflow-y-auto p-4 md:p-6 relative z-0 bg-background text-foreground">
           <ReactMarkdown 
             remarkPlugins={[remarkGfm]}
             components={{
                p: ({node, ...props}) => <p {...props} className="select-none" />,
             }}
           >
            {md}
           </ReactMarkdown>
        </div>
      ) : !isLoading && !error && !md && (
         <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground z-20 p-4 text-center">
            <Image 
              src={imgSrc} 
              alt={fallbackAlt} 
              width={850} 
              height={1100} 
              className="object-contain w-full h-full" 
              data-ai-hint="document template screenshot"
              priority={true} // Set priority to true for LCP image
              onError={() => {
                  // Fallback logic if image fails to load, e.g., try to load markdown directly
                  console.warn(`[DocumentDetail] Image failed to load: ${imgSrc}. Markdown should render if available.`);
              }}
            />
         </div>
      )}
    </div>
  );
});
export default DocumentDetail;