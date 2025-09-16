// Intelligent Preloading System
// Predictively loads resources based on user behavior and route analysis

'use client';

import React from 'react';
import { preloadFirebaseModules } from '@/lib/firebase-dynamic';

interface PreloadConfig {
  routes: string[];
  priority: 'high' | 'medium' | 'low';
  modules: ('firebase' | 'pdf' | 'forms' | 'search')[];
  conditions?: {
    userAction?: string;
    timeDelay?: number;
    probability?: number;
  };
}

interface UserSession {
  visitedRoutes: string[];
  timeSpent: Record<string, number>;
  interactions: string[];
  preferredDocumentTypes: string[];
}

class IntelligentPreloader {
  private userSession: UserSession = {
    visitedRoutes: [],
    timeSpent: {},
    interactions: [],
    preferredDocumentTypes: []
  };

  private preloadQueue: Set<string> = new Set();
  private preloadedModules: Set<string> = new Set();

  // Common navigation patterns
  private readonly PRELOAD_PATTERNS: PreloadConfig[] = [
    {
      routes: ['/documents'],
      priority: 'high',
      modules: ['firebase', 'search'],
      conditions: {
        userAction: 'hover',
        timeDelay: 100,
        probability: 0.8
      }
    },
    {
      routes: ['/documents/vehicle-bill-of-sale', '/documents/power-of-attorney'],
      priority: 'high',
      modules: ['firebase', 'pdf', 'forms'],
      conditions: {
        userAction: 'documentSelect',
        timeDelay: 0,
        probability: 0.9
      }
    },
    {
      routes: ['/dashboard'],
      priority: 'medium',
      modules: ['firebase'],
      conditions: {
        userAction: 'login',
        timeDelay: 500,
        probability: 0.7
      }
    },
    {
      routes: ['/search'],
      priority: 'medium',
      modules: ['search', 'firebase'],
      conditions: {
        userAction: 'searchFocus',
        timeDelay: 200,
        probability: 0.6
      }
    }
  ];

  /**
   * Initialize preloader with user session tracking
   */
  initialize() {
    this.trackUserSession();
    this.setupIntersectionObserver();
    this.setupHoverPreloading();
    this.setupIdleTimePreloading();

    // Load critical modules immediately if conditions are met
    this.preloadCriticalModules();
  }

