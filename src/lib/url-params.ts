/**
 * URL Parameter utilities for shareable search filters and states
 * Enables Shopify-level productivity through URL-based state management
 */

export interface SearchParams {
  q?: string; // Search query
  filter?: string; // Filter type (documents, navigation, admin)
  category?: string; // Document category filter
  complexity?: string; // Complexity filter (easy, medium, advanced)
  role?: string; // Role-based filter
  sort?: string; // Sort order (relevance, popular, recent)
  view?: string; // View mode (list, grid, compact)
}

/**
 * Parse URL search parameters into a SearchParams object
 */
export function parseSearchParams(
  searchParams: URLSearchParams | string,
): SearchParams {
  const params =
    typeof searchParams === 'string'
      ? new URLSearchParams(searchParams)
      : searchParams;

  return {
    q: params.get('q') || undefined,
    filter: params.get('filter') || undefined,
    category: params.get('category') || undefined,
    complexity: params.get('complexity') || undefined,
    role: params.get('role') || undefined,
    sort: params.get('sort') || undefined,
    view: params.get('view') || undefined,
  };
}

/**
 * Convert SearchParams object to URL search string
 */
export function buildSearchParams(params: SearchParams): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, value);
    }
  });

  const paramString = searchParams.toString();
  return paramString ? `?${paramString}` : '';
}

/**
 * Update current URL with new search parameters
 */
export function updateUrlParams(
  params: Partial<SearchParams>,
  options: {
    replace?: boolean;
    preserveExisting?: boolean;
  } = {},
) {
  if (typeof window === 'undefined') return;

  const { replace = false, preserveExisting = true } = options;

  let currentParams: SearchParams = {};

  if (preserveExisting) {
    currentParams = parseSearchParams(window.location.search);
  }

  const newParams = { ...currentParams, ...params };
  const newUrl = `${window.location.pathname}${buildSearchParams(newParams)}`;

  if (replace) {
    window.history.replaceState({}, '', newUrl);
  } else {
    window.history.pushState({}, '', newUrl);
  }
}

/**
 * Get current search parameters from URL
 */
export function getCurrentSearchParams(): SearchParams {
  if (typeof window === 'undefined') return {};
  return parseSearchParams(window.location.search);
}

/**
 * Create a shareable URL for current search state
 */
export function createShareableUrl(
  params: SearchParams,
  baseUrl?: string,
): string {
  const base =
    baseUrl ||
    (typeof window !== 'undefined'
      ? window.location.origin + window.location.pathname
      : '');
  return `${base}${buildSearchParams(params)}`;
}

/**
 * Validate search parameters
 */
export function validateSearchParams(params: SearchParams): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (
    params.filter &&
    !['documents', 'navigation', 'admin', 'all'].includes(params.filter)
  ) {
    errors.push('Invalid filter type');
  }

  if (
    params.complexity &&
    !['easy', 'medium', 'advanced'].includes(params.complexity)
  ) {
    errors.push('Invalid complexity level');
  }

  if (
    params.sort &&
    !['relevance', 'popular', 'recent', 'alphabetical'].includes(params.sort)
  ) {
    errors.push('Invalid sort order');
  }

  if (params.view && !['list', 'grid', 'compact'].includes(params.view)) {
    errors.push('Invalid view mode');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generate analytics-friendly parameter object
 */
export function getAnalyticsParams(params: SearchParams) {
  return {
    search_query: params.q || '',
    search_filter: params.filter || 'all',
    search_category: params.category || '',
    search_complexity: params.complexity || '',
    search_sort: params.sort || 'relevance',
    search_view: params.view || 'list',
    has_filters: !!(params.filter || params.category || params.complexity),
    param_count: Object.values(params).filter((v) => v !== undefined).length,
  };
}

/**
 * Create preset filter URLs for common use cases
 */
export const presetFilters = {
  popularDocuments: (baseUrl?: string) =>
    createShareableUrl(
      {
        filter: 'documents',
        sort: 'popular',
      },
      baseUrl,
    ),

  easyDocuments: (baseUrl?: string) =>
    createShareableUrl(
      {
        filter: 'documents',
        complexity: 'easy',
      },
      baseUrl,
    ),

  adminActions: (baseUrl?: string) =>
    createShareableUrl(
      {
        filter: 'admin',
      },
      baseUrl,
    ),

  recentActivity: (baseUrl?: string) =>
    createShareableUrl(
      {
        sort: 'recent',
      },
      baseUrl,
    ),
};

/**
 * Hook for managing URL parameters in React components
 */
export function useUrlParams() {
  if (typeof window === 'undefined') {
    return {
      params: {},
      updateParams: () => {},
      clearParams: () => {},
      shareUrl: '',
    };
  }

  const params = getCurrentSearchParams();

  const updateParams = (newParams: Partial<SearchParams>, replace = false) => {
    updateUrlParams(newParams, { replace, preserveExisting: true });
  };

  const clearParams = () => {
    updateUrlParams({}, { replace: true, preserveExisting: false });
  };

  const shareUrl = createShareableUrl(params);

  return {
    params,
    updateParams,
    clearParams,
    shareUrl,
  };
}
