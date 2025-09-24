// src/components/layout/Header/MobileMenuContent.tsx
'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  LogIn,
  UserPlus,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DIRECT_CATEGORY_ITEMS } from './directCategoryConfig';
import { CATEGORY_MENU_CONTENT } from '@/components/layout/Header/categoryMenuContent';
import { useAuth } from '@/hooks/useAuth';
import { loadWorkflowModule } from '@/lib/workflow/load-workflow-module';
import type { DocumentSummary } from '@/lib/workflow/document-workflow';
import { getDocTranslation } from '@/lib/i18nUtils';
import { formatDocumentTitle } from '@/lib/format-utils';
import { resolveDocSlug } from '@/lib/slug-alias';
import { cn } from '@/lib/utils';

const AuthModal = dynamic(() => import('@/components/shared/AuthModal'), {
  ssr: false,
});

const FEATURED_CATEGORY_ORDER: string[] = [
  'agreements-contracts',
  'family-personal',
  'forms-authorizations',
  'letters-notices',
  'business-commercial',
];

interface MobileMenuContentProps {
  locale: 'en' | 'es';
  mounted: boolean;
  onLinkClick?: () => void;
}

interface CategorySummary {
  id: string;
  label: string;
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  docIds: string[];
  docCount: number;
}

export default function MobileMenuContent({
  locale,
  mounted,
  onLinkClick,
}: MobileMenuContentProps) {
  const { t: tHeader } = useTranslation('header');
  const { isLoggedIn, isLoading, logout } = useAuth();
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, string | null>>({});

  useEffect(() => {
    let cancelled = false;

    loadWorkflowModule()
      .then((module) => {
        if (cancelled) return;
        const workflowDocs = module.getWorkflowDocuments({ jurisdiction: 'us' });
        setDocuments(workflowDocs);
      })
      .catch((error) => {
        console.error('[MobileMenuContent] Failed to load workflow documents', error);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingDocuments(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const router = useRouter();

  const handleNavigate = useCallback(
    (href: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      onLinkClick?.();
      router.push(href);
    },
    [onLinkClick, router],
  );

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    onLinkClick?.();
  };

  const documentMap = useMemo(() => {
    const map = new Map<string, DocumentSummary>();
    documents.forEach((doc) => {
      map.set(doc.id, doc);
    });
    return map;
  }, [documents]);

  const categorySummaries = useMemo<CategorySummary[]>(() => {
    return FEATURED_CATEGORY_ORDER.map((categoryId) => {
      const directCategory = DIRECT_CATEGORY_ITEMS.find(
        (item) => item.id === categoryId,
      );
      const content = CATEGORY_MENU_CONTENT[categoryId];
      if (!directCategory || !content) {
        return null;
      }

      const docIds = Array.from(
        new Set(content.sections.flatMap((section) => section.documents)),
      );

      return {
        id: categoryId,
        label: directCategory.labelKey,
        title: content.title,
        subtitle: content.subtitle,
        icon: directCategory.icon,
        docIds,
        docCount: docIds.length,
      } satisfies CategorySummary;
    }).filter(Boolean) as CategorySummary[];
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('[MobileMenuContent] Failed to log out', error);
    } finally {
      onLinkClick?.();
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    const nextCategory = expandedCategoryId === categoryId ? null : categoryId;

    setExpandedCategoryId(nextCategory);
    setExpandedSections((prev) => {
      if (!nextCategory) {
        return prev;
      }

      return {
        ...prev,
        [nextCategory]: prev[nextCategory] ?? null,
      };
    });
  };

  const handleSectionToggle = (categoryId: string, sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [categoryId]: prev[categoryId] === sectionId ? null : sectionId,
    }));
  };

  const renderAccountSection = () => (
    <div className="p-5 border-b border-border/70 bg-background/95 backdrop-blur-xs">
      {isLoading ? (
        <div className="space-y-2" aria-label="Loading user menu">
          <div className="h-10 rounded-md bg-muted animate-pulse" />
          <div className="h-10 rounded-md bg-muted animate-pulse" />
        </div>
      ) : isLoggedIn ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {tHeader('nav.welcomeBack', { defaultValue: 'Your account' })}
          </p>
          <Button asChild variant="outline" className="justify-start gap-2 font-medium">
            <Link onClick={handleNavigate(`/${locale}/dashboard`)} href={`/${locale}/dashboard`}>
              <LayoutDashboard className="h-4 w-4" />
              {tHeader('nav.dashboard', { defaultValue: 'Dashboard' })}
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="justify-start gap-2 text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            {tHeader('nav.logout', { defaultValue: 'Logout' })}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-primary text-sm font-semibold">
            <button
              type="button"
              onClick={() => openAuthModal('signup')}
              className="hover:underline"
            >
              {tHeader('nav.createAccount', { defaultValue: 'Create Free Account' })}
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('signin')}
              className="hover:underline"
            >
              {tHeader('nav.signin', { defaultValue: 'Sign In' })}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            {tHeader('nav.authPrompt', {
              defaultValue: 'Save progress, manage documents, and access personalized dashboards.',
            })}
          </p>
        </div>
      )}
    </div>
  );

  const renderCategoryList = () => (
    <section className="space-y-4">
      <div className="rounded-3xl border border-border/50 bg-card shadow-lg overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-border/40 bg-gradient-to-r from-primary/5 via-card to-card">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {tHeader('nav.browseDocuments', { defaultValue: 'Browse documents' })}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {tHeader('nav.browseDocumentsSearchOnly', {
              defaultValue: 'Search thousands of state-compliant templates.',
            })}
          </p>
        </div>

        <div className="divide-y divide-border/40">
          {categorySummaries.map((category) => {
            const isExpanded = expandedCategoryId === category.id;
            const Icon = category.icon;
            const sectionExpandedId = expandedSections[category.id] ?? null;
            const categoryContent = CATEGORY_MENU_CONTENT[category.id];

            return (
              <div key={category.id} className="bg-background/80">
                <button
                  type="button"
                  onClick={() => handleCategoryToggle(category.id)}
                  className={cn(
                    'w-full flex items-center justify-between px-6 py-4 text-left transition-colors duration-200',
                    isExpanded ? 'bg-primary/10 text-primary' : 'hover:bg-muted/40',
                  )}
                  aria-expanded={isExpanded}
                >
                  <span className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex flex-col">
                      <span className="text-base font-semibold">
                        {category.title}
                      </span>
                      {category.subtitle && (
                        <span className="text-xs text-muted-foreground">
                          {category.subtitle}
                        </span>
                      )}
                    </span>
                  </span>
                  <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <span className="hidden xs:inline">
                      {category.docCount} docs
                    </span>
                    <span className={cn(
                      'inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-primary transition-transform duration-200',
                      isExpanded && 'rotate-180',
                    )}>
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </span>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-3 space-y-3 bg-muted/15">
                    {categoryContent.sections.map((section) => {
                      const sectionDocs = section.documents
                        .map((docId) => documentMap.get(docId))
                        .filter((doc): doc is DocumentSummary => Boolean(doc));
                      const sectionDocCount = sectionDocs.length;
                      const sectionIsExpanded = sectionExpandedId === section.id;

                      return (
                        <div
                          key={section.id}
                          className="rounded-2xl border border-border/50 bg-card/90 shadow-inner"
                        >
                          <button
                            type="button"
                            onClick={() => handleSectionToggle(category.id, section.id)}
                            className="flex w-full items-center justify-between px-4 py-3 text-left"
                            aria-expanded={sectionIsExpanded}
                          >
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-foreground">
                                {section.label}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {sectionDocCount}{' '}
                                {sectionDocCount === 1 ? 'document' : 'documents'}
                              </span>
                            </div>
                            <span
                              className={cn(
                                'inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary transition-transform duration-200',
                                sectionIsExpanded && 'rotate-180',
                              )}
                            >
                              <ChevronDown className="h-4 w-4" />
                            </span>
                          </button>

                          {sectionIsExpanded && (
                            <div className="px-4 pb-4 space-y-2">
                              {isLoadingDocuments && sectionDocCount === 0 ? (
                                <div className="space-y-2" aria-hidden="true">
                                  <Skeleton className="h-6 w-full rounded-md" />
                                  <Skeleton className="h-6 w-5/6 rounded-md" />
                                  <Skeleton className="h-6 w-2/3 rounded-md" />
                                </div>
                              ) : sectionDocCount === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                  {tHeader('nav.noDocumentsAvailable', {
                                    defaultValue: 'No documents available yet.',
                                  })}
                                </p>
                              ) : (
                                <ul className="space-y-1">
                                  {sectionDocs.map((doc) => {
                                    const translated = getDocTranslation(doc, locale);
                                    const href = `/${locale}/docs/${resolveDocSlug(doc.id)}`;

                                    return (
                                      <li key={doc.id}>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            onLinkClick?.();
                                            router.push(href);
                                          }}
                                          className="w-full rounded-lg bg-background px-3 py-2 text-left text-sm font-medium text-primary shadow-sm transition hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                                        >
                                          {translated?.name ?? formatDocumentTitle(doc.id)}
                                        </button>
                                      </li>
                                    );
                                  })}
                                </ul>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    <Button
                      asChild
                      variant="ghost"
                      className="w-full justify-start px-3 py-2 text-sm font-semibold text-primary hover:text-primary"
                    >
                      <Link
                        href={`/${locale}/marketplace?category=${encodeURIComponent(category.id)}`}
                        onClick={handleNavigate(`/${locale}/marketplace?category=${encodeURIComponent(category.id)}`)}
                      >
                        {tHeader('nav.viewAllInCategoryShort', {
                          defaultValue: 'More >>',
                        })}
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );

  return (
    <div className="flex h-full flex-col bg-background">
      {renderAccountSection()}
      <div className="flex-1 overflow-y-auto bg-muted/10 px-4 pb-8 pt-6 space-y-6">
        {renderCategoryList()}
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authModalMode}
      />
    </div>
  );
}
