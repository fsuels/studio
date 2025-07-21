// src/components/onboarding/OnboardingChecklist.tsx
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useOnboarding } from '@/hooks/useOnboarding';
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  Clock,
  Trophy,
  X,
} from 'lucide-react';
import Link from 'next/link';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  action: string;
  href?: string;
  onClick?: () => void;
  milestone?: keyof NonNullable<
    ReturnType<typeof useOnboarding>['progress']
  >['milestones'];
  estimatedMinutes: number;
}

interface OnboardingChecklistProps {
  onDismiss?: () => void;
  compact?: boolean;
}

export const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({
  onDismiss,
  compact = false,
}) => {
  const { t } = useTranslation('common');
  const { progress, markMilestone, shouldShowOnboarding } = useOnboarding();

  if (!shouldShowOnboarding && !progress) {
    return null;
  }

  const persona = progress?.persona || 'individual';

  const getChecklistItems = (): ChecklistItem[] => {
    const baseItems: ChecklistItem[] = [
      {
        id: 'profile_setup',
        title: 'Complete Your Profile',
        description: 'Add your basic information and preferences',
        action: 'Complete Profile',
        href: '/dashboard?tab=profile',
        milestone: 'profileSetup',
        estimatedMinutes: 2,
      },
      {
        id: 'first_document',
        title: 'Create Your First Document',
        description: 'Try our document wizard with a simple template',
        action: 'Create Document',
        href: '/templates',
        milestone: 'firstDocument',
        estimatedMinutes: 5,
      },
    ];

    switch (persona) {
      case 'business':
        return [
          ...baseItems,
          {
            id: 'esignature_setup',
            title: 'Set Up E-Signature',
            description: 'Configure electronic signatures for your business',
            action: 'Set Up E-Signature',
            href: '/signwell',
            milestone: 'firstSignature',
            estimatedMinutes: 3,
          },
          {
            id: 'business_profile',
            title: 'Add Business Information',
            description: 'Add your company details for professional documents',
            action: 'Update Business Info',
            href: '/dashboard?tab=profile',
            estimatedMinutes: 3,
          },
        ];

      case 'hr':
        return [
          ...baseItems,
          {
            id: 'hr_templates',
            title: 'Explore HR Templates',
            description: 'Browse employee agreements and HR documents',
            action: 'View HR Templates',
            href: '/templates?category=hr',
            estimatedMinutes: 3,
          },
          {
            id: 'bulk_setup',
            title: 'Learn Bulk Operations',
            description: 'Set up efficient workflows for multiple employees',
            action: 'Learn More',
            href: '/dashboard',
            estimatedMinutes: 4,
          },
        ];

      case 'individual':
      default:
        return [
          ...baseItems,
          {
            id: 'notary_service',
            title: 'Try Online Notary',
            description: 'Learn about our 24/7 notarization service',
            action: 'Learn About Notary',
            href: '/online-notary',
            estimatedMinutes: 2,
          },
          {
            id: 'personal_vault',
            title: 'Organize Your Documents',
            description: 'Create folders and organize your legal documents',
            action: 'Organize Documents',
            href: '/dashboard',
            estimatedMinutes: 3,
          },
        ];
    }
  };

  const checklistItems = getChecklistItems();
  const completedMilestones = progress?.milestones || {};
  const completedItems = checklistItems.filter((item) =>
    item.milestone ? completedMilestones[item.milestone] : false,
  );
  const progressPercentage =
    (completedItems.length / checklistItems.length) * 100;
  const totalEstimatedTime = checklistItems.reduce(
    (acc, item) => acc + item.estimatedMinutes,
    0,
  );
  const remainingTime = checklistItems
    .filter((item) => !item.milestone || !completedMilestones[item.milestone])
    .reduce((acc, item) => acc + item.estimatedMinutes, 0);

  const handleItemClick = async (item: ChecklistItem) => {
    if (item.milestone) {
      await markMilestone(item.milestone);
    }
    if (item.onClick) {
      item.onClick();
    }
  };

  if (compact) {
    return (
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Getting Started</h3>
                <p className="text-sm text-muted-foreground">
                  {completedItems.length} of {checklistItems.length} completed
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={progressPercentage} className="w-20 h-2" />
              <span className="text-sm font-medium">
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Getting Started</CardTitle>
              <p className="text-sm text-muted-foreground">
                Complete these steps to unlock the full potential of 123LegalDoc
              </p>
            </div>
          </div>
          {onDismiss && (
            <Button variant="ghost" size="sm" onClick={onDismiss}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>
              {completedItems.length} of {checklistItems.length} completed
            </span>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{remainingTime} min remaining</span>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {checklistItems.map((item) => {
          const isCompleted = item.milestone
            ? !!completedMilestones[item.milestone]
            : false;

          return (
            <div
              key={item.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                isCompleted
                  ? 'bg-green-50 border-green-200'
                  : 'bg-background border-border hover:bg-muted/50'
              }`}
            >
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4
                  className={`font-medium ${isCompleted ? 'text-green-900' : ''}`}
                >
                  {item.title}
                </h4>
                <p
                  className={`text-sm ${isCompleted ? 'text-green-700' : 'text-muted-foreground'}`}
                >
                  {item.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {item.estimatedMinutes} min
                  </Badge>
                  {isCompleted && (
                    <Badge
                      variant="outline"
                      className="text-xs bg-green-100 text-green-700 border-green-300"
                    >
                      <Trophy className="h-2 w-2 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
              </div>

              {!isCompleted && (
                <div className="flex-shrink-0">
                  {item.href ? (
                    <Link href={item.href}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleItemClick(item)}
                        className="gap-2"
                      >
                        {item.action}
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleItemClick(item)}
                      className="gap-2"
                    >
                      {item.action}
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {progressPercentage === 100 && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <Trophy className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-green-900">
              Congratulations! 🎉
            </h3>
            <p className="text-sm text-green-700">
              You've completed the onboarding process. You're ready to create
              amazing legal documents!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OnboardingChecklist;
