// src/components/marketplace/TemplateDetailView.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Star,
  Download,
  Eye,
  Shield,
  Crown,
  DollarSign,
  Clock,
  FileText,
  GitBranch,
  Users,
  TrendingUp,
  Globe,
  Languages,
  Calendar,
  Award,
  MessageSquare,
} from 'lucide-react';
import type { MarketplaceTemplate, TemplateVersion } from '@/types/marketplace';
import { TemplateReviews } from './TemplateReviews';
import { VersionHistory } from './VersionHistory';
import { CreatorProfile } from './CreatorProfile';

interface TemplateDetailViewProps {
  template: MarketplaceTemplate;
  currentVersion: TemplateVersion;
  versions?: TemplateVersion[];
  onInstall: (templateId: string) => void;
  onPreview: (templateId: string) => void;
  onContactCreator?: (creatorId: string) => void;
}

export function TemplateDetailView({
  template,
  currentVersion,
  versions = [],
  onInstall,
  onPreview,
  onContactCreator,
}: TemplateDetailViewProps) {
  const [activeTab, setActiveTab] = useState('overview');

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

  const getRatingPercentage = (rating: number) => {
    const total = template.ratings.totalRatings;
    if (total === 0) return 0;
    return (
      (template.ratings.ratingDistribution[
        rating as keyof typeof template.ratings.ratingDistribution
      ] /
        total) *
      100
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Template Info */}
        <div className="flex-1 space-y-4">
          {/* Title and Badges */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              {template.featured && (
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                  <Crown className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
              {template.verified && (
                <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
              <Badge variant="secondary">{template.category}</Badge>
              <Badge variant="outline">v{template.currentVersion}</Badge>
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              {template.name}
            </h1>
            <p className="text-lg text-muted-foreground">
              {template.description}
            </p>
          </div>

          {/* Creator Info */}
          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={template.creatorProfile?.avatar}
                alt={template.creatorProfile?.displayName}
              />
              <AvatarFallback>
                {template.creatorProfile?.displayName?.charAt(0) || 'C'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">
                  {template.creatorProfile?.displayName || 'Creator'}
                </h3>
                {template.creatorProfile?.verified && (
                  <Shield className="h-4 w-4 text-blue-500" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {template.creatorProfile?.bio ||
                  'Professional template creator'}
              </p>
              <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                <span>
                  {template.creatorProfile?.totalTemplates || 0} templates
                </span>
                <span>
                  {formatNumber(template.creatorProfile?.totalDownloads || 0)}{' '}
                  downloads
                </span>
                <span>
                  ⭐{' '}
                  {template.creatorProfile?.averageRating?.toFixed(1) || '0.0'}
                </span>
              </div>
            </div>
            {onContactCreator && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onContactCreator(template.createdBy)}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Contact
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold">
                  {template.ratings.averageRating.toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatNumber(template.ratings.totalRatings)} reviews
              </p>
            </div>

            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Download className="h-4 w-4" />
                <span className="font-bold">
                  {formatNumber(template.stats.totalDownloads)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">downloads</p>
            </div>

            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="h-4 w-4" />
                <span className="font-bold">
                  {formatNumber(template.stats.uniqueUsers)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">users</p>
            </div>

            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="h-4 w-4" />
                <span className="font-bold text-xs">
                  {new Date(template.lastUpdated as any).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">last updated</p>
            </div>
          </div>
        </div>

        {/* Right: Purchase Panel */}
        <div className="lg:w-80">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Get This Template</span>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {formatPrice(
                      template.pricing.basePrice,
                      template.pricing.currency,
                    )}
                  </div>
                  {template.pricing.discountedPrice && (
                    <div className="text-sm text-muted-foreground line-through">
                      {formatPrice(
                        template.pricing.basePrice,
                        template.pricing.currency,
                      )}
                    </div>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => onInstall(template.id)}
                >
                  {template.pricing.type === 'free' ? (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Install Free
                    </>
                  ) : (
                    <>
                      <DollarSign className="h-4 w-4 mr-2" />
                      Buy Now
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onPreview(template.id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Template
                </Button>
              </div>

              {/* What's Included */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">What's included:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-500" />
                    Complete template file
                  </li>
                  <li className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-blue-500" />
                    Valid for{' '}
                    {template.jurisdiction || 'Multiple jurisdictions'}
                  </li>
                  <li className="flex items-center gap-2">
                    <Languages className="h-4 w-4 text-purple-500" />
                    Available in{' '}
                    {template.languageSupport.join(', ').toUpperCase()}
                  </li>
                  <li className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-orange-500" />
                    Version updates included
                  </li>
                  {template.requiresNotarization && (
                    <li className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-red-500" />
                      Notarization may be required
                    </li>
                  )}
                </ul>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Tags:</h4>
                <div className="flex flex-wrap gap-1">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="versions">Versions</TabsTrigger>
          <TabsTrigger value="creator">Creator</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Template Description */}
          <Card>
            <CardHeader>
              <CardTitle>Template Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-sm max-w-none">
                <p>{template.description}</p>
                {/* Add more detailed description, usage instructions, etc. */}
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="space-y-2">
                  <h4 className="font-semibold">Specifications</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span>{template.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Jurisdiction:</span>
                      <span>{template.jurisdiction || 'Multiple'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>States:</span>
                      <span>
                        {Array.isArray(template.states)
                          ? template.states.join(', ')
                          : 'All'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Languages:</span>
                      <span>
                        {template.languageSupport.join(', ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Requirements</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Notarization:</span>
                      <span>
                        {template.requiresNotarization
                          ? 'Required'
                          : 'Not required'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Recording:</span>
                      <span>
                        {template.canBeRecorded ? 'Available' : 'Not available'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Base Price:</span>
                      <span>
                        {formatPrice(
                          template.pricing.basePrice,
                          template.pricing.currency,
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rating Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12">
                      <span className="text-sm">{rating}</span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    </div>
                    <Progress
                      value={getRatingPercentage(rating)}
                      className="flex-1 h-2"
                    />
                    <span className="text-xs text-muted-foreground w-10 text-right">
                      {getRatingPercentage(rating).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <TemplateReviews templateId={template.id} />
        </TabsContent>

        <TabsContent value="versions">
          <VersionHistory
            templateId={template.id}
            versions={versions}
            currentVersion={template.currentVersion}
          />
        </TabsContent>

        <TabsContent value="creator">
          <CreatorProfile
            creatorId={template.createdBy}
            profile={template.creatorProfile}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
