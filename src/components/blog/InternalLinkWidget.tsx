// Internal Link Widget for Blog Posts
'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useDiscoveryModal } from '@/contexts/DiscoveryModalContext';
import { FileText, ExternalLink, ArrowRight } from 'lucide-react';
import { getRelatedDocuments, generateCategoryLinks, type InternalLink } from '@/lib/internal-linking';
// Avoid bundling full library; load lazily where needed
import { getDocTranslation } from '@/lib/i18nUtils';
import { cn } from '@/lib/utils';

interface InternalLinkWidgetProps {
  /** Document ID if showing related documents */
  documentId?: string;
  /** Content category for category-based linking */
  category?: string;
  /** Keywords to find relevant documents */
  keywords?: string[];
  /** Maximum number of links to show */
  maxLinks?: number;
  /** Widget style variant */
  variant?: 'sidebar' | 'inline' | 'footer';
  /** Custom title for the widget */
  title?: string;
}

export default function InternalLinkWidget({
  documentId,
  category,
  keywords = [],
  maxLinks = 4,
  variant = 'sidebar',
  title
}: InternalLinkWidgetProps) {
  const params = useParams();
  const locale = (params?.locale as 'en' | 'es') || 'en';
  const { t } = useTranslation('common');
  const { setShowDiscoveryModal } = useDiscoveryModal();

  // Get relevant documents
  const [docs, setDocs] = React.useState<any[]>([]);
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mod = await import('@/lib/document-library');
        const d = mod.documentLibrary as any[];
        if (!cancelled) setDocs(d);
      } catch (_) {
        if (!cancelled) setDocs([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const getRelevantDocs = React.useMemo(() => {
    if (documentId) {
      return getRelatedDocuments(documentId, maxLinks);
    }

    if (category) {
      const categoryLinks = generateCategoryLinks(category, locale);
      return categoryLinks
        .slice(0, maxLinks)
        .map((link) => {
          const docId = link.url.split('/').pop() || '';
          return docs.find((doc) => doc.id === docId);
        })
        .filter(Boolean);
    }

    // Fallback: search by keywords
    if (keywords.length > 0) {
      return docs
        .filter((doc) => {
          const docName = getDocTranslation(doc, locale).name.toLowerCase();
          const docDesc = (
            getDocTranslation(doc, locale).description || ''
          ).toLowerCase();
          return keywords.some(
            (keyword) =>
              docName.includes(keyword.toLowerCase()) ||
              docDesc.includes(keyword.toLowerCase()),
          );
        })
        .slice(0, maxLinks);
    }

    return [] as any[];
  }, [documentId, category, keywords, maxLinks, locale, docs]);

  if (!getRelevantDocs || getRelevantDocs.length === 0) {
    return null;
  }

  const widgetTitle =
    title ||
    (documentId
      ? t('Related Legal Documents', 'Related Legal Documents')
      : category
      ? t('Relevant Templates', 'Relevant Templates')
      : t('You May Also Need', 'You May Also Need'));

  const containerClasses = cn(
    'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg border border-blue-200 dark:border-blue-800',
    {
      'p-6': variant === 'sidebar',
      'p-4 my-6': variant === 'inline',
      'p-4 mt-8 border-t': variant === 'footer'
    }
  );

  return (
    <div className={containerClasses}>
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {widgetTitle}
        </h3>
      </div>
      
      <div className="space-y-3">
        {getRelevantDocs.map((doc) => {
          if (!doc) return null;
          
          const translatedDoc = getDocTranslation(doc, locale);
          
          return (
            <Link
              key={doc.id}
              href={`/${locale}/docs/${doc.id}`}
              className="group block p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {translatedDoc.name}
                  </h4>
                  {translatedDoc.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {translatedDoc.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                      <FileText className="h-3 w-3" />
                      {t('Template', 'Template')}
                    </span>
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                      {t('Free Preview', 'Free Preview')}
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all flex-shrink-0 ml-3" />
              </div>
            </Link>
          );
        })}
      </div>

      {variant === 'sidebar' && (
        <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
          <button
            onClick={() => setShowDiscoveryModal(true)}
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            <span>{t('Browse All Templates', 'Browse All Templates')}</span>
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

// Pre-configured widgets for common use cases
export function RelatedDocumentsWidget({ documentId, maxLinks = 4 }: { documentId: string; maxLinks?: number }) {
  const { t } = useTranslation('common');
  return (
    <InternalLinkWidget
      documentId={documentId}
      maxLinks={maxLinks}
      variant="sidebar"
      title={t('Related Legal Documents', 'Related Legal Documents')}
    />
  );
}

export function CategoryDocumentsWidget({ category, maxLinks = 3 }: { category: string; maxLinks?: number }) {
  const { t } = useTranslation('common');
  return (
    <InternalLinkWidget
      category={category}
      maxLinks={maxLinks}
      variant="inline"
      title={t('Popular Templates in This Category', 'Popular Templates in This Category')}
    />
  );
}

export function BlogFooterLinks({ keywords, maxLinks = 3 }: { keywords: string[]; maxLinks?: number }) {
  const { t } = useTranslation('common');
  return (
    <InternalLinkWidget
      keywords={keywords}
      maxLinks={maxLinks}
      variant="footer"
      title={t('Get Started With These Templates', 'Get Started With These Templates')}
    />
  );
}
