// src/components/layout/Header/MobileMenuContent.tsx
'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  LogIn,
  UserPlus,
  LayoutDashboard,
  LogOut,
  Search,
  PlusCircle,
  Compass,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DIRECT_CATEGORY_ITEMS } from './directCategoryConfig';
import { CATEGORY_MENU_CONTENT } from './categoryMenuContent';
import { useAuth } from '@/hooks/useAuth';
import { loadWorkflowModule } from '@/lib/workflow/load-workflow-module';
import type { DocumentSummary } from '@/lib/workflow/document-workflow';
import { getDocTranslation } from '@/lib/i18nUtils';
import { formatDocumentTitle } from '@/lib/format-utils';
import { resolveDocSlug } from '@/lib/slug-alias';
import { cn } from '@/lib/utils';

interface MobileMenuContentProps {
  locale: 'en' | 'es';
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
  topDocIds: string[];
}

const MAX_TOP_DOCS = 3;
const FEATURED_CATEGORY_ORDER: string[] = [
  'agreements-contracts',
  'business-commercial',
  'forms-authorizations',
  'letters-notices',
  'family-personal',
];

export default function MobileMenuContent({
  locale,
  onLinkClick,
}: MobileMenuContentProps) {
  const { t: tHeader } = useTranslation('header');
  const { isLoggedIn, isLoading, logout } = useAuth();
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);

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

  const documentMap = useMemo(() => {
    const map = new Map<string, DocumentSummary>();
    documents.forEach((doc) => {
      map.set(doc.id, doc);
    });
    return map;
  }, [documents]);

  const formatDocumentCount = (count: number) => {
    const fallback = count === 1 ? `${count} document` : `${count} documents`;
    const localized = tHeader('nav.documentCount', {
      count,
      defaultValue: fallback,
    });
    return localized.includes('{{count}}') ? fallback : localized;
  };

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
        topDocIds: docIds.slice(0, MAX_TOP_DOCS),
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

  const renderDocPreview = (docIds: string[]) => {
    if (isLoadingDocuments && documentMap.size === 0) {
      return (
        <div className="space-y-2" aria-hidden="true">
          <Skeleton className="h-6 w-full rounded-md" />
          <Skeleton className="h-6 w-5/6 rounded-md" />
          <Skeleton className="h-6 w-3/4 rounded-md" />
        </div>
      );
    }

    if (docIds.length === 0) {
      return (
        <p className="text-xs text-muted-foreground">
          {tHeader('nav.noDocumentsAvailable', {
            defaultValue: 'No documents available yet.',
          })}
        </p>
      );
    }

    return (
      <ul className="space-y-2">
        {docIds.map((docId) => {
          const docSummary = documentMap.get(docId);
          const translated = docSummary
            ? getDocTranslation(docSummary, locale)
            : undefined;
          const title = translated?.name ?? formatDocumentTitle(docId);
          const description = translated?.description;
          const href = `/${locale}/docs/${resolveDocSlug(docId)}`;

          return (
            <li key={docId}>
              <Link
                href={href}
                onClick={handleNavigate(href)}
                className="group flex items-start gap-3 rounded-lg border border-border/50 bg-card/70 px-3 py-2 transition-all duration-150 hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
              >
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary">
                    {title}
                  </p>
                  {description && (
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {description}
                    </p>
                  )}
                </div>
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
              </Link>
            </li>
          );
        })}
      </ul>
    );
  };

  const renderAccountSection = () => (
    <div className="p-4 border-b border-border bg-background/80 backdrop-blur-xs">
      {isLoading ? (
        <div className="space-y-2" aria-label="Loading user menu">
          <div className="h-10 rounded-md bg-muted animate-pulse" />
          <div className="h-10 rounded-md bg-muted animate-pulse" />
        </div>
      ) : isLoggedIn ? (
        <div className="space-y-2">
          <Button asChild variant="outline" className="justify-start gap-2">
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
        <div className="space-y-2">
          <Button asChild variant="default" className="justify-start gap-2">
            <Link onClick={handleNavigate(`/${locale}/signin`)} href={`/${locale}/signin`}>
              <LogIn className="h-4 w-4" />
              {tHeader('nav.signin', { defaultValue: 'Sign In' })}
            </Link>
          </Button>
          <Button asChild variant="outline" className="justify-start gap-2">
            <Link onClick={handleNavigate(`/${locale}/signup`)} href={`/${locale}/signup`}>
              <UserPlus className="h-4 w-4" />
              {tHeader('nav.signup', { defaultValue: 'Sign Up' })}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );

  const renderQuickActions = () => (
    <section className="space-y-3">
      <div className="rounded-2xl bg-gradient-to-r from-primary/90 to-primary/70 text-primary-foreground p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold tracking-wide uppercase">
              {tHeader('nav.quickAccess', { defaultValue: 'Quick access' })}
            </p>
            <p className="mt-1 text-xs text-primary-foreground/80">
              {tHeader('nav.quickAccessSubtitle', {
                defaultValue: 'Find the right template in a few taps.',
              })}
            </p>
          </div>
          <Compass className="h-5 w-5" />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-2">
          <Button
            asChild
            className="justify-start gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            <Link onClick={handleNavigate(`/${locale}/marketplace`)} href={`/${locale}/marketplace`}>
              <Search className="h-4 w-4" />
              {tHeader('nav.browseDocuments', { defaultValue: 'Browse documents' })}
            </Link>
          </Button>
          <Button asChild variant="secondary" className="justify-start gap-2">
            <Link onClick={handleNavigate(`/${locale}/generate`)} href={`/${locale}/generate`}>
              <PlusCircle className="h-4 w-4" />
              {tHeader('nav.makeDocuments', { defaultValue: 'Create a document' })}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );

  const renderCategories = () => (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {tHeader('nav.documents', { defaultValue: 'Explore documents' })}
        </h2>
        <Button asChild variant="link" size="sm" className="h-auto px-0 text-xs">
          <Link onClick={handleNavigate(`/${locale}/marketplace`)} href={`/${locale}/marketplace`}>
            {tHeader('nav.viewMarketplace', { defaultValue: 'View marketplace' })}
            <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {categorySummaries.map((category) => {
          const Icon = category.icon;
          const hasDocs = category.docIds.length > 0;

          return (
            <div
              key={category.id}
              className={cn(
                'rounded-2xl border border-border/60 bg-card/80 shadow-sm transition hover:shadow-md',
                'p-4'
              )}
            >
              <div className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">
                        {category.title}
                        <span className="ml-2 text-xs font-normal text-muted-foreground">
                          {formatDocumentCount(category.docCount)}
                        </span>
                      </p>
                      {category.subtitle && (
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                          {category.subtitle}
                        </p>
                      )}
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      {category.docCount}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                {renderDocPreview(category.topDocIds)}
              </div>

              <Button
                asChild
                variant="outline"
                size="sm"
                className="mt-4 w-full justify-center gap-2"
              >
                <Link
                  href={`/${locale}/marketplace?category=${encodeURIComponent(category.id)}`}
                  onClick={handleNavigate(`/${locale}/marketplace?category=${encodeURIComponent(category.id)}`)}
                >
                  {tHeader('nav.seeAllInCategory', {
                    categoryName: category.title,
                    defaultValue: `View all ${category.title.toLowerCase()}`,
                  })}
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>

              {!hasDocs && (
                <p className="mt-3 text-xs text-muted-foreground">
                  {tHeader('nav.noDocumentsInCategory', {
                    defaultValue: 'Documents are being added here soon.',
                  })}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );

  return (
    <div className="flex h-full flex-col bg-background">
      {renderAccountSection()}
      <div className="flex-1 overflow-y-auto bg-muted/10 px-4 pb-8 pt-6 space-y-8">
        {renderQuickActions()}
        {renderCategories()}
      </div>
    </div>
  );
}









