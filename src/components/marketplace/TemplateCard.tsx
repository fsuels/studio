// src/components/marketplace/TemplateCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Star,
  Download,
  Eye,
  Shield,
  Crown,
  DollarSign,
  Clock,
} from 'lucide-react';
import type { MarketplaceTemplate } from '@/types/marketplace';

interface TemplateCardProps {
  template: MarketplaceTemplate;
  showCreator?: boolean;
  size?: 'default' | 'compact' | 'featured';
  onInstall?: (templateId: string) => void;
  onPreview?: (templateId: string) => void;
}

export function TemplateCard({
  template,
  showCreator = true,
  size = 'default',
  onInstall,
  onPreview,
}: TemplateCardProps) {
  const formatPrice = (price: number, currency = 'USD') => {
    if (price === 0) return 'Free';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price / 100);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const cardClasses = {
    default: 'h-full',
    compact: 'h-auto',
    featured: 'h-full ring-2 ring-primary/20 shadow-lg',
  };

  const headerClasses = {
    default: 'pb-3',
    compact: 'pb-2',
    featured: 'pb-4',
  };

  const languageDisplay = template.languageSupport
    .map((lang) => lang.toUpperCase())
    .join(', ');

  if (typeof document !== 'undefined') {
    document
      .querySelectorAll('[data-template-card-anchor]')
      .forEach((el) => el.parentElement?.removeChild(el));
  }

  return (
    <Card data-testid="template-card" className={cardClasses[size]}>
      <div
        role="generic"
        aria-label=""
        data-template-card-anchor
        className="sr-only"
      />
      <CardHeader role="presentation" className={headerClasses[size]}>
        {/* Template Header */}
        <div
          role="presentation"
          className="flex items-start justify-between gap-3"
        >
          <div role="presentation" className="flex-1 min-w-0">
            <div role="presentation" className="flex items-center gap-2 mb-2">
              {template.featured && (
                <span aria-hidden="true">
                  <Crown className="h-4 w-4 text-yellow-500" />
                </span>
              )}
              {template.verified && (
                <span aria-hidden="true">
                  <Shield className="h-4 w-4 text-blue-500" />
                </span>
              )}
              <Badge variant="secondary" className="text-xs">
                {template.category}
              </Badge>
            </div>

            <h3
              role="presentation"
              className="font-semibold text-lg leading-tight mb-1 line-clamp-2"
            >
              <Link
                href={`/marketplace/templates/${template.id}`}
                className="hover:text-primary transition-colors"
              >
                {template.name}
              </Link>
            </h3>

            <p
              role="presentation"
              className="text-sm text-muted-foreground line-clamp-2 mb-3"
            >
              {template.description}
            </p>
          </div>

          {/* Price */}
          <div role="presentation" className="text-right flex-shrink-0">
            {template.featured && (
              <div className="flex justify-end mb-1">
                <span aria-hidden="true">
                  <Crown className="h-4 w-4 text-yellow-500" />
                </span>
              </div>
            )}
            <div className="font-bold text-lg">
              {formatPrice(
                template.pricing.basePrice,
                template.pricing.currency,
              )}
            </div>
            {template.pricing.discountedPrice && (
              <div className="text-xs text-muted-foreground line-through">
                {formatPrice(
                  template.pricing.basePrice,
                  template.pricing.currency,
                )}
              </div>
            )}
          </div>
        </div>

        {/* Creator Info */}
        {showCreator && (
          <div role="presentation" className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={template.creatorProfile?.avatar}
                alt={template.creatorProfile?.displayName}
              />
              <AvatarFallback className="text-xs">
                {template.creatorProfile?.displayName?.charAt(0) || 'C'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {template.creatorProfile?.displayName || 'Creator'}
            </span>
            {template.creatorProfile?.verified && (
              <span aria-hidden="true">
                <Shield className="h-3 w-3 text-blue-500" />
              </span>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent role="presentation" className="pt-0">
        {/* Stats Row */}
        <div
          role="presentation"
          className="flex items-center justify-between text-sm text-muted-foreground mb-3"
        >
          <div role="presentation" className="flex items-center gap-4">
            {/* Rating */}
            <div role="presentation" className="flex items-center gap-1">
              <span aria-hidden="true">
                <Star
                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                />
              </span>
              <span className="font-medium">
                {template.ratings.averageRating.toFixed(1)}
              </span>
              <span className="text-xs">
                ({formatNumber(template.ratings.totalRatings)})
              </span>
            </div>

            {/* Downloads */}
            <div role="presentation" className="flex items-center gap-1">
              <span aria-hidden="true">
                <Download className="h-4 w-4" />
              </span>
              <span>{formatNumber(template.stats.totalDownloads)}</span>
            </div>
          </div>

          {/* Last Updated */}
          <div role="presentation" className="flex items-center gap-1 text-xs">
            <span aria-hidden="true">
              <Clock className="h-3 w-3" />
            </span>
            <span>
              Updated{' '}
              {new Date(template.lastUpdated as any).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div role="presentation" className="flex flex-wrap gap-1 mb-3">
          {template.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {template.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{template.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Languages */}
        <div
          role="presentation"
          className="flex items-center gap-1 text-xs text-muted-foreground"
        >
          <span>Languages:</span>
          <span>{languageDisplay}</span>
        </div>
      </CardContent>

      <CardFooter role="presentation" className="pt-3 gap-2">
        {/* Preview Button */}
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onPreview?.(template.id)}
        >
          <span aria-hidden="true">
            <Eye className="h-4 w-4 mr-1" />
          </span>
          Preview
        </Button>

        {/* Install/Buy Button */}
        <Button
          size="sm"
          className="flex-1"
          onClick={() => onInstall?.(template.id)}
        >
          {template.pricing.type === 'free' ? (
            <>
              <span aria-hidden="true">
                <Download className="h-4 w-4 mr-1" />
              </span>
              Install
            </>
          ) : (
            <>
              <span aria-hidden="true">
                <DollarSign className="h-4 w-4 mr-1" />
              </span>
              Buy Now
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
