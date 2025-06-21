// src/components/marketplace/CreatorProfile.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Star,
  Download,
  Shield,
  Award,
  Calendar,
  Globe,
  ExternalLink,
  TrendingUp,
  Users,
  DollarSign,
  FileText,
  MessageSquare,
} from 'lucide-react';
import type {
  CreatorProfile as CreatorProfileType,
  CreatorBadge,
} from '@/types/marketplace';
import { TemplateCard } from './TemplateCard';

interface CreatorProfileProps {
  creatorId: string;
  profile?: CreatorProfileType;
}

interface CreatorStatsProps {
  stats: {
    totalTemplates: number;
    publishedTemplates: number;
    totalDownloads: number;
    totalRevenue: number;
    averageRating: number;
    monthlyDownloads: number;
    topTemplates: Array<{
      id: string;
      name: string;
      downloads: number;
      rating: number;
    }>;
  };
}

function CreatorStats({ stats }: CreatorStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <FileText className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">{stats.totalTemplates}</div>
          <div className="text-sm text-muted-foreground">Total Templates</div>
          <div className="text-xs text-green-600 mt-1">
            {stats.publishedTemplates} published
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <Download className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">
            {formatNumber(stats.totalDownloads)}
          </div>
          <div className="text-sm text-muted-foreground">Total Downloads</div>
          <div className="text-xs text-blue-600 mt-1">
            {formatNumber(stats.monthlyDownloads)} this month
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">
            {stats.averageRating.toFixed(1)}
          </div>
          <div className="text-sm text-muted-foreground">Average Rating</div>
          <div className="flex justify-center mt-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(stats.averageRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <DollarSign className="h-8 w-8 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">
            {formatCurrency(stats.totalRevenue)}
          </div>
          <div className="text-sm text-muted-foreground">Total Earnings</div>
          <div className="text-xs text-green-600 mt-1">
            <TrendingUp className="inline h-3 w-3 mr-1" />
            Growing
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function BadgeDisplay({ badge }: { badge: CreatorBadge }) {
  const getBadgeColor = (category: CreatorBadge['category']) => {
    switch (category) {
      case 'quality':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'popularity':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'contribution':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'expertise':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg border bg-card">
      <div className="text-lg">{badge.icon}</div>
      <div>
        <div
          className={`text-xs font-semibold ${getBadgeColor(badge.category)}`}
        >
          {badge.name}
        </div>
        <div className="text-xs text-muted-foreground">{badge.description}</div>
      </div>
    </div>
  );
}

export function CreatorProfile({ creatorId, profile }: CreatorProfileProps) {
  const [creatorData, setCreatorData] = useState<CreatorProfileType | null>(
    profile || null,
  );
  const [creatorStats, setCreatorStats] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(!profile);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!profile) {
      loadCreatorData();
    }
  }, [creatorId, profile]);

  const loadCreatorData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/marketplace/creators/${creatorId}?includeTemplates=true&includeStats=true`,
      );
      const data = await response.json();

      if (data.success) {
        setCreatorData(data.data.profile);
        setCreatorStats(data.data.stats);
        setTemplates(data.data.templates || []);
      }
    } catch (error) {
      console.error('Failed to load creator data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactCreator = () => {
    // TODO: Implement contact creator functionality
    console.log('Contact creator:', creatorId);
  };

  const handleTemplateInstall = (templateId: string) => {
    // TODO: Implement template installation
    console.log('Install template:', templateId);
  };

  const handleTemplatePreview = (templateId: string) => {
    // TODO: Implement template preview
    console.log('Preview template:', templateId);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-muted rounded-full" />
              <div className="space-y-2 flex-1">
                <div className="h-6 bg-muted rounded w-48" />
                <div className="h-4 bg-muted rounded w-32" />
                <div className="h-4 bg-muted rounded w-64" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!creatorData) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Creator profile not found
          </h3>
          <p className="text-muted-foreground">
            This creator's profile is not available or has been removed.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Creator Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={creatorData.avatar}
                  alt={creatorData.displayName}
                />
                <AvatarFallback className="text-2xl">
                  {creatorData.displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>

              {creatorData.verified && (
                <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified Creator
                </Badge>
              )}
            </div>

            {/* Creator Details */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-2xl font-bold">
                  {creatorData.displayName}
                </h1>
                {creatorData.bio && (
                  <p className="text-muted-foreground mt-1">
                    {creatorData.bio}
                  </p>
                )}
              </div>

              {/* Creator Meta */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Member since {new Date().getFullYear() - 1}{' '}
                  {/* TODO: Get actual join date */}
                </div>

                {creatorData.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    <Link
                      href={creatorData.website}
                      target="_blank"
                      className="hover:text-primary flex items-center gap-1"
                    >
                      Website
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                )}

                {creatorData.yearsExperience &&
                  creatorData.yearsExperience > 0 && (
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      {creatorData.yearsExperience} years experience
                    </div>
                  )}
              </div>

              {/* Specializations */}
              {creatorData.specializations &&
                creatorData.specializations.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Specializations:</h4>
                    <div className="flex flex-wrap gap-1">
                      {creatorData.specializations.map((spec) => (
                        <Badge key={spec} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

              {/* Credentials */}
              {creatorData.credentials &&
                creatorData.credentials.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Credentials:</h4>
                    <div className="space-y-1">
                      {creatorData.credentials.map((credential, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Award className="h-4 w-4 text-yellow-500" />
                          {credential}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Contact Button */}
            <div>
              <Button onClick={handleContactCreator} className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Contact Creator
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Badges */}
      {creatorData.badges && creatorData.badges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {creatorData.badges.map((badge) => (
                <BadgeDisplay key={badge.id} badge={badge} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      {creatorStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CreatorStats stats={creatorStats} />
          </CardContent>
        </Card>
      )}

      {/* Top Templates */}
      {creatorStats?.topTemplates && creatorStats.topTemplates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {creatorStats.topTemplates.map((template: any, index: number) => (
                <div
                  key={template.id}
                  className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg"
                >
                  <div className="text-2xl font-bold text-muted-foreground">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{template.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        {template.downloads.toLocaleString()} downloads
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {template.rating.toFixed(1)}
                      </div>
                      {template.revenue && (
                        <span>
                          ${(template.revenue / 100).toLocaleString()} revenue
                        </span>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/marketplace/templates/${template.id}`}>
                      View Template
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Templates */}
      {templates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Latest Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.slice(0, 6).map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  showCreator={false}
                  size="compact"
                  onInstall={handleTemplateInstall}
                  onPreview={handleTemplatePreview}
                />
              ))}
            </div>

            {templates.length > 6 && (
              <div className="text-center mt-6">
                <Button variant="outline" asChild>
                  <Link href={`/marketplace?createdBy=${creatorId}`}>
                    View All Templates ({templates.length})
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
