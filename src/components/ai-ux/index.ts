// AI-UX Components Export Index
// Centralized exports for all AI-powered user experience components

export { SmartDocumentRecommendations } from './SmartDocumentRecommendations';
export { EnhancedFormWizard } from './EnhancedFormWizard';
export { ContentRichDocumentPage } from './ContentRichDocumentPage';
export { SEODocumentCompletionFlow } from './SEODocumentCompletionFlow';

// Export types for TypeScript support
export type {
  DocumentRecommendation,
  SmartRecommendationsProps,
} from './SmartDocumentRecommendations';

export type {
  FormField,
  FormStep,
  EnhancedFormWizardProps,
} from './EnhancedFormWizard';

export type {
  DocumentMetadata,
  StateRequirement,
  ContentRichDocumentPageProps,
} from './ContentRichDocumentPage';

export type {
  CompletedDocument,
  SEODocumentCompletionFlowProps,
} from './SEODocumentCompletionFlow';

// AI Conversion Optimizer exports
export {
  aiConversionOptimizer,
  trackUserAction,
  getPersonalizedExperience,
  optimizeForSEO,
} from '../lib/ai-conversion-optimizer';

// Component combinations for common use cases
export const AIUXComponents = {
  SmartDocumentRecommendations,
  EnhancedFormWizard,
  ContentRichDocumentPage,
  SEODocumentCompletionFlow,
};

// Utility functions for AI-UX integration
export const createAIUXExperience = (
  userId: string,
  pageType: string,
  documentType?: string,
) => {
  const personalizedContent = getPersonalizedExperience(userId, pageType);
  const optimizations = optimizeForSEO(pageType);

  return {
    personalizedContent,
    optimizations,
    trackAction: (action: string, data?: any) =>
      trackUserAction(userId, action, data),
  };
};

// AI-UX Configuration
export const AI_UX_CONFIG = {
  // Performance thresholds
  PERFORMANCE_THRESHOLDS: {
    MOBILE_CTA_SIZE: 44, // Minimum touch target size
    MAX_FORM_FIELDS_MOBILE: 5, // Max fields per mobile step
    MIN_CONVERSION_RATE: 0.02, // 2% minimum conversion rate
    MAX_BOUNCE_RATE: 0.6, // 60% maximum bounce rate
    MIN_TIME_ON_PAGE: 30000, // 30 seconds minimum
  },

  // SEO optimization targets
  SEO_TARGETS: {
    MIN_CTR: 0.03, // 3% minimum click-through rate
    TARGET_POSITION: 3, // Target average position in search results
    MIN_PAGE_SPEED: 90, // Minimum PageSpeed score
    TARGET_CORE_WEB_VITALS: {
      LCP: 2500, // Largest Contentful Paint (ms)
      FID: 100, // First Input Delay (ms)
      CLS: 0.1, // Cumulative Layout Shift
    },
  },

  // AI model confidence thresholds
  AI_CONFIDENCE: {
    RECOMMENDATION_MIN: 0.6, // 60% minimum confidence for recommendations
    PERSONALIZATION_MIN: 0.7, // 70% minimum for personalized content
    OPTIMIZATION_MIN: 0.8, // 80% minimum for automatic optimizations
  },
};

// Component performance monitoring
export const monitorAIUXPerformance = () => {
  const metrics = aiConversionOptimizer.getPerformanceMetrics();

  return {
    ...metrics,
    healthScore: calculateHealthScore(metrics),
    recommendations: generatePerformanceRecommendations(metrics),
  };
};

const calculateHealthScore = (metrics: any): number => {
  const { averageLift, seoImpactScore, totalOptimizations } = metrics;

  // Weighted health score calculation
  const liftScore = Math.min(averageLift / 30, 1) * 40; // 40% weight
  const seoScore = seoImpactScore * 0.3; // 30% weight
  const activityScore = Math.min(totalOptimizations / 10, 1) * 30; // 30% weight

  return Math.round(liftScore + seoScore + activityScore);
};

const generatePerformanceRecommendations = (metrics: any): string[] => {
  const recommendations: string[] = [];

  if (metrics.averageLift < 20) {
    recommendations.push(
      'Increase optimization aggressiveness - average lift below 20%',
    );
  }

  if (metrics.seoImpactScore < 80) {
    recommendations.push(
      'Focus on SEO-positive optimizations to improve search performance',
    );
  }

  if (metrics.totalOptimizations < 5) {
    recommendations.push(
      'Implement more AI-powered optimizations for better results',
    );
  }

  return recommendations;
};