  /**
   * Track user navigation patterns
   */
  private trackUserSession() {
    const currentPath = window.location.pathname;

    if (!this.userSession.visitedRoutes.includes(currentPath)) {
      this.userSession.visitedRoutes.push(currentPath);
    }

    // Track time spent on page
    const startTime = Date.now();
    const updateTimeSpent = () => {
      const timeSpent = Date.now() - startTime;
      this.userSession.timeSpent[currentPath] =
        (this.userSession.timeSpent[currentPath] || 0) + timeSpent;
    };

    window.addEventListener('beforeunload', updateTimeSpent);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) updateTimeSpent();
    });
  }

  /**
   * Preload modules based on viewport intersection
   */
  private setupIntersectionObserver() {
    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const route = element.dataset.preloadRoute;

            if (route) {
              this.schedulePreload(route, 'medium');
            }
          }
        });
      },
      { rootMargin: '100px' }
    );

    // Observe elements with preload attributes
    document.querySelectorAll('[data-preload-route]').forEach((el) => {
      observer.observe(el);
    });
  }

  /**
   * Preload on hover with intelligent debouncing
   */
  private setupHoverPreloading() {
    let hoverTimeout: NodeJS.Timeout;

    document.addEventListener('mouseover', (e) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;

      if (link && link.href) {
        clearTimeout(hoverTimeout);

        hoverTimeout = setTimeout(() => {
          const probability = this.calculatePreloadProbability(link.href);

          if (probability > 0.5) {
            this.schedulePreload(link.href, 'high');
          }
        }, 100);
      }
    });

    document.addEventListener('mouseout', () => {
      clearTimeout(hoverTimeout);
    });
  }

  /**
   * Preload during idle time
   */
  private setupIdleTimePreloading() {
    let idleTimer: NodeJS.Timeout;

    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        this.preloadIdleResources();
      }, 2000); // 2 seconds of inactivity
    };

    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(
      (event) => {
        document.addEventListener(event, resetIdleTimer, true);
      }
    );

    resetIdleTimer();
  }

  /**
   * Calculate probability of user navigating to a route
   */
  private calculatePreloadProbability(route: string): number {
    let probability = 0.3; // Base probability

    // Increase probability based on previous visits
    if (this.userSession.visitedRoutes.includes(route)) {
      probability += 0.4;
    }

    // Increase based on time spent on similar routes
    const similarRoutes = this.userSession.visitedRoutes.filter(r =>
      r.includes(route.split('/')[1])
    );

    if (similarRoutes.length > 0) {
      const avgTimeSpent = similarRoutes.reduce((sum, r) =>
        sum + (this.userSession.timeSpent[r] || 0), 0
      ) / similarRoutes.length;

      if (avgTimeSpent > 30000) { // 30 seconds
        probability += 0.2;
      }
    }

    // Check against known patterns
    const pattern = this.PRELOAD_PATTERNS.find(p =>
      p.routes.some(r => route.includes(r))
    );

    if (pattern?.conditions?.probability) {
      probability = Math.max(probability, pattern.conditions.probability);
    }

    return Math.min(probability, 1);
  }

  /**
   * Schedule resource preloading
   */
  private async schedulePreload(route: string, priority: 'high' | 'medium' | 'low' = 'medium') {
    if (this.preloadQueue.has(route)) return;

    this.preloadQueue.add(route);

    const pattern = this.PRELOAD_PATTERNS.find(p =>
      p.routes.some(r => route.includes(r))
    );

    if (pattern) {
      const delay = priority === 'high' ? 0 : priority === 'medium' ? 100 : 500;

      setTimeout(() => {
        this.preloadModules(pattern.modules);
        this.preloadRoute(route);
      }, delay);
    }
  }

  /**
   * Preload specific modules
   */
  private async preloadModules(modules: string[]) {
    const promises: Promise<any>[] = [];

    for (const module of modules) {
      if (this.preloadedModules.has(module)) continue;

      this.preloadedModules.add(module);

      switch (module) {
        case 'firebase':
          promises.push(preloadFirebaseModules(['app', 'firestore', 'auth']));
          break;

        case 'pdf':
          promises.push(import('@/lib/pdf/pdf-service'));
          break;

        case 'forms':
          promises.push(import('@/components/forms/DynamicForm'));
          break;

        case 'search':
          promises.push(import('@/services/vectorSearch'));
          break;
      }
    }

    try {
      await Promise.all(promises);
      console.log(`✓ Preloaded modules: ${modules.join(', ')}`);
    } catch (error) {
      console.warn('Failed to preload modules:', error);
    }
  }

  /**
   * Preload route resources
   */
  private preloadRoute(route: string) {
    // Create invisible link and trigger Next.js prefetch
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    link.as = 'document';

    document.head.appendChild(link);

    // Remove after a delay to clean up
    setTimeout(() => {
      document.head.removeChild(link);
    }, 5000);
  }

  /**
   * Preload critical modules immediately
   */
  private async preloadCriticalModules() {
    const currentPath = window.location.pathname;

    // Always preload Firebase for authenticated areas
    if (currentPath.includes('/dashboard') || currentPath.includes('/documents')) {
      await this.preloadModules(['firebase']);
    }

    // Preload PDF modules for document creation routes
    if (currentPath.includes('/documents/') && !currentPath.endsWith('/documents')) {
      await this.preloadModules(['pdf', 'forms']);
    }

    // Preload search modules for pages with search functionality
    if (currentPath.includes('/documents') || currentPath.includes('/templates')) {
      await this.preloadModules(['search']);
    }
  }

  /**
   * Preload resources during idle time
   */
  private async preloadIdleResources() {
    const currentPath = window.location.pathname;

    // Predict likely next routes based on current context
    const likelyRoutes = this.predictNextRoutes(currentPath);

    for (const route of likelyRoutes.slice(0, 3)) { // Limit to top 3
      await this.schedulePreload(route, 'low');
    }
  }

  /**
   * Predict likely next routes based on current context
   */
  private predictNextRoutes(currentPath: string): string[] {
    const predictions: string[] = [];

    if (currentPath === '/') {
      predictions.push('/documents', '/dashboard', '/templates');
    } else if (currentPath === '/documents') {
      predictions.push('/documents/vehicle-bill-of-sale', '/documents/power-of-attorney');
    } else if (currentPath.includes('/documents/')) {
      predictions.push('/dashboard', '/documents');
    } else if (currentPath === '/dashboard') {
      predictions.push('/documents', '/templates');
    }

    // Add previously visited routes
    predictions.push(...this.userSession.visitedRoutes.slice(-3));

    // Remove duplicates and current path
    return [...new Set(predictions)].filter(route => route !== currentPath);
  }

  /**
   * Get preloading analytics
   */
  getAnalytics() {
    return {
      session: this.userSession,
      preloadedModules: Array.from(this.preloadedModules),
      queueSize: this.preloadQueue.size,
      predictions: this.predictNextRoutes(window.location.pathname)
    };
  }

  /**
   * Clear preload cache
   */
  clearCache() {
    this.preloadQueue.clear();
    this.preloadedModules.clear();
  }
}

// Singleton instance
export const intelligentPreloader = new IntelligentPreloader();

/**
 * React hook for intelligent preloading
 */
export function useIntelligentPreloader() {
  React.useEffect(() => {
    intelligentPreloader.initialize();
  }, []);

  return {
    preload: (route: string, priority?: 'high' | 'medium' | 'low') =>
      intelligentPreloader.schedulePreload(route, priority),
    analytics: intelligentPreloader.getAnalytics(),
    clearCache: intelligentPreloader.clearCache
  };
}

/**
 * HOC to add preloading to components
 */
export function withPreloading<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  config: { modules?: string[]; routes?: string[] }
) {
  return function PreloadingComponent(props: T) {
    React.useEffect(() => {
      if (config.modules) {
        intelligentPreloader.preloadModules(config.modules);
      }

      if (config.routes) {
        config.routes.forEach(route => {
          intelligentPreloader.schedulePreload(route, 'medium');
        });
      }
    }, []);

    return React.createElement(Component, props);
  };
}

export default intelligentPreloader;
