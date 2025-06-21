// src/components/mega-menu/TaxonomyMegaMenuContent.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FileText,
  Star,
  ArrowRight,
  Users,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { taxonomy } from '@/config/taxonomy';
import { getDocMeta } from '@/config/doc-meta';
import slugMap from '@/config/doc-meta/slug-category-map.json';

interface TaxonomyMegaMenuContentProps {
  locale: 'en' | 'es';
  onLinkClick?: () => void;
  userRole?: string; // Optional: if user has selected a role
}

interface DocPreview {
  slug: string;
  title: string;
  complexity: string;
  popular: boolean;
  category: string;
}

const TaxonomyMegaMenuContent: React.FC<TaxonomyMegaMenuContentProps> = ({
  locale,
  onLinkClick,
  userRole,
}) => {
  const { t } = useTranslation('common');

  // State for loaded document previews
  const [docPreviews, setDocPreviews] = React.useState<
    Record<string, DocPreview>
  >({});
  const [loadingDocs, setLoadingDocs] = React.useState<Set<string>>(new Set());

  // Get sorted situations by order
  const sortedSituations = React.useMemo(() => {
    return Object.entries(taxonomy.situations)
      .sort(([, a], [, b]) => a.order - b.order)
      .slice(0, 6); // Show top 6 situations in mega menu
  }, []);

  // Get role-specific quick access documents
  const roleQuickDocs = React.useMemo(() => {
    if (!userRole || !taxonomy.roles[userRole]) return [];

    const role = taxonomy.roles[userRole];
    return Object.entries(role.quickDocs || {})
      .sort(([, a], [, b]) => b - a) // Sort by weight descending
      .slice(0, 5) // Top 5 quick docs
      .map(([slug]) => slug);
  }, [userRole]);

  // Load document metadata lazily
  const loadDocPreview = React.useCallback(
    async (slug: string) => {
      if (docPreviews[slug] || loadingDocs.has(slug)) return;

      setLoadingDocs((prev) => new Set(prev).add(slug));

      try {
        const meta = await getDocMeta(slug);
        if (meta) {
          setDocPreviews((prev) => ({
            ...prev,
            [slug]: {
              slug,
              title: meta.title,
              complexity: meta.complexity,
              popular: meta.popular,
              category: slugMap[slug as keyof typeof slugMap] || 'misc',
            },
          }));
        }
      } catch (error) {
        console.warn(`Failed to load metadata for ${slug}:`, error);
      } finally {
        setLoadingDocs((prev) => {
          const newSet = new Set(prev);
          newSet.delete(slug);
          return newSet;
        });
      }
    },
    [docPreviews, loadingDocs],
  );

  // Get popular documents for a situation
  const getPopularDocsForSituation = React.useCallback(
    (situationKey: string) => {
      const situation = taxonomy.situations[situationKey];
      if (!situation?.domains) return [];

      const docs: string[] = [];

      // Find categories that match this situation's domains
      Object.entries(taxonomy.categories).forEach(([categoryKey, category]) => {
        if (situation.domains.some((domain) => category.name === domain)) {
          // Get docs from category subs
          Object.values(category.subs || {}).forEach((sub) => {
            if (sub.docs) {
              docs.push(...sub.docs.slice(0, 2)); // Top 2 from each sub
            }
          });
        }
      });

      return docs.slice(0, 4); // Limit to 4 total
    },
    [],
  );

  // Get complexity badge color
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Load quick docs on mount
  React.useEffect(() => {
    roleQuickDocs.forEach((slug) => loadDocPreview(slug));
  }, [roleQuickDocs, loadDocPreview]);

  return (
    <ScrollArea className="w-full max-h-[calc(100vh-10rem-4rem)] md:max-h-[70vh]">
      <div className="p-6 space-y-6">
        {/* Role-based Quick Access Section */}
        {userRole && roleQuickDocs.length > 0 && (
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Zap className="h-4 w-4 text-primary" />
                Quick Access for {taxonomy.roles[userRole]?.name || userRole}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {roleQuickDocs.map((slug) => {
                const doc = docPreviews[slug];
                const isLoading = loadingDocs.has(slug);

                return (
                  <Link
                    key={slug}
                    href={`/${locale}/docs/${slug}`}
                    onClick={onLinkClick}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-primary/10 transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-3 w-3 text-primary" />
                      <span className="text-sm font-medium">
                        {isLoading ? 'Loading...' : doc?.title || slug}
                      </span>
                      {doc?.popular && (
                        <Star className="h-3 w-3 text-yellow-500" />
                      )}
                    </div>
                    <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Situations Grid */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Browse by Situation
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedSituations.map(([situationKey, situation]) => (
              <SituationCard
                key={situationKey}
                situationKey={situationKey}
                situation={situation}
                locale={locale}
                onLinkClick={onLinkClick}
                onLoadDoc={loadDocPreview}
                getPopularDocs={getPopularDocsForSituation}
                docPreviews={docPreviews}
                loadingDocs={loadingDocs}
                getComplexityColor={getComplexityColor}
              />
            ))}
          </div>
        </div>

        {/* Browse All Categories Link */}
        <div className="pt-4 border-t">
          <Link
            href={`/${locale}/docs`}
            onClick={onLinkClick}
            className="flex items-center justify-center gap-2 p-3 text-primary hover:bg-primary/10 rounded-md transition-colors font-medium"
          >
            Browse All Documents
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </ScrollArea>
  );
};

// Separate component for situation cards to improve performance
const SituationCard: React.FC<{
  situationKey: string;
  situation: any;
  locale: string;
  onLinkClick?: () => void;
  onLoadDoc: (slug: string) => void;
  getPopularDocs: (situationKey: string) => string[];
  docPreviews: Record<string, DocPreview>;
  loadingDocs: Set<string>;
  getComplexityColor: (complexity: string) => string;
}> = React.memo(
  ({
    situationKey,
    situation,
    locale,
    onLinkClick,
    onLoadDoc,
    getPopularDocs,
    docPreviews,
    loadingDocs,
    getComplexityColor,
  }) => {
    const popularDocs = React.useMemo(
      () => getPopularDocs(situationKey),
      [situationKey, getPopularDocs],
    );

    // Load popular docs when card becomes visible
    React.useEffect(() => {
      popularDocs.forEach((slug) => onLoadDoc(slug));
    }, [popularDocs, onLoadDoc]);

    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer group">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <span className="text-lg">{situation.icon}</span>
            <span className="font-medium">{situation.label}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {popularDocs.length > 0 ? (
            <>
              {popularDocs.slice(0, 3).map((slug) => {
                const doc = docPreviews[slug];
                const isLoading = loadingDocs.has(slug);

                return (
                  <Link
                    key={slug}
                    href={`/${locale}/docs/${slug}`}
                    onClick={onLinkClick}
                    className="flex items-center justify-between text-xs hover:text-primary transition-colors"
                  >
                    <span className="truncate">
                      {isLoading ? 'Loading...' : doc?.title || slug}
                    </span>
                    {doc?.complexity && (
                      <Badge
                        variant="secondary"
                        className={cn(
                          'text-xs px-1 py-0',
                          getComplexityColor(doc.complexity),
                        )}
                      >
                        {doc.complexity}
                      </Badge>
                    )}
                  </Link>
                );
              })}
              <Link
                href={`/${locale}/situations/${situationKey}`}
                onClick={onLinkClick}
                className="flex items-center gap-1 text-xs text-primary hover:underline mt-2"
              >
                View all{' '}
                {situation.label.replace(/^[\u{1F500}-\u{1F7FF}]\s*/u, '')}
                <ArrowRight className="h-3 w-3" />
              </Link>
            </>
          ) : (
            <div className="text-xs text-muted-foreground italic">
              Explore{' '}
              {situation.label.replace(/^[\u{1F500}-\u{1F7FF}]\s*/u, '')}{' '}
              documents
            </div>
          )}
        </CardContent>
      </Card>
    );
  },
);

SituationCard.displayName = 'SituationCard';

export default TaxonomyMegaMenuContent;
