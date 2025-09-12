// src/components/shared/SituationBasedCategoryGroups.tsx
'use client';

import React from 'react';
import { resolveDocSlug } from '@/lib/slug-alias';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowRight,
  FileText,
  Star,
  Users,
  Briefcase,
  Home,
  Heart,
  Shield,
  DollarSign,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { taxonomy } from '@/config/taxonomy';
import { getDocMeta } from '@/config/doc-meta';
import slugMap from '@/config/doc-meta/slug-category-map.json';

interface DocMetadata {
  slug: string;
  title: string;
  complexity: string;
  popular: boolean;
  category: string;
}

interface SituationGroup {
  key: string;
  label: string;
  icon: string;
  order: number;
  domains: string[];
  popularDocs: DocMetadata[];
  totalDocs: number;
}

interface SituationBasedCategoryGroupsProps {
  locale: 'en' | 'es';
  maxSituations?: number;
  docsPerSituation?: number;
  onDocumentClick?: (slug: string) => void;
  showViewAll?: boolean;
  className?: string;
}

const SituationBasedCategoryGroups: React.FC<
  SituationBasedCategoryGroupsProps
> = ({
  locale,
  maxSituations = 6,
  docsPerSituation = 4,
  onDocumentClick,
  showViewAll = true,
  className,
}) => {
  const { t } = useTranslation('common');
  const [situationGroups, setSituationGroups] = React.useState<
    SituationGroup[]
  >([]);
  const [loading, setLoading] = React.useState(true);

  // Load situation data and popular documents
  React.useEffect(() => {
    const loadSituationData = async () => {
      setLoading(true);

      try {
        const groups: SituationGroup[] = [];

        // Get sorted situations
        const sortedSituations = Object.entries(taxonomy.situations)
          .sort(([, a], [, b]) => a.order - b.order)
          .slice(0, maxSituations);

        for (const [situationKey, situation] of sortedSituations) {
          const popularDocs: DocMetadata[] = [];
          let totalDocs = 0;

          // Find documents for this situation's domains
          const relevantSlugs = Object.entries(slugMap).filter(
            ([_slug, categoryKey]) => {
              const category =
                taxonomy.categories[
                  categoryKey as keyof typeof taxonomy.categories
                ];
              return category && situation.domains.includes(category.name);
            },
          );

          totalDocs = relevantSlugs.length;

          // Load metadata for popular documents
          const popularSlugs = relevantSlugs.slice(0, docsPerSituation);

          for (const [slug] of popularSlugs) {
            try {
              const meta = await getDocMeta(slug);
              if (meta) {
                popularDocs.push({
                  slug,
                  title: meta.title,
                  complexity: meta.complexity,
                  popular: meta.popular,
                  category: slugMap[slug as keyof typeof slugMap] || 'misc',
                });
              }
            } catch (error) {
              console.warn(`Failed to load metadata for ${slug}:`, error);
            }
          }

          // Sort by popularity and complexity
          popularDocs.sort((a, b) => {
            if (a.popular && !b.popular) return -1;
            if (!a.popular && b.popular) return 1;

            const complexityOrder = { easy: 0, medium: 1, advanced: 2 };
            return (
              complexityOrder[a.complexity as keyof typeof complexityOrder] -
              complexityOrder[b.complexity as keyof typeof complexityOrder]
            );
          });

          groups.push({
            key: situationKey,
            label: situation.label,
            icon: situation.icon,
            order: situation.order,
            domains: situation.domains,
            popularDocs: popularDocs.slice(0, docsPerSituation),
            totalDocs,
          });
        }

        setSituationGroups(groups);
      } catch (error) {
        console.error('Error loading situation data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSituationData();
  }, [maxSituations, docsPerSituation]);


  const getSituationIcon = (iconEmoji: string) => {
    // Map emoji to Lucide icons for better consistency
    const iconMap: Record<string, React.ComponentType<{}>> = {
      '🏠': Home,
      '🏢': Briefcase,
      '💼': Briefcase,
      '👨‍👩‍👧‍👦': Users,
      '❤️': Heart,
      '⚖️': Shield,
      '💰': DollarSign,
      '💻': Briefcase,
      '🌾': FileText,
      '📋': FileText,
      '🎯': FileText,
      '🔄': FileText,
    };

    const IconComponent = iconMap[iconEmoji] || FileText;
    return <IconComponent className="h-5 w-5" />;
  };

  if (loading) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-48">
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <Users className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">
          {t('situations.browseByNeed', {
            defaultValue: 'Browse by Your Needs',
          })}
        </h2>
      </div>

      {/* Situation Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {situationGroups.map((group) => (
          <Card
            key={group.key}
            className="hover:shadow-md transition-shadow group"
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{group.icon}</div>
                  <div>
                    <h3 className="font-semibold text-base leading-tight">
                      {group.label.replace(/^[\u{1F500}-\u{1F7FF}]\s*/u, '')}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {group.totalDocs}{' '}
                      {t('situations.documents', { defaultValue: 'documents' })}
                    </p>
                  </div>
                </div>
                {getSituationIcon(group.icon)}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Popular Documents */}
              {group.popularDocs.length > 0 ? (
                <div className="space-y-2">
                  {group.popularDocs.map((doc) => (
                    <Link
                      key={doc.slug}
                      href={`/${locale}/docs/${resolveDocSlug(doc.slug)}`}
                      onClick={() => onDocumentClick?.(doc.slug)}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors text-sm group/item"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <FileText className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="truncate font-medium">
                          {doc.title}
                        </span>
                        {doc.popular && (
                          <Star className="h-3 w-3 text-yellow-500 shrink-0" />
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground italic py-2">
                  {t('situations.exploreDocuments', {
                    defaultValue: 'Explore documents for this situation',
                  })}
                </div>
              )}

              {/* View All Link */}
              {showViewAll && group.totalDocs > docsPerSituation && (
                <Link
                  href={`/${locale}/situations/${group.key}`}
                  className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium pt-2 border-t"
                >
                  {t('situations.viewAll', {
                    defaultValue: 'View all {{count}} documents',
                    count: group.totalDocs,
                  })}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Browse All Link */}
      {showViewAll && (
        <div className="text-center pt-6 border-t">
          <Link href={`/${locale}/docs`}>
            <Button variant="outline" className="gap-2">
              {t('situations.browseAllCategories', {
                defaultValue: 'Browse All Document Categories',
              })}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default SituationBasedCategoryGroups;
