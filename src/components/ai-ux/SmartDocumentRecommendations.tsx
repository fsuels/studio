'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Clock, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface DocumentRecommendation {
  id: string;
  name: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  confidence: number;
  estimatedTime: string;
  popularity: number;
  relatedDocs?: string[];
  seoBoost?: number;
}

interface SmartRecommendationsProps {
  currentDocument?: string;
  userProfile?: {
    industry?: string;
    location?: string;
    previousDocs?: string[];
  };
  searchQuery?: string;
  className?: string;
}

export function SmartDocumentRecommendations({
  currentDocument,
  userProfile,
  searchQuery,
  className = '',
}: SmartRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<
    DocumentRecommendation[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateRecommendations();
  }, [currentDocument, userProfile, searchQuery]);

  const generateRecommendations = async () => {
    setLoading(true);

    // AI-powered recommendation engine simulation
    const allDocuments = [
      {
        id: 'llc-operating-agreement',
        name: 'LLC Operating Agreement',
        category: 'Business',
        estimatedTime: '20-30 minutes',
        popularity: 95,
      },
      {
        id: 'employment-contract',
        name: 'Employment Contract',
        category: 'Employment',
        estimatedTime: '15-25 minutes',
        popularity: 88,
      },
      {
        id: 'lease-agreement',
        name: 'Residential Lease Agreement',
        category: 'Real Estate',
        estimatedTime: '10-20 minutes',
        popularity: 92,
      },
      {
        id: 'non-disclosure-agreement',
        name: 'Non-Disclosure Agreement',
        category: 'Business',
        estimatedTime: '10-15 minutes',
        popularity: 89,
      },
      {
        id: 'power-of-attorney',
        name: 'Power of Attorney',
        category: 'Estate Planning',
        estimatedTime: '15-25 minutes',
        popularity: 76,
      },
      {
        id: 'service-agreement',
        name: 'Service Agreement',
        category: 'Business',
        estimatedTime: '15-20 minutes',
        popularity: 84,
      },
    ];

    // AI recommendation logic
    const recommendations = allDocuments
      .map((doc) => {
        let confidence = 50;
        let reason = 'Popular document';
        let priority: 'high' | 'medium' | 'low' = 'medium';
        let seoBoost = 1;

        // Industry-based recommendations
        if (
          userProfile?.industry === 'technology' &&
          doc.category === 'Business'
        ) {
          confidence += 25;
          reason = 'Recommended for tech companies';
          priority = 'high';
          seoBoost = 1.5;
        }

        // Location-based recommendations
        if (userProfile?.location && doc.category === 'Real Estate') {
          confidence += 15;
          reason = `Popular in ${userProfile.location}`;
          seoBoost = 1.3;
        }

        // Search query matching
        if (searchQuery) {
          const queryLower = searchQuery.toLowerCase();
          if (doc.name.toLowerCase().includes(queryLower)) {
            confidence += 35;
            reason = 'Matches your search';
            priority = 'high';
            seoBoost = 2;
          }
        }

        // Related documents logic
        const relatedDocs: string[] = [];
        if (currentDocument === 'llc-operating-agreement') {
          if (
            doc.id === 'employment-contract' ||
            doc.id === 'non-disclosure-agreement'
          ) {
            confidence += 30;
            reason = 'Often needed together';
            relatedDocs.push(currentDocument);
            seoBoost = 1.8;
          }
        }

        // Popularity boost
        confidence += doc.popularity * 0.2;

        // Previous documents pattern
        if (
          userProfile?.previousDocs?.includes('vehicle-bill-of-sale') &&
          doc.category === 'Real Estate'
        ) {
          confidence += 20;
          reason = 'Based on your document history';
          seoBoost = 1.4;
        }

        return {
          ...doc,
          confidence: Math.min(confidence, 99),
          reason,
          priority,
          relatedDocs,
          seoBoost,
        } as DocumentRecommendation;
      })
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 4);

    setRecommendations(recommendations);
    setLoading(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <Card className={`${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Document Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          AI Document Recommendations
          <Badge variant="secondary" className="ml-auto">
            Powered by AI
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div
              key={rec.id}
              className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{rec.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{rec.reason}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Badge className={getPriorityColor(rec.priority)}>
                    {rec.priority}
                  </Badge>
                  <span
                    className={`text-sm font-medium ${getConfidenceColor(rec.confidence)}`}
                  >
                    {rec.confidence}% match
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {rec.estimatedTime}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {rec.popularity}% popular
                </div>
                {rec.seoBoost && rec.seoBoost > 1 && (
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    SEO boost
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <Badge variant="outline">{rec.category}</Badge>
                <Link href={`/docs/${rec.id}/start`}>
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Start Document
                  </Button>
                </Link>
              </div>

              {rec.relatedDocs && rec.relatedDocs.length > 0 && (
                <div className="mt-2 pt-2 border-t">
                  <p className="text-xs text-gray-500">
                    Often used with: {rec.relatedDocs.join(', ')}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-700">
            <Sparkles className="inline h-4 w-4 mr-1" />
            Recommendations improve as you use our platform. Each suggestion is
            optimized for SEO and user engagement.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
