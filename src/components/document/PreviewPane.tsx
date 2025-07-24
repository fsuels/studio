// src/components/PreviewPane.tsx
'use client';

import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useFormContext } from 'react-hook-form';
import {
  Loader2,
  AlertTriangle,
  Eye,
  ChevronLeft,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { debounce } from '@/lib/debounce';
import { documentLibrary } from '@/lib/document-library';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { AutoImage } from '@/components/shared';
import { Button } from '@/components/ui/button';
import StatePDFPreview from '@/components/document/StatePDFPreview';
import { hasOfficialForm } from '@/lib/pdf/state-form-manager';
import { loadComplianceOnly, normalizeJurisdiction } from '@/lib/config-loader';

interface PreviewPaneProps {
  locale: 'en' | 'es';
  docId: string;
  currentFieldId?: string; // Track which field is currently being edited
  enableInlineEditing?: boolean; // New prop to enable inline editing
  onFieldClick?: (fieldId: string) => void; // Navigation to specific field
}

export default function PreviewPane({
  locale,
  docId,
  currentFieldId,
  enableInlineEditing = false,
  onFieldClick,
}: PreviewPaneProps) {
  const { t } = useTranslation('common');
  const formContext = useFormContext();
  const { watch, setValue } = formContext || {};

  const [rawMarkdown, setRawMarkdown] = useState<string>('');
  const [processedMarkdown, setProcessedMarkdown] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [highlightedField, setHighlightedField] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const previewRef = useRef<HTMLDivElement>(null);
  
  // Add a state to track if form context is ready
  const [formContextReady, setFormContextReady] = useState(false);
  const [stateHasOfficialForm, setStateHasOfficialForm] = useState<boolean | null>(null);

  const docConfig = useMemo(
    () => documentLibrary.find((d) => d.id === docId),
    [docId],
  );

  // Use the new standardized template path structure
  const templatePath = useMemo(() => {
    if (!docConfig) return undefined;
    return `/templates/${locale}/${docId}.md`; // Path relative to public folder
  }, [docConfig, locale, docId]);

  const watermarkText = t('preview.watermark', {
    ns: 'translation',
    defaultValue: 'PREVIEW',
  });
  const imgSrc = `/images/previews/${locale}/${docId}.png`;

  useEffect(() => {
    setIsHydrated(true);
  }, []);
  
  // Check if form context is ready
  useEffect(() => {
    if (formContext && watch) {
      setFormContextReady(true);
      console.log('✅ PreviewPane: Form context is ready');
    } else {
      console.log('❌ PreviewPane: Form context not ready', {
        hasFormContext: !!formContext,
        hasWatch: !!watch
      });
    }
  }, [formContext, watch]);

  // Check if the selected state has an official form using unified loader
  useEffect(() => {
    if (!formContextReady || !watch) return;

    const selectedState = watch('state');
    if (!selectedState || !docId) {
      setStateHasOfficialForm(null);
      return;
    }

    const checkOfficialForm = async () => {
      console.log('🔍 PreviewPane: Checking official form for state:', selectedState, 'docId:', docId);
      try {
        const jurisdiction = normalizeJurisdiction(selectedState);
        console.log('🔍 PreviewPane: Normalized jurisdiction:', jurisdiction);
        const compliance = await loadComplianceOnly(docId, jurisdiction);
        console.log('🔍 PreviewPane: Compliance loaded:', compliance);
        const hasForm = !!(compliance.officialForm && compliance.localFormPath);
        setStateHasOfficialForm(hasForm);
        console.log(`✅ PreviewPane: ${selectedState} has official form:`, hasForm, 'officialForm:', compliance.officialForm, 'localFormPath:', compliance.localFormPath);
      } catch (error) {
        console.warn('⚠️ PreviewPane: Failed to check official form, using legacy method', error);
        // Fallback to legacy method
        if (docId === 'vehicle-bill-of-sale') {
          const hasForm = hasOfficialForm(selectedState);
          setStateHasOfficialForm(hasForm);
          console.log('✅ PreviewPane: Legacy check - has official form:', hasForm);
        } else {
          setStateHasOfficialForm(false);
        }
      }
    };

    checkOfficialForm();
  }, [formContextReady, watch, docId]);

  // Auto-scroll to highlighted field
  useEffect(() => {
    if (currentFieldId && previewRef.current) {
      // Add a small delay to ensure the DOM has updated
      setTimeout(() => {
        const highlightedElement = previewRef.current?.querySelector(
          'mark.highlight-current',
        );
        if (highlightedElement) {
          highlightedElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });

          // Add a pulse animation
          highlightedElement.classList.add('pulse-animation');
          setTimeout(() => {
            highlightedElement.classList.remove('pulse-animation');
          }, 2000);
        }
      }, 300); // Increased delay to ensure markdown is processed
    }
  }, [currentFieldId, processedMarkdown]);

  useEffect(() => {
    if (!isHydrated || !docConfig) {
      if (!docConfig && isHydrated) {
        setError(t('Document configuration not found.', { ns: 'translation' }));
        setIsLoading(false);
      }
      return;
    }

    async function fetchTemplate() {
      setIsLoading(true);
      setError(null);
      setImageError(false);
      setRawMarkdown('');
      setProcessedMarkdown('');

      if (!templatePath) {
        console.warn(
          `[PreviewPane] No templatePath for docId: ${docId}, locale: ${locale}. Will attempt image fallback.`,
        );
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(templatePath); // Path is already absolute from public
        if (!response.ok) {
          throw new Error(
            `Failed to fetch template (${response.status}): ${templatePath}`,
          );
        }
        const text = await response.text();
        setRawMarkdown(text);
      } catch (err) {
        console.error('Error fetching Markdown template:', err);
        setError(
          err instanceof Error
            ? err.message
            : t('Could not load template.', { ns: 'translation' }),
        );
        setRawMarkdown('');
      } finally {
        setIsLoading(false);
      }
    }
    fetchTemplate();
  }, [docId, locale, templatePath, docConfig, isHydrated, t]);

  // Function to split markdown content into pages
  const splitContentIntoPages = useCallback((content: string) => {
    // Disable automatic pagination to prevent text size issues
    // Only split on explicit page breaks
    const pageBreakPattern =
      /(?:^|\n)(?:---\s*page\s*break\s*---|\*\*\*\s*page\s*break\s*\*\*\*|\\newpage|\f)/gim;
    let pages = content.split(pageBreakPattern);

    // If no explicit page breaks, return single page to avoid layout issues
    if (pages.length === 1) {
      return [content];
    }

    return pages.filter((page) => page.trim().length > 0);
  }, []);

  const updatePreviewContent = useCallback(
    (formData: Record<string, unknown>, currentRawMarkdown: string) => {
      if (!currentRawMarkdown) {
        setTotalPages(1);
        setCurrentPage(1);
        return '';
      }
      let tempMd = currentRawMarkdown;

      // First, collect all placeholders to identify fields
      const placeholderMatches =
        currentRawMarkdown.match(/\{\{[^}]+\}\}/g) || [];
      const fieldKeys = new Set<string>();
      placeholderMatches.forEach((match) => {
        const key = match.replace(/[{}]/g, '').trim();
        fieldKeys.add(key);
      });

      // Template variable to form field mapping
      const templateFieldMapping: Record<string, string> = {
        // Vehicle information
        vehicle_year: 'year',
        vehicle_make: 'make', 
        vehicle_model: 'model',
        vehicle_body_style: 'body_type',
        vehicle_color: 'color',
        vehicle_vin: 'vin',
        
        // Pricing and transaction
        vehicle_price: 'price',
        sale_price: 'price',
        purchase_price: 'price',
        transaction_date: 'sale_date',
        vehicle_sale_date: 'sale_date',
        
        // Seller information
        vehicle_seller_name: 'seller_name',
        vehicle_seller_address: 'seller_address',
        vehicle_seller_phone: 'seller_phone',
        
        // Buyer information  
        vehicle_buyer_name: 'buyer_name',
        vehicle_buyer_address: 'buyer_address',
        vehicle_buyer_phone: 'buyer_phone',
        
        // Additional fields
        vehicle_odometer: 'odometer',
        vehicle_odometer_reading: 'odometer',
        odometer_reading: 'odometer',
        vehicle_title_number: 'title_number',
        existing_liens_description: 'existing_liens',
        warranty_disclaimer: 'warranty_text',
        transaction_county: 'county',
        notary_county: 'county',
      };

      // Process each field
      for (const key of fieldKeys) {
        const placeholderRegex = new RegExp(`{{\\s*${key.trim()}\\s*}}`, 'g');
        
        // Map template variable to actual form field name
        const actualFieldName = templateFieldMapping[key] || key;
        const value = formData[actualFieldName];

        // Check if this is the currently edited field
        const isCurrentField = currentFieldId === key || currentFieldId === actualFieldName;

        if (isCurrentField && value) {
          // Highlight the current field with a special marker
          tempMd = tempMd.replace(
            placeholderRegex,
            `<span class="highlight-current clickable-field" data-field-id="${key}" role="button" tabindex="0"><strong>${String(value)}</strong></span>`,
          );
        } else if (value) {
          // Filled field - clickable to navigate to that question
          tempMd = tempMd.replace(
            placeholderRegex,
            `<span class="filled-field clickable-field" data-field-id="${key}" role="button" tabindex="0" title="Click to edit this field"><strong>${String(value)}</strong></span>`,
          );
        } else {
          // Empty field - clickable to navigate to that question
          tempMd = tempMd.replace(
            placeholderRegex,
            `<span class="empty-field clickable-field" data-field-id="${key}" role="button" tabindex="0" title="Click to fill this field">____</span>`,
          );
        }
      }

      // Replace any remaining placeholders that weren't processed
      tempMd = tempMd.replace(
        /\{\{.*?\}\}/g,
        '<span class="empty-field">____</span>',
      );

      let titleToUse = docConfig?.translations?.en?.name; // Default to English name
      if (locale === 'es' && docConfig?.translations?.es?.name) {
        titleToUse = docConfig.translations.es.name;
      } else if (docConfig?.name) {
        // Fallback to root name if translations are missing
        titleToUse = docConfig.name;
      }

      if (titleToUse) {
        tempMd = tempMd.replace(/^# .*/m, `# ${titleToUse}`);
      }

      // Split content into pages and update pagination state
      const pages = splitContentIntoPages(tempMd);
      setTotalPages(pages.length);

      // Ensure current page is within bounds
      if (currentPage > pages.length) {
        setCurrentPage(1);
      }

      // Return the current page content or full content if only one page
      return pages.length > 1 ? pages[currentPage - 1] : tempMd;
    },
    [docConfig, locale, currentFieldId, splitContentIntoPages, currentPage],
  );

  const debouncedUpdatePreview = useMemo(
    () =>
      debounce<[Record<string, unknown>, string]>(
        (formData, currentRawMarkdown) => {
          setProcessedMarkdown(
            updatePreviewContent(formData, currentRawMarkdown),
          );
        },
        300,
      ),
    [updatePreviewContent],
  );

  useEffect(() => {
    if (!formContextReady || !watch || !isHydrated || isLoading) {
      if (rawMarkdown && !isLoading)
        setProcessedMarkdown(updatePreviewContent({}, rawMarkdown));
      return;
    }

    const formData = watch();
    if (formData) {
      debouncedUpdatePreview(formData as Record<string, unknown>, rawMarkdown);
    }

    const subscription = watch((formData) => {
      if (formData) {
        debouncedUpdatePreview(
          formData as Record<string, unknown>,
          rawMarkdown,
        );
      }
    });

    return () => {
      subscription?.unsubscribe();
      debouncedUpdatePreview.cancel();
    };
  }, [
    formContextReady,
    watch,
    rawMarkdown,
    isLoading,
    isHydrated,
    debouncedUpdatePreview,
    updatePreviewContent,
  ]);

  // Handle clicks on clickable fields
  const handleFieldClick = useCallback(
    (event: React.MouseEvent) => {
      const target = event.target as HTMLElement;
      const clickableField = target.closest('.clickable-field') as HTMLElement;

      if (clickableField && onFieldClick) {
        const fieldId = clickableField.getAttribute('data-field-id');
        if (fieldId) {
          onFieldClick(fieldId);
        }
      }
    },
    [onFieldClick],
  );

  if (!isHydrated) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4 animate-pulse bg-muted rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <p>
          {t('Loading document preview...', {
            ns: 'translation',
            defaultValue: 'Loading document preview...',
          })}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4 bg-muted rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <p>
          {t('Loading document preview...', {
            ns: 'translation',
            defaultValue: 'Loading document preview...',
          })}
        </p>
      </div>
    );
  }

  // Check if document has a state selected that has an official form
  const selectedState = formContextReady && watch ? watch('state') : null;
  const currentFormData = formContextReady && watch ? watch() : {};
  const shouldShowStatePDF = selectedState && stateHasOfficialForm === true;
  
  // Debug form data (moved outside useEffect to avoid hooks order violation)
  if (formContextReady && watch) {
    const allFormData = watch();
    console.log('🔄 PreviewPane: Form data changed:', {
      selectedState,
      stateField: allFormData.state,
      allFields: Object.keys(allFormData),
      stateHasOfficialForm,
      shouldShowStatePDF,
      condition1_selectedState: !!selectedState,
      condition2_stateHasOfficialFormIsTrue: stateHasOfficialForm === true,
      FINAL_shouldShowStatePDF: selectedState && stateHasOfficialForm === true
    });
  }
  
  // Debug form data
  console.log('🔍 PreviewPane DEBUG:', {
    formContextReady,
    selectedState,
    stateHasOfficialForm,
    shouldShowStatePDF,
    docId,
    watchFunction: !!watch,
    currentFormData: Object.keys(currentFormData),
    error
  });

  // If we should show state PDF, render that instead
  if (shouldShowStatePDF && !error) {
    return (
      <StatePDFPreview
        state={selectedState}
        formData={currentFormData}
        documentType={docId as any} // Dynamic document type
      />
    );
  }

  if (!error && rawMarkdown && processedMarkdown) {
    return (
      <div
        id="live-preview"
        data-watermark={watermarkText}
        className="relative w-full h-full bg-card text-card-foreground rounded-lg overflow-hidden flex flex-col"
        style={{ userSelect: 'none' }}
      >
        {/* Page Navigation Header - Fixed positioning */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-3 border-b bg-white shadow-sm shrink-0 z-10">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>
                {t('Page {{current}} of {{total}}', {
                  current: currentPage,
                  total: totalPages,
                  defaultValue: `Page ${currentPage} of ${totalPages}`,
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <div
          ref={previewRef}
          className="flex-1 overflow-y-auto bg-white"
          onClick={handleFieldClick}
        >
          <div className="prose prose-sm max-w-none p-6 md:p-8">
            <style jsx global>{`
              /* Document structure and field highlighting */
              .prose h1 {
                font-size: 1.5rem;
                font-weight: bold;
                text-align: center;
                margin: 0 0 1.5rem 0;
                border-bottom: 1px solid #e5e7eb;
                padding-bottom: 0.75rem;
              }

              .prose h2 {
                font-size: 1.25rem;
                font-weight: bold;
                margin: 2rem 0 1rem 0;
                color: #1f2937;
              }

              .prose h3 {
                font-size: 1.125rem;
                font-weight: 600;
                margin: 1.5rem 0 0.75rem 0;
                color: #374151;
              }

              .prose p {
                margin: 0.75rem 0;
                line-height: 1.6;
              }

              .prose hr {
                margin: 2rem 0;
                border-top: 1px solid #d1d5db;
              }

              .prose table {
                width: 100%;
                margin: 1.5rem 0;
                border-collapse: collapse;
              }

              .prose th,
              .prose td {
                border: 1px solid #d1d5db;
                padding: 0.75rem;
                text-align: left;
              }

              .prose th {
                background-color: #f9fafb;
                font-weight: bold;
              }

              /* Field highlighting */
              .highlight-current {
                background-color: rgba(59, 130, 246, 0.2);
                border: 2px solid rgb(59, 130, 246);
                border-radius: 3px;
                padding: 2px 4px;
                display: inline;
                font-weight: bold;
              }

              .filled-field {
                background-color: rgba(34, 197, 94, 0.1);
                border: 1px solid rgba(34, 197, 94, 0.3);
                border-radius: 2px;
                padding: 1px 3px;
                display: inline;
                font-weight: bold;
                color: #065f46;
              }

              .empty-field {
                background-color: rgba(156, 163, 175, 0.1);
                border: 1px dashed rgba(156, 163, 175, 0.5);
                border-radius: 2px;
                padding: 1px 8px;
                color: rgba(156, 163, 175, 0.8);
                display: inline;
                font-style: italic;
              }

              /* Clickable field interactions */
              .clickable-field {
                cursor: pointer;
                transition: all 0.2s ease-in-out;
                position: relative;
              }

              .clickable-field:hover {
                transform: translateY(-1px);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }

              .filled-field.clickable-field:hover {
                background-color: rgba(34, 197, 94, 0.2);
                border-color: rgba(34, 197, 94, 0.5);
              }

              .empty-field.clickable-field:hover {
                background-color: rgba(156, 163, 175, 0.2);
                border-color: rgba(156, 163, 175, 0.7);
                color: rgba(156, 163, 175, 1);
              }

              .highlight-current.clickable-field:hover {
                background-color: rgba(59, 130, 246, 0.3);
              }

              .clickable-field:focus {
                outline: 2px solid rgb(59, 130, 246);
                outline-offset: 2px;
              }

              .pulse-animation {
                animation: pulse 2s ease-in-out;
              }

              @keyframes pulse {
                0% {
                  box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
                }
                70% {
                  box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
                }
                100% {
                  box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
                }
              }
            `}</style>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                p: (props) => <p {...props} className="select-none" />,
                h1: (props) => <h1 {...props} className="text-center" />,
                mark: ({ className, children, ...props }) => (
                  <mark className={className} {...props}>
                    {children}
                  </mark>
                ),
                span: ({ className, children, ...props }) => (
                  <span className={className} {...props}>
                    {children}
                  </span>
                ),
                img: ({
                  src = '',
                  ...rest
                }: React.ImgHTMLAttributes<HTMLImageElement>) => (
                  <AutoImage src={src} {...rest} className="mx-auto" />
                ),
              }}
            >
              {processedMarkdown}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    );
  }

  if ((error || !templatePath) && !imageError) {
    return (
      <div
        id="live-preview"
        data-watermark={watermarkText}
        className="relative w-full h-full bg-card text-card-foreground rounded-lg overflow-hidden"
        style={{ userSelect: 'none' }}
      >
        <Image
          src={imgSrc}
          alt={`${docId} preview fallback`}
          width={850}
          height={1100}
          className="object-contain w-full h-full"
          loading="lazy"
          data-ai-hint="document template screenshot"
          onError={() => {
            console.warn(
              `[PreviewPane] Fallback image also failed to load: ${imgSrc}`,
            );
            setImageError(true);
          }}
        />
      </div>
    );
  }

  if (error || imageError || (!templatePath && !rawMarkdown && !isLoading)) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-destructive p-4 text-center bg-destructive/5 rounded-lg">
        <AlertTriangle className="h-8 w-8 mb-2" />
        <p className="font-semibold">
          {error
            ? t('Error loading preview', {
                ns: 'translation',
                defaultValue: 'Error loading preview',
              })
            : t('Preview Unavailable', {
                ns: 'translation',
                defaultValue: 'Preview Unavailable',
              })}
        </p>
        {error && <p className="text-xs mt-1">{error}</p>}
        {imageError && !error && (
          <p className="text-xs mt-1">
            {t('Image preview could not be loaded.', {
              ns: 'translation',
              defaultValue: 'Image preview could not be loaded.',
            })}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4 bg-muted rounded-lg">
      <p>
        {t('Preview not available.', {
          ns: 'translation',
          defaultValue: 'Preview not available.',
        })}
      </p>
    </div>
  );
}
