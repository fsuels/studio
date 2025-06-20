// src/lib/taxonomy-analytics.ts
interface TaxonomyEvent {
  event: string;
  properties: Record<string, any>;
  timestamp: number;
  sessionId: string;
  userId?: string;
}

interface SearchAnalytics {
  query: string;
  resultsCount: number;
  selectedResult?: string;
  selectedPosition?: number;
  matchTypes: string[];
  searchDuration: number;
  userRole?: string;
}

interface NavigationAnalytics {
  situationKey?: string;
  categoryKey?: string;
  documentSlug?: string;
  source: 'mega-menu' | 'search' | 'situation-group' | 'role-quick-access';
  userRole?: string;
}

class TaxonomyAnalytics {
  private sessionId: string;
  private userId?: string;
  private events: TaxonomyEvent[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadUserId();
  }

  // Track search behavior
  trackSearch(analytics: SearchAnalytics): void {
    this.track('taxonomy_search', {
      query: analytics.query,
      results_count: analytics.resultsCount,
      search_duration_ms: analytics.searchDuration,
      match_types: analytics.matchTypes,
      user_role: analytics.userRole,
      has_results: analytics.resultsCount > 0
    });
  }

  trackSearchResult(analytics: SearchAnalytics & { selectedResult: string; selectedPosition: number }): void {
    this.track('taxonomy_search_result_clicked', {
      query: analytics.query,
      selected_document: analytics.selectedResult,
      position: analytics.selectedPosition,
      total_results: analytics.resultsCount,
      user_role: analytics.userRole
    });
  }

  // Track navigation patterns
  trackNavigation(analytics: NavigationAnalytics): void {
    this.track('taxonomy_navigation', {
      situation_key: analytics.situationKey,
      category_key: analytics.categoryKey,
      document_slug: analytics.documentSlug,
      source: analytics.source,
      user_role: analytics.userRole
    });
  }

  // Track role selection and changes
  trackRoleSelection(previousRole: string | null, newRole: string | null): void {
    this.track('taxonomy_role_changed', {
      previous_role: previousRole,
      new_role: newRole,
      is_first_selection: !previousRole
    });
  }

  // Track mega menu interactions
  trackMegaMenuInteraction(action: 'open' | 'close' | 'situation_expand' | 'quick_access_click', details?: Record<string, any>): void {
    this.track('taxonomy_mega_menu', {
      action,
      ...details
    });
  }

  // Track document metadata loading performance
  trackMetadataPerformance(slug: string, loadTime: number, fromCache: boolean, error?: boolean): void {
    this.track('taxonomy_metadata_performance', {
      document_slug: slug,
      load_time_ms: loadTime,
      from_cache: fromCache,
      error: error || false
    });
  }

  // Track feature usage
  trackFeatureUsage(feature: string, enabled: boolean, details?: Record<string, any>): void {
    this.track('taxonomy_feature_usage', {
      feature,
      enabled,
      ...details
    });
  }

  // Core tracking method
  private track(event: string, properties: Record<string, any>): void {
    const taxonomyEvent: TaxonomyEvent = {
      event,
      properties,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId
    };

    this.events.push(taxonomyEvent);

    // Send to analytics service (replace with your analytics provider)
    this.sendToAnalytics(taxonomyEvent);

    // Store locally for offline analysis
    this.storeLocally(taxonomyEvent);
  }

  private async sendToAnalytics(event: TaxonomyEvent): Promise<void> {
    try {
      // Replace with your analytics provider (Google Analytics, Mixpanel, etc.)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', event.event, {
          custom_parameter_sessionId: event.sessionId,
          custom_parameter_userId: event.userId,
          ...event.properties
        });
      }

      // Send to your backend analytics endpoint
      await fetch('/api/analytics/taxonomy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      }).catch(() => {
        // Fail silently for analytics
      });
    } catch (error) {
      // Analytics should never break the app
      console.warn('Analytics tracking failed:', error);
    }
  }

  private storeLocally(event: TaxonomyEvent): void {
    try {
      const stored = localStorage.getItem('taxonomy_analytics') || '[]';
      const events = JSON.parse(stored);
      events.push(event);

      // Keep only last 100 events locally
      if (events.length > 100) {
        events.splice(0, events.length - 100);
      }

      localStorage.setItem('taxonomy_analytics', JSON.stringify(events));
    } catch (error) {
      // Local storage might be full or unavailable
    }
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadUserId(): void {
    try {
      this.userId = localStorage.getItem('userId') || undefined;
    } catch (error) {
      // localStorage not available
    }
  }

  // Get analytics summary for debugging
  getAnalyticsSummary(): {
    sessionId: string;
    eventsCount: number;
    recentEvents: TaxonomyEvent[];
  } {
    return {
      sessionId: this.sessionId,
      eventsCount: this.events.length,
      recentEvents: this.events.slice(-10)
    };
  }

  // Export events for analysis
  exportEvents(): TaxonomyEvent[] {
    return [...this.events];
  }
}

// Singleton instance
export const taxonomyAnalytics = new TaxonomyAnalytics();

// Convenience functions for common tracking
export const trackSearch = (analytics: SearchAnalytics) => taxonomyAnalytics.trackSearch(analytics);
export const trackSearchResult = (analytics: SearchAnalytics & { selectedResult: string; selectedPosition: number }) => 
  taxonomyAnalytics.trackSearchResult(analytics);
export const trackNavigation = (analytics: NavigationAnalytics) => taxonomyAnalytics.trackNavigation(analytics);
export const trackRoleSelection = (prev: string | null, next: string | null) => 
  taxonomyAnalytics.trackRoleSelection(prev, next);
export const trackMegaMenu = (action: 'open' | 'close' | 'situation_expand' | 'quick_access_click', details?: Record<string, any>) => 
  taxonomyAnalytics.trackMegaMenuInteraction(action, details);

export default taxonomyAnalytics;