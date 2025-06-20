'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Command } from 'cmdk';
import {
  Search,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
  BarChart3,
  Shield,
  ExternalLink,
  Home,
  Clock,
  Star,
  Zap,
  ChevronRight,
  Filter,
  ArrowUpDown,
  Share2,
  Copy
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { enhancedSearch, getSearchSuggestions } from '@/lib/enhanced-search';
import { Badge } from '@/components/ui/badge';
import { updateUrlParams, getCurrentSearchParams, createShareableUrl, type SearchParams } from '@/lib/url-params';

interface SearchResult {
  slug: string;
  title: string;
  description: string;
  complexity: string;
  popular: boolean;
  category: string;
  relevanceScore: number;
  matchType: 'exact' | 'synonym' | 'fuzzy' | 'category';
}

interface CommandAction {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  group: string;
  keywords?: string[];
  url?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  locale: 'en' | 'es';
  userRole?: string;
}

export default function CommandPalette({
  isOpen,
  onClose,
  locale,
  userRole
}: CommandPaletteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useTranslation(['common', 'header']);
  
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize from URL parameters
  useEffect(() => {
    if (isOpen) {
      const urlParams = getCurrentSearchParams();
      if (urlParams.q) {
        setSearch(urlParams.q);
      }
      if (urlParams.filter) {
        setSelectedFilter(urlParams.filter);
      }
    }
  }, [isOpen]);
  
  // Generate navigation actions based on user role and current path
  const getNavigationActions = useCallback((): CommandAction[] => {
    const isAdmin = userRole === 'admin' || pathname?.includes('/admin');
    
    const baseActions: CommandAction[] = [
      {
        id: 'home',
        title: t('nav.home', { defaultValue: 'Home' }),
        description: 'Go to homepage',
        icon: <Home className="h-4 w-4" />,
        action: () => router.push(`/${locale}`),
        group: 'navigation',
        keywords: ['home', 'homepage', 'start'],
        url: `/${locale}`
      },
      {
        id: 'dashboard',
        title: t('nav.dashboard', { defaultValue: 'Dashboard' }),
        description: 'View your documents and account',
        icon: <LayoutDashboard className="h-4 w-4" />,
        action: () => router.push(`/${locale}/dashboard`),
        group: 'navigation',
        keywords: ['dashboard', 'documents', 'account', 'my'],
        url: `/${locale}/dashboard`
      },
      {
        id: 'generate',
        title: t('nav.generate', { defaultValue: 'Create Document' }),
        description: 'Start creating a new document',
        icon: <FileText className="h-4 w-4" />,
        action: () => router.push(`/${locale}/generate`),
        group: 'navigation',
        keywords: ['create', 'new', 'document', 'generate', 'start'],
        url: `/${locale}/generate`
      },
      {
        id: 'docs',
        title: t('nav.documents', { defaultValue: 'Browse Documents' }),
        description: 'Browse all document templates',
        icon: <FileText className="h-4 w-4" />,
        action: () => router.push(`/${locale}/docs`),
        group: 'navigation',
        keywords: ['browse', 'templates', 'documents', 'library'],
        url: `/${locale}/docs`
      },
      {
        id: 'support',
        title: t('nav.support', { defaultValue: 'Help & Support' }),
        description: 'Get help and support',
        icon: <Shield className="h-4 w-4" />,
        action: () => router.push(`/${locale}/support`),
        group: 'navigation',
        keywords: ['help', 'support', 'contact', 'faq'],
        url: `/${locale}/support`
      }
    ];

    // Add admin actions if user has admin role
    if (isAdmin) {
      baseActions.push(
        {
          id: 'admin-dashboard',
          title: 'Admin Dashboard',
          description: 'Access admin controls',
          icon: <Settings className="h-4 w-4" />,
          action: () => router.push(`/${locale}/admin`),
          group: 'admin',
          keywords: ['admin', 'control', 'management'],
          url: `/${locale}/admin`
        },
        {
          id: 'admin-users',
          title: 'User Management',
          description: 'Manage users and roles',
          icon: <Users className="h-4 w-4" />,
          action: () => router.push(`/${locale}/admin/users`),
          group: 'admin',
          keywords: ['users', 'roles', 'permissions', 'manage'],
          url: `/${locale}/admin/users`
        },
        {
          id: 'admin-analytics',
          title: 'Analytics',
          description: 'View analytics and reports',
          icon: <BarChart3 className="h-4 w-4" />,
          action: () => router.push(`/${locale}/admin/analytics`),
          group: 'admin',
          keywords: ['analytics', 'reports', 'stats', 'metrics'],
          url: `/${locale}/admin/analytics`
        },
        {
          id: 'admin-fraud',
          title: 'Fraud Detection',
          description: 'Monitor fraud detection',
          icon: <Shield className="h-4 w-4" />,
          action: () => router.push(`/${locale}/admin/fraud-detection`),
          group: 'admin',
          keywords: ['fraud', 'security', 'detection', 'monitor'],
          url: `/${locale}/admin/fraud-detection`
        },
        {
          id: 'admin-audit',
          title: 'Audit Trails',
          description: 'View audit logs',
          icon: <Clock className="h-4 w-4" />,
          action: () => router.push(`/${locale}/admin/audit-trails`),
          group: 'admin',
          keywords: ['audit', 'logs', 'history', 'trail'],
          url: `/${locale}/admin/audit-trails`
        }
      );
    }

    return baseActions;
  }, [router, locale, userRole, pathname, t]);

  // Filter actions based on current filter
  const getFilterActions = useCallback(() => {
    const filterActions: CommandAction[] = [
      {
        id: 'filter-all',
        title: 'Show All Results',
        icon: <ArrowUpDown className="h-4 w-4" />,
        action: () => {
          setSelectedFilter('all');
          updateUrlParams({ filter: 'all', q: search || undefined });
        },
        group: 'filters',
        keywords: ['all', 'everything']
      },
      {
        id: 'filter-documents',
        title: 'Documents Only',
        icon: <FileText className="h-4 w-4" />,
        action: () => {
          setSelectedFilter('documents');
          updateUrlParams({ filter: 'documents', q: search || undefined });
        },
        group: 'filters',
        keywords: ['documents', 'templates']
      },
      {
        id: 'filter-navigation',
        title: 'Navigation Only',
        icon: <ChevronRight className="h-4 w-4" />,
        action: () => {
          setSelectedFilter('navigation');
          updateUrlParams({ filter: 'navigation', q: search || undefined });
        },
        group: 'filters',
        keywords: ['navigation', 'pages']
      }
    ];

    if (userRole === 'admin') {
      filterActions.push({
        id: 'filter-admin',
        title: 'Admin Only',
        icon: <Settings className="h-4 w-4" />,
        action: () => {
          setSelectedFilter('admin');
          updateUrlParams({ filter: 'admin', q: search || undefined });
        },
        group: 'filters',
        keywords: ['admin', 'management']
      });
    }

    // Add sharing actions
    filterActions.push(
      {
        id: 'share-search',
        title: 'Share Current Search',
        description: 'Copy shareable URL for current search',
        icon: <Share2 className="h-4 w-4" />,
        action: async () => {
          const shareUrl = createShareableUrl({
            q: search || undefined,
            filter: selectedFilter !== 'all' ? selectedFilter : undefined
          });
          try {
            await navigator.clipboard.writeText(shareUrl);
            // You could add a toast notification here
          } catch (error) {
            console.error('Failed to copy URL:', error);
          }
        },
        group: 'actions',
        keywords: ['share', 'copy', 'url', 'link']
      },
      {
        id: 'copy-search',
        title: 'Copy Search Query',
        description: 'Copy current search query to clipboard',
        icon: <Copy className="h-4 w-4" />,
        action: async () => {
          if (search) {
            try {
              await navigator.clipboard.writeText(search);
              // You could add a toast notification here
            } catch (error) {
              console.error('Failed to copy search:', error);
            }
          }
        },
        group: 'actions',
        keywords: ['copy', 'search', 'query', 'clipboard']
      }
    );

    return filterActions;
  }, [selectedFilter, userRole, search]);

  // Debounced search for documents
  const performDocumentSearch = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      if (query.trim().length === 0) {
        // Show suggestions when empty
        try {
          const suggestions = await getSearchSuggestions(locale);
          setSearchResults(suggestions);
        } catch (error) {
          console.error('Failed to get suggestions:', error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
      return;
    }

    setIsSearching(true);
    try {
      const results = await enhancedSearch(query, locale, {
        maxResults: 20,
        roleFilter: userRole,
      });
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [locale, userRole]);

  // Debounced search effect
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      performDocumentSearch(search);
      
      // Update URL parameters with search query
      if (search.trim()) {
        updateUrlParams({ 
          q: search, 
          filter: selectedFilter !== 'all' ? selectedFilter : undefined 
        }, { replace: true });
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [search, performDocumentSearch, selectedFilter]);

  // Load suggestions on open
  useEffect(() => {
    if (isOpen && search.trim().length === 0) {
      performDocumentSearch('');
    }
  }, [isOpen, performDocumentSearch]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open command palette logic would be handled by parent
        }
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isOpen, onClose]);

  const handleSelect = useCallback((callback: () => void) => {
    callback();
    onClose();
  }, [onClose]);

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getMatchIcon = (matchType: string) => {
    switch (matchType) {
      case 'exact': return <Zap className="h-3 w-3 text-blue-500" />;
      case 'synonym': return <Star className="h-3 w-3 text-yellow-500" />;
      default: return <Search className="h-3 w-3 text-gray-400" />;
    }
  };

  if (!isOpen) return null;

  const navigationActions = getNavigationActions();
  const filterActions = getFilterActions();
  
  // Filter results based on selectedFilter
  const filteredNavigationActions = selectedFilter === 'all' || selectedFilter === 'navigation' 
    ? navigationActions.filter(action => action.group === 'navigation')
    : [];
  
  const filteredAdminActions = selectedFilter === 'all' || selectedFilter === 'admin'
    ? navigationActions.filter(action => action.group === 'admin')
    : [];
    
  const filteredDocumentResults = selectedFilter === 'all' || selectedFilter === 'documents'
    ? searchResults
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-0 shadow-lg duration-200 sm:rounded-lg">
        <Command className="rounded-lg border-none" shouldFilter={false}>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              placeholder="Search documents, navigate, or run commands..."
              value={search}
              onValueChange={setSearch}
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
            {isSearching && (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            )}
          </div>

          <Command.List className="max-h-[400px] overflow-y-auto">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            {/* Filter Actions */}
            <Command.Group heading="Filters">
              {filterActions.filter(action => action.group === 'filters').map((action) => (
                <Command.Item
                  key={action.id}
                  value={action.id}
                  onSelect={() => handleSelect(action.action)}
                  className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-accent"
                >
                  <div className="flex items-center gap-2 flex-1">
                    {action.icon}
                    <span>{action.title}</span>
                  </div>
                  <Filter className="h-3 w-3 text-muted-foreground" />
                </Command.Item>
              ))}
            </Command.Group>

            {/* Action Commands */}
            {filterActions.filter(action => action.group === 'actions').length > 0 && (
              <Command.Group heading="Actions">
                {filterActions.filter(action => action.group === 'actions').map((action) => (
                  <Command.Item
                    key={action.id}
                    value={action.id}
                    onSelect={() => handleSelect(action.action)}
                    className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-accent"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      {action.icon}
                      <div>
                        <div className="font-medium">{action.title}</div>
                        {action.description && (
                          <div className="text-xs text-muted-foreground">{action.description}</div>
                        )}
                      </div>
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Navigation Actions */}
            {filteredNavigationActions.length > 0 && (
              <Command.Group heading="Navigation">
                {filteredNavigationActions.map((action) => (
                  <Command.Item
                    key={action.id}
                    value={action.id}
                    onSelect={() => handleSelect(action.action)}
                    className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-accent"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      {action.icon}
                      <div>
                        <div className="font-medium">{action.title}</div>
                        {action.description && (
                          <div className="text-xs text-muted-foreground">{action.description}</div>
                        )}
                      </div>
                    </div>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Admin Actions */}
            {filteredAdminActions.length > 0 && (
              <Command.Group heading="Admin">
                {filteredAdminActions.map((action) => (
                  <Command.Item
                    key={action.id}
                    value={action.id}
                    onSelect={() => handleSelect(action.action)}
                    className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-accent"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      {action.icon}
                      <div>
                        <div className="font-medium">{action.title}</div>
                        {action.description && (
                          <div className="text-xs text-muted-foreground">{action.description}</div>
                        )}
                      </div>
                    </div>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Document Results */}
            {filteredDocumentResults.length > 0 && (
              <Command.Group heading={search.trim() ? "Documents" : "Popular Documents"}>
                {filteredDocumentResults.map((result) => (
                  <Command.Item
                    key={result.slug}
                    value={result.slug}
                    onSelect={() => handleSelect(() => router.push(`/${locale}/docs/${result.slug}`))}
                    className="flex items-start gap-3 px-3 py-2 text-sm cursor-pointer hover:bg-accent"
                  >
                    <div className="mt-0.5 text-muted-foreground">
                      {getMatchIcon(result.matchType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium truncate">{result.title}</span>
                        {result.popular && (
                          <Star className="h-3 w-3 text-yellow-500 shrink-0" />
                        )}
                      </div>
                      {result.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {result.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Badge 
                        variant="secondary" 
                        className={cn("text-xs px-1.5 py-0.5", getComplexityColor(result.complexity))}
                      >
                        {result.complexity}
                      </Badge>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>

          <div className="flex items-center justify-between border-t px-3 py-2 text-xs text-muted-foreground">
            <div>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                ⌘K
              </kbd>
              {' '}to open
            </div>
            <div>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                ↑↓
              </kbd>
              {' '}to navigate
            </div>
            <div>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                ↵
              </kbd>
              {' '}to select
            </div>
          </div>
        </Command>
      </div>
    </div>
  );
}